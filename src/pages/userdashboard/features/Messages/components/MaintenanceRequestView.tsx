import { useState } from 'react';
import { Phone, Video, MoreVertical, Info, ArrowLeft } from 'lucide-react';
import type { ServiceRequest } from '../../../utils/types';
import ChatInput from './ChatInput';
import MessageBubble from './MessageBubble';

interface MaintenanceRequestViewProps {
    request: ServiceRequest;
    onBack?: () => void;
}

const MaintenanceRequestView = ({ request, onBack }: MaintenanceRequestViewProps) => {
    // Mocking messages for the MR conversation
    const [messages, setMessages] = useState([
        {
            id: '1',
            senderId: 'user',
            senderName: 'Siddak Bagga',
            text: `${request.category} / ${request.subCategory} / ${request.problem}\n\nDescription: ${request.description || 'No description provided.'}`,
            timestamp: request.createdAt,
            isRead: true,
        },
        {
            id: '2',
            senderId: 'ashendra',
            senderName: request.assignee,
            text: 'I have received your request and will look into it shortly.',
            timestamp: new Date(new Date(request.createdAt).getTime() + 3600000).toISOString(),
            isRead: true,
        }
    ]);

    const handleSendMessage = (text: string) => {
        const newMessage = {
            id: Date.now().toString(),
            senderId: 'user',
            senderName: 'You',
            text: text,
            timestamp: new Date().toISOString(),
            isRead: true,
        };
        setMessages([...messages, newMessage]);
    };

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Header (Matching ChatHeader style) */}
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
                            <div className="w-10 h-10 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center text-xs text-white font-bold ring-2 ring-emerald-50">
                                SB
                            </div>
                            <div className="w-10 h-10 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-xs text-white font-bold ring-2 ring-emerald-50">
                                AS
                            </div>
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-800 text-sm">MR # {request.requestId}</h2>
                            <p className="text-xs text-[var(--dashboard-accent)] font-medium">
                                Maintenance Conversation
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors group">
                            <Phone className="w-5 h-5 text-gray-600 group-hover:text-[var(--dashboard-accent)]" />
                        </button>
                        <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors group">
                            <Video className="w-5 h-5 text-gray-600 group-hover:text-[var(--dashboard-accent)]" />
                        </button>
                        <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors group">
                            <Info className="w-5 h-5 text-gray-600 group-hover:text-[var(--dashboard-accent)]" />
                        </button>
                        <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors group">
                            <MoreVertical className="w-5 h-5 text-gray-600 group-hover:text-[var(--dashboard-accent)]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content (Matching MessageList style) */}
            <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50">
                {/* Welcome Section */}
                <div className="flex flex-col items-center py-5 mb-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-xl text-white font-bold mb-2.5 ring-4 ring-white shadow-lg">
                        MR
                    </div>
                    <h3 className="text-base font-bold text-gray-800">Maintenance Request</h3>
                    <p className="text-sm text-gray-600">{request.property}</p>
                    <div className="mt-2.5 px-3 py-1.5 bg-white rounded-full border border-gray-200">
                        <p className="text-xs text-gray-600">
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
                            isOwnMessage={message.senderId === 'user'}
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
