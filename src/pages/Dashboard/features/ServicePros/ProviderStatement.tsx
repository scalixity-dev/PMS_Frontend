import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronUp, X, Check, Loader2 } from 'lucide-react';
import DashboardFilter from '../../components/DashboardFilter';
import type { FilterOption } from '../../components/DashboardFilter';

interface StatementItem {
    id: number;
    property: string;
    unit: string;
    category: string;
    subCategory: string;
    dateDue: string;
    datePaid: string;
    amountDue: number;
    amountPaid: number;
    details: string;
    servicePro: string;
    group: string;
}

const ALL_COLUMNS = [
    { id: 'property', label: 'Property', width: '1.5fr', hasSort: true },
    { id: 'unit', label: 'Unit', width: '1fr', hasSort: false },
    { id: 'category', label: 'Category', width: '1.5fr', hasSort: false },
    { id: 'subCategory', label: 'Sub-category', width: '1.5fr', hasSort: false },
    { id: 'dateDue', label: 'Date due', width: '1.5fr', hasSort: true },
    { id: 'datePaid', label: 'Date paid', width: '1.5fr', hasSort: true },
    { id: 'amountDue', label: 'Amount due', width: '1.5fr', hasSort: false },
    { id: 'amountPaid', label: 'Amount paid', width: '1.5fr', hasSort: false },
    { id: 'details', label: 'Details', width: '1fr', hasSort: false },
] as const;

type ColumnId = typeof ALL_COLUMNS[number]['id'];

const ProviderStatement = () => {
    const navigate = useNavigate();
    const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>(ALL_COLUMNS.map(c => c.id));
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    // Filter State for DashboardFilter
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
        category: [],
        subCategory: [],
        servicePro: [],
        group: []
    });

    // Mock Data
    const statements: StatementItem[] = [
        {
            id: 1,
            property: 'Sunset Apartments',
            unit: '101',
            category: 'Maintenance',
            subCategory: 'Plumbing',
            dateDue: '01 Dec 2024',
            datePaid: '05 Dec 2024',
            amountDue: 1500,
            amountPaid: 1500,
            details: 'Leak repair',
            servicePro: 'Mike Ross',
            group: 'North Zone'
        },
        {
            id: 2,
            property: 'Green Valley',
            unit: 'B2',
            category: 'Repairs',
            subCategory: 'Electrical',
            dateDue: '10 Dec 2024',
            datePaid: '-',
            amountDue: 800,
            amountPaid: 0,
            details: 'Switch replacement',
            servicePro: 'Rachel Zane',
            group: 'South Zone'
        },
        {
            id: 3,
            property: 'City Center',
            unit: 'Penthouse',
            category: 'Services',
            subCategory: 'Cleaning',
            dateDue: '15 Dec 2024',
            datePaid: '15 Dec 2024',
            amountDue: 2000,
            amountPaid: 2000,
            details: 'Deep cleaning',
            servicePro: 'Harvey Specter',
            group: 'Central Zone'
        }
    ];

    // Filter Options for DashboardFilter
    const filterOptions: Record<string, FilterOption[]> = {
        category: Array.from(new Set(statements.map(s => s.category))).map(cat => ({ value: cat, label: cat })),
        subCategory: Array.from(new Set(statements.map(s => s.subCategory))).map(sub => ({ value: sub, label: sub })),
        servicePro: Array.from(new Set(statements.map(s => s.servicePro))).map(pro => ({ value: pro, label: pro })),
        group: Array.from(new Set(statements.map(s => s.group))).map(grp => ({ value: grp, label: grp }))
    };

    const filterLabels: Record<string, string> = {
        category: 'Category',
        subCategory: 'Sub-category',
        servicePro: 'Service Pro',
        group: 'Group'
    };

    // Filter Logic
    const filteredStatements = statements.filter(item => {
        // Search Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchesSearch =
                item.property.toLowerCase().includes(query) ||
                item.unit.toLowerCase().includes(query) ||
                item.details.toLowerCase().includes(query) ||
                item.servicePro.toLowerCase().includes(query);
            if (!matchesSearch) return false;
        }

        // Category Filter
        if (selectedFilters.category.length > 0 && !selectedFilters.category.includes(item.category)) {
            return false;
        }

        // Sub-category Filter
        if (selectedFilters.subCategory.length > 0 && !selectedFilters.subCategory.includes(item.subCategory)) {
            return false;
        }

        // Service Pro Filter
        if (selectedFilters.servicePro.length > 0 && !selectedFilters.servicePro.includes(item.servicePro)) {
            return false;
        }

        // Group Filter
        if (selectedFilters.group.length > 0 && !selectedFilters.group.includes(item.group)) {
            return false;
        }

        return true;
    });

    const handleDownload = async () => {
        setIsDownloading(true);

        // Simulate preparation delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Define headers
        const headers = ['Property', 'Unit', 'Category', 'Sub-category', 'Date due', 'Date paid', 'Amount due', 'Amount paid', 'Details'];

        const escapeCsvField = (field: any): string => {
            if (field === null || field === undefined) {
                return '';
            }
            const stringValue = String(field);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
        };

        // Convert data to CSV format
        const csvContent = [
            headers.join(','),
            ...filteredStatements.map(item => [
                escapeCsvField(item.property),
                escapeCsvField(item.unit),
                escapeCsvField(item.category),
                escapeCsvField(item.subCategory),
                escapeCsvField(item.dateDue),
                escapeCsvField(item.datePaid),
                escapeCsvField(item.amountDue),
                escapeCsvField(item.amountPaid),
                escapeCsvField(item.details)
            ].join(','))
        ].join('\n');

        // Create blob and download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'provider_statement.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Revoke the object URL to free up memory
            URL.revokeObjectURL(url);
        }

        setIsDownloading(false);
    };

    const toggleColumn = (columnId: ColumnId) => {
        setVisibleColumns(prev => {
            if (prev.includes(columnId)) {
                return prev.filter(id => id !== columnId);
            } else {
                // Maintain order
                const newSet = new Set([...prev, columnId]);
                return ALL_COLUMNS.filter(col => newSet.has(col.id)).map(col => col.id);
            }
        });
    };



    const activeColumns = ALL_COLUMNS.filter(col => visibleColumns.includes(col.id));
    const gridTemplateColumns = activeColumns.map(col => col.width).join(' ');

    const renderCellContent = (item: StatementItem, columnId: ColumnId) => {
        switch (columnId) {
            case 'amountDue':
            case 'amountPaid':
                return `₹${item[columnId].toLocaleString()}`;
            case 'details':
                return <span className="text-blue-600 hover:underline cursor-pointer">{item[columnId]}</span>;
            case 'unit':
            case 'category':
            case 'subCategory':
            case 'dateDue':
            case 'datePaid':
                return <span className="text-gray-600">{item[columnId]}</span>;
            case 'property':
                return <span className="text-gray-900 font-medium">{item[columnId]}</span>;
            default:
                return item[columnId as keyof StatementItem];
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            <div className="flex w-full overflow-x-auto pb-2 md:pb-0 mb-6 scrollbar-hide">
                <div className="inline-flex items-center px-4 py-2 bg-[#E0E5E5] rounded-full shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)] whitespace-nowrap">
                    <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                    <span className="text-gray-500 text-sm mx-1">/</span>
                    <span className="text-gray-600 text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/reports')}>Reports</span>
                    <span className="text-gray-500 text-sm mx-1">/</span>
                    <span className="text-gray-600 text-sm font-semibold">Statement</span>
                </div>
            </div>

            <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-[2rem]">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">Provider Statement</h1>
                    </div>
                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setIsColumnModalOpen(true)}
                            className="flex-1 md:flex-none px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors"
                        >
                            Column
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="flex-1 md:flex-none px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isDownloading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Downloading...
                                </>
                            ) : (
                                'Download Reports'
                            )}
                        </button>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-[#E8F5E9] p-4 rounded-xl mb-6 shadow-sm border border-[#E8F5E9]">
                    <p className="text-sm text-gray-700">
                        The report displays payments related to a Service Pro, including all paid, unpaid, pending, and partially paid bills. It displays both general and property-specific transactions, with the default accounting type set to accrual. <span className="text-green-700 font-semibold cursor-pointer hover:underline">Learn more</span>
                    </p>
                </div>

                {/* Filters */}
                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={setSelectedFilters}
                    showMoreFilters={false}
                    showClearAll={true}
                    initialFilters={selectedFilters}
                />

                {/* Table Container */}
                <div>
                    {/* Table Header */}
                    <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm hidden md:block">
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
                        {filteredStatements.length > 0 ? (
                            filteredStatements.map(item => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl px-6 py-4 flex flex-col md:grid gap-4 md:items-center shadow-sm hover:shadow-md transition-shadow"
                                    style={{
                                        // On mobile (flex), gridTemplateColumns is ignored. On desktop (grid), it applies.
                                        gridTemplateColumns
                                    }}
                                >
                                    {activeColumns.map(col => (
                                        <div key={col.id} className="flex justify-between md:block text-sm border-b md:border-none border-gray-100 pb-2 md:pb-0 last:border-0 last:pb-0">
                                            <span className="md:hidden font-semibold text-gray-500 mb-1">{col.label}</span>
                                            <div className="text-right md:text-left">
                                                {renderCellContent(item, col.id)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500">No records found matching your filters.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Column Selection Modal */}
            {isColumnModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-72 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[var(--color-primary)]">
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

export default ProviderStatement;
