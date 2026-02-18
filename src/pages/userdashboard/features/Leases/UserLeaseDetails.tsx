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

interface LeaseUtility {
    id: string;
    utility: string;
    payer: string;
}

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

        const documents = backendLease.documents ?? [];
        const sharedDocuments = documents.filter((d) => d.visibility === 'SHARED');
        const attachments = sharedDocuments.map((doc) => {
            const nameFromUrl = doc.fileUrl?.split('/').pop() ?? '';
            const name = nameFromUrl || `${doc.documentCategory ?? 'Document'} ${doc.id.slice(0, 8)}`;
            const fileType = (doc.fileType ?? '').toLowerCase();
            let type: 'PDF' | 'Image' | 'Document' | 'Video' = 'Document';
            if (fileType.includes('pdf')) type = 'PDF';
            else if (['image/jpeg', 'image/png', 'image/gif', 'image/webp'].some((t) => fileType.includes(t))) type = 'Image';
            else if (fileType.includes('video')) type = 'Video';
            return {
                id: doc.id,
                name,
                size: '—',
                type,
                url: doc.fileUrl
            };
        });

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
            attachments
        };
    }, [backendLease]);

    const leaseUtilities = useMemo<LeaseUtility[]>(() => {
        if (!backendLease || !backendLease.utilities) {
            return [];
        }

        return backendLease.utilities.map((utility): LeaseUtility => ({
            id: utility.id,
            utility: utility.utility,
            payer: utility.payer,
        }));
    }, [backendLease]);

    const getPayerLabel = (payer: string): string => {
        const lower = payer.toLowerCase();

        if (lower === "landlord") {
            return "Paid by landlord";
        }

        if (lower === "tenant") {
            return "Paid by you";
        }

        if (lower === "shared") {
            return "Shared responsibility";
        }

        return payer;
    };

    const getPayerDotClass = (payer: string): string => {
        const lower = payer.toLowerCase();

        if (lower === "landlord") {
            return "bg-emerald-500";
        }

        if (lower === "tenant") {
            return "bg-blue-500";
        }

        if (lower === "shared") {
            return "bg-purple-500";
        }

        return "bg-gray-300";
    };

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
                    <LeaseInsurance
                        ref={insuranceRef}
                        leaseId={id ?? undefined}
                        backendInsurances={backendLease?.insurances ?? []}
                    />
                )}

                {/* Utilities Section */}
                {activeTab === "UTILITIES" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col gap-3 mb-6">
                            <h3 className="text-[18px] font-semibold text-[#1A1A1A]">
                                Utilities &amp; Responsibilities
                            </h3>
                            <p className="text-sm text-gray-500 max-w-2xl">
                                See which utilities are connected to this lease and who is responsible for paying them.
                            </p>
                        </div>

                        {leaseUtilities.length > 0 ? (
                            <div className="bg-[#F4F4F4] rounded-2xl p-6 border border-[#E5E7EB]">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {leaseUtilities.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-9 h-9 rounded-full bg-[#E3EBDE] flex items-center justify-center text-[#3A7D76] text-sm font-semibold">
                                                        {item.utility.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                                            {item.utility}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {getPayerLabel(item.payer)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`w-2.5 h-2.5 rounded-full ${getPayerDotClass(item.payer)}`}
                                                    aria-hidden="true"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                    <span className="font-medium text-gray-600">Legend:</span>
                                    <span className="inline-flex items-center gap-1">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                        Paid by landlord
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                        Paid by you
                                    </span>
                                    <span className="inline-flex items-center gap-1">
                                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                                        Shared responsibility
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-[#F4F4F4] rounded-2xl p-8 min-h-[260px] flex items-center justify-center">
                                <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl px-10 py-8 max-w-md text-center shadow-sm">
                                    <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gray-50 p-3">
                                        <Calendar className="w-6 h-6 text-[#3A7D76]" />
                                    </div>
                                    <h4 className="text-base font-semibold text-gray-900 mb-2">
                                        No utilities configured
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        Your landlord has not configured any utilities for this lease yet. If you have
                                        questions about utility responsibilities, please contact them directly.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaseDetails;
