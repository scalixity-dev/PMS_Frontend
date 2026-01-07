import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, LayoutTemplate, X, Check, ChevronLeft } from 'lucide-react';
import DashboardFilter from '../../components/DashboardFilter';
import type { FilterOption } from '../../components/DashboardFilter';

interface GeneralIncomeItem {
    id: string;
    subCategory: string;
    dateDue: string;
    datePaid: string;
    payerPayee: string;
    amountDue: number;
    amountPaid: number;
    discount: number;
    paymentMethod: string;
    details: string;
}

const ALL_COLUMNS = [
    { id: 'subCategory', label: 'Sub-category', width: '1fr', hasSort: true },
    { id: 'dateDue', label: 'Date due', width: '1fr', hasSort: true },
    { id: 'datePaid', label: 'Date paid', width: '1fr', hasSort: true },
    { id: 'payerPayee', label: 'Payer/Payee', width: '1fr', hasSort: true },
    { id: 'amountDue', label: 'Amount due', width: '1fr', hasSort: true },
    { id: 'amountPaid', label: 'Amount paid', width: '1fr', hasSort: true },
    { id: 'discount', label: 'Discount', width: '0.8fr', hasSort: true },
    { id: 'paymentMethod', label: 'Payment method', width: '1fr', hasSort: false },
    { id: 'details', label: 'Details', width: '1.2fr', hasSort: false },
] as const;

type ColumnId = typeof ALL_COLUMNS[number]['id'];

// Mock Data
const MOCK_INCOME: GeneralIncomeItem[] = [
    {
        id: '1',
        subCategory: 'Referral Bonus',
        dateDue: '15 Dec, 2025',
        datePaid: '15 Dec, 2025',
        payerPayee: 'John Doe',
        amountDue: 5000.00,
        amountPaid: 5000.00,
        discount: 0,
        paymentMethod: 'Bank Transfer',
        details: 'Referral commission for new tenant'
    },
    {
        id: '2',
        subCategory: 'Commission',
        dateDue: '10 Dec, 2025',
        datePaid: '12 Dec, 2025',
        payerPayee: 'ABC Corp',
        amountDue: 10000.00,
        amountPaid: 9500.00,
        discount: 500,
        paymentMethod: 'Check',
        details: 'Sales commission Q4'
    },
    {
        id: '3',
        subCategory: 'Fees',
        dateDue: '01 Dec, 2025',
        datePaid: '---',
        payerPayee: 'XYZ Ltd',
        amountDue: 2500.00,
        amountPaid: 0,
        discount: 0,
        paymentMethod: '---',
        details: 'Consulting fees'
    },
    {
        id: '4',
        subCategory: 'Interest',
        dateDue: '20 Nov, 2025',
        datePaid: '20 Nov, 2025',
        payerPayee: 'Bank of India',
        amountDue: 1500.00,
        amountPaid: 1500.00,
        discount: 0,
        paymentMethod: 'Direct Deposit',
        details: 'Monthly interest income'
    }
];

const GeneralIncome: React.FC = () => {
    const navigate = useNavigate();
    const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>(ALL_COLUMNS.map(c => c.id));
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

    // Filter State for DashboardFilter
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
        date: [],
        accountingType: [],
        subCategory: [],
        group: []
    });

    // Filter Options for DashboardFilter
    const filterOptions: Record<string, FilterOption[]> = {
        date: [
            { value: 'today', label: 'Today' },
            { value: 'this_week', label: 'This Week' },
            { value: 'this_month', label: 'This Month' },
            { value: 'last_month', label: 'Last Month' }
        ],
        accountingType: [
            { value: 'accrual', label: 'Accrual' },
            { value: 'cash', label: 'Cash' }
        ],
        subCategory: Array.from(new Set(MOCK_INCOME.map(r => r.subCategory))).map(cat => ({ value: cat, label: cat })),
        group: [
            { value: 'by_category', label: 'By Category' },
            { value: 'by_payer', label: 'By Payer' },
            { value: 'by_date', label: 'By Date' }
        ]
    };

    const filterLabels: Record<string, string> = {
        date: 'Date',
        accountingType: 'Accounting Type',
        subCategory: 'Sub-Category',
        group: 'Group'
    };

    const toggleColumn = (columnId: ColumnId) => {
        setVisibleColumns(prev => {
            if (prev.includes(columnId)) {
                return prev.filter(id => id !== columnId);
            } else {
                const newSet = new Set([...prev, columnId]);
                return ALL_COLUMNS.filter(col => newSet.has(col.id)).map(col => col.id);
            }
        });
    };

    // Filter Logic
    const filteredItems = useMemo(() => {
        return MOCK_INCOME.filter(item => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    item.subCategory.toLowerCase().includes(query) ||
                    item.payerPayee.toLowerCase().includes(query) ||
                    item.details.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            // Sub-Category filter
            if (selectedFilters.subCategory.length > 0 && !selectedFilters.subCategory.includes(item.subCategory)) {
                return false;
            }

            return true;
        });
    }, [searchQuery, selectedFilters]);

    const totals = useMemo(() => {
        return filteredItems.reduce((acc, item) => ({
            amountDue: acc.amountDue + item.amountDue,
            amountPaid: acc.amountPaid + item.amountPaid,
            discount: acc.discount + item.discount
        }), { amountDue: 0, amountPaid: 0, discount: 0 });
    }, [filteredItems]);

    const activeColumns = ALL_COLUMNS.filter(col => visibleColumns.includes(col.id));
    const gridTemplateColumns = activeColumns.map(col => col.width).join(' ');

    const formatCurrency = (amount: number) => {
        if (amount === 0) return '₹0.00';
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const renderCellContent = (item: GeneralIncomeItem, columnId: ColumnId) => {
        switch (columnId) {
            case 'subCategory':
                return <span className="text-gray-800">{item.subCategory}</span>;
            case 'dateDue':
                return <span className="text-gray-700">{item.dateDue}</span>;
            case 'datePaid':
                return <span className="text-gray-700">{item.datePaid}</span>;
            case 'payerPayee':
                return <span className="text-gray-700">{item.payerPayee}</span>;
            case 'amountDue':
                return <span className="text-gray-800">{formatCurrency(item.amountDue)}</span>;
            case 'amountPaid':
                return <span className="text-gray-800">{formatCurrency(item.amountPaid)}</span>;
            case 'discount':
                return <span className="text-gray-600">{formatCurrency(item.discount)}</span>;
            case 'paymentMethod':
                return <span className="text-gray-700">{item.paymentMethod}</span>;
            case 'details':
                return <span className="text-gray-600 break-words">{item.details}</span>;
            default:
                return item[columnId as keyof GeneralIncomeItem];
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-20">
            {/* Breadcrumb */}
            <div className="flex w-full overflow-x-auto pb-2 md:pb-0 mb-6 scrollbar-hide">
                <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)] whitespace-nowrap">
                    <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                    <span className="text-gray-500 text-sm mx-1">/</span>
                    <span className="text-gray-600 text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/reports')}>Reports</span>
                    <span className="text-gray-500 text-sm mx-1">/</span>
                    <span className="text-gray-800 text-sm font-semibold">General Income</span>
                </div>
            </div>

            <div className="bg-[#E0E8E7] rounded-[2rem] p-8 min-h-[calc(100vh-100px)] relative">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard/reports')}
                            className="p-2 hover:bg-black/5 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">General Income</h1>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setIsColumnModalOpen(true)}
                            className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-lg shadow-[#3A6D6C]/20 flex items-center gap-2"
                        >
                            <LayoutTemplate size={16} />
                            Columns
                        </button>
                        <button className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-lg shadow-[#3A6D6C]/20 flex items-center gap-2">
                            <Download size={16} />
                            Download Report
                        </button>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-8 max-w-5xl leading-relaxed">
                    The report tracks all non-property-related income, making it ideal for tracking additional earnings like fees, commissions, and referral income. It's a valuable tool for keeping your business finances organized and ensuring all costs are accounted for. <span className="text-gray-900 font-semibold cursor-pointer">Learn more</span>
                </p>

                {/* Dashboard Style Filter Bar */}
                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={setSelectedFilters}
                    showMoreFilters={false}
                    showClearAll={false}
                    initialFilters={selectedFilters}
                />

                {/* Table Container */}
                <div>
                    {/* Table Header */}
                    <div className="hidden md:block bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm">
                        <div
                            className="text-white px-6 py-4 grid gap-4 items-center text-sm font-medium"
                            style={{ gridTemplateColumns }}
                        >
                            {activeColumns.map(col => (
                                <div key={col.id}>
                                    {col.label}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="bg-white rounded-b-[1.5rem] overflow-hidden">
                        {filteredItems.map(item => (
                            <div
                                key={item.id}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                {/* Desktop View */}
                                <div
                                    className="hidden md:grid px-6 py-4 gap-4 items-center"
                                    style={{ gridTemplateColumns }}
                                >
                                    {activeColumns.map(col => (
                                        <div key={col.id} className="text-sm">
                                            {renderCellContent(item, col.id)}
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile View */}
                                <div className="md:hidden p-4 space-y-3">
                                    {activeColumns.map(col => (
                                        <div key={col.id} className="flex justify-between items-start gap-4">
                                            <span className="text-gray-500 text-xs font-medium uppercase mt-1">{col.label}</span>
                                            <div className="text-sm text-right flex-1">
                                                {renderCellContent(item, col.id)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Total Row */}
                        {filteredItems.length > 0 && (
                            <div
                                className="bg-gray-50 border-t border-gray-200"
                            >
                                {/* Desktop View */}
                                <div
                                    className="hidden md:grid px-6 py-4 gap-4 items-center"
                                    style={{ gridTemplateColumns }}
                                >
                                    {activeColumns.map((col, index) => (
                                        <div key={col.id} className="text-sm">
                                            {index === 0 ? (
                                                <span className="text-gray-800 font-bold">Total</span>
                                            ) : col.id === 'amountDue' ? (
                                                <span className="text-gray-800 font-bold">{formatCurrency(totals.amountDue)}</span>
                                            ) : col.id === 'amountPaid' ? (
                                                <span className="text-gray-800 font-bold">{formatCurrency(totals.amountPaid)}</span>
                                            ) : col.id === 'discount' ? (
                                                <span className="text-gray-600">{formatCurrency(totals.discount)}</span>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>

                                {/* Mobile View */}
                                <div className="md:hidden p-4 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-800 font-bold">Total Amount Due</span>
                                        <span className="text-gray-800 font-bold">{formatCurrency(totals.amountDue)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-800 font-bold">Total Amount Paid</span>
                                        <span className="text-gray-800 font-bold">{formatCurrency(totals.amountPaid)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-800 font-bold">Total Discount</span>
                                        <span className="text-gray-600 font-bold">{formatCurrency(totals.discount)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {filteredItems.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No income found matching your filters</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Column Selection Modal */}
            {isColumnModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-72 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#3A6D6C]">
                            <h3 className="font-semibold text-white">Show Columns</h3>
                            <button onClick={() => setIsColumnModalOpen(false)} className="text-white hover:text-white/50">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-2 max-h-[60vh] overflow-y-auto">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 p-2">Select the columns you want to be displayed on your report.</h4>
                            {ALL_COLUMNS.map(col => (
                                <label key={col.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${visibleColumns.includes(col.id) ? 'bg-[#3A6D6C] border-[#3A6D6C]' : 'border-gray-300'}`}>
                                        {visibleColumns.includes(col.id) && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={visibleColumns.includes(col.id)}
                                        onChange={() => toggleColumn(col.id)}
                                    />
                                    <span className="text-sm text-gray-700">{col.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeneralIncome;
