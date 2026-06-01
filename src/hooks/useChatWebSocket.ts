import { useEffect, useRef, useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CHAT_WS_URL } from '../config/api.config';
import { API_ENDPOINTS } from '../config/api.config';
import { useChatToastStore } from '../store/chatToastStore';

type MessageHandler = (data: unknown) => void;

const RECONNECT_BASE_MS = 2000;
const RECONNECT_MIN_INTERVAL_MS = 2000;
const RECONNECT_MAX_MS = 30000;
const RECONNECT_ATTEMPTS_MAX = 10;
const TOKEN_REFRESH_INTERVAL_MS = 3.5 * 60 * 1000;
const TYPING_THROTTLE_MS = 2000;
const TYPING_STOP_DELAY_MS = 3000;
const TYPING_TIMEOUT_MS = 5000;

export interface TypingUser {
  userId: string;
  email: string;
}

export function useChatToken(enabled = true) {
  const qc = useQueryClient();
  const result = useQuery({
    queryKey: ['chat', 'token'],
    queryFn: getChatTokenForWs,
    enabled,
    staleTime: 4 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => {
      qc.invalidateQueries({ queryKey: ['chat', 'token'] });
    }, TOKEN_REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [enabled, qc]);

  return result;
}

export function useChatWebSocket(
  token: string | null,
  conversationId: string | null,
  _currentUserId: string,
  onNewMessage?: MessageHandler
) {
  const wsRef = useRef<WebSocket | null>(null);
  const tokenRef = useRef<string | null>(null);
  tokenRef.current = token;
  // Kept in a ref so the stable connect()/reconnect logic always sees the
  // currently-open conversation without being torn down on every switch.
  const conversationIdRef = useRef<string | null>(conversationId);
  conversationIdRef.current = conversationId;
  const reconnectAttemptRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, TypingUser[]>>({});

  // Typing indicator timers
  const typingTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const lastTypingSentRef = useRef<number>(0);
  const typingStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear typing user after timeout
  const removeTypingUser = useCallback((convId: string, userId: string) => {
    const timerKey = `${convId}:${userId}`;
    const timer = typingTimersRef.current.get(timerKey);
    if (timer) {
      clearTimeout(timer);
      typingTimersRef.current.delete(timerKey);
    }
    setTypingUsers((prev) => {
      const current = prev[convId];
      if (!current) return prev;
      const filtered = current.filter((u) => u.userId !== userId);
      if (filtered.length === 0) {
        const { [convId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [convId]: filtered };
    });
  }, []);

  const addTypingUser = useCallback(
    (convId: string, user: TypingUser) => {
      const timerKey = `${convId}:${user.userId}`;

      // Clear existing timer for this user
      const existing = typingTimersRef.current.get(timerKey);
      if (existing) clearTimeout(existing);

      // Auto-remove after timeout
      typingTimersRef.current.set(
        timerKey,
        setTimeout(() => removeTypingUser(convId, user.userId), TYPING_TIMEOUT_MS)
      );

      setTypingUsers((prev) => {
        const current = prev[convId] ?? [];
        if (current.some((u) => u.userId === user.userId)) return prev;
        return { ...prev, [convId]: [...current, user] };
      });
    },
    [removeTypingUser]
  );

  // Single, stable handler for every inbound frame. Bound directly on the
  // socket the instant it is created (see connect) so no frame can arrive
  // before a listener exists.
  const handleSocketMessage = useCallback(
    (ev: MessageEvent) => {
      try {
        const msg = JSON.parse(ev.data as string);
        switch (msg.type) {
          case 'new_message':
            if (msg.data && onNewMessage) onNewMessage(msg.data);
            break;
          case 'user_typing':
            if (msg.data) {
              addTypingUser(msg.data.conversationId, {
                userId: msg.data.userId,
                email: msg.data.email,
              });
            }
            break;
          case 'user_typing_stop':
            if (msg.data) removeTypingUser(msg.data.conversationId, msg.data.userId);
            break;
          case 'messages_read':
            if (msg.data) {
              queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
            }
            break;
          case 'message_failed':
            if (msg.data?.conversationId && (msg.data?.clientId || msg.data?.messageId)) {
              queryClient.setQueryData<any[]>(
                ['chat', 'messages', msg.data.conversationId],
                (old) => {
                  if (!old) return old;
                  return old.map((x) =>
                    x.clientId === msg.data.clientId || x.id === msg.data.messageId
                      ? { ...x, pending: false, failed: true }
                      : x
                  );
                }
              );
            }
            useChatToastStore.getState().showError('Message failed to send. Please retry.');
            break;
          case 'message_retracted':
            // The message was delivered in real time but ultimately could not be
            // persisted — remove it everywhere so no client shows a phantom.
            if (msg.data?.conversationId && (msg.data?.messageId || msg.data?.clientId)) {
              let wasMine = false;
              queryClient.setQueryData<any[]>(
                ['chat', 'messages', msg.data.conversationId],
                (old) => {
                  if (!old) return old;
                  return old.filter((x) => {
                    const match = x.id === msg.data.messageId || x.clientId === msg.data.clientId;
                    if (match && x.senderId === _currentUserId) wasMine = true;
                    return !match;
                  });
                }
              );
              if (wasMine) {
                useChatToastStore.getState().showError(msg.error || 'Message failed to send. Please retry.');
              }
            }
            break;
          case 'error':
            if (msg.error) console.warn('[WS] Server error:', msg.error);
            break;
          // connected, joined, left are acknowledgements - no action needed
        }
      } catch {
        // ignore parse errors
      }
    },
    [onNewMessage, addTypingUser, removeTypingUser, queryClient, _currentUserId]
  );

  const connect = useCallback(() => {
    const t = tokenRef.current;
    if (!t) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const url = `${CHAT_WS_URL}/ws?token=${encodeURIComponent(t)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;
    ws.onmessage = handleSocketMessage;

    ws.onopen = () => {
      const wasReconnect = reconnectAttemptRef.current > 0;
      reconnectAttemptRef.current = 0;
      setIsConnected(true);

      // After a dropped connection we may have missed broadcasts while offline.
      // Backfill the active conversation and the list from the server.
      if (wasReconnect) {
        queryClient.invalidateQueries({ queryKey: ['chat', 'conversations'] });
        if (conversationIdRef.current) {
          queryClient.invalidateQueries({
            queryKey: ['chat', 'messages', conversationIdRef.current],
          });
        }
      }
    };

    ws.onclose = (ev) => {
      setIsConnected(false);
      wsRef.current = null;

      if (ev.code === 1006 || ev.code === 1008) {
        useChatToastStore.getState().showInfo('Connection lost. Reconnecting...');
      }

      if (reconnectAttemptRef.current < RECONNECT_ATTEMPTS_MAX && tokenRef.current) {
        const delay = Math.max(
          RECONNECT_MIN_INTERVAL_MS,
          Math.min(
            RECONNECT_BASE_MS * Math.pow(2, reconnectAttemptRef.current),
            RECONNECT_MAX_MS
          )
        );
        reconnectAttemptRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ['chat', 'token'] });
          connect();
        }, delay);
      } else if (reconnectAttemptRef.current >= RECONNECT_ATTEMPTS_MAX) {
        useChatToastStore.getState().showError('Unable to reconnect. Please refresh the page.');
      }
    };

    ws.onerror = () => {};
  }, [queryClient, handleSocketMessage]);

  useEffect(() => {
    if (token) connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      reconnectAttemptRef.current = RECONNECT_ATTEMPTS_MAX;
    };
  }, [token, connect]);

  // Join/leave conversation
  useEffect(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !conversationId) return;
    wsRef.current.send(
      JSON.stringify({ type: 'join', conversationId, timestamp: Date.now() })
    );
    return () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({ type: 'leave', conversationId, timestamp: Date.now() })
        );
      }
    };
  }, [conversationId, isConnected]);

  const sendMessage = useCallback((content: string, targetConvId?: string, clientId?: string) => {
    const convId = targetConvId ?? conversationId;
    if (!convId || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return false;

    wsRef.current.send(
      JSON.stringify({
        type: 'message',
        conversationId: convId,
        content,
        clientId,
        timestamp: Date.now(),
      })
    );
    return true;
  }, [conversationId]);

  // Send typing indicator (throttled)
  const sendTyping = useCallback((targetConvId?: string) => {
    const convId = targetConvId ?? conversationId;
    if (!convId || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const now = Date.now();
    if (now - lastTypingSentRef.current < TYPING_THROTTLE_MS) return;
    lastTypingSentRef.current = now;

    wsRef.current.send(
      JSON.stringify({ type: 'typing', conversationId: convId, timestamp: now })
    );

    // Auto send typing_stop after delay
    if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
    typingStopTimerRef.current = setTimeout(() => {
      sendTypingStop(convId);
    }, TYPING_STOP_DELAY_MS);
  }, [conversationId]);

  const sendTypingStop = useCallback((targetConvId?: string) => {
    const convId = targetConvId ?? conversationId;
    if (!convId || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    if (typingStopTimerRef.current) {
      clearTimeout(typingStopTimerRef.current);
      typingStopTimerRef.current = null;
    }
    lastTypingSentRef.current = 0;

    wsRef.current.send(
      JSON.stringify({ type: 'typing_stop', conversationId: convId, timestamp: Date.now() })
    );
  }, [conversationId]);

  // Cleanup typing timers on unmount
  useEffect(() => {
    return () => {
      typingTimersRef.current.forEach((timer) => clearTimeout(timer));
      typingTimersRef.current.clear();
      if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
    };
  }, []);

  return { sendMessage, sendTyping, sendTypingStop, isConnected, typingUsers };
}

async function getChatTokenForWs(): Promise<string> {
  try {
    const res = await fetch(API_ENDPOINTS.AUTH.CHAT_TOKEN, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) {
      useChatToastStore.getState().showError('Failed to connect to chat. Please refresh the page.');
      throw new Error('Failed to get chat token');
    }
    const data = await res.json();
    const t = data.token;
    if (!t || typeof t !== 'string') {
      useChatToastStore.getState().showError('Invalid chat token. Please refresh the page.');
      throw new Error('Invalid chat token');
    }
    return t;
  } catch (err) {
    if (err instanceof Error && err.message !== 'Failed to get chat token' && err.message !== 'Invalid chat token') {
      useChatToastStore.getState().showError('Failed to connect to chat. Please refresh the page.');
    }
    throw err;
  }
}
