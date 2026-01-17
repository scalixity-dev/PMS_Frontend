import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronLeft, Edit, Trash2, Paperclip, ChevronDown } from 'lucide-react';
import CustomTextBox from '../../components/CustomTextBox';
import EditPaymentModal from './components/EditPaymentModal';
import RefundRentModal from './components/RefundRentModal';
import MarkAsPaidModal from './components/MarkAsPaidModal';
import ApplyDepositsModal from './components/ApplyDepositsModal';
import ApplyCreditsModal from './components/ApplyCreditsModal';
import AddDiscountModal from './components/AddDiscountModal';
import EditInvoiceModal from './components/EditInvoiceModal';
import VoidTransactionModal from './components/VoidTransactionModal';
import { useTransactionStore } from './store/transactionStore';
import DeleteConfirmationModal from '../../../../components/common/modals/DeleteConfirmationModal';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import { useGetTransaction, useUpdateTransaction, useDeleteTransaction, useVoidTransaction, useUpdateDiscount, useDeletePayment, useMarkAsPaid } from '../../../../hooks/useTransactionQueries';
import { formatMoney } from '../../../../utils/currency.utils';
// Using console for now - replace with your toast library if available
const toast = {
    success: (message: string) => console.log('Success:', message),
    error: (message: string) => console.error('Error:', message),
};

const TransactionDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);
    const [isPaymentsCollapsed, setIsPaymentsCollapsed] = useState(false);
    const [isAttachmentsCollapsed, setIsAttachmentsCollapsed] = useState(false);
    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const actionsDropdownRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const fromPayments = location.state?.from === 'payments';

    const {
        setEditPaymentModalOpen,
        setRefundModalOpen,
        setDeleteModalOpen,
        setMarkAsPaidOpen,
        setApplyDepositsOpen,
        setApplyCreditsOpen,
        setAddDiscountOpen,
        setDeleteTransactionOpen,
        setEditInvoiceOpen,
        setVoidModalOpen,
        setSelectedPayment,
        selectedPayment,
        setClonedTransactionData,
        setEditingTransactionData,
        setMarkAsPaidData,
        isDeleteModalOpen,
        isDeleteTransactionOpen
    } = useTransactionStore();

    // Fetch transaction data
    const { data: transactionData, isLoading, error, refetch } = useGetTransaction(id);
    const updateTransactionMutation = useUpdateTransaction();
    const deleteTransactionMutation = useDeleteTransaction();
    const voidTransactionMutation = useVoidTransaction();
    const updateDiscountMutation = useUpdateDiscount();
    const deletePaymentMutation = useDeletePayment();
    const markAsPaidMutation = useMarkAsPaid();

    const transaction = transactionData;

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

    // Get contact name
    const getContactName = (): string => {
        if (!transaction) return 'N/A';
        if (transaction.payer) {
            return transaction.payer.fullName || transaction.payer.email || 'N/A';
        }
        if (transaction.payee) {
            return transaction.payee.fullName || transaction.payee.email || 'N/A';
        }
        if (transaction.contact) {
            const nameParts = [
                transaction.contact.firstName,
                transaction.contact.middleName,
                transaction.contact.lastName,
            ].filter(Boolean);
            return nameParts.length > 0 ? nameParts.join(' ') : transaction.contact.email || 'N/A';
        }
        return 'N/A';
    };

    // Calculate payment progress
    const getPaymentProgress = () => {
        if (!transaction) return { paid: 0, left: 0, percentage: 0 };
        const total = parseFloat(transaction.amount);
        const balance = parseFloat(transaction.balance);
        const paid = total - balance;
        const percentage = total > 0 ? (paid / total) * 100 : 0;
        return { paid, left: balance, percentage };
    };

    // Get transaction type display
    const getTransactionTypeDisplay = (): string => {
        if (!transaction) return 'N/A';
        const type = transaction.type;
        const category = transaction.subcategory || transaction.category || '';

        if (type === 'INVOICE') {
            if (transaction.payerId) {
                return `Income / ${category}`;
            } else if (transaction.payeeId) {
                return `Expense / ${category}`;
            }
            return `Invoice / ${category}`;
        }
        return `${type} / ${category}`;
    };

    // Get property display
    const getPropertyDisplay = (): string => {
        if (!transaction) return 'N/A';
        if (transaction.property) {
            const propertyName = transaction.property.propertyName;
            if (transaction.unit) {
                return `${propertyName}, ${transaction.unit.unitName}`;
            }
            return propertyName;
        }
        return 'N/A';
    };

    // Get lease display
    const getLeaseDisplay = (): string => {
        if (!transaction) return 'N/A';
        if (transaction.lease) {
            const contactName = getContactName();
            return `Lease #${transaction.lease.id.slice(0, 8)} (${contactName})`;
        }
        return 'N/A';
    };

    // Handle edit invoice
    const handleEditInvoice = (data: any) => {
        if (!id) return;

        const updateData: any = {};
        if (data.category) updateData.category = data.category;
        if (data.amount) updateData.amount = parseFloat(data.amount.replace(/[^0-9.]/g, ''));
        if (data.dueOn) updateData.dueDate = data.dueOn instanceof Date ? data.dueOn.toISOString() : data.dueOn;
        if (data.details !== undefined) updateData.details = data.details;
        if (data.notes !== undefined) updateData.notes = data.notes;
        if (data.tags) {
            updateData.tags = typeof data.tags === 'string'
                ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
                : data.tags;
        }

        updateTransactionMutation.mutate(
            {
                transactionId: id,
                updateData,
                file: data.selectedFile || undefined,
            },
            {
                onSuccess: () => {
                    toast.success('Transaction updated successfully');
                    setEditInvoiceOpen(false);
                    refetch();
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to update transaction');
                },
            }
        );
    };

    // Handle delete transaction
    const handleDeleteTransaction = () => {
        if (!id) return;
        deleteTransactionMutation.mutate(id, {
            onSuccess: () => {
                toast.success('Transaction deleted successfully');
                setDeleteTransactionOpen(false);
                navigate(-1);
            },
            onError: (error: any) => {
                toast.error(error.message || 'Failed to delete transaction');
            },
        });
    };

    // Handle void transaction
    const handleVoidTransaction = (reason: string) => {
        if (!id) return;
        voidTransactionMutation.mutate(
            {
                transactionId: id,
                reason,
            },
            {
                onSuccess: () => {
                    toast.success('Transaction voided successfully');
                    setVoidModalOpen(false);
                    refetch();
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to void transaction');
                },
            }
        );
    };

    // Handle delete payment
    const handleDeletePayment = () => {
        if (!id || !selectedPayment?.paymentId) return;
        deletePaymentMutation.mutate(
            {
                transactionId: id,
                paymentId: selectedPayment.paymentId,
            },
            {
                onSuccess: () => {
                    toast.success('Payment deleted successfully');
                    setDeleteModalOpen(false);
                    setSelectedPayment(null);
                    refetch();
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to delete payment');
                },
            }
        );
    };

    // Handle mark as paid
    const handleMarkAsPaid = (data: any) => {
        if (!id) return;
        markAsPaidMutation.mutate(
            {
                transactionId: id,
                data: {
                    datePaid: data.datePaid.toISOString().split('T')[0],
                    amountPaid: parseFloat(data.amountPaid),
                    method: data.method,
                    paymentDetails: data.paymentDetails,
                    referenceNumber: data.referenceNumber,
                    notes: data.notes,
                },
                file: data.selectedFile || undefined,
            },
            {
                onSuccess: () => {
                    toast.success('Transaction marked as paid successfully');
                    setMarkAsPaidOpen(false);
                    refetch();
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to mark transaction as paid');
                },
            }
        );
    };

    // Handle update discount
    const handleUpdateDiscount = (data: any) => {
        if (!id) return;
        updateDiscountMutation.mutate(
            {
                transactionId: id,
                discount: parseFloat(data.discount),
                file: data.selectedFile || undefined,
            },
            {
                onSuccess: () => {
                    toast.success('Discount updated successfully');
                    setAddDiscountOpen(false);
                    refetch();
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to update discount');
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen font-outfit flex items-center justify-center">
                <div className="text-gray-600">Loading transaction...</div>
            </div>
        );
    }

    if (error || !transaction) {
        return (
            <div className="max-w-7xl mx-auto min-h-screen font-outfit flex items-center justify-center">
                <div className="text-red-600">
                    {error ? 'Failed to load transaction' : 'Transaction not found'}
                </div>
            </div>
        );
    }

    const progress = getPaymentProgress();
    const currency = transaction.currency || 'USD';
    const dueDate = transaction.dueDate ? new Date(transaction.dueDate) : null;
    const isOverdue = dueDate && dueDate < new Date() && progress.left > 0 && transaction.status !== 'PAID';

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            <EditPaymentModal
                onConfirm={() => {
                    // EditPaymentModal will handle the API call internally
                    setEditPaymentModalOpen(false);
                }}
            />
            <RefundRentModal
                onConfirm={() => {
                    // RefundRentModal will handle the API call internally
                    setRefundModalOpen(false);
                }}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDeletePayment}
                title="Delete Payment"
                message={
                    <>
                        Are you sure you want to delete this payment
                        {selectedPayment?.date && selectedPayment?.amount && (
                            <span className="font-semibold text-gray-900"> of {selectedPayment.amount} on {selectedPayment.date}</span>
                        )}
                        ?
                        <br />
                        <span className="text-sm text-gray-500 mt-2 block">
                            This action cannot be undone. The payment record will be permanently removed from the transaction history.
                        </span>
                    </>
                }
                confirmText="Delete Payment"
                itemName="Payment"
                headerClassName="bg-red-600"
            />
            <MarkAsPaidModal
                onConfirm={handleMarkAsPaid}
            />
            <ApplyDepositsModal
                onConfirm={() => {
                    // ApplyDepositsModal will handle the API call internally
                    setApplyDepositsOpen(false);
                }}
            />
            <ApplyCreditsModal
                onConfirm={() => {
                    // ApplyCreditsModal will handle the API call internally
                    setApplyCreditsOpen(false);
                }}
            />
            <AddDiscountModal
                onConfirm={handleUpdateDiscount}
                transactionId={id}
                transactionAmount={transaction ? parseFloat(transaction.amount) : undefined}
                currency={transaction?.currency || 'USD'}
                amountOwed={transaction ? formatMoney(parseFloat(transaction.balance), transaction.currency || 'USD') : undefined}
            />
            <DeleteConfirmationModal
                isOpen={isDeleteTransactionOpen}
                onClose={() => setDeleteTransactionOpen(false)}
                onConfirm={handleDeleteTransaction}
                title="Delete transaction"
                message={
                    <span className="text-gray-700 leading-relaxed block text-center">
                        Deleting a transaction means it will be deleted from your accounting and from payer's portals if this transaction is shared.
                    </span>
                }
                confirmText="Delete"
                confirmButtonClass="bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors px-6 py-2.5"
            />
            <EditInvoiceModal
                onConfirm={handleEditInvoice}
            />
            <VoidTransactionModal
                onConfirm={handleVoidTransaction}
            />

            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Dashboard', path: '/dashboard' },
                    fromPayments
                        ? { label: 'Payments', path: '/dashboard/accounting/payments' }
                        : { label: 'Transactions', path: '/dashboard/accounting/transactions' },
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
                        Transaction
                    </button>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => {
                                setEditingTransactionData({
                                    category: transaction.category || '',
                                    amount: transaction.amount,
                                    date: transaction.dueDate ? formatDate(transaction.dueDate) : undefined,
                                    details: transaction.details || '',
                                    tags: transaction.tags?.map(t => t.tag).join(', ') || ''
                                });
                                setEditInvoiceOpen(true);
                            }}
                            className="px-6 py-2 bg-[#5F6D7E] text-white rounded-full text-sm font-medium hover:bg-[#4a5563] transition-colors flex-1 sm:flex-none"
                            disabled={transaction.status === 'VOID'}
                        >
                            Edit
                        </button>

                        {/* Actions Dropdown */}
                        <div className="relative flex-1 sm:flex-none" ref={actionsDropdownRef}>
                            <button
                                onClick={() => setIsActionsOpen(!isActionsOpen)}
                                className="w-full sm:w-auto px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center justify-center gap-2"
                                disabled={transaction.status === 'VOID'}
                            >
                                Action
                                <ChevronDown className={`w-4 h-4 transition-transform ${isActionsOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isActionsOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                                    <button
                                        onClick={() => {
                                            setIsActionsOpen(false);
                                            setClonedTransactionData({
                                                property: getPropertyDisplay(),
                                                transactionId: transaction.transactionId,
                                                lease: getLeaseDisplay(),
                                                type: getTransactionTypeDisplay(),
                                                details: transaction.details || '',
                                                date: formatDate(transaction.transactionDate),
                                                amount: transaction.amount,
                                            });
                                            navigate('/dashboard/accounting/transactions/recurring-expense/add');
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Make recurring
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsActionsOpen(false);
                                            setClonedTransactionData({
                                                property: getPropertyDisplay(),
                                                transactionId: transaction.transactionId,
                                                lease: getLeaseDisplay(),
                                                type: getTransactionTypeDisplay(),
                                                details: transaction.details || '',
                                                date: formatDate(transaction.transactionDate),
                                                amount: transaction.amount,
                                            });
                                            navigate('/dashboard/accounting/transactions/clone');
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Clone
                                    </button>
                                    <button
                                        onClick={() => { setIsActionsOpen(false); setApplyDepositsOpen(true); }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        disabled={transaction.status === 'VOID' || transaction.status === 'PAID'}
                                    >
                                        Apply deposits
                                    </button>
                                    <button
                                        onClick={() => { setIsActionsOpen(false); setApplyCreditsOpen(true); }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        disabled={transaction.status === 'VOID' || transaction.status === 'PAID'}
                                    >
                                        Apply credits
                                    </button>
                                    <button
                                        onClick={() => { setIsActionsOpen(false); setAddDiscountOpen(true); }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        disabled={transaction.status === 'VOID'}
                                    >
                                        Add discount
                                    </button>
                                    <button
                                        onClick={() => { setIsActionsOpen(false); setVoidModalOpen(true); }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                        disabled={transaction.status === 'VOID' || transaction.status === 'PAID'}
                                    >
                                        Void
                                    </button>
                                    <button
                                        onClick={() => { setIsActionsOpen(false); setDeleteTransactionOpen(true); }}
                                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                setMarkAsPaidData({
                                    amount: progress.left.toString(),
                                    date: new Date()
                                });
                                setMarkAsPaidOpen(true);
                            }}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex-1 sm:flex-none whitespace-nowrap"
                            disabled={transaction.status === 'VOID' || transaction.status === 'PAID' || progress.left === 0}
                        >
                            Mark As Paid
                        </button>
                    </div>
                </div>

                {/* Top Card */}
                <div className="bg-[#F0F0F6] rounded-[2rem] p-4 sm:p-8 mb-8">
                    {/* Due Date Pill */}
                    {dueDate && (
                        <div className="mb-10">
                            <span className={`px-6 py-2 ${isOverdue ? 'bg-red-500' : 'bg-[#7BD747]'} text-white rounded-full text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,0.1)]`}>
                                Due on {formatDate(dueDate)}
                            </span>
                        </div>
                    )}

                    {/* Main White Card with Overlapping Pill */}
                    <div className="bg-white rounded-[2rem] p-4 sm:p-8 pb-4 border border-[#7BD747] relative mb-8 shadow-sm mt-8">
                        {/* Overlapping Category Pill - Half Outside */}
                        <div className="absolute -top-5 left-4 sm:left-8 bg-[#3A6D6C] text-white px-4 sm:px-6 py-2 rounded-full flex items-center gap-2 max-w-[90%] sm:max-w-none">
                            <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">{currency === 'INR' ? '₹' : '$'}</span>
                            </div>
                            <span className="font-semibold text-xs sm:text-sm truncate">
                                {transaction.subcategory || transaction.category || 'Transaction'} for {formatMoney(parseFloat(transaction.amount), currency)}
                            </span>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="mt-4 mb-2">
                            {/* Progress Track */}
                            <div className="relative h-6 bg-gray-200 rounded-full w-full overflow-hidden flex items-center mb-3">
                                <div
                                    className="h-full bg-gradient-to-r from-[#7BD747] to-[#427326] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] transition-all duration-300"
                                    style={{ width: `${progress.percentage}%` }}
                                ></div>
                            </div>

                            {/* Status Text Row */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm font-bold text-gray-700 gap-1">
                                <span>{formatMoney(progress.left, currency)} Left</span>
                                <span className="text-[#2F5C5B]">{formatMoney(progress.paid, currency)} Paid</span>
                            </div>
                        </div>
                    </div>

                    {/* Tags Row - Outside the white card */}
                    {transaction.tags && transaction.tags.length > 0 && (
                        <div className="flex gap-4 flex-wrap px-0 sm:px-2">
                            {transaction.tags.map((tagObj, idx) => (
                                <div key={tagObj.id || idx} className="flex items-center gap-2 px-4 py-2 rounded-full border-[1.5px] border-[#7BD747] text-xs font-bold text-gray-700 bg-white shadow-sm">
                                    <div className="w-5 h-5 rounded-full bg-[#7BD747] text-white flex items-center justify-center text-[10px] font-bold">
                                        {idx + 1}
                                    </div>
                                    {tagObj.tag}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Payers Section */}
                <div className="bg-[#F0F0F6] rounded-[2rem] p-6 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <button className="px-6 py-2 bg-[#7BD747] text-white rounded-full text-sm font-bold shadow-sm text-center">
                        {transaction.payerId ? 'Payers' : transaction.payeeId ? 'Payees' : 'Contacts'}
                    </button>
                    <div className="px-8 py-2 bg-[#dcdcdc] text-gray-700 rounded-full text-sm font-medium text-center">
                        {getContactName()}
                    </div>
                </div>

                {/* Summary Section */}
                <div className="mb-8 bg-[#E9E9E9] rounded-[2rem] p-6 shadow-md">
                    <div
                        className="flex items-center gap-2 mb-4 cursor-pointer"
                        onClick={() => setIsSummaryCollapsed(!isSummaryCollapsed)}
                    >
                        <h2 className="text-lg font-bold text-gray-800">Summary</h2>
                        <ChevronDown className={`w-5 h-5 transition-transform ${isSummaryCollapsed ? '-rotate-90' : ''}`} />
                    </div>

                    {!isSummaryCollapsed && (
                        <div className="bg-[#F0F0F6] rounded-[2.5rem] p-8 shadow-md">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                {/* Row 1 */}
                                <CustomTextBox
                                    label="Property"
                                    value={getPropertyDisplay()}
                                    className="w-full"
                                    labelClassName="text-gray-600"
                                    valueClassName="text-gray-800"
                                />
                                <CustomTextBox
                                    label="Transaction ID"
                                    value={transaction.transactionId}
                                    className="w-full"
                                    labelClassName="text-gray-600"
                                    valueClassName="text-gray-800"
                                />

                                {/* Row 2 */}
                                <CustomTextBox
                                    label="Lease"
                                    value={getLeaseDisplay()}
                                    className="w-full"
                                    labelClassName="text-gray-600"
                                    valueClassName="text-gray-800"
                                />
                                <CustomTextBox
                                    label="Type"
                                    value={getTransactionTypeDisplay()}
                                    className="w-full"
                                    labelClassName="text-gray-600"
                                    valueClassName="text-gray-800"
                                />

                                {/* Row 3 - Full Width Details */}
                                <div className="col-span-1 md:col-span-2">
                                    <CustomTextBox
                                        label="Details"
                                        value={transaction.details || 'N/A'}
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

                {/* Payments & Activity Section */}
                <div className="mb-8 bg-[#E9E9E9] rounded-[2rem] p-6 shadow-md">
                    <div
                        className="flex items-center gap-2 mb-4 cursor-pointer"
                        onClick={() => setIsPaymentsCollapsed(!isPaymentsCollapsed)}
                    >
                        <h2 className="text-lg font-bold text-gray-800">Payments & Activity</h2>
                        <ChevronDown className={`w-5 h-5 transition-transform ${isPaymentsCollapsed ? '-rotate-90' : ''}`} />
                    </div>

                    {!isPaymentsCollapsed && (
                        <div className="bg-[#F0F0F6] rounded-[2.5rem] p-4 shadow-md">
                            <div className="w-full">
                                {/* Header Row - Hidden on mobile */}
                                <div className="hidden md:grid grid-cols-[1fr_1fr_1fr_1fr_100px_80px] gap-4 items-center px-4 py-3 bg-[var(--color-primary)] rounded-t-lg mb-2 text-xs font-bold text-white">
                                    <div>Date</div>
                                    <div>Status</div>
                                    <div>Amount</div>
                                    <div>User</div>
                                    <div>Refund</div>
                                    <div>Actions</div>
                                </div>

                                {transaction.payments && transaction.payments.length > 0 ? (
                                    transaction.payments.map((payment: any, index: number) => {
                                        const paymentDate = new Date(payment.paymentDate);
                                        const paymentStatus = 'Success'; // Payments are always successful
                                        const paymentAmount = formatMoney(parseFloat(payment.amount), currency);
                                        const userName = payment.recordedByUser?.fullName || 'N/A';

                                        return (
                                            <div key={payment.id} className="mb-2">
                                                {/* Desktop View */}
                                                <div className="hidden md:block">
                                                    <CustomTextBox
                                                        value={
                                                            <div className="grid grid-cols-[1fr_1fr_1fr_1fr_100px_80px] gap-10 items-center w-full">
                                                                <div>{formatDate(paymentDate)}</div>
                                                                <div className="text-green-600 font-bold">{paymentStatus}</div>
                                                                <div>{paymentAmount}</div>
                                                                <div>{userName}</div>
                                                                <div>
                                                                    <button
                                                                        onClick={() => {
                                                                            setSelectedPayment({
                                                                                date: formatDate(paymentDate),
                                                                                amount: paymentAmount,
                                                                                paymentId: payment.id
                                                                            });
                                                                            setRefundModalOpen(true);
                                                                        }}
                                                                        className="bg-[#a8f090] text-green-800 px-4 py-1 rounded-full text-xs font-bold hover:bg-[#97e080]"
                                                                    >
                                                                        Refund
                                                                    </button>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        className="text-[#3A6D6C] hover:text-[#2c5251]"
                                                                        onClick={() => {
                                                                            setSelectedPayment({
                                                                                date: formatDate(paymentDate),
                                                                                amount: paymentAmount,
                                                                                paymentId: payment.id
                                                                            });
                                                                            setEditPaymentModalOpen(true);
                                                                        }}
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        className="text-red-500 hover:text-red-600"
                                                                        onClick={() => {
                                                                            setSelectedPayment({
                                                                                date: formatDate(paymentDate),
                                                                                amount: paymentAmount,
                                                                                paymentId: payment.id
                                                                            });
                                                                            setDeleteModalOpen(true);
                                                                        }}
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        }
                                                        className={`w-full px-0 py-3 h-auto ${index !== (transaction.payments?.length || 0) - 1 ? 'border-b border-gray-200' : ''}`}
                                                        valueClassName="w-full"
                                                    />
                                                </div>

                                                {/* Mobile View - Card Layout */}
                                                <div className="md:hidden bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3 last:mb-0">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex flex-col">
                                                            <span className="text-gray-800 font-bold text-base">{paymentAmount}</span>
                                                            <span className="text-gray-500 text-xs">{formatDate(paymentDate)}</span>
                                                        </div>
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                            {paymentStatus}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm mb-3">
                                                        <span className="text-gray-600">User:</span>
                                                        <span className="text-gray-800 font-medium">{userName}</span>
                                                    </div>
                                                    <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedPayment({
                                                                    date: formatDate(paymentDate),
                                                                    amount: paymentAmount,
                                                                    paymentId: payment.id
                                                                });
                                                                setRefundModalOpen(true);
                                                            }}
                                                            className="bg-[#a8f090] text-green-800 px-3 py-1 rounded-full text-xs font-bold hover:bg-[#97e080]"
                                                        >
                                                            Refund
                                                        </button>
                                                        <button
                                                            className="text-[#3A6D6C] hover:text-[#2c5251] p-1 rounded-full"
                                                            onClick={() => {
                                                                setSelectedPayment({
                                                                    date: formatDate(paymentDate),
                                                                    amount: paymentAmount,
                                                                    paymentId: payment.id
                                                                });
                                                                setEditPaymentModalOpen(true);
                                                            }}
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            className="text-red-500 hover:text-red-600 p-1 rounded-full"
                                                            onClick={() => {
                                                                setSelectedPayment({
                                                                    date: formatDate(paymentDate),
                                                                    amount: paymentAmount,
                                                                    paymentId: payment.id
                                                                });
                                                                setDeleteModalOpen(true);
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-8 text-gray-500">
                                        No payments recorded yet
                                    </div>
                                )}
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
                            {transaction.attachments && transaction.attachments.length > 0 ? (
                                <div className="w-full space-y-4">
                                    {transaction.attachments.map((attachment) => (
                                        <a
                                            key={attachment.id}
                                            href={attachment.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                        >
                                            <Paperclip className="w-5 h-5 text-[#3A6D6C]" />
                                            <span className="text-gray-700 font-medium">{attachment.fileName}</span>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm transform -rotate-45">
                                        <Paperclip className="w-6 h-6 text-[#3A6D6C]" />
                                    </div>
                                    <p className="text-gray-500 font-medium text-sm">No attachments yet</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TransactionDetail;
