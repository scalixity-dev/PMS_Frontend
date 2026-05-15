import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, LayoutTemplate, X, Check, ChevronDown, ChevronUp, ChevronLeft } from 'lucide-react';
import DashboardFilter from '../../components/DashboardFilter';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import type { FilterOption } from '../../components/DashboardFilter';
import { useVacantRentalsReport } from '../../../../hooks/useReportsQueries';
import type { VacantRentalItem } from '../../../../services/reports.service';

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

const VacantRentals: React.FC = () => {
    const navigate = useNavigate();
    const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>(ALL_COLUMNS.map(c => c.id));
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
    const [expandedProperties, setExpandedProperties] = useState<string[]>([]);

    const { data: apiData, isLoading, error } = useVacantRentalsReport();
    const vacantData: VacantRentalItem[] = apiData ?? [];

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
        marketingStatus: [],
        propertyUnits: []
    });

    const filterOptions: Record<string, FilterOption[]> = {
        marketingStatus: [
            { value: 'Listed', label: 'Listed' },
            { value: 'Unlisted', label: 'Unlisted' }
        ],
        propertyUnits: Array.from(new Set(vacantData.map(r => r.property))).map(prop => ({ value: prop, label: prop }))
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
            prev.includes(property) ? prev.filter(p => p !== property) : [...prev, property]
        );
    };

    const filteredItems = useMemo(() => {
        return vacantData.filter(item => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    item.property.toLowerCase().includes(query) ||
                    String(item.unit).toLowerCase().includes(query) ||
                    item.marketingStatus.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }
            if (selectedFilters.marketingStatus.length > 0 && !selectedFilters.marketingStatus.includes(item.marketingStatus)) {
                return false;
            }
            if (selectedFilters.propertyUnits.length > 0 && !selectedFilters.propertyUnits.includes(item.property)) {
                return false;
            }
            return true;
        });
    }, [searchQuery, selectedFilters, vacantData]);

    const groupedByProperty = useMemo(() => {
        const groups: Record<string, { items: VacantRentalItem[], propertyType: string, propertyAddress: string }> = {};
        filteredItems.forEach(item => {
            const key = item.property;
            if (!groups[key]) {
                groups[key] = { items: [], propertyType: item.propertyType, propertyAddress: item.propertyAddress };
            }
            groups[key].items.push(item);
        });
        return groups;
    }, [filteredItems]);

    // Auto-expand all properties when data loads
    useMemo(() => {
        const keys = Object.keys(groupedByProperty);
        if (keys.length > 0 && expandedProperties.length === 0) {
            setExpandedProperties(keys);
        }
    }, [groupedByProperty]);

    const activeColumns = ALL_COLUMNS.filter(col => visibleColumns.includes(col.id));
    const gridTemplateColumns = activeColumns.map(col => col.width).join(' ');

    const formatCurrency = (amount: number) => {
        return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const renderCellContent = (item: VacantRentalItem, columnId: ColumnId) => {
        switch (columnId) {
            case 'unit': return <span className="text-[#4ad1a6] font-medium">{item.unit}</span>;
            case 'daysVacant': return <span className="text-gray-800">{item.daysVacant}</span>;
            case 'beds': return <span className="text-[#4ad1a6]">{item.beds}</span>;
            case 'baths': return <span className="text-gray-700">{item.baths}</span>;
            case 'size': return <span className="text-gray-700">{item.size}</span>;
            case 'marketRent': return <span className="text-gray-800">{formatCurrency(item.marketRent)}</span>;
            case 'marketingStatus': return <span className="text-gray-700">{item.marketingStatus}</span>;
            default: return String(item[columnId as keyof VacantRentalItem] ?? '');
        }
    };

    const calculateTotal = (items: VacantRentalItem[]) =>
        items.reduce((acc, item) => acc + item.marketRent, 0);

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-20">
            <div className="flex w-full overflow-x-auto pb-2 md:pb-0 mb-6 scrollbar-hide">
                <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Reports', path: '/dashboard/reports' }, { label: 'Vacant Rentals' }]} />
            </div>

            <div className="bg-[#E0E8E7] rounded-[2rem] p-8 min-h-[calc(100vh-100px)] relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/dashboard/reports')} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Vacant Rentals</h1>
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

                <p className="text-gray-600 text-sm mb-8 max-w-5xl leading-relaxed">
                    This report displays unoccupied units and their marketing statuses. It calculates the number of days each rental has been vacant, starting from the end date of the previous lease or, if no lease existed, from the unit's creation date. For rentals that are currently listed, it also shows how many days they have been on the market. <span className="text-gray-900 font-semibold cursor-pointer">Learn more</span>
                </p>

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
                        <p className="text-red-500 text-lg">Failed to load vacant rentals. Please try again.</p>
                    </div>
                )}

                {!isLoading && !error && (
                    <>
                        {Object.entries(groupedByProperty).map(([property, data]) => {
                            const isExpanded = expandedProperties.includes(property);
                            const total = calculateTotal(data.items);
                            return (
                                <div key={property} className="mb-8 bg-[#F0F0F6] rounded-[2rem] p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <button onClick={() => toggleProperty(property)} className="bg-[#3A6D6C] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                                            {property} ( {data.propertyType} | {data.propertyAddress} )
                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    {isExpanded && (
                                        <>
                                            <div className="hidden md:block bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm">
                                                <div className="text-white px-6 py-4 grid gap-4 items-center text-sm font-medium" style={{ gridTemplateColumns }}>
                                                    {activeColumns.map(col => (
                                                        <div key={col.id} className={col.hasSort ? "flex items-center gap-1 cursor-pointer" : ""}>
                                                            {col.label}
                                                            {col.hasSort && <ChevronUp className="w-3 h-3" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-b-[1.5rem] overflow-hidden">
                                                {data.items.map(item => (
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

                                                <div className="bg-gray-50">
                                                    <div className="hidden md:grid px-6 py-4 gap-4 items-center" style={{ gridTemplateColumns }}>
                                                        {activeColumns.map((col, index) => (
                                                            <div key={col.id} className={col.id === 'marketRent' || index === 0 ? "text-gray-800 font-bold" : ""}>
                                                                {index === 0 ? 'Total' : col.id === 'marketRent' ? formatCurrency(total) : null}
                                                            </div>
                                                        ))}
                                                    </div>
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
                                <p className="text-gray-500 text-lg">No data</p>
                            </div>
                        )}
                    </>
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

export default VacantRentals;
