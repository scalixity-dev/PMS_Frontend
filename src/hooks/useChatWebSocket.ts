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
  const reconnectAttemptRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    const t = tokenRef.current;
    if (!t) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const url = `${CHAT_WS_URL}/ws?token=${encodeURIComponent(t)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectAttemptRef.current = 0;
      setIsConnected(true);
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
  }, [queryClient]);

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

  useEffect(() => {
    const ws = wsRef.current;
    if (!ws) return;
    const handler = (ev: MessageEvent) => {
      try {
        const msg = JSON.parse(ev.data as string);
        if (msg.type === 'new_message' && msg.data && onNewMessage) {
          onNewMessage(msg.data);
        }
      } catch {}
    };
    ws.addEventListener('message', handler);
    return () => ws.removeEventListener('message', handler);
  }, [onNewMessage]);

  const sendMessage = useCallback((content: string, targetConvId?: string) => {
    const convId = targetConvId ?? conversationId;
    if (!convId || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return false;

    wsRef.current.send(
      JSON.stringify({
        type: 'message',
        conversationId: convId,
        content,
        timestamp: Date.now(),
      })
    );
    return true;
  }, [conversationId]);

  return { sendMessage, isConnected };
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
