import React, { memo } from 'react';
import { Search, Pin, Check } from 'lucide-react';
import type { Chat, ChatCategory } from '../types';
import Avatar from './Avatar';

interface ChatSidebarProps {
    chats: Chat[];
    activeChatId: string;
    onSelectChat: (id: string) => void;
    onTogglePin: (e: React.SyntheticEvent, id: string) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    selectedCategory: ChatCategory;
    onSelectCategory: (category: ChatCategory) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
    chats,
    activeChatId,
    onSelectChat,
    onTogglePin,
    searchQuery,
    onSearchChange,
    selectedCategory,
    onSelectCategory,
}) => {

    const getCategoryShortForm = (category: ChatCategory) => {
        switch (category) {
            case 'Tenants': return 'TT';
            case 'Service Providers': return 'SP';
            case 'Maintenance Requests': return 'MR';
            case 'Leads': return 'LD';
            default: return (category as string).substring(0, 2).toUpperCase();
        }
    };

    return (
        <div className="w-full md:w-96 h-full border-r border-gray-300 flex bg-white print:hidden">
            {/* Left Category Rail */}
            <div className="w-16 flex-none flex flex-col items-center py-4 border-r border-gray-100 bg-gray-50 gap-3">
                {(['Tenants', 'Service Providers', 'Maintenance Requests', 'Leads'] as ChatCategory[]).map((category) => (
                    <button
                        key={category}
                        onClick={() => onSelectCategory(category)}
                        title={category}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 ${selectedCategory === category
                            ? 'bg-[#3A6D6C] text-white shadow-md scale-105'
                            : 'bg-white text-gray-500 hover:bg-white hover:text-[#3A6D6C] hover:shadow-sm border border-transparent hover:border-gray-200'
                            }`}
                    >
                        {getCategoryShortForm(category)}
                    </button>
                ))}
            </div>

            {/* Right Chat List Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="px-5 py-4 border-b border-gray-50">
                    <div className="flex items-center justify-between mb-3">
                        <h1 className="text-lg font-bold text-gray-900">Messages</h1>
                    </div>
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#406E66] text-white text-xs placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#5FA195] transition-all duration-300 shadow-inner"
                        />
                        <Search className="w-4 h-4 text-gray-300 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-white transition-colors" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="px-3 space-y-1 pb-4 pt-2">
                        {chats.length > 0 ? (
                            chats.map((chat) => (
                                <div
                                    key={chat.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => onSelectChat(chat.id)}
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter' || event.key === ' ') {
                                            event.preventDefault();
                                            onSelectChat(chat.id);
                                        }
                                    }}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-300 relative group cursor-pointer ${activeChatId === chat.id
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
                                                <p className="text-xs font-bold text-gray-900 truncate">{chat.name}</p>
                                                {chat.isPinned && <Pin className="w-3 h-3 fill-[#3D7068] text-[#3D7068] shrink-0" />}
                                            </div>
                                            <span className="text-[9px] text-gray-500 font-medium whitespace-nowrap">{chat.time}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {chat.id === '3' && <Check className="w-2.5 h-2.5 text-[#2A7A71]" />}
                                            <p className="text-[10px] text-gray-500 truncate group-hover:text-gray-700 transition-colors">
                                                {chat.lastMessage}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Pin/Unpin Action Button on Hover */}
                                    <div
                                        role="button"
                                        tabIndex={0}
                                        onClick={(event) => onTogglePin(event, chat.id)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                event.preventDefault();
                                                onTogglePin(event, chat.id);
                                            }
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all hover:text-[#3D7068] hover:scale-110 active:scale-95 border border-gray-100"
                                        title={chat.isPinned ? "Unpin Chat" : "Pin Chat"}
                                    >
                                        <Pin className={`w-3.5 h-3.5 ${chat.isPinned ? 'fill-[#3D7068] text-[#3D7068]' : 'text-gray-400'}`} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-6 py-10 text-sm text-gray-400 text-center italic">
                                No conversations found for {selectedCategory}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(ChatSidebar);
