import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardStore } from "./store/dashboardStore";
import { Sidebar } from "./components/layout/Sidebar";
import { TransactionTable } from "./features/Transactions/components/TransactionTable";
import { LeaseList } from "./features/Leases/components/LeaseList";
import { mockTransactions, mockLeases, tabs, mockUserInfo, mockFinances } from "./utils/mockData";
import type { TabType } from "./utils/types";
import PrimaryActionButton from "../../components/common/buttons/PrimaryActionButton";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "./features/Profile/store/authStore";

const UserDashboard = () => {
    const navigate = useNavigate();
    const { activeTab, setActiveTab, setFinances } = useDashboardStore();
    const { userInfo, setUserInfo } = useAuthStore();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication and tenant role on mount
    useEffect(() => {
        let isMounted = true;
        
        const checkAuth = async () => {
            try {
                const user = await authService.getCurrentUser();
                
                if (!isMounted) return;
                
                // Verify user is a tenant
                const isTenant = user.role && (
                    user.role.toUpperCase() === 'TENANT' ||
                    user.role.toLowerCase() === 'tenant' ||
                    user.role === 'tenant'
                );
                
                // User must be a tenant and account must be active
                if (isTenant && user.isActive) {
                    setIsAuthenticated(true);
                    setIsLoading(false);
                } else {
                    console.warn('UserDashboard: Access denied - user is not a tenant or account not active');
                    setIsAuthenticated(false);
                    setIsLoading(false);
                }
            } catch (error) {
                if (!isMounted) return;
                
                console.error('UserDashboard: Authentication check failed:', error);
                setIsAuthenticated(false);
                setIsLoading(false);
            }
        };

        checkAuth();
        
        return () => {
            isMounted = false;
        };
    }, []);

    // Load mock data on mount if store is empty (only after authentication)
    useEffect(() => {
        if (isAuthenticated && !userInfo.firstName) {
            setUserInfo(mockUserInfo);
            setFinances(mockFinances);
        }
    }, [setUserInfo, setFinances, userInfo.firstName, isAuthenticated]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--dashboard-accent)]"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect if not authenticated or not a tenant
    if (!isAuthenticated) {
        console.log('UserDashboard: Redirecting to login - user not authenticated or not a tenant');
        navigate("/login", { replace: true });
        return null;
    }

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
                                    className={`relative px-5 py-2 font-medium text-base transition-all duration-200 ${activeTab === tab
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
                            onClick={() => navigate("/userdashboard/new-request")}
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
