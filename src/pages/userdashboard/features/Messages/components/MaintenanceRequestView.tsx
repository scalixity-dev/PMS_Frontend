import { useEffect, useState, useCallback, useMemo } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import type { ServiceRequest } from '../../../utils/types';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import { useAuthStore } from '../../Profile/store/authStore';
import { useGetCurrentUser } from '../../../../../hooks/useAuthQueries';
import { useContacts, useCreateConversation, useMessages, useMarkAsRead, chatQueryKeys } from '../../../../../hooks/useChatQueries';
import { useChatToken, useChatWebSocket } from '../../../../../hooks/useChatWebSocket';
import { useOfflineQueue } from '../../../../../hooks/useOfflineQueue';
import { useQueryClient } from '@tanstack/react-query';

interface MaintenanceRequestViewProps {
  request: ServiceRequest;
  onBack?: () => void;
  pmContact?: { userId: string; email: string; fullName: string } | null;
}

const MaintenanceRequestView = ({ request, onBack, pmContact }: MaintenanceRequestViewProps) => {
  const qc = useQueryClient();
  const { userInfo } = useAuthStore();
  const { data: user } = useGetCurrentUser();
  const currentUserId = user?.userId ?? '';
  const { data: contacts } = useContacts(!!currentUserId);
  const createConv = useCreateConversation();
  const [convId, setConvId] = useState<string | null>(null);

  const contact = pmContact ?? contacts?.[0];

  useEffect(() => {
    if (!contact || convId) return;
    createConv.mutate(
      {
        participantUserId: contact.userId,
        participantEmail: contact.email,
        participantFullName: contact.fullName,
      },
      {
        onSuccess: (conv: { id: string }) => {
          setConvId(conv.id);
          qc.invalidateQueries({ queryKey: chatQueryKeys.conversations() });
        },
      }
    );
  }, [contact, convId, createConv, qc]);

  const { data: token } = useChatToken(!!currentUserId);
  const { data: messagesData } = useMessages(convId, !!convId);
  const markRead = useMarkAsRead();

  useEffect(() => {
    if (convId) markRead.mutate(convId);
  }, [convId, markRead]);

  const onNewMessage = useCallback(
    (data: unknown) => {
      const m = data as { conversationId?: string; sender?: { id?: string } };
      if (m.conversationId === convId && m.sender?.id !== currentUserId) {
        qc.invalidateQueries({ queryKey: chatQueryKeys.messages(convId!) });
        qc.invalidateQueries({ queryKey: chatQueryKeys.conversations() });
      }
    },
    [convId, currentUserId, qc]
  );

  const { sendMessage, isConnected } = useChatWebSocket(
    token ?? null,
    convId,
    currentUserId,
    onNewMessage
  );

  const { trySend, pendingCount } = useOfflineQueue(isConnected, sendMessage);

  const apiMessages = messagesData ?? [];
  const messages = useMemo(
    () =>
      apiMessages.map((m) => ({
        id: m.id,
        senderId: m.sender.id === currentUserId ? 'user' : m.sender.id,
        senderName: m.sender.id === currentUserId ? 'You' : m.sender.displayName,
        text: m.content,
        timestamp: m.createdAt,
        isRead: true,
      })),
    [apiMessages, currentUserId]
  );

  const firstName = userInfo?.firstName ?? '';
  const lastName = userInfo?.lastName ?? '';

  const handleSendMessage = useCallback(
    (text: string, files?: File[]) => {
      let messageText = text;
      if (files?.length) {
        const names = files.map((f) => f.name).join(', ');
        messageText = text ? `${text}\n\n📎 Attached: ${names}` : `📎 Attached: ${names}`;
      }
      if (!messageText.trim() || !convId) return;
      const sent = trySend(convId, messageText);
      if (sent) {
        qc.invalidateQueries({ queryKey: chatQueryKeys.messages(convId) });
        qc.invalidateQueries({ queryKey: chatQueryKeys.conversations() });
      }
    },
    [convId, trySend, qc]
  );

  if (!userInfo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--dashboard-accent)]"></div>
        <p className="mt-4 text-gray-500">Loading conversation...</p>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50 px-4">
        <p className="text-sm">No property manager contact found. Add your property manager to get support.</p>
      </div>
    );
  }

  if (!convId && createConv.isPending) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--dashboard-accent)]"></div>
        <p className="mt-4 text-gray-500">Starting conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-2 md:py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            {onBack && (
              <button
                onClick={onBack}
                className="md:hidden p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              </button>
            )}
            <div className="flex -space-x-2">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-[10px] md:text-xs text-white font-bold ring-2 ring-emerald-50">
                {firstName?.[0]}
                {lastName?.[0]}
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] md:text-xs text-white font-bold ring-2 ring-emerald-50">
                {contact.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 text-xs md:text-sm">MR # {request.requestId}</h2>
              <p className="text-[10px] md:text-xs text-[var(--dashboard-accent)] font-medium">
                Maintenance Conversation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            {pendingCount > 0 && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                {pendingCount} pending
              </span>
            )}
            <button className="p-1.5 md:p-2.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Print Request">
              <Printer className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-[var(--dashboard-accent)]" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 md:px-4 py-2 md:py-3 bg-gray-50">
        <div className="flex flex-col items-center py-3 md:py-5 mb-3 md:mb-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-emerald-500 flex items-center justify-center text-lg md:text-xl text-white font-bold mb-2 md:mb-2.5 ring-4 ring-white shadow-lg">
            MR
          </div>
          <h3 className="text-sm md:text-base font-bold text-gray-800">Maintenance Request</h3>
          <p className="text-xs md:text-sm text-gray-600">{request.property}</p>
          <div className="mt-2 md:mt-2.5 px-2.5 md:px-3 py-1 md:py-1.5 bg-white rounded-full border border-gray-200">
            <p className="text-[10px] md:text-xs text-gray-600">
              Discussion for request #{request.requestId}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          {messages.map((message: { id: string; senderId: string; senderName: string; text: string; timestamp: string; isRead?: boolean }) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.senderId === 'user'}
              contactName={message.senderName}
              contactAvatar={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(message.senderName)}&backgroundColor=3D7475`}
            />
          ))}
        </div>
      </div>

      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default MaintenanceRequestView;
