import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConversations,
  createConversation,
  getMessages,
  markAsRead,
  getOnlineUsers,
} from '../services/chat.service';
import { getContacts } from '../services/contact.service';
import { useChatToastStore } from '../store/chatToastStore';

export const chatQueryKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatQueryKeys.all, 'conversations'] as const,
  messages: (convId: string) => [...chatQueryKeys.all, 'messages', convId] as const,
  contacts: () => [...chatQueryKeys.all, 'contacts'] as const,
  presence: (userIds: string[]) => [...chatQueryKeys.all, 'presence', ...userIds.sort()] as const,
};

export function useConversations(enabled = true) {
  return useQuery({
    queryKey: chatQueryKeys.conversations(),
    queryFn: () => getConversations(),
    enabled,
    staleTime: 30 * 1000,
  });
}

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      participantUserId,
      participantEmail,
      participantFullName,
    }: {
      participantUserId: string;
      participantEmail?: string;
      participantFullName?: string;
    }) =>
      createConversation(participantUserId, participantEmail, participantFullName),
    onSuccess: () => qc.invalidateQueries({ queryKey: chatQueryKeys.conversations() }),
    onError: (err: Error) => {
      useChatToastStore.getState().showError(err.message || 'Failed to start conversation. Please try again.');
    },
  });
}

const MESSAGES_LIMIT = 100;
const MESSAGES_STALE_TIME = 5 * 60 * 1000;
const MESSAGES_GC_TIME = 30 * 60 * 1000;

export function useMessages(conversationId: string | null, enabled = true) {
  return useQuery({
    queryKey: chatQueryKeys.messages(conversationId ?? ''),
    queryFn: () => getMessages(conversationId!, MESSAGES_LIMIT),
    enabled: enabled && !!conversationId,
    // WebSocket keeps the cache live, so a long stale time is safe and means
    // reopening a conversation renders instantly from cache (no spinner).
    staleTime: MESSAGES_STALE_TIME,
    gcTime: MESSAGES_GC_TIME,
  });
}

// Warm the cache for a conversation before the user opens it, so the click
// is instant. Cheap: skipped automatically if the data is already fresh.
export function usePrefetchMessages() {
  const qc = useQueryClient();
  return useCallback(
    (conversationId: string) => {
      if (!conversationId) return;
      qc.prefetchQuery({
        queryKey: chatQueryKeys.messages(conversationId),
        queryFn: () => getMessages(conversationId, MESSAGES_LIMIT),
        staleTime: MESSAGES_STALE_TIME,
      });
    },
    [qc]
  );
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) => markAsRead(conversationId),
    onSuccess: () => {
      // Only the unread badge changes — refresh conversations, not messages.
      qc.invalidateQueries({ queryKey: chatQueryKeys.conversations() });
    },
  });
}

export function useContacts(enabled = true) {
  return useQuery({
    queryKey: chatQueryKeys.contacts(),
    queryFn: getContacts,
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useOnlineUsers(userIds: string[], enabled = true) {
  return useQuery({
    queryKey: chatQueryKeys.presence(userIds),
    queryFn: () => getOnlineUsers(userIds),
    enabled: enabled && userIds.length > 0,
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000,
  });
}
