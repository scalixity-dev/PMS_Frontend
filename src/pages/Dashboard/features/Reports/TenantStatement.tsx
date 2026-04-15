import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, LayoutTemplate, X, Check, ChevronUp, ChevronDown, ChevronLeft } from 'lucide-react';
import DashboardFilter from '../../components/DashboardFilter';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import type { FilterOption } from '../../components/DashboardFilter';
import { useTenantStatementReport } from '../../../../hooks/useReportsQueries';
import type { TenantStatementItem } from '../../../../services/reports.service';

const ALL_COLUMNS = [
    { id: 'dateDue', label: 'Date due', width: '1fr', hasSort: true },
    { id: 'datePaid', label: 'Date paid', width: '1fr', hasSort: true },
    { id: 'category', label: 'Category', width: '1fr', hasSort: true },
    { id: 'subCategory', label: 'Sub-category', width: '1fr', hasSort: false },
    { id: 'invoicingType', label: 'Invoicing type', width: '1fr', hasSort: false },
    { id: 'amountDue', label: 'Amount due', width: '1fr', hasSort: true },
    { id: 'amountPaid', label: 'Amount paid', width: '1fr', hasSort: true },
] as const;

type ColumnId = typeof ALL_COLUMNS[number]['id'];

const TenantStatement: React.FC = () => {
    const navigate = useNavigate();
    const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>(ALL_COLUMNS.map(c => c.id));
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
    const [expandedTenants, setExpandedTenants] = useState<string[]>([]);

    const [tenantId, setTenantId] = useState<string | undefined>(undefined);
    const [startDate, setStartDate] = useState<string | undefined>(undefined);
    const [endDate, setEndDate] = useState<string | undefined>(undefined);

    const { data: apiData, isLoading, error } = useTenantStatementReport({ tenantId, startDate, endDate });
    const statementData: TenantStatementItem[] = apiData ?? [];

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
        date: [],
        leaseStatus: [],
        tenant: [],
        tenantsBalance: [],
        group: []
    });

    const filterOptions: Record<string, FilterOption[]> = {
        date: [
            { value: 'today', label: 'Today' },
            { value: 'this_week', label: 'This Week' },
            { value: 'this_month', label: 'This Month' },
            { value: 'last_month', label: 'Last Month' }
        ],
        leaseStatus: [
            { value: 'Active', label: 'Active' },
            { value: 'Pending', label: 'Pending' },
            { value: 'Expired', label: 'Expired' }
        ],
        tenant: Array.from(new Set(statementData.map(r => r.tenant))).map(t => ({ value: t, label: t })),
        tenantsBalance: [
            { value: 'positive', label: 'Positive Balance' },
            { value: 'zero', label: 'Zero Balance' },
            { value: 'negative', label: 'Negative Balance' }
        ],
        group: [
            { value: 'property', label: 'By Property' },
            { value: 'category', label: 'By Category' }
        ]
    };

    const filterLabels: Record<string, string> = {
        date: 'Date',
        leaseStatus: 'Lease Status',
        tenant: 'Tenant',
        tenantsBalance: 'Tenants Balance',
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

    const toggleTenant = (tenant: string) => {
        setExpandedTenants(prev =>
            prev.includes(tenant) ? prev.filter(t => t !== tenant) : [...prev, tenant]
        );
    };

    const filteredItems = useMemo(() => {
        return statementData.filter(item => {
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    item.tenant.toLowerCase().includes(query) ||
                    item.category.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }
            if (selectedFilters.tenant.length > 0 && !selectedFilters.tenant.includes(item.tenant)) {
                return false;
            }
            return true;
        });
    }, [searchQuery, selectedFilters, statementData]);

    const groupedByTenant = useMemo(() => {
        const tenants: Record<string, { incomeTypes: Record<string, TenantStatementItem[]>, depositsHeld: number, creditsBalance: number }> = {};
        filteredItems.forEach(item => {
            if (!tenants[item.tenant]) {
                tenants[item.tenant] = { incomeTypes: {}, depositsHeld: 0, creditsBalance: 0 };
            }
            if (!tenants[item.tenant].incomeTypes[item.incomeType]) {
                tenants[item.tenant].incomeTypes[item.incomeType] = [];
            }
            tenants[item.tenant].incomeTypes[item.incomeType].push(item);
        });
        return tenants;
    }, [filteredItems]);

    // Auto-expand all tenants when data loads
    useMemo(() => {
        const keys = Object.keys(groupedByTenant);
        if (keys.length > 0 && expandedTenants.length === 0) {
            setExpandedTenants(keys);
        }
    }, [groupedByTenant]);

    const activeColumns = ALL_COLUMNS.filter(col => visibleColumns.includes(col.id));
    const gridTemplateColumns = activeColumns.map(col => col.width).join(' ');

    const formatCurrency = (amount: number) => {
        return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const renderCellContent = (item: TenantStatementItem, columnId: ColumnId) => {
        switch (columnId) {
            case 'dateDue': return <span className="text-[#4ad1a6]">{item.dateDue}</span>;
            case 'datePaid': return <span className="text-gray-600">{item.datePaid}</span>;
            case 'category': return <span className="text-[#4ad1a6]">{item.category}</span>;
            case 'subCategory': return <span className="text-gray-600">{item.subCategory}</span>;
            case 'invoicingType': return <span className="text-gray-700">{item.invoicingType}</span>;
            case 'amountDue': return <span className="text-gray-800">{formatCurrency(item.amountDue)}</span>;
            case 'amountPaid': return <span className="text-gray-600">{formatCurrency(item.amountPaid)}</span>;
            default: return String(item[columnId as keyof TenantStatementItem] ?? '');
        }
    };

    const calculateTotals = (items: TenantStatementItem[]) =>
        items.reduce((acc, item) => ({ amountDue: acc.amountDue + item.amountDue, amountPaid: acc.amountPaid + item.amountPaid }), { amountDue: 0, amountPaid: 0 });

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-20">
            <div className="flex w-full overflow-x-auto pb-2 md:pb-0 mb-6 scrollbar-hide">
                <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Reports', path: '/dashboard/reports' }, { label: 'Tenant Statement' }]} />
            </div>

            <div className="bg-[#E0E8E7] rounded-[2rem] p-8 min-h-[calc(100vh-100px)] relative">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/dashboard/reports')} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Tenant Statement</h1>
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
                    The report provides an overview of a tenant's financial activity, including all property-related and general income, such as paid, partially paid, pending, and unpaid invoices, as well as deposits and credits held. The accounting type is accrual. <span className="text-gray-900 font-semibold cursor-pointer">Learn more</span>
                </p>

                <div className="flex flex-wrap gap-4 mb-4">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                        Tenant ID:
                        <input type="text" value={tenantId ?? ''} onChange={e => setTenantId(e.target.value || undefined)} placeholder="Filter by tenant" className="border border-gray-300 rounded px-2 py-1 text-sm" />
                    </label>
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
                        <p className="text-red-500 text-lg">Failed to load tenant statement. Please try again.</p>
                    </div>
                )}

                {!isLoading && !error && (
                    <>
                        {Object.entries(groupedByTenant).map(([tenant, data]) => {
                            const isExpanded = expandedTenants.includes(tenant);
                            const allItems = Object.values(data.incomeTypes).flat();
                            const totals = calculateTotals(allItems);

                            return (
                                <div key={tenant} className="mb-8 bg-[#F0F0F6] rounded-[2rem] p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <button onClick={() => toggleTenant(tenant)} className="bg-[#3A6D6C] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                                            {tenant}
                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                    </div>

                                    {isExpanded && (
                                        <>
                                            {Object.entries(data.incomeTypes).map(([incomeType, items]) => (
                                                <div key={incomeType} className="mb-6">
                                                    <div className="mb-4">
                                                        <span className="bg-[#7CD947] text-white px-4 py-1.5 rounded-full text-sm font-medium">{incomeType}</span>
                                                    </div>
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
                                                        {items.map(item => (
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
                                                    </div>
                                                </div>
                                            ))}

                                            <div className="bg-white rounded-2xl p-4 mt-4">
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
                                                    <span className="text-gray-800 font-bold">Total</span>
                                                    <div className="flex gap-4 md:gap-8 w-full md:w-auto justify-between md:justify-end">
                                                        <span className="text-gray-800 font-medium">{formatCurrency(totals.amountDue)}</span>
                                                        <span className="text-gray-600">{formatCurrency(totals.amountPaid)}</span>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <div>Deposits held ₹0.00</div>
                                                    <div>Credits balance ₹0.00</div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}

                        {Object.keys(groupedByTenant).length === 0 && (
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

export default TenantStatement;
