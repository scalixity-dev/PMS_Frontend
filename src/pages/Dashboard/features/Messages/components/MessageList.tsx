import React, { memo } from 'react';
import type { Chat } from '../types';
import MessageBubble from './MessageBubble';

interface MessageListProps {
    activeChat: Chat;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const MessageList: React.FC<MessageListProps> = ({ activeChat, messagesEndRef }) => {
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
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default memo(MessageList);
