import { Archive, ChevronLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
    const navigate = useNavigate();
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
        <div className="max-w-6xl mx-auto min-h-screen font-outfit">
            {/* Breadcrumb Feed */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E5E5] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Feed</span>
            </div>

            {/* Main Container */}
            <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-[2rem] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">Notifications</h1>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/settings/notifications')}
                        className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                        aria-label="Notification Settings"
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                </div>

                {/* Header Bar */}
                <div className="bg-[#3A6D6C] rounded-full p-4 flex items-center justify-between text-white shadow-lg mb-8">
                    <div className="bg-white text-[#3A6D6C] px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                        <span className="font-bold text-sm">What's New</span>
                        <Archive size={16} className="text-gray-800" />
                    </div>
                    <button className="text-sm mr-4 font-medium hover:text-white/80 transition-colors">
                        Mark all as read
                    </button>
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    {notifications.map((notification, index) => (
                        <div
                            key={index}
                            onClick={() => handleNotificationClick(notification.type)}
                            className="group relative bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer active:scale-[0.99]"
                        >
                            {/* Teal Left Border */}
                            <div className="absolute left-0 top-0 bottom-0 w-3 bg-[#3A6D6C] rounded-l-xl"></div>

                            <div className="flex justify-between items-start gap-4 pl-4">
                                <div className="space-y-2 max-w-4xl">
                                    <h3 className="text-gray-900 font-bold text-base">
                                        {notification.title}
                                    </h3>
                                    <p className="text-gray-500 text-xs leading-relaxed">
                                        {notification.description}
                                    </p>
                                </div>

                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    {notification.isNew && (
                                        <span className="text-[#3A6D6C] text-xs font-bold animate-pulse">New</span>
                                    )}
                                    <div className="flex flex-col items-end text-right">
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
