import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  useConversations,
  useMessages,
  useContacts,
  useCreateConversation,
  useMarkAsRead,
  chatQueryKeys,
} from '../../../../hooks/useChatQueries';
import { useChatToken, useChatWebSocket } from '../../../../hooks/useChatWebSocket';
import { useOfflineQueue } from '../../../../hooks/useOfflineQueue';
import { useChatToastStore } from '../../../../store/chatToastStore';
import { useGetCurrentUser } from '../../../../hooks/useAuthQueries';
import type { Chat, Message, ChatCategory } from './types';
import ChatSidebar from './components/ChatSidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';

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
  const [pendingNewChat, setPendingNewChat] = useState<{
    id: string;
    name: string;
    contact: { userId: string; fullName: string; email: string };
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const qc = useQueryClient();
  const { data: user } = useGetCurrentUser();
  const currentUserId = user?.userId ?? '';

  const { data: convData, isLoading: convLoading } = useConversations(!!currentUserId);
  const { data: contacts } = useContacts(!!currentUserId);
  const { data: token } = useChatToken(!!currentUserId);
  const createConv = useCreateConversation();
  const markRead = useMarkAsRead();

  const conversations = convData ?? [];

  const { data: messagesData } = useMessages(activeChatId, !!activeChatId);
  const apiMessages = messagesData ?? [];

  const onNewMessage = useCallback(
    (data: unknown) => {
      const m = data as { conversationId: string; sender?: { id: string } };
      if (m.conversationId === activeChatId && m.sender?.id !== currentUserId) {
        qc.invalidateQueries({ queryKey: chatQueryKeys.messages(activeChatId!) });
        qc.invalidateQueries({ queryKey: chatQueryKeys.conversations() });
      }
    },
    [activeChatId, currentUserId, qc]
  );

  const { sendMessage, isConnected } = useChatWebSocket(
    token ?? null,
    activeChatId,
    currentUserId,
    onNewMessage
  );

  const { trySend, pendingCount, pendingForConv } = useOfflineQueue(isConnected, sendMessage);

  useEffect(() => {
    if (activeChatId) markRead.mutate(activeChatId);
  }, [activeChatId, markRead]);

  const chats: Chat[] = useMemo(() => {
    return conversations.map((c: { id: string; participants: { userId: string; displayName?: string; email?: string }[]; lastMessage?: { content: string; createdAt: string } | null; updatedAt: string }) => {
      const other = c.participants.find((p: { userId: string }) => p.userId !== currentUserId);
      const name = other?.displayName ?? other?.email ?? 'Unknown';
      const contact = contacts?.find((ct: { userId: string; contactType: string }) => ct.userId === other?.userId);
      const category = contact ? toChatCategory(contact.contactType) : 'Leads';
      const lastMsg = c.lastMessage;
      return {
        id: c.id,
        name,
        role: contact?.contactType?.replace('_', ' ') ?? 'Contact',
        category,
        status: isConnected ? 'Active Now' : 'Offline',
        avatar: avatarUrl(name),
        lastMessage: lastMsg?.content ?? 'No messages yet',
        time: lastMsg ? formatTime(lastMsg.createdAt) : '',
        messages: [],
        isPinned: false,
      };
    });
  }, [conversations, contacts, currentUserId, isConnected]);

  const messages: (Message & { isPending?: boolean })[] = useMemo(() => {
    const api = apiMessages.map((m: { id: string; sender: { id: string; displayName: string }; content: string; createdAt: string }) => ({
      id: m.id,
      senderId: m.sender.id === currentUserId ? 'me' : m.sender.id,
      senderName: m.sender.id === currentUserId ? 'Me' : m.sender.displayName,
      text: m.content,
      time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPending: false,
    }));
    const pending = (activeChatId ? pendingForConv(activeChatId) : []).map((q) => ({
      id: q.id ?? `pending-${q.conversationId}-${q.content.slice(0, 10)}`,
      senderId: 'me' as const,
      senderName: 'Me',
      text: q.content,
      time: '',
      isPending: true,
    }));
    return [...api, ...pending];
  }, [apiMessages, currentUserId, activeChatId, pendingForConv]);

  useEffect(() => {
    if (pendingNewChat && conversations.some((c) => c.id === pendingNewChat.id)) {
      setPendingNewChat(null);
    }
  }, [conversations, pendingNewChat]);

  const activeChat: Chat | null = useMemo(() => {
    if (pendingNewChat) {
      return {
        id: pendingNewChat.id,
        name: pendingNewChat.name,
        role: 'Contact',
        category: 'Leads',
        status: isConnected ? 'Active Now' : 'Offline',
        avatar: avatarUrl(pendingNewChat.name),
        lastMessage: 'No messages yet',
        time: '',
        messages,
      };
    }
    const base = chats.find((c) => c.id === activeChatId);
    if (!base) return null;
    return { ...base, messages };
  }, [chats, activeChatId, messages, pendingNewChat, isConnected]);

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
    (text: string, file: File | null) => {
      let finalText = text;
      if (file) finalText = text ? `${text}\n📎 ${file.name}` : `📎 ${file.name}`;
      if (!finalText.trim() || !activeChatId) return;
      const sent = trySend(activeChatId, finalText);
      if (sent) {
        qc.invalidateQueries({ queryKey: chatQueryKeys.messages(activeChatId) });
        qc.invalidateQueries({ queryKey: chatQueryKeys.conversations() });
      } else {
        useChatToastStore.getState().showInfo('Message saved. Will send when back online.');
      }
    },
    [trySend, activeChatId, qc]
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
            <MessageList activeChat={activeChat} messagesEndRef={messagesEndRef} />
            <ChatInput onSendMessage={handleSendMessage} />
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
                ×
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
