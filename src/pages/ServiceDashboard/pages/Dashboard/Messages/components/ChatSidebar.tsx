import { Search, Home, User } from 'lucide-react';
import type { Chat } from '../types';

interface ChatSidebarProps {
    chats: Chat[];
    activeChat: Chat | null;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onSelectChat: (chat: Chat) => void;
}

const ChatSidebar = ({
    chats,
    activeChat,
    searchQuery,
    onSearchChange,
    onSelectChat,
}: ChatSidebarProps) => {

    const formatTime = (time: string) => {
        if (!time) return '';
        if (time.includes('AM') || time.includes('PM')) {
            return time;
        }
        try {
            const date = new Date(time);
            return date.toLocaleString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            return time;
        }
    };

    const getRoleColor = (role: string) => {
        const colors = {
            'Tenant': 'text-emerald-600 bg-emerald-50',
            'Property Manager': 'text-blue-600 bg-blue-50',
            'Admin': 'text-purple-600 bg-purple-50',
        };
        return colors[role as keyof typeof colors] || 'text-gray-600 bg-gray-50';
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'Tenant': return <User size={12} />;
            case 'Property Manager': return <Home size={12} />;
            default: return <User size={12} />;
        }
    }

    return (
        <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col h-full">
            {/* Header / Title */}
            <div className="border-b px-6 py-4 border-[#F1F1F1]">
                <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
            </div>

            {/* Search Bar */}
            <div className={`px-4 py-4 border-b border-gray-200`}>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className={`w-full pl-3 pr-10 py-2 rounded-lg text-sm focus:outline-none transition-all bg-white border border-gray-200 focus:ring-2 focus:ring-[#3A6D6C] focus:border-transparent`}
                    />
                    <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`} />
                </div>
            </div>

            {/* List Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {chats.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <p className="text-sm">No conversations found</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {chats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => onSelectChat(chat)}
                                className={`w-full p-3 hover:bg-gray-50 transition-all duration-200 flex items-start gap-3 relative ${activeChat?.id === chat.id ? 'bg-[#3A6D6C]/5 border-l-4 border-[#3A6D6C]' : ''
                                    }`}
                            >
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={chat.contactAvatar}
                                        alt={chat.contactName}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    {chat.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h3 className="font-semibold text-gray-800 truncate text-sm">
                                            {chat.contactName}
                                        </h3>
                                        <span className="text-[10px] text-gray-500 ml-2 flex-shrink-0">
                                            {formatTime(chat.lastMessageTime)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1 uppercase ${getRoleColor(chat.contactRole)}`}>
                                            {getRoleIcon(chat.contactRole)}
                                            {chat.contactRole}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 truncate">
                                        {chat.lastMessage}
                                    </p>
                                </div>

                                {chat.unreadCount > 0 && (
                                    <div className="flex-shrink-0 flex flex-col items-end">
                                        <span className="bg-[#3A6D6C] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                            {chat.unreadCount}
                                        </span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;
