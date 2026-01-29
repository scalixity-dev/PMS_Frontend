import { ArrowLeft, Printer, Trash2 } from 'lucide-react';
import type { Chat } from '../types';

interface ChatHeaderProps {
    chat: Chat;
    onBack?: () => void;
    showBackButton?: boolean;
}

const ChatHeader = ({ chat, onBack, showBackButton = false }: ChatHeaderProps) => {
    return (
        <div className="bg-white border-b border-gray-200 px-4 py-2.5">
            <div className="flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-3">
                    {showBackButton && (
                        <button
                            onClick={onBack}
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                    )}

                    <div className="relative">
                        <img
                            src={chat.contactAvatar}
                            alt={chat.contactName}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        {chat.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                    </div>

                    <div>
                        <h2 className="font-semibold text-gray-800 text-sm">{chat.contactName}</h2>
                        <p className="text-xs text-gray-600">
                            {chat.isOnline ? 'Active now' : chat.contactRole}
                        </p>
                    </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-2">
                    <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Print Conversation">
                        <Printer className="w-5 h-5 text-gray-600 group-hover:text-[#3A6D6C]" />
                    </button>
                    <button className="p-2.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Delete Conversation">
                        <Trash2 className="w-5 h-5 text-gray-600 group-hover:text-red-500" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
