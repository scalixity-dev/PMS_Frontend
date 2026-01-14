import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, Paperclip, ChevronDown, User } from 'lucide-react';
import CustomTextBox from '../../components/CustomTextBox';
import PostNextInvoiceModal from './components/PostNextInvoiceModal';
import { useTransactionStore } from '../Transactions/store/transactionStore';

const RecurringDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);
    const [isAttachmentsCollapsed, setIsAttachmentsCollapsed] = useState(false);
    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const actionsDropdownRef = useRef<HTMLDivElement>(null);
    const { setClonedTransactionData } = useTransactionStore();

    const [isPostInvoiceModalOpen, setIsPostInvoiceModalOpen] = useState(false);

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

    const mockData = {
        date: '17 Dec, 2025',
        title: 'Rent',
        amount: '₹5,222.00',
        status: 'Active',
        payers: [
            { name: 'Atul rawat', initials: 'AR' },
            { name: 'Siddak Bagga', initials: 'SB' }
        ],
        summary: {
            property: 'bhbh',
            transactionId: '1503137',
            lease: '20',
            type: 'Income / Recurring Monthly',
            invoicing: 'Separated',
            nextInvoice: '12 Feb, 2026',
            details: 'Rent'
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            <PostNextInvoiceModal
                isOpen={isPostInvoiceModalOpen}
                onClose={() => setIsPostInvoiceModalOpen(false)}
                onConfirm={() => {
                    console.log('Confirmed post next invoice');
                    setIsPostInvoiceModalOpen(false);
                }}
            />

            {/* Breadcrumb */}
            <div className="inline-flex items-center px-6 py-2 bg-[#DFE5E3] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-2">/</span>
                <span className="text-[#1a2b4b] text-sm font-semibold">Recurring</span>
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
                        Recurring
                    </button>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setIsPostInvoiceModalOpen(true)}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex-1 sm:flex-none whitespace-nowrap"
                        >
                            Post next invoice
                        </button>
                        <button
                            className="px-6 py-2 bg-[#5F6D7E] text-white rounded-full text-sm font-medium hover:bg-[#4a5563] transition-colors flex-1 sm:flex-none"
                        >
                            End
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
                                                category: mockData.summary.type.split('/')[0].trim(), // Extract from type string
                                                amount: mockData.amount,
                                                date: mockData.date,
                                                details: mockData.summary.details,
                                                user: mockData.payers[0]?.name // Use first payer as default
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
                                            // Handle Delete
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
                    <div className="mb-10">
                        <span className="px-6 py-2 bg-[#7BD747] text-white rounded-full text-sm font-bold shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
                            Due on {mockData.date}
                        </span>
                    </div>

                    {/* Main White Card */}
                    <div className="bg-white rounded-[2rem] p-4 sm:p-8 pb-4 border border-[#7BD747] relative mb-8 shadow-sm mt-8">
                        {/* Title & Amount */}
                        <div className="flex items-center gap-2 mb-4">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {mockData.title} <span className="font-normal text-gray-600">for</span> {mockData.amount}
                            </h1>
                            <span className="px-3 py-1 bg-white border border-[#7BD747] text-[#7BD747] rounded-full text-xs font-bold flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-[#7BD747]"></div>
                                {mockData.status}
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
                                {mockData.payers.map((payer, idx) => (
                                    <div key={idx} className="flex items-center gap-2 bg-[#F0F9F6] pr-4 pl-1 py-1 rounded-full">
                                        <div className="w-8 h-8 rounded-full bg-[#7BD747] text-white flex items-center justify-center text-xs font-bold">
                                            {payer.initials}
                                        </div>
                                        <span className="text-[#3A6D6C] font-medium text-sm">{payer.name}</span>
                                    </div>
                                ))}
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
                                <CustomTextBox
                                    label="Property"
                                    value={mockData.summary.property}
                                    className="w-full"
                                    labelClassName="text-gray-600"
                                    valueClassName="text-gray-800"
                                />
                                <CustomTextBox
                                    label="Transaction ID"
                                    value={id || mockData.summary.transactionId}
                                    className="w-full"
                                    labelClassName="text-gray-600"
                                    valueClassName="text-gray-800"
                                />

                                {/* Row 2 */}
                                <CustomTextBox
                                    label="Lease"
                                    value={mockData.summary.lease}
                                    className="w-full"
                                    labelClassName="text-gray-600"
                                    valueClassName="text-gray-800"
                                />
                                <CustomTextBox
                                    label="Type"
                                    value={mockData.summary.type}
                                    className="w-full"
                                    labelClassName="text-gray-600"
                                    valueClassName="text-gray-800"
                                />

                                {/* Row 3 */}
                                <CustomTextBox
                                    label="Invoicing"
                                    value={mockData.summary.invoicing}
                                    className="w-full"
                                    labelClassName="text-gray-600"
                                    valueClassName="text-gray-800"
                                />
                                <CustomTextBox
                                    label="Next invoice"
                                    value={mockData.summary.nextInvoice}
                                    className="w-full"
                                    labelClassName="text-gray-600"
                                    valueClassName="text-gray-800"
                                />

                                {/* Row 4 - Full Width Details */}
                                <div className="col-span-1 md:col-span-2">
                                    <CustomTextBox
                                        label="Details"
                                        value={mockData.summary.details}
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
