import { useState, useMemo, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import ChatSidebar from './components/ChatSidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import {
    useConversations,
    useMessages,
    useContacts,
    useCreateConversation,
    useMarkAsRead,
    useOnlineUsers,
    usePrefetchMessages,
    chatQueryKeys,
} from '../../../../../hooks/useChatQueries';
import { useChatToken, useChatWebSocket } from '../../../../../hooks/useChatWebSocket';
import { useOfflineQueue } from '../../../../../hooks/useOfflineQueue';
import { useChatToastStore } from '../../../../../store/chatToastStore';
import { useGetCurrentUser } from '../../../../../hooks/useAuthQueries';
import type { Chat } from './types';
import type { ChatMessage, ChatConversation } from '../../../../../services/chat.service';
import { useEffect } from 'react';
import { printConversation } from '@/utils/conversationPrint';

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
    if (contactType === 'TENANT') return 'Tenant';
    if (contactType === 'PROPERTY_MANAGER') return 'Property Manager';
    return 'Admin';
}

const CURRENT_USER_ID = 'user';

const ServiceMessages = () => {
    const qc = useQueryClient();

    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [chatSearch, setChatSearch] = useState('');
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [activeTab, setActiveTab] = useState<'All' | 'MR' | 'PM'>('All');
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [pendingNewChat, setPendingNewChat] = useState<{ id: string; name: string } | null>(null);

    const { data: user } = useGetCurrentUser();
    const currentUserId = user?.userId ?? '';
    const { data: convData, isLoading: convLoading } = useConversations(!!currentUserId);
    const { data: contacts } = useContacts(!!currentUserId);
    const { data: token } = useChatToken(!!currentUserId);
    const createConv = useCreateConversation();
    const { mutate: markRead } = useMarkAsRead();
    const conversations = convData ?? [];
    const prefetchMessages = usePrefetchMessages();

    // Warm the message cache for recent conversations so opening is instant.
    useEffect(() => {
        conversations.slice(0, 10).forEach((c) => prefetchMessages(c.id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [convData, prefetchMessages]);

    const { data: messagesData } = useMessages(activeChatId, !!activeChatId);
    const apiMessages = messagesData ?? [];

    // Collect other participant user IDs for presence
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

    // Real-time: write the incoming message straight into the React Query
    // cache instead of refetching. Zero extra HTTP requests.
    const onNewMessage = useCallback(
        (data: unknown) => {
            const m = data as ChatMessage;
            if (!m?.id || !m.conversationId) return;

            qc.setQueryData<ChatMessage[]>(chatQueryKeys.messages(m.conversationId), (old) => {
                if (!old) return old;
                if (old.some((x) => x.id === m.id)) return old;
                return [...old, m];
            });

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

    // Debounced so rapidly switching chats doesn't fire a request per chat.
    useEffect(() => {
        if (!activeChatId) return;
        const id = setTimeout(() => markRead(activeChatId), 500);
        return () => clearTimeout(id);
    }, [activeChatId, markRead]);

    useEffect(() => {
        if (pendingNewChat && conversations.some((c) => c.id === pendingNewChat.id)) {
            setPendingNewChat(null);
        }
    }, [conversations, pendingNewChat]);

    // Map API conversations to Chat[]
    const chats: Chat[] = useMemo(() => {
        return conversations.map((c) => {
            const other = c.participants.find((p) => p.userId !== currentUserId);
            const name = other?.displayName ?? other?.email ?? 'Unknown';
            const contact = contacts?.find((ct) => ct.userId === other?.userId);
            const lastMsg = c.lastMessage;
            const isOnline = other ? onlineSet.has(other.userId) : false;
            const otherLastReadAt = other?.lastReadAt ?? null;

            return {
                id: c.id,
                contactName: name,
                contactRole: toContactRole(contact?.contactType ?? 'OTHER'),
                contactEmail: other?.email ?? '',
                contactAvatar: avatarUrl(name),
                lastMessage: lastMsg?.content ?? 'No messages yet',
                lastMessageTime: safeFormatTime(lastMsg?.createdAt),
                unreadCount: c.unreadCount ?? 0,
                isOnline,
                isPinned: false,
                messages: [],
                propertyAddress: undefined,
                otherLastReadAt,
            };
        });
    }, [conversations, contacts, currentUserId, onlineSet]);

    // Map API messages + pending queue
    const messages = useMemo(() => {
        const api = apiMessages.map((m) => ({
            id: m.id,
            senderId: m.sender.id === currentUserId ? CURRENT_USER_ID : m.sender.id,
            senderName: m.sender.id === currentUserId ? 'You' : m.sender.displayName,
            text: m.content,
            timestamp: m.createdAt,
            isRead: true,
            isPending: false,
        }));
        const pending = (activeChatId ? pendingForConv(activeChatId) : []).map((q) => ({
            id: q.id ?? `pending-${q.conversationId}-${q.content.slice(0, 10)}`,
            senderId: CURRENT_USER_ID,
            senderName: 'You',
            text: q.content,
            timestamp: new Date().toISOString(),
            isRead: false,
            isPending: true,
        }));
        return [...api, ...pending];
    }, [apiMessages, currentUserId, activeChatId, pendingForConv]);

    // Typing text for active chat
    const activeTypingText = useMemo(() => {
        if (!activeChatId) return undefined;
        const users = typingUsers[activeChatId];
        if (!users || users.length === 0) return undefined;
        const others = users.filter((u) => u.userId !== currentUserId);
        if (others.length === 0) return undefined;
        if (others.length === 1) return `${others[0].email.split('@')[0]} is typing...`;
        return `${others.length} people are typing...`;
    }, [typingUsers, activeChatId, currentUserId]);

    // Build active chat object
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
                isOnline: false,
                isPinned: false,
                messages,
                propertyAddress: undefined,
                typingText: activeTypingText,
            };
        }
        const base = chats.find((c) => c.id === activeChatId);
        if (!base) return null;
        return { ...base, messages, typingText: activeTypingText };
    }, [chats, activeChatId, messages, pendingNewChat, activeTypingText]);

    // Tab + search filtering
    const filteredChats = useMemo(() => {
        let result = chats;
        if (activeTab === 'MR') {
            result = result.filter((chat) => chat.contactRole === 'Tenant');
        } else if (activeTab === 'PM') {
            result = result.filter((chat) => chat.contactRole === 'Property Manager' || chat.contactRole === 'Admin');
        }
        if (chatSearch) {
            const query = chatSearch.toLowerCase();
            result = result.filter(chat =>
                chat.contactName.toLowerCase().includes(query) ||
                chat.lastMessage.toLowerCase().includes(query)
            );
        }
        return result;
    }, [chats, chatSearch, activeTab]);

    const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>() || { sidebarCollapsed: false };

    // Handlers
    const handleSelectChat = useCallback((chat: Chat) => {
        setActiveChatId(chat.id);
        markRead(chat.id);
        setShowMobileChat(true);
    }, [markRead]);

    const handleBackToSidebar = useCallback(() => {
        setShowMobileChat(false);
    }, []);

    const handleSendMessage = useCallback(
        (text: string, files?: File[]) => {
            if (!activeChat || !activeChatId) return;
            let messageText = text;
            if (files && files.length > 0) {
                const fileNames = files.map(f => f.name).join(', ');
                messageText = text
                    ? `${text}\n\n📎 Attached: ${fileNames}`
                    : `📎 Attached: ${fileNames}`;
            }
            if (!messageText.trim()) return;
            sendTypingStop();
            const sent = trySend(activeChatId, messageText);
            if (!sent) {
                useChatToastStore.getState().showInfo('Message saved. Will send when back online.');
            }
            // When sent, the server echoes the message back over WebSocket and
            // onNewMessage writes it into the cache — no refetch needed.
        },
        [activeChat, activeChatId, trySend, sendTypingStop]
    );

    const handleTyping = useCallback(() => {
        sendTyping();
    }, [sendTyping]);

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
                        qc.invalidateQueries({ queryKey: chatQueryKeys.conversations() });
                    },
                }
            );
        },
        [createConv, qc]
    );

    const isLoading = convLoading && conversations.length === 0;

    return (
        <div className={`flex flex-col bg-white mx-auto transition-all duration-300 ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} h-[calc(100vh-4rem)] supports-[height:100dvh]:h-[calc(100dvh-4rem)]`}>
            <div className="flex bg-white flex-1 overflow-hidden font-inter border-x border-gray-100 shadow-sm">
                {/* Sidebar */}
                <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-gray-200`}>
                    <ChatSidebar
                        chats={filteredChats}
                        activeChat={activeChat}
                        searchQuery={chatSearch}
                        onSearchChange={setChatSearch}
                        onSelectChat={handleSelectChat}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        onNewChat={() => setShowNewChatModal(true)}
                    />
                </div>

                {/* Content */}
                <div className={`flex-1 flex flex-col ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
                    {isLoading ? (
                        <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50">
                            <p className="text-sm">Loading conversations...</p>
                        </div>
                    ) : activeChat ? (
                        <>
                            <ChatHeader
                                chat={activeChat}
                                onBack={handleBackToSidebar}
                                showBackButton={showMobileChat}
                                pendingCount={pendingCount}
                                onPrint={() => printConversation({
                                    title: `Conversation with ${activeChat.contactName}`,
                                    subtitle: [activeChat.contactRole, activeChat.propertyAddress].filter(Boolean).join(' - '),
                                    messages: activeChat.messages,
                                    printedAt: new Date(),
                                })}
                                onDelete={() => setActiveChatId(null)}
                            />
                            <MessageList chat={activeChat} currentUserId={CURRENT_USER_ID} />
                            <ChatInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                            <MessageSquare className="w-24 h-24 mb-4 text-gray-300" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No conversation selected</h3>
                            <p className="text-sm text-gray-500">Choose a conversation to start messaging</p>
                        </div>
                    )}
                </div>
            </div>

            {/* New Chat Modal */}
            {showNewChatModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900">New conversation</h3>
                            <button
                                onClick={() => setShowNewChatModal(false)}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                x
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-1 p-4">
                            {contacts?.length === 0 ? (
                                <p className="text-gray-500 text-sm">No contacts available yet.</p>
                            ) : (
                                <div className="space-y-1">
                                    {contacts?.map((c) => (
                                        <button
                                            key={c.id}
                                            onClick={() => handleStartNewChat(c)}
                                            disabled={createConv.isPending}
                                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#E6F3EF] transition-colors text-left"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-[#3A6D6C]/20 flex items-center justify-center text-[#3A6D6C] font-semibold">
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

export default ServiceMessages;
