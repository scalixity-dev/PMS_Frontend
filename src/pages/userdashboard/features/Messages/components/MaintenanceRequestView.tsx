import { useEffect } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import type { ServiceRequest } from '../../../utils/types';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import { useMessagesStore } from '../store/messagesStore';

import { useAuthStore } from '../../Profile/store/authStore';

interface MaintenanceRequestViewProps {
    request: ServiceRequest;
    onBack?: () => void;
}

const MaintenanceRequestView = ({ request, onBack }: MaintenanceRequestViewProps) => {
    const { chats, addChat, sendMessage } = useMessagesStore();
    const { userInfo } = useAuthStore();

    const userEmail = userInfo?.email;
    const firstName = userInfo?.firstName;
    const lastName = userInfo?.lastName;

    const chatId = request.requestId.toString();
    const chat = chats.find((c) => c.id === chatId);
    const messages = chat?.messages || [];

    useEffect(() => {
        if (!userInfo || chat) return;

        const initialMessages = [
            {
                id: '1',
                senderId: userEmail!,
                senderName: `${firstName} ${lastName}`,
                text: `${request.category} / ${request.subCategory} / ${request.problem}\n\nDescription: ${request.description || 'No description provided.'}`,
                timestamp: request.createdAt,
                isRead: true,
            },
            {
                id: '2',
                senderId: request.assignee || 'system',
                senderName: request.assignee || 'System',
                text: 'I have received your request and will look into it shortly.',
                timestamp: new Date(new Date(request.createdAt).getTime() + 3600000).toISOString(),
                isRead: true,
            },
        ];

        addChat({
            id: chatId,
            contactName: request.assignee || 'System',
            contactRole: 'Maintenance',
            contactEmail: '',
            contactAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${request.assignee || 'System'}`,
            lastMessage: initialMessages[1].text,
            lastMessageTime: initialMessages[1].timestamp,
            unreadCount: 0,
            isOnline: false,
            messages: initialMessages,
            propertyAddress: request.property,
        });
    }, [chat, chatId, request, addChat, userEmail, firstName, lastName, userInfo]);

    if (!userInfo) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--dashboard-accent)]"></div>
                <p className="mt-4 text-gray-500">Loading conversation...</p>
            </div>
        );
    }

    const handleSendMessage = (text: string) => {
        sendMessage(chatId, {
            senderId: userEmail!,
            senderName: `${firstName} ${lastName}`,
            text: text,
            isRead: true,
        });
    };

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Header (Matching ChatHeader style) */}
            <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-2 md:py-2.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="md:hidden p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                            </button>
                        )}
                        <div className="flex -space-x-2">
                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-[10px] md:text-xs text-white font-bold ring-2 ring-emerald-50">
                                {firstName?.[0]}{lastName?.[0]}
                            </div>
                            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] md:text-xs text-white font-bold ring-2 ring-emerald-50">
                                {request.assignee ?
                                    request.assignee.split(' ').map(n => n[0]).join('').substring(0, 2)
                                    : 'SY'}
                            </div>
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-800 text-xs md:text-sm">MR # {request.requestId}</h2>
                            <p className="text-[10px] md:text-xs text-[var(--dashboard-accent)] font-medium">
                                Maintenance Conversation
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 md:gap-2">
                        <button className="p-1.5 md:p-2.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Print Request">
                            <Printer className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-[var(--dashboard-accent)]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content (Matching MessageList style) */}
            <div className="flex-1 overflow-y-auto px-3 md:px-4 py-2 md:py-3 bg-gray-50">
                {/* Welcome Section */}
                <div className="flex flex-col items-center py-3 md:py-5 mb-3 md:mb-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-emerald-500 flex items-center justify-center text-lg md:text-xl text-white font-bold mb-2 md:mb-2.5 ring-4 ring-white shadow-lg">
                        MR
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-gray-800">Maintenance Request</h3>
                    <p className="text-xs md:text-sm text-gray-600">{request.property}</p>
                    <div className="mt-2 md:mt-2.5 px-2.5 md:px-3 py-1 md:py-1.5 bg-white rounded-full border border-gray-200">
                        <p className="text-[10px] md:text-xs text-gray-600">
                            Discussion for request #{request.requestId}
                        </p>
                    </div>
                </div>

                {/* Messages */}
                <div className="space-y-1">
                    {messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isOwnMessage={message.senderId === userEmail}
                            contactName={message.senderName}
                            contactAvatar={`https://api.dicebear.com/7.x/initials/svg?seed=${message.senderName}`}
                        />
                    ))}
                </div>
            </div>

            {/* Input (Reusing ChatInput) */}
            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default MaintenanceRequestView;
