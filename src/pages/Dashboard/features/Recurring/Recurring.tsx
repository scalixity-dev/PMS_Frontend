import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ChevronLeft, Check, MoreHorizontal, Settings, ChevronDown } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import { useTransactionStore } from '../Transactions/store/transactionStore';

// Reuse modals from Transactions
import EditInvoiceModal from '../Transactions/components/EditInvoiceModal';
import DeleteTransactionModal from '../Transactions/components/DeleteTransactionModal';
import PostNextInvoiceModal from './components/PostNextInvoiceModal';

// Mock Data for Recurring
const MOCK_RECURRING = [
    {
        id: 1,
        status: 'Active',
        nextDate: '10 Nov 2025',
        transactionType: 'Exterior / Roof & Gutters',
        category: 'Exterior / Roof & Gutters',
        property: 'Luxury',
        contact: 'Sam',
        amount: 88210.00,
        type: 'income'
    },
    {
        id: 2,
        status: 'Active',
        nextDate: '10 Nov 2025',
        transactionType: 'Exterior / Roof & Gutters',
        category: 'Exterior / Roof & Gutters',
        property: 'Luxury',
        contact: 'Abc',
        amount: 88210.00,
        type: 'income'
    },
    {
        id: 3,
        status: 'Paused',
        nextDate: '09 Nov 2025',
        transactionType: 'Maintenance',
        category: 'Maintenance',
        property: 'Seaside Villa',
        contact: 'John Doe',
        amount: 1200.00,
        type: 'expense'
    },
    {
        id: 4,
        status: 'Active',
        nextDate: '08 Nov 2025',
        transactionType: 'Rent',
        category: 'Rent',
        property: 'Urban Loft',
        contact: 'Jane Smith',
        amount: 2500.00,
        type: 'income'
    }
];

const Recurring: React.FC = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>() || { sidebarCollapsed: false };
    const [activeTab, setActiveTab] = useState<'All' | 'Income' | 'Expense'>('All');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const dropdownContainerRef = useRef<HTMLDivElement>(null);
    const [moreMenuOpenId, setMoreMenuOpenId] = useState<number | null>(null);
    const moreMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeDropdown && dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
            if (moreMenuOpenId !== null && moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
                setMoreMenuOpenId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeDropdown, moreMenuOpenId]);
    const [isPostInvoiceModalOpen, setIsPostInvoiceModalOpen] = useState(false);
    const [selectedRecurringId, setSelectedRecurringId] = useState<number | null>(null);

    // Using transaction store for shared modals state
    const {
        setDeleteTransactionOpen,
        setSelectedTransactionId,
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
    const filteredRecurring = useMemo(() => {
        return MOCK_RECURRING.filter(item => {
            // Tab Filter
            if (activeTab !== 'All') {
                if (activeTab === 'Income' && item.type !== 'income') return false;
                if (activeTab === 'Expense' && item.type !== 'expense') return false;
            }

            // Search Filter
            const matchesSearch = searchQuery === '' ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.property.toLowerCase().includes(searchQuery.toLowerCase());

            // Dropdown Filters
            const matchesClient = filters.client.length === 0 || filters.client.some(c => item.contact.toLowerCase().includes(c.toLowerCase()));
            const matchesProperty = filters.property.length === 0 || filters.property.some(p => item.property.toLowerCase().includes(p.toLowerCase()));

            // Date Filter
            let matchesDate = true;
            if (filters.date.length > 0) {
                const itemDate = new Date(item.nextDate);
                const today = new Date();
                const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

                matchesDate = filters.date.some(filter => {
                    if (filter === 'today') {
                        return itemDate >= startOfDay && itemDate < endOfDay;
                    } else if (filter === 'this_week') {
                        const now = new Date();
                        const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                        firstDayOfWeek.setHours(0, 0, 0, 0);
                        const endOfWeek = new Date(firstDayOfWeek);
                        endOfWeek.setDate(firstDayOfWeek.getDate() + 6);
                        endOfWeek.setHours(23, 59, 59, 999);
                        return itemDate >= firstDayOfWeek && itemDate <= endOfWeek;
                    } else if (filter === 'this_month') {
                        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                        return itemDate >= startOfMonth && itemDate <= endOfMonth;
                    }
                    return false;
                });
            }

            return matchesSearch && matchesClient && matchesProperty && matchesDate;
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
        if (selectedItems.length === filteredRecurring.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredRecurring.map(item => item.id));
        }
    };

    const getStatusTextColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'text-[#2D5B46]';
            case 'paused': return 'text-orange-600';
            case 'stopped': return 'text-red-700';
            default: return 'text-gray-800';
        }
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
            <PostNextInvoiceModal
                isOpen={isPostInvoiceModalOpen}
                onClose={() => {
                    setIsPostInvoiceModalOpen(false);
                    setSelectedRecurringId(null);
                }}
                onConfirm={() => {
                    console.log('Confirmed post next invoice for:', selectedRecurringId);
                    setIsPostInvoiceModalOpen(false);
                    setSelectedRecurringId(null);
                }}
            />

            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#DFE5E3] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Recurring</span>
            </div>

            <div className="p-6 bg-[#DFE5E3] min-h-screen rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                        Recurring
                    </button>

                    <div className="flex items-center gap-3" ref={dropdownContainerRef}>
                        {/* Money In */}
                        <div className="relative">
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === 'money_in' ? null : 'money_in')}
                                className="px-6 py-2 bg-[#3A6D6C] text-white rounded-md text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                            >
                                Money In
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {activeDropdown === 'money_in' && (
                                <div className="absolute top-full left-0 mt-2 bg-white rounded-md shadow-xl border border-gray-100 w-48 z-50 overflow-hidden">
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
                        <div className="relative">
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === 'money_out' ? null : 'money_out')}
                                className="px-6 py-2 bg-[#1f2937] text-white rounded-md text-sm font-medium hover:bg-red-600 transition-colors shadow-sm flex items-center gap-2"
                            >
                                Money Out
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {activeDropdown === 'money_out' && (
                                <div className="absolute top-full left-0 mt-2 bg-white rounded-md shadow-xl border border-gray-100 w-48 z-50 overflow-hidden">
                                    <button onClick={() => navigate('/dashboard/accounting/transactions/expense/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Expense invoice</button>
                                    <button onClick={() => navigate('/dashboard/accounting/transactions/expense-payments')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Expense payment</button>
                                    <button onClick={() => navigate('/dashboard/accounting/transactions/recurring-expense/add')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Recurring expense</button>
                                    <button onClick={() => navigate('/dashboard/accounting/transactions/bulk-payments-expense')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Bulk change</button>
                                    <button onClick={() => navigate('/dashboard/accounting/transactions/return-deposit')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Return deposit</button>
                                    <button onClick={() => navigate('/dashboard/accounting/transactions/apply-deposit')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100">Apply deposit</button>
                                </div>
                            )}
                        </div>

                        {/* Settings */}
                        <button className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Settings
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 bg-[#f1f3f2] rounded-full p-2 w-min">
                    {(['All', 'Income', 'Expense'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === tab
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
                <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm mt-8 pl-4 pr-6">
                    <div className="text-white px-6 py-4 grid grid-cols-[40px_0.5fr_1fr_1fr_1.5fr_1fr_1fr_50px] gap-4 items-center text-sm font-medium">
                        <div className="flex items-center justify-center">
                            <button onClick={toggleAll} className="flex items-center justify-center">
                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedItems.length === filteredRecurring.length && filteredRecurring.length > 0 ? 'bg-[#7BD747]' : 'bg-white/20 border border-white/50'}`}>
                                    {selectedItems.length === filteredRecurring.length && filteredRecurring.length > 0 && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                            </button>
                        </div>
                        <div>Status</div>
                        <div>Next Date</div>
                        <div>Type</div>
                        <div>Category & property</div>
                        <div>Contact</div>
                        <div>Amount</div>
                        <div></div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-b-[2rem] rounded-t min-h-[400px]">
                    {filteredRecurring.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl px-6 py-4 grid grid-cols-[40px_0.5fr_1fr_1fr_1.5fr_1fr_1fr_50px] gap-4 items-center shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-center">
                                <button
                                    onClick={() => toggleSelection(item.id)}
                                    className="flex items-center justify-center"
                                >
                                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedItems.includes(item.id) ? 'bg-[#7BD747]' : 'bg-gray-200'}`}>
                                        {selectedItems.includes(item.id) && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                </button>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${getStatusTextColor(item.status)}`}>{item.status}</span>
                            </div>

                            {/* Next Date */}
                            <div className="text-[#3A6D6C] text-sm font-medium">{item.nextDate}</div>

                            {/* Type */}
                            <div className="text-[#3A6D6C] text-sm font-medium truncate">{item.transactionType}</div>

                            {/* Category & Property */}
                            <div className="text-[#3A6D6C] text-sm font-medium">{item.property}</div>

                            {/* Contact */}
                            <div className="text-[#3A6D6C] text-sm font-medium">{item.contact}</div>

                            {/* Amount */}
                            <div className="text-gray-900 text-sm font-bold">₹ {item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>

                            {/* Actions */}
                            <div className="flex justify-end relative">
                                <button
                                    onClick={() => setMoreMenuOpenId(moreMenuOpenId === item.id ? null : item.id)}
                                    className="text-gray-600 hover:text-gray-600"
                                >
                                    <MoreHorizontal className="w-10 h-6 bg-gray-200 rounded-full p-0.5" />
                                </button>
                                {moreMenuOpenId === item.id && (
                                    <div
                                        ref={moreMenuRef}
                                        className="absolute top-full right-0 mt-2 bg-white rounded-md shadow-xl border border-gray-100 w-48 z-50 overflow-hidden"
                                    >
                                        <button
                                            onClick={() => {
                                                setSelectedRecurringId(item.id);
                                                setIsPostInvoiceModalOpen(true);
                                                setMoreMenuOpenId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                        >
                                            Post next invoice
                                        </button>
                                        <button
                                            onClick={() => {
                                                console.log('End', item.id);
                                                setMoreMenuOpenId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-[#3A6D6C] hover:bg-gray-50 border-b border-gray-100"
                                        >
                                            End
                                        </button>
                                        <button
                                            onClick={() => {
                                                console.log('Clone', item.id);
                                                setMoreMenuOpenId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                        >
                                            Clone
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedTransactionId(item.id);
                                                setDeleteTransactionOpen(true);
                                                setMoreMenuOpenId(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-[#3A6D6C] hover:bg-gray-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {filteredRecurring.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                            No recurring transactions found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recurring;
