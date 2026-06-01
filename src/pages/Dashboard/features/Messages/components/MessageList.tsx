import React, { memo } from 'react';
import type { Chat, Message } from '../types';
import { CURRENT_USER_ID } from '../types';
import MessageBubble from './MessageBubble';
import Avatar from './Avatar';

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
                        isFailed={Boolean((msg as { isFailed?: boolean }).isFailed)}
                        isRead={isMessageRead(msg)}
                    />
                ))}

                {/* Typing indicator */}
                {activeChat.typingText && (
                    <div className="flex items-end gap-4">
                        <Avatar name={activeChat.name} size="sm" />
                        <div className="flex flex-col gap-1.5 max-w-[70%]">
                            <div className="typing-bubble bg-[#EDF2F1] rounded-2xl rounded-bl-none px-4 py-3 shadow-sm inline-flex items-center gap-1.5 w-fit">
                                <span className="typing-dot" style={{ animationDelay: '0ms' }} />
                                <span className="typing-dot" style={{ animationDelay: '200ms' }} />
                                <span className="typing-dot" style={{ animationDelay: '400ms' }} />
                            </div>
                            <span className="text-[10px] text-gray-500 italic pl-1">{activeChat.typingText}</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default memo(MessageList);
