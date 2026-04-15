import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, LayoutTemplate, X, Check, ChevronLeft } from 'lucide-react';
import DashboardFilter from '../../components/DashboardFilter';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import type { FilterOption } from '../../components/DashboardFilter';
import { useGeneralExpensesReport } from '../../../../hooks/useReportsQueries';

interface GeneralExpenseItem {
    id: string;
    subCategory: string;
    datePaid: string;
    payerPayee: string;
    amountPaid: number;
}

const ALL_COLUMNS = [
    { id: 'subCategory', label: 'Sub-category', width: '1.5fr', hasSort: true },
    { id: 'datePaid', label: 'Date paid', width: '1fr', hasSort: true },
    { id: 'payerPayee', label: 'Payer/Payee', width: '1.5fr', hasSort: true },
    { id: 'amountPaid', label: 'Amount paid', width: '1fr', hasSort: true },
] as const;

type ColumnId = typeof ALL_COLUMNS[number]['id'];

const GeneralExpenses: React.FC = () => {
    const navigate = useNavigate();
    const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>(ALL_COLUMNS.map(c => c.id));
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

    const [startDate, setStartDate] = useState<string | undefined>(undefined);
    const [endDate, setEndDate] = useState<string | undefined>(undefined);

    const { data: apiData, isLoading, error } = useGeneralExpensesReport({ startDate, endDate });

    const expenseItems: GeneralExpenseItem[] = useMemo(() => {
        if (!apiData?.rows) return [];
        return apiData.rows.map((row, idx) => ({
            id: String(idx),
            subCategory: row.category,
            datePaid: '---',
            payerPayee: '---',
            amountPaid: row.total,
        }));
    }, [apiData]);

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
        subCategory: Array.from(new Set(expenseItems.map(r => r.subCategory))).map(cat => ({ value: cat, label: cat })),
        group: [
            { value: 'by_category', label: 'By Category' },
            { value: 'by_payee', label: 'By Payee' },
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

    const filteredItems = useMemo(() => {
        return expenseItems.filter(item => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    item.subCategory.toLowerCase().includes(query) ||
                    item.payerPayee.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }
            if (selectedFilters.subCategory.length > 0 && !selectedFilters.subCategory.includes(item.subCategory)) {
                return false;
            }
            return true;
        });
    }, [searchQuery, selectedFilters, expenseItems]);

    const totalAmount = useMemo(() => {
        return filteredItems.reduce((acc, item) => acc + item.amountPaid, 0);
    }, [filteredItems]);

    const activeColumns = ALL_COLUMNS.filter(col => visibleColumns.includes(col.id));
    const gridTemplateColumns = activeColumns.map(col => col.width).join(' ');

    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const renderCellContent = (item: GeneralExpenseItem, columnId: ColumnId) => {
        switch (columnId) {
            case 'subCategory':
                return <span className="text-gray-800">{item.subCategory}</span>;
            case 'datePaid':
                return <span className="text-gray-700">{item.datePaid}</span>;
            case 'payerPayee':
                return <span className="text-gray-700">{item.payerPayee}</span>;
            case 'amountPaid':
                return <span className="text-gray-800">{formatCurrency(item.amountPaid)}</span>;
            default:
                return String(item[columnId as keyof GeneralExpenseItem] ?? '');
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-20">
            <div className="flex w-full overflow-x-auto pb-2 md:pb-0 mb-6 scrollbar-hide">
                <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Reports', path: '/dashboard/reports' }, { label: 'General Expenses' }]} />
            </div>

            <div className="bg-[#E0E8E7] rounded-[2rem] p-8 min-h-[calc(100vh-100px)] relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/dashboard/reports')} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">General Expenses</h1>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={() => setIsColumnModalOpen(true)} className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-lg shadow-[#3A6D6C]/20 flex items-center gap-2">
                            <LayoutTemplate size={16} />
                            Columns
                        </button>
                        <button className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-lg shadow-[#3A6D6C]/20 flex items-center gap-2">
                            <Download size={16} />
                            Download Report
                        </button>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 max-w-5xl leading-relaxed">
                    The report captures all non-property-related expenses, making it ideal for tracking business costs like travel, lodging, and other reimbursable expenses. It's a valuable tool for keeping your business finances organized and ensuring all costs are accounted for. <span className="text-gray-900 font-semibold cursor-pointer">Learn more</span>
                </p>

                <div className="flex flex-wrap gap-4 mb-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        Start date:
                        <input type="date" value={startDate ?? ''} onChange={e => setStartDate(e.target.value || undefined)} className="border border-gray-300 rounded px-2 py-1 text-sm" />
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        End date:
                        <input type="date" value={endDate ?? ''} onChange={e => setEndDate(e.target.value || undefined)} className="border border-gray-300 rounded px-2 py-1 text-sm" />
                    </label>
                </div>

                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={setSelectedFilters}
                    showMoreFilters={false}
                    showClearAll={false}
                    initialFilters={selectedFilters}
                />

                {isLoading && (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <p className="text-gray-500 text-lg">Loading...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <p className="text-red-500 text-lg">Failed to load expenses data. Please try again.</p>
                    </div>
                )}

                {!isLoading && !error && (
                    <div>
                        <div className="hidden md:block bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm">
                            <div className="text-white px-6 py-4 grid gap-4 items-center text-sm font-medium" style={{ gridTemplateColumns }}>
                                {activeColumns.map(col => <div key={col.id}>{col.label}</div>)}
                            </div>
                        </div>

                        <div className="bg-white rounded-b-[1.5rem] overflow-hidden">
                            {filteredItems.map(item => (
                                <div key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <div className="hidden md:grid px-6 py-4 gap-4 items-center" style={{ gridTemplateColumns }}>
                                        {activeColumns.map(col => <div key={col.id} className="text-sm">{renderCellContent(item, col.id)}</div>)}
                                    </div>
                                    <div className="md:hidden p-4 space-y-3">
                                        {activeColumns.map(col => (
                                            <div key={col.id} className="flex justify-between items-start gap-4">
                                                <span className="text-gray-500 text-xs font-medium uppercase mt-1">{col.label}</span>
                                                <div className="text-sm text-right flex-1">{renderCellContent(item, col.id)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Total Row */}
                            <div className="bg-gray-50 border-t border-gray-200">
                                <div className="hidden md:grid px-6 py-4 gap-4 items-center" style={{ gridTemplateColumns }}>
                                    {activeColumns.map((col, index) => (
                                        <div key={col.id} className="text-sm">
                                            {index === 0 ? (
                                                <span className="text-gray-800 font-bold">Total</span>
                                            ) : col.id === 'amountPaid' ? (
                                                <span className="text-gray-800 font-bold">{formatCurrency(totalAmount)}</span>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                                <div className="md:hidden p-4 flex justify-between items-center">
                                    <span className="text-gray-800 font-bold">Total</span>
                                    <span className="text-gray-800 font-bold">{formatCurrency(totalAmount)}</span>
                                </div>
                            </div>

                            {filteredItems.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">No data</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {isColumnModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-72 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#3A6D6C]">
                            <h3 className="font-semibold text-white">Show Columns</h3>
                            <button onClick={() => setIsColumnModalOpen(false)} className="text-white hover:text-white/50"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-2 max-h-[60vh] overflow-y-auto">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 p-2">Select the columns you want to be displayed on your report.</h4>
                            {ALL_COLUMNS.map(col => (
                                <label key={col.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${visibleColumns.includes(col.id) ? 'bg-[#3A6D6C] border-[#3A6D6C]' : 'border-gray-300'}`}>
                                        {visibleColumns.includes(col.id) && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={visibleColumns.includes(col.id)} onChange={() => toggleColumn(col.id)} />
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

export default GeneralExpenses;
