import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, LayoutTemplate, X, Check, ChevronUp, ChevronLeft } from 'lucide-react';
import { downloadCsv } from '../../../../utils/downloadCsv';
import DashboardFilter from '../../components/DashboardFilter';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import type { FilterOption } from '../../components/DashboardFilter';
import { useRentRollReport } from '../../../../hooks/useReportsQueries';
import type { RentRollItem } from '../../../../services/reports.service';

const ALL_COLUMNS = [
    { id: 'tenant', label: 'Tenant', width: '1fr', hasSort: true },
    { id: 'unit', label: 'Unit', width: '0.6fr', hasSort: true },
    { id: 'leaseNumber', label: 'Lease number', width: '0.8fr', hasSort: true },
    { id: 'leaseDuration', label: 'Lease duration', width: '1.5fr', hasSort: false },
    { id: 'marketRent', label: 'Market rent', width: '1fr', hasSort: true },
    { id: 'depositsHeld', label: 'Deposits held', width: '1fr', hasSort: true },
    { id: 'rentalCharge', label: 'Rental charge', width: '1fr', hasSort: true },
    { id: 'balance', label: 'Balance', width: '1fr', hasSort: true },
] as const;

type ColumnId = typeof ALL_COLUMNS[number]['id'];

const RentRoll: React.FC = () => {
    const navigate = useNavigate();
    const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>(ALL_COLUMNS.map(c => c.id));
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

    const { data: apiData, isLoading, error } = useRentRollReport();
    const rentRollData: RentRollItem[] = apiData ?? [];

    // Filter State for DashboardFilter
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
        propertyUnits: [],
        occupancy: [],
        recurringTransaction: [],
        balance: []
    });

    // Filter Options for DashboardFilter
    const filterOptions: Record<string, FilterOption[]> = {
        propertyUnits: Array.from(new Set(rentRollData.map(r => r.property))).map(prop => ({ value: prop, label: prop })),
        occupancy: [
            { value: 'Occupied', label: 'Occupied' },
            { value: 'Vacant', label: 'Vacant' }
        ],
        recurringTransaction: [
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' }
        ],
        balance: [
            { value: 'positive', label: 'Positive Balance' },
            { value: 'zero', label: 'Zero Balance' },
            { value: 'negative', label: 'Negative Balance' }
        ]
    };

    const filterLabels: Record<string, string> = {
        propertyUnits: 'Property &Units',
        occupancy: 'Occupancy',
        recurringTransaction: 'Recurring Trasaction',
        balance: 'Balance'
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
        return rentRollData.filter(item => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    (item.tenant ?? '').toLowerCase().includes(query) ||
                    (item.property ?? '').toLowerCase().includes(query) ||
                    (item.leaseDuration ?? '').toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            // Property filter
            if (selectedFilters.propertyUnits.length > 0 && !selectedFilters.propertyUnits.includes(item.property)) {
                return false;
            }

            // Occupancy filter
            if (selectedFilters.occupancy.length > 0 && !selectedFilters.occupancy.includes(item.occupancy)) {
                return false;
            }

            // Recurring Transaction filter
            if (selectedFilters.recurringTransaction.length > 0 && !selectedFilters.recurringTransaction.includes(item.recurringTransaction)) {
                return false;
            }

            // Balance filter
            if (selectedFilters.balance.length > 0) {
                const hasPositive = selectedFilters.balance.includes('positive') && item.balance > 0;
                const hasZero = selectedFilters.balance.includes('zero') && item.balance === 0;
                const hasNegative = selectedFilters.balance.includes('negative') && item.balance < 0;
                if (!hasPositive && !hasZero && !hasNegative) return false;
            }

            return true;
        });
    }, [searchQuery, selectedFilters, rentRollData]);

    // Group items by property
    const groupedItems = useMemo(() => {
        const groups: Record<string, RentRollItem[]> = {};
        filteredItems.forEach(item => {
            const key = `${item.property}|${item.propertyType}|${item.propertyAddress}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
        });
        return groups;
    }, [filteredItems]);

    const activeColumns = ALL_COLUMNS.filter(col => visibleColumns.includes(col.id));
    const gridTemplateColumns = activeColumns.map(col => col.width).join(' ');

    const handleDownload = () => {
        const headers = activeColumns.map(col => col.label);
        const rows = filteredItems.map(item => activeColumns.map(col => item[col.id as keyof RentRollItem] ?? ''));
        downloadCsv('rent_roll', headers, rows);
    };

    const formatCurrency = (amount: number) => {
        return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const renderCellContent = (item: RentRollItem, columnId: ColumnId) => {
        switch (columnId) {
            case 'tenant':
                return <span className="text-[#4ad1a6] font-medium">{item.tenant}</span>;
            case 'unit':
                return <span className="text-gray-800">{item.unit}</span>;
            case 'leaseNumber':
                return <span className="text-[#65a30d] font-bold">{item.leaseNumber}</span>;
            case 'leaseDuration':
                return <span className="text-gray-700">{item.leaseDuration}</span>;
            case 'marketRent':
                return <span className="text-gray-800 font-medium">{formatCurrency(item.marketRent)}</span>;
            case 'depositsHeld':
                return <span className="text-gray-600">{formatCurrency(item.depositsHeld)}</span>;
            case 'rentalCharge':
                return <span className="text-gray-600">{formatCurrency(item.rentalCharge)}</span>;
            case 'balance':
                return <span className={`font-medium ${item.balance > 0 ? 'text-green-600' : item.balance < 0 ? 'text-red-600' : 'text-gray-600'}`}>{formatCurrency(item.balance)}</span>;
            default:
                return String(item[columnId as keyof RentRollItem] ?? '');
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-20">
            {/* Breadcrumb */}
            <div className="flex w-full overflow-x-auto pb-2 md:pb-0 mb-6 scrollbar-hide">
                <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Reports', path: '/dashboard/reports' }, { label: 'Rent Roll' }]} />
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
                        <h1 className="text-2xl font-bold text-gray-900">Rent Roll</h1>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setIsColumnModalOpen(true)}
                            className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-lg shadow-[#3A6D6C]/20 flex items-center gap-2"
                        >
                            <LayoutTemplate size={16} />
                            Columns
                        </button>
                        <button onClick={handleDownload} className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-lg shadow-[#3A6D6C]/20 flex items-center gap-2">
                            <Download size={16} />
                            Download Report
                        </button>
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-8 max-w-5xl leading-relaxed">
                    The report gives an overview of rental income, lease terms, tenant information, and provides the comparison of monthly earnings to the outstanding balance for each unit as of today's date. <span className="text-[#4ad1a6] font-semibold cursor-pointer">Learn more</span>
                </p>

                {/* Dashboard Style Filter Bar */}
                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={setSelectedFilters}
                    showMoreFilters={false}
                    showClearAll={true}
                    initialFilters={selectedFilters}
                />

                {isLoading && (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <p className="text-gray-500 text-lg">Loading...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <p className="text-red-500 text-lg">Failed to load rent roll data. Please try again.</p>
                    </div>
                )}

                {!isLoading && !error && (
                    <>
                        {/* Grouped Tables */}
                        {Object.entries(groupedItems).map(([key, items]) => {
                            const [property, propertyType, address] = key.split('|');
                            return (
                                <div key={key} className="mb-8">
                                    {/* Property Group Header */}
                                    <div className="mb-4 flex items-center">
                                        <div className="bg-[#3A6D6C] rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
                                            <span className="text-white font-semibold">{property}</span>
                                            <span className="text-white/70 text-sm">( {propertyType} | {address} )</span>
                                        </div>
                                    </div>

                                    {/* Table Header */}
                                    <div className="hidden md:block bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm">
                                        <div
                                            className="text-white px-6 py-4 grid gap-4 items-center text-sm font-medium"
                                            style={{ gridTemplateColumns }}
                                        >
                                            {activeColumns.map(col => (
                                                <div key={col.id} className={col.hasSort ? "flex items-center gap-1 cursor-pointer text-center" : "text-center"}>
                                                    {col.label}
                                                    {col.hasSort && <ChevronUp className="w-3 h-3" />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Table Body */}
                                    <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t-none">
                                        {items.map(item => (
                                            <div
                                                key={item.id}
                                                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                            >
                                                {/* Desktop View */}
                                                <div
                                                    className="hidden md:grid px-6 py-4 gap-4 items-center"
                                                    style={{ gridTemplateColumns }}
                                                >
                                                    {activeColumns.map(col => (
                                                        <div key={col.id} className="text-sm text-center">
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
                                    </div>
                                </div>
                            );
                        })}

                        {Object.keys(groupedItems).length === 0 && (
                            <div className="text-center py-12 bg-white rounded-2xl">
                                <p className="text-gray-500 text-lg">No data</p>
                            </div>
                        )}
                    </>
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

export default RentRoll;
