import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface UserAccountSettingsLayoutProps {
    children: React.ReactNode;
    activeTab: "Profile" | "My Cards" | "Security" | "Notifications";
}

const UserAccountSettingsLayout: React.FC<UserAccountSettingsLayoutProps> = ({ children, activeTab }) => {
    const navigate = useNavigate();
    const tabs = ["Profile", "My Cards", "Security", "Notifications"];

    const handleTabClick = (tab: string) => {
        if (tab === "Profile") {
            navigate("/userdashboard/settings/account/profile");
        } else if (tab === "My Cards") {
            navigate("/userdashboard/settings/account/cards");
        } else if (tab === "Security") {
            navigate("/userdashboard/settings/account/security");
        } else if (tab === "Notifications") {
            navigate("/userdashboard/settings/account/notifications");
        }
    };

    return (
        <div className="min-h-screen bg-white p-3 md:p-6 lg:p-10">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
                <nav aria-label="Breadcrumb">
                    <ol className="flex items-center flex-wrap gap-2 text-base font-medium">
                        <li>
                            <Link to="/userdashboard" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Dashboard</Link>
                        </li>
                        <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
                        <li>
                            <Link to="/userdashboard/settings" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Settings</Link>
                        </li>
                        <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
                        <li className="text-[#1A1A1A] font-medium" aria-current="page">{activeTab}</li>
                    </ol>
                </nav>

                {/* Main Container with Title and Tabs */}
                <div className="bg-[#F4F4F4] border border-[#E5E7EB] pb-6 md:pb-8 lg:pb-10 rounded-[12px] md:rounded-[16px] lg:rounded-[20px] shadow-[0px_3.68px_3.68px_0px_rgba(0,0,0,0.2)]">
                    <div className="px-3 md:px-4 lg:px-6 py-2.5 md:py-3 border-b border-[#E5E7EB]">
                        <h1 className="text-xl lg:text-2xl font-medium text-[#1A1A1A]">Account settings</h1>
                    </div>

                    <div className="pt-3 md:pt-4 pb-3 md:pb-4">
                        {/* Navigation Tabs */}
                        <div className="mb-3 md:mb-4 border-b-[0.5px] px-3 md:px-4 lg:px-6 border-[#E5E7EB] w-full relative pb-0 overflow-x-auto scrollbar-hide">
                            <div className="flex items-end gap-1 md:gap-2 min-w-max">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => handleTabClick(tab)}
                                        className={`relative px-4 md:px-6 lg:px-8 py-1.5 md:py-2 text-sm md:text-base font-medium transition-all duration-200 whitespace-nowrap ${activeTab === tab
                                            ? "bg-[var(--dashboard-accent)] text-white rounded-t-[8px] md:rounded-t-[10px] lg:rounded-t-[12px] z-10"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="pb-3 md:pb-4 space-y-6 md:space-y-8">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserAccountSettingsLayout;
