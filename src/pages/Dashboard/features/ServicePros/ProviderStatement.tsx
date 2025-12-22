import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronUp, Plus, X, Check, Loader2 } from 'lucide-react';

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

    // Filter State
    const [openFilter, setOpenFilter] = useState<string | null>(null);
    const [activeFilters, setActiveFilters] = useState({
        date: { start: '', end: '' },
        categories: null as string | null,
        subCategories: null as string | null,
        servicePros: [] as string[],
        groups: [] as string[]
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

    // Derived Data for Filters
    const uniqueCategories = Array.from(new Set(statements.map(s => s.category)));
    const uniqueSubCategories = Array.from(new Set(
        statements
            .filter(s => activeFilters.categories === null || s.category === activeFilters.categories)
            .map(s => s.subCategory)
    ));
    const uniqueServicePros = Array.from(new Set(statements.map(s => s.servicePro)));
    const uniqueGroups = Array.from(new Set(statements.map(s => s.group)));

    // Filter Logic
    const parseDate = (dateStr: string) => {
        if (!dateStr || dateStr === '-') return null;
        return new Date(dateStr);
    };

    const filteredStatements = statements.filter(item => {
        // Date Filter
        if (activeFilters.date.start) {
            const itemDate = parseDate(item.dateDue);
            const startDate = new Date(activeFilters.date.start);
            if (!itemDate || itemDate < startDate) return false;
        }
        if (activeFilters.date.end) {
            const itemDate = parseDate(item.dateDue);
            const endDate = new Date(activeFilters.date.end);
            if (!itemDate || itemDate > endDate) return false;
        }

        // Category Filter
        if (activeFilters.categories && item.category !== activeFilters.categories) {
            return false;
        }

        // Sub-category Filter
        if (activeFilters.subCategories && item.subCategory !== activeFilters.subCategories) {
            return false;
        }

        // Service Pro Filter
        if (activeFilters.servicePros.length > 0 && !activeFilters.servicePros.includes(item.servicePro)) {
            return false;
        }

        // Group Filter
        if (activeFilters.groups.length > 0 && !activeFilters.groups.includes(item.group)) {
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

    const toggleFilter = (type: 'categories' | 'subCategories' | 'servicePros' | 'groups', value: string) => {
        setActiveFilters(prev => {
            if (type === 'categories') {
                // If same category clicked, clear it and subcategory. Else set new category and clear subcategory
                const newValue = prev.categories === value ? null : value;
                return { ...prev, categories: newValue, subCategories: null };
            }
            if (type === 'subCategories') {
                const newValue = prev.subCategories === value ? null : value;
                return { ...prev, subCategories: newValue };
            }

            // For other array-based filters (servicePros, groups)
            const current = prev[type as 'servicePros' | 'groups'];
            const next = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [type]: next };
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
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E5E5] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Reports</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Statement</span>
            </div>

            <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-[2rem]">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">Provider Statement</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsColumnModalOpen(true)}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors"
                        >
                            Column
                        </button>
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
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
                <div className="bg-[#3A6D6C] p-4 rounded-[2rem] flex flex-wrap items-center gap-4 mb-8 shadow-md">
                    {/* Date Filter */}
                    <div className="relative">
                        <div
                            onClick={() => setOpenFilter(openFilter === 'date' ? null : 'date')}
                            className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium cursor-pointer ${openFilter === 'date' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Date <Plus className={`w-4 h-4 transition-transform ${openFilter === 'date' ? 'rotate-45' : ''}`} />
                        </div>
                        {openFilter === 'date' && (
                            <div className="absolute top-full mt-2 left-0 bg-white p-4 rounded-xl shadow-xl z-20 w-72 border border-gray-100">
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 mb-1 block">Start Date</label>
                                        <input
                                            type="date"
                                            value={activeFilters.date.start}
                                            onChange={(e) => setActiveFilters(prev => ({ ...prev, date: { ...prev.date, start: e.target.value } }))}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A6D6C]"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500 mb-1 block">End Date</label>
                                        <input
                                            type="date"
                                            value={activeFilters.date.end}
                                            onChange={(e) => setActiveFilters(prev => ({ ...prev, date: { ...prev.date, end: e.target.value } }))}
                                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#3A6D6C]"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setOpenFilter(null)}
                                        className="w-full bg-[#3A6D6C] text-white py-2 rounded-lg text-sm font-medium mt-2"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <div
                            onClick={() => setOpenFilter(openFilter === 'category' ? null : 'category')}
                            className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium cursor-pointer ${openFilter === 'category' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Category <Plus className={`w-4 h-4 transition-transform ${openFilter === 'category' ? 'rotate-45' : ''}`} />
                        </div>
                        {openFilter === 'category' && (
                            <div className="absolute top-full mt-2 left-0 bg-white p-2 rounded-xl shadow-xl z-20 w-64 border border-gray-100 max-h-60 overflow-y-auto">
                                {uniqueCategories.map(cat => (
                                    <label key={cat} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${activeFilters.categories === cat ? 'border-[#3A6D6C]' : 'border-gray-300'}`}>
                                            {activeFilters.categories === cat && <div className="w-2 h-2 rounded-full bg-[#3A6D6C]" />}
                                        </div>
                                        <span className="text-sm text-gray-700">{cat}</span>
                                        <input
                                            type="radio"
                                            name="category_filter"
                                            className="hidden"
                                            checked={activeFilters.categories === cat}
                                            onChange={() => toggleFilter('categories', cat)}
                                        />
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sub-category Filter */}
                    <div className="relative">
                        <div
                            onClick={() => setOpenFilter(openFilter === 'subCategory' ? null : 'subCategory')}
                            className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium cursor-pointer ${openFilter === 'subCategory' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Sub-category <Plus className={`w-4 h-4 transition-transform ${openFilter === 'subCategory' ? 'rotate-45' : ''}`} />
                        </div>
                        {openFilter === 'subCategory' && (
                            <div className="absolute top-full mt-2 left-0 bg-white p-2 rounded-xl shadow-xl z-20 w-64 border border-gray-100 max-h-60 overflow-y-auto">
                                {uniqueSubCategories.length > 0 ? (
                                    uniqueSubCategories.map(sub => (
                                        <label key={sub} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${activeFilters.subCategories === sub ? 'border-[#3A6D6C]' : 'border-gray-300'}`}>
                                                {activeFilters.subCategories === sub && <div className="w-2 h-2 rounded-full bg-[#3A6D6C]" />}
                                            </div>
                                            <span className="text-sm text-gray-700">{sub}</span>
                                            <input
                                                type="radio"
                                                name="subcategory_filter"
                                                className="hidden"
                                                checked={activeFilters.subCategories === sub}
                                                onChange={() => toggleFilter('subCategories', sub)}
                                            />
                                        </label>
                                    ))
                                ) : (
                                    <div className="p-2 text-sm text-gray-500 text-center">Select a category first</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Service Pro Filter */}
                    <div className="relative">
                        <div
                            onClick={() => setOpenFilter(openFilter === 'servicePro' ? null : 'servicePro')}
                            className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium cursor-pointer ${openFilter === 'servicePro' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Service Pro <Plus className={`w-4 h-4 transition-transform ${openFilter === 'servicePro' ? 'rotate-45' : ''}`} />
                        </div>
                        {openFilter === 'servicePro' && (
                            <div className="absolute top-full mt-2 left-0 bg-white p-2 rounded-xl shadow-xl z-20 w-64 border border-gray-100 max-h-60 overflow-y-auto">
                                {uniqueServicePros.map(pro => (
                                    <label key={pro} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${activeFilters.servicePros.includes(pro) ? 'bg-[#3A6D6C] border-[#3A6D6C]' : 'border-gray-300'}`}>
                                            {activeFilters.servicePros.includes(pro) && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className="text-sm text-gray-700">{pro}</span>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={activeFilters.servicePros.includes(pro)}
                                            onChange={() => toggleFilter('servicePros', pro)}
                                        />
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Group Filter */}
                    <div className="relative">
                        <div
                            onClick={() => setOpenFilter(openFilter === 'group' ? null : 'group')}
                            className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium cursor-pointer ${openFilter === 'group' ? 'bg-gray-100 text-gray-900' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Group <Plus className={`w-4 h-4 transition-transform ${openFilter === 'group' ? 'rotate-45' : ''}`} />
                        </div>
                        {openFilter === 'group' && (
                            <div className="absolute top-full mt-2 left-0 bg-white p-2 rounded-xl shadow-xl z-20 w-64 border border-gray-100 max-h-60 overflow-y-auto">
                                {uniqueGroups.map(grp => (
                                    <label key={grp} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${activeFilters.groups.includes(grp) ? 'bg-[#3A6D6C] border-[#3A6D6C]' : 'border-gray-300'}`}>
                                            {activeFilters.groups.includes(grp) && <Check className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className="text-sm text-gray-700">{grp}</span>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={activeFilters.groups.includes(grp)}
                                            onChange={() => toggleFilter('groups', grp)}
                                        />
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
                        Save Filters
                    </div>
                    <div
                        onClick={() => setActiveFilters({ date: { start: '', end: '' }, categories: null, subCategories: null, servicePros: [], groups: [] })}
                        className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                    >
                        Clear All
                    </div>
                </div>

                {/* Table Container */}
                <div>
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
                    <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t-none">
                        {filteredStatements.length > 0 ? (
                            filteredStatements.map(item => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl px-6 py-4 grid gap-4 items-center shadow-sm hover:shadow-md transition-shadow"
                                    style={{ gridTemplateColumns }}
                                >
                                    {activeColumns.map(col => (
                                        <div key={col.id} className="text-sm">
                                            {renderCellContent(item, col.id)}
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
