import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, LayoutTemplate, X, Check, ChevronDown, ChevronUp, ChevronLeft } from 'lucide-react';
import DashboardFilter from '../../components/DashboardFilter';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import type { FilterOption } from '../../components/DashboardFilter';

interface VacantRentalItem {
    id: string;
    property: string;
    propertyType: string;
    propertyAddress: string;
    unit: string;
    daysVacant: number;
    beds: number;
    baths: number;
    size: string;
    marketRent: number;
    marketingStatus: string;
}

const ALL_COLUMNS = [
    { id: 'unit', label: 'Unit', width: '0.8fr', hasSort: true },
    { id: 'daysVacant', label: 'Days vacant', width: '1fr', hasSort: true },
    { id: 'beds', label: 'Beds', width: '0.6fr', hasSort: true },
    { id: 'baths', label: 'Baths', width: '0.6fr', hasSort: true },
    { id: 'size', label: 'Size', width: '1fr', hasSort: false },
    { id: 'marketRent', label: 'Market rent', width: '1fr', hasSort: true },
    { id: 'marketingStatus', label: 'Marketing status', width: '1fr', hasSort: false },
] as const;

type ColumnId = typeof ALL_COLUMNS[number]['id'];

// Mock Data
const MOCK_VACANT_RENTALS: VacantRentalItem[] = [
    {
        id: '1',
        property: 'abc',
        propertyType: 'Single-family',
        propertyAddress: '78 Scheme No 78 - II, Indore, MP, 452010, IN',
        unit: '2',
        daysVacant: 22,
        beds: 3,
        baths: 5,
        size: '5200 sq.ft',
        marketRent: 62000.00,
        marketingStatus: 'Unlisted'
    },
    {
        id: '2',
        property: 'abc',
        propertyType: 'Single-family',
        propertyAddress: '78 Scheme No 78 - II, Indore, MP, 452010, IN',
        unit: '3',
        daysVacant: 15,
        beds: 2,
        baths: 2,
        size: '3200 sq.ft',
        marketRent: 45000.00,
        marketingStatus: 'Listed'
    },
    {
        id: '3',
        property: 'Grove Street',
        propertyType: 'Single-family',
        propertyAddress: '11 Grove Street, Boston, MA, 12114, US',
        unit: '2',
        daysVacant: 22,
        beds: 3,
        baths: 5,
        size: '5200 sq.ft',
        marketRent: 62000.00,
        marketingStatus: 'Unlisted'
    }
];

const VacantRentals: React.FC = () => {
    const navigate = useNavigate();
    const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>(ALL_COLUMNS.map(c => c.id));
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
    const [expandedProperties, setExpandedProperties] = useState<string[]>(['abc', 'Grove Street']);

    // Filter State for DashboardFilter
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
        marketingStatus: [],
        propertyUnits: []
    });

    // Filter Options for DashboardFilter
    const filterOptions: Record<string, FilterOption[]> = {
        marketingStatus: [
            { value: 'Listed', label: 'Listed' },
            { value: 'Unlisted', label: 'Unlisted' }
        ],
        propertyUnits: Array.from(new Set(MOCK_VACANT_RENTALS.map(r => r.property))).map(prop => ({ value: prop, label: prop }))
    };

    const filterLabels: Record<string, string> = {
        marketingStatus: 'Marketing Status',
        propertyUnits: 'Property &Units'
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
        return MOCK_VACANT_RENTALS.filter(item => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    item.property.toLowerCase().includes(query) ||
                    item.unit.toLowerCase().includes(query) ||
                    item.marketingStatus.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            // Marketing Status filter
            if (selectedFilters.marketingStatus.length > 0 && !selectedFilters.marketingStatus.includes(item.marketingStatus)) {
                return false;
            }

            // Property filter
            if (selectedFilters.propertyUnits.length > 0 && !selectedFilters.propertyUnits.includes(item.property)) {
                return false;
            }

            return true;
        });
    }, [searchQuery, selectedFilters]);

    // Group items by property
    const groupedByProperty = useMemo(() => {
        const groups: Record<string, { items: VacantRentalItem[], propertyType: string, propertyAddress: string }> = {};

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

    const activeColumns = ALL_COLUMNS.filter(col => visibleColumns.includes(col.id));
    const gridTemplateColumns = activeColumns.map(col => col.width).join(' ');

    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const renderCellContent = (item: VacantRentalItem, columnId: ColumnId) => {
        switch (columnId) {
            case 'unit':
                return <span className="text-[#4ad1a6] font-medium">{item.unit}</span>;
            case 'daysVacant':
                return <span className="text-gray-800">{item.daysVacant}</span>;
            case 'beds':
                return <span className="text-[#4ad1a6]">{item.beds}</span>;
            case 'baths':
                return <span className="text-gray-700">{item.baths}</span>;
            case 'size':
                return <span className="text-gray-700">{item.size}</span>;
            case 'marketRent':
                return <span className="text-gray-800">{formatCurrency(item.marketRent)}</span>;
            case 'marketingStatus':
                return <span className="text-gray-700">{item.marketingStatus}</span>;
            default:
                return item[columnId as keyof VacantRentalItem];
        }
    };

    const calculateTotal = (items: VacantRentalItem[]) => {
        return items.reduce((acc, item) => acc + item.marketRent, 0);
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-20">
            {/* Breadcrumb */}
            <div className="flex w-full overflow-x-auto pb-2 md:pb-0 mb-6 scrollbar-hide">
                <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Reports', path: '/dashboard/reports' }, { label: 'Vacant Rentals' }]} />
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
                        <h1 className="text-2xl font-bold text-gray-900">Vacant Rentals</h1>
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
                    This report displays unoccupied units and their marketing statuses. It calculates the number of days each rental has been vacant, starting from the end date of the previous lease or, if no lease existed, from the unit's creation date. For rentals that are currently listed, it also shows how many days they have been on the market. This helps track vacancy periods and evaluate marketing performance. <span className="text-gray-900 font-semibold cursor-pointer">Learn more</span>
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

                {/* Property Sections - Like Tenant Statement */}
                {Object.entries(groupedByProperty).map(([property, data]) => {
                    const isExpanded = expandedProperties.includes(property);
                    const total = calculateTotal(data.items);

                    return (
                        <div key={property} className="mb-8 bg-[#F0F0F6] rounded-[2rem] p-6">
                            {/* Property Header */}
                            <div className="flex items-center gap-3 mb-4">
                                <button
                                    onClick={() => toggleProperty(property)}
                                    className="bg-[#3A6D6C] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                                >
                                    {property} ( {data.propertyType} | {data.propertyAddress} )
                                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                            </div>

                            {isExpanded && (
                                <>
                                    {/* Table Header */}
                                    <div className="hidden md:block bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm">
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
                                    <div className="bg-white rounded-b-[1.5rem] overflow-hidden">
                                        {data.items.map(item => (
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
                                        <div
                                            className="bg-gray-50"
                                        >
                                            {/* Desktop View */}
                                            <div
                                                className="hidden md:grid px-6 py-4 gap-4 items-center"
                                                style={{ gridTemplateColumns }}
                                            >
                                                {activeColumns.map((col, index) => (
                                                    <div key={col.id} className={col.id === 'marketRent' || index === 0 ? "text-gray-800 font-bold" : ""}>
                                                        {index === 0 ? 'Total' :
                                                            col.id === 'marketRent' ? formatCurrency(total) :
                                                                null}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Mobile View */}
                                            <div className="md:hidden p-4 flex justify-between items-center">
                                                <span className="text-gray-800 font-bold">Total Market Rent</span>
                                                <span className="text-gray-800 font-bold">{formatCurrency(total)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}

                {Object.keys(groupedByProperty).length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <p className="text-gray-500 text-lg">No vacant rentals found matching your filters</p>
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

export default VacantRentals;
