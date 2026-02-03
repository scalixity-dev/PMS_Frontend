import { useEffect } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import type { ServiceRequest } from '@/pages/userdashboard/utils/types';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';
import { useServiceMessagesStore } from '../store/messagesStore';

const MaintenanceRequestView = ({ request, onBack }: { request: ServiceRequest; onBack?: () => void }) => {
    const { chats, addChat, sendMessage } = useServiceMessagesStore();

    const chatId = request.requestId.toString();
    const chat = chats.find((c) => c.id === chatId);
    const messages = chat?.messages || [];

    useEffect(() => {
        if (chat) return;

        const initialMessages = [
            {
                id: '1',
                senderId: 'tenant',
                senderName: 'Tenant',
                text: `${request.category} / ${request.subCategory} / ${request.problem}\n\nDescription: ${request.description || 'No description provided.'}`,
                timestamp: request.createdAt,
                isRead: true,
            },
            {
                id: '2',
                senderId: 'user',
                senderName: 'You',
                text: 'I have received your request and will look into it shortly.',
                timestamp: new Date(new Date(request.createdAt).getTime() + 3600000).toISOString(),
                isRead: true,
            },
        ];

        addChat({
            id: chatId,
            contactName: 'Tenant',
            contactRole: 'Tenant',
            contactEmail: '',
            contactAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=Tenant`,
            lastMessage: initialMessages[1].text,
            lastMessageTime: initialMessages[1].timestamp,
            unreadCount: 0,
            isOnline: false,
            messages: initialMessages,
            propertyAddress: request.property,
        });
    }, [chat, chatId, request, addChat]);

    const handleSendMessage = (text: string) => {
        sendMessage(chatId, {
            senderId: 'user',
            senderName: 'You',
            text: text,
            isRead: true,
        });
    };

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="bg-white border-b border-gray-200 px-4 py-2.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                        )}
                        <div className="flex -space-x-2">
                            <div className="w-10 h-10 rounded-full bg-[#3A6D6C] border-2 border-white flex items-center justify-center text-xs text-white font-bold">
                                YO
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-xs text-white font-bold">
                                TE
                            </div>
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-800 text-sm">MR # {request.requestId}</h2>
                            <p className="text-xs text-[#3A6D6C] font-semibold">
                                Maintenance Conversation
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Print Request">
                            <Printer className="w-5 h-5 text-gray-600 group-hover:text-[#3A6D6C]" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50">
                <div className="flex flex-col items-center py-5 mb-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-xl text-white font-bold mb-2.5 ring-4 ring-white shadow-lg">
                        MR
                    </div>
                    <h3 className="text-base font-bold text-gray-800">Maintenance Request</h3>
                    <p className="text-sm text-gray-600">{request.property}</p>
                    <div className="mt-2.5 px-3 py-1.5 bg-white rounded-full border border-gray-200">
                        <p className="text-xs text-gray-600 font-medium">
                            Discussion for request #{request.requestId}
                        </p>
                    </div>
                </div>

                <div className="space-y-1">
                    {messages.map((message) => (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isOwnMessage={message.senderId === 'user'}
                            contactName={message.senderName}
                            contactAvatar={`https://api.dicebear.com/7.x/initials/svg?seed=${message.senderName}`}
                        />
                    ))}
                </div>
            </div>

            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
};

export default MaintenanceRequestView;
