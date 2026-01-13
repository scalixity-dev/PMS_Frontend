import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Home, User, ArrowLeft } from 'lucide-react';
import { mockLeases } from '../../utils/mockData';
import type { Lease } from '../../utils/types';
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";
import CustomActionDropdown from "../../../Dashboard/components/CustomActionDropdown";
import { LeaseInfoCard } from "./components/LeaseInfoCard";
import { TenantCard } from "./components/TenantCard";
import { LeaseTransactionsTable } from "./components/LeaseTransactionsTable";
import { LeaseInsurance } from "./components/LeaseInsurance";
import { LeaseAgreementsNotices } from "./components/LeaseAgreementsNotices";

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
    const [lease, setLease] = useState<Lease | null>(null);
    const insuranceRef = useRef<{ openModal: () => void }>(null);

    useEffect(() => {
        if (!id) return;

        const foundLease = mockLeases.find(l => l.id === id);
        setLease(foundLease ?? null);
    }, [id]);

    if (!lease) {
        return (
            <div className="flex flex-col items-center justify-center p-10">
                <p>Lease not found or loading...</p>
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
                    <LeaseTransactionsTable />
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
