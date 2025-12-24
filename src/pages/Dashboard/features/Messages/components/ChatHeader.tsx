import React, { memo } from 'react';
import { Printer, Trash2 } from 'lucide-react';
import type { Chat } from '../types';
import Avatar from './Avatar';

interface ChatHeaderProps {
    activeChat: Chat;
    onPrint: () => void;
    onDelete: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ activeChat, onPrint, onDelete }) => {
    return (
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
            <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer">
                    <Avatar
                        name={activeChat.name}
                        className="transition-transform group-hover:scale-105 duration-300"
                    />
                    <div className={`absolute top-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${activeChat.status === 'Active Now' ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                </div>
                <div>
                    <h2 className="text-base font-bold text-gray-900 hover:text-[#3D7068] transition-colors cursor-pointer">
                        {activeChat.name}
                    </h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                        {activeChat.role}
                    </p>
                    <p className={`text-[11px] font-medium transition-all ${activeChat.status === 'Active Now' ? 'text-[#41C1A6]' : 'text-gray-400'
                        }`}>
                        {activeChat.status}
                    </p>
                </div>
            </div>

            <div className="flex items-center bg-[#8AD241] rounded-full px-4 py-1.5 gap-4 shadow-sm border border-transparent hover:border-[#7ab93a] transition-all print:hidden">
                <button
                    onClick={onPrint}
                    className="text-white hover:scale-110 active:scale-95 transition-transform duration-200"
                    title="Print Chat"
                >
                    <Printer className="w-5 h-5" />
                </button>
                <div className="w-px h-5 bg-white/30"></div>
                <button
                    onClick={onDelete}
                    className="text-white hover:scale-110 active:scale-95 transition-transform duration-200"
                    title="Delete Chat"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default memo(ChatHeader);
