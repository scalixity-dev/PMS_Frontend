import { useState, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Home, User, ArrowLeft } from 'lucide-react';
import type { Lease } from '../../utils/types';
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";
import CustomActionDropdown from "../../../Dashboard/components/CustomActionDropdown";
import { LeaseInfoCard } from "./components/LeaseInfoCard";
import { TenantCard } from "./components/TenantCard";
import { LeaseTransactionsTable } from "./components/LeaseTransactionsTable";
import { LeaseInsurance } from "./components/LeaseInsurance";
import { LeaseAgreementsNotices } from "./components/LeaseAgreementsNotices";
import { useGetLease } from "../../../../hooks/useLeaseQueries";
import { useGetTransactions } from "../../../../hooks/useTransactionQueries";

// Constants
const DASHBOARD_PATH = "/userdashboard";

// Type-safe tab definition
type LeaseTab =
    | "TENANTS"
    | "TRANSACTIONS"
    | "AGREEMENTS"
    | "INSURANCE"
    | "UTILITIES";

// Tab configuration
const LEASE_TABS: { key: LeaseTab; label: string }[] = [
    { key: "TENANTS", label: "Tenants" },
    { key: "TRANSACTIONS", label: "Leases Transactions" },
    { key: "AGREEMENTS", label: "Agreements & Notices" },
    { key: "INSURANCE", label: "Insurance" },
    { key: "UTILITIES", label: "Utilities" },
];

const LeaseDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<LeaseTab>("TENANTS");
    const insuranceRef = useRef<{ openModal: () => void }>(null);

    // Fetch lease data from backend
    const { data: backendLease, isLoading: leaseLoading, error: leaseError } = useGetLease(id, !!id);
    
    // Fetch transactions to filter by lease
    const { data: transactionsData } = useGetTransactions();

    // Transform backend lease to frontend format
    const lease = useMemo<Lease | null>(() => {
        if (!backendLease) return null;

        const sharedTenants = backendLease.sharedTenants || [];
        const allTenants = [
            backendLease.tenant ? {
                id: backendLease.tenant.id,
                firstName: backendLease.tenant.fullName?.split(' ')[0] || '',
                lastName: backendLease.tenant.fullName?.split(' ').slice(1).join(' ') || '',
                email: backendLease.tenant.email,
                phone: backendLease.tenant.phoneNumber || '',
                avatarSeed: backendLease.tenant.email
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

        const propertyAddress = backendLease.property?.address
            ? `${backendLease.property.address.streetAddress || ''}, ${backendLease.property.address.city || ''}, ${backendLease.property.address.stateRegion || ''}`
                .replace(/^, |, $/g, '').replace(/, ,/g, ',')
            : 'Address not available';

        return {
            id: backendLease.id,
            number: backendLease.id.slice(-8).toUpperCase(),
            startDate: backendLease.startDate,
            endDate: backendLease.endDate || '',
            status: backendLease.status === 'ACTIVE' ? 'Active' : backendLease.status === 'PENDING' ? 'Pending' : 'Expired',
            property: {
                name: backendLease.property?.propertyName || 'Unknown Property',
                address: propertyAddress
            },
            landlord: {
                name: 'Property Manager', // Could be enhanced with manager info if available
                avatarSeed: 'PropertyManager'
            },
            tenants: allTenants,
            attachments: [] // TODO: Map from backend if attachments are available
        };
    }, [backendLease]);

    // Filter transactions for this lease
    const leaseTransactions = useMemo(() => {
        if (!transactionsData || !Array.isArray(transactionsData) || !id) return [];
        return transactionsData.filter((tx: any) => tx.leaseId === id);
    }, [transactionsData, id]);

    // Loading state
    if (leaseLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-10 min-h-screen">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--dashboard-accent)]"></div>
                <p className="mt-4 text-gray-600">Loading lease details...</p>
            </div>
        );
    }

    // Error state
    if (leaseError || !lease) {
        return (
            <div className="flex flex-col items-center justify-center p-10 min-h-screen">
                <p className="text-red-600 mb-4">
                    {leaseError instanceof Error ? leaseError.message : 'Lease not found'}
                </p>
                <button onClick={() => navigate(DASHBOARD_PATH)} className="mt-4 text-blue-500 hover:underline">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 w-full min-h-screen bg-white animate-in fade-in zoom-in-95 duration-300 p-4 lg:p-8">
            {/* Back button */}
            <div>
                <button onClick={() => navigate(DASHBOARD_PATH)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowLeft size={20} />
                    <span>Back to Dashboard</span>
                </button>
            </div>

            {/* Top Section */}
            <div className="flex flex-col xl:flex-row items-start justify-between gap-6">
                <div className="flex flex-col md:flex-row gap-6 w-full xl:w-auto">
                    {/* Lease Date Card */}
                    <LeaseInfoCard
                        icon={Calendar}
                        label={`${lease.startDate} - ${lease.endDate}`}
                        value={`Lease #${lease.number}`}
                        className="min-w-[280px]"
                    />

                    {/* Property Card */}
                    <LeaseInfoCard
                        icon={Home}
                        label="Property"
                        value={lease.property.name}
                    />

                    {/* Landlord Card */}
                    <LeaseInfoCard
                        icon={User}
                        label="Landlord"
                        value={lease.landlord.name}
                    />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    <PrimaryActionButton
                        text="Pay Online"
                        className="bg-[var(--dashboard-secondary)] hover:opacity-90 rounded-lg font-bold"
                    />
                    <CustomActionDropdown
                        buttonLabel="Action"
                        options={[
                            {
                                label: "Add own insurance",
                                onClick: () => {
                                    setActiveTab("INSURANCE");
                                    setTimeout(() => insuranceRef.current?.openModal(), 100);
                                }
                            },
                            {
                                label: "Request repair",
                                onClick: () => navigate(`${DASHBOARD_PATH}/new-request`)
                            }
                        ]}
                    />
                </div>
            </div>

            {/* Tabs & Content */}
            <div className="flex flex-col gap-8">
                {/* Tabs */}
                <div className="border-b border-[#F1F1F1]">
                    <div className="flex flex-wrap gap-4">
                        {LEASE_TABS.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-2 font-medium text-[15px] transition-all relative ${activeTab === tab.key ? "text-white bg-[#7ED957] rounded-t-lg -mb-[1px]" : "text-gray-400 hover:text-gray-600"}`}
                            >
                                {tab.label}
                                {activeTab === tab.key && (
                                    <div className="absolute -bottom-4 left-0 right-0 h-4 bg-[#7ED957] blur-lg opacity-20 -z-10"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tenant Information */}
                {activeTab === "TENANTS" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-[18px] font-semibold text-[#1A1A1A] mb-6 border-b border-[#F1F1F1] pb-4">Tenant Information</h3>

                        <div className="flex flex-wrap gap-6">
                            {lease.tenants.length > 0 ? (
                                lease.tenants.map((tenant) => (
                                    <TenantCard key={tenant.id} tenant={tenant} />
                                ))
                            ) : (
                                <p className="text-gray-500">No tenants found for this lease.</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Lease Transactions */}
                {activeTab === "TRANSACTIONS" && (
                    <LeaseTransactionsTable transactions={leaseTransactions} />
                )}

                {/* Agreements & Notices */}
                {activeTab === "AGREEMENTS" && (
                    <LeaseAgreementsNotices lease={lease} />
                )}

                {/* Insurance Section */}
                {activeTab === "INSURANCE" && (
                    <LeaseInsurance ref={insuranceRef} />
                )}

                {/* Utilities Section */}
                {activeTab === "UTILITIES" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-gray-500 text-center py-12">
                            Utilities information will be available soon.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaseDetails;
