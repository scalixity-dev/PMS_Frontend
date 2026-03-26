export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: string;
    isRead?: boolean;
    isPending?: boolean;
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
    contactRole: 'Tenant' | 'Property Manager' | 'Admin';
    contactEmail: string;
    contactAvatar: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    isOnline: boolean;
    isPinned?: boolean;
    messages: Message[];
    propertyAddress?: string;
    otherLastReadAt?: string | null;
    typingText?: string;
}
