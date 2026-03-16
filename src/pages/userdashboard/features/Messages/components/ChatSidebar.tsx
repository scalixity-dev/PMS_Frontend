import { Search, Lightbulb, Microwave, Trees, AlertCircle, Wrench, ListPlus, MessageCirclePlus } from 'lucide-react';
import type { Chat } from '../types';
import type { ServiceRequest, Publication } from '../../../utils/types';
import { useAuthStore } from '../../Profile/store/authStore';

interface ChatSidebarProps {
    chats: Chat[];
    activeChat: Chat | null;
    requests: ServiceRequest[];
    activeRequest: ServiceRequest | null;
    activeTab: 'CHAT' | 'PB' | 'MR';
    onTabChange: (tab: 'CHAT' | 'PB' | 'MR') => void;
    publications: Publication[];
    activePublication: Publication | null;
    onSelectPublication: (pub: Publication) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onSelectChat: (chat: Chat) => void;
    onSelectRequest: (request: ServiceRequest) => void;
    onNewChat?: () => void;
}

const ChatSidebar = ({
    chats,
    activeChat,
    requests,
    activeRequest,
    activeTab,
    onTabChange,
    publications,
    activePublication,
    onSelectPublication,
    searchQuery,
    onSearchChange,
    onSelectChat,
    onSelectRequest,
    onNewChat,
}: ChatSidebarProps) => {
    const { userInfo } = useAuthStore();

    const formatTime = (time: string) => {
        if (!time) return '';
        if (time.includes('AM') || time.includes('PM')) {
            return time;
        }
        try {
            const date = new Date(time);
            if (Number.isNaN(date.getTime())) return '';
            const now = new Date();
            const isToday = date.getDate() === now.getDate() &&
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear();

            if (isToday) {
                return date.toLocaleString('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true
                });
            }

            const isThisYear = date.getFullYear() === now.getFullYear();
            if (isThisYear) {
                return date.toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'short'
                });
            }

            return date.toLocaleString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: '2-digit'
            });
        } catch (e) {
            return time;
        }
    };

    const getRequestIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'electrical':
                return <Lightbulb className="w-5 h-5 text-emerald-600" />;
            case 'appliances':
                return <Microwave className="w-5 h-5 text-emerald-600" />;
            case 'outdoors':
                return <Trees className="w-5 h-5 text-emerald-600" />;
            case 'maintenance':
                return <Wrench className="w-5 h-5 text-emerald-600" />;
            default:
                return <AlertCircle className="w-5 h-5 text-emerald-600" />;
        }
    };

    const getRoleColor = (role: string) => {
        const colors = {
            'Landlord': 'text-emerald-600 bg-emerald-50',
            'Property Manager': 'text-blue-600 bg-blue-50',
            'Maintenance': 'text-orange-600 bg-orange-50',
            'Co-Tenant': 'text-purple-600 bg-purple-50',
        };
        return colors[role as keyof typeof colors] || 'text-gray-600 bg-gray-50';
    };

    const isPB = activeTab === 'PB';

    return (
        <div className="w-full md:w-96 bg-white border-r border-gray-200 flex flex-col h-full">
            {/* Tab Navigation (Always Visible) */}
            <div className="border-b px-2 md:px-8 pt-2 md:pt-3 border-[#F1F1F1]">
                <div className="flex gap-0 w-full">
                    {(['CHAT', 'PB', 'MR'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => onTabChange(tab)}
                            className={`flex-1 px-2 md:px-3 py-2 md:py-2.5 font-medium text-xs md:text-sm transition-all relative ${activeTab === tab
                                ? 'text-white rounded-t-lg -mb-[1px]'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                            style={
                                activeTab === tab
                                    ? { background: 'linear-gradient(90deg, #1BCB40 10.96%, #7CD947 92.24%)' }
                                    : undefined
                            }
                        >
                            {tab}
                            {activeTab === tab && (
                                <div
                                    className="absolute -bottom-3 left-0 right-0 h-3 blur-lg opacity-20 -z-10"
                                    style={{ background: 'linear-gradient(90deg, #1BCB40 10.96%, #7CD947 92.24%)' }}
                                ></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Publication Count Header (Visible only in PB mode, below tabs) */}
            {isPB && (
                <div className="h-10 md:h-12 flex items-center px-3 md:px-4 border-b border-gray-100 bg-gray-50/30">
                    <h2 className="text-[10px] md:text-xs font-semibold text-gray-600 uppercase tracking-tight">{publications.length} Publications</h2>
                </div>
            )}

            {/* Profile Header (Always Visible as per revert request) */}
            {userInfo && (
                <div className="px-3 md:px-4 pt-4 md:pt-6 pb-3 md:pb-4 border-b border-gray-200 font-inter">
                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userInfo.firstName}`}
                                alt={`${userInfo.firstName} ${userInfo.lastName}`}
                                className="w-full h-full rounded-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
                                {userInfo.firstName} {userInfo.lastName}
                            </h3>
                            <p className="text-[10px] md:text-xs text-gray-500">{userInfo.role}</p>
                            <p className="text-[10px] md:text-xs text-gray-400 truncate">{userInfo.email}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className={`px-3 md:px-4 py-3 md:py-4 border-b border-gray-200`}>
                {activeTab === 'CHAT' && onNewChat && (
                    <div className="flex justify-end mb-2">
                        <button
                            onClick={onNewChat}
                            className="p-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 text-xs font-medium"
                            title="New conversation"
                        >
                            <MessageCirclePlus className="w-4 h-4 inline mr-1" />
                            New chat
                        </button>
                    </div>
                )}
                <div className="relative">
                    <input
                        type="text"
                        placeholder={
                            activeTab === 'CHAT' ? "Find city, address, name" :
                                activeTab === 'MR' ? "Search by property, MR#, problem..." :
                                    "Search publications..."
                        }
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className={`w-full pl-3 pr-9 md:pr-10 py-1.5 md:py-2 rounded-lg text-xs md:text-sm focus:outline-none transition-all bg-white border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    />
                    <Search className={`absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400`} />
                </div>
            </div>

            {/* List Container */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === 'CHAT' ? (
                    chats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <p className="text-sm">No conversations found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {chats.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => onSelectChat(chat)}
                                    className={`w-full p-2.5 md:p-3 hover:bg-gray-50 transition-all duration-200 flex items-start gap-2 md:gap-3 relative ${activeChat?.id === chat.id ? 'bg-[var(--dashboard-accent)]/5 border-l-4 border-[var(--dashboard-accent)]' : ''
                                        }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={chat.contactAvatar}
                                            alt={chat.contactName}
                                            className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover"
                                        />
                                        {chat.isOnline && (
                                            <div className="absolute bottom-0 right-0 w-2 h-2 md:w-2.5 md:h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h3 className="font-semibold text-gray-800 truncate text-xs md:text-sm">
                                                {chat.contactName}
                                            </h3>
                                            <span className="text-[10px] md:text-xs text-gray-500 ml-2 flex-shrink-0">
                                                {formatTime(chat.lastMessageTime)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className={`text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full font-medium ${getRoleColor(chat.contactRole)}`}>
                                                {chat.contactRole}
                                            </span>
                                        </div>
                                        <p className="text-xs md:text-sm text-gray-600 truncate">
                                            {chat.lastMessage}
                                        </p>
                                    </div>

                                    {chat.unreadCount > 0 && (
                                        <div className="flex-shrink-0 flex flex-col items-end">
                                            <span className="bg-[var(--dashboard-accent)] text-white text-[9px] md:text-[10px] font-bold rounded-full w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center">
                                                {chat.unreadCount}
                                            </span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )
                ) : activeTab === 'MR' ? (
                    requests.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <p className="text-sm">No maintenance requests found</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {requests.map((request) => (
                                <button
                                    key={request.id}
                                    onClick={() => onSelectRequest(request)}
                                    className={`w-full p-2.5 md:p-3 hover:bg-gray-50 transition-all duration-200 flex items-start gap-2 md:gap-3 relative ${activeRequest?.id === request.id ? 'bg-[var(--dashboard-accent)]/5 border-l-4 border-[var(--dashboard-accent)]' : ''
                                        }`}
                                >
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                                        {getRequestIcon(request.category)}
                                    </div>

                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h3 className="font-semibold text-gray-800 truncate text-xs md:text-sm">
                                                {request.property}
                                            </h3>
                                            <span className="text-[10px] md:text-xs text-gray-500 ml-2 flex-shrink-0">
                                                {formatTime(request.createdAt)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className="text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full font-medium text-emerald-600 bg-emerald-50">
                                                MR # {request.requestId}
                                            </span>
                                            <span className="text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-full font-medium text-blue-600 bg-blue-50">
                                                {request.category}
                                            </span>
                                        </div>
                                        <p className="text-xs md:text-sm text-gray-600 truncate">
                                            {request.subCategory} / {request.problem}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )
                ) : activeTab === 'PB' ? (
                    publications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                            <div className="w-16 h-16 mb-4 flex items-center justify-center text-gray-300">
                                <ListPlus className="w-12 h-12" />
                            </div>
                            <h3 className="text-lg font-semibold text-[#1e293b] mb-1">No posts</h3>
                            <p className="text-sm text-[#64748b]">
                                Your Landlord hasn't published any posts yet
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {publications.map((pub) => (
                                <button
                                    key={pub.id}
                                    onClick={() => onSelectPublication(pub)}
                                    className={`w-full p-2.5 md:p-3 hover:bg-gray-50 transition-all duration-200 flex flex-col items-start gap-1.5 md:gap-2 relative ${activePublication?.id === pub.id ? 'bg-gray-50' : ''
                                        }`}
                                >
                                    <div className="flex items-center justify-between w-full">
                                        <h3 className="font-semibold text-gray-900 truncate text-xs md:text-sm">
                                            {pub.title}
                                        </h3>
                                        <span className="text-[9px] md:text-[10px] text-gray-400 flex-shrink-0">
                                            {formatTime(pub.date)}
                                        </span>
                                    </div>
                                    <p className="text-[10px] md:text-xs text-gray-600 line-clamp-2 text-left">
                                        {pub.content}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <p className="text-sm">PB feature coming soon</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;
