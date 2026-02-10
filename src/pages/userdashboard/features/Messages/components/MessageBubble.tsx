import { FileText, Image as ImageIcon, Video } from 'lucide-react';
import type { Message } from '../types';

interface MessageBubbleProps {
    message: Message;
    isOwnMessage: boolean;
    contactName: string;
    contactAvatar: string;
    isPending?: boolean;
}

const MessageBubble = ({ message, isOwnMessage, contactName, contactAvatar, isPending }: MessageBubbleProps) => {
    const formatTime = (timestamp: string) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        if (Number.isNaN(date.getTime())) return '';
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const getAttachmentIcon = (type: string) => {
        switch (type) {
            case 'image':
                return <ImageIcon className="w-4 h-4" />;
            case 'video':
                return <Video className="w-4 h-4" />;
            case 'document':
                return <FileText className="w-4 h-4" />;
            default:
                return <FileText className="w-4 h-4" />;
        }
    };

    return (
        <div className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
            {/* Avatar */}
            {!isOwnMessage && (
                <img
                    src={contactAvatar}
                    alt={contactName}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 shadow-sm"
                />
            )}


            {/* Message Content */}
            <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}>
                {!isOwnMessage && (
                    <span className="text-xs font-medium text-gray-600 mb-1 px-1">
                        {contactName}
                    </span>
                )}

                <div
                    className={`rounded-2xl px-4 py-2.5 ${isOwnMessage
                        ? 'bg-[var(--dashboard-accent)] text-white rounded-br-sm'
                        : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                        }`}
                >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {message.text}
                    </p>

                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                            {message.attachments.map((attachment) => (
                                <div
                                    key={attachment.id}
                                    className={`flex items-center gap-2 p-2 rounded-lg ${isOwnMessage ? 'bg-white/10' : 'bg-white'
                                        }`}
                                >
                                    {getAttachmentIcon(attachment.type)}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">{attachment.name}</p>
                                        <p className="text-xs opacity-70">{attachment.size}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <span className={`text-xs text-gray-500 mt-1 px-1`}>
                    {isPending ? 'Sending...' : formatTime(message.timestamp)}
                    {isOwnMessage && !isPending && message.isRead && (
                        <span className="ml-1 text-[var(--dashboard-accent)]">• Read</span>
                    )}
                </span>
            </div>
        </div>
    );
};

export default MessageBubble;

