import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, LayoutTemplate, X, Check, ChevronUp, ChevronDown } from 'lucide-react';
import DashboardFilter from '../../components/DashboardFilter';
import type { FilterOption } from '../../components/DashboardFilter';

interface PropertyStatementItem {
    id: string;
    property: string;
    propertyType: string;
    propertyAddress: string;
    datePaid: string;
    category: string;
    subCategory: string;
    payerPayee: string;
    moneyIn: number;
    moneyOut: number;
}

const ALL_COLUMNS = [
    { id: 'datePaid', label: 'Date paid', width: '1fr', hasSort: true },
    { id: 'category', label: 'Category', width: '1fr', hasSort: true },
    { id: 'subCategory', label: 'Sub-category', width: '1fr', hasSort: false },
    { id: 'payerPayee', label: 'Payer/Payee', width: '1.2fr', hasSort: true },
    { id: 'moneyIn', label: 'Money in', width: '1fr', hasSort: true },
    { id: 'moneyOut', label: 'Money out', width: '1fr', hasSort: true },
] as const;

type ColumnId = typeof ALL_COLUMNS[number]['id'];

// Mock Data grouped by property
const MOCK_STATEMENT_DATA: PropertyStatementItem[] = [
    {
        id: '1',
        property: 'Ak Appartment',
        propertyType: '1 Unit',
        propertyAddress: 'Railway Station Rd, Bhopal, MP, 462001, IN',
        datePaid: '08 Nov, 2025',
        category: 'Rent',
        subCategory: '—',
        payerPayee: 'Atul rawat',
        moneyIn: 53200.00,
        moneyOut: 0
    },
    {
        id: '2',
        property: 'luxury',
        propertyType: 'Single-family',
        propertyAddress: 'Lokhandwala Complex Rd, Mumbai, MH, 400053, IN',
        datePaid: '08 Nov, 2025',
        category: 'Rent',
        subCategory: '—',
        payerPayee: 'Abc',
        moneyIn: 53200.00,
        moneyOut: 0
    },
    {
        id: '3',
        property: 'Ak Appartment',
        propertyType: '1 Unit',
        propertyAddress: 'Railway Station Rd, Bhopal, MP, 462001, IN',
        datePaid: '15 Nov, 2025',
        category: 'Maintenance',
        subCategory: 'Plumbing',
        payerPayee: 'ABC Plumbers',
        moneyIn: 0,
        moneyOut: 5000.00
    },
    {
        id: '4',
        property: 'luxury',
        propertyType: 'Single-family',
        propertyAddress: 'Lokhandwala Complex Rd, Mumbai, MH, 400053, IN',
        datePaid: '20 Nov, 2025',
        category: 'Utilities',
        subCategory: 'Electricity',
        payerPayee: 'Power Corp',
        moneyIn: 0,
        moneyOut: 2500.00
    }
];

const PropertyStatement: React.FC = () => {
    const navigate = useNavigate();
    const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>(ALL_COLUMNS.map(c => c.id));
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
    const [expandedProperties, setExpandedProperties] = useState<string[]>(['Ak Appartment', 'luxury']);

    // Filter State for DashboardFilter
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
        date: [],
        propertyUnits: [],
        leaseStatus: [],
        categorySubCategory: []
    });

    // Filter Options for DashboardFilter
    const filterOptions: Record<string, FilterOption[]> = {
        date: [
            { value: 'today', label: 'Today' },
            { value: 'this_week', label: 'This Week' },
            { value: 'this_month', label: 'This Month' },
            { value: 'last_month', label: 'Last Month' }
        ],
        propertyUnits: Array.from(new Set(MOCK_STATEMENT_DATA.map(r => r.property))).map(prop => ({ value: prop, label: prop })),
        leaseStatus: [
            { value: 'Active', label: 'Active' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Expired', label: 'Expired' }
        ],
        categorySubCategory: Array.from(new Set(MOCK_STATEMENT_DATA.map(r => r.category))).map(cat => ({ value: cat, label: cat }))
    };

    const filterLabels: Record<string, string> = {
        date: 'Date',
        propertyUnits: 'Property & Units',
        leaseStatus: 'Lease Status',
        categorySubCategory: 'Category Sub-Category'
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

    const toggleProperty = (property: string) => {
        setExpandedProperties(prev =>
            prev.includes(property)
                ? prev.filter(p => p !== property)
                : [...prev, property]
        );
    };

    // Filter Logic
    const filteredItems = useMemo(() => {
        return MOCK_STATEMENT_DATA.filter(item => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    item.property.toLowerCase().includes(query) ||
                    item.category.toLowerCase().includes(query) ||
                    item.payerPayee.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            // Property filter
            if (selectedFilters.propertyUnits.length > 0 && !selectedFilters.propertyUnits.includes(item.property)) {
                return false;
            }

            // Category filter
            if (selectedFilters.categorySubCategory.length > 0 && !selectedFilters.categorySubCategory.includes(item.category)) {
                return false;
            }

            return true;
        });
    }, [searchQuery, selectedFilters]);

    // Group items by property
    const groupedByProperty = useMemo(() => {
        const groups: Record<string, { items: PropertyStatementItem[], propertyType: string, propertyAddress: string }> = {};

        filteredItems.forEach(item => {
            const key = item.property;
            if (!groups[key]) {
                groups[key] = {
                    items: [],
                    propertyType: item.propertyType,
                    propertyAddress: item.propertyAddress
                };
            }
            groups[key].items.push(item);
        });

        return groups;
    }, [filteredItems]);

    // Calculate Grand Total
    const grandTotal = useMemo(() => {
        return filteredItems.reduce((acc, item) => acc + item.moneyIn - item.moneyOut, 0);
    }, [filteredItems]);

    const activeColumns = ALL_COLUMNS.filter(col => visibleColumns.includes(col.id));
    const gridTemplateColumns = activeColumns.map(col => col.width).join(' ');

    const formatCurrency = (amount: number) => {
        if (amount === 0) return '₹0.00';
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const renderCellContent = (item: PropertyStatementItem, columnId: ColumnId) => {
        switch (columnId) {
            case 'datePaid':
                return <span className="text-[#4ad1a6]">{item.datePaid}</span>;
            case 'category':
                return <span className="text-gray-800">{item.category}</span>;
            case 'subCategory':
                return <span className="text-gray-600">{item.subCategory}</span>;
            case 'payerPayee':
                return <span className="text-gray-700">{item.payerPayee}</span>;
            case 'moneyIn':
                return <span className="text-gray-800">{formatCurrency(item.moneyIn)}</span>;
            case 'moneyOut':
                return <span className="text-gray-600">{formatCurrency(item.moneyOut)}</span>;
            default:
                return item[columnId as keyof PropertyStatementItem];
        }
    };

    const calculatePropertyTotals = (items: PropertyStatementItem[]) => {
        return items.reduce((acc, item) => ({
            moneyIn: acc.moneyIn + item.moneyIn,
            moneyOut: acc.moneyOut + item.moneyOut
        }), { moneyIn: 0, moneyOut: 0 });
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-20">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/reports')}>Reports</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-800 text-sm font-semibold">Property Statement</span>
            </div>

            <div className="bg-[#E0E8E7] rounded-[2rem] p-8 min-h-[calc(100vh-100px)] relative">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Property Statement</h1>
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
                    The report displays all property-related payments in paid status, using cash accounting by default, and excludes liabilities. <span className="text-gray-900 font-semibold cursor-pointer">Learn more</span>
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

                {/* Property Sections - Like Leases Page */}
                {Object.entries(groupedByProperty).map(([property, data]) => {
                    const isExpanded = expandedProperties.includes(property);
                    const totals = calculatePropertyTotals(data.items);

                    return (
                        <div key={property} className="mb-8">
                            {/* Property Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <button
                                    onClick={() => toggleProperty(property)}
                                    className="bg-[#7CD947] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                                >
                                    {property} ( {data.propertyType} | {data.propertyAddress} )
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                            </div>

                            {isExpanded && (
                                <>
                                    {/* Table Header */}
                                    <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm">
                                        <div
                                            className="text-white px-6 py-4 grid gap-4 items-center text-sm font-medium"
                                            style={{ gridTemplateColumns }}
                                        >
                                            {activeColumns.map(col => (
                                                <div key={col.id} className={col.hasSort ? "flex items-center gap-1 cursor-pointer" : ""}>
                                                    {col.label}
                                                    {col.hasSort && <ChevronUp className="w-3 h-3" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Table Body */}
                                    <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-b-[2rem]">
                                        {data.items.map(item => (
                                            <div
                                                key={item.id}
                                                className="bg-white rounded-2xl px-6 py-4 grid gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                                style={{ gridTemplateColumns }}
                                            >
                                                {activeColumns.map(col => (
                                                    <div key={col.id} className="text-sm">
                                                        {renderCellContent(item, col.id)}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}

                                        {/* Property Total Row */}
                                        <div
                                            className="bg-[#E8F5E8] rounded-2xl px-6 py-4 grid gap-4 items-center"
                                            style={{ gridTemplateColumns }}
                                        >
                                            {activeColumns.map((col, index) => (
                                                <div key={col.id} className="text-sm">
                                                    {index === 0 ? (
                                                        <span className="text-gray-800 font-bold">Total</span>
                                                    ) : col.id === 'moneyIn' ? (
                                                        <span className="text-gray-800 font-bold">{formatCurrency(totals.moneyIn)}</span>
                                                    ) : col.id === 'moneyOut' ? (
                                                        <span className="text-gray-600 font-bold">{formatCurrency(totals.moneyOut)}</span>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}

                {/* Grand Total Row */}
                {Object.keys(groupedByProperty).length > 0 && (
                    <div
                        className="bg-[#7CD947] rounded-2xl px-6 py-4 grid gap-4 items-center text-white font-bold"
                        style={{ gridTemplateColumns }}
                    >
                        {activeColumns.map((col, index) => (
                            <div key={col.id} className="text-sm">
                                {index === 0 ? (
                                    <span>Grand total</span>
                                ) : col.id === 'moneyIn' ? (
                                    <span>{formatCurrency(grandTotal)}</span>
                                ) : null}
                            </div>
                        ))}
                    </div>
                )}

                {Object.keys(groupedByProperty).length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <p className="text-gray-500 text-lg">No property statement data found matching your filters</p>
                    </div>
                )}
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

export default PropertyStatement;
