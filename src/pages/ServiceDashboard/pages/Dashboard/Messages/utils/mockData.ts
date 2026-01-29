import type { Chat } from '../types';
import type { Publication } from '@/pages/userdashboard/utils/types';

export const mockPublications: Publication[] = [
    {
        id: '1',
        title: 'New Service Provider Guidelines',
        content: 'We have updated our internal guidelines for service providers. Please review the new safety protocols when visiting tenant properties.',
        date: new Date(Date.now() - 86400000).toISOString(),
        author: 'Property Management',
    },
    {
        id: '2',
        title: 'Invoicing System Update',
        content: 'Our invoicing portal will be down for maintenance this Sunday from 2 AM to 6 AM. Please plan your submissions accordingly.',
        date: new Date(Date.now() - 172800000).toISOString(),
        author: 'Finance Team',
    },
];

export const mockChats: Chat[] = [
    {
        id: 'chat_1',
        contactName: 'Alice Johnson',
        contactRole: 'Tenant',
        contactEmail: 'alice.j@email.com',
        contactAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Alice%20Johnson&backgroundColor=52D3A2',
        lastMessage: 'Hi, just wanted to check if you are coming today for the sink repair?',
        lastMessageTime: '10:45 AM',
        unreadCount: 1,
        isOnline: true,
        isPinned: true,
        propertyAddress: 'Sunset Apartments, Unit 302',
        messages: [
            {
                id: 'm1',
                senderId: 'tenant-1',
                senderName: 'Alice Johnson',
                text: 'Hi, just wanted to check if you are coming today for the sink repair?',
                timestamp: new Date(Date.now() - 3600000).toISOString(),
                isRead: false,
            },
        ],
    },
    {
        id: 'chat_2',
        contactName: 'Mark Wilson',
        contactRole: 'Property Manager',
        contactEmail: 'mark.wilson@email.com',
        contactAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Mark%20Wilson&backgroundColor=4ECDC4',
        lastMessage: 'I have approved the quote for the roof inspection at Ocean View.',
        lastMessageTime: '09:30 AM',
        unreadCount: 0,
        isOnline: false,
        isPinned: false,
        propertyAddress: 'Ocean View Villa',
        messages: [
            {
                id: 'm1',
                senderId: 'user',
                senderName: 'You',
                text: 'Hi Mark, I have sent the quote for the roof inspection.',
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                isRead: true,
            },
            {
                id: 'm2',
                senderId: 'manager-1',
                senderName: 'Mark Wilson',
                text: 'I have approved the quote for the roof inspection at Ocean View. Please proceed.',
                timestamp: new Date(Date.now() - 85000000).toISOString(),
                isRead: true,
            },
        ],
    },
    {
        id: 'chat_3',
        contactName: 'David Chen',
        contactRole: 'Tenant',
        contactEmail: 'david.c@email.com',
        contactAvatar: 'https://api.dicebear.com/7.x/initials/svg?seed=David%20Chen&backgroundColor=FF6B6B',
        lastMessage: 'The AC is making a strange noise again.',
        lastMessageTime: 'Yesterday',
        unreadCount: 0,
        isOnline: true,
        isPinned: false,
        propertyAddress: 'Downtown Lofts, Unit 105',
        messages: [
            {
                id: 'm1',
                senderId: 'tenant-2',
                senderName: 'David Chen',
                text: 'The AC is making a strange noise again after the last service.',
                timestamp: new Date(Date.now() - 172800000).toISOString(),
                isRead: true,
            },
        ],
    },
];
