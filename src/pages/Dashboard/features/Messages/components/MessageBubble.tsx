import React, { memo } from 'react';
import { Check } from 'lucide-react';
import { type Message, CURRENT_USER_ID } from '../types';
import Avatar from './Avatar';

interface MessageBubbleProps {
    message: Message;
    activeChatName: string;
    isPending?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, activeChatName, isPending }) => {
    const isMe = message.senderId === CURRENT_USER_ID;

    return (
        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} gap-1.5`}>
            {!isMe && (
                <div className="flex items-start gap-4 w-full">
                    <Avatar
                        name={activeChatName}
                        size="sm"
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                    <div className="flex flex-col gap-1.5 max-w-[70%]">
                        <span className="text-[10px] text-gray-400 font-medium">{message.time}</span>
                        <div className="bg-[#EDF2F1] rounded-2xl rounded-tl-none px-3 py-2 text-xs text-gray-800 leading-relaxed shadow-sm hover:shadow-md transition-shadow cursor-default whitespace-pre-wrap">
                            {message.text}
                        </div>
                    </div>
                </div>
            )}

            {isMe && (
                <>
                    <div className="flex items-center gap-2">
                        {isPending ? (
                            <span className="text-[10px] text-amber-600 font-medium">Sending...</span>
                        ) : (
                            <div className="flex">
                                <Check className="w-3.5 h-3.5 text-[#41C1A6]" />
                                <Check className="w-3.5 h-3.5 text-[#41C1A6] -ml-2.5" />
                            </div>
                        )}
                        <span className="text-[10px] text-gray-400 font-medium">{message.time}</span>
                        <span className="text-[11px] font-bold text-gray-900">{message.senderName}</span>
                    </div>
                    <div className="bg-[#3D7068] text-white rounded-2xl rounded-tr-none px-3 py-2 text-xs leading-relaxed max-w-[70%] shadow-sm hover:shadow-md transition-shadow cursor-default whitespace-pre-wrap">
                        {message.text}
                        {message.reactions && message.reactions.length > 0 && (
                            <div className="mt-2 flex justify-end gap-1">
                                {message.reactions.map((r, i) => (
                                    <span
                                        key={`${message.id}-reaction-${i}`}
                                        className="bg-white/10 px-2 py-0.5 rounded-lg text-[10px] font-medium backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer"
                                    >
                                        {r}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default memo(MessageBubble);
