import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Edit, Plus, Trash2, Paperclip, ChevronDown } from 'lucide-react';
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

const TransactionDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);
    const [isPaymentsCollapsed, setIsPaymentsCollapsed] = useState(false);
    const [isAttachmentsCollapsed, setIsAttachmentsCollapsed] = useState(false);
    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const actionsDropdownRef = useRef<HTMLDivElement>(null);

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
        setMarkAsPaidData
    } = useTransactionStore();

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

    const mockActivities = [
        {
            id: 1,
            date: '08 Dec, 2025',
            status: 'Success',
            amount: '₹53,200.00',
            user: 'Atul rawat',
        },
        {
            id: 2,
            date: '08 Nov, 2025',
            status: 'Success',
            amount: '₹53,200.00',
            user: 'Atul rawat',
        },
    ];

    const mockSummaryData = {
        property: "Sunrise Apartments, Unit 304",
        transactionId: "TXN-88592011",
        lease: "Lease #L-2901 (Jay Sharma)",
        type: "Income / Recurring Monthly",
        details: "Monthly rent payment for December 2025. Includes maintenance and parking fees."
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            <EditPaymentModal
                onConfirm={(data) => {
                    console.log('Edit Payment data:', data);
                    // TODO: Implement API call
                    setEditPaymentModalOpen(false);
                }}
            />
            <RefundRentModal
                onConfirm={(data) => {
                    console.log('Refund Rent data:', data);
                    // TODO: Implement API call
                    setRefundModalOpen(false);
                }}
            />
            <DeleteConfirmationModal
                isOpen={useTransactionStore((state) => state.isDeleteModalOpen)}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => {
                    // Handle delete logic here
                    setDeleteModalOpen(false);
                    setSelectedPayment(null);
                }}
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
                onConfirm={(data) => {
                    console.log('Mark As Paid data:', data);
                    // TODO: Implement API call
                    setMarkAsPaidOpen(false);
                }}
            />
            <ApplyDepositsModal
                onConfirm={(data) => {
                    console.log('Apply Deposits data:', data);
                    // TODO: Implement API call
                    setApplyDepositsOpen(false);
                }}
            />
            <ApplyCreditsModal
                onConfirm={(data) => {
                    console.log('Apply Credits data:', data);
                    // TODO: Implement API call
                    setApplyCreditsOpen(false);
                }}
            />
            <AddDiscountModal
                onConfirm={(data) => {
                    console.log('Add Discount data:', data);
                    // TODO: Implement API call
                    setAddDiscountOpen(false);
                }}
            />
            <DeleteConfirmationModal
                isOpen={useTransactionStore((state) => state.isDeleteTransactionOpen)}
                onClose={() => setDeleteTransactionOpen(false)}
                onConfirm={() => {
                    // Handle delete transaction logic here
                    console.log('Deleting transaction...');
                    setDeleteTransactionOpen(false);
                }}
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
                onConfirm={(data) => {
                    console.log('Edit Invoice data:', data);
                    // TODO: Implement API call
                    setEditInvoiceOpen(false);
                }}
            />
            <VoidTransactionModal
                onConfirm={(reason) => {
                    console.log('Voiding transaction with reason:', reason);
                    setVoidModalOpen(false);
                }}
            />

            {/* Breadcrumb */}
            <div className="inline-flex items-center px-6 py-2 bg-[#DFE5E3] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-2">/</span>
                <span className="text-[#1a2b4b] text-sm font-semibold">Transaction</span>
                <span className="text-gray-500 text-sm mx-2">/</span>
                <span className="text-[#1a2b4b] text-sm font-semibold">Details</span>
            </div>

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
                                    category: 'rent',
                                    amount: '53,200.00',
                                    date: '08 Dec 2025',
                                    details: mockSummaryData.details,
                                    tags: 'recurring'
                                });
                                setEditInvoiceOpen(true);
                            }}
                            className="px-6 py-2 bg-[#5F6D7E] text-white rounded-full text-sm font-medium hover:bg-[#4a5563] transition-colors flex-1 sm:flex-none"
                        >
                            Edit
                        </button>

                        {/* Actions Dropdown */}
                        <div className="relative flex-1 sm:flex-none" ref={actionsDropdownRef}>
                            <button
                                onClick={() => setIsActionsOpen(!isActionsOpen)}
                                className="w-full sm:w-auto px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center justify-center gap-2"
                            >
                                Action
                                <ChevronDown className={`w-4 h-4 transition-transform ${isActionsOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isActionsOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                                    <button
                                        onClick={() => {
                                            setIsActionsOpen(false);
                                            // Fallback to first activity for data if no specific payment selected
                                            const defaultPayment = mockActivities.length > 0 ? {
                                                amount: mockActivities[0].amount,
                                                user: mockActivities[0].user,
                                                date: mockActivities[0].date
                                            } : {};

                                            const dataToPass = {
                                                ...mockSummaryData,
                                                date: selectedPayment?.date ?? defaultPayment.date,
                                                user: defaultPayment.user,
                                                amount: String(selectedPayment?.amount ?? defaultPayment.amount ?? ''),
                                            };
                                            setClonedTransactionData(dataToPass);
                                            navigate('/dashboard/accounting/transactions/recurring-expense/add');
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Make recurring
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsActionsOpen(false);
                                            // Fallback to first activity for data if no specific payment selected
                                            const defaultPayment = mockActivities.length > 0 ? {
                                                amount: mockActivities[0].amount,
                                                user: mockActivities[0].user,
                                                date: mockActivities[0].date
                                            } : {};

                                            const dataToClone = {
                                                ...mockSummaryData,
                                                date: selectedPayment?.date ?? defaultPayment.date,
                                                user: defaultPayment.user,
                                                amount: String(selectedPayment?.amount ?? defaultPayment.amount ?? ''),
                                            };
                                            setClonedTransactionData(dataToClone);
                                            navigate('/dashboard/accounting/transactions/clone');
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Clone
                                    </button>
                                    <button
                                        onClick={() => { setIsActionsOpen(false); setApplyDepositsOpen(true); }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Apply deposits
                                    </button>
                                    <button
                                        onClick={() => { setIsActionsOpen(false); setApplyCreditsOpen(true); }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Apply credits
                                    </button>
                                    <button
                                        onClick={() => { setIsActionsOpen(false); setAddDiscountOpen(true); }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Add discount
                                    </button>
                                    <button
                                        onClick={() => { setIsActionsOpen(false); setVoidModalOpen(true); }}
                                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
                                    amount: '200.00',
                                    date: new Date()
                                });
                                setMarkAsPaidOpen(true);
                            }}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex-1 sm:flex-none whitespace-nowrap"
                        >
                            Mark As Paid
                        </button>
                    </div>
                </div>

                {/* Top Card */}
                <div className="bg-[#F0F0F6] rounded-[2rem] p-4 sm:p-8 mb-8">
                    {/* Due Date Pill */}
                    <div className="mb-10">
                        <span className="px-6 py-2 bg-[#7BD747] text-white rounded-full text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                            Due on 08 Dec, 2025
                        </span>
                    </div>

                    {/* Main White Card with Overlapping Pill */}
                    <div className="bg-white rounded-[2rem] p-4 sm:p-8 pb-4 border border-[#7BD747] relative mb-8 shadow-sm mt-8">

                        {/* Overlapping Rent Pill - Half Outside */}
                        <div className="absolute -top-5 left-4 sm:left-8 bg-[#3A6D6C] text-white px-4 sm:px-6 py-2 rounded-full flex items-center gap-2 max-w-[90%] sm:max-w-none">
                            <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">₹</span>
                            </div>
                            <span className="font-semibold text-xs sm:text-sm truncate">Rent for ₹53,200.00 INR</span>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="mt-4 mb-2">
                            {/* Progress Track */}
                            <div className="relative h-6 bg-gray-200 rounded-full w-full overflow-hidden flex items-center mb-3">
                                <div className="h-full bg-gradient-to-r from-[#7BD747] to-[#427326] w-[75%] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"></div>
                            </div>

                            {/* Status Text Row */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm font-bold text-gray-700 gap-1">
                                <span>₹200.00 Left</span>
                                <span className="text-[#2F5C5B]">₹53,200.00 Paid</span>
                            </div>
                        </div>

                        {/* Add Tags Button inside the card (bottom left) */}
                        <div className="mt-4">
                            <button className="flex items-center gap-1 px-4 py-1.5 rounded-full border border-gray-300 text-xs font-bold text-gray-600 hover:bg-gray-50">
                                Add Tags <Plus className="w-3 h-3 text-[#7BD747]" />
                            </button>
                        </div>
                    </div>

                    {/* Tags Row - Outside the white card */}
                    <div className="flex gap-4 flex-wrap px-0 sm:px-2">
                        {['Equipment', 'Recurring Requests', 'Tenants', 'Maintenance'].map((tag, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full border-[1.5px] border-[#7BD747] text-xs font-bold text-gray-700 bg-white shadow-sm">
                                <div className="w-5 h-5 rounded-full bg-[#7BD747] text-white flex items-center justify-center text-[10px] font-bold">2</div>
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payers Section */}
                <div className="bg-[#F0F0F6] rounded-[2rem] p-6 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <button className="px-6 py-2 bg-[#7BD747] text-white rounded-full text-sm font-bold shadow-sm text-center">
                        Payers
                    </button>
                    <div className="px-8 py-2 bg-[#dcdcdc] text-gray-700 rounded-full text-sm font-medium text-center">
                        Jay
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
                                    value={mockSummaryData.property}
                                    className="w-full"
                                    labelClassName="text-gray-600"
                                    valueClassName="text-gray-800"
                                />
                                <CustomTextBox
                                    label="Transaction ID"
                                    value={id || mockSummaryData.transactionId}
                                    className="w-full"
                                    labelClassName="text-gray-600"
                                    valueClassName="text-gray-800"
                                />

                                {/* Row 2 */}
                                <CustomTextBox
                                    label="Lease"
                                    value={mockSummaryData.lease}
                                    className="w-full"
                                    labelClassName="text-gray-600"
                                    valueClassName="text-gray-800"
                                />
                                <CustomTextBox
                                    label="Type"
                                    value={mockSummaryData.type}
                                    className="w-full"
                                    labelClassName="text-gray-600"
                                    valueClassName="text-gray-800"
                                />

                                {/* Row 3 - Full Width Details */}
                                <div className="col-span-1 md:col-span-2">
                                    <CustomTextBox
                                        label="Details"
                                        value={mockSummaryData.details}
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

                                {mockActivities.map((activity, index) => (
                                    <div key={activity.id} className="mb-2">
                                        {/* Desktop View */}
                                        <div className="hidden md:block">
                                            <CustomTextBox
                                                value={
                                                    <div className="grid grid-cols-[1fr_1fr_1fr_1fr_100px_80px] gap-10 items-center w-full">
                                                        <div>{activity.date}</div>
                                                        <div className="text-green-600 font-bold">{activity.status}</div>
                                                        <div>{activity.amount}</div>
                                                        <div>{activity.user}</div>
                                                        <div>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedPayment({ date: activity.date, amount: activity.amount });
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
                                                                    setSelectedPayment({ date: activity.date, amount: activity.amount });
                                                                    setEditPaymentModalOpen(true);
                                                                }}
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                className="text-red-500 hover:text-red-600"
                                                                onClick={() => {
                                                                    setSelectedPayment({ date: activity.date, amount: activity.amount });
                                                                    setDeleteModalOpen(true);
                                                                }}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                }
                                                className={`w-full px-0 py-3 h-auto ${index !== mockActivities.length - 1 ? 'border-b border-gray-200' : ''}`}
                                                valueClassName="w-full"
                                            />
                                        </div>

                                        {/* Mobile View - Card Layout */}
                                        <div className="md:hidden bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-3 last:mb-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-800 font-bold text-base">{activity.amount}</span>
                                                    <span className="text-gray-500 text-xs">{activity.date}</span>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${activity.status === 'Success' ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {activity.status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm mb-3">
                                                <span className="text-gray-600">User:</span>
                                                <span className="text-gray-800 font-medium">{activity.user}</span>
                                            </div>
                                            <div className="flex justify-end gap-2 border-t border-gray-100 pt-3">
                                                <button
                                                    onClick={() => {
                                                        setSelectedPayment({ date: activity.date, amount: activity.amount });
                                                        setRefundModalOpen(true);
                                                    }}
                                                    className="bg-[#a8f090] text-green-800 px-3 py-1 rounded-full text-xs font-bold hover:bg-[#97e080]"
                                                >
                                                    Refund
                                                </button>
                                                <button
                                                    className="text-[#3A6D6C] hover:text-[#2c5251] p-1 rounded-full"
                                                    onClick={() => {
                                                        setSelectedPayment({ date: activity.date, amount: activity.amount });
                                                        setEditPaymentModalOpen(true);
                                                    }}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-600 p-1 rounded-full"
                                                    onClick={() => {
                                                        setSelectedPayment({ date: activity.date, amount: activity.amount });
                                                        setDeleteModalOpen(true);
                                                    }}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
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

export default TransactionDetail;
