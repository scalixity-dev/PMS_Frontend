import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import { ChevronLeft, Download, Check, MoreHorizontal } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import { useTransactionStore } from './store/transactionStore';
import EditInvoiceModal from './components/EditInvoiceModal';
import DeleteTransactionModal from './components/DeleteTransactionModal';
import MoneyInMoneyOutButtons from '../../components/MoneyInMoneyOutButtons';
import ApplyDepositsModal from './components/ApplyDepositsModal';
import ApplyCreditsModal from './components/ApplyCreditsModal';
import AddDiscountModal from './components/AddDiscountModal';
import MarkAsPaidModal from './components/MarkAsPaidModal';
import VoidTransactionModal from './components/VoidTransactionModal';
import { utils, writeFile } from 'xlsx';

// Mock Data
const MOCK_TRANSACTIONS = [
    {
        id: 1,
        status: 'Paid',
        dueDate: '10 Nov',
        date: '2025-12-25',
        category: 'Exterior / Roof & Gutters',
        property: 'Luxury',
        contact: 'Sam',
        total: 88210.00,
        balance: 88210.00,
        type: 'income'
    },
    {
        id: 2,
        status: 'Paid',
        dueDate: '10 Nov',
        date: '2025-12-10',
        category: 'Exterior / Roof & Gutters',
        property: 'Luxury',
        contact: 'Sam',
        total: 88210.00,
        balance: 88210.00,
        type: 'income'
    },
    {
        id: 3,
        status: 'Pending',
        dueDate: '15 Dec',
        date: '2025-12-15',
        category: 'Plumbing',
        property: 'Seaside Villa',
        contact: 'Mike',
        total: 1250.00,
        balance: 1250.00,
        type: 'expense'
    },
    {
        id: 4,
        status: 'Paid',
        dueDate: '10 Nov',
        date: '2025-10-05',
        category: 'Exterior / Roof & Gutters',
        property: 'Luxury',
        contact: 'Sam',
        total: 88210.00,
        balance: 88210.00,
        type: 'income'
    },
    {
        id: 5,
        status: 'Pending',
        dueDate: '20 Dec',
        date: '2025-12-20',
        category: 'Landscaping',
        property: 'Green Acres',
        contact: 'GreenThumb Landscaping',
        total: 4500.00,
        balance: 4500.00,
        type: 'expense'
    },
    {
        id: 6,
        status: 'Void',
        dueDate: '01 Nov',
        date: '2025-11-01',
        category: 'Maintenance',
        property: 'Urban Loft',
        contact: 'FixIt All',
        total: 300.00,
        balance: 0.00,
        type: 'expense'
    }
];

const Transactions: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>() || { sidebarCollapsed: false };
    const [activeTab, setActiveTab] = useState<'All' | 'Income' | 'Expense'>('All');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [moreMenuOpenId, setMoreMenuOpenId] = useState<number | null>(null);
    const moreMenuRef = useRef<HTMLDivElement>(null);

    const {
        setEditInvoiceOpen,
        setDeleteTransactionOpen,
        setSelectedTransactionId,
        setClonedTransactionData,
        setApplyDepositsOpen,
        setApplyCreditsOpen,
        setAddDiscountOpen,
        setMarkAsPaidOpen,
        setVoidModalOpen
    } = useTransactionStore();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
                setMoreMenuOpenId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [moreMenuOpenId]);

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<{
        date: string[];
        client: string[];
        property: string[];
        categories: string[];
    }>({
        date: [],
        client: [],
        property: [],
        categories: []
    });

    // Handle pre-selected property from navigation state
    useEffect(() => {
        const state = location.state as { preSelectedProperty?: string };
        if (state?.preSelectedProperty) {
            setFilters(prev => ({
                ...prev,
                property: [state.preSelectedProperty!]
            }));
            // Clear state to prevent reapplying on refresh/navigation
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const filterOptions: Record<string, FilterOption[]> = {
        date: [
            { value: 'today', label: 'Today' },
            { value: 'this_week', label: 'This Week' },
            { value: 'this_month', label: 'This Month' },
        ],
        client: [
            { value: 'atul', label: 'Atul' },
            { value: 'john', label: 'John' },
        ],
        property: [
            { value: 'abc', label: 'ABC' },
            { value: 'xyz', label: 'XYZ' },
        ],
        categories: [
            { value: 'deposit', label: 'Deposit' },
            { value: 'rent', label: 'Rent' },
        ]
    };

    const filterLabels: Record<string, string> = {
        date: 'Date',
        client: 'Client',
        property: 'Property & Units',
        categories: 'Categories & subcategories'
    };

    // Filter Logic
    const filteredTransactions = useMemo(() => {
        return MOCK_TRANSACTIONS.filter(item => {
            // Tab Filter (Simple check for demonstration)
            if (activeTab !== 'All' && item.type.toLowerCase() !== activeTab.toLowerCase()) return false;

            // Search Filter
            const matchesSearch = searchQuery === '' ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.property.toLowerCase().includes(searchQuery.toLowerCase());

            // Dropdown Filters
            const matchesClient = filters.client.length === 0 || filters.client.some(c => item.contact.toLowerCase().includes(c.toLowerCase()));
            const matchesProperty = filters.property.length === 0 || filters.property.some(p => item.property.toLowerCase().includes(p.toLowerCase()));
            const matchesCategory = filters.categories.length === 0 || filters.categories.some(c => item.category.toLowerCase().includes(c.toLowerCase()));

            return matchesSearch && matchesClient && matchesProperty && matchesCategory;
        });
    }, [activeTab, searchQuery, filters]);

    // Group items by date
    const groupedTransactions = useMemo(() => {
        const groups: Record<string, typeof MOCK_TRANSACTIONS> = {};

        filteredTransactions.forEach(item => {
            if (!groups[item.date]) {
                groups[item.date] = [];
            }
            groups[item.date].push(item);
        });

        // Sort by date descending
        return Object.keys(groups)
            .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            .map(date => ({
                date,
                items: groups[date].sort((a, b) => b.id - a.id)
            }));
    }, [filteredTransactions]);

    const toggleSelection = (id: number) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const toggleAll = () => {
        if (selectedItems.length === filteredTransactions.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredTransactions.map(item => item.id));
        }
    };

    const formatDatePill = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid': return 'bg-[#7BD747]';
            case 'pending': return 'bg-orange-500';
            case 'void': return 'bg-red-500';
            default: return 'bg-gray-400';
        }
    };

    const handleExport = () => {
        // Create a cleaner version of the data for export
        const exportData = filteredTransactions.map(item => ({
            Status: item.status,
            'Due Date': item.dueDate,
            Date: item.date,
            Category: item.category,
            Property: item.property,
            Contact: item.contact,
            Total: item.total,
            Balance: item.balance,
            Type: item.type
        }));

        // Create worksheet
        const ws = utils.json_to_sheet(exportData);

        // Create workbook
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Transactions");

        // Generate filename with current date
        const date = new Date().toISOString().split('T')[0];
        const fileName = `Transactions_${date}.xlsx`;

        // Save file
        writeFile(wb, fileName);
    };

    return (
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen font-outfit transition-all duration-300`}>
            {/* Modals */}
            <EditInvoiceModal
                onConfirm={(data) => {
                    console.log('Edit Invoice data:', data);
                    setEditInvoiceOpen(false);
                }}
            />
            <DeleteTransactionModal
                onConfirm={() => {
                    setDeleteTransactionOpen(false);
                    setSelectedTransactionId(null);
                }}
            />
            <ApplyDepositsModal
                onConfirm={(data) => {
                    console.log('Apply Deposits data:', data);
                    setApplyDepositsOpen(false);
                }}
            />
            <ApplyCreditsModal
                onConfirm={(data) => {
                    console.log('Apply Credits data:', data);
                    setApplyCreditsOpen(false);
                }}
            />
            <AddDiscountModal
                onConfirm={(data) => {
                    console.log('Add Discount data:', data);
                    setAddDiscountOpen(false);
                }}
            />
            <MarkAsPaidModal
                onConfirm={(data) => {
                    console.log('Mark As Paid data:', data);
                    setMarkAsPaidOpen(false);
                }}
            />
            <VoidTransactionModal
                onConfirm={(reason) => {
                    console.log('Voiding transaction with reason:', reason);
                    setVoidModalOpen(false);
                }}
            />

            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#DFE5E3] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Transactions</span>
            </div>

            <div className="p-4 sm:p-6 bg-[#DFE5E3] min-h-screen rounded-[1.5rem] sm:rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center justify-between w-full sm:w-auto">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                            Transactions
                        </button>
                        <button
                            onClick={handleExport}
                            className="sm:hidden w-10 h-10 bg-[#3A6D6C] rounded-full flex items-center justify-center text-white hover:bg-[#2c5251] transition-colors shadow-sm"
                            title="Download Excel"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <MoneyInMoneyOutButtons />


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
                        {/* Outstanding / Paid Income */}
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
                    {(['All', 'Income', 'Expense'] as const).map((tab) => (
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

                {/* Table Section */}
                <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm mt-8 pl-4 hidden lg:block">
                    {/* Table Header */}
                    <div className="text-white px-6 py-4 grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_100px] gap-4 items-center text-sm font-medium">
                        <div className="flex items-center justify-center">
                            <button onClick={toggleAll} className="flex items-center justify-center">
                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedItems.length === filteredTransactions.length && filteredTransactions.length > 0 ? 'bg-[#7BD747]' : 'bg-white/20 border border-white/50'}`}>
                                    {selectedItems.length === filteredTransactions.length && filteredTransactions.length > 0 && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                            </button>
                        </div>
                        <div>Status</div>
                        <div>Due date</div>
                        <div>Category</div>
                        <div>Property</div>
                        <div>Contact</div>
                        <div>Total</div>
                        <div>Balance</div>
                        <div></div>
                    </div>
                </div>

                {/* Table Body - Grouped by Date */}
                <div className="flex flex-col gap-6 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t min-h-[400px]">
                    {groupedTransactions.map((group) => (
                        <div key={group.date}>
                            {/* Date Pill */}
                            <div className="mb-4">
                                <span className="px-6 py-3 bg-gradient-to-r from-[#1bcb40] to-[#7cd947] text-white rounded-lg text-sm font-bold shadow-sm">
                                    {formatDatePill(group.date)}
                                </span>
                            </div>

                            {/* Grouped Items */}
                            <div className="flex flex-col gap-3">
                                {group.items.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => navigate(`/dashboard/accounting/transactions/${item.id}`)}
                                        className="bg-white rounded-[1.5rem] sm:rounded-2xl px-4 sm:px-6 py-4 flex flex-col lg:grid lg:grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_100px] gap-3 lg:gap-4 items-start lg:items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
                                    >
                                        <div className="flex items-center justify-between w-full lg:w-auto mb-2 lg:mb-0">
                                            <div className="flex items-center gap-3 lg:justify-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleSelection(item.id);
                                                    }}
                                                    className="flex items-center justify-center"
                                                >
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedItems.includes(item.id) ? 'bg-[#7BD747]' : 'bg-gray-200'}`}>
                                                        {selectedItems.includes(item.id) && <Check className="w-3.5 h-3.5 text-white" />}
                                                    </div>
                                                </button>
                                                {/* Mobile Status - Shown next to checkbox on mobile */}
                                                <div className="flex lg:hidden items-center gap-2">
                                                    <div className={`w-2.5 h-2.5 rounded ${getStatusColor(item.status)}`}></div>
                                                    <span className="text-gray-800 text-sm font-medium">{item.status}</span>
                                                </div>
                                            </div>

                                            {/* Mobile Actions - Shown at top right relative to card */}
                                            <div className="block lg:hidden">
                                                <div className="relative" ref={moreMenuOpenId === item.id ? moreMenuRef : null}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setMoreMenuOpenId(moreMenuOpenId === item.id ? null : item.id);
                                                        }}
                                                        className="text-gray-600 hover:text-gray-800 transition-colors"
                                                    >
                                                        <MoreHorizontal className="w-8 h-8 bg-gray-100 rounded-full p-1.5" />
                                                    </button>
                                                    {moreMenuOpenId === item.id && (
                                                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-[60]">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setMoreMenuOpenId(null);
                                                                    setSelectedTransactionId(item.id);
                                                                    setEditInvoiceOpen(true);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setMoreMenuOpenId(null);
                                                                    setSelectedTransactionId(item.id);
                                                                    setMarkAsPaidOpen(true);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                                            >
                                                                Mark as paid
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setMoreMenuOpenId(null);
                                                                    const dataToPass = {
                                                                        amount: `₹${item.total.toLocaleString()}`,
                                                                        user: item.contact,
                                                                        date: item.dueDate,
                                                                        category: item.category,
                                                                        property: item.property
                                                                    };
                                                                    setClonedTransactionData(dataToPass);
                                                                    navigate('/dashboard/accounting/transactions/recurring-expense/add');
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                                            >
                                                                Make recurring
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setMoreMenuOpenId(null);
                                                                    const dataToClone = {
                                                                        amount: `₹${item.total.toLocaleString()}`,
                                                                        user: item.contact,
                                                                        date: item.dueDate,
                                                                        category: item.category,
                                                                        property: item.property
                                                                    };
                                                                    setClonedTransactionData(dataToClone);
                                                                    navigate('/dashboard/accounting/transactions/clone');
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                                            >
                                                                Clone
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setMoreMenuOpenId(null);
                                                                    setSelectedTransactionId(item.id);
                                                                    setApplyDepositsOpen(true);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                                            >
                                                                Apply deposits
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setMoreMenuOpenId(null);
                                                                    setSelectedTransactionId(item.id);
                                                                    setApplyCreditsOpen(true);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                                            >
                                                                Apply credits
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setMoreMenuOpenId(null);
                                                                    setSelectedTransactionId(item.id);
                                                                    setAddDiscountOpen(true);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                                            >
                                                                Add discount
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setMoreMenuOpenId(null);
                                                                    setSelectedTransactionId(item.id);
                                                                    setVoidModalOpen(true);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                                            >
                                                                Void
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setMoreMenuOpenId(null);
                                                                    setSelectedTransactionId(item.id);
                                                                    setDeleteTransactionOpen(true);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 transition-colors"
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
                                            <div className={`w-2.5 h-2.5 rounded ${getStatusColor(item.status)}`}></div>
                                            <span className="text-gray-800 text-sm font-medium">{item.status}</span>
                                        </div>

                                        {/* Due Date */}
                                        <div className="w-full lg:w-auto flex justify-between lg:block">
                                            <span className="lg:hidden text-xs text-gray-500 font-bold uppercase tracking-wider">Due Date</span>
                                            <span className="font-semibold text-gray-800 text-sm">{item.dueDate}</span>
                                        </div>

                                        {/* Category */}
                                        <div className="w-full lg:w-auto flex justify-between lg:block">
                                            <span className="lg:hidden text-xs text-gray-500 font-bold uppercase tracking-wider">Category</span>
                                            <div className="text-gray-800 text-sm font-semibold truncate max-w-[200px]" title={item.category}>{item.category}</div>
                                        </div>

                                        {/* Property */}
                                        <div className="w-full lg:w-auto flex justify-between lg:block">
                                            <span className="lg:hidden text-xs text-gray-500 font-bold uppercase tracking-wider">Property</span>
                                            <div className="text-gray-800 text-sm font-semibold">{item.property}</div>
                                        </div>

                                        {/* Contact */}
                                        <div className="w-full lg:w-auto flex justify-between lg:block">
                                            <span className="lg:hidden text-xs text-gray-500 font-bold uppercase tracking-wider">Contact</span>
                                            <div className="text-gray-800 text-sm font-semibold">{item.contact}</div>
                                        </div>

                                        {/* Total */}
                                        <div className="w-full lg:w-auto flex justify-between lg:block">
                                            <span className="lg:hidden text-xs text-gray-500 font-bold uppercase tracking-wider">Total</span>
                                            <div className="font-bold text-gray-900 text-sm">₹ {item.total.toLocaleString()}</div>
                                        </div>

                                        {/* Balance */}
                                        <div className="w-full lg:w-auto flex justify-between lg:block">
                                            <span className="lg:hidden text-xs text-gray-500 font-bold uppercase tracking-wider">Balance</span>
                                            <div className={`text-sm font-bold ${item.balance > 0 ? 'text-[#3A6D6C]' : 'text-gray-800'}`}>
                                                ₹ {item.balance.toLocaleString()}
                                            </div>
                                        </div>

                                        {/* Desktop Actions */}
                                        <div className="hidden lg:flex items-center justify-end gap-3 relative w-full">
                                            <div className="relative" ref={moreMenuOpenId === item.id ? moreMenuRef : null}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setMoreMenuOpenId(moreMenuOpenId === item.id ? null : item.id);
                                                    }}
                                                    className="text-gray-600 hover:text-gray-800 transition-colors"
                                                >
                                                    <MoreHorizontal className="w-10 h-6 bg-gray-200 rounded-full p-0.5" />
                                                </button>
                                                {moreMenuOpenId === item.id && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMoreMenuOpenId(null);
                                                                setSelectedTransactionId(item.id);
                                                                setEditInvoiceOpen(true);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMoreMenuOpenId(null);
                                                                setSelectedTransactionId(item.id);
                                                                setMarkAsPaidOpen(true);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                                        >
                                                            Mark as paid
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMoreMenuOpenId(null);
                                                                const dataToPass = {
                                                                    amount: `₹${item.total.toLocaleString()}`,
                                                                    user: item.contact,
                                                                    date: item.dueDate,
                                                                    category: item.category,
                                                                    property: item.property
                                                                };
                                                                setClonedTransactionData(dataToPass);
                                                                navigate('/dashboard/accounting/transactions/recurring-expense/add');
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                                        >
                                                            Make recurring
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMoreMenuOpenId(null);
                                                                const dataToClone = {
                                                                    amount: `₹${item.total.toLocaleString()}`,
                                                                    user: item.contact,
                                                                    date: item.dueDate,
                                                                    category: item.category,
                                                                    property: item.property
                                                                };
                                                                setClonedTransactionData(dataToClone);
                                                                navigate('/dashboard/accounting/transactions/clone');
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                                        >
                                                            Clone
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMoreMenuOpenId(null);
                                                                setSelectedTransactionId(item.id);
                                                                setApplyDepositsOpen(true);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                                        >
                                                            Apply deposits
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMoreMenuOpenId(null);
                                                                setSelectedTransactionId(item.id);
                                                                setApplyCreditsOpen(true);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                                        >
                                                            Apply credits
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMoreMenuOpenId(null);
                                                                setSelectedTransactionId(item.id);
                                                                setAddDiscountOpen(true);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                                        >
                                                            Add discount
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMoreMenuOpenId(null);
                                                                setSelectedTransactionId(item.id);
                                                                setVoidModalOpen(true);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100"
                                                        >
                                                            Void
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setMoreMenuOpenId(null);
                                                                setSelectedTransactionId(item.id);
                                                                setDeleteTransactionOpen(true);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {groupedTransactions.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            No transactions found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Transactions;
