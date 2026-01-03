import { useUserDashboardStore } from "./store/userDashboardStore";
import { Sidebar } from "./components/layout/Sidebar";
import { TransactionTable } from "./components/transaction/TransactionTable";
import { LeaseList } from "./components/lease/LeaseList";
import { mockTransactions, mockLeases, tabs } from "./utils/mockData";
import type { TabType } from "./utils/types";
import PrimaryActionButton from "../../components/common/buttons/PrimaryActionButton";

const UserDashboard = () => {
    const { activeTab, setActiveTab } = useUserDashboardStore();

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-screen bg-white p-4 lg:p-8 ">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 mt-12">
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row justify-between items-end mb-10 gap-6">
                    {/* Navigation Tabs */}
                    <div className="flex-1 w-full relative">
                        <div className="flex items-end gap-3 border-b-[0.5px] border-[var(--dashboard-border)] w-fit relative">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as TabType)}
                                    className={`relative px-5 py-2 font-medium text-md transition-all duration-200 ${activeTab === tab
                                        ? "bg-[var(--dashboard-accent)] text-white rounded-t-2xl z-10"
                                        : "text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    {tab}
                                    {activeTab === tab && (
                                        <div className="absolute -bottom-[60px] left-[-20%] right-[-20%] h-40 bg-[var(--dashboard-glow)] blur-[40px] -z-10 pointer-events-none rounded-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 pb-1">
                        <PrimaryActionButton
                            text="Pay Online"
                            className="bg-[var(--dashboard-secondary)] hover:opacity-90 rounded-lg font-bold"
                        />
                        <PrimaryActionButton
                            text="Request repair"
                            className="bg-[var(--dashboard-accent)] hover:bg-[var(--dashboard-accent)] hover:opacity-90 rounded-lg font-bold"
                        />
                    </div>
                </div>

                {/* Data Content */}
                <div className={`w-full ${activeTab === "Leases" ? "max-w-2xl" : "max-w-6xl"}`}>
                    {activeTab === "Outstanding" && <TransactionTable transactions={mockTransactions} />}
                    {activeTab === "Leases" && <LeaseList leases={mockLeases} />}
                    {activeTab !== "Outstanding" && activeTab !== "Leases" && (
                        <div className="bg-white rounded-[1rem] p-12 text-center text-gray-400 font-medium shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-gray-100">
                            Content for {activeTab} coming soon...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
