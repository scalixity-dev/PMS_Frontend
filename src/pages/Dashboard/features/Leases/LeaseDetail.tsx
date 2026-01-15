import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, CheckCircle, RefreshCw, XCircle, Edit, FileText, ChevronDown, SquarePen, Upload, Pencil, Clock, Plus, Trash2, Loader2 } from 'lucide-react';
import DetailTabs from '../../components/DetailTabs';
import CustomTextBox from '../../components/CustomTextBox';
import DeleteConfirmationModal from '../../../../components/common/modals/DeleteConfirmationModal';
import EditLeaseTermsModal, { type Lease } from './components/EditLeaseTermsModal';
import AddEditRecurringRentModal from './components/AddEditRecurringRentModal';
import RentScheduleModal from './components/RentScheduleModal';
import EditExtraFeesModal from './components/EditExtraFeesModal';
import PropertyAttachmentsModal from './components/PropertyAttachmentsModal';
import FinancialCard, { type FinancialRecord } from './components/FinancialCard';
import AddInsuranceModal from '../Properties/components/AddInsuranceModal';
import ResponsibilityModal, { type ResponsibilityItem } from '../Properties/components/ResponsibilityModal';
import { useGetLease, useDeleteLease, useUpdateLease } from '../../../../hooks/useLeaseQueries';
import type { BackendLease } from '../../../../services/lease.service';
import Breadcrumb from '../../../../components/ui/Breadcrumb';


const LeaseDetail: React.FC = () => {
    // Helper to map InsuranceData to FinancialRecord for display
    const mapInsuranceToRecord = (data: any): FinancialRecord => {
        return {
            id: data.id,
            headerPills: [
                { label: 'Effective date', value: data.effectiveDate || '-' },
                { label: 'Expiration date', value: data.expirationDate || '-' },
                { label: 'Price', value: data.price ? `₹${data.price} ` : '-' },
            ],
            details: [
                { label: 'Company name', value: data.companyName },
                { label: 'Email notification due to expiration', value: data.emailNotification ? 'Yes' : 'No' },
                { label: 'Phone number', value: data.agentPhone || '-' },
                { label: 'Website', value: data.companyWebsite },
                { label: 'Policy', value: data.policyNumber || '-' },
                { label: 'Details', value: data.details || '-' },
                { label: 'Agent', value: data.agentName || '-' },
                { label: 'Email', value: data.agentEmail || '-' },
            ]
        };
    };

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState('tenants');
    const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEndLeaseModalOpen, setIsEndLeaseModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [tenantImageError, setTenantImageError] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Modal states for recurring rent
    const [isAddEditRecurringRentModalOpen, setIsAddEditRecurringRentModalOpen] = useState(false);
    const [recurringRentModalMode, setRecurringRentModalMode] = useState<'add' | 'edit'>('add');
    const [recurringRentToEdit, setRecurringRentToEdit] = useState<any>(null);
    const [isRentScheduleModalOpen, setIsRentScheduleModalOpen] = useState(false);

    // Modal states for transactions
    const [isDeleteTransactionModalOpen, setIsDeleteTransactionModalOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<any>(null);
    const [recurringTransactions, setRecurringTransactions] = useState<any[]>([]);

    // Modal states for extra fees
    const [isEditExtraFeesModalOpen, setIsEditExtraFeesModalOpen] = useState(false);

    // Modal states for insurance
    const [isAddInsuranceModalOpen, setIsAddInsuranceModalOpen] = useState(false);
    const [editingInsuranceId, setEditingInsuranceId] = useState<string | null>(null);
    const [insurances, setInsurances] = useState<any[]>([]);
    const [isDeleteInsuranceModalOpen, setIsDeleteInsuranceModalOpen] = useState(false);
    const [insuranceToDelete, setInsuranceToDelete] = useState<string | null>(null);

    // Modal states for attachments
    const [isPropertyAttachmentsModalOpen, setIsPropertyAttachmentsModalOpen] = useState(false);
    const [attachments, setAttachments] = useState<{ shared: any[]; private: any[] }>({ shared: [], private: [] });
    const [isDeleteAttachmentModalOpen, setIsDeleteAttachmentModalOpen] = useState(false);
    const [attachmentToDelete, setAttachmentToDelete] = useState<{ type: 'shared' | 'private'; index: number } | null>(null);

    // Modal states for responsibility/utilities
    const [isResponsibilityModalOpen, setIsResponsibilityModalOpen] = useState(false);
    const [responsibilities, setResponsibilities] = useState<ResponsibilityItem[]>([]);

    // Fetch lease data
    const { data: backendLease, isLoading, error } = useGetLease(id);
    const deleteLeaseMutation = useDeleteLease();
    const updateLeaseMutation = useUpdateLease();

    // Helper function to generate initials from name
    const getInitials = (name: string): string => {
        if (!name) return '??';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    // Transform backend lease to frontend format
    const transformLease = (lease: BackendLease): Lease => {
        const formatDate = (dateString: string | null | undefined): string => {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        };

        const formatCurrency = (amount: string | number | null | undefined): string => {
            if (!amount) return '₹0.00';
            const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
            if (isNaN(numAmount)) return '₹0.00';
            return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(numAmount);
        };

        // Format address
        const address = lease.property?.address
            ? `${lease.property.address.streetAddress}, ${lease.property.address.city}, ${lease.property.address.stateRegion} ${lease.property.address.zipCode}, ${lease.property.address.country}`
            : '';

        // Get property image - prefer primary photo, then coverPhotoUrl, then fallback
        const propertyImage = lease.property?.photos?.[0]?.photoUrl
            || lease.property?.coverPhotoUrl
            || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400&h=300';

        // Get tenant image - use profilePhotoUrl from tenantProfile, or null if not available
        const tenantImage = lease.tenant?.tenantProfile?.profilePhotoUrl || null;
        const tenantName = lease.tenant?.fullName || 'Unknown Tenant';
        const tenantInitials = getInitials(tenantName);

        // Get lease number from ID (last 4 characters)
        const leaseNumber = lease.id.slice(-4);

        // Map status
        const statusMap: Record<string, string> = {
            'ACTIVE': 'Active',
            'PENDING': 'Pending',
            'EXPIRED': 'Expired',
            'TERMINATED': 'Terminated',
            'CANCELLED': 'Cancelled',
        };

        // Transform recurring rent
        const recurringRentArray = lease.recurringRent && lease.recurringRent.enabled
            ? [{
                status: lease.status === 'ACTIVE' ? 'Active' : statusMap[lease.status] || 'Pending',
                firstInvoice: formatDate(lease.recurringRent.startOn),
                category: 'Rent',
                totalSchedule: `${formatCurrency(lease.recurringRent.amount)} /${getScheduleAbbreviation(lease.recurringRent.invoiceSchedule)}`,
                nextInvoice: lease.recurringRent.endOn ? formatDate(lease.recurringRent.endOn) : '--'
            }]
            : [];

        // Transform late fees
        const extraFees = lease.lateFees && lease.lateFees.enabled
            ? {
                label: lease.lateFees.scheduleType === 'one-time' ? 'One time' : lease.lateFees.scheduleType === 'daily' ? 'Daily' : 'Both',
                amount: lease.lateFees.oneTimeFeeAmount
                    ? `${formatCurrency(lease.lateFees.oneTimeFeeAmount)} ${lease.lateFees.oneTimeFeeType === 'fixed' ? 'Fixed amount' : lease.lateFees.oneTimeFeeType === 'outstanding' ? 'Outstanding' : 'Recurring'}`
                    : lease.lateFees.dailyFeeAmount
                        ? `${formatCurrency(lease.lateFees.dailyFeeAmount)} Daily fee`
                        : 'No late fees configured'
            }
            : {
                label: 'One time',
                amount: 'No late fees'
            };

        return {
            id: lease.id,
            property: {
                name: lease.property?.propertyName || 'Unknown Property',
                id: lease.propertyId,
                address: address,
                image: propertyImage,
                startDate: formatDate(lease.startDate),
                endDate: formatDate(lease.endDate || undefined)
            },
            lease: `Lease ${leaseNumber}`,
            agreements: {
                requested: 'No' // TODO: Add agreements tracking
            },
            notices: {
                requested: 'No' // TODO: Add notices tracking
            },
            tenant: {
                name: tenantName,
                email: lease.tenant?.email || '',
                image: tenantImage,
                initials: tenantInitials,
                description: `Tenant ID: ${lease.tenantId}${lease.tenant?.phoneNumber ? ` | Phone: ${lease.tenant.phoneNumber}` : ''}`
            },
            extraFees,
            recurringRent: recurringRentArray,
            startDate: lease.startDate,
            endDate: lease.endDate || undefined,
            rentAmount: lease.recurringRent?.amount ? parseFloat(lease.recurringRent.amount) : undefined,
            tenantId: lease.tenantId,
            termNotes: lease.notes || undefined
        };
    };

    // Helper function to get schedule abbreviation
    const getScheduleAbbreviation = (schedule: string): string => {
        const scheduleMap: Record<string, string> = {
            'DAILY': 'D',
            'WEEKLY': 'W',
            'EVERY_TWO_WEEKS': '2W',
            'EVERY_FOUR_WEEKS': '4W',
            'MONTHLY': 'M',
            'EVERY_TWO_MONTHS': '2M',
            'QUARTERLY': 'Q',
            'YEARLY': 'Y'
        };
        return scheduleMap[schedule] || 'M';
    };

    // Transform lease data
    const lease = useMemo(() => {
        if (!backendLease) return null;
        const transformed = transformLease(backendLease);
        // Reset image error state when lease data changes
        setTenantImageError(false);
        return transformed;
    }, [backendLease]);

    // Check if move-in is incomplete (lease status is PENDING)
    const isMoveInIncomplete = useMemo(() => {
        return backendLease?.status === 'PENDING';
    }, [backendLease]);

    // Check if lease is active and can be renewed
    const canRenew = useMemo(() => {
        return backendLease?.status === 'ACTIVE' || backendLease?.status === 'EXPIRED';
    }, [backendLease]);

    const propertyData = lease?.property;
    const propertyDetails = propertyData && typeof propertyData === 'object' ? propertyData : null;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsActionDropdownOpen(false);
            }
        };

        if (isActionDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isActionDropdownOpen]);

    const handleDeleteLease = async () => {
        if (!id) return;

        try {
            await deleteLeaseMutation.mutateAsync(id);
            setIsDeleteModalOpen(false);
            navigate('/dashboard/portfolio/leases');
        } catch (error) {
            console.error('Failed to delete lease:', error);
            alert(error instanceof Error ? error.message : 'Failed to delete lease. Please try again.');
        }
    };

    const handleEndLease = async () => {
        if (!id) return;

        try {
            await updateLeaseMutation.mutateAsync({
                id,
                data: {
                    status: 'TERMINATED' as const,
                    endDate: new Date().toISOString(),
                },
            });
            setIsEndLeaseModalOpen(false);
        } catch (error) {
            console.error('Failed to end lease:', error);
            alert(error instanceof Error ? error.message : 'Failed to end lease. Please try again.');
        }
    };

    const handleUpdateLease = async (data: Lease) => {
        if (!id) return;

        try {
            await updateLeaseMutation.mutateAsync({
                id,
                data: {
                    startDate: data.startDate instanceof Date
                        ? data.startDate.toISOString()
                        : typeof data.startDate === 'string'
                            ? data.startDate
                            : undefined,
                    endDate: data.endDate instanceof Date
                        ? data.endDate.toISOString()
                        : typeof data.endDate === 'string'
                            ? data.endDate
                            : undefined,
                    notes: data.termNotes,
                },
            });
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Failed to update lease:', error);
            alert(error instanceof Error ? error.message : 'Failed to update lease. Please try again.');
        }
    };

    // Handler for saving recurring transactions
    const handleSaveRecurringTransaction = (data: any) => {
        if (recurringRentModalMode === 'add') {
            const newTransaction = {
                id: `trans-${Date.now()}`,
                ...data,
                totalAmount: data.tenants.reduce((sum: number, t: any) => sum + t.amount, 0)
            };
            setRecurringTransactions(prev => [...prev, newTransaction]);
        } else if (recurringRentToEdit) {
            setRecurringTransactions(prev =>
                prev.map(t => t.id === recurringRentToEdit.id ? { ...t, ...data, totalAmount: data.tenants.reduce((sum: number, tenant: any) => sum + tenant.amount, 0) } : t)
            );
        }
        setIsAddEditRecurringRentModalOpen(false);
        setRecurringRentToEdit(null);
    };

    // Handler for deleting a transaction
    const handleDeleteTransaction = () => {
        if (transactionToDelete) {
            setRecurringTransactions(prev => prev.filter(t => t.id !== transactionToDelete.id));
            setIsDeleteTransactionModalOpen(false);
            setTransactionToDelete(null);
        }
    };

    // Handler for saving extra fees
    const handleSaveExtraFees = async (data: any) => {
        if (!id) return;

        try {
            // Map modal data to DTO
            const isOneTimeEnabled = data.oneTimeFee.enabled;
            const isDailyEnabled = data.dailyFee.enabled;
            const scheduleType = isOneTimeEnabled && isDailyEnabled ? 'both'
                : isOneTimeEnabled ? 'one-time'
                    : isDailyEnabled ? 'daily'
                        : null;

            // Helper to map fee type string to backend enum/key
            const mapFeeType = (type: string) => {
                if (type === 'Fixed amount') return 'fixed';
                if (type.includes('outstanding')) return 'outstanding';
                if (type.includes('recurring')) return 'recurring'; // or 'percentage' depending on your backend
                return 'fixed';
            };

            const lateFeesPayload = {
                enabled: isOneTimeEnabled || isDailyEnabled,
                scheduleType,
                oneTimeFee: isOneTimeEnabled ? {
                    type: mapFeeType(data.oneTimeFee.type),
                    amount: parseFloat(data.oneTimeFee.amount),
                    gracePeriodDays: data.gracePeriod.days, // Assuming string like "5 days"
                    time: data.gracePeriod.time
                } : undefined,
                dailyFee: isDailyEnabled ? {
                    type: mapFeeType(data.dailyFee.type),
                    amount: parseFloat(data.dailyFee.amount),
                    maxMonthlyBalance: parseFloat(data.dailyFee.maxBalance),
                    gracePeriod: data.gracePeriod.days,
                    time: data.gracePeriod.time
                } : undefined
            };

            await updateLeaseMutation.mutateAsync({
                id,
                data: {
                    lateFees: lateFeesPayload as any // Type assertion needed due to DTO nuances
                }
            });
            setIsEditExtraFeesModalOpen(false);
        } catch (error) {
            console.error('Failed to update extra fees:', error);
            alert(error instanceof Error ? error.message : 'Failed to update extra fees. Please try again.');
        }
    };

    // Handler for saving insurance
    const handleSaveInsurance = (data: any) => {
        if (editingInsuranceId) {
            setInsurances(prev => prev.map(i => i.id === editingInsuranceId ? { ...i, ...data } : i));
        } else {
            const newInsurance = { id: `ins-${Date.now()}`, ...data };
            setInsurances(prev => [...prev, newInsurance]);
        }
        setIsAddInsuranceModalOpen(false);
        setEditingInsuranceId(null);
    };

    // Handler for deleting insurance
    const handleDeleteInsurance = () => {
        if (insuranceToDelete) {
            setInsurances(prev => prev.filter(i => i.id !== insuranceToDelete));
            setIsDeleteInsuranceModalOpen(false);
            setInsuranceToDelete(null);
        }
    };

    // Handler for deleting attachment
    const handleDeleteAttachment = () => {
        if (attachmentToDelete) {
            const { type, index } = attachmentToDelete;
            setAttachments(prev => ({
                ...prev,
                [type]: prev[type].filter((_, i) => i !== index)
            }));
            setIsDeleteAttachmentModalOpen(false);
            setAttachmentToDelete(null);
        }
    };

    const tabs = [
        { id: 'tenants', label: 'Tenants' },
        { id: 'transactions', label: 'Lease Transactions' },
        { id: 'agreements', label: 'Agreements & Notices' },
        { id: 'insurance', label: 'Insurance' },
        { id: 'utilities', label: 'Utilities' }
    ];

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                    <p className="text-gray-600">Loading lease details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !lease) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800 text-sm">
                        {error instanceof Error ? error.message : 'Failed to load lease details. Please try again.'}
                    </p>
                    <button
                        onClick={() => navigate('/dashboard/portfolio/leases')}
                        className="mt-4 text-red-600 hover:text-red-800 underline text-sm"
                    >
                        Back to Leases
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            {/* Breadcrumb */}
            <div className="mb-6">
                <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Leases', path: '/dashboard/leasing/leases' }, { label: String(lease.lease) }]} />
            </div>

            <div className="p-4 sm:p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem]">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:text-gray-600 transition-colors">
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-bold text-gray-800">{lease.lease}</h1>
                            {isMoveInIncomplete && (
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                                        Move-In Incomplete
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {isMoveInIncomplete && (
                            <button
                                onClick={() => {
                                    navigate('/dashboard/movein', {
                                        state: { leaseId: id, existingLease: backendLease }
                                    });
                                }}
                                className="flex items-center gap-2 px-6 py-2 bg-[#7BD747] text-white rounded-full text-sm font-medium hover:bg-[#6bc63a] transition-colors shadow-sm"
                            >
                                <CheckCircle className="w-4 h-4" />
                                Complete Move-In
                            </button>
                        )}
                        {canRenew && !isMoveInIncomplete && (
                            <button
                                onClick={() => {
                                    // TODO: Implement renew lease functionality
                                    alert('Renew lease functionality coming soon');
                                }}
                                className="flex items-center gap-2 px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Renew Lease
                            </button>
                        )}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsActionDropdownOpen(!isActionDropdownOpen)}
                                className="flex items-center gap-2 px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors"
                            >
                                Action
                                <ChevronDown className={`w - 4 h - 4 transition - transform ${isActionDropdownOpen ? 'rotate-180' : ''} `} />
                            </button>

                            {isActionDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                    {isMoveInIncomplete ? (
                                        <button
                                            onClick={() => {
                                                setIsActionDropdownOpen(false);
                                                navigate('/dashboard/movein', {
                                                    state: { leaseId: id, existingLease: backendLease }
                                                });
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#3A6D6C] hover:bg-[#E0E8E7] transition-colors border-b border-gray-50 font-medium"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Complete Move-In
                                        </button>
                                    ) : canRenew ? (
                                        <button
                                            onClick={() => {
                                                setIsActionDropdownOpen(false);
                                                // TODO: Implement renew lease functionality
                                                alert('Renew lease functionality coming soon');
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-[#3A6D6C] hover:bg-[#E0E8E7] transition-colors border-b border-gray-50 font-medium"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Renew Lease
                                        </button>
                                    ) : null}

                                    <button
                                        onClick={() => {
                                            setIsActionDropdownOpen(false);
                                            setIsEditModalOpen(true);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-50"
                                    >
                                        <Edit className="w-4 h-4" />
                                        Edit
                                    </button>

                                    {!isMoveInIncomplete && (
                                        <button
                                            onClick={() => {
                                                setIsActionDropdownOpen(false);
                                                navigate(`/dashboard/leasing/leases/${id}/end-lease`);
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-orange-600 hover:bg-orange-50 transition-colors border-b border-gray-50"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            End Lease
                                        </button>
                                    )}

                                    <button
                                        onClick={() => {
                                            setIsActionDropdownOpen(false);
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </button>
                                </div >
                            )}
                        </div>
                    </div>
                </div>

                {/* Top Section Cards */}
                < div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" >
                    {/* Property Card */}
                    < div className="bg-white rounded-[2rem] p-4 shadow-sm" >
                        <div className="flex gap-4">
                            <img
                                src={propertyDetails && propertyDetails.image ? propertyDetails.image : 'https://images.unsplash.com/photo-1600596542815-2250c385528b?q=80&w=200&auto=format&fit=crop'}
                                alt={propertyDetails ? propertyDetails.name : (typeof propertyData === 'string' ? propertyData : 'Property')}
                                className="w-24 h-24 rounded-2xl object-cover"
                            />
                            <div className="flex flex-col gap-2 flex-1">
                                <h3 className="font-bold text-gray-800 text-sm">
                                    {propertyDetails ? propertyDetails.name : (propertyData as string)}
                                </h3>
                                <div className="w-full min-w-0">
                                    <CustomTextBox
                                        value={propertyDetails ? (propertyDetails.address || '') : ''}
                                        onChange={() => { }}
                                        label=""
                                        placeholder="Address"
                                        multiline={true}
                                        className="bg-[#E0E8E7] py-1 w-full"
                                        valueClassName="text-[10px] text-gray-600 line-clamp-2 leading-tight"
                                    />
                                </div>

                                <button
                                    onClick={() => propertyDetails && propertyDetails.id ? navigate(`/dashboard/properties/${String(propertyDetails.id)}`) : null}
                                    className={`bg-[#3A6D6C] text-white text-xs py-1.5 px-4 rounded-full w-fit hover:bg-[#2c5251] transition-colors ${(!propertyDetails || !propertyDetails.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={!propertyDetails || !propertyDetails.id}
                                >
                                    View Property
                                </button>
                                <div className="flex gap-2 text-[10px] text-white font-medium">
                                    <div className="bg-[#3A6D6C] px-2 py-1 rounded-full">
                                        {propertyDetails ? (propertyDetails.startDate || 'N/A') : 'N/A'}
                                    </div>
                                    <span className="text-gray-400 py-1">to</span>
                                    <div className="bg-[#3A6D6C] px-2 py-1 rounded-full">
                                        {propertyDetails ? (propertyDetails.endDate || 'N/A') : 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >

                    {/* Lease Agreements Card */}
                    < div className="bg-[#3ACBA4] text-white rounded-[2rem] p-6 shadow-sm flex flex-col justify-between" >
                        <div>
                            <h3 className="font-bold mb-2">Lease agreements</h3>
                            <p className="text-xs opacity-90 mb-4 leading-relaxed">
                                Build a lease addendum, get a state-specific agreement, and request an electronic signature.
                            </p>
                        </div>
                        <div>
                            <button
                                onClick={() => navigate(`/dashboard/leasing/leases/${id}/send-agreement`)}
                                className="bg-[#2B5251] text-white text-xs py-1.5 px-4 rounded-full hover:bg-opacity-90 transition-colors mb-4"
                            >
                                Request
                            </button>
                            <div className="bg-white/90 rounded-full px-4 py-2 flex justify-between items-center text-xs text-gray-700">
                                <span className="font-medium">Lease agreements requested</span>
                                <span className="font-bold">{lease.agreements.requested}</span>
                            </div>
                        </div>
                    </div >

                    {/* Notices Card */}
                    < div className="bg-[#3ACBA4] text-white rounded-[2rem] p-6 shadow-sm flex flex-col justify-between" >
                        <div>
                            <h3 className="font-bold mb-2">Notices</h3>
                            <p className="text-xs opacity-90 mb-4 leading-relaxed">
                                Easily prepare and send notices through our ready-to-use templates, then request a quick digital signature from your tenant.
                            </p>
                        </div>
                        <div>
                            <button
                                onClick={() => navigate(`/dashboard/leasing/leases/${id}/send-notice`)}
                                className="bg-[#2B5251] text-white text-xs py-1.5 px-4 rounded-full hover:bg-opacity-90 transition-colors mb-4"
                            >
                                Send
                            </button>
                            <div className="bg-white/90 rounded-full px-4 py-2 flex justify-between items-center text-xs text-gray-700">
                                <span className="font-medium">Notices requested</span>
                                <span className="font-bold">{lease.notices.requested}</span>
                            </div>
                        </div>
                    </div >
                </div >

                {/* Tabs */}
                < DetailTabs
                    tabs={tabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                />


                {/* Tab Content - Tenants */}
                {
                    activeTab === 'tenants' && (
                        <div className="space-y-6">
                            {/* Tenant Information Section */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-4 cursor-pointer">
                                    <h2 className="text-lg font-bold text-gray-800">Tenant information</h2>
                                    <ChevronDown className="w-5 h-5 text-gray-800" />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#F0F0F6] rounded-lg p-6">
                                    {/* Tenant Profile Card */}
                                    <div className="bg-[#7BD747] rounded-lg p-6 flex flex-col items-center text-center shadow-sm h-full">
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white mb-3 flex items-center justify-center bg-white/20">
                                            {lease.tenant.image && !tenantImageError ? (
                                                <img
                                                    src={lease.tenant.image}
                                                    alt={lease.tenant.name}
                                                    className="w-full h-full object-cover"
                                                    onError={() => setTenantImageError(true)}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-white font-bold text-xl">
                                                    {lease.tenant.initials || '??'}
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-white font-bold text-lg mb-1">{lease.tenant.name}</h3>
                                        <p className="text-white/90 text-xs">{lease.tenant.email}</p>
                                    </div>

                                    {/* Details Section */}
                                    <div className="lg:col-span-2">
                                        <CustomTextBox
                                            value={lease.tenant.description}
                                            onChange={() => { }}
                                            multiline={true}
                                            className="w-full h-full rounded-lg p-6 items-start"
                                            valueClassName="text-sm pl-0 w-full block"
                                        />
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex justify-center lg:col-span-3">
                                        <div className="bg-[#b5e39e] text-[#3D7475] text-xs font-bold px-5 py-3 rounded-full w-min">
                                            Pending
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Dependents Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-4 cursor-pointer">
                                    <h2 className="text-lg font-bold text-gray-800">Dependents</h2>
                                    <ChevronDown className="w-5 h-5 text-gray-800" />
                                </div>

                                <div className="bg-[#F0F2F5] rounded-[2rem] p-12 flex flex-col items-center justify-center text-center shadow-inner min-h-[200px]">
                                    <div className="bg-white p-3 rounded-xl mb-3 shadow-sm">
                                        <FileText className="w-6 h-6 text-[#3A6D6C]" />
                                    </div>
                                    <h3 className="text-[#3A6D6C] font-semibold mb-1">No dependents added</h3>
                                    <p className="text-gray-500 text-xs text-center max-w-xs">
                                        Tenant does not have any dependents.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                }

                {/* Tab Content - Lease Transactions */}
                {
                    activeTab === 'transactions' && (
                        <div className="space-y-8">
                            {/* Recurring Rent */}
                            <div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 sm:gap-0">
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <h2 className="text-lg font-bold text-gray-800">Recurring Rent</h2>
                                        <ChevronDown className="w-5 h-5 text-gray-800" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => {
                                                const existingData = {
                                                    tenants: [{ name: lease.tenant.name, amount: lease.rentAmount || 0 }],
                                                    frequency: 'Monthly',
                                                    dueDay: '1st',
                                                    isEnabled: true
                                                };
                                                setRecurringRentToEdit(existingData);
                                                setRecurringRentModalMode('edit');
                                                setIsAddEditRecurringRentModalOpen(true);
                                            }}
                                            className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                                        >
                                            <Pencil className="w-3 h-3" />
                                            Edit recurring rent
                                        </button>
                                        <button
                                            onClick={() => setIsRentScheduleModalOpen(true)}
                                            className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                                        >
                                            <Clock className="w-3 h-3" />
                                            Schedule amount update
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-[#F0F2F5] rounded-[1.5rem] overflow-hidden shadow-sm">
                                    {/* Table Header */}
                                    <div className="bg-[#3A6D6C] text-white px-6 py-4 hidden md:grid grid-cols-5 text-xs font-semibold text-center">
                                        <div>Status</div>
                                        <div>First invoice</div>
                                        <div>Category</div>
                                        <div>Next invoice</div>
                                        <div>Total & Schedule</div>
                                    </div>
                                    {/* Table Body */}
                                    <div className="p-2">
                                        {lease.recurringRent.length > 0 ? (
                                            lease.recurringRent.map((rent: any, index: number) => (
                                                <div key={index} className="bg-white rounded-xl px-6 py-4 shadow-sm mb-2 last:mb-0 block md:grid md:grid-cols-5 md:items-center md:text-center text-sm font-medium">
                                                    {/* Mobile View */}
                                                    <div className="md:hidden flex flex-col gap-2">
                                                        <div className="flex justify-between items-center border-b border-gray-100 pb-2 mb-2">
                                                            <span className="font-bold text-gray-800">{rent.category}</span>
                                                            <span className="text-[#7BD747] font-bold text-xs bg-green-50 px-2 py-1 rounded-full">{rent.status}</span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                                                            <div>
                                                                <span className="block text-gray-400 text-[10px]">First Invoice</span>
                                                                {rent.firstInvoice}
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="block text-gray-400 text-[10px]">Next Invoice</span>
                                                                {rent.nextInvoice || '--'}
                                                            </div>
                                                        </div>
                                                        <div className="mt-2 text-right">
                                                            <span className="block text-gray-400 text-[10px]">Total & Schedule</span>
                                                            <span className="text-[#3A6D6C] font-bold">{rent.totalSchedule}</span>
                                                        </div>
                                                    </div>

                                                    {/* Desktop View */}
                                                    <div className="text-[#7BD747] hidden md:block">{rent.status}</div>
                                                    <div className="hidden md:block">{rent.firstInvoice}</div>
                                                    <div className="hidden md:block">{rent.category}</div>
                                                    <div className="text-gray-400 hidden md:block">{rent.nextInvoice || '--'}</div>
                                                    <div className="hidden md:block">{rent.totalSchedule}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="bg-white rounded-xl px-6 py-8 text-center text-gray-500">
                                                No recurring rent configured
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Other recurring transactions */}
                            <div>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 sm:gap-0">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-bold text-gray-800">Other recurring transactions</h2>
                                        <ChevronDown className="w-5 h-5 text-gray-800" />
                                    </div>
                                    <button
                                        onClick={() => {
                                            const defaultTenants = [{ name: lease.tenant.name, amount: 0 }];
                                            setRecurringRentToEdit({ tenants: defaultTenants });
                                            setRecurringRentModalMode('add');
                                            setIsAddEditRecurringRentModalOpen(true);
                                        }}
                                        className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add recurring transaction
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {recurringTransactions.length === 0 ? (
                                        <div className="bg-[#F0F2F5] rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
                                            <div className="bg-[#EAEAEA] p-8 rounded-xl flex flex-col items-center mb-0">
                                                <SquarePen className="w-8 h-8 text-[#3A6D6C] mb-3" />
                                                <p className="text-[#3A6D6C] font-medium text-sm">No enabled recurring invoice yet</p>
                                            </div>
                                        </div>
                                    ) : (
                                        recurringTransactions.map((transaction) => (
                                            <div key={transaction.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4 sm:gap-0">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-gray-800 text-lg">{transaction.category || 'Rent'}</span>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${transaction.isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                                {transaction.isEnabled ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                        <div className="text-gray-500 text-xs text-left">
                                                            {transaction.subcategory ? <span className="block font-medium text-gray-700">{transaction.subcategory}</span> : null}
                                                            {transaction.frequency} • Due on {transaction.dueDay}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setRecurringRentToEdit(transaction);
                                                                    setRecurringRentModalMode('edit');
                                                                    setIsAddEditRecurringRentModalOpen(true);
                                                                }}
                                                                className="p-1.5 text-gray-400 hover:text-[#3A6D6C] hover:bg-gray-50 rounded-full transition-colors"
                                                            >
                                                                <Pencil size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setTransactionToDelete(transaction);
                                                                    setIsDeleteTransactionModalOpen(true);
                                                                }}
                                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-[#3A6D6C] font-bold text-lg">₹{transaction.totalAmount?.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}</div>
                                                            <div className="text-gray-400 text-xs">Total Amount</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-gray-100 pt-4">
                                                    <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide text-left">Tenants Split</div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {transaction.tenants?.map((tenant: any, idx: number) => (
                                                            <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                                                                <span className="text-gray-700 font-medium text-sm">{tenant.name}</span>
                                                                <span className="text-gray-900 font-bold text-sm">₹{tenant.amount?.toLocaleString() || '0'}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Extra fees */}
                            <div>
                                <div className="flex items-center justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <h2 className="text-lg font-bold text-gray-800">Extra fees</h2>
                                        <ChevronDown className="w-5 h-5 text-gray-800" />
                                    </div>
                                    <button
                                        onClick={() => setIsEditExtraFeesModalOpen(true)}
                                        className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                                    >
                                        <Pencil className="w-3 h-3" />
                                        Edit
                                    </button>
                                </div>
                                <div className="bg-[#F0F2F5] rounded-[2rem] p-4">
                                    <div className="bg-white/50 rounded-[2rem] sm:rounded-full px-6 py-4 sm:py-3 flex flex-col sm:flex-row items-center sm:justify-start gap-4 sm:gap-12 shadow-sm">
                                        <div className="bg-[#b5e39e] text-[#3D7475] text-xs font-bold px-6 py-2 rounded-full min-w-[100px] text-center mb-2 sm:mb-0">
                                            Late fees
                                        </div>
                                        <div className="flex-1 w-full sm:w-auto">
                                            <CustomTextBox
                                                label={lease.extraFees.label}
                                                value={lease.extraFees.amount}
                                                onChange={() => { }}
                                                labelClassName="text-xs font-medium text-gray-600 !w-auto"
                                                valueClassName="text-xs font-medium text-gray-600 !w-auto !overflow-visible !whitespace-normal sm:!whitespace-nowrap"
                                                className="px-4 py-2 gap-2 sm:gap-4 rounded-full w-full sm:w-auto flex-col sm:flex-row items-start sm:items-center"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                {/* Tab Content - Agreements & Notices */}
                {activeTab === 'agreements' && (
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <h2 className="text-lg font-bold text-gray-800">Property Attachments</h2>
                                    <ChevronDown className="w-5 h-5 text-gray-800" />
                                </div>
                                <button
                                    onClick={() => setIsPropertyAttachmentsModalOpen(true)}
                                    className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <Plus className="w-3 h-3" />
                                    Add
                                </button>
                            </div>

                            {/* Display attachments if any exist */}
                            {(attachments.shared.length > 0 || attachments.private.length > 0) ? (
                                <div className="space-y-6">
                                    {/* Shared Attachments */}
                                    {attachments.shared.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Shared Documents</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {attachments.shared.map((file: any, index: number) => (
                                                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <FileText className="w-8 h-8 text-[#3A6D6C]" />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-800 truncate max-w-[150px]">{file.name}</p>
                                                                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setAttachmentToDelete({ type: 'shared', index });
                                                                setIsDeleteAttachmentModalOpen(true);
                                                            }}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Private Attachments */}
                                    {attachments.private.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700 mb-3">Private Documents</h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {attachments.private.map((file: any, index: number) => (
                                                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <FileText className="w-8 h-8 text-[#3A6D6C]" />
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-800 truncate max-w-[150px]">{file.name}</p>
                                                                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setAttachmentToDelete({ type: 'private', index });
                                                                setIsDeleteAttachmentModalOpen(true);
                                                            }}
                                                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-[#F0F2F5] rounded-[2rem] p-8 min-h-[300px] flex items-center justify-center">
                                    <div
                                        onClick={() => setIsPropertyAttachmentsModalOpen(true)}
                                        className="bg-[#EAEAEA] w-full max-w-md rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-opacity-80 transition-colors border-2 border-dashed border-gray-300 hover:border-[#3A6D6C]"
                                    >
                                        <Upload className="w-8 h-8 text-[#3A6D6C] mb-3" />
                                        <p className="text-[#3A6D6C] font-medium text-xs">Upload Documents</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tab Content - Insurance */}
                {activeTab === 'insurance' && (
                    <div className="space-y-6">
                        {/* Insurances Section */}
                        <div>
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <h2 className="text-lg font-bold text-gray-800">Renters insurance</h2>
                                    <ChevronDown className="w-5 h-5 text-gray-800" />
                                </div>
                                <button
                                    onClick={() => {
                                        setEditingInsuranceId(null);
                                        setIsAddInsuranceModalOpen(true);
                                    }}
                                    className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <Plus className="w-3 h-3" />
                                    Add
                                </button>
                            </div>

                            {insurances.length === 0 ? (
                                <div className="bg-[#F0F2F5] rounded-[2rem] p-8 min-h-[300px] flex items-center justify-center">
                                    <div className="bg-[#EAEAEA] w-full max-w-md rounded-2xl p-12 flex flex-col items-center justify-center">
                                        <SquarePen className="w-8 h-8 text-[#3A6D6C] mb-3" />
                                        <p className="text-[#3A6D6C] font-medium text-xs">No insurances</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#F0F2F5] rounded-[1.5rem] md:rounded-[2rem] p-4 md:p-6 shadow-sm">
                                    {insurances.map(item => (
                                        <FinancialCard
                                            key={item.id}
                                            record={mapInsuranceToRecord(item)}
                                            onEdit={() => {
                                                setEditingInsuranceId(item.id);
                                                setIsAddInsuranceModalOpen(true);
                                            }}
                                            onDelete={() => {
                                                setInsuranceToDelete(item.id);
                                                setIsDeleteInsuranceModalOpen(true);
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tab Content - Utilities */}
                {/* Tab Content - Utilities */}
                {activeTab === 'utilities' && (
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-2 cursor-pointer">
                                    <h2 className="text-lg font-bold text-gray-800">Responsibility</h2>
                                    <ChevronDown className="w-5 h-5 text-gray-800" />
                                </div>
                                <button
                                    onClick={() => setIsResponsibilityModalOpen(true)}
                                    className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-bold hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                                >
                                    {responsibilities && responsibilities.length > 0 ? <Edit className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                    {responsibilities && responsibilities.length > 0 ? "Edit" : "Add"}
                                </button>
                            </div>

                            {responsibilities && responsibilities.length > 0 ? (
                                <div className="bg-[#F0F2F5] rounded-[2rem] p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {responsibilities.map((item: ResponsibilityItem) => (
                                            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-[#E3EBDE] flex items-center justify-center text-[#3A6D6C]">
                                                            <span className="font-bold text-xs">{item.utility.charAt(0)}</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-800">{item.utility}</p>
                                                            <p className="text-xs font-medium text-gray-500">{item.payer}</p>
                                                        </div>
                                                    </div>
                                                    <div className={`w-2 h-2 rounded-full ${item.payer === 'Landlord' ? 'bg-[#4CAF50]' : 'bg-blue-500'}`}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-[#F0F2F5] rounded-[2rem] p-8 min-h-[300px] flex items-center justify-center">
                                    <div
                                        onClick={() => setIsResponsibilityModalOpen(true)}
                                        className="bg-[#EAEAEA] w-full max-w-md rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-opacity-80 transition-colors border-2 border-dashed border-gray-300 hover:border-[#3A6D6C]"
                                    >
                                        <RefreshCw className="w-8 h-8 text-[#3A6D6C] mb-3" />
                                        <p className="text-[#3A6D6C] font-medium text-xs">No utilities configured</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {/* Confirmation Modals */}
            < DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    if (!deleteLeaseMutation.isPending) {
                        setIsDeleteModalOpen(false);
                    }
                }}
                onConfirm={handleDeleteLease}
                title="Delete Lease"
                message="Are you sure you want to delete this lease? This action cannot be undone."
                itemName={lease?.lease ? String(lease.lease) : 'Lease'}
                isLoading={deleteLeaseMutation.isPending}
            />

            < DeleteConfirmationModal
                isOpen={isEndLeaseModalOpen}
                onClose={() => {
                    if (!updateLeaseMutation.isPending) {
                        setIsEndLeaseModalOpen(false);
                    }
                }}
                onConfirm={handleEndLease}
                title="End Lease"
                message="Are you sure you want to end this lease? This will change the status to terminated."
                confirmText="End Lease"
                confirmButtonClass="bg-orange-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                isLoading={updateLeaseMutation.isPending}
            />

            <EditLeaseTermsModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={lease || undefined}
                onUpdate={handleUpdateLease}
            />

            <ResponsibilityModal
                isOpen={isResponsibilityModalOpen}
                onClose={() => setIsResponsibilityModalOpen(false)}
                initialData={responsibilities}
                onSave={setResponsibilities}
            />

            <AddInsuranceModal
                isOpen={isAddInsuranceModalOpen}
                onClose={() => {
                    setIsAddInsuranceModalOpen(false);
                    setEditingInsuranceId(null);
                }}
                onAdd={handleSaveInsurance}
                initialData={editingInsuranceId ? insurances.find(i => i.id === editingInsuranceId) : undefined}
            />

            <PropertyAttachmentsModal
                isOpen={isPropertyAttachmentsModalOpen}
                onClose={() => setIsPropertyAttachmentsModalOpen(false)}
                onUpdate={(files) => {
                    console.log('Files updated:', files);
                    setAttachments(files);
                    setIsPropertyAttachmentsModalOpen(false);
                }}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteInsuranceModalOpen}
                onClose={() => setIsDeleteInsuranceModalOpen(false)}
                onConfirm={handleDeleteInsurance}
                title="Delete Insurance"
                message="Are you sure you want to delete this insurance record?"
                itemName={insuranceToDelete ? insurances.find(i => i.id === insuranceToDelete)?.companyName || 'Insurance' : 'Insurance'}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteAttachmentModalOpen}
                onClose={() => setIsDeleteAttachmentModalOpen(false)}
                onConfirm={handleDeleteAttachment}
                title="Delete Attachment"
                message="Are you sure you want to delete this document?"
                itemName={attachmentToDelete ? (
                    attachmentToDelete.type === 'shared'
                        ? attachments.shared[attachmentToDelete.index]?.name
                        : attachments.private[attachmentToDelete.index]?.name
                ) : 'Document'}
            />

            <AddEditRecurringRentModal
                isOpen={isAddEditRecurringRentModalOpen}
                onClose={() => {
                    setIsAddEditRecurringRentModalOpen(false);
                    setRecurringRentToEdit(null);
                }}
                onSave={handleSaveRecurringTransaction}
                initialData={recurringRentToEdit}
                mode={recurringRentModalMode}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteTransactionModalOpen}
                onClose={() => setIsDeleteTransactionModalOpen(false)}
                onConfirm={handleDeleteTransaction}
                title="Delete Recurring Transaction"
                message="Are you sure you want to delete this recurring transaction?"
                itemName={transactionToDelete ? (transactionToDelete.category || 'Transaction') : 'Transaction'}
            />

            <RentScheduleModal
                isOpen={isRentScheduleModalOpen}
                onClose={() => setIsRentScheduleModalOpen(false)}
                onConfirm={(schedules) => {
                    console.log('Rent schedules confirmed:', schedules);
                    setIsRentScheduleModalOpen(false);
                }}
                currentRent={typeof lease.rentAmount === 'number' ? lease.rentAmount : 12000}
                initialTenants={[{ name: lease.tenant.name }]}
            />

            <EditExtraFeesModal
                isOpen={isEditExtraFeesModalOpen}
                onClose={() => setIsEditExtraFeesModalOpen(false)}
                onSave={handleSaveExtraFees}
                initialData={lease.extraFees}
            />
        </div>
    );
};

export default LeaseDetail;
