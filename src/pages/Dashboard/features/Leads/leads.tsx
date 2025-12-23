import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, Download, MoreHorizontal, Edit2, Trash2, Check, ChevronDown, X } from 'lucide-react';
import { utils, writeFile } from 'xlsx';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';

// Mock Data for Leads
const MOCK_LEADS = [
    {
        id: 1,
        status: 'New',
        name: 'Sam',
        phone: '+91 7049770293',
        email: 'abc@gmail.com',
        source: 'Created manually',
        lastUpdate: '₹ 50,000',
    }
];

const Leads = () => {
    const navigate = useNavigate();
    const [leads, setLeads] = useState(MOCK_LEADS);
    const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [currentLeadId, setCurrentLeadId] = useState<number | null>(null);
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('New');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({
        status: [],
        listing: [],
        sources: [],
        type: []
    });

    // Filter options configuration
    const filterOptions: Record<string, FilterOption[]> = {
        status: [
            { value: 'New', label: 'New' },
            { value: 'Working', label: 'Working' },
            { value: 'Closed', label: 'Closed' },
        ],
        listing: [
            { value: 'Grand Villa', label: 'Grand Villa' },
            { value: 'A2 Apartment', label: 'A2 Apartment' },
            { value: 'B4 duplex', label: 'B4 duplex' },
        ],
        sources: [
            { value: 'Created manually', label: 'Created manually' },
            { value: 'Website', label: 'Website' },
            { value: 'Referral', label: 'Referral' },
        ],
        type: [
            { value: 'Hot', label: 'Hot' },
            { value: 'Cold', label: 'Cold' },
        ]
    };

    const filterLabels: Record<string, string> = {
        status: 'Status',
        listing: 'Listing',
        sources: 'Sources',
        type: 'Type'
    };

    // Invite Modal State
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState('Grand Villa');
    const [applicantEmail, setApplicantEmail] = useState('');
    const [isInviteDropdownOpen, setIsInviteDropdownOpen] = useState(false);

    // Filtering logic
    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.phone.toLowerCase().includes(searchQuery.toLowerCase());

            // Status filter
            const matchesStatus = filters.status.length === 0 ||
                filters.status.includes(lead.status);

            // Listing filter (assuming leads will have a listing property)
            const matchesListing = filters.listing.length === 0;
            // TODO: Add listing property to leads data model

            // Sources filter
            const matchesSources = filters.sources.length === 0 ||
                filters.sources.includes(lead.source);

            // Type filter (assuming leads will have a type property)
            const matchesType = filters.type.length === 0;
            // TODO: Add type property to leads data model

            return matchesSearch && matchesStatus && matchesListing && matchesSources && matchesType;
        });
    }, [leads, searchQuery, filters]);

    const allFilteredSelected =
        filteredLeads.length > 0 &&
        filteredLeads.every((lead) => selectedLeads.includes(lead.id));

    const toggleSelectAll = () => {
        const filteredIds = filteredLeads.map((lead) => lead.id);

        const areAllFilteredSelected = filteredIds.every((id) =>
            selectedLeads.includes(id)
        );

        if (areAllFilteredSelected) {
            // Unselect only the currently filtered leads
            setSelectedLeads(selectedLeads.filter((id) => !filteredIds.includes(id)));
        } else {
            // Select all filtered leads in addition to any already selected ones
            setSelectedLeads([
                ...new Set<number>([...selectedLeads, ...filteredIds]),
            ]);
        }
    };

    const toggleSelectLead = (id: number) => {
        if (selectedLeads.includes(id)) {
            setSelectedLeads(selectedLeads.filter(leadId => leadId !== id));
        } else {
            setSelectedLeads([...selectedLeads, id]);
        }
    };

    const handleStatusUpdate = () => {
        if (currentLeadId !== null) {
            setLeads(prevLeads =>
                prevLeads.map(lead =>
                    lead.id === currentLeadId ? { ...lead, status: selectedStatus } : lead
                )
            );
            setIsStatusModalOpen(false);
        }
    };

    const handleExport = () => {
        // Create a cleaner version of the data for export
        const exportData = filteredLeads.map(lead => ({
            Status: lead.status,
            Name: lead.name,
            Phone: lead.phone,
            Email: lead.email,
            Source: lead.source,
            'Last Update': lead.lastUpdate,
        }));

        // Create worksheet
        const ws = utils.json_to_sheet(exportData);

        // Create workbook
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Leads");

        // Generate filename with current date
        const date = new Date().toISOString().split('T')[0];
        const fileName = `Leads_${date}.xlsx`;

        // Save file
        writeFile(wb, fileName);
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Leads</span>
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem]">
                {/* Header - Matching LeaseDetail structure */}
                <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:text-gray-600 transition-colors">
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/dashboard/leasing/leads/add')}
                            className="flex items-center gap-2 bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-all shadow-sm"
                        >
                            Add Leads
                            <Plus className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleExport}
                            className="bg-[#3A6D6C] text-white p-2 rounded-full hover:bg-[#2c5251] transition-all shadow-sm"
                            title="Download Excel"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Filter Bar */}
                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={setFilters}
                    showMoreFilters={false}
                    showClearAll={true}
                />

                {/* Table Section Header */}
                <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm">
                    {/* Table Header */}
                    <div className="text-white px-10 py-4 grid grid-cols-[80px_1fr_1.2fr_1.2fr_1.5fr_1.2fr_1.8fr] gap-4 items-center text-sm font-medium">
                        <div className="flex justify-start pl-1">
                            <div
                                onClick={toggleSelectAll}
                                className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-all ${allFilteredSelected ? 'bg-[#1BCB40]' : 'bg-white/20 border-2 border-white/40'}`}
                            >
                                {allFilteredSelected && (
                                    <Check className="w-3 h-3 text-white stroke-[4]" />
                                )}
                            </div>
                        </div>
                        <div className="text-left">Status</div>
                        <div className="text-left">Name</div>
                        <div className="text-center">Phone</div>
                        <div className="text-left">Email</div>
                        <div className="text-left">Source</div>
                        <div className="text-left">Last Update</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t-none min-h-[400px]">
                    {filteredLeads.map((lead) => (
                        <div key={lead.id} className="bg-white rounded-2xl px-6 py-4 grid grid-cols-[80px_1fr_1.2fr_1.2fr_1.5fr_1.2fr_1.8fr] gap-4 items-center shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-start pl-1">
                                <div
                                    onClick={() => toggleSelectLead(lead.id)}
                                    className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-all ${selectedLeads.includes(lead.id) ? 'bg-[#1BCB40]' : 'bg-white border-2 border-[#1BCB40]'}`}
                                >
                                    {selectedLeads.includes(lead.id) && <Check className="w-3 h-3 text-white stroke-[4]" />}
                                </div>
                            </div>
                            <div className="text-[#20CC95] font-bold text-sm text-left">{lead.status}</div>
                            <div
                                onClick={() => navigate(`/dashboard/leasing/leads/${lead.id}`)}
                                className="text-[#000000] font-semibold text-sm text-left cursor-pointer hover:text-[#3A6D6C] transition-colors"
                            >
                                {lead.name}
                            </div>
                            <div className="text-[#2E6819] font-semibold text-sm text-center">{lead.phone}</div>
                            <div className="text-gray-600 font-medium text-sm text-left truncate">{lead.email}</div>
                            <div className="text-gray-600 font-medium text-sm text-left">{lead.source}</div>
                            <div className="flex items-center justify-start gap-10">
                                <span className="text-black font-semibold text-sm whitespace-nowrap">{lead.lastUpdate}</span>
                                <div className="flex items-center gap-3  px-4 py-2">
                                    <button
                                        onClick={() => navigate(`/dashboard/leasing/leads/edit/${lead.id}`)}
                                        className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4 stroke-[3]" />
                                    </button>
                                    <button className="text-red-500 hover:text-red-600 transition-colors">
                                        <Trash2 className="w-4 h-4 stroke-[3]" />
                                    </button>
                                    <div className="relative">
                                        <button
                                            onClick={() => setOpenMenuId(openMenuId === lead.id ? null : lead.id)}
                                            className="text-gray-400 hover:text-gray-700 transition-colors pt-1"
                                        >
                                            <MoreHorizontal className="w-5 h-5 stroke-[3]" />
                                        </button>

                                        {openMenuId === lead.id && (
                                            <div className="absolute right-0 top-full mt-3 w-52 bg-white rounded-3xl shadow-2xl border border-gray-100 z-[60] overflow-hidden transform origin-top-right transition-all">
                                                <button
                                                    onClick={() => {
                                                        setIsStatusModalOpen(true);
                                                        setCurrentLeadId(lead.id);
                                                        setSelectedStatus(lead.status);
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="w-full text-center py-4 text-sm font-normal text-gray-800 hover:bg-gray-50 border-b border-gray-50 transition-colors"
                                                >
                                                    Change Status
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsInviteModalOpen(true);
                                                        setApplicantEmail(lead.email);
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="w-full text-center py-4 text-sm font-normal text-gray-800 hover:bg-gray-50 transition-colors"
                                                >
                                                    Invite to Apply
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Status Change Modal */}
            {isStatusModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#E0E8E7] w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                        {/* Modal Header */}
                        <div className="bg-[#3A6D6C] px-8 py-6 flex justify-between items-center text-white">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setIsStatusModalOpen(false)}>
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <h2 className="text-xl font-semibold">Select lead status</h2>
                            </div>
                            <button onClick={() => setIsStatusModalOpen(false)}>
                                <X className="w-6 h-6 border-2 border-white/20 rounded-full" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-6">
                            <div className="space-y-3">
                                <label className="text-gray-900 font-bold ml-1">Lead Status*</label>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                        className="w-full bg-white rounded-2xl p-4 flex justify-between items-center border border-gray-200"
                                    >
                                        <span className="text-gray-600 font-medium">{selectedStatus || 'Choose Type'}</span>
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </button>

                                    {isStatusDropdownOpen && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-10 overflow-hidden">
                                            {['New', 'Working', 'Closed'].map((status) => (
                                                <button
                                                    key={status}
                                                    onClick={() => {
                                                        setSelectedStatus(status);
                                                        setIsStatusDropdownOpen(false);
                                                    }}
                                                    className="w-full text-left px-6 py-4 hover:bg-gray-50 text-gray-700 font-medium border-b border-gray-50 last:border-0"
                                                >
                                                    {status}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm">
                                <div className="p-0 border-b border-gray-100">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="w-full p-5 bg-transparent border-none focus:outline-none text-gray-700 placeholder:text-gray-400 font-medium"
                                    />
                                </div>
                                <div className="p-2">
                                    {['New', 'Working', 'Closed'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setSelectedStatus(status)}
                                            className={`w-full text-left px-6 py-3.5 rounded-xl transition-colors ${selectedStatus === status
                                                ? 'text-[#20CC95] font-bold'
                                                : 'text-gray-700 font-semibold'
                                                } hover:bg-gray-50`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                    <div className="pb-4" />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={handleStatusUpdate}
                                    className="bg-[#457B7A] text-white px-10 py-3 rounded-2xl font-bold text-lg shadow-[0_4px_10px_rgba(69,123,122,0.3)] hover:bg-[#386463] transition-all"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Invite to Apply Modal */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#E0E8E7] w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                        {/* Modal Header */}
                        <div className="bg-[#3A6D6C] px-8 py-6 flex justify-between items-center text-white">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setIsInviteModalOpen(false)}>
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <h2 className="text-xl font-semibold">Invite applicants to apply online</h2>
                            </div>
                            <button onClick={() => setIsInviteModalOpen(false)}>
                                <X className="w-6 h-6 border-2 border-white/20 rounded-full" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-6">
                            <div className="space-y-3">
                                <label className="text-gray-900 font-bold ml-1">Select listing *</label>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsInviteDropdownOpen(!isInviteDropdownOpen)}
                                        className="w-full bg-white rounded-2xl p-4 flex justify-between items-center border border-gray-200"
                                    >
                                        <span className="text-gray-600 font-medium">{selectedListing || 'Choose Type'}</span>
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    </button>

                                    {isInviteDropdownOpen && (
                                        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-10 overflow-hidden">
                                            {['Grand Villa', 'A2 Apartment', 'B4 duplex'].map((listing) => (
                                                <button
                                                    key={listing}
                                                    onClick={() => {
                                                        setSelectedListing(listing);
                                                        setIsInviteDropdownOpen(false);
                                                    }}
                                                    className="w-full text-left px-6 py-4 hover:bg-gray-50 text-gray-700 font-medium border-b border-gray-50 last:border-0"
                                                >
                                                    {listing}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm">
                                <div className="p-0 border-b border-gray-100">
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="w-full p-5 bg-transparent border-none focus:outline-none text-gray-700 placeholder:text-gray-400 font-medium"
                                    />
                                </div>
                                <div className="p-2">
                                    {['Grand Villa', 'A2 Apartment', 'B4 duplex'].map((listing) => (
                                        <button
                                            key={listing}
                                            onClick={() => setSelectedListing(listing)}
                                            className={`w-full text-left px-6 py-3.5 rounded-xl transition-colors ${selectedListing === listing
                                                ? 'text-[#20CC95] font-bold'
                                                : 'text-gray-700 font-semibold text-lg'
                                                } hover:bg-gray-50`}
                                        >
                                            {listing}
                                        </button>
                                    ))}
                                    <div className="pb-4" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-gray-900 font-bold ml-1">Type Applicant Email *</label>
                                <div className="bg-white rounded-2xl p-4 border border-gray-200">
                                    <input
                                        type="email"
                                        value={applicantEmail}
                                        onChange={(e) => setApplicantEmail(e.target.value)}
                                        placeholder="Type email here..."
                                        className="w-full bg-transparent border-none focus:outline-none text-gray-700 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    onClick={() => setIsInviteModalOpen(false)}
                                    className="bg-[#457B7A] text-white px-10 py-3 rounded-2xl font-bold text-lg shadow-[0_4px_10px_rgba(69,123,122,0.3)] hover:bg-[#386463] transition-all"
                                >
                                    Send Invitation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Leads;
