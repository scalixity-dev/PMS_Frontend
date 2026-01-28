export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    text: string;
    time: string;
    reactions?: string[];
}

export type ChatCategory = 'Tenants' | 'Service Providers' | 'Maintenance Requests' | 'Leads';

export interface Chat {
    id: string;
    name: string;
    role: string;
    category: ChatCategory;
    status: string;
    avatar: string;
    lastMessage: string;
    time: string;
    messages: Message[];
    isPinned?: boolean;
}

export const CURRENT_USER_ID = 'me';
