import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, LayoutTemplate, X, Check } from 'lucide-react';
import DashboardFilter from '../../components/DashboardFilter';
import type { FilterOption } from '../../components/DashboardFilter';

interface PropertyExpenseItem {
    id: string;
    datePaid: string;
    dateDue: string;
    unit: string;
    category: string;
    subCategory: string;
    payerPayee: string;
    amountDue: number;
    amountPaid: number;
    details: string;
}

const ALL_COLUMNS = [
    { id: 'datePaid', label: 'Date paid', width: '1fr', hasSort: true },
    { id: 'dateDue', label: 'Date due', width: '1fr', hasSort: true },
    { id: 'unit', label: 'Unit', width: '0.8fr', hasSort: true },
    { id: 'category', label: 'Category', width: '1fr', hasSort: true },
    { id: 'subCategory', label: 'Sub-category', width: '1fr', hasSort: true },
    { id: 'payerPayee', label: 'Payer/Payee', width: '1fr', hasSort: true },
    { id: 'amountDue', label: 'Amount due', width: '1fr', hasSort: true },
    { id: 'amountPaid', label: 'Amount paid', width: '1fr', hasSort: true },
    { id: 'details', label: 'Details', width: '1.2fr', hasSort: false },
] as const;

type ColumnId = typeof ALL_COLUMNS[number]['id'];

// Mock Data
const MOCK_EXPENSES: PropertyExpenseItem[] = [
    {
        id: '1',
        datePaid: '22 Nov, 2025',
        dateDue: '20 Nov, 2025',
        unit: 'Unit 101',
        category: 'Maintenance',
        subCategory: 'Plumbing',
        payerPayee: 'ABC Plumbers',
        amountDue: 5000.00,
        amountPaid: 5000.00,
        details: 'Bathroom pipe repair'
    },
    {
        id: '2',
        datePaid: '15 Nov, 2025',
        dateDue: '15 Nov, 2025',
        unit: 'Unit 202',
        category: 'Utilities',
        subCategory: 'Electricity',
        payerPayee: 'State Electricity Board',
        amountDue: 2500.00,
        amountPaid: 2500.00,
        details: 'Monthly electricity bill'
    },
    {
        id: '3',
        datePaid: '---',
        dateDue: '01 Dec, 2025',
        unit: 'Unit 101',
        category: 'Maintenance',
        subCategory: 'HVAC',
        payerPayee: 'Cool Air Services',
        amountDue: 8000.00,
        amountPaid: 0,
        details: 'AC servicing and repair'
    },
    {
        id: '4',
        datePaid: '10 Nov, 2025',
        dateDue: '10 Nov, 2025',
        unit: 'Common Area',
        category: 'Management',
        subCategory: 'Security',
        payerPayee: 'SecureGuard Inc',
        amountDue: 15000.00,
        amountPaid: 15000.00,
        details: 'Monthly security service fee'
    }
];

const PropertyExpenses: React.FC = () => {
    const navigate = useNavigate();
    const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>(ALL_COLUMNS.map(c => c.id));
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

    // Filter State for DashboardFilter
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
        date: [],
        accountingType: [],
        categorySubCategory: [],
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
        categorySubCategory: Array.from(new Set(MOCK_EXPENSES.map(r => r.category))).map(cat => ({ value: cat, label: cat })),
        group: [
            { value: 'by_property', label: 'By Property' },
            { value: 'by_category', label: 'By Category' },
            { value: 'by_unit', label: 'By Unit' }
        ]
    };

    const filterLabels: Record<string, string> = {
        date: 'Date',
        accountingType: 'Accounting Type',
        categorySubCategory: 'Category Sub-Category',
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
        return MOCK_EXPENSES.filter(item => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    item.category.toLowerCase().includes(query) ||
                    item.subCategory.toLowerCase().includes(query) ||
                    item.payerPayee.toLowerCase().includes(query) ||
                    item.unit.toLowerCase().includes(query) ||
                    item.details.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            // Category filter
            if (selectedFilters.categorySubCategory.length > 0 && !selectedFilters.categorySubCategory.includes(item.category)) {
                return false;
            }

            return true;
        });
    }, [searchQuery, selectedFilters]);

    const totals = useMemo(() => {
        return filteredItems.reduce((acc, item) => ({
            amountDue: acc.amountDue + item.amountDue,
            amountPaid: acc.amountPaid + item.amountPaid
        }), { amountDue: 0, amountPaid: 0 });
    }, [filteredItems]);

    const activeColumns = ALL_COLUMNS.filter(col => visibleColumns.includes(col.id));
    const gridTemplateColumns = activeColumns.map(col => col.width).join(' ');

    const formatCurrency = (amount: number) => {
        if (amount === 0) return '₹0.00';
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const renderCellContent = (item: PropertyExpenseItem, columnId: ColumnId) => {
        switch (columnId) {
            case 'datePaid':
                return <span className="text-gray-700">{item.datePaid}</span>;
            case 'dateDue':
                return <span className="text-gray-700">{item.dateDue}</span>;
            case 'unit':
                return <span className="text-[#4ad1a6]">{item.unit}</span>;
            case 'category':
                return <span className="text-gray-800">{item.category}</span>;
            case 'subCategory':
                return <span className="text-gray-700">{item.subCategory}</span>;
            case 'payerPayee':
                return <span className="text-gray-700">{item.payerPayee}</span>;
            case 'amountDue':
                return <span className="text-gray-800">{formatCurrency(item.amountDue)}</span>;
            case 'amountPaid':
                return <span className="text-gray-800">{formatCurrency(item.amountPaid)}</span>;
            case 'details':
                return <span className="text-gray-600 break-words">{item.details}</span>;
            default:
                return item[columnId as keyof PropertyExpenseItem];
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-20">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/reports')}>Reports</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-800 text-sm font-semibold">Property Expenses</span>
            </div>

            <div className="bg-[#E0E8E7] rounded-[2rem] p-8 min-h-[calc(100vh-100px)] relative">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Property Expenses</h1>
                    <div className="flex gap-3">
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
                    The report provides a comprehensive overview of all paid property-related expenses, including management fees. It allows filtering by owner for targeted insights but does not include information on liabilities. <span className="text-gray-900 font-semibold cursor-pointer">Learn more</span>
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
                    <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm">
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
                                className="px-6 py-4 grid gap-4 items-center border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                style={{ gridTemplateColumns }}
                            >
                                {activeColumns.map(col => (
                                    <div key={col.id} className="text-sm">
                                        {renderCellContent(item, col.id)}
                                    </div>
                                ))}
                            </div>
                        ))}

                        {/* Total Row */}
                        {filteredItems.length > 0 && (
                            <div
                                className="px-6 py-4 grid gap-4 items-center bg-gray-50"
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
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        )}

                        {filteredItems.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No expenses found matching your filters</p>
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

export default PropertyExpenses;
