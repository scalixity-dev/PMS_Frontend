import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  useConversations,
  useMessages,
  useContacts,
  useCreateConversation,
  useMarkAsRead,
  useOnlineUsers,
  usePrefetchMessages,
  chatQueryKeys,
} from '../../../../hooks/useChatQueries';
import { useChatToken, useChatWebSocket } from '../../../../hooks/useChatWebSocket';
import { useOfflineQueue } from '../../../../hooks/useOfflineQueue';
import { useChatToastStore } from '../../../../store/chatToastStore';
import { useGetCurrentUser } from '../../../../hooks/useAuthQueries';
import type { Chat, Message, ChatCategory } from './types';
import { uploadChatMedia, type ChatMessage, type ChatConversation } from '../../../../services/chat.service';
import ChatSidebar from './components/ChatSidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import { ApplicationBanner } from './components/ApplicationBanner';

function formatTime(iso: string | undefined | null): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 172800000) return 'Yesterday';
    return d.toLocaleDateString();
  } catch {
    return '';
  }
}

function avatarUrl(name: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=3D7475`;
}

function toChatCategory(contactType: string): ChatCategory {
  if (contactType === 'TENANT') return 'Tenants';
  if (contactType === 'SERVICE_PROVIDER') return 'Service Providers';
  if (contactType === 'OTHER') return 'Leads';
  return 'Leads';
}

interface DashboardContext {
  sidebarCollapsed: boolean;
}

const ChatPage: React.FC = () => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ChatCategory>('Tenants');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [pendingNewChat, setPendingNewChat] = useState<{
    id: string;
    name: string;
    contact: { userId: string; fullName: string; email: string };
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [searchParams] = useSearchParams();

  const qc = useQueryClient();
  const { data: user } = useGetCurrentUser();
  const currentUserId = user?.userId ?? '';

  const { data: convData, isLoading: convLoading } = useConversations(!!currentUserId);
  const { data: contacts } = useContacts(!!currentUserId);
  const { data: token } = useChatToken(!!currentUserId);
  const createConv = useCreateConversation();
  const { mutate: markRead } = useMarkAsRead();
  const prefetchMessages = usePrefetchMessages();

  const conversations = convData ?? [];

  // Warm the message cache for the most recent conversations so opening
  // them is instant. Runs in the background once the list loads.
  useEffect(() => {
    conversations.slice(0, 10).forEach((c: any) => prefetchMessages(c.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [convData, prefetchMessages]);

  useEffect(() => {
    const cid = searchParams.get('conversationId');
    if (cid && conversations.some((c: any) => c.id === cid)) {
      setActiveChatId(cid);
      setShowMobileChat(true);
    }
  }, [searchParams, conversations]);

  const { data: messagesData } = useMessages(activeChatId, !!activeChatId);
  const apiMessages = messagesData ?? [];

  // Collect other participant user IDs for presence query
  const otherUserIds = useMemo(() => {
    const ids = new Set<string>();
    conversations.forEach((c) => {
      c.participants.forEach((p: { userId: string }) => {
        if (p.userId !== currentUserId) ids.add(p.userId);
      });
    });
    return Array.from(ids);
  }, [conversations, currentUserId]);

  const { data: onlineUserIds } = useOnlineUsers(otherUserIds, !!currentUserId);
  const onlineSet = useMemo(() => new Set(onlineUserIds ?? []), [onlineUserIds]);

  // Real-time message handler: write the incoming message straight into the
  // React Query cache instead of refetching. Zero extra HTTP requests.
  const onNewMessage = useCallback(
    (data: unknown) => {
      const m = data as ChatMessage;
      if (!m?.id || !m.conversationId) return;

      // Append to the conversation's message list (dedup by id).
      qc.setQueryData<ChatMessage[]>(chatQueryKeys.messages(m.conversationId), (old) => {
        if (!old) return old;
        if (old.some((x) => x.id === m.id)) return old;
        return [...old, m];
      });

      // Update the sidebar: set last message + move conversation to the top.
      qc.setQueryData<ChatConversation[]>(chatQueryKeys.conversations(), (old) => {
        if (!old) return old;
        const idx = old.findIndex((c) => c.id === m.conversationId);
        if (idx === -1) return old;
        const updated: ChatConversation = {
          ...old[idx],
          lastMessage: {
            id: m.id,
            content: m.content,
            senderId: m.senderId ?? m.sender?.id ?? '',
            createdAt: m.createdAt,
          },
          updatedAt: m.createdAt,
        };
        return [updated, ...old.slice(0, idx), ...old.slice(idx + 1)];
      });
    },
    [qc]
  );

  const { sendMessage, sendTyping, sendTypingStop, isConnected, typingUsers } = useChatWebSocket(
    token ?? null,
    activeChatId,
    currentUserId,
    onNewMessage
  );

  const { trySend, pendingCount, pendingForConv } = useOfflineQueue(isConnected, sendMessage);

  // Debounced: only mark read once the user settles on a conversation,
  // so rapidly clicking through the list doesn't fire a request per chat.
  useEffect(() => {
    if (!activeChatId) return;
    const id = setTimeout(() => markRead(activeChatId), 500);
    return () => clearTimeout(id);
  }, [activeChatId, markRead]);

  const chats: Chat[] = useMemo(() => {
    return conversations.map((c: { id: string; applicationId?: string | null; participants: { userId: string; displayName?: string; email?: string; lastReadAt?: string | null }[]; lastMessage?: { content: string; createdAt: string } | null; updatedAt: string }) => {
      const other = c.participants.find((p: { userId: string }) => p.userId !== currentUserId);
      const name = other?.displayName ?? other?.email ?? 'Unknown';
      const contact = contacts?.find((ct: { userId: string; contactType: string }) => ct.userId === other?.userId);
      let category = contact ? toChatCategory(contact.contactType) : 'Leads';
      if ((c as any).type === 'application') {
        category = 'Tenants';
      }
      const lastMsg = c.lastMessage;
      const isOnline = other ? onlineSet.has(other.userId) : false;
      const otherLastReadAt = other?.lastReadAt ?? null;

      let formattedLastMessage = lastMsg?.content ?? 'No messages yet';
      if (formattedLastMessage.match(/^!\[(.*?)\]\((.*?)\)$/)) {
        formattedLastMessage = '📷 Image';
      } else if (formattedLastMessage.match(/^\[(.*?)\]\((.*?)\)$/)) {
        formattedLastMessage = '📎 Attachment';
      }

      return {
        id: c.id,
        applicationId: c.applicationId ?? null,
        name,
        role: contact?.contactType?.replace('_', ' ') ?? 'Contact',
        category,
        status: isOnline ? 'Active Now' : 'Offline',
        avatar: avatarUrl(name),
        lastMessage: formattedLastMessage,
        time: lastMsg ? formatTime(lastMsg.createdAt) : '',
        messages: [],
        isPinned: false,
        isOnline,
        otherLastReadAt,
      };
    });
  }, [conversations, contacts, currentUserId, onlineSet]);

  const messages: (Message & { isPending?: boolean })[] = useMemo(() => {
    const api = apiMessages.map((m: { id: string; sender: { id: string; displayName: string }; content: string; createdAt: string }) => ({
      id: m.id,
      senderId: m.sender.id === currentUserId ? 'me' : m.sender.id,
      senderName: m.sender.id === currentUserId ? 'Me' : m.sender.displayName,
      text: m.content,
      time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: m.createdAt,
      isPending: false,
    }));
    const pending = (activeChatId ? pendingForConv(activeChatId) : []).map((q) => ({
      id: q.id ?? `pending-${q.conversationId}-${q.content.slice(0, 10)}`,
      senderId: 'me' as const,
      senderName: 'Me',
      text: q.content,
      time: '',
      createdAt: new Date().toISOString(),
      isPending: true,
    }));
    return [...api, ...pending];
  }, [apiMessages, currentUserId, activeChatId, pendingForConv]);

  useEffect(() => {
    if (pendingNewChat && conversations.some((c) => c.id === pendingNewChat.id)) {
      setPendingNewChat(null);
    }
  }, [conversations, pendingNewChat]);

  // Typing text for active chat
  const activeTypingText = useMemo(() => {
    if (!activeChatId) return undefined;
    const users = typingUsers[activeChatId];
    if (!users || users.length === 0) return undefined;
    // Don't show own typing
    const others = users.filter((u) => u.userId !== currentUserId);
    if (others.length === 0) return undefined;
    if (others.length === 1) return `${others[0].email.split('@')[0]} is typing...`;
    return `${others.length} people are typing...`;
  }, [typingUsers, activeChatId, currentUserId]);

  const activeChat: Chat | null = useMemo(() => {
    if (pendingNewChat) {
      return {
        id: pendingNewChat.id,
        name: pendingNewChat.name,
        role: 'Contact',
        category: 'Leads',
        status: 'Offline',
        avatar: avatarUrl(pendingNewChat.name),
        lastMessage: 'No messages yet',
        time: '',
        messages,
        typingText: activeTypingText,
      };
    }
    const base = chats.find((c) => c.id === activeChatId);
    if (!base) return null;
    return { ...base, messages, typingText: activeTypingText };
  }, [chats, activeChatId, messages, pendingNewChat, activeTypingText]);

  const filteredChats = useMemo(
    () =>
      chats.filter(
        (c: Chat) =>
          c.category === selectedCategory &&
          (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
      ),
    [chats, searchQuery, selectedCategory]
  );

  const sortedChats = useMemo(
    () =>
      [...filteredChats].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      }),
    [filteredChats]
  );

  const context = useOutletContext<DashboardContext>();
  const sidebarCollapsed = context?.sidebarCollapsed ?? false;
  const sidebarOpen = !sidebarCollapsed;

  const handleChatSelect = useCallback((id: string) => {
    setActiveChatId(id);
    setShowMobileChat(true);
  }, []);

  const handleBackToSidebar = useCallback(() => {
    setShowMobileChat(false);
  }, []);

  const handleSendMessage = useCallback(
    async (text: string, file: File | null) => {
      let finalText = text;
      if (file) {
        setIsUploading(true);
        try {
          const url = await uploadChatMedia(file, token ?? undefined);
          if (file.type.startsWith('image/')) {
            finalText = text ? `${text}\n\n![${file.name}](${url})` : `![${file.name}](${url})`;
          } else {
            finalText = text ? `${text}\n\n[${file.name}](${url})` : `[${file.name}](${url})`;
          }
        } catch (error) {
          useChatToastStore.getState().showError('Failed to upload attachment');
          setIsUploading(false);
          return;
        }
        setIsUploading(false);
      }
      if (!finalText.trim() || !activeChatId) return;
      sendTypingStop();
      const sent = trySend(activeChatId, finalText);
      if (!sent) {
        useChatToastStore.getState().showInfo('Message saved. Will send when back online.');
      }
      // When sent, the server echoes the message back over WebSocket and
      // onNewMessage writes it into the cache — no refetch needed.
    },
    [trySend, activeChatId, sendTypingStop]
  );

  const handleStartNewChat = useCallback(
    (contact: { userId: string; email: string; fullName: string }) => {
      createConv.mutate(
        {
          participantUserId: contact.userId,
          participantEmail: contact.email,
          participantFullName: contact.fullName,
        },
        {
          onSuccess: (conv: { id: string }) => {
            setActiveChatId(conv.id);
            setPendingNewChat({
              id: conv.id,
              name: contact.fullName,
              contact,
            });
            setShowNewChatModal(false);
            setShowMobileChat(true);
            qc.invalidateQueries({ queryKey: chatQueryKeys.conversations() });
          },
        }
      );
    },
    [createConv, qc]
  );

  const handleTyping = useCallback(() => {
    sendTyping();
  }, [sendTyping]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (showMobileChat && activeChat) scrollToBottom();
  }, [activeChat?.messages, scrollToBottom, showMobileChat]);

  if (convLoading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-gray-500">Loading conversations...</div>
      </div>
    );
  }

  return (
    <div
      className={`mx-auto h-full bg-white flex overflow-hidden transition-all duration-300 ${sidebarOpen ? 'max-w-7xl' : 'max-w-full'}`}
    >
      <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} w-full md:w-auto flex-col h-full`}>
        <ChatSidebar
          chats={sortedChats}
          activeChatId={activeChatId ?? ''}
          onSelectChat={handleChatSelect}
          onTogglePin={() => {}}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onNewChat={() => setShowNewChatModal(true)}
        />
      </div>

      <div className={`flex-1 flex flex-col bg-white ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
        {activeChat ? (
          <>
            <ChatHeader
              activeChat={activeChat}
              onPrint={() => window.print()}
              onDelete={() => setActiveChatId(null)}
              onBack={handleBackToSidebar}
              pendingCount={pendingCount}
            />
            {activeChat.applicationId && <ApplicationBanner applicationId={activeChat.applicationId} />}
            <MessageList activeChat={activeChat} messagesEndRef={messagesEndRef} />
            <ChatInput onSendMessage={handleSendMessage} onTyping={handleTyping} isUploading={isUploading} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p className="text-lg font-medium">Select a conversation or start a new chat</p>
          </div>
        )}
      </div>

      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">New conversation</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                x
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              {contacts?.length === 0 ? (
                <p className="text-gray-500 text-sm">No contacts with accounts yet.</p>
              ) : (
                <div className="space-y-1">
                  {contacts?.map((c: { id: string; userId: string; email: string; fullName: string }) => (
                    <button
                      key={c.id}
                      onClick={() => handleStartNewChat(c)}
                      disabled={createConv.isPending}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#E6F3EF] transition-colors text-left"
                    >
                      <div
                        className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-semibold"
                      >
                        {c.fullName?.charAt(0) ?? c.email?.charAt(0) ?? '?'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{c.fullName}</p>
                        <p className="text-xs text-gray-500">{c.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
