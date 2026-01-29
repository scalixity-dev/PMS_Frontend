import { Archive, ChevronLeft} from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import ServiceBreadCrumb from '@/pages/ServiceDashboard/components/ServiceBreadCrumb';

interface DashboardContext {
    sidebarCollapsed: boolean;
}

const ServiceNotification = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed } = useOutletContext<DashboardContext>() || { sidebarCollapsed: false };

    const notifications = [
        {
            id: 1,
            title: "New Job Available",
            description: "A new electrical repair job matching your skills is available at Luxury Apartment Complex. Potentially high payout!",
            date: "04/04/19",
            time: "01:44 PM",
            isNew: true,
            type: "job"
        },
        {
            id: 2,
            title: "Message from Property Manager",
            description: "You received a new message regarding the 'Water Leak' job at Downtown Residences.",
            date: "04/04/19",
            time: "10:30 AM",
            isNew: true,
            type: "message"
        },
        {
            id: 3,
            title: "Payout Processed",
            description: "Your payout of $350 for the 'HVAC Repair' job has been processed successfully.",
            date: "04/03/19",
            time: "05:15 PM",
            isNew: false,
            type: "payout"
        },
        {
            id: 4,
            title: "Reminder: Scheduled Maintenance",
            description: "Don't forget your scheduled visit to Sunset Towers tomorrow at 9:00 AM.",
            date: "04/03/19",
            time: "09:00 AM",
            isNew: false,
            type: "calendar"
        }
    ];

    const handleNotificationClick = (type: string) => {
        switch (type) {
            case 'job':
                navigate('/service-dashboard/find-job');
                break;
            case 'message':
                navigate('/service-dashboard/messages');
                break;
            case 'payout':
                navigate('/service-dashboard/accounting');
                break;
            case 'calendar':
                navigate('/service-dashboard/calendar');
                break;
            default:
                break;
        }
    };

    return (
        <div className={`p-6 mx-auto min-h-screen font-outfit transition-all duration-300 ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'}`}>
            {/* Breadcrumb Feed */}
            <div className="mb-6">
                <ServiceBreadCrumb
                    items={[
                        { label: 'Dashboard', to: '/service-dashboard' },
                        { label: 'Notifications', active: true }
                    ]}
                />
            </div>

            {/* Main Container */}
            <div className="p-4 sm:p-6 bg-gray-50 min-h-screen rounded-[2rem] flex flex-col border border-gray-100">

                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    </div>
                    {/* Assuming settings link exists, otherwise prevent navigation or remove */}
                    {/* <button
                        onClick={() => navigate('/service-dashboard/settings')}
                        className="w-full sm:w-auto px-6 py-2 bg-[#7CD947] text-white rounded-full text-sm font-medium hover:bg-[#6BC939] transition-colors shadow-lg shadow-[#7CD947]/30 flex items-center justify-center gap-2"
                        aria-label="Notification Settings"
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button> */}
                </div>

                {/* Header Bar */}
                <div className="bg-[#7CD947] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-white shadow-lg shadow-[#7CD947]/20 mb-8 gap-4">
                    <div className="bg-white text-[#7CD947] px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm w-full sm:w-auto justify-center sm:justify-start">
                        <span className="font-bold text-sm">What's New</span>
                        <Archive size={16} className="text-gray-800" />
                    </div>
                    <button className="text-sm font-medium hover:text-white/80 transition-colors w-full sm:w-auto text-center sm:text-right sm:mr-4">
                        Mark all as read
                    </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {notifications.map((notification, index) => (
                        <div
                            key={index}
                            onClick={() => handleNotificationClick(notification.type)}
                            className="group relative bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer active:scale-[0.99] border border-gray-100"
                        >
                            {/* Green Left Border */}
                            <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#7CD947] rounded-l-xl"></div>

                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pl-4">
                                <div className="space-y-2 max-w-4xl w-full">
                                    <h3 className="text-gray-900 font-bold text-base">
                                        {notification.title}
                                    </h3>
                                    <p className="text-gray-500 text-xs leading-relaxed">
                                        {notification.description}
                                    </p>
                                </div>

                                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-2 flex-shrink-0 border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 mt-1 sm:mt-0">
                                    {notification.isNew && (
                                        <span className="text-[#7CD947] text-xs font-bold animate-pulse order-2 sm:order-1">New</span>
                                    )}
                                    <div className="flex flex-col items-start sm:items-end text-right order-1 sm:order-2">
                                        <div className="text-gray-500 text-sm font-medium">
                                            {notification.date}
                                        </div>
                                        <div className="text-gray-400 text-xs font-medium">
                                            {notification.time}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServiceNotification;
