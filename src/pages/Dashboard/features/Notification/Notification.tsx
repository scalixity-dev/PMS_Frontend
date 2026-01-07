import { Archive, ChevronLeft, Settings } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';

interface DashboardContext {
    sidebarCollapsed: boolean;
}

const Notification = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed } = useOutletContext<DashboardContext>() || { sidebarCollapsed: false };

    const notifications = [
        {
            id: 1,
            title: "New Maintence Request",
            description: "You received a new maintenance request #1351147 from Siddak Bagga regarding Appliances / Refrigerator / Temperature / Too cold for property bhbh at Silicon City Rd, Indore Division, MP, 452012, IN. Check it out!",
            date: "04/04/19",
            time: "01:44 PM",
            isNew: true,
            type: "maintenance"
        },
        {
            id: 2,
            title: "New Application",
            description: "You received a new application from Siddak Bagga for property Grand Villa at Gandhi Path Rd, Jaipur, RJ, 302020, IN .",
            date: "04/04/19",
            time: "01:44 PM",
            isNew: true,
            type: "application"
        },
        {
            id: 3,
            title: "New Maintence Request",
            description: "You received a new maintenance request #1351147 from Siddak Bagga regarding Appliances / Refrigerator / Temperature / Too cold for property bhbh at Silicon City Rd, Indore Division, MP, 452012, IN. Check it out!",
            date: "04/04/19",
            time: "01:44 PM",
            isNew: true,
            type: "maintenance"
        },
        {
            id: 4,
            title: "New Maintence Request",
            description: "You received a new maintenance request #1351147 from Siddak Bagga regarding Appliances / Refrigerator / Temperature / Too cold for property bhbh at Silicon City Rd, Indore Division, MP, 452012, IN. Check it out!",
            date: "04/04/19",
            time: "01:44 PM",
            isNew: true,
            type: "maintenance"
        }
    ];

    const handleNotificationClick = (type: string) => {
        switch (type) {
            case 'maintenance':
                navigate('/dashboard/maintenance/requests');
                break;
            case 'application':
                navigate('/dashboard/leasing/applications');
                break;
            case 'listing':
                navigate('/dashboard/properties');
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
                            className="group relative bg-white rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer active:scale-[0.99]"
                        >
                            {/* Teal Left Border */}
                            <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#3A6D6C] rounded-l-xl"></div>

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
                                        <span className="text-[#3A6D6C] text-xs font-bold animate-pulse order-2 sm:order-1">New</span>
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

export default Notification;
