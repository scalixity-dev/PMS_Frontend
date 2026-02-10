import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConversations,
  createConversation,
  getMessages,
  markAsRead,
} from '../services/chat.service';
import { getContacts } from '../services/contact.service';
import { useChatToastStore } from '../store/chatToastStore';

export const chatQueryKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatQueryKeys.all, 'conversations'] as const,
  messages: (convId: string) => [...chatQueryKeys.all, 'messages', convId] as const,
  contacts: () => [...chatQueryKeys.all, 'contacts'] as const,
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

export function useMessages(conversationId: string | null, enabled = true) {
  return useQuery({
    queryKey: chatQueryKeys.messages(conversationId ?? ''),
    queryFn: () => getMessages(conversationId!),
    enabled: enabled && !!conversationId,
    staleTime: 10 * 1000,
  });
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) => markAsRead(conversationId),
    onSuccess: (_, conversationId) => {
      qc.invalidateQueries({ queryKey: chatQueryKeys.conversations() });
      qc.invalidateQueries({ queryKey: chatQueryKeys.messages(conversationId) });
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
