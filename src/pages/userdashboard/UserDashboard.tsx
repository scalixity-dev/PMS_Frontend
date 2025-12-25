import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TransactionTable } from "./components/TransactionTable";
import { LeaseList } from "./components/LeaseList";
import { mockTransactions, mockLeases, tabs } from "./mockData";
import type { TabType } from "./types";
import PrimaryActionButton from "../../components/common/buttons/PrimaryActionButton";

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState<TabType>("Outstanding");

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-screen bg-white p-4 lg:p-8 font-['Urbanist']">
            {/* Left Sidebar */}
            <Sidebar
                userName="Siddak Bagga"
                userEmail="siddakbagga@gmail.com"
                outstanding="0.00"
                deposits="0.00"
                credits="0.00"
            />

            {/* Main Content Area */}
            <div className="flex-1 mt-12">
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row justify-between items-end mb-10 gap-6">
                    {/* Navigation Tabs */}
                    <div className="flex-1 w-full relative">
                        <div className="flex items-end gap-4 border-b-[0.5px] border-[#201F23]/40 w-fit relative">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as TabType)}
                                    className={`relative px-5 py-3 font-bold text-sm transition-all duration-200 ${activeTab === tab
                                        ? "bg-[#8CD74B] text-white rounded-t-2xl z-10"
                                        : "text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <div className="absolute -bottom-[60px] left-[-20%] right-[-20%] h-40 bg-[#8CD74B]/20 blur-[40px] -z-10 pointer-events-none rounded-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 pb-1">
                        <PrimaryActionButton
                            text="Pay Online"
                            className="bg-[#4D7E7D] hover:bg-[#3d6664] rounded-lg font-bold"
                        />
                        <PrimaryActionButton
                            text="Request repair"
                            className="bg-[#8CD74B] hover:bg-[#7bc042] rounded-lg font-bold"
                        />
                    </div>
                </div>

                {/* Data Content */}
                <div className="w-full">
                    {activeTab === "Outstanding" && <TransactionTable transactions={mockTransactions} />}
                    {activeTab === "Leases" && <LeaseList leases={mockLeases} />}
                    {activeTab !== "Outstanding" && activeTab !== "Leases" && (
                        <div className="bg-white rounded-[1rem] p-12 text-center text-gray-400 font-medium shadow-[0px_4px_4px_0px_#00000040] border border-gray-100">
                            Content for {activeTab} coming soon...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
