import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ChevronLeft, Download, Check, MoreHorizontal, ChevronDown } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import { useTransactionStore } from '../Transactions/store/transactionStore';
import EditInvoiceModal from '../Transactions/components/EditInvoiceModal';
import DeleteTransactionModal from '../Transactions/components/DeleteTransactionModal';
import ApplyDepositsModal from '../Transactions/components/ApplyDepositsModal';
import ApplyCreditsModal from '../Transactions/components/ApplyCreditsModal';
import AddDiscountModal from '../Transactions/components/AddDiscountModal';
import MarkAsPaidModal from '../Transactions/components/MarkAsPaidModal';
import VoidTransactionModal from '../Transactions/components/VoidTransactionModal';
import EditPaymentModal from './components/EditPaymentModal';
import RefundPaymentModal from './components/RefundPaymentModal';
import { utils, writeFile } from 'xlsx';

// Mock Data
const MOCK_PAYMENTS = [
    {
        id: 1,
        status: 'Success',
        datePaid: '10 Nov 2025',
        category: 'Exterior / Roof & Gutters',
        property: 'Luxury',
        contact: 'Sam',
        amount: 88210.00,
        type: 'income'
    },
    {
        id: 2,
        status: 'Success',
        datePaid: '10 Nov 2025',
        category: 'Exterior / Roof & Gutters',
        property: 'Luxury',
        contact: 'Abc',
        amount: 88210.00,
        type: 'income'
    },
    {
        id: 3,
        status: 'Failed',
        datePaid: '09 Nov 2025',
        category: 'Maintenance',
        property: 'Seaside Villa',
        contact: 'John Doe',
        amount: 1200.00,
        type: 'expense'
    },
    {
        id: 4,
        status: 'Success',
        datePaid: '08 Nov 2025',
        category: 'Rent',
        property: 'Urban Loft',
        contact: 'Jane Smith',
        amount: 2500.00,
        type: 'income'
    }
];

const Payments: React.FC = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>() || { sidebarCollapsed: false };
    const [activeTab, setActiveTab] = useState<'All' | 'Income' | 'Expense' | 'Refund'>('All');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const dropdownContainerRef = useRef<HTMLDivElement>(null);
    const [moreMenuOpenId, setMoreMenuOpenId] = useState<number | null>(null);
    const moreMenuRefDesktop = useRef<HTMLDivElement>(null);
    const moreMenuRefMobile = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeDropdown && dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }

            const isOutsideDesktop = moreMenuRefDesktop.current && !moreMenuRefDesktop.current.contains(event.target as Node);
            const isOutsideMobile = moreMenuRefMobile.current && !moreMenuRefMobile.current.contains(event.target as Node);

            if (moreMenuOpenId !== null) {
                // If checking click outside, we need to ensure it's not inside either menu if they exist
                if ((!moreMenuRefDesktop.current || isOutsideDesktop) && (!moreMenuRefMobile.current || isOutsideMobile)) {
                    setMoreMenuOpenId(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown, moreMenuOpenId]);

    // Using transaction store for shared modals state
    const {
        setDeleteTransactionOpen,
        setSelectedTransactionId,
        setEditPaymentModalOpen,
        setSelectedPayment,
        setRefundModalOpen,
    } = useTransactionStore();

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<{
        date: string[];
        client: string[];
        property: string[];
    }>({
        date: [],
        client: [],
        property: []
    });

    const filterOptions: Record<string, FilterOption[]> = {
        date: [
            { value: 'today', label: 'Today' },
            { value: 'this_week', label: 'This Week' },
            { value: 'this_month', label: 'This Month' },
        ],
        client: [
            { value: 'sam', label: 'Sam' },
            { value: 'abc', label: 'Abc' },
            { value: 'john', label: 'John Doe' },
        ],
        property: [
            { value: 'luxury', label: 'Luxury' },
            { value: 'seaside', label: 'Seaside Villa' },
        ],
    };

    const filterLabels: Record<string, string> = {
        date: 'Date',
        client: 'Clients',
        property: 'Property & Units',
    };

    // Filter Logic
    const filteredPayments = useMemo(() => {
        return MOCK_PAYMENTS.filter(item => {
            // Tab Filter
            if (activeTab !== 'All') {
                if (activeTab === 'Income' && item.type !== 'income') return false;
                if (activeTab === 'Expense' && item.type !== 'expense') return false;
                if (activeTab === 'Refund' && item.type !== 'refund') return false;
            }

            // Search Filter
            const matchesSearch = searchQuery === '' ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.property.toLowerCase().includes(searchQuery.toLowerCase());

            // Dropdown Filters
            const matchesClient = filters.client.length === 0 || filters.client.some(c => item.contact.toLowerCase().includes(c.toLowerCase()));
            const matchesProperty = filters.property.length === 0 || filters.property.some(p => item.property.toLowerCase().includes(p.toLowerCase()));
            // Adding a mock date filter logic if needed, but for now simple string match or ignore

            return matchesSearch && matchesClient && matchesProperty;
        });
    }, [activeTab, searchQuery, filters]);

    const toggleSelection = (id: number) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const toggleAll = () => {
        if (selectedItems.length === filteredPayments.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredPayments.map(item => item.id));
        }
    };

    const getStatusTextColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'success': return 'text-[#2D5B46]';
            case 'failed': return 'text-red-700';
            default: return 'text-gray-800';
        }
    };

    const handleExport = () => {
        // Create a cleaner version of the data for export
        const exportData = filteredPayments.map(item => ({
            Status: item.status,
            'Date Paid': item.datePaid,
            Category: item.category,
            Property: item.property,
            Contact: item.contact,
            Amount: item.amount,
            Type: item.type
        }));

        // Create worksheet
        const ws = utils.json_to_sheet(exportData);

        // Create workbook
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Payments");

        // Generate filename with current date
        const date = new Date().toISOString().split('T')[0];
        const fileName = `Payments_${date}.xlsx`;


        // Save file
        writeFile(wb, fileName);
    };

    return (
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen font-outfit transition-all duration-300`}>
            {/* Modals - Reused from Transactions */}
            <EditInvoiceModal />
            <DeleteTransactionModal
                onConfirm={() => {
                    setDeleteTransactionOpen(false);
                    setSelectedTransactionId(null);
                }}
            />
            <ApplyDepositsModal />
            <ApplyCreditsModal />
            <AddDiscountModal />
            <MarkAsPaidModal />
            <VoidTransactionModal />
            <EditPaymentModal />
            <RefundPaymentModal />

            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#DFE5E3] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Payments</span>
            </div>

            <div className="p-4 sm:p-6 bg-[#DFE5E3] min-h-screen rounded-[1.5rem] sm:rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center justify-between w-full sm:w-auto">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                            Payments
                        </button>
                        <button
                            onClick={handleExport}
                            className="sm:hidden w-10 h-10 bg-[#3A6D6C] rounded-full flex items-center justify-center text-white hover:bg-[#2c5251] transition-colors shadow-sm"
                            title="Download Excel"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto" ref={dropdownContainerRef}>
                        {/* Money In */}
                        <div className="relative flex-1 sm:flex-none">
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === 'money_in' ? null : 'money_in')}
                                className="w-full sm:w-auto px-6 py-2 bg-[#3A6D6C] text-white rounded-md text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                Money In
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {activeDropdown === 'money_in' && (
                                <div className="absolute top-full left-0 mt-2 bg-white rounded-md shadow-xl border border-gray-100 w-full z-50 overflow-hidden">
                                    <button onClick={() => navigate('/dashboard/accounting/transactions/income/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Income invoice</button>
                                    <button onClick={() => navigate('/dashboard/accounting/transactions/income-payments')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Income payment</button>
                                    <button onClick={() => navigate('/dashboard/accounting/transactions/recurring-income/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Recurring income</button>
                                    <button onClick={() => navigate('/dashboard/accounting/transactions/bulk-payments-income')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Bulk change</button>
                                    <button onClick={() => navigate('/dashboard/accounting/transactions/deposit/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Deposit</button>
                                    <button onClick={() => navigate('/dashboard/accounting/transactions/credits/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Credits</button>
                                </div>
                            )}
                        </div>

                        {/* Money Out */}
                        <div className="relative flex-1 sm:flex-none">
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === 'money_out' ? null : 'money_out')}
                                className="w-full sm:w-auto px-6 py-2 bg-[#1f2937] text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                Money Out
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {activeDropdown === 'money_out' && (
                                <div className="absolute top-full left-0 mt-2 bg-white rounded-md shadow-xl border border-gray-100 w-full z-50 overflow-hidden">
                                    <button onClick={() => navigate('/dashboard/accounting/transactions/expense/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Expense invoice</button>
                                    <button onClick={() => navigate('/dashboard/accounting/transactions/expense-payments')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Expense payment</button>
                                    <button onClick={() => navigate('/dashboard/accounting/transactions/recurring-expense/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Recurring expense</button>
                                    <button onClick={() => navigate('/dashboard/accounting/transactions/bulk-payments-expense')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Bulk change</button>
                                    <button onClick={() => navigate('/dashboard/accounting/transactions/return-deposit')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Return deposit</button>
                                    <button onClick={() => navigate('/dashboard/accounting/transactions/apply-deposit')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Apply deposit</button>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleExport}
                            className="hidden sm:flex w-10 h-10 bg-[#3A6D6C] rounded-full items-center justify-center text-white hover:bg-[#2c5251] transition-colors shadow-sm"
                            title="Download Excel"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="bg-[#f0f0f6] rounded-[2rem] p-4 mb-8 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Paid Income */}
                        <div className="p-4 bg-[#7BD747] rounded-[1.5rem] sm:rounded-full flex flex-col justify-center items-center h-24">
                            <span className="text-white text-sm font-medium mb-2">Paid Income</span>
                            <div className="bg-[#E3EBDE] px-6 py-2 rounded-full w-full sm:w-[80%] text-center shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.15)]">
                                <span className="text-gray-600 text-lg font-bold">₹45,000.00</span>
                            </div>
                        </div>

                        {/* Paid Expense */}
                        <div className="p-4 bg-[#7BD747] rounded-[1.5rem] sm:rounded-full flex flex-col justify-center items-center h-24">
                            <span className="text-white text-sm font-medium mb-2">Paid Expense</span>
                            <div className="bg-[#E3EBDE] px-6 py-2 rounded-full w-full sm:w-[80%] text-center shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.15)]">
                                <span className="text-gray-600 text-lg font-bold">₹45,000.00</span>
                            </div>
                        </div>

                        {/* Paid Refund */}
                        <div className="p-4 bg-[#7BD747] rounded-[1.5rem] sm:rounded-full flex flex-col justify-center items-center h-24">
                            <span className="text-white text-sm font-medium mb-2">Paid Refund</span>
                            <div className="bg-[#E3EBDE] px-6 py-2 rounded-full w-full sm:w-[80%] text-center shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.15)]">
                                <span className="text-gray-600 text-lg font-bold">₹ 00.00</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 bg-[#f1f3f2] rounded-full p-2 w-max max-w-full overflow-x-auto">
                    {(['All', 'Income', 'Expense', 'Refund'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 sm:px-8 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab
                                ? 'bg-[#7BD747] text-white shadow-sm'
                                : 'bg-[#DDDDDD] text-black hover:bg-gray-300'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>


                {/* Filters */}
                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={(newFilters) => setFilters(newFilters as any)}
                    showMoreFilters={true}
                />

                {/* Table Header */}
                <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm mt-8 pl-4 pr-6 hidden lg:block">
                    <div className="text-white px-6 py-4 grid grid-cols-[40px_1fr_1fr_1.5fr_1fr_1fr_1fr_50px] gap-4 items-center text-sm font-medium">
                        <div className="flex items-center justify-center">
                            <button onClick={toggleAll} className="flex items-center justify-center">
                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedItems.length === filteredPayments.length && filteredPayments.length > 0 ? 'bg-[#7BD747]' : 'bg-white/20 border border-white/50'}`}>
                                    {selectedItems.length === filteredPayments.length && filteredPayments.length > 0 && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                            </button>
                        </div>
                        <div>Status</div>
                        <div>Date Paid</div>
                        <div>Category</div>
                        <div>Property</div>
                        <div>Contact</div>
                        <div>Amount</div>
                        <div></div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t min-h-[400px]">
                    {filteredPayments.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-[1.5rem] sm:rounded-2xl px-4 sm:px-6 py-4 flex flex-col lg:grid lg:grid-cols-[40px_1fr_1fr_1.5fr_1fr_1fr_1fr_50px] gap-3 lg:gap-4 items-start lg:items-center shadow-sm hover:shadow-md transition-shadow relative"
                        >
                            <div className="flex items-center justify-between w-full lg:w-auto mb-2 lg:mb-0">
                                <div className="flex items-center gap-3 lg:justify-center">
                                    <button
                                        onClick={() => toggleSelection(item.id)}
                                        className="flex items-center justify-center"
                                    >
                                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedItems.includes(item.id) ? 'bg-[#7BD747]' : 'bg-gray-200'}`}>
                                            {selectedItems.includes(item.id) && <Check className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                    </button>

                                    {/* Mobile Status */}
                                    <div className="flex lg:hidden items-center gap-2">
                                        <span className={`text-sm font-medium ${getStatusTextColor(item.status)}`}>{item.status}</span>
                                    </div>
                                </div>

                                {/* Mobile Actions - Shown at top right relative to card */}
                                <div className="block lg:hidden">
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setMoreMenuOpenId(moreMenuOpenId === item.id ? null : item.id);
                                            }}
                                            className="text-gray-400 hover:text-gray-600 transition-colors"
                                            aria-label="Actions visible"
                                        >
                                            <MoreHorizontal className="w-8 h-8 bg-gray-100 rounded-full p-1.5" />
                                        </button>
                                        {moreMenuOpenId === item.id && (
                                            <div
                                                ref={moreMenuRefMobile}
                                                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[60] animate-in fade-in zoom-in-95 duration-100 overflow-hidden"
                                                role="menu"
                                            >
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditPaymentModalOpen(true);
                                                        setSelectedPayment(item);
                                                        setSelectedTransactionId(item.id);
                                                        setMoreMenuOpenId(null);
                                                    }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                                    role="menuitem"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedPayment(item);
                                                        setRefundModalOpen(true);
                                                        setMoreMenuOpenId(null);
                                                    }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                                    role="menuitem"
                                                >
                                                    Refund
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeleteTransactionOpen(true);
                                                        setSelectedTransactionId(item.id);
                                                        setMoreMenuOpenId(null);
                                                    }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                                    role="menuitem"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Desktop Status */}
                            <div className="hidden lg:flex items-center gap-2">
                                <span className={`text-sm font-medium ${getStatusTextColor(item.status)}`}>{item.status}</span>
                            </div>

                            {/* Date Paid */}
                            <div className="w-full lg:w-auto flex justify-between lg:block">
                                <span className="lg:hidden text-xs text-gray-500 font-bold uppercase tracking-wider">Date Paid</span>
                                <div className="text-gray-800 text-sm font-medium">{item.datePaid}</div>
                            </div>

                            {/* Category */}
                            <div className="w-full lg:w-auto flex justify-between lg:block">
                                <span className="lg:hidden text-xs text-gray-500 font-bold uppercase tracking-wider">Category</span>
                                <div className={`text-sm font-medium truncate ${item.category.includes('Exterior') ? 'text-[#2D5B46]' : 'text-gray-800'}`}>{item.category}</div>
                            </div>

                            {/* Property */}
                            <div className="w-full lg:w-auto flex justify-between lg:block">
                                <span className="lg:hidden text-xs text-gray-500 font-bold uppercase tracking-wider">Property</span>
                                <div className={`text-sm font-medium ${item.property === 'Luxury' ? 'text-[#2D5B46]' : 'text-gray-800'}`}>{item.property}</div>
                            </div>

                            {/* Contact */}
                            <div className="w-full lg:w-auto flex justify-between lg:block">
                                <span className="lg:hidden text-xs text-gray-500 font-bold uppercase tracking-wider">Contact</span>
                                <div className={`text-sm font-medium ${item.contact === 'Sam' ? 'text-[#2D5B46]' : 'text-gray-800'}`}>{item.contact}</div>
                            </div>

                            {/* Amount */}
                            <div className="w-full lg:w-auto flex justify-between lg:block">
                                <span className="lg:hidden text-xs text-gray-500 font-bold uppercase tracking-wider">Amount</span>
                                <div className="text-gray-900 text-sm font-bold">₹ {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            </div>

                            {/* Desktop Actions */}
                            <div className="hidden lg:flex justify-end relative">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMoreMenuOpenId(moreMenuOpenId === item.id ? null : item.id);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    aria-label="Actions"
                                    aria-expanded={moreMenuOpenId === item.id}
                                >
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                                {moreMenuOpenId === item.id && (
                                    <div
                                        ref={moreMenuRefDesktop}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden"
                                        role="menu"
                                    >
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditPaymentModalOpen(true);
                                                setSelectedPayment(item);
                                                setSelectedTransactionId(item.id);
                                                setMoreMenuOpenId(null);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                            role="menuitem"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedPayment(item);
                                                setRefundModalOpen(true);
                                                setMoreMenuOpenId(null);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                            role="menuitem"
                                        >
                                            Refund
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteTransactionOpen(true);
                                                setSelectedTransactionId(item.id);
                                                setMoreMenuOpenId(null);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                            role="menuitem"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredPayments.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            No payments found.
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
};

export default Payments;
