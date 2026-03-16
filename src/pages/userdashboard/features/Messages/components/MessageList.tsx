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
        <div className="flex-1 overflow-y-auto px-3 md:px-4 py-2 md:py-3 bg-gray-50">
            {/* Welcome Section */}
            <div className="flex flex-col items-center py-3 md:py-5 mb-3 md:mb-4">
                <img
                    src={chat.contactAvatar}
                    alt={chat.contactName}
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover mb-2 md:mb-2.5 ring-4 ring-white shadow-lg"
                />
                <h3 className="text-sm md:text-base font-bold text-gray-800">{chat.contactName}</h3>
                <p className="text-xs md:text-sm text-gray-600">{chat.contactRole}</p>
                {chat.propertyAddress && (
                    <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">{chat.propertyAddress}</p>
                )}
                <div className="mt-2 md:mt-2.5 px-2.5 md:px-3 py-1 md:py-1.5 bg-white rounded-full border border-gray-200">
                    <p className="text-[10px] md:text-xs text-gray-600">
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
                        isPending={Boolean((message as { isPending?: boolean }).isPending)}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default MessageList;

