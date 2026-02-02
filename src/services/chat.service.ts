import { API_ENDPOINTS } from '../config/api.config';
import { useChatToastStore } from '../store/chatToastStore';

let cachedToken: string | null = null;
let tokenFetchPromise: Promise<string> | null = null;

async function getChatToken(forceRefresh = false): Promise<string> {
  if (cachedToken && !forceRefresh) return cachedToken;
  if (tokenFetchPromise && !forceRefresh) return tokenFetchPromise;

  tokenFetchPromise = (async () => {
    const res = await fetch(API_ENDPOINTS.AUTH.CHAT_TOKEN, {
      method: 'GET',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to get chat token');
    const data = await res.json();
    const t = data.token;
    if (!t || typeof t !== 'string') throw new Error('Invalid chat token');
    cachedToken = t;
    return t;
  })();

  try {
    return await tokenFetchPromise;
  } finally {
    tokenFetchPromise = null;
  }
}

export function invalidateChatToken(): void {
  cachedToken = null;
  tokenFetchPromise = null;
}

async function chatFetch(
  url: string,
  options: RequestInit & { token?: string; _retry?: boolean } = {}
): Promise<Response> {
  const { token, _retry, ...init } = options;
  const t = token ?? (await getChatToken());

  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${t}`,
      ...init.headers,
    },
    credentials: 'omit',
  });

  if (res.status === 401 && !_retry) {
    invalidateChatToken();
    try {
      const freshToken = await getChatToken(true);
      return chatFetch(url, { ...options, token: freshToken, _retry: true });
    } catch {
      useChatToastStore.getState().showError('Session expired. Please refresh the page.');
      throw new Error('Failed to refresh session');
    }
  }

  if (!res.ok && _retry) {
    useChatToastStore.getState().showError('Failed to load. Please refresh the page.');
  }

  return res;
}

export interface ChatParticipant {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  joinedAt: string;
  lastReadAt?: string | null;
}

export interface ChatConversation {
  id: string;
  type: string;
  name?: string | null;
  createdAt: string;
  updatedAt: string;
  participants: ChatParticipant[];
  lastMessage?: {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
  } | null;
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: string;
  createdAt: string;
  sender: {
    id: string;
    email: string;
    displayName: string;
  };
}

export async function getConversations(token?: string): Promise<ChatConversation[]> {
  const res = await chatFetch(API_ENDPOINTS.CHAT.CONVERSATIONS, { token });
  if (!res.ok) throw new Error('Failed to fetch conversations');
  return res.json();
}

export async function createConversation(
  participantUserId: string,
  participantEmail?: string,
  participantFullName?: string,
  token?: string
): Promise<ChatConversation> {
  const res = await chatFetch(API_ENDPOINTS.CHAT.CONVERSATIONS, {
    method: 'POST',
    body: JSON.stringify({
      participantUserId,
      participantEmail,
      participantFullName,
    }),
    token,
  });
  if (!res.ok) throw new Error('Failed to create conversation');
  return res.json();
}

export async function getMessages(
  conversationId: string,
  limit?: number,
  before?: string,
  token?: string
): Promise<ChatMessage[]> {
  const params = new URLSearchParams();
  if (limit) params.set('limit', String(limit));
  if (before) params.set('before', before);
  const q = params.toString();
  const url = `${API_ENDPOINTS.CHAT.MESSAGES(conversationId)}${q ? `?${q}` : ''}`;
  const res = await chatFetch(url, { token });
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

export async function markAsRead(conversationId: string, token?: string): Promise<void> {
  const res = await chatFetch(API_ENDPOINTS.CHAT.MARK_READ(conversationId), {
    method: 'POST',
    token,
  });
  if (!res.ok) throw new Error('Failed to mark as read');
}
