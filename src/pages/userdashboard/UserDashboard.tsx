import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardStore } from "./store/dashboardStore";
import { Sidebar } from "./components/layout/Sidebar";
import { TransactionTable } from "./features/Transactions/components/TransactionTable";
import { LeaseList } from "./features/Leases/components/LeaseList";
import { tabs } from "./utils/mockData";
import { calculateOutstandingAmount } from "./utils/financeUtils";
import type { TabType, Transaction, Lease as FrontendLease } from "./utils/types";
import PrimaryActionButton from "../../components/common/buttons/PrimaryActionButton";
import { authService } from "../../services/auth.service";
import { useAuthStore } from "./features/Profile/store/authStore";
import { applicationService } from "../../services/application.service";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import DeleteConfirmationModal from "../../components/common/modals/DeleteConfirmationModal";
import { UserApplicationCard } from "./features/Applications/components/UserApplicationCard";
import { useGetLeasesByTenant } from "../../hooks/useLeaseQueries";
import { useGetTransactions } from "../../hooks/useTransactionQueries";
import { useGetAllApplications } from "../../hooks/useApplicationQueries";




const ITEMS_PER_PAGE = 10;

const UserDashboard = () => {
    const navigate = useNavigate();
    const { activeTab, setActiveTab, setFinances, dashboardStage, setDashboardStage, setRoommates } = useDashboardStore();
    const { userInfo, setUserInfo } = useAuthStore();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [applications, setApplications] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteModalState, setDeleteModalState] = useState<{ isOpen: boolean; targetId?: string }>({ isOpen: false });
    const [errorToast, setErrorToast] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Fetch leases for the tenant
    const { data: backendLeases, isLoading: leasesLoading } = useGetLeasesByTenant(
        userId,
        isAuthenticated === true && !!userId
    );

    // Fetch transactions only if authenticated (will filter by leaseId on frontend)
    const { data: transactionsData } = useGetTransactions();

    // Only fetch applications if authenticated - they're only needed if no active leases
    // We'll determine this after leases load, but start fetching early for better UX
    const shouldFetchApplications = isAuthenticated === true;
    const { data: backendApplications, isLoading: applicationsLoading } = useGetAllApplications(
        shouldFetchApplications
    );


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
                    setUserId(user.userId || null);

                    // Stage detection will handle setting isLoading(false) for successful auth (line 148)
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

    // Transform backend leases to frontend format
    const frontendLeases = useMemo<FrontendLease[]>(() => {
        if (!backendLeases) return [];

        return backendLeases.map((lease) => {
            const sharedTenants = lease.sharedTenants || [];
            const allTenants = [
                lease.tenant ? {
                    id: lease.tenant.id,
                    firstName: lease.tenant.fullName?.split(' ')[0] || '',
                    lastName: lease.tenant.fullName?.split(' ').slice(1).join(' ') || '',
                    email: lease.tenant.email,
                    phone: lease.tenant.phoneNumber || '',
                    avatarSeed: lease.tenant.email
                } : null,
                ...sharedTenants.map((st: any) => ({
                    id: st.tenant.id,
                    firstName: st.tenant.fullName?.split(' ')[0] || '',
                    lastName: st.tenant.fullName?.split(' ').slice(1).join(' ') || '',
                    email: st.tenant.email,
                    phone: '',
                    avatarSeed: st.tenant.email
                }))
            ].filter(Boolean) as any[];

            const propertyAddress = lease.property?.address
                ? `${lease.property.address.streetAddress || ''}, ${lease.property.address.city || ''}, ${lease.property.address.stateRegion || ''}`
                    .replace(/^, |, $/g, '').replace(/, ,/g, ',')
                : 'Address not available';

            return {
                id: lease.id,
                number: lease.id.slice(-8).toUpperCase(),
                startDate: lease.startDate,
                endDate: lease.endDate || '',
                status: lease.status === 'ACTIVE' ? 'Active' : lease.status === 'PENDING' ? 'Pending' : 'Expired',
                property: {
                    name: lease.property?.propertyName || 'Unknown Property',
                    address: propertyAddress
                },
                landlord: {
                    name: 'Property Manager' // Could be enhanced with manager info if available
                },
                tenants: allTenants
            };
        });
    }, [backendLeases]);

    // Filter for active leases
    const activeLeases = useMemo(() => {
        return frontendLeases.filter(l => l.status === 'Active');
    }, [frontendLeases]);

    // Transform backend transactions to frontend format
    // Backend already filters by tenant, so we just need to transform the format
    const frontendTransactions = useMemo<Transaction[]>(() => {
        if (!transactionsData || !Array.isArray(transactionsData)) return [];

        return transactionsData.map((tx: any) => {
            // Backend returns: contact (string), total, balance, dueDate (formatted), status, etc.
            const contactName = tx.contact || 'N/A';
            const initials = contactName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

            const statusMap: Record<string, 'Open' | 'Overdue' | 'Paid' | 'Partial'> = {
                'Pending': 'Open',
                'Paid': 'Paid',
                'Void': 'Open',
                'PARTIALLY_PAID': 'Partial',
                'PENDING': 'Open',
                'PAID': 'Paid',
                'VOID': 'Open',
                'REFUNDED': 'Paid'
            };

            const amount = tx.total || parseFloat(tx.amount || '0');
            const balance = tx.balance || 0;
            const paidAmount = amount - balance;

            // Determine status - backend may already set isOverdue
            let status: 'Open' | 'Overdue' | 'Paid' | 'Partial' = statusMap[tx.status] || 'Open';
            if (tx.isOverdue && status === 'Open') {
                status = 'Overdue';
            } else if (status === 'Open' && tx.dueDateRaw) {
                const dueDate = new Date(tx.dueDateRaw);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                dueDate.setHours(0, 0, 0, 0);
                if (dueDate < today && balance > 0) {
                    status = 'Overdue';
                }
            }

            // Check if it's recurring based on transaction type or other indicators
            const isRecurring = tx.isRecurring || false;

            return {
                id: tx.id,
                status,
                dueDate: tx.dueDate || (tx.dueDateRaw ? new Date(tx.dueDateRaw).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''),
                category: tx.category || 'General',
                contact: {
                    name: contactName,
                    initials,
                    avatarColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`
                },
                amount,
                paidAmount: status === 'Paid' ? amount : paidAmount,
                currency: tx.currency || 'USD',
                schedule: isRecurring ? 'Monthly' : 'One-time'
            };
        });
    }, [transactionsData]);

    // Normalize applications for display
    const normalizedApplications = useMemo(() => {
        if (!backendApplications) return [];

        const normalizeStatus = (status: string): "Approved" | "Rejected" | "Submitted" | "Draft" => {
            const normalized = status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();
            if (['Approved', 'Rejected', 'Submitted', 'Draft'].includes(normalized)) {
                return normalized as "Approved" | "Rejected" | "Submitted" | "Draft";
            }
            return "Submitted";
        };

        return backendApplications.map((app: any) => {
            const primaryApplicant = app.applicants?.find((a: any) => a.isPrimary) || app.applicants?.[0];
            const applicantName = primaryApplicant
                ? `${primaryApplicant.firstName || ''} ${primaryApplicant.middleName || ''} ${primaryApplicant.lastName || ''}`.trim() || "Unknown Applicant"
                : "Unknown Applicant";

            const propertyAddress = app.leasing?.property?.address
                ? typeof app.leasing.property.address === 'string'
                    ? app.leasing.property.address
                    : `${app.leasing.property.address.streetAddress || ''}, ${app.leasing.property.address.city || ''}, ${app.leasing.property.address.stateRegion || ''}`
                        .replace(/^, |, $/g, '').replace(/, ,/g, ',')
                : "Address not available";

            return {
                id: String(app.id),
                name: applicantName,
                status: normalizeStatus(app.status),
                appliedDate: app.createdAt ? app.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
                address: propertyAddress,
                propertyId: app.leasing?.property?.id,
                imageUrl: app.imageUrl || null
            };
        });
    }, [backendApplications]);

    // Detect Stage and set roommates
    useEffect(() => {
        if (!isAuthenticated) return;
        if (leasesLoading || applicationsLoading) return;

        try {
            if (activeLeases.length > 0) {
                setDashboardStage('move_in');

                // Set roommates from active leases
                const primaryLease = activeLeases[0];
                if (primaryLease && primaryLease.tenants) {
                    const currentEmail = userInfo?.email;
                    const otherTenants = primaryLease.tenants
                        .filter((t: any) => t.email !== currentEmail)
                        .map((t: any) => ({
                            id: t.id,
                            firstName: t.firstName,
                            lastName: t.lastName,
                            email: t.email,
                            phone: t.phone || '',
                            avatarSeed: t.avatarSeed || t.email
                        }));
                    setRoommates(otherTenants);
                }
            } else if (normalizedApplications.length > 0) {
                setDashboardStage('application_submitted');
                setActiveTab('Applications');
                setApplications(normalizedApplications);
            } else {
                setDashboardStage('no_lease');
            }
        } catch (error) {
            console.error("Error processing stage data:", error);
            setDashboardStage('error');
            setErrorToast("Failed to load dashboard data. Please try refreshing the page.");
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, activeLeases, normalizedApplications, leasesLoading, applicationsLoading, setDashboardStage, setActiveTab, setRoommates, userInfo?.email]);

    const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE);
    const paginatedApplications = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return applications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [applications, currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleDeleteApplication = async () => {
        const targetId = deleteModalState.targetId;
        if (!targetId) return;

        try {
            await applicationService.delete(String(targetId));

            setApplications(prev => {
                const nextApps = prev.filter(app => String(app.id) !== String(targetId));
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
        if (isAuthenticated && dashboardStage === 'move_in' && frontendTransactions.length > 0) {
            const outstanding = calculateOutstandingAmount(frontendTransactions).toFixed(2);

            // Calculate deposits from active leases
            const totalDeposits = activeLeases.reduce((sum, lease) => {
                const leaseData = backendLeases?.find(l => l.id === lease.id);
                const deposits = leaseData?.deposits || [];
                return sum + deposits.reduce((depSum: number, dep: any) => {
                    return depSum + parseFloat(dep.amount || '0');
                }, 0);
            }, 0);

            setFinances({
                outstanding,
                deposits: totalDeposits.toFixed(2),
                credits: "0.00", // Could be calculated from transactions if needed
            });
        } else if (isAuthenticated) {
            // Reset to 0 for other stages
            setFinances({
                outstanding: "0.00",
                deposits: "0.00",
                credits: "0.00",
            });
        }
    }, [setFinances, isAuthenticated, dashboardStage, frontendTransactions, activeLeases, backendLeases]);


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
            <div className="flex-1 mt-6 lg:mt-12 min-w-0">
                {/* Header Section */}
                {dashboardStage !== 'no_lease' && (
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-8 xl:mb-10 gap-6">
                        {/* Navigation Tabs */}
                        <div className="flex-1 w-full relative overflow-x-auto scrollbar-hide">
                            <div className={`flex items-end gap-1 sm:gap-3 border-b-[0.5px] border-[var(--dashboard-border)] relative ${dashboardStage === 'move_in' ? 'w-full sm:w-fit sm:pr-4' : 'w-fit'}`}>
                                {dashboardStage === 'move_in' ? (
                                    tabs.map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab as TabType)}
                                            className={`relative flex-1 sm:flex-none px-1 sm:px-5 py-2 font-medium text-xs sm:text-base transition-all duration-200 whitespace-nowrap text-center ${activeTab === tab
                                                ? "bg-[var(--dashboard-accent)] text-white rounded-t-2xl z-10"
                                                : "text-gray-400 hover:text-gray-600"
                                                }`}
                                        >
                                            {tab}
                                        </button>

                                    ))
                                ) : (
                                    <button
                                        className="relative flex-1 sm:flex-none px-4 sm:px-5 py-2 font-medium text-sm sm:text-base transition-all duration-200 whitespace-nowrap bg-[var(--dashboard-accent)] text-white rounded-t-2xl z-10"
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


                    {dashboardStage === 'error' && (
                        <div className="flex flex-col items-center justify-center py-32 text-center px-4 bg-red-50/50 rounded-3xl border border-dashed border-red-200">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-500">
                                <X size={40} />
                            </div>
                            <h2 className="text-3xl font-semibold text-gray-900 mb-4 tracking-tight">Something went wrong</h2>
                            <p className="text-lg text-gray-600 max-w-md leading-relaxed">
                                We encountered an error while loading your dashboard data. <br />
                                <span className="text-sm font-medium text-gray-400 mt-2 block">Please try refreshing the page or contact support if the problem persists.</span>
                            </p>
                            <PrimaryActionButton
                                text="Refresh Page"
                                onClick={() => window.location.reload()}
                                className="mt-8 bg-[var(--dashboard-accent)]"
                            />
                        </div>
                    )}


                    {dashboardStage === 'application_submitted' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                {paginatedApplications.map((app) => (
                                    <UserApplicationCard
                                        key={app.id}
                                        app={app}
                                        onDelete={(id) => setDeleteModalState({ isOpen: true, targetId: String(id) })}
                                        onNavigate={() => navigate(app.status === "Draft" ? "/userdashboard/new-application" : `/userdashboard/applications/${app.id}`)}
                                    />
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex justify-center items-center gap-2 pb-10">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-full transition-colors ${currentPage === 1
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <ChevronLeft size={24} />
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${currentPage === page
                                                    ? 'bg-[#7ED957] text-white shadow-lg'
                                                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-full transition-colors ${currentPage === totalPages
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}


                    {dashboardStage === 'move_in' && (
                        <>
                            {activeTab === "Outstanding" && (
                                <TransactionTable
                                    transactions={frontendTransactions.length > 0 ? frontendTransactions : []}
                                />
                            )}
                            {activeTab === "Leases" && (
                                <LeaseList
                                    leases={frontendLeases.length > 0 ? frontendLeases : []}
                                />
                            )}
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

