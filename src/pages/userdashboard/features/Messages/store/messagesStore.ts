import { create } from 'zustand';
import type { Message, ChatStore } from '../types';

export const useMessagesStore = create<ChatStore>((set) => ({
    chats: [],
    activeChat: null,
    searchQuery: '',

    setChats: (chats) => set({ chats }),

    setActiveChat: (chat) => set({ activeChat: chat }),

    setSearchQuery: (query) => set({ searchQuery: query }),

    sendMessage: (chatId, message) => set((state) => {
        const newMessage: Message = {
            ...message,
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            isRead: true,
        };

        const updatedChats = state.chats.map(chat => {
            if (chat.id === chatId) {
                return {
                    ...chat,
                    messages: [...chat.messages, newMessage],
                    lastMessage: message.text,
                    lastMessageTime: new Date().toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                };
            }
            return chat;
        });

        return {
            chats: updatedChats,
            activeChat: state.activeChat?.id === chatId
                ? updatedChats.find(c => c.id === chatId) || state.activeChat
                : state.activeChat
        };
    }),

    markAsRead: (chatId) => set((state) => ({
        chats: state.chats.map(chat =>
            chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        ),
    })),

    togglePin: (chatId) => set((state) => ({
        chats: state.chats.map(chat =>
            chat.id === chatId ? { ...chat, isPinned: !chat.isPinned } : chat
        ),
    })),

    addChat: (chat) => set((state) => {
        if (state.chats.some(c => c.id === chat.id)) {
            return state;
        }
        return { chats: [...state.chats, chat] };
    }),
}));

