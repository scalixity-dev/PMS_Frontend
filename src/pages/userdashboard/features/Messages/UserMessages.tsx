import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, ListPlus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import ChatSidebar from './components/ChatSidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import MaintenanceRequestView from './components/MaintenanceRequestView';
import PublicationView from './components/PublicationView';
import { useRequestStore } from '../Requests/store/requestStore';
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
import { mockPublications } from './utils/mockData';
import type { Chat } from './types';
import type { ServiceRequest, Publication } from '../../utils/types';

function safeFormatTime(iso: string | undefined | null): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (diff < 172800000) return 'Yesterday';
    return d.toLocaleDateString();
  } catch {
    return '';
  }
}

function avatarUrl(name: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=3D7475`;
}

function toContactRole(contactType: string): Chat['contactRole'] {
  if (contactType === 'TENANT') return 'Co-Tenant';
  if (contactType === 'SERVICE_PROVIDER') return 'Maintenance';
  if (contactType === 'PROPERTY_MANAGER') return 'Property Manager';
  return 'Landlord';
}

const Messages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { requests } = useRequestStore();

  const [chatSearch, setChatSearch] = useState('');
  const [mrSearch, setMrSearch] = useState('');
  const [pbSearch, setPbSearch] = useState('');
  const [activeRequest, setActiveRequest] = useState<ServiceRequest | null>(null);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [activePublication, setActivePublication] = useState<Publication | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [viewMode, setViewMode] = useState<'CHAT' | 'MR' | 'PB'>('CHAT');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [pendingNewChat, setPendingNewChat] = useState<{ id: string; name: string } | null>(null);

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

  useEffect(() => {
    if (pendingNewChat && conversations.some((c) => c.id === pendingNewChat.id)) {
      setPendingNewChat(null);
    }
  }, [conversations, pendingNewChat]);

  const chats: Chat[] = useMemo(() => {
    return conversations.map((c) => {
      const other = c.participants.find((p) => p.userId !== currentUserId);
      const name = other?.displayName ?? other?.email ?? 'Unknown';
      const contact = contacts?.find((ct) => ct.userId === other?.userId);
      const lastMsg = c.lastMessage;
      return {
        id: c.id,
        contactName: name,
        contactRole: toContactRole(contact?.contactType ?? 'OTHER'),
        contactEmail: other?.email ?? '',
        contactAvatar: avatarUrl(name),
        lastMessage: lastMsg?.content ?? 'No messages yet',
        lastMessageTime: safeFormatTime(lastMsg?.createdAt),
        unreadCount: c.unreadCount ?? 0,
        isOnline: isConnected,
        isPinned: false,
        messages: [],
        propertyAddress: undefined,
      };
    });
  }, [conversations, contacts, currentUserId, isConnected]);

  const messages = useMemo(() => {
    const api = apiMessages.map((m) => ({
      id: m.id,
      senderId: m.sender.id === currentUserId ? 'user' : m.sender.id,
      senderName: m.sender.id === currentUserId ? 'You' : m.sender.displayName,
      text: m.content,
      timestamp: m.createdAt,
      isRead: true,
      isPending: false,
    }));
    const pending = (activeChatId ? pendingForConv(activeChatId) : []).map((q) => ({
      id: q.id ?? `pending-${q.conversationId}-${q.content.slice(0, 10)}`,
      senderId: 'user' as const,
      senderName: 'You',
      text: q.content,
      timestamp: new Date().toISOString(),
      isRead: false,
      isPending: true,
    }));
    return [...api, ...pending];
  }, [apiMessages, currentUserId, activeChatId, pendingForConv]);

  const activeChat: Chat | null = useMemo(() => {
    if (pendingNewChat) {
      return {
        id: pendingNewChat.id,
        contactName: pendingNewChat.name,
        contactRole: 'Property Manager',
        contactEmail: '',
        contactAvatar: avatarUrl(pendingNewChat.name),
        lastMessage: 'No messages yet',
        lastMessageTime: '',
        unreadCount: 0,
        isOnline: isConnected,
        isPinned: false,
        messages,
        propertyAddress: undefined,
      };
    }
    const base = chats.find((c) => c.id === activeChatId);
    if (!base) return null;
    return { ...base, messages };
  }, [chats, activeChatId, messages, pendingNewChat, isConnected]);

  const filteredChats = useMemo(() => {
    const baseChats = chats.filter((chat) => {
      const isMRChat = requests.some(
        (req) =>
          (req.requestId || '').toString() === chat.id ||
          (req.id || '').toString() === chat.id
      );
      return !isMRChat;
    });
    if (!chatSearch) return baseChats;
    const q = chatSearch.toLowerCase();
    return baseChats.filter(
      (c) =>
        c.contactName.toLowerCase().includes(q) ||
        c.contactEmail.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q) ||
        c.contactRole.toLowerCase().includes(q)
    );
  }, [chats, chatSearch, requests]);

  const filteredRequests = useMemo(() => {
    if (!mrSearch) return requests;
    const q = mrSearch.toLowerCase();
    return requests.filter(
      (req) =>
        (req.property || '').toLowerCase().includes(q) ||
        (req.requestId || '').toLowerCase().includes(q) ||
        (req.category || '').toLowerCase().includes(q) ||
        (req.subCategory || '').toLowerCase().includes(q) ||
        (req.problem || '').toLowerCase().includes(q)
    );
  }, [requests, mrSearch]);

  const filteredPublications = useMemo(() => {
    if (!pbSearch) return publications;
    const q = pbSearch.toLowerCase();
    return publications.filter(
      (pub) =>
        pub.title.toLowerCase().includes(q) ||
        pub.content.toLowerCase().includes(q) ||
        pub.author.toLowerCase().includes(q)
    );
  }, [publications, pbSearch]);

  const sortedChats = useMemo(
    () =>
      [...filteredChats].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
        if (a.unreadCount === 0 && b.unreadCount > 0) return 1;
        return 0;
      }),
    [filteredChats]
  );

  useEffect(() => {
    setPublications(mockPublications);
  }, []);

  useEffect(() => {
    if (location.state?.viewMode === 'MR' && location.state?.requestId) {
      const reqId = location.state.requestId;
      setViewMode('MR');
      const request = requests.find((r) => r.id === reqId);
      if (request) {
        setActiveRequest(request);
        setShowMobileChat(true);
      }
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, requests, navigate]);

  useEffect(() => {
    if (requests.length > 0 && !activeRequest) {
      setActiveRequest(requests[0]);
    }
  }, [requests, activeRequest]);

  const handleSelectChat = useCallback((chat: Chat) => {
    setViewMode('CHAT');
    setActiveChatId(chat.id);
    markRead.mutate(chat.id);
    setShowMobileChat(true);
  }, [markRead]);

  const handleSelectRequest = (request: ServiceRequest) => {
    setViewMode('MR');
    setActiveRequest(request);
    setShowMobileChat(true);
  };

  const handleSelectPublication = (pub: Publication) => {
    setViewMode('PB');
    setActivePublication(pub);
    setShowMobileChat(true);
  };

  const handleBackToSidebar = () => {
    setShowMobileChat(false);
  };

  const handleSendMessage = useCallback(
    (text: string, files?: File[]) => {
      if (!activeChat || !activeChatId) return;
      let messageText = text;
      if (files?.length) {
        const names = files.map((f) => f.name).join(', ');
        messageText = text ? `${text}\n\n📎 Attached: ${names}` : `📎 Attached: ${names}`;
      }
      if (!messageText.trim()) return;
      const sent = trySend(activeChatId, messageText);
      if (sent) {
        qc.invalidateQueries({ queryKey: chatQueryKeys.messages(activeChatId) });
        qc.invalidateQueries({ queryKey: chatQueryKeys.conversations() });
      } else {
        useChatToastStore.getState().showInfo('Message saved. Will send when back online.');
      }
    },
    [activeChat, activeChatId, trySend, qc]
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
          onSuccess: (conv) => {
            setActiveChatId(conv.id);
            setPendingNewChat({ id: conv.id, name: contact.fullName });
            setShowNewChatModal(false);
            setShowMobileChat(true);
            setViewMode('CHAT');
            qc.invalidateQueries({ queryKey: chatQueryKeys.conversations() });
          },
        }
      );
    },
    [createConv, qc]
  );

  const getSearchValue = () => {
    if (viewMode === 'CHAT') return chatSearch;
    if (viewMode === 'MR') return mrSearch;
    return pbSearch;
  };

  const handleSearchChange = (query: string) => {
    if (viewMode === 'CHAT') setChatSearch(query);
    else if (viewMode === 'MR') setMrSearch(query);
    else setPbSearch(query);
  };

  const isLoading = convLoading && conversations.length === 0;

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex bg-white flex-1 shadow-sm md:shadow-lg overflow-hidden font-inter">
        <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} flex-shrink-0 w-full md:w-auto`}>
          <ChatSidebar
            chats={sortedChats}
            activeChat={activeChat}
            requests={filteredRequests}
            activeRequest={activeRequest}
            publications={filteredPublications}
            activePublication={activePublication}
            onSelectPublication={handleSelectPublication}
            activeTab={viewMode}
            onTabChange={(tab) => setViewMode(tab)}
            searchQuery={getSearchValue()}
            onSearchChange={handleSearchChange}
            onSelectChat={handleSelectChat}
            onSelectRequest={handleSelectRequest}
            onNewChat={viewMode === 'CHAT' ? () => setShowNewChatModal(true) : undefined}
          />
        </div>

        <div className={`flex-1 flex flex-col ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
          {viewMode === 'CHAT' ? (
            isLoading ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50 px-4">
                <p className="text-sm">Loading conversations...</p>
              </div>
            ) : activeChat ? (
              <>
                <ChatHeader
                  chat={activeChat}
                  onBack={handleBackToSidebar}
                  showBackButton={showMobileChat}
                  pendingCount={pendingCount}
                />
                <MessageList chat={activeChat} currentUserId="user" />
                <ChatInput onSendMessage={handleSendMessage} />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50 px-4">
                <MessageSquare className="w-16 h-16 md:w-24 md:h-24 mb-3 md:mb-4 text-gray-300" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">
                  No conversation selected
                </h3>
                <p className="text-xs md:text-sm text-gray-500 text-center max-w-md">
                  Choose a conversation or start a new chat with your property manager.
                </p>
              </div>
            )
          ) : viewMode === 'MR' ? (
            activeRequest ? (
              <MaintenanceRequestView
                request={activeRequest}
                onBack={handleBackToSidebar}
                pmContact={contacts?.[0]}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50 px-4">
                <MessageSquare className="w-16 h-16 md:w-24 md:h-24 mb-3 md:mb-4 text-gray-300" />
                <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">No request selected</h3>
                <p className="text-xs md:text-sm text-gray-500 text-center max-w-md">
                  Choose a maintenance request from the sidebar.
                </p>
              </div>
            )
          ) : (
            activePublication ? (
              <PublicationView
                publication={activePublication}
                onBack={handleBackToSidebar}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc] px-4 md:px-6 text-center">
                <ListPlus className="w-16 h-16 md:w-24 md:h-24 mb-3 md:mb-4 text-gray-300" />
                <h3 className="text-lg md:text-xl font-semibold text-[#1e293b] mb-2">No publication selected</h3>
                <p className="text-xs md:text-sm text-[#64748b] max-w-md">
                  Choose a publication from the sidebar.
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">New conversation</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4">
              {contacts?.length === 0 ? (
                <p className="text-gray-500 text-sm">No contacts yet. Your property manager will add you to their contact book.</p>
              ) : (
                <div className="space-y-1">
                  {contacts?.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleStartNewChat(c)}
                      disabled={createConv.isPending}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#E6F3EF] transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-semibold">
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

export default Messages;
