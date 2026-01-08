export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: string;
    isRead?: boolean;
    attachments?: Attachment[];
}

export interface Attachment {
    id: string;
    name: string;
    size: string;
    type: 'image' | 'document' | 'video';
    url: string;
}

export interface Chat {
    id: string;
    contactName: string;
    contactRole: 'Landlord' | 'Property Manager' | 'Maintenance' | 'Co-Tenant';
    contactEmail: string;
    contactAvatar: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isOnline: boolean;
    isPinned?: boolean;
    messages: Message[];
    propertyAddress?: string;
}

export interface ChatStore {
    chats: Chat[];
    activeChat: Chat | null;
    searchQuery: string;
    setChats: (chats: Chat[]) => void;
    setActiveChat: (chat: Chat | null) => void;
    setSearchQuery: (query: string) => void;
    sendMessage: (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => void;
    markAsRead: (chatId: string) => void;
    togglePin: (chatId: string) => void;
}

