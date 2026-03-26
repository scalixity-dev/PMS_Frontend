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

    const otherLastReadAt = chat.otherLastReadAt;

    const isOwnMessageRead = (msgTimestamp: string): boolean => {
        if (!otherLastReadAt || !msgTimestamp) return false;
        return new Date(msgTimestamp) <= new Date(otherLastReadAt);
    };

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
                {chat.messages.map((message) => {
                    const isOwn = message.senderId === currentUserId;
                    return (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            isOwnMessage={isOwn}
                            contactName={chat.contactName}
                            contactAvatar={chat.contactAvatar}
                            isPending={Boolean(message.isPending)}
                            isRead={isOwn ? isOwnMessageRead(message.timestamp) : false}
                        />
                    );
                })}

                {/* Typing indicator */}
                {chat.typingText && (
                    <div className="flex gap-3 mb-4">
                        <img
                            src={chat.contactAvatar}
                            alt={chat.contactName}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0 shadow-sm"
                        />
                        <div className="flex flex-col items-start max-w-[70%]">
                            <div className="rounded-2xl px-4 py-2.5 bg-gray-100 rounded-bl-sm">
                                <div className="flex items-center gap-1.5">
                                    <div className="flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                            <span className="text-[10px] text-gray-500 mt-0.5 px-1 italic">{chat.typingText}</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default MessageList;
