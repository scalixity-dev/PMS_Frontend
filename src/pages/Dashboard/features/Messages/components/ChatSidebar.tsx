import React, { memo } from 'react';
import { Search, Pin, Check } from 'lucide-react';
import type { Chat } from '../types';
import Avatar from './Avatar';

interface ChatSidebarProps {
    chats: Chat[];
    activeChatId: string;
    onSelectChat: (id: string) => void;
    onTogglePin: (e: React.MouseEvent, id: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
    chats,
    activeChatId,
    onSelectChat,
    onTogglePin,
    searchQuery,
    onSearchChange,
}) => {
    return (
        <div className="w-80 border-r border-gray-100 flex flex-col bg-white print:hidden">
            <div className="px-6 py-6 border-b border-gray-50">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                </div>
                <div className="relative group">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 rounded-lg bg-[#406E66] text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5FA195] transition-all duration-300 shadow-inner"
                    />
                    <Search className="w-5 h-5 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="px-3 space-y-1 pb-4">
                    {chats.length > 0 ? (
                        chats.map((chat) => (
                            <button
                                key={chat.id}
                                onClick={() => onSelectChat(chat.id)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 relative group ${activeChatId === chat.id
                                    ? 'bg-[#E6F3EF] border border-[#A7D8C9] shadow-sm'
                                    : 'hover:bg-gray-50'
                                    } active:scale-[0.98]`}
                            >
                                <div className="relative">
                                    <Avatar
                                        name={chat.name}
                                        className="transition-transform group-hover:scale-105 duration-300"
                                    />
                                    <div className={`absolute top-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${chat.status === 'Active Now' ? 'bg-green-500' : 'bg-gray-300'
                                        }`}></div>
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <p className="text-[14px] font-bold text-gray-900 truncate">{chat.name}</p>
                                            {chat.isPinned && <Pin className="w-3 h-3 fill-[#3D7068] text-[#3D7068] shrink-0" />}
                                        </div>
                                        <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">{chat.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {chat.id === '3' && <Check className="w-3 h-3 text-[#2A7A71]" />}
                                        <p className="text-[11px] text-gray-500 truncate group-hover:text-gray-700 transition-colors">
                                            {chat.lastMessage}
                                        </p>
                                    </div>
                                </div>

                                {/* Pin/Unpin Action Button on Hover */}
                                <button
                                    onClick={(e) => onTogglePin(e, chat.id)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:text-[#3D7068] hover:scale-110 active:scale-95 border border-gray-100"
                                    title={chat.isPinned ? "Unpin Chat" : "Pin Chat"}
                                >
                                    <Pin className={`w-3.5 h-3.5 ${chat.isPinned ? 'fill-[#3D7068] text-[#3D7068]' : 'text-gray-400'}`} />
                                </button>
                            </button>
                        ))
                    ) : (
                        <div className="px-6 py-10 text-sm text-gray-400 text-center italic">
                            No conversations found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(ChatSidebar);
