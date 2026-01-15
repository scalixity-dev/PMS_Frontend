import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, Paperclip, ChevronDown, User } from 'lucide-react';
import CustomTextBox from '../../components/CustomTextBox';
import PostNextInvoiceModal from './components/PostNextInvoiceModal';
import { useTransactionStore } from '../Transactions/store/transactionStore';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import { useGetRecurringTransaction, usePostNextInvoice, useEndRecurringTransaction, useDeleteRecurringTransaction } from '../../../../hooks/useTransactionQueries';
import { formatMoney } from '../../../../utils/currency.utils';
import DeleteConfirmationModal from '../../../../components/common/modals/DeleteConfirmationModal';

// Utility function to calculate next date based on frequency
const calculateNextDate = (startDate: Date, frequency: string, endDate?: Date | null): Date | null => {
    const now = new Date();
    const start = new Date(startDate);
    
    // If end date exists and has passed, return null
    if (endDate) {
        const end = new Date(endDate);
        if (end < now) {
            return null;
        }
    }
    
    // If start date is in the future, return start date
    if (start > now) {
        return start;
    }
    
    // Calculate next occurrence based on frequency
    let nextDate = new Date(start);
    
    while (nextDate <= now) {
        switch (frequency) {
            case 'DAILY':
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            case 'WEEKLY':
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case 'EVERY_TWO_WEEKS':
                nextDate.setDate(nextDate.getDate() + 14);
                break;
            case 'EVERY_FOUR_WEEKS':
                nextDate.setDate(nextDate.getDate() + 28);
                break;
            case 'MONTHLY':
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            case 'EVERY_TWO_MONTHS':
                nextDate.setMonth(nextDate.getMonth() + 2);
                break;
            case 'QUARTERLY':
                nextDate.setMonth(nextDate.getMonth() + 3);
                break;
            case 'EVERY_SIX_MONTHS':
                nextDate.setMonth(nextDate.getMonth() + 6);
                break;
            case 'YEARLY':
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;
            default:
                return null;
        }
        
        // Check if we've exceeded end date
        if (endDate && nextDate > new Date(endDate)) {
            return null;
        }
    }
    
    return nextDate;
};

// Format date for display
const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return 'N/A';
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
        return 'N/A';
    }
};

const RecurringDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);
    const [isAttachmentsCollapsed, setIsAttachmentsCollapsed] = useState(false);
    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const actionsDropdownRef = useRef<HTMLDivElement>(null);
    const { setClonedTransactionData } = useTransactionStore();

    const [isPostInvoiceModalOpen, setIsPostInvoiceModalOpen] = useState(false);

    // Fetch recurring transaction data
    const { data: recurringTransaction, isLoading, error, refetch } = useGetRecurringTransaction(id);
    const postNextInvoiceMutation = usePostNextInvoice();
    const endRecurringMutation = useEndRecurringTransaction();
    const deleteRecurringMutation = useDeleteRecurringTransaction();

    // Using console for now - replace with your toast library if available
    const toast = {
        success: (message: string) => console.log('Success:', message),
        error: (message: string) => console.error('Error:', message),
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionsDropdownRef.current && !actionsDropdownRef.current.contains(event.target as Node)) {
                setIsActionsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Calculate next invoice date
    const nextInvoiceDate = useMemo(() => {
        if (!recurringTransaction) return null;
        const startDate = new Date(recurringTransaction.startDate);
        const endDate = recurringTransaction.endDate ? new Date(recurringTransaction.endDate) : null;
        return calculateNextDate(startDate, recurringTransaction.frequency, endDate);
    }, [recurringTransaction]);

    // Get contact name
    const getContactName = (): string => {
        if (!recurringTransaction) return 'N/A';
        if (recurringTransaction.payer) {
            return recurringTransaction.payer.fullName || recurringTransaction.payer.email || 'N/A';
        }
        if (recurringTransaction.payee) {
            return recurringTransaction.payee.fullName || recurringTransaction.payee.email || 'N/A';
        }
        if (recurringTransaction.contact) {
            const nameParts = [
                recurringTransaction.contact.firstName,
                recurringTransaction.contact.middleName,
                recurringTransaction.contact.lastName,
            ].filter(Boolean);
            return nameParts.length > 0 ? nameParts.join(' ') : recurringTransaction.contact.email || 'N/A';
        }
        return 'N/A';
    };

    // Get initials from name
    const getInitials = (name: string): string => {
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Get transaction type display
    const getTransactionTypeDisplay = (): string => {
        if (!recurringTransaction) return 'N/A';
        const category = recurringTransaction.subcategory || recurringTransaction.category || '';
        const scope = recurringTransaction.scope === 'PROPERTY' ? 'Property' : 'General';
        const type = recurringTransaction.payerId ? 'Income' : 'Expense';
        return `${type} / ${scope} / ${category}`;
    };

    // Get frequency display
    const getFrequencyDisplay = (): string => {
        if (!recurringTransaction) return 'N/A';
        const frequencyMap: Record<string, string> = {
            'DAILY': 'Daily',
            'WEEKLY': 'Weekly',
            'EVERY_TWO_WEEKS': 'Every two weeks',
            'EVERY_FOUR_WEEKS': 'Every four weeks',
            'MONTHLY': 'Monthly',
            'EVERY_TWO_MONTHS': 'Every two months',
            'QUARTERLY': 'Quarterly',
            'EVERY_SIX_MONTHS': 'Every six months',
            'YEARLY': 'Yearly',
        };
        return frequencyMap[recurringTransaction.frequency] || recurringTransaction.frequency;
    };

    // Handle post next invoice
    const handlePostNextInvoice = () => {
        if (!id) return;
        postNextInvoiceMutation.mutate(
            {
                recurringTransactionId: id,
                dueDate: nextInvoiceDate ? nextInvoiceDate.toISOString().split('T')[0] : undefined,
            },
            {
                onSuccess: () => {
                    toast.success('Next invoice posted successfully');
                    setIsPostInvoiceModalOpen(false);
                    refetch();
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to post next invoice');
                },
            }
        );
    };

    // Handle end recurring transaction
    const handleEndRecurring = () => {
        if (!id) return;
        endRecurringMutation.mutate(id, {
            onSuccess: () => {
                toast.success('Recurring transaction ended successfully');
                refetch();
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to end recurring transaction');
            },
        });
    };

    // Handle delete recurring transaction
    const handleDeleteRecurring = () => {
        if (!id) return;
        deleteRecurringMutation.mutate(id, {
            onSuccess: () => {
                toast.success('Recurring transaction deleted successfully');
                setIsDeleteModalOpen(false);
                navigate('/dashboard/accounting/recurring');
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to delete recurring transaction');
            },
        });
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen font-outfit flex items-center justify-center">
                <div className="text-gray-600">Loading recurring transaction...</div>
            </div>
        );
    }

    if (error || !recurringTransaction) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen font-outfit flex items-center justify-center">
                <div className="text-red-600">
                    {error ? 'Failed to load recurring transaction' : 'Recurring transaction not found'}
                </div>
            </div>
        );
    }

    const currency = recurringTransaction.currency || 'USD';
    const amount = parseFloat(recurringTransaction.amount);
    const status = recurringTransaction.enabled ? 'Active' : 'Paused';
    const contactName = getContactName();
    const payers = contactName !== 'N/A' ? [{ name: contactName, initials: getInitials(contactName) }] : [];

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            <PostNextInvoiceModal
                isOpen={isPostInvoiceModalOpen}
                onClose={() => setIsPostInvoiceModalOpen(false)}
                onConfirm={handlePostNextInvoice}
                isLoading={postNextInvoiceMutation.isPending}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteRecurring}
                title="Delete recurring transaction"
                message={
                    <span className="text-gray-700 leading-relaxed block text-center">
                        Are you sure you want to delete this recurring transaction? This action cannot be undone.
                    </span>
                }
                confirmText="Delete"
                confirmButtonClass="bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors px-6 py-2.5"
            />

            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Recurring', path: '/dashboard/accounting/recurring' },
                    { label: 'Details' }
                ]}
                className="mb-6 px-6"
            />

            <div className="bg-[#dfe5e3] rounded-[2rem] p-6 pb-20 min-h-screen">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                        Recurring
                    </button>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setIsPostInvoiceModalOpen(true)}
                            disabled={!recurringTransaction.enabled || postNextInvoiceMutation.isPending}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex-1 sm:flex-none whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {postNextInvoiceMutation.isPending ? 'Posting...' : 'Post next invoice'}
                        </button>
                        <button
                            onClick={handleEndRecurring}
                            disabled={!recurringTransaction.enabled || endRecurringMutation.isPending}
                            className="px-6 py-2 bg-[#5F6D7E] text-white rounded-full text-sm font-medium hover:bg-[#4a5563] transition-colors flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {endRecurringMutation.isPending ? 'Ending...' : 'End'}
                        </button>

                        {/* Actions Dropdown */}
                        <div className="relative flex-1 sm:flex-none" ref={actionsDropdownRef}>
                            <button
                                onClick={() => setIsActionsOpen(!isActionsOpen)}
                                className="w-full sm:w-auto px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center justify-center gap-2"
                            >
                                Actions
                                <ChevronDown className={`w-4 h-4 transition-transform ${isActionsOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isActionsOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                                    <button
                                        onClick={() => {
                                            setIsActionsOpen(false);
                                            // Prepare data for cloning
                                            setClonedTransactionData({
                                                category: recurringTransaction.subcategory || recurringTransaction.category || '',
                                                amount: amount.toString(),
                                                date: formatDate(recurringTransaction.startDate),
                                                details: recurringTransaction.details || '',
                                                user: contactName,
                                                property: recurringTransaction.property?.propertyName || '',
                                                lease: recurringTransaction.lease?.id || '',
                                                type: getTransactionTypeDisplay(),
                                            });
                                            navigate('/dashboard/accounting/transactions/recurring-clone');
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Clone
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsActionsOpen(false);
                                            setIsDeleteModalOpen(true);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Top Card */}
                <div className="bg-[#F0F0F6] rounded-[2rem] p-4 sm:p-8 mb-8">
                    {/* Due Date Pill */}
                    {nextInvoiceDate && (
                        <div className="mb-10">
                            <span className="px-6 py-2 bg-[#7BD747] text-white rounded-full text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                                Next invoice: {formatDate(nextInvoiceDate)}
                            </span>
                        </div>
                    )}

                    {/* Main White Card */}
                    <div className="bg-white rounded-[2rem] p-4 sm:p-8 pb-4 border border-[#7BD747] relative mb-8 shadow-sm mt-8">
                        {/* Title & Amount */}
                        <div className="flex items-center gap-2 mb-4">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {recurringTransaction.subcategory || recurringTransaction.category || 'Recurring Transaction'} <span className="font-normal text-gray-600">for</span> {formatMoney(amount, currency)}
                            </h1>
                            <span className={`px-3 py-1 bg-white border ${recurringTransaction.enabled ? 'border-[#7BD747] text-[#7BD747]' : 'border-gray-400 text-gray-400'} rounded-full text-xs font-bold flex items-center gap-1`}>
                                <div className={`w-2 h-2 rounded-full ${recurringTransaction.enabled ? 'bg-[#7BD747]' : 'bg-gray-400'}`}></div>
                                {status}
                            </span>
                        </div>

                        {/* Add Tag */}
                        <div className="mt-4 mb-8">
                            <button className="flex items-center gap-1 px-4 py-1.5 rounded-full border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50">
                                Add Tags <Plus className="w-3 h-3 text-[#7BD747]" />
                            </button>
                        </div>

                        {/* Payers */}
                        <div className="mb-2">
                            <div className="flex items-center gap-2 mb-3">
                                <User className="w-5 h-5 text-gray-800" />
                                <h3 className="text-lg font-bold text-gray-800">Payers</h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {payers.length > 0 ? (
                                    payers.map((payer, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-[#F0F9F6] pr-4 pl-1 py-1 rounded-full">
                                            <div className="w-8 h-8 rounded-full bg-[#7BD747] text-white flex items-center justify-center text-xs font-bold">
                                                {payer.initials}
                                            </div>
                                            <span className="text-[#3A6D6C] font-medium text-sm">{payer.name}</span>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-sm">No payer/payee assigned</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="mb-8 bg-[#E9E9E9] rounded-[2rem] p-6 shadow-md">
                    <div
                        className="flex items-center gap-2 mb-4 cursor-pointer"
                        onClick={() => setIsSummaryCollapsed(!isSummaryCollapsed)}
                    >
                        <h2 className="text-lg font-bold text-gray-800">Summary <span className="text-gray-500 font-normal text-sm ml-1">(Invoice details)</span></h2>
                        <ChevronDown className={`w-5 h-5 transition-transform ${isSummaryCollapsed ? '-rotate-90' : ''}`} />
                    </div>

                    {!isSummaryCollapsed && (
                        <div className="bg-[#F0F0F6] rounded-[2.5rem] p-8 shadow-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                {/* Row 1 */}
                                {(() => {
                                    const propertyId = recurringTransaction.propertyId || recurringTransaction.lease?.property?.id;
                                    const propertyName = recurringTransaction.property?.propertyName || 
                                        recurringTransaction.lease?.property?.propertyName || 
                                        'N/A';
                                    const hasProperty = propertyId && propertyName !== 'N/A';
                                    
                                    return (
                                        <div className="flex items-center bg-[#E3EBDE] rounded-full px-3 py-1.5 shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)] w-full">
                                            <span className="text-[10px] font-medium text-gray-600 w-1/3 truncate">
                                                Property
                                            </span>
                                            {hasProperty ? (
                                                <button
                                                    onClick={() => navigate(`/dashboard/properties/${propertyId}`)}
                                                    className="text-xs text-[#3A6D6C] font-medium w-2/3 pl-2 truncate hover:underline cursor-pointer text-left"
                                                    title={`Click to view ${propertyName}`}
                                                >
                                                    {propertyName}
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-800 font-medium w-2/3 pl-2 truncate">
                                                    {propertyName}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })()}
                                <CustomTextBox
                                    label="Recurring Transaction ID"
                                    value={id || 'N/A'}
                                    className="w-full"
                                    labelClassName="text-gray-600"
                                    valueClassName="text-gray-800"
                                />

                                {/* Row 2 */}
                                {(() => {
                                    const leaseId = recurringTransaction.leaseId || recurringTransaction.lease?.id;
                                    const leaseDisplay = leaseId ? `Lease #${leaseId.slice(0, 8)}` : 'N/A';
                                    const hasLease = leaseId && leaseDisplay !== 'N/A';
                                    
                                    return (
                                        <div className="flex items-center bg-[#E3EBDE] rounded-full px-3 py-1.5 shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)] w-full">
                                            <span className="text-[10px] font-medium text-gray-600 w-1/3 truncate">
                                                Lease
                                            </span>
                                            {hasLease ? (
                                                <button
                                                    onClick={() => navigate(`/dashboard/portfolio/leases/${leaseId}`)}
                                                    className="text-xs text-[#3A6D6C] font-medium w-2/3 pl-2 truncate hover:underline cursor-pointer text-left"
                                                    title={`Click to view ${leaseDisplay}`}
                                                >
                                                    {leaseDisplay}
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-800 font-medium w-2/3 pl-2 truncate">
                                                    {leaseDisplay}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })()}
                                <CustomTextBox
                                    label="Type"
                                    value={getTransactionTypeDisplay()}
                                    className="w-full"
                                    labelClassName="text-gray-600"
                                    valueClassName="text-gray-800"
                                />

                                {/* Row 3 */}
                                <CustomTextBox
                                    label="Frequency"
                                    value={getFrequencyDisplay()}
                                    className="w-full"
                                    labelClassName="text-gray-600"
                                    valueClassName="text-gray-800"
                                />
                                <CustomTextBox
                                    label="Next invoice"
                                    value={nextInvoiceDate ? formatDate(nextInvoiceDate) : 'N/A'}
                                    className="w-full"
                                    labelClassName="text-gray-600"
                                    valueClassName="text-gray-800"
                                />

                                {/* Row 4 - Full Width Details */}
                                <div className="col-span-1 md:col-span-2">
                                    <CustomTextBox
                                        label="Details"
                                        value={recurringTransaction.details || 'N/A'}
                                        className="w-full min-h-[80px] items-start py-4"
                                        labelClassName="text-gray-600"
                                        valueClassName="text-gray-800 whitespace-normal"
                                        multiline={true}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Attachments Section */}
                <div className="mb-8">
                    <div
                        className="flex items-center gap-2 mb-4 cursor-pointer"
                        onClick={() => setIsAttachmentsCollapsed(!isAttachmentsCollapsed)}
                    >
                        <h2 className="text-lg font-bold text-gray-800">Attachments</h2>
                        <ChevronDown className={`w-5 h-5 transition-transform ${isAttachmentsCollapsed ? '-rotate-90' : ''}`} />
                    </div>

                    {!isAttachmentsCollapsed && (
                        <div className="bg-[#F0F0F6] rounded-[2.5rem] p-12 flex flex-col items-center justify-center min-h-[200px]">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm transform -rotate-45">
                                <Paperclip className="w-6 h-6 text-[#3A6D6C]" />
                            </div>
                            <p className="text-gray-500 font-medium text-sm">No attachments yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecurringDetail;
