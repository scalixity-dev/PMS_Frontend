import { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import ChatSidebar from './components/ChatSidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import { useServiceMessagesStore } from './store/messagesStore';
import { mockChats } from './utils/mockData';
import type { Chat } from './types';

// Mock currentUser
const CURRENT_USER_ID = 'user';

const ServiceMessages = () => {
    const {
        chats,
        activeChat,
        setChats,
        setActiveChat,
        sendMessage,
        markAsRead,
    } = useServiceMessagesStore();

    const [chatSearch, setChatSearch] = useState('');
    const [showMobileChat, setShowMobileChat] = useState(false);

    // Initialize chats on mount
    useEffect(() => {
        if (chats.length === 0) {
            setChats(mockChats);
            if (!activeChat) {
                setActiveChat(mockChats[0]);
            }
        }
    }, [chats.length, setChats, setActiveChat, activeChat]);

    // Selection handlers
    const handleSelectChat = (chat: Chat) => {
        setActiveChat(chat);
        markAsRead(chat.id);
        setShowMobileChat(true);
    };

    const handleBackToSidebar = () => {
        setShowMobileChat(false);
    };

    const handleSendMessage = (text: string, files?: File[]) => {
        if (!activeChat) return;

        let messageText = text;
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

    const [activeTab, setActiveTab] = useState<'All' | 'MR' | 'PM'>('All');

    // Filter logic
    const filteredChats = useMemo(() => {
        let result = chats;

        // First filter by tab
        if (activeTab === 'MR') {
            result = result.filter((chat) => chat.contactRole === 'Tenant');
        } else if (activeTab === 'PM') {
            result = result.filter((chat) => chat.contactRole === 'Property Manager' || chat.contactRole === 'Admin');
        }

        // Then filter by search query
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

    return (
        <div className={`flex flex-col bg-white mx-auto transition-all duration-300 ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} h-[calc(100vh-4rem)] supports-[height:100dvh]:h-[calc(100dvh-4rem)]`}>
            <div className="flex bg-white flex-1 overflow-hidden font-inter border-x border-gray-100 shadow-sm ">
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
                    />
                </div>

                {/* Content */}
                <div className={`flex-1 flex flex-col ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>
                    {activeChat ? (
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
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No conversation selected</h3>
                            <p className="text-sm text-gray-500">Choose a conversation to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceMessages;
