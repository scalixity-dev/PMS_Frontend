import { Archive, ChevronLeft, Settings } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useGetNotifications, useMarkAllAsRead, useMarkAsRead } from '../../../../hooks/useNotificationQueries';

interface DashboardContext {
    sidebarCollapsed: boolean;
}

const Notification = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed } = useOutletContext<DashboardContext>() || { sidebarCollapsed: false };
    const { data: notificationsData, isLoading } = useGetNotifications();
    const markAllAsRead = useMarkAllAsRead();
    const markAsRead = useMarkAsRead();

    const notifications = notificationsData?.data || [];

    const getTypeFromNotificationType = (type: string): string => {
        const typeMap: Record<string, string> = {
            'MAINTENANCE': 'maintenance',
            'APPLICATION': 'application',
            'PAYMENT': 'payment',
            'LEASE': 'lease',
            'GENERAL': 'general',
            'DOCUMENT': 'document',
            'TEAM': 'team',
            'LISTING': 'listing',
            'SUBSCRIPTION': 'subscription',
            'REMINDER': 'reminder',
        };
        return typeMap[type] || 'general';
    };

    const formatDateTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const dateOnly = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
        const timeOnly = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        return { date: dateOnly, time: timeOnly };
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead.mutate();
    };

    const handleNotificationClick = (notification: any) => {
        // Mark as read if unread
        if (!notification.isRead) {
            markAsRead.mutate(notification.id);
        }

        const type = getTypeFromNotificationType(notification.type);
        switch (type) {
            case 'maintenance':
                navigate('/dashboard/maintenance/requests');
                break;
            case 'application':
                navigate('/dashboard/leasing/applications');
                break;
            case 'payment':
                navigate('/dashboard/accounting/payments');
                break;
            case 'document':
                navigate('/dashboard/documents/file-manager');
                break;
            case 'team':
                navigate('/dashboard/settings/team-management/roles-permissions');
                break;
            case 'listing':
                if (notification.entityId) {
                    navigate(`/dashboard/properties/${notification.entityId}`);
                } else {
                    navigate('/dashboard/properties');
                }
                break;
            case 'subscription':
                navigate('/dashboard/settings/subscription/my-plan');
                break;
            case 'reminder':
                navigate('/dashboard/calendar');
                break;
            default:
                break;
        }
    };


    return (
        <div className={`mx-auto min-h-screen font-outfit transition-all duration-300 ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'}`}>
            {/* Breadcrumb Feed */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E5E5] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Feed</span>
            </div>

            {/* Main Container */}
            <div className="p-4 sm:p-6 bg-[#E0E5E5] min-h-screen rounded-[2rem] flex flex-col">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">Notifications</h1>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/settings/notifications')}
                        className="w-full sm:w-auto px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center justify-center gap-2"
                        aria-label="Notification Settings"
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                </div>

                {/* Header Bar */}
                <div className="bg-[#3A6D6C] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-white shadow-lg mb-8 gap-4">
                    <div className="bg-white text-[#3A6D6C] px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center sm:justify-start">
                        <span className="font-bold text-sm">What's New</span>
                        <Archive size={16} className="text-gray-800" />
                    </div>
                    <button
                        onClick={handleMarkAllAsRead}
                        disabled={markAllAsRead.isPending}
                        className="text-sm font-medium hover:text-white/80 transition-colors w-full sm:w-auto text-center sm:text-right sm:mr-4 disabled:opacity-50"
                    >
                        Mark all as read
                    </button>
                </div>

                {/* Notifications List */}
                {isLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No notifications</div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification: any) => {
                            const { date, time } = formatDateTime(notification.createdAt);
                            return (
                                <div
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className="group relative bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer active:scale-[0.99]"
                                >
                                    {/* Teal Left Border */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-3 ${notification.isRead ? 'bg-gray-300' : 'bg-[#3A6D6C]'} rounded-l-xl`}></div>

                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pl-4">
                                        <div className="space-y-2 max-w-4xl w-full">
                                            <h3 className="text-gray-900 font-bold text-base">
                                                {notification.title}
                                            </h3>
                                            <p className="text-gray-500 text-xs leading-relaxed">
                                                {notification.body}
                                            </p>
                                        </div>

                                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-2 flex-shrink-0 border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 mt-1 sm:mt-0">
                                            {!notification.isRead && (
                                                <span className="text-[#3A6D6C] text-xs font-bold animate-pulse order-2 sm:order-1">New</span>
                                            )}
                                            <div className="flex flex-col items-start sm:items-end text-right order-1 sm:order-2">
                                                <div className="text-gray-500 text-sm font-medium">
                                                    {date}
                                                </div>
                                                <div className="text-gray-400 text-xs font-medium">
                                                    {time}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;
