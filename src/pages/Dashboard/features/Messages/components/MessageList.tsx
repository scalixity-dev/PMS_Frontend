import React, { memo } from 'react';
import type { Chat, Message } from '../types';
import { CURRENT_USER_ID } from '../types';
import MessageBubble from './MessageBubble';

interface MessageListProps {
    activeChat: Chat;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const MessageList: React.FC<MessageListProps> = ({ activeChat, messagesEndRef }) => {
    const otherLastReadAt = activeChat.otherLastReadAt;

    const isMessageRead = (msg: Message): boolean => {
        if (msg.senderId !== CURRENT_USER_ID) return false;
        if (!otherLastReadAt || !msg.createdAt) return false;
        return new Date(msg.createdAt) <= new Date(otherLastReadAt);
    };

    return (
        <div className="flex-1 flex flex-col overflow-y-auto px-8 py-6 custom-scrollbar print:h-auto print:overflow-visible">
            {/* Welcome section */}
            <div className="flex flex-col items-center mb-10 cursor-default">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome</h3>
                <p className="text-sm text-gray-600 text-center max-w-md">
                    You and <span className="font-bold text-gray-900">{activeChat.name}</span> are now connected on Messenger!
                </p>
            </div>

            {/* Message List */}
            <div className="space-y-8 pb-4">
                {activeChat.messages.map((msg) => (
                    <MessageBubble
                        key={msg.id}
                        message={msg}
                        activeChatName={activeChat.name}
                        isPending={Boolean((msg as { isPending?: boolean }).isPending)}
                        isRead={isMessageRead(msg)}
                    />
                ))}

                {/* Typing indicator */}
                {activeChat.typingText && (
                    <div className="flex items-center gap-3">
                        <div className="bg-[#EDF2F1] rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm">
                            <div className="flex items-center gap-1.5">
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                                <span className="text-[10px] text-gray-500 ml-1 italic">{activeChat.typingText}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default memo(MessageList);
