import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, LayoutTemplate, X, Check, ChevronUp, ChevronLeft } from 'lucide-react';
import DashboardFilter from '../../components/DashboardFilter';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import type { FilterOption } from '../../components/DashboardFilter';

interface RentersInsuranceItem {
    id: string;
    tenant: string;
    property: string;
    propertyType: string;
    propertyAddress: string;
    unit: string;
    insuranceStatus: string;
    effectiveDate: string;
    expirationDate: string;
    policy: string;
}

const ALL_COLUMNS = [
    { id: 'tenant', label: 'Tenant', width: '1.5fr', hasSort: true },
    { id: 'unit', label: 'Unit', width: '0.8fr', hasSort: true },
    { id: 'insuranceStatus', label: 'Insurance status', width: '1fr', hasSort: true },
    { id: 'effectiveDate', label: 'Effective date', width: '1fr', hasSort: true },
    { id: 'expirationDate', label: 'Expiration date', width: '1fr', hasSort: true },
    { id: 'policy', label: 'Policy', width: '0.8fr', hasSort: false },
] as const;

type ColumnId = typeof ALL_COLUMNS[number]['id'];

// Mock Data grouped by property
const MOCK_INSURANCE_DATA: RentersInsuranceItem[] = [
    {
        id: '1',
        tenant: 'Atul rawat',
        property: 'abc',
        propertyType: 'Single-family',
        propertyAddress: '78 Scheme No 78 - II, Indore, MP, 452010, IN',
        unit: '—',
        insuranceStatus: '—',
        effectiveDate: '—',
        expirationDate: '—',
        policy: '—'
    },
    {
        id: '2',
        tenant: 'jay rai',
        property: 'abc',
        propertyType: 'Single-family',
        propertyAddress: '78 Scheme No 78 - II, Indore, MP, 452010, IN',
        unit: '—',
        insuranceStatus: '—',
        effectiveDate: '—',
        expirationDate: '—',
        policy: '—'
    },
    {
        id: '3',
        tenant: 'jay rai',
        property: 'abc',
        propertyType: 'Single-family',
        propertyAddress: '78 Scheme No 78 - II, Indore, MP, 452010, IN',
        unit: '—',
        insuranceStatus: '—',
        effectiveDate: '—',
        expirationDate: '—',
        policy: '—'
    },
    {
        id: '4',
        tenant: 'jay rai',
        property: 'abc',
        propertyType: 'Single-family',
        propertyAddress: '78 Scheme No 78 - II, Indore, MP, 452010, IN',
        unit: '—',
        insuranceStatus: '—',
        effectiveDate: '—',
        expirationDate: '—',
        policy: '—'
    },
    {
        id: '5',
        tenant: 'Atul rawat',
        property: 'abc',
        propertyType: 'Single-family',
        propertyAddress: '78 Scheme No 78 - II, Indore, MP, 452010, IN',
        unit: '—',
        insuranceStatus: '—',
        effectiveDate: '—',
        expirationDate: '—',
        policy: '—'
    },
    {
        id: '6',
        tenant: 'Atul rawat',
        property: 'abc',
        propertyType: 'Single-family',
        propertyAddress: '78 Scheme No 78 - II, Indore, MP, 452010, IN',
        unit: '—',
        insuranceStatus: '—',
        effectiveDate: '—',
        expirationDate: '—',
        policy: '—'
    },
    {
        id: '7',
        tenant: 'Atul rawat',
        property: 'abc',
        propertyType: 'Single-family',
        propertyAddress: '78 Scheme No 78 - II, Indore, MP, 452010, IN',
        unit: '—',
        insuranceStatus: '—',
        effectiveDate: '—',
        expirationDate: '—',
        policy: '—'
    },
    {
        id: '8',
        tenant: 'Atul rawat',
        property: 'abc',
        propertyType: '2 Units',
        propertyAddress: 'Delhi Safdarjung Railway Station Rd, New Delhi, DL, 455654, IN',
        unit: '1',
        insuranceStatus: '—',
        effectiveDate: '—',
        expirationDate: '—',
        policy: '—'
    }
];

const RentersInsurance: React.FC = () => {
    const navigate = useNavigate();
    const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>(ALL_COLUMNS.map(c => c.id));
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

    // Filter State for DashboardFilter
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
        propertyUnits: [],
        leaseStatus: [],
        tenant: [],
        insuranceStatus: [],
        insuranceExpiration: []
    });

    // Filter Options for DashboardFilter
    const filterOptions: Record<string, FilterOption[]> = {
        propertyUnits: Array.from(new Set(MOCK_INSURANCE_DATA.map(r => r.property))).map(prop => ({ value: prop, label: prop })),
        leaseStatus: [
            { value: 'Active', label: 'Active' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Expired', label: 'Expired' }
        ],
        tenant: Array.from(new Set(MOCK_INSURANCE_DATA.map(r => r.tenant))).map(t => ({ value: t, label: t })),
        insuranceStatus: [
            { value: 'Valid', label: 'Valid' },
            { value: 'Expired', label: 'Expired' },
            { value: 'Not Provided', label: 'Not Provided' }
        ],
        insuranceExpiration: [
            { value: 'expiring_30', label: 'Expiring in 30 days' },
            { value: 'expiring_60', label: 'Expiring in 60 days' },
            { value: 'expiring_90', label: 'Expiring in 90 days' },
            { value: 'expired', label: 'Already Expired' }
        ]
    };

    const filterLabels: Record<string, string> = {
        propertyUnits: 'Property &Units',
        leaseStatus: 'Lease Status',
        tenant: 'Tenant',
        insuranceStatus: 'Insurance Status',
        insuranceExpiration: 'Insurance Expiration'
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
        return MOCK_INSURANCE_DATA.filter(item => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    item.tenant.toLowerCase().includes(query) ||
                    item.property.toLowerCase().includes(query) ||
                    item.policy.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            // Property filter
            if (selectedFilters.propertyUnits.length > 0 && !selectedFilters.propertyUnits.includes(item.property)) {
                return false;
            }

            // Tenant filter
            if (selectedFilters.tenant.length > 0 && !selectedFilters.tenant.includes(item.tenant)) {
                return false;
            }

            return true;
        });
    }, [searchQuery, selectedFilters]);

    // Group items by property
    const groupedItems = useMemo(() => {
        const groups: Record<string, RentersInsuranceItem[]> = {};
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

    const renderCellContent = (item: RentersInsuranceItem, columnId: ColumnId) => {
        switch (columnId) {
            case 'tenant':
                return <span className="text-[#4ad1a6] font-medium">{item.tenant}</span>;
            case 'unit':
                return <span className="text-gray-800">{item.unit}</span>;
            case 'insuranceStatus':
                return <span className="text-gray-700">{item.insuranceStatus}</span>;
            case 'effectiveDate':
                return <span className="text-gray-600">{item.effectiveDate}</span>;
            case 'expirationDate':
                return <span className="text-gray-600">{item.expirationDate}</span>;
            case 'policy':
                return <span className="text-gray-700">{item.policy}</span>;
            default:
                return item[columnId as keyof RentersInsuranceItem];
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-20">
            {/* Breadcrumb */}
            <div className="flex w-full overflow-x-auto pb-2 md:pb-0 mb-6 scrollbar-hide">
                <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Reports', path: '/dashboard/reports' }, { label: 'Renters Insurance' }]} />
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
                        <h1 className="text-2xl font-bold text-gray-900">Renters Insurance</h1>
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
                    The report displays renters insurance information provided by tenants in their lease, as well as policies manually added by the landlord in the tenant's profile. It includes tenant contact details, insurance status, effective and expiration dates, and whether proof of insurance was submitted after being required by the landlord. <span className="text-gray-900 font-semibold cursor-pointer">Learn more</span>
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
                                        <div key={col.id} className={col.hasSort ? "flex items-center gap-1 cursor-pointer" : ""}>
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
                            </div>
                        </div>
                    );
                })}

                {Object.keys(groupedItems).length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <p className="text-gray-500 text-lg">No renters insurance data found matching your filters</p>
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

export default RentersInsurance;
