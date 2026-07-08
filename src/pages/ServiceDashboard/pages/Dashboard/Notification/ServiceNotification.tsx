import { Archive, ChevronLeft } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import ServiceBreadCrumb from '@/pages/ServiceDashboard/components/ServiceBreadCrumb';
import { useGetNotifications, useMarkAllAsRead, useMarkAsRead } from '@/hooks/useNotificationQueries';

interface DashboardContext {
    sidebarCollapsed: boolean;
}

const ServiceNotification = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed } = useOutletContext<DashboardContext>() || { sidebarCollapsed: false };
    const { data: notificationsData, isLoading } = useGetNotifications();
    const markAllAsRead = useMarkAllAsRead();
    const markAsRead = useMarkAsRead();

    const notifications = notificationsData?.data || [];

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

        switch (notification.type) {
            case 'MAINTENANCE':
                if (notification.entityType === 'maintenance_request' && notification.entityId) {
                    navigate(`/service-dashboard/requests/${notification.entityId}`);
                } else {
                    navigate('/service-dashboard/requests');
                }
                break;
            default:
                // GENERAL and other types stay on the feed
                break;
        }
    };

    return (
        <div className={` mx-auto min-h-screen font-outfit transition-all duration-300 ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'}`}>
            {/* Breadcrumb Feed */}
            <div className="mb-4 md:mb-6">
                <ServiceBreadCrumb
                    items={[
                        { label: 'Dashboard', to: '/service-dashboard' },
                        { label: 'Notifications', active: true }
                    ]}
                />
            </div>

            {/* Main Container */}
            <div className="p-4 md:p-6 bg-gray-50 min-h-screen rounded-2xl md:rounded-[2rem] flex flex-col border border-gray-100">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    </div>
                </div>

                {/* Header Bar */}
                <div className="bg-[#7CD947] rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between text-white shadow-lg shadow-[#7CD947]/20 mb-8 gap-4">
                    <div className="bg-white text-[#7CD947] px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm w-full md:w-auto justify-center md:justify-start">
                        <span className="font-bold text-sm">What's New</span>
                        <Archive size={16} className="text-gray-800" />
                    </div>
                    <button
                        onClick={handleMarkAllAsRead}
                        disabled={markAllAsRead.isPending}
                        className="text-sm font-medium hover:text-white/80 transition-colors w-full md:w-auto text-center md:text-right md:mr-4 disabled:opacity-50"
                    >
                        {markAllAsRead.isPending ? 'Marking...' : 'Mark all as read'}
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
                                    className="group relative bg-white rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer active:scale-[0.99] border border-gray-100"
                                >
                                    {/* Green Left Border */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-3 ${notification.isRead ? 'bg-gray-300' : 'bg-[#7CD947]'} rounded-l-xl`}></div>

                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 pl-5 md:pl-6">
                                        <div className="space-y-2 max-w-4xl w-full">
                                            <h3 className="text-gray-900 font-bold text-base">
                                                {notification.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm leading-relaxed">
                                                {notification.body}
                                            </p>
                                        </div>

                                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start w-full md:w-auto gap-2 flex-shrink-0 border-t md:border-t-0 border-gray-100 pt-3 md:pt-0 mt-1 md:mt-0">
                                            {!notification.isRead && (
                                                <span className="text-[#7CD947] text-xs font-bold animate-pulse order-2 md:order-1">New</span>
                                            )}
                                            <div className="flex flex-col items-start md:items-end text-left md:text-right order-1 md:order-2">
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

export default ServiceNotification;
