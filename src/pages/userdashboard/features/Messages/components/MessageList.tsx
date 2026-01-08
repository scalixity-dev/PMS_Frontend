import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import type { Chat } from '../types';

interface MessageListProps {
    chat: Chat;
    currentUserId: string;
}

const MessageList = ({ chat, currentUserId }: MessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat.messages]);

    return (
        <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50">
            {/* Welcome Section */}
            <div className="flex flex-col items-center py-5 mb-4">
                <img
                    src={chat.contactAvatar}
                    alt={chat.contactName}
                    className="w-16 h-16 rounded-full object-cover mb-2.5 ring-4 ring-white shadow-lg"
                />
                <h3 className="text-base font-bold text-gray-800">{chat.contactName}</h3>
                <p className="text-sm text-gray-600">{chat.contactRole}</p>
                {chat.propertyAddress && (
                    <p className="text-xs text-gray-500 mt-0.5">{chat.propertyAddress}</p>
                )}
                <div className="mt-2.5 px-3 py-1.5 bg-white rounded-full border border-gray-200">
                    <p className="text-xs text-gray-600">
                        You're now connected on Messages
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div className="space-y-1">
                {chat.messages.map((message) => (
                    <MessageBubble
                        key={message.id}
                        message={message}
                        isOwnMessage={message.senderId === currentUserId}
                        contactName={chat.contactName}
                        contactAvatar={chat.contactAvatar}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default MessageList;

