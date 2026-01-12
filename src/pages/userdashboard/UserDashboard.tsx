import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardStore } from "./store/dashboardStore";
import { Sidebar } from "./components/layout/Sidebar";
import { TransactionTable } from "./features/Transactions/components/TransactionTable";
import { LeaseList } from "./features/Leases/components/LeaseList";
import { mockTransactions, mockLeases, tabs } from "./utils/mockData";
import { calculateOutstandingAmount } from "./utils/financeUtils";
import type { TabType } from "./utils/types";
import PrimaryActionButton from "../../components/common/buttons/PrimaryActionButton";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "./features/Profile/store/authStore";
import { leasingService } from "../../services/leasing.service";
import { applicationService } from "../../services/application.service";
import { X } from "lucide-react";
import DeleteConfirmationModal from "../../components/common/modals/DeleteConfirmationModal";
import { UserApplicationCard } from "./features/Applications/components/UserApplicationCard";






const UserDashboard = () => {
    const navigate = useNavigate();
    const { activeTab, setActiveTab, setFinances, dashboardStage, setDashboardStage } = useDashboardStore();
    const { setUserInfo } = useAuthStore();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [applications, setApplications] = useState<any[]>([]);
    const [deleteModalState, setDeleteModalState] = useState<{ isOpen: boolean; targetId?: string | number }>({ isOpen: false });
    const [errorToast, setErrorToast] = useState<string | null>(null);


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

                    // Map real user info from authService to store
                    const [firstName, ...lastNameParts] = (user.fullName || "").split(" ");
                    setUserInfo({
                        firstName: firstName || "User",
                        lastName: lastNameParts.join(" ") || "",
                        email: user.email,
                        role: user.role,
                        phone: user.phoneNumber || "",
                        country: user.country || "",
                        city: user.state || "",
                        pincode: user.pincode || "",
                        dob: "1990-01-01", // Default placeholder for missing field
                    });

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

    // Detect Stage
    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchData = async () => {
            try {
                const [leases, apps] = await Promise.all([
                    leasingService.getAll().catch(() => []),
                    applicationService.getAll().catch(() => [])
                ]);

                // Filter for truly active leases
                const activeLeases = leases.filter((l: any) => l.status === 'Active' || l.status === 'ACTIVE');



                if (activeLeases.length > 0) {
                    setDashboardStage('move_in');
                } else if (apps.length > 0) {
                    setDashboardStage('application_submitted');
                    setActiveTab('Applications');

                    // Normalize applications for display
                    const normalizeStatus = (status: string): "Approved" | "Rejected" | "Submitted" | "Draft" => {
                        const normalized = status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();
                        if (['Approved', 'Rejected', 'Submitted', 'Draft'].includes(normalized)) {
                            return normalized as "Approved" | "Rejected" | "Submitted" | "Draft";
                        }
                        return "Submitted";
                    };

                    const apiApps = apps.map((app: any) => {
                        const primaryApplicant = app.applicants?.find((a: any) => a.isPrimary) || app.applicants?.[0];
                        const applicantName = primaryApplicant
                            ? `${primaryApplicant.firstName || ''} ${primaryApplicant.middleName || ''} ${primaryApplicant.lastName || ''}`.trim() || "Unknown Applicant"
                            : "Unknown Applicant";

                        const propertyAddress = app.leasing?.property?.address
                            ? `${app.leasing.property.address.streetAddress || ''}, ${app.leasing.property.address.city || ''}, ${app.leasing.property.address.stateRegion || ''}`
                                .replace(/^, |, $/g, '').replace(/, ,/g, ',')
                            : "Address not available";

                        return {
                            id: app.id,
                            name: applicantName,
                            status: normalizeStatus(app.status),
                            appliedDate: app.createdAt ? app.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
                            address: propertyAddress,
                            propertyId: app.leasing?.property?.id,
                            imageUrl: app.imageUrl || null
                        };
                    });
                    setApplications(apiApps);
                } else {
                    setDashboardStage('no_lease');
                }
            } catch (error) {
                console.error("Error fetching stage data:", error);
            }
        };

        fetchData();
    }, [isAuthenticated, setDashboardStage, setActiveTab]);

    const handleDeleteApplication = async () => {
        const targetId = deleteModalState.targetId;
        if (!targetId) return;

        try {
            await applicationService.delete(String(targetId));

            setApplications(prev => {
                const nextApps = prev.filter(app => app.id !== targetId);
                if (nextApps.length === 0) {
                    setDashboardStage('no_lease');
                }
                return nextApps;
            });
        } catch (error) {
            setErrorToast("Error deleting application");
        } finally {
            setDeleteModalState({ isOpen: false });
        }
    };


    // Load finances on mount if authenticated
    useEffect(() => {
        if (isAuthenticated && dashboardStage === 'move_in') {
            const outstanding = calculateOutstandingAmount(mockTransactions).toFixed(2);
            setFinances({
                outstanding,
                deposits: "45000.00",
                credits: "0.00",
            });
        } else if (isAuthenticated) {
            // Reset to 0 for other stages
            setFinances({
                outstanding: "0.00",
                deposits: "0.00",
                credits: "0.00",
            });
        }
    }, [setFinances, isAuthenticated, dashboardStage]);


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
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 min-h-screen bg-white p-4 lg:p-8">
            {/* Left Sidebar - Profile & Finances */}
            <div className="w-full lg:w-64 lg:shrink-0">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 mt-6 lg:mt-12 overflow-hidden">
                {/* Header Section */}
                {dashboardStage !== 'no_lease' && (
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 xl:mb-10 gap-6">
                        {/* Navigation Tabs */}
                        <div className="flex-1 w-full relative">
                            <div className="flex items-end gap-3 border-b-[0.5px] border-[var(--dashboard-border)] w-max sm:w-fit relative">
                                {dashboardStage === 'move_in' ? (
                                    tabs.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab as TabType)}
                                            className={`relative px-4 sm:px-5 py-2 font-medium text-sm sm:text-base transition-all duration-200 whitespace-nowrap ${activeTab === tab
                                                ? "bg-[var(--dashboard-accent)] text-white rounded-t-2xl z-10"
                                                : "text-gray-400 hover:text-gray-600"
                                                }`}
                                        >
                                            {tab}
                                        </button>

                                    ))
                                ) : (
                                    <button
                                        className="relative px-4 sm:px-5 py-2 font-medium text-sm sm:text-base transition-all duration-200 whitespace-nowrap bg-[var(--dashboard-accent)] text-white rounded-t-2xl z-10"
                                    >
                                        Applications
                                    </button>

                                )}
                            </div>
                        </div>


                        {/* Action Buttons */}
                        {dashboardStage === 'move_in' && (
                            <div className="flex items-center gap-3 sm:gap-4 pb-1 w-full sm:w-auto">
                                <PrimaryActionButton
                                    text="Pay Online"
                                    className="flex-1 sm:flex-none bg-[var(--dashboard-secondary)] hover:opacity-90 rounded-lg font-bold py-2 sm:py-2.5 px-4 sm:px-6"
                                />
                                <PrimaryActionButton
                                    text="Request repair"
                                    onClick={() => navigate("/userdashboard/new-request")}
                                    className="flex-1 sm:flex-none bg-[var(--dashboard-accent)] hover:bg-[var(--dashboard-accent)] hover:opacity-90 rounded-lg font-bold py-2 sm:py-2.5 px-4 sm:px-6"
                                />
                            </div>
                        )}
                    </div>
                )}


                {/* Data Content */}
                <div className={`w-full ${activeTab === "Leases" ? "max-w-2xl" : "max-w-6xl"}`}>
                    {dashboardStage === 'no_lease' && (
                        <div className="flex flex-col items-center justify-center py-32 text-center px-4 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="12" y1="18" x2="12" y2="12" />
                                    <line x1="9" y1="15" x2="15" y2="15" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">No lease</h2>
                            <p className="text-lg text-gray-600 max-w-md leading-relaxed">
                                Your landlord still hasn't shared lease with you. <br />
                                <span className="text-sm font-medium text-gray-400 mt-2 block">Please contact your landlord and ask to share the lease with you.</span>
                            </p>
                        </div>
                    )}


                    {dashboardStage === 'application_submitted' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                            {applications.map((app) => (
                                <UserApplicationCard
                                    key={app.id}
                                    app={app}
                                    onDelete={(id) => setDeleteModalState({ isOpen: true, targetId: id })}
                                    onNavigate={() => navigate(app.status === "Draft" ? "/userdashboard/new-application" : `/userdashboard/applications/${app.id}`)}
                                />
                            ))}
                        </div>
                    )}


                    {dashboardStage === 'move_in' && (
                        <>
                            {activeTab === "Outstanding" && <TransactionTable transactions={mockTransactions} />}
                            {activeTab === "Leases" && <LeaseList leases={mockLeases} />}
                            {activeTab !== "Outstanding" && activeTab !== "Leases" && (
                                <div className="bg-white rounded-[1rem] p-8 sm:p-12 text-center text-gray-400 font-medium shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-gray-100">
                                    Content for {activeTab} coming soon...
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <DeleteConfirmationModal
                isOpen={deleteModalState.isOpen}
                onClose={() => setDeleteModalState({ isOpen: false })}
                onConfirm={handleDeleteApplication}
                title="Withdraw Application"
                message="Are you sure you want to withdraw this application? This action cannot be undone."
                confirmText="Withdraw"
            />
            {errorToast && (
                <div className="fixed bottom-8 right-8 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-4">
                    <span>{errorToast}</span>
                    <button onClick={() => setErrorToast(null)}><X size={16} /></button>
                </div>
            )}
        </div>
    );
};


export default UserDashboard;

