import React, { useState, useRef, useEffect, useMemo } from 'react';
import { formatPhoneNumber } from '@/utils/phone.utils';

import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, CheckCircle, RefreshCw, XCircle, Edit, FileText, ChevronDown, ChevronUp, SquarePen, Upload, Pencil, Clock, Plus, Trash2, Loader2, Eye, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import DetailTabs from '../../components/DetailTabs';
import CustomTextBox from '../../components/CustomTextBox';
import DeleteConfirmationModal from '../../../../components/common/modals/DeleteConfirmationModal';
import EditLeaseTermsModal, { type Lease } from './components/EditLeaseTermsModal';
import AddEditRecurringRentModal from './components/AddEditRecurringRentModal';
import RentScheduleModal from './components/RentScheduleModal';
import EditExtraFeesModal from './components/EditExtraFeesModal';
import PropertyAttachmentsModal from './components/PropertyAttachmentsModal';
import ResponsibilityModal, { type ResponsibilityItem } from '../Properties/components/ResponsibilityModal';
import { useGetLease, useDeleteLease, useUpdateLease, useUpdateLeaseUtilities, useRenewLease, leaseQueryKeys } from '../../../../hooks/useLeaseQueries';
import { useDeleteRecurringTransaction, useGetRecurringTransactions, useCreateRecurringIncome, useUpdateRecurringTransaction } from '../../../../hooks/useTransactionQueries';
import { useGetRenderedDocuments } from '../../../../hooks/useDocumentsQueries';
import { useGetTenantByUserId } from '../../../../hooks/useTenantQueries';
import type { BackendLease } from '../../../../services/lease.service';
import { API_ENDPOINTS } from '../../../../config/api.config';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import { useTeamPermissions } from '../../../../context/TeamPermissionContext';
import { useToast } from '../../../../components/common/Toast';


const INVOICE_SCHEDULE_TO_DISPLAY: Record<string, string> = {
    'DAILY': 'Daily',
    'WEEKLY': 'Weekly',
    'EVERY_TWO_WEEKS': 'Every two weeks',
    'EVERY_FOUR_WEEKS': 'Every four weeks',
    'MONTHLY': 'Monthly',
    'EVERY_TWO_MONTHS': 'Every two months',
    'QUARTERLY': 'Quarterly',
    'YEARLY': 'Yearly',
};

const LeaseDetail: React.FC = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('tenants');
    const { isTeamMember, canManage } = useTeamPermissions();
    const canEdit = !isTeamMember || canManage('leases');
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
    // Modal states for extra fees
    const [isEditExtraFeesModalOpen, setIsEditExtraFeesModalOpen] = useState(false);

    // Modal states for attachments
    const [isPropertyAttachmentsModalOpen, setIsPropertyAttachmentsModalOpen] = useState(false);
    const [attachments, setAttachments] = useState<{ shared: any[]; private: any[] }>({ shared: [], private: [] });
    const [isDeleteAttachmentModalOpen, setIsDeleteAttachmentModalOpen] = useState(false);
    const [attachmentToDelete, setAttachmentToDelete] = useState<{ type: 'shared' | 'private'; index: number } | null>(null);

    // Modal states for responsibility/utilities
    const [isResponsibilityModalOpen, setIsResponsibilityModalOpen] = useState(false);
    const [responsibilities, setResponsibilities] = useState<ResponsibilityItem[]>([]);

    // Modal state for lease renewal
    const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
    const [renewEndDate, setRenewEndDate] = useState('');
    const [renewMonthlyRent, setRenewMonthlyRent] = useState('');
    const [renewNotes, setRenewNotes] = useState('');
    const [renewError, setRenewError] = useState('');

    // Document & Notices states
    const [isDocumentsExpanded, setIsDocumentsExpanded] = useState(true);
    const [previewDoc, setPreviewDoc] = useState<any>(null);

    // Fetch lease data
    const { data: backendLease, isLoading, error } = useGetLease(id);

    // Fetch rendered documents
    const { data: allRenderedDocs } = useGetRenderedDocuments();
    const leaseRenderedDocs = useMemo(() => {
        if (!allRenderedDocs || !id) return [];
        return allRenderedDocs.filter((doc: any) => doc.leaseId === id);
    }, [allRenderedDocs, id]);

    // Fetch enriched tenant profile (pets, vehicles, emergency contacts, documents)
    const tenantUserId = backendLease?.tenant?.id || backendLease?.tenantId || null;
    const {
        data: tenantProfile,
        isLoading: isTenantProfileLoading,
    } = useGetTenantByUserId(tenantUserId, !!tenantUserId);
    const deleteLeaseMutation = useDeleteLease();
    const updateLeaseMutation = useUpdateLease();
    const updateUtilitiesMutation = useUpdateLeaseUtilities();
    const renewLeaseMutation = useRenewLease();
    const createRecurringIncomeMutation = useCreateRecurringIncome();
    const updateRecurringTransactionMutation = useUpdateRecurringTransaction();

    // Fetch recurring transactions
    const { data: allRecurringTransactions } = useGetRecurringTransactions();
    const activeRecurringTransactions = useMemo(() => {
        if (!allRecurringTransactions || !id) return [];
        return allRecurringTransactions.filter((rt: any) => rt.leaseId === id && rt.enabled);
    }, [allRecurringTransactions, id]);

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
            if (!amount) return '$0.00';
            const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
            if (isNaN(numAmount)) return '$0.00';
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numAmount);
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

        // Compute agreements & notices from lease documents (shared only)
        const documents = lease.documents || [];
        const sharedDocuments = documents.filter(doc => doc.visibility === 'SHARED');
        const agreementsCount = sharedDocuments.filter(doc => doc.documentCategory === 'AGREEMENT' || doc.documentCategory === 'ADDENDUM').length;
        const noticesCount = sharedDocuments.filter(doc => doc.documentCategory === 'NOTICE').length;

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
                requested: agreementsCount > 0 ? String(agreementsCount) : 'No'
            },
            notices: {
                requested: noticesCount > 0 ? String(noticesCount) : 'No'
            },
            tenant: {
                name: tenantName,
                email: lease.tenant?.email || '',
                image: tenantImage,
                initials: tenantInitials,
                description: `Tenant ID: ${lease.tenantId}${lease.tenant?.phoneNumber ? ` | Phone: ${formatPhoneNumber(lease.tenant.phoneNumber)}` : ''}`

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
        // Sync utilities/responsibilities from backend into local state
        if (backendLease.utilities) {
            setResponsibilities(
                backendLease.utilities.map((u) => ({
                    id: u.id,
                    utility: u.utility,
                    payer: u.payer,
                })),
            );
        } else {
            setResponsibilities([]);
        }
        return transformed;
    }, [backendLease]);

    // Initialize attachments state from backend lease documents
    useEffect(() => {
        if (backendLease && backendLease.documents) {
            const shared = backendLease.documents
                .filter((doc: any) => doc.visibility === 'SHARED')
                .map((doc: any) => ({
                    id: doc.id,
                    name: doc.fileUrl?.split('/').pop() || doc.documentCategory,
                    size: doc.fileSize || 0,
                    type: doc.fileType,
                    url: doc.fileUrl
                }));
            const privateDocs = backendLease.documents
                .filter((doc: any) => doc.visibility === 'PRIVATE')
                .map((doc: any) => ({
                    id: doc.id,
                    name: doc.fileUrl?.split('/').pop() || doc.documentCategory,
                    size: doc.fileSize || 0,
                    type: doc.fileType,
                    url: doc.fileUrl
                }));
            setAttachments({ shared, private: privateDocs });
        }
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
            navigate('/dashboard/leasing/leases');
        } catch (error) {
            console.error('Failed to delete lease:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to delete lease. Please try again.');
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
            toast.error(error instanceof Error ? error.message : 'Failed to end lease. Please try again.');
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
            toast.error(error instanceof Error ? error.message : 'Failed to update lease. Please try again.');
        }
    };

    // Handler for saving recurring transactions
    const handleSaveRecurringTransaction = async (data: any) => {
        try {
            if (recurringRentModalMode === 'add') {
                await createRecurringIncomeMutation.mutateAsync({
                    scope: 'PROPERTY' as any,
                    category: data.category || 'Rent',
                    subcategory: data.subcategory || undefined,
                    startDate: data.firstInvoiceDate ? data.firstInvoiceDate.toISOString() : new Date().toISOString(),
                    frequency: data.frequency.toUpperCase() as any, // 'MONTHLY' or 'WEEKLY'
                    amount: parseFloat(data.totalAmount || 0),
                    leaseId: id as string,
                    propertyId: backendLease?.propertyId as string,
                    payerId: backendLease?.tenantId as string,
                } as any);
            } else if (recurringRentModalMode === 'edit') {
                await updateRecurringTransactionMutation.mutateAsync({
                    id: recurringRentToEdit.id,
                    updates: {
                        enabled: data.isEnabled,
                        amount: parseFloat(data.totalAmount || 0),
                        frequency: data.frequency.toUpperCase(),
                        category: data.category || undefined,
                        subcategory: data.subcategory || undefined,
                        startDate: data.firstInvoiceDate ? data.firstInvoiceDate.toISOString() : undefined,
                    },
                });
            }
            setIsAddEditRecurringRentModalOpen(false);
            queryClient.invalidateQueries({ queryKey: leaseQueryKeys.detail(id as string) });
            queryClient.invalidateQueries({ queryKey: ['transactions', 'recurring'] });
        } catch (error) {
            console.error('Failed to save recurring transaction:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to save recurring transaction');
        }
    };

    const deleteRecurringTxnMutation = useDeleteRecurringTransaction();

    // Handler for deleting a transaction (recurring rent / fee).
    // Tries the backend first; if the row is local-only (no backend id) or the call fails,
    // still removes it from the visible list so the UI stays consistent and surfaces the error.
    const handleDeleteTransaction = async () => {
        if (!transactionToDelete) return;
        const txnId = transactionToDelete.id;
        const looksLikeBackendId = typeof txnId === 'string' && txnId.length >= 16;

        try {
            if (looksLikeBackendId) {
                await deleteRecurringTxnMutation.mutateAsync(txnId);
            }
            setIsDeleteTransactionModalOpen(false);
            setTransactionToDelete(null);
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Failed to delete recurring transaction';
            // Only remove from local state if backend confirmed delete; otherwise keep the row + toast.
            toast.error(msg);
            // eslint-disable-next-line no-console
            console.error('Failed to delete recurring transaction', error);
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
            toast.error(error instanceof Error ? error.message : 'Failed to update extra fees. Please try again.');
        }
    };

    // Handler for deleting attachment
    const handleDeleteAttachment = async () => {
        if (!attachmentToDelete) return;
        const { type, index } = attachmentToDelete;
        const file = attachments[type][index];
        if (file?.url) {
            try {
                const response = await fetch(API_ENDPOINTS.UPLOAD.FILE, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ fileUrl: file.url }),
                });
                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    throw new Error(data.message || 'Failed to delete attachment');
                }
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Failed to delete attachment');
                return;
            }
        }
        setAttachments(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
        setIsDeleteAttachmentModalOpen(false);
        setAttachmentToDelete(null);
    };

    // Handler for saving utilities/responsibilities
    const handleSaveResponsibilities = async (data: ResponsibilityItem[]) => {
        setResponsibilities(data);
        if (!id) return;

        try {
            await updateUtilitiesMutation.mutateAsync({
                id,
                utilities: data.map((item) => ({
                    utility: item.utility,
                    payer: item.payer,
                })),
            });
        } catch (error) {
            console.error('Failed to update utilities:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to update utilities. Please try again.');
        }
    };

    const tabs = [
        { id: 'tenants', label: 'Tenants' },
        { id: 'transactions', label: 'Lease Transactions' },
        { id: 'agreements', label: 'Agreements & Notices' },
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
                        onClick={() => navigate('/dashboard/leasing/leases')}
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
                        {canEdit && isMoveInIncomplete && (
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
                        {canEdit && canRenew && !isMoveInIncomplete && (
                            <button
                                onClick={() => {
                                    setRenewEndDate('');
                                    setRenewMonthlyRent('');
                                    setRenewNotes('');
                                    setRenewError('');
                                    setIsRenewModalOpen(true);
                                }}
                                className="flex items-center gap-2 px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Renew Lease
                            </button>
                        )}
                        {canEdit && <div className="relative" ref={dropdownRef}>
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
                                                setRenewEndDate('');
                                                setRenewMonthlyRent('');
                                                setRenewNotes('');
                                                setRenewError('');
                                                setIsRenewModalOpen(true);
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
                                            setIsEndLeaseModalOpen(true);
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
                        </div>}
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
                                Send
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
                                        {isTenantProfileLoading ? (
                                            <div className="w-full h-full rounded-lg p-6 flex items-center justify-center bg-white/60">
                                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Loading tenant details...</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full rounded-lg p-6 bg-white shadow-sm flex flex-col gap-4">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <CustomTextBox
                                                        label="Tenant ID"
                                                        value={lease.tenantId || 'N/A'}
                                                        onChange={() => { }}
                                                    />
                                                    <CustomTextBox
                                                        label="Phone"
                                                        value={formatPhoneNumber(tenantProfile?.phoneNumber || lease.tenant?.description?.split('| Phone: ')[1]) || 'N/A'}
                                                        onChange={() => { }}
                                                    />
                                                    <CustomTextBox
                                                        label="Forwarding address"
                                                        value={tenantProfile?.forwardingAddress || 'Not provided'}
                                                        onChange={() => { }}
                                                        multiline
                                                    />
                                                </div>

                                                {tenantProfile && (
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                                        <div className="bg-[#F0F2F5] rounded-full px-4 py-2 flex flex-col justify-center">
                                                            <span className="text-gray-500 font-medium">Documents</span>
                                                            <span className="text-[#3D7475] font-bold">
                                                                {tenantProfile.documents?.length || 0} uploaded
                                                            </span>
                                                        </div>
                                                        <div className="bg-[#F0F2F5] rounded-full px-4 py-2 flex flex-col justify-center">
                                                            <span className="text-gray-500 font-medium">Emergency contacts</span>
                                                            <span className="text-[#3D7475] font-bold">
                                                                {tenantProfile.emergencyContacts?.length || 0}
                                                            </span>
                                                        </div>
                                                        <div className="bg-[#F0F2F5] rounded-full px-4 py-2 flex flex-col justify-center">
                                                            <span className="text-gray-500 font-medium">Pets</span>
                                                            <span className="text-[#3D7475] font-bold">
                                                                {tenantProfile.pets?.length || 0}
                                                            </span>
                                                        </div>
                                                        <div className="bg-[#F0F2F5] rounded-full px-4 py-2 flex flex-col justify-center">
                                                            <span className="text-gray-500 font-medium">Vehicles</span>
                                                            <span className="text-[#3D7475] font-bold">
                                                                {tenantProfile.vehicles?.length || 0}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Status Badge - show only when move-in is incomplete (lease status PENDING) */}
                                    {isMoveInIncomplete && (
                                        <div className="flex justify-center lg:col-span-3">
                                            <div className="bg-[#b5e39e] text-[#3D7475] text-xs font-bold px-5 py-3 rounded-full w-min">
                                                Move-in pending
                                            </div>
                                        </div>
                                    )}
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
                                                const rrData = backendLease?.recurringRent;
                                                const existingData = {
                                                    tenants: [{ name: lease.tenant.name, amount: rrData ? parseFloat(rrData.amount || '0') : (lease.rentAmount || 0) }],
                                                    frequency: INVOICE_SCHEDULE_TO_DISPLAY[rrData?.invoiceSchedule || ''] || 'Monthly',
                                                    isEnabled: rrData?.enabled ?? true,
                                                    firstInvoiceDate: rrData?.startOn ? new Date(rrData.startOn) : undefined,
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
                                            const defaultTenants = [{ name: lease?.tenant?.name || 'Tenant', amount: 0 }];
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
                                    {activeRecurringTransactions.length === 0 ? (
                                        <div className="bg-[#F0F2F5] rounded-[2rem] p-12 flex flex-col items-center justify-center text-center">
                                            <div className="bg-[#EAEAEA] p-8 rounded-xl flex flex-col items-center mb-0">
                                                <SquarePen className="w-8 h-8 text-[#3A6D6C] mb-3" />
                                                <p className="text-[#3A6D6C] font-medium text-sm">No enabled recurring invoice yet</p>
                                            </div>
                                        </div>
                                    ) : (
                                        activeRecurringTransactions.map((transaction: any) => (
                                            <div key={transaction.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                                <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4 sm:gap-0">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="font-bold text-gray-800 text-lg">{transaction.category || 'Rent'}</span>
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${transaction.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                                {transaction.enabled ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                        <div className="text-gray-500 text-xs text-left">
                                                            {transaction.subcategory ? <span className="block font-medium text-gray-700">{transaction.subcategory}</span> : null}
                                                            {transaction.frequency} • Starts {transaction.startDate ? new Date(transaction.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    const freq = transaction.frequency
                                                                        ? transaction.frequency.charAt(0) + transaction.frequency.slice(1).toLowerCase()
                                                                        : 'Monthly';
                                                                    setRecurringRentToEdit({
                                                                        ...transaction,
                                                                        isEnabled: transaction.enabled ?? true,
                                                                        firstInvoiceDate: transaction.startDate,
                                                                        frequency: freq,
                                                                        tenants: [{
                                                                            name: lease?.tenant?.name || '',
                                                                            amount: parseFloat(transaction.amount || '0'),
                                                                        }],
                                                                    });
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
                                                            <div className="text-[#3A6D6C] font-bold text-lg">${parseFloat(transaction.amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                                                            <div className="text-gray-400 text-xs">Total Amount</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="border-t border-gray-100 pt-4">
                                                    <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide text-left">Tenants Split</div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                                                            <span className="text-gray-700 font-medium text-sm">{lease?.tenant?.name || 'Tenant'}</span>
                                                            <span className="text-gray-900 font-bold text-sm">${parseFloat(transaction.amount || 0).toLocaleString()}</span>
                                                        </div>
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
                                                        <div className="flex items-center gap-1">
                                                            {file.url && (
                                                                <button
                                                                    onClick={() => window.open(file.url, '_blank')}
                                                                    className="p-1.5 text-gray-400 hover:text-[#3A6D6C] hover:bg-green-50 rounded-full transition-colors"
                                                                    title="View Attachment"
                                                                >
                                                                    <Eye size={16} />
                                                                </button>
                                                            )}
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
                                                        <div className="flex items-center gap-1">
                                                            {file.url && (
                                                                <button
                                                                    onClick={() => window.open(file.url, '_blank')}
                                                                    className="p-1.5 text-gray-400 hover:text-[#3A6D6C] hover:bg-green-50 rounded-full transition-colors"
                                                                    title="View Attachment"
                                                                >
                                                                    <Eye size={16} />
                                                                </button>
                                                            )}
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

                        {/* Rendered Documents (sent by property manager) */}
                        <div className="bg-[#F7F7F7] rounded-lg border border-[#E5E7EB] overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] mt-4">
                            <button
                                onClick={() => setIsDocumentsExpanded(!isDocumentsExpanded)}
                                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <FileText size={20} className="text-gray-600" />
                                    <h3 className="text-base font-semibold text-[#1A1A1A]">Documents & Notices</h3>
                                    <span className="text-sm text-gray-500">({leaseRenderedDocs.length} record{leaseRenderedDocs.length !== 1 ? 's' : ''})</span>
                                </div>
                                {isDocumentsExpanded ? <ChevronUp size={20} className="text-gray-600" /> : <ChevronDown size={20} className="text-gray-600" />}
                            </button>

                            {isDocumentsExpanded && (
                                <div className="border-t border-[#E5E7EB]">
                                    {leaseRenderedDocs.length > 0 ? (
                                        <div className="divide-y divide-[#E5E7EB]">
                                            {leaseRenderedDocs.map((doc: any) => (
                                                <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors bg-white">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                            <FileText size={20} className="text-green-600" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-medium text-[#1A1A1A]">{doc.title}</span>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(doc.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setPreviewDoc(doc)}
                                                        className="flex items-center gap-1.5 text-sm text-[#3A6D6C] hover:text-[#2a5251] font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-green-50"
                                                    >
                                                        <Eye size={16} />
                                                        View
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-gray-500">No documents available</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

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
                onSave={handleSaveResponsibilities}
            />

            <PropertyAttachmentsModal
                isOpen={isPropertyAttachmentsModalOpen}
                onClose={() => setIsPropertyAttachmentsModalOpen(false)}
                onUpdate={async (files) => {
                    // Append new files to existing state for immediate UI feedback
                    setAttachments(prev => ({
                        shared: [...prev.shared, ...files.shared],
                        private: [...prev.private, ...files.private]
                    }));
                    setIsPropertyAttachmentsModalOpen(false);

                    if (!id) return;

                    try {
                        // Upload shared and private documents as lease documents
                        const uploadFile = async (file: File, visibility: 'SHARED' | 'PRIVATE') => {
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('category', 'DOCUMENT');
                            formData.append('leaseId', id);
                            formData.append('visibility', visibility);
                            // For now, treat all as generic agreements/other docs
                            formData.append('documentCategory', 'AGREEMENT');

                            const response = await fetch(API_ENDPOINTS.UPLOAD.FILE, {
                                method: 'POST',
                                credentials: 'include',
                                body: formData,
                            });

                            if (!response.ok) {
                                const errorData = await response.json().catch(() => ({ message: 'Failed to upload file' }));
                                throw new Error(errorData.message || 'Failed to upload file');
                            }
                        };

                        // Upload shared docs
                        for (const file of files.shared) {
                            await uploadFile(file, 'SHARED');
                        }
                        // Upload private docs
                        for (const file of files.private) {
                            await uploadFile(file, 'PRIVATE');
                        }

                        // Refresh backend data to get the permanent S3 URLs and IDs
                        queryClient.invalidateQueries({ queryKey: leaseQueryKeys.detail(id as string) });
                    } catch (error) {
                        console.error('Failed to upload lease documents:', error);
                        toast.error(error instanceof Error ? error.message : 'Failed to upload documents. Please try again.');
                        // On failure, refresh anyway to reset state to what's actually in DB
                        queryClient.invalidateQueries({ queryKey: leaseQueryKeys.detail(id as string) });
                    }
                }}
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
                onConfirm={async (schedules) => {
                    const first = schedules[0];
                    if (!first?.startDate || !first?.newRentAmount) {
                        setIsRentScheduleModalOpen(false);
                        return;
                    }
                    try {
                        const rrData = backendLease?.recurringRent;
                        await updateLeaseMutation.mutateAsync({
                            id: id as string,
                            data: {
                                recurringRent: {
                                    enabled: rrData?.enabled ?? true,
                                    amount: first.newRentAmount,
                                    invoiceSchedule: INVOICE_SCHEDULE_TO_DISPLAY[rrData?.invoiceSchedule || ''] || 'Monthly',
                                    startOn: first.startDate.toISOString(),
                                    isMonthToMonth: rrData?.isMonthToMonth ?? false,
                                    markPastPaid: rrData?.markPastPaid ?? false,
                                }
                            } as any
                        });
                        setIsRentScheduleModalOpen(false);
                    } catch (error) {
                        console.error('Failed to update rent schedule:', error);
                        toast.error(error instanceof Error ? error.message : 'Failed to update rent schedule');
                    }
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

            {/* Renew Lease Modal */}
            {isRenewModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Renew Lease</h2>
                        {renewError && (
                            <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {renewError}
                            </div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New End Date <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    value={renewEndDate}
                                    onChange={(e) => setRenewEndDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A6D6C]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Monthly Rent (optional)</label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Leave blank to keep current"
                                    value={renewMonthlyRent}
                                    onChange={(e) => setRenewMonthlyRent(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A6D6C]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                                <textarea
                                    rows={3}
                                    placeholder="Add renewal notes..."
                                    value={renewNotes}
                                    onChange={(e) => setRenewNotes(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] resize-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsRenewModalOpen(false)}
                                className="px-5 py-2 rounded-full text-sm font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
                                disabled={renewLeaseMutation.isPending}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (!renewEndDate) {
                                        setRenewError('New end date is required.');
                                        return;
                                    }
                                    setRenewError('');
                                    const payload: { endDate: string; monthlyRent?: number; notes?: string } = {
                                        endDate: new Date(renewEndDate).toISOString(),
                                    };
                                    if (renewMonthlyRent) payload.monthlyRent = parseFloat(renewMonthlyRent);
                                    if (renewNotes) payload.notes = renewNotes;
                                    renewLeaseMutation.mutate(
                                        { id: id!, data: payload },
                                        {
                                            onSuccess: () => setIsRenewModalOpen(false),
                                            onError: (err: any) => setRenewError(err?.message || 'Failed to renew lease.'),
                                        },
                                    );
                                }}
                                className="px-5 py-2 rounded-full text-sm font-medium bg-[#3A6D6C] text-white hover:bg-[#2c5251] transition-colors flex items-center gap-2"
                                disabled={renewLeaseMutation.isPending}
                            >
                                {renewLeaseMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                Renew Lease
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Document Preview Modal */}
            {previewDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-[#1A1A1A]">{previewDoc.title}</h2>
                            <button
                                onClick={() => setPreviewDoc(null)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div
                            className="overflow-y-auto p-6 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: previewDoc.content }}
                        />
                        <div className="p-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => setPreviewDoc(null)}
                                className="px-4 py-2 rounded-lg bg-[#3A6D6C] text-white text-sm font-medium hover:bg-[#2a5251] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeaseDetail;
