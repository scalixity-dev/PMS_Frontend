import { ArrowLeft, Printer, Trash2 } from 'lucide-react';
import type { Chat } from '../types';

interface ChatHeaderProps {
    chat: Chat;
    onBack?: () => void;
    showBackButton?: boolean;
    pendingCount?: number;
}

const ChatHeader = ({ chat, onBack, showBackButton = false, pendingCount = 0 }: ChatHeaderProps) => {
    return (
        <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-2 md:py-2.5">
            <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-2 md:gap-3">
                    {showBackButton && (
                        <button
                            onClick={onBack}
                            className="md:hidden p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                        </button>
                    )}

                    <div className="relative">
                        <img
                            src={chat.contactAvatar}
                            alt={chat.contactName}
                            className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover"
                        />
                        {chat.isOnline && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                    </div>

                    <div>
                        <h2 className="font-semibold text-gray-800 text-xs md:text-sm">{chat.contactName}</h2>
                        <p className="text-[10px] md:text-xs text-gray-600">
                            {chat.isOnline ? 'Active now' : chat.contactRole}
                        </p>
                    </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-1 md:gap-2">
                    {pendingCount > 0 && (
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full font-medium">
                            {pendingCount} pending
                        </span>
                    )}
                    <button className="p-1.5 md:p-2.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Print Conversation">
                        <Printer className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-[var(--dashboard-accent)]" />
                    </button>
                    <button className="p-1.5 md:p-2.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Delete Conversation">
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-red-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;

