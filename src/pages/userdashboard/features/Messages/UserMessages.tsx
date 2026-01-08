import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import ChatSidebar from './components/ChatSidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import MaintenanceRequestView from './components/MaintenanceRequestView';
import { useMessagesStore } from './store/messagesStore';
import { useRequestStore } from '../Requests/store/requestStore';
import { mockChats } from './utils/mockData';
import type { Chat } from './types';
import type { ServiceRequest, Publication } from '../../utils/types';

const CURRENT_USER_ID = 'user';

const Messages = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        chats,
        activeChat,
        setChats,
        setActiveChat,
        sendMessage,
        markAsRead,
    } = useMessagesStore();

    const { requests } = useRequestStore();

    // Independent search queries for each tab
    const [chatSearch, setChatSearch] = useState('');
    const [mrSearch, setMrSearch] = useState('');
    const [pbSearch, setPbSearch] = useState('');

    const [activeRequest, setActiveRequest] = useState<ServiceRequest | null>(null);
    const [publications] = useState<Publication[]>([]);
    const [activePublication, setActivePublication] = useState<Publication | null>(null);
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [viewMode, setViewMode] = useState<'CHAT' | 'MR' | 'PB'>('CHAT');

    // Initialize chats on mount
    useEffect(() => {
        if (chats.length === 0) {
            setChats(mockChats);
            setActiveChat(mockChats[0]);
        }
    }, [chats.length, setChats, setActiveChat]);

    // Initial request selection from state
    useEffect(() => {
        if (location.state?.viewMode === 'MR' && location.state?.requestId) {
            const reqId = location.state.requestId;
            setViewMode('MR');
            const request = requests.find(r => r.id === reqId);
            if (request) {
                setActiveRequest(request);
                setShowMobileChat(true);
            }
            // Clear state to prevent re-triggering on local state changes
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, requests, navigate]);

    // Default request selection if none active
    useEffect(() => {
        if (requests.length > 0 && !activeRequest) {
            setActiveRequest(requests[0]);
        }
    }, [requests, activeRequest]);

    // Filter chats based on chat search query and role
    const filteredChats = useMemo(() => {
        const baseChats = chats.filter(chat =>
            chat.contactRole === 'Landlord' || chat.contactRole === 'Maintenance'
        );

        if (!chatSearch) return baseChats;

        const query = chatSearch.toLowerCase();
        return baseChats.filter(
            (chat) =>
                chat.contactName.toLowerCase().includes(query) ||
                chat.contactEmail.toLowerCase().includes(query) ||
                chat.lastMessage.toLowerCase().includes(query) ||
                chat.contactRole.toLowerCase().includes(query)
        );
    }, [chats, chatSearch]);

    // Filter requests based on MR search query
    const filteredRequests = useMemo(() => {
        if (!mrSearch) return requests;

        const query = mrSearch.toLowerCase();
        return requests.filter(
            (req) =>
                req.property.toLowerCase().includes(query) ||
                req.requestId.toLowerCase().includes(query) ||
                req.category.toLowerCase().includes(query) ||
                req.subCategory?.toLowerCase().includes(query) ||
                req.problem?.toLowerCase().includes(query)
        );
    }, [requests, mrSearch]);

    // Filter publications based on PB search query
    const filteredPublications = useMemo(() => {
        if (!pbSearch) return publications;

        const query = pbSearch.toLowerCase();
        return publications.filter(
            (pub) =>
                pub.title.toLowerCase().includes(query) ||
                pub.content.toLowerCase().includes(query) ||
                pub.author.toLowerCase().includes(query)
        );
    }, [publications, pbSearch]);

    // Sort chats: pinned first, then by unread count
    const sortedChats = useMemo(() => {
        return [...filteredChats].sort((a, b) => {
            // Pinned chats first
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;

            // Then sort by unread count
            if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
            if (a.unreadCount === 0 && b.unreadCount > 0) return 1;

            return 0;
        });
    }, [filteredChats]);

    const handleSelectChat = (chat: Chat) => {
        setViewMode('CHAT');
        setActiveChat(chat);
        markAsRead(chat.id);
        setShowMobileChat(true);
    };

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

    const handleSendMessage = (text: string, files?: File[]) => {
        if (!activeChat) return;

        let messageText = text;

        // Handle file attachments
        if (files && files.length > 0) {
            const fileNames = files.map(f => f.name).join(', ');
            messageText = text
                ? `${text}\n\n📎 Attached: ${fileNames}`
                : `📎 Attached: ${fileNames}`;
        }

        sendMessage(activeChat.id, {
            senderId: CURRENT_USER_ID,
            senderName: 'You',
            text: messageText,
        });
    };

    // Helper to get search query and setter based on viewMode
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

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex bg-white flex-1 shadow-lg overflow-hidden font-inter">
                {/* Sidebar - Hidden on mobile when chat is active */}
                <div className={`${showMobileChat ? 'hidden md:flex' : 'flex'} flex-shrink-0`}>
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
                    />
                </div>

                {/* Main Content Area */}
                <div className={`flex-1 flex flex-col ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
                    {viewMode === 'CHAT' ? (
                        activeChat ? (
                            <>
                                <ChatHeader
                                    chat={activeChat}
                                    onBack={handleBackToSidebar}
                                    showBackButton={showMobileChat}
                                />
                                <MessageList chat={activeChat} currentUserId={CURRENT_USER_ID} />
                                <ChatInput onSendMessage={handleSendMessage} />
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                                <MessageSquare className="w-24 h-24 mb-4 text-gray-300" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    No conversation selected
                                </h3>
                                <p className="text-sm text-gray-500 text-center max-w-md px-4">
                                    Choose a conversation from the sidebar to start messaging.
                                </p>
                            </div>
                        )
                    ) : viewMode === 'MR' ? (
                        activeRequest ? (
                            <MaintenanceRequestView
                                request={activeRequest}
                                onBack={handleBackToSidebar}
                            />
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                                <MessageSquare className="w-24 h-24 mb-4 text-gray-300" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    No request selected
                                </h3>
                                <p className="text-sm text-gray-500 text-center max-w-md px-4">
                                    Choose a maintenance request from the sidebar to view details.
                                </p>
                            </div>
                        )
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-[#f8fafc] px-6 text-center">
                            <h3 className="text-xl font-semibold text-[#1e293b] mb-2">No details</h3>
                            <p className="text-sm text-[#64748b] max-w-md">
                                When Landlord adds a publication, you will be able to view it here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
