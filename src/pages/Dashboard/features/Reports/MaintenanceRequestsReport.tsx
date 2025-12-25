import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, LayoutTemplate, X, Check, ChevronUp } from 'lucide-react';
import DashboardFilter from '../../components/DashboardFilter';
import type { FilterOption } from '../../components/DashboardFilter';

interface MaintenanceRequest {
    id: string;
    requestNumber: string;
    tenant: string;
    assignee: string;
    status: string;
    priority: string;
    title: string;
    dateDue: string;
    endedWork: string;
    property: string;
    propertyType: string;
    propertyAddress: string;
}

const ALL_COLUMNS = [
    { id: 'requestNumber', label: 'Request number', width: '1fr', hasSort: true },
    { id: 'tenant', label: 'Tenant', width: '1fr', hasSort: true },
    { id: 'assignee', label: 'Assignee', width: '1fr', hasSort: true },
    { id: 'status', label: 'Status', width: '0.7fr', hasSort: true },
    { id: 'priority', label: 'Priority', width: '0.8fr', hasSort: true },
    { id: 'title', label: 'Title', width: '1.3fr', hasSort: false },
    { id: 'dateDue', label: 'Date due', width: '0.8fr', hasSort: true },
    { id: 'endedWork', label: 'Ended work', width: '0.8fr', hasSort: true },
] as const;

type ColumnId = typeof ALL_COLUMNS[number]['id'];

// Mock Data grouped by property
const MOCK_REQUESTS: MaintenanceRequest[] = [
    {
        id: '1',
        requestNumber: '1318707',
        tenant: 'Atul rawat',
        assignee: 'XYZ',
        status: 'New',
        priority: 'Normal',
        title: 'Appliances / Heating & Cooling',
        dateDue: '---',
        endedWork: '---',
        property: 'Ak Appartment',
        propertyType: '1 Unit',
        propertyAddress: 'Railway Station Rd, Bhopal, MP, 462001, IN'
    },
    {
        id: '2',
        requestNumber: '1318708',
        tenant: 'John Doe',
        assignee: 'ABC',
        status: 'In Progress',
        priority: 'High',
        title: 'Plumbing / Leak Repair',
        dateDue: '25-Dec-2024',
        endedWork: '---',
        property: 'Ak Appartment',
        propertyType: '1 Unit',
        propertyAddress: 'Railway Station Rd, Bhopal, MP, 462001, IN'
    },
    {
        id: '3',
        requestNumber: '1318707',
        tenant: 'Atul rawat',
        assignee: 'XYZ',
        status: 'New',
        priority: 'Normal',
        title: 'Appliances / Heating & Cooling',
        dateDue: '---',
        endedWork: '---',
        property: 'Grove Street',
        propertyType: 'Single-family',
        propertyAddress: '11 Grove Street, Boston, MA, 12114, US'
    },
    {
        id: '4',
        requestNumber: '1318709',
        tenant: 'Jane Smith',
        assignee: 'DEF',
        status: 'Completed',
        priority: 'Low',
        title: 'Electrical / Light Fixture',
        dateDue: '20-Dec-2024',
        endedWork: '22-Dec-2024',
        property: 'Grove Street',
        propertyType: 'Single-family',
        propertyAddress: '11 Grove Street, Boston, MA, 12114, US'
    }
];

const MaintenanceRequestsReport: React.FC = () => {
    const navigate = useNavigate();
    const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>(ALL_COLUMNS.map(c => c.id));
    const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

    // Filter State for DashboardFilter
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
        date: [],
        propertyNotes: [],
        assign: [],
        tenants: []
    });

    // Filter Options for DashboardFilter
    const filterOptions: Record<string, FilterOption[]> = {
        date: [
            { value: 'today', label: 'Today' },
            { value: 'this_week', label: 'This Week' },
            { value: 'this_month', label: 'This Month' },
            { value: 'last_month', label: 'Last Month' }
        ],
        propertyNotes: Array.from(new Set(MOCK_REQUESTS.map(r => r.property))).map(prop => ({ value: prop, label: prop })),
        assign: Array.from(new Set(MOCK_REQUESTS.map(r => r.assignee))).map(a => ({ value: a, label: a })),
        tenants: Array.from(new Set(MOCK_REQUESTS.map(r => r.tenant))).map(t => ({ value: t, label: t }))
    };

    const filterLabels: Record<string, string> = {
        date: 'Date',
        propertyNotes: 'Property notes',
        assign: 'Assign',
        tenants: 'Tenants'
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
    const filteredRequests = useMemo(() => {
        return MOCK_REQUESTS.filter(request => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    request.requestNumber.toLowerCase().includes(query) ||
                    request.tenant.toLowerCase().includes(query) ||
                    request.assignee.toLowerCase().includes(query) ||
                    request.title.toLowerCase().includes(query) ||
                    request.property.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            // Property filter
            if (selectedFilters.propertyNotes.length > 0 && !selectedFilters.propertyNotes.includes(request.property)) {
                return false;
            }

            // Assignee filter
            if (selectedFilters.assign.length > 0 && !selectedFilters.assign.includes(request.assignee)) {
                return false;
            }

            // Tenants filter
            if (selectedFilters.tenants.length > 0 && !selectedFilters.tenants.includes(request.tenant)) {
                return false;
            }

            return true;
        });
    }, [searchQuery, selectedFilters]);

    // Group requests by property
    const groupedRequests = useMemo(() => {
        const groups: Record<string, MaintenanceRequest[]> = {};
        filteredRequests.forEach(request => {
            const key = `${request.property}|${request.propertyType}|${request.propertyAddress}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(request);
        });
        return groups;
    }, [filteredRequests]);

    const activeColumns = ALL_COLUMNS.filter(col => visibleColumns.includes(col.id));
    const gridTemplateColumns = activeColumns.map(col => col.width).join(' ');

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'new':
                return 'text-gray-700 font-medium';
            case 'in progress':
                return 'text-blue-600 font-medium';
            case 'completed':
                return 'text-green-600 font-medium';
            default:
                return 'text-gray-700';
        }
    };

    const getPriorityStyle = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high':
                return 'text-red-600 font-bold';
            case 'normal':
                return 'text-gray-800 font-bold';
            case 'low':
                return 'text-gray-500 font-medium';
            default:
                return 'text-gray-700';
        }
    };

    const renderCellContent = (request: MaintenanceRequest, columnId: ColumnId) => {
        switch (columnId) {
            case 'requestNumber':
                return <span className="text-[#4ad1a6] font-medium">{request.requestNumber}</span>;
            case 'tenant':
                return <span className="text-gray-800">{request.tenant}</span>;
            case 'assignee':
                return <span className="text-[#65a30d] font-bold">{request.assignee}</span>;
            case 'status':
                return <span className={getStatusStyle(request.status)}>{request.status}</span>;
            case 'priority':
                return <span className={getPriorityStyle(request.priority)}>{request.priority}</span>;
            case 'title':
                return <span className="text-gray-700">{request.title}</span>;
            case 'dateDue':
            case 'endedWork':
                return <span className="text-gray-600">{request[columnId]}</span>;
            default:
                return request[columnId as keyof MaintenanceRequest];
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
                <span className="text-gray-800 text-sm font-semibold">Maintenance Requests</span>
            </div>

            <div className="bg-[#E0E8E7] rounded-[2rem] p-8 min-h-[calc(100vh-100px)] relative">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Maintenance Requests</h1>
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
                <p className="text-gray-600 text-sm mb-8 max-w-4xl leading-relaxed">
                    The report displays maintenance requests related to a property, including request dates, Service Pro details, equipment involved, and other details. <span className="text-gray-900 font-semibold cursor-pointer">Learn more</span>
                </p>

                {/* Dashboard Style Filter Bar */}
                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={setSelectedFilters}
                    showMoreFilters={true}
                    showClearAll={true}
                    initialFilters={selectedFilters}
                />

                {/* Grouped Tables */}
                {Object.entries(groupedRequests).map(([key, requests]) => {
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
                            <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm">
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
                                {requests.map(request => (
                                    <div
                                        key={request.id}
                                        className="bg-white rounded-2xl px-6 py-4 grid gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                        style={{ gridTemplateColumns }}
                                    >
                                        {activeColumns.map(col => (
                                            <div key={col.id} className="text-sm text-center">
                                                {renderCellContent(request, col.id)}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}

                {Object.keys(groupedRequests).length === 0 && (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <p className="text-gray-500 text-lg">No maintenance requests found matching your filters</p>
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

export default MaintenanceRequestsReport;
