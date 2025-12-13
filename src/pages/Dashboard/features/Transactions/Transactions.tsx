import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Download, Check, Edit, Trash2, MoreHorizontal, ChevronDown } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';

// Mock Data
const MOCK_TRANSACTIONS = [
    {
        id: 1,
        status: 'Paid',
        dueDate: '08 Dec',
        category: 'Deposit',
        property: 'ABC',
        contact: 'Atul',
        total: 50000,
        balance: 50000,
        type: 'income'
    },
    {
        id: 2,
        status: 'Void',
        dueDate: '08 Dec',
        category: 'Deposit',
        property: 'ABC',
        contact: 'Atul',
        total: 50000,
        balance: 50000,
        type: 'income'
    },
    // Add more mock data if needed to demonstrate scrolling/pagination
];

const Transactions: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'All' | 'Income' | 'Expense'>('All');
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#DFE5E3] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Transactions</span>
            </div>

            <div className="p-6 bg-[#DFE5E3] min-h-screen rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                        Transactions
                    </button>

                    <div className="flex items-center gap-3">
                        {/* Money In Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === 'money_in' ? null : 'money_in')}
                                className="px-6 py-2 bg-[#3A6D6C] text-white rounded-md text-sm font-medium hover:bg-[#6cc73d] transition-colors shadow-sm flex items-center gap-2"
                            >
                                Money In
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            {activeDropdown === 'money_in' && (
                                <div className="absolute top-full left-0 mt-2 bg-white rounded-md shadow-xl border border-gray-100 w-48 z-50 overflow-hidden">
                                    <button
                                        onClick={() => navigate('/dashboard/accounting/transactions/income/add')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                    >
                                        Income invoice
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard/accounting/transactions/income-payments')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                    >
                                        Income payment
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard/accounting/transactions/recurring-income/add')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                    >
                                        Recurring income
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard/accounting/transactions/bulk-payments-income')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                    >
                                        Bulk change
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard/accounting/transactions/deposit/add')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                    >
                                        Deposit
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard/accounting/transactions/credits/add')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Credits
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Money Out Dropdown */}
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
                                    <button
                                        onClick={() => navigate('/dashboard/accounting/transactions/expense/add')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                    >
                                        Expense invoice
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard/accounting/transactions/expense-payments')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                    >
                                        Expense payment
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard/accounting/transactions/recurring-expense/add')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                    >
                                        Recurring expense
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard/accounting/transactions/bulk-payments-expense')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                    >
                                        Bulk change
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard/accounting/transactions/return-deposit')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                    >
                                        Return deposit
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard/accounting/transactions/apply-deposit')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                                    >
                                        Apply deposit
                                    </button>
                                    <button
                                        onClick={() => {
                                            console.log('Navigating to expense payments');
                                            navigate('/dashboard/accounting/transactions/expense-payments');
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Expense payment
                                    </button>
                                </div>
                            )}
                        </div>

                        <button className="w-10 h-10 bg-[#3A6D6C] rounded-full flex items-center justify-center text-white hover:bg-[#2c5251] transition-colors shadow-sm">
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="bg-[#f0f0f6] rounded-full p-2 mb-8 shadow-sm">
                    <div className="grid grid-cols-3 gap-4">
                        {/* Outstanding */}
                        <div className="p-4 rounded-3xl relative overflow-hidden group">
                            <p className="text-gray-600 text-sm font-medium mb-1 ml-2">Outstanding</p>
                            <div className="bg-[#7BD747] text-white text-xl font-bold py-3 px-6 rounded-full inline-block shadow-sm relative z-10 w-full">
                                ₹ 50,000
                            </div>
                        </div>

                        {/* Paid */}
                        <div className="p-4 rounded-3xl relative overflow-hidden group">
                            <p className="text-gray-600 text-sm font-medium mb-1 ml-2">Paid</p>
                            <div className="bg-[#7BD747] text-white text-xl font-bold py-3 px-6 rounded-full inline-block shadow-sm relative z-10 w-full">
                                ₹ 80,000
                            </div>
                        </div>

                        {/* Overdue */}
                        <div className="p-4 rounded-3xl relative overflow-hidden group">
                            <p className="text-gray-600 text-sm font-medium mb-1 ml-2">Overdue</p>
                            <div className="bg-[#7BD747] text-white text-xl font-bold py-3 px-6 rounded-full inline-block shadow-sm relative z-10 w-full">
                                ₹ 10,000
                            </div>
                        </div>
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
                                : 'bg-gray-600 text-white hover:bg-gray-700'
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
                <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm mt-8 pl-4">
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

                {/* Table Body */}
                <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t min-h-[400px]">
                    {filteredTransactions.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl px-6 py-4 grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_100px] gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex items-center justify-center">
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
                            </div>


                            <div className="font-semibold text-gray-800 text-sm">{item.dueDate}</div>
                            <div className="text-gray-800 text-sm font-semibold">{item.category}</div>
                            <div className="text-gray-800 text-sm font-semibold">{item.property}</div>
                            <div className="text-gray-800 text-sm font-semibold">{item.contact}</div>
                            <div className="text-[#3A6D6C] text-sm font-bold">+{item.total.toLocaleString()}</div>
                            <div className="text-gray-800 text-sm font-semibold">₹ {item.balance.toLocaleString()}</div>

                            <div className="flex items-center justify-end gap-3">
                                <button className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors">
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button className="text-red-500 hover:text-red-600 transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Transactions;
