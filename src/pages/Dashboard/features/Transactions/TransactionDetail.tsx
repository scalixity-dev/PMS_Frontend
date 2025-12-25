import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Edit, Plus, Trash2, Paperclip, ChevronDown } from 'lucide-react';
import CustomTextBox from '../../components/CustomTextBox';
import EditPaymentModal from './components/EditPaymentModal';
import RefundRentModal from './components/RefundRentModal';
import DeletePaymentModal from './components/DeletePaymentModal';
import MarkAsPaidModal from './components/MarkAsPaidModal';
import ApplyDepositsModal from './components/ApplyDepositsModal';
import ApplyCreditsModal from './components/ApplyCreditsModal';
import AddDiscountModal from './components/AddDiscountModal';
import DeleteTransactionModal from './components/DeleteTransactionModal';
import EditInvoiceModal from './components/EditInvoiceModal';
import VoidTransactionModal from './components/VoidTransactionModal';
import { useTransactionStore } from './store/transactionStore';

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
        setClonedTransactionData
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
            <EditPaymentModal />
            <RefundRentModal />
            <DeletePaymentModal
                onConfirm={() => {
                    // Handle delete logic here
                    setDeleteModalOpen(false);
                    setSelectedPayment(null);
                }}
            />
            <MarkAsPaidModal />
            <ApplyDepositsModal />
            <ApplyCreditsModal />
            <AddDiscountModal />
            <DeleteTransactionModal
                onConfirm={() => {
                    // Handle delete transaction logic here
                    setDeleteTransactionOpen(false);
                }}
            />
            <EditInvoiceModal />
            <VoidTransactionModal
                onConfirm={(reason) => {
                    // Handle void logic here
                    console.log('Voiding transaction with reason:', reason);
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
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                        Transaction
                    </button>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setEditInvoiceOpen(true)}
                            className="px-6 py-2 bg-[#5F6D7E] text-white rounded-full text-sm font-medium hover:bg-[#4a5563] transition-colors"
                        >
                            Edit
                        </button>

                        {/* Actions Dropdown */}
                        <div className="relative" ref={actionsDropdownRef}>
                            <button
                                onClick={() => setIsActionsOpen(!isActionsOpen)}
                                className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2"
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
                            onClick={() => setMarkAsPaidOpen(true)}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors"
                        >
                            Mark As Paid
                        </button>
                    </div>
                </div>

                {/* Top Card */}
                <div className="bg-[#F0F0F6] rounded-[2rem] p-8 mb-8">
                    {/* Due Date Pill */}
                    <div className="mb-10">
                        <span className="px-6 py-2 bg-[#7BD747] text-white rounded-full text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                            Due on 08 Dec, 2025
                        </span>
                    </div>

                    {/* Main White Card with Overlapping Pill */}
                    <div className="bg-white rounded-[2rem] p-8 pb-4 border border-[#7BD747] relative mb-8 shadow-sm">

                        {/* Overlapping Rent Pill - Half Outside */}
                        <div className="absolute -top-5 left-8 bg-[#3A6D6C] text-white px-6 py-2 rounded-full flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center">
                                <span className="text-white text-xs font-bold">₹</span>
                            </div>
                            <span className="font-semibold text-sm">Rent for ₹53,200.00 INR</span>
                        </div>

                        {/* Progress Bar Container */}
                        <div className="mt-4 mb-2">
                            {/* Progress Track */}
                            <div className="relative h-6 bg-gray-200 rounded-full w-full overflow-hidden flex items-center mb-3">
                                <div className="h-full bg-gradient-to-r from-[#7BD747] to-[#427326] w-[75%] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"></div>
                            </div>

                            {/* Status Text Row */}
                            <div className="flex justify-between items-center text-sm font-bold text-gray-700">
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
                    <div className="flex gap-4 flex-wrap px-2">
                        {['Equipment', 'Recurring Requests', 'SmartTenantAI', 'Maintenance'].map((tag, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-full border-[1.5px] border-[#7BD747] text-xs font-bold text-gray-700 bg-white shadow-sm">
                                <div className="w-5 h-5 rounded-full bg-[#7BD747] text-white flex items-center justify-center text-[10px] font-bold">2</div>
                                {tag}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payers Section */}
                <div className="bg-[#F0F0F6] rounded-[2rem] p-6 mb-8 flex items-center gap-4">
                    <button className="px-6 py-2 bg-[#7BD747] text-white rounded-full text-sm font-bold shadow-sm">
                        Payers
                    </button>
                    <div className="px-8 py-2 bg-[#dcdcdc] text-gray-700 rounded-full text-sm font-medium">
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
                            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
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
                                <div className="col-span-2">
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
                                {/* Header Row */}
                                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_100px_80px] gap-4 items-center px-4 py-3 bg-[var(--color-primary)] rounded-t-lg mb-2 text-xs font-bold text-white">
                                    <div>Date</div>
                                    <div>Status</div>
                                    <div>Amount</div>
                                    <div>User</div>
                                    <div>Refund</div>
                                    <div>Actions</div>
                                </div>

                                {mockActivities.map((activity, index) => (
                                    <CustomTextBox
                                        key={activity.id}
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
                                        className={`w-full px-0 py-3 mb-2 h-auto ${index !== mockActivities.length - 1 ? 'border-b border-gray-200' : ''}`}
                                        valueClassName="w-full"
                                    />
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
