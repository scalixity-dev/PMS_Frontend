import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft, Download, MoreHorizontal, Edit2, Trash2, Check, X } from 'lucide-react';
import { utils, writeFile } from 'xlsx';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import SearchableDropdown from '../../../../components/ui/SearchableDropdown';
import { useGetAllLeads, useUpdateLead, useDeleteLead } from '../../../../hooks/useLeadQueries';
import { useGetAllListings } from '../../../../hooks/useListingQueries';
import type { BackendLead, LeadStatus } from '../../../../services/lead.service';

// Helper function to convert enum to readable label
export const getLeadSourceLabel = (source: string): string => {
    const sourceMap: Record<string, string> = {
        'CREATED_MANUALLY': 'Created Manually',
        'RENTAL_APPLICATION': 'Rental Application',
        'SENT_A_QUESTION': 'Sent a Question',
        'REQUESTED_A_TOUR': 'Requested a Tour',
        'ZILLOW': 'Zillow',
        'ZUMPER': 'Zumper',
        'RENTLER': 'Rentler',
        'TENANT_PROFILE': 'Tenant Profile',
        'REALTOR': 'Realtor',
        'APARTMENTS': 'Apartments',
        'RENT_GROUP': 'Rent Group',
        'OTHER': 'Other',
    };
    return sourceMap[source] || source;
};

// Frontend Lead interface
interface Lead {
    id: string;
    status: string; // Display label
    statusEnum: string; // Backend enum value
    type?: string | null; // Backend enum value (HOT/COLD)
    listingId?: string | null; // Backend listing ID
    name: string;
    phone: string;
    email: string;
    source: string;
    lastUpdate: string;
}

const Leads = () => {
    const navigate = useNavigate();
    const { data: backendLeads = [], isLoading, error } = useGetAllLeads();
    const { data: listings = [] } = useGetAllListings();
    const updateLeadMutation = useUpdateLead();
    const deleteLeadMutation = useDeleteLead();
    const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);
    
    // Helper function to convert status enum to display label
    const getStatusLabel = (status: string): string => {
        const statusMap: Record<string, string> = {
            'NEW': 'New',
            'WORKING': 'Working',
            'CLOSED': 'Closed',
        };
        return statusMap[status] || status;
    };

    // Transform backend leads to frontend format
    const leads: Lead[] = useMemo(() => {
        return backendLeads.map((lead: BackendLead) => ({
            id: lead.id,
            status: getStatusLabel(lead.status) || 'New',
            statusEnum: lead.status, // Keep enum value for filtering
            type: lead.type || null, // Keep enum value for filtering
            listingId: lead.listingId || null, // Keep listing ID for filtering
            name: lead.name,
            phone: lead.phoneNumber || '',
            email: lead.email || '',
            source: lead.source || 'OTHER',
            lastUpdate: '₹ 0', // This might need to come from backend
        }));
    }, [backendLeads]);

    const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [currentLeadId, setCurrentLeadId] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<LeadStatus>('NEW');
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({
        status: [],
        listing: [],
        sources: [],
        type: []
    });

    // Transform listings to filter options
    const listingFilterOptions: FilterOption[] = useMemo(() => {
        return listings.map((listing) => {
            // Use title if available, otherwise use property name, or fallback to listing ID
            const label = listing.title || 
                         listing.property?.propertyName || 
                         `Listing ${listing.id.substring(0, 8)}`;
            return {
                value: listing.id,
                label: label
            };
        });
    }, [listings]);

    // Filter options configuration
    const filterOptions: Record<string, FilterOption[]> = {
        status: [
            { value: 'NEW', label: 'New' },
            { value: 'WORKING', label: 'Working' },
            { value: 'CLOSED', label: 'Closed' },
        ],
        listing: listingFilterOptions,
        sources: [
            { value: 'CREATED_MANUALLY', label: 'Created Manually' },
            { value: 'RENTAL_APPLICATION', label: 'Rental Application' },
            { value: 'SENT_A_QUESTION', label: 'Sent a Question' },
            { value: 'REQUESTED_A_TOUR', label: 'Requested a Tour' },
            { value: 'ZILLOW', label: 'Zillow' },
            { value: 'ZUMPER', label: 'Zumper' },
            { value: 'RENTLER', label: 'Rentler' },
            { value: 'TENANT_PROFILE', label: 'Tenant Profile' },
            { value: 'REALTOR', label: 'Realtor' },
            { value: 'APARTMENTS', label: 'Apartments' },
            { value: 'RENT_GROUP', label: 'Rent Group' },
            { value: 'OTHER', label: 'Other' },
        ],
        type: [
            { value: 'HOT', label: 'Hot' },
            { value: 'COLD', label: 'Cold' },
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
    const [selectedListing, setSelectedListing] = useState('');
    const [applicantEmail, setApplicantEmail] = useState('');


    // Filtering logic
    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.phone.toLowerCase().includes(searchQuery.toLowerCase());

            // Status filter - compare enum values
            const matchesStatus = filters.status.length === 0 ||
                filters.status.includes(lead.statusEnum);

            // Listing filter - compare listing IDs
            const matchesListing = filters.listing.length === 0 ||
                (lead.listingId && filters.listing.includes(lead.listingId));

            // Sources filter
            const matchesSources = filters.sources.length === 0 ||
                filters.sources.includes(lead.source);

            // Type filter - compare enum values
            const matchesType = filters.type.length === 0 ||
                (lead.type && filters.type.includes(lead.type));

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
                ...new Set<string>([...selectedLeads, ...filteredIds]),
            ]);
        }
    };

    const toggleSelectLead = (id: string) => {
        if (selectedLeads.includes(id)) {
            setSelectedLeads(selectedLeads.filter(leadId => leadId !== id));
        } else {
            setSelectedLeads([...selectedLeads, id]);
        }
    };

    const handleStatusUpdate = async () => {
        if (currentLeadId !== null) {
            try {
                await updateLeadMutation.mutateAsync({
                    id: currentLeadId,
                    data: { status: selectedStatus as LeadStatus }
                });
                setIsStatusModalOpen(false);
            } catch (error) {
                console.error('Failed to update lead status:', error);
                // TODO: Show error message to user
            }
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

    const handleBulkDelete = async () => {
        if (selectedLeads.length === 0) return;

        const deletingIds = [...selectedLeads];
        setDeletingLeadId(deletingIds[0]); // Show loading state for first item

        try {
            // Delete all selected leads
            const results = await Promise.allSettled(
                deletingIds.map(id => deleteLeadMutation.mutateAsync(id))
            );
            
            // Check for failures (excluding "not found" which is treated as success)
            const failures = results.filter((result) => {
                if (result.status === 'rejected') {
                    const reason = result.reason;
                    const errorMessage = reason instanceof Error ? reason.message : String(reason);
                    // Treat "not found" as success since the lead is already deleted
                    return !errorMessage.includes('not found') && !errorMessage.includes('Not Found');
                }
                return false;
            });
            
            if (failures.length > 0) {
                console.error('Some leads failed to delete:', failures);
                const errorMessages = failures.map((failure) => {
                    const id = deletingIds[results.indexOf(failure)];
                    const reason = failure.status === 'rejected' ? failure.reason : 'Unknown error';
                    return `Lead ${id}: ${reason instanceof Error ? reason.message : String(reason)}`;
                });
                alert(`Failed to delete ${failures.length} lead(s):\n${errorMessages.join('\n')}`);
            } else {
                // All deletions succeeded (including "not found" cases)
                console.log('All selected leads deleted successfully');
            }
            
            // Clear selection after deletion attempts
            setSelectedLeads([]);
        } catch (error) {
            console.error('Failed to delete leads:', error);
            alert(`Failed to delete leads: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setDeletingLeadId(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Leads</span>
            </div>

            <div className="p-6 bg-[#E0E8E7]  rounded-[2rem]">
                {/* Header - Matching LeaseDetail structure */}
                <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:text-gray-600 transition-colors">
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
                    </div>
                    <div className="flex gap-3">
                        {selectedLeads.length > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                disabled={deletingLeadId !== null}
                                className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-red-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Trash2 className="w-5 h-5" />
                                Delete Selected ({selectedLeads.length})
                            </button>
                        )}
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
                    <div className="text-white px-6 py-4 grid grid-cols-[80px_1fr_1.2fr_1.2fr_1.5fr_1.2fr_1.8fr] gap-4 items-center text-sm font-medium">
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
                <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t">
                    {isLoading ? (
                        <div className="bg-white rounded-2xl px-6 py-12 text-center">
                            <p className="text-gray-500 text-lg">Loading leads...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-white rounded-2xl px-6 py-12 text-center">
                            <p className="text-red-500 text-lg">Error loading leads</p>
                            <p className="text-gray-400 text-sm mt-2">
                                {error instanceof Error ? error.message : 'An unexpected error occurred'}
                            </p>
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="bg-white rounded-2xl px-6 py-12 text-center">
                            <p className="text-gray-500 text-lg">No leads found matching your filters</p>
                            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        filteredLeads.map((lead) => (
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
                                className="text-[#000000] font-medium text-sm text-left cursor-pointer hover:text-[#3A6D6C] transition-colors"
                            >
                                {lead.name}
                            </div>
                            <div className="text-[#2E6819] font-medium text-sm text-center">{lead.phone}</div>
                            <div className="text-gray-600 font-medium text-sm text-left truncate">{lead.email}</div>
                            <div className="text-gray-600 font-medium text-sm text-left">{getLeadSourceLabel(lead.source)}</div>
                            <div className="flex items-center justify-start gap-10">
                                <span className="text-black font-normal text-sm whitespace-nowrap">{lead.lastUpdate}</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => navigate(`/dashboard/leasing/leads/edit/${lead.id}`)}
                                        className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4 stroke-[3]" />
                                    </button>
                                    <button 
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            setDeletingLeadId(lead.id);
                                            try {
                                                await deleteLeadMutation.mutateAsync(lead.id);
                                                // Remove from selected leads if it was selected
                                                setSelectedLeads(prev => prev.filter(id => id !== lead.id));
                                                console.log('Lead deleted successfully:', lead.id);
                                            } catch (error) {
                                                console.error('Failed to delete lead:', error);
                                                const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                                                // If lead is not found, it's already deleted - treat as success
                                                if (errorMessage.includes('not found') || errorMessage.includes('Not Found')) {
                                                    console.log('Lead already deleted, removing from list');
                                                    setSelectedLeads(prev => prev.filter(id => id !== lead.id));
                                                } else {
                                                    alert(`Failed to delete lead: ${errorMessage}`);
                                                }
                                            } finally {
                                                setDeletingLeadId(null);
                                            }
                                        }}
                                        disabled={deletingLeadId === lead.id}
                                        className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Delete lead"
                                    >
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
                                            <div className="absolute right-0 top-full mt-3 w-48 bg-white rounded-3xl shadow-2xl border border-gray-100 z-[60] overflow-hidden transform origin-top-right transition-all">
                                                <button
                                                    onClick={() => {
                                                        setIsStatusModalOpen(true);
                                                        setCurrentLeadId(lead.id);
                                                        // Convert display status back to enum
                                                        const statusMap: Record<string, LeadStatus> = {
                                                            'New': 'NEW',
                                                            'Working': 'WORKING',
                                                            'Closed': 'CLOSED',
                                                        };
                                                        setSelectedStatus(statusMap[lead.status] || 'NEW');
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="w-full text-center py-3 text-sm font-normal text-gray-800 hover:bg-gray-50 border-b border-gray-300 transition-colors"
                                                >
                                                    Change Status
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsInviteModalOpen(true);
                                                        setApplicantEmail(lead.email);
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="w-full text-center py-3 text-sm font-normal text-gray-800 hover:bg-gray-50 transition-colors"
                                                >
                                                    Invite to Apply
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        ))
                    )}
                </div>
            </div>

            {/* Status Change Modal */}
            {isStatusModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-[#E0E8E7] w-full max-w-xl rounded-[2.5rem] shadow-2xl">
                        {/* Modal Header */}
                        <div className="bg-[#3A6D6C] rounded-t-[2.5rem] px-6 py-5 flex justify-between items-center text-white">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setIsStatusModalOpen(false)}>
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <h2 className="text-lg font-semibold">Select lead status</h2>
                            </div>
                            <button onClick={() => setIsStatusModalOpen(false)}>
                                <X className="w-6 h-6  rounded-full" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-6">
                            <div className="space-y-3">
                                <label className="text-gray-900 font-bold ml-1">Lead Status*</label>
                                <SearchableDropdown
                                    value={getStatusLabel(selectedStatus)}
                                    onChange={(value) => {
                                        const statusMap: Record<string, LeadStatus> = {
                                            'New': 'NEW',
                                            'Working': 'WORKING',
                                            'Closed': 'CLOSED',
                                        };
                                        setSelectedStatus(statusMap[value] || 'NEW');
                                    }}
                                    options={['New', 'Working', 'Closed']}
                                    placeholder="Search status..."
                                    className="w-full"
                                    buttonClassName="w-full bg-white rounded-2xl p-4 flex justify-between items-center border border-gray-200 text-gray-600 font-medium"
                                />
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
                    <div className="bg-[#E0E8E7] w-full max-w-xl rounded-[2.5rem] shadow-2xl">
                        {/* Modal Header */}
                        <div className="bg-[#3A6D6C] rounded-t-[2.5rem] px-6 py-5 flex justify-between items-center text-white">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setIsInviteModalOpen(false)}>
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <h2 className="text-xl font-semibold">Invite applicants to apply online</h2>
                            </div>
                            <button onClick={() => setIsInviteModalOpen(false)}>
                                <X className="w-6 h-6 rounded-full" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 space-y-6">
                            <div className="space-y-3">
                                <label className="text-gray-900 font-bold ml-1">Select listing *</label>
                                <SearchableDropdown
                                    value={selectedListing}
                                    onChange={setSelectedListing}
                                    options={listingFilterOptions.map(opt => opt.label)}
                                    placeholder="Search listing..."
                                    className="w-full"
                                    buttonClassName="w-full bg-white rounded-2xl p-4 flex justify-between items-center border border-gray-200 text-gray-600 font-medium"
                                />
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
