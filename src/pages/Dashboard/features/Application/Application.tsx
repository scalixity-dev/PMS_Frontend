import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
import ApplicationCard from './components/ApplicationCard';
import { Plus, ChevronLeft, Loader2 } from 'lucide-react';
import { useGetAllApplications } from '../../../../hooks/useApplicationQueries';
import type { BackendApplication } from '../../../../services/application.service';
import InviteToApplyModal from './components/InviteToApplyModal';

// Transform backend application to card format
const transformApplicationToCard = (app: BackendApplication) => {
    // Get primary applicant name
    const primaryApplicant = app.applicants.find(a => a.isPrimary) || app.applicants[0];
    const name = primaryApplicant
        ? `${primaryApplicant.firstName} ${primaryApplicant.middleName || ''} ${primaryApplicant.lastName}`.trim()
        : 'Unknown Applicant';

    // Format date
    const appliedDate = new Date(app.applicationDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    // Map status
    const statusMap: Record<string, 'Approved' | 'Pending' | 'Rejected'> = {
        'APPROVED': 'Approved',
        'SUBMITTED': 'Pending',
        'UNDER_REVIEW': 'Pending',
        'DRAFT': 'Pending',
        'REJECTED': 'Rejected',
        'WITHDRAWN': 'Pending',
    };
    const status = statusMap[app.status] || 'Pending';

    // Get property and unit info
    const property = app.leasing?.property;
    const unit = app.leasing?.unit;
    let propertyUnit = '-';
    if (property?.propertyName) {
        if (property.propertyType === 'MULTI' && unit?.unitName) {
            propertyUnit = `${property.propertyName} - ${unit.unitName}`;
        } else {
            propertyUnit = property.propertyName;
        }
    }

    // Get image from application or use empty string
    const image = app.imageUrl || '';

    return {
        id: app.id,
        name,
        image,
        appliedDate,
        status,
        backendStatus: app.status,
        propertyUnit,
        propertyId: property?.id,
        unitId: unit?.id,
    };
};

const Application = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const itemsPerPage = 6;

    // Fetch applications from API
    const { data: applications = [], isLoading, error } = useGetAllApplications();

    const handleSearchChange = (search: string) => {
        setSearchQuery(search);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleFiltersChange = (newFilters: Record<string, string[]>) => {
        setFilters(newFilters);
        setCurrentPage(1); // Reset to first page on filter change
    };

    // Get unique property/units for filters
    const uniquePropertyUnits = useMemo(() => {
        const propertyUnits = new Set(
            applications
                .map(app => {
                    const property = app.leasing?.property;
                    const unit = app.leasing?.unit;
                    if (property?.propertyName) {
                        if (property.propertyType === 'MULTI' && unit?.unitName) {
                            return `${property.propertyName} - ${unit.unitName}`;
                        }
                        return property.propertyName;
                    }
                    return null;
                })
                .filter((pu): pu is string => pu !== null)
        );
        return Array.from(propertyUnits).map(pu => ({
            value: pu,
            label: pu,
        }));
    }, [applications]);

    const filterOptions: Record<string, FilterOption[]> = {
        screeningStatus: [
            { value: 'approved', label: 'Approved' },
            { value: 'pending', label: 'Pending' },
            { value: 'rejected', label: 'Rejected' },
        ],
        propertyUnits: uniquePropertyUnits.length > 0 ? uniquePropertyUnits : [
            { value: '__no_items__', label: 'No properties available' }
        ],
        applicationType: [
            { value: '__no_items__', label: 'No application types available' }
        ]
    };

    const filterLabels: Record<string, string> = {
        screeningStatus: 'Screening Status',
        propertyUnits: 'Property & Units',
        applicationType: 'Application Type'
    };

    const handleSortToggle = () => {
        setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    };

    // Transform and filter applications
    const transformedApplications = useMemo(() => {
        let filtered = applications.map(transformApplicationToCard);

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(app =>
                app.name.toLowerCase().includes(query) ||
                app.appliedDate.toLowerCase().includes(query) ||
                app.propertyUnit.toLowerCase().includes(query)
            );
        }

        // Apply screening status filter
        if (filters.screeningStatus && filters.screeningStatus.length > 0) {
            filtered = filtered.filter(app => {
                const appStatus = app.status.toLowerCase();
                return filters.screeningStatus.some(filterStatus =>
                    appStatus === filterStatus.toLowerCase()
                );
            });
        }

        // Apply property/unit filter (ignore placeholder value)
        if (filters.propertyUnits && filters.propertyUnits.length > 0) {
            const validFilters = filters.propertyUnits.filter(v => v !== '__no_items__');
            if (validFilters.length > 0) {
                filtered = filtered.filter(app =>
                    validFilters.includes(app.propertyUnit)
                );
            }
        }

        // Screening status and application type filters are placeholders for now
        // They will be ignored if only placeholder is selected

        return filtered;
    }, [applications, searchQuery, filters]);

    // Sort applications
    const sortedApplications = useMemo(() => {
        return [...transformedApplications].sort((a, b) => {
            return sortOrder === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        });
    }, [transformedApplications, sortOrder]);

    const totalPages = Math.ceil(sortedApplications.length / itemsPerPage);
    const currentApplications = sortedApplications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-6xl mx-auto min-h-screen font-outfit">
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E5E5] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Application</span>
            </div>

            <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-[2rem] flex flex-col">
                {/* Header */}
                <div className="flex items-center mb-6 gap-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">Application</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsInviteModalOpen(true)}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors"
                        >
                            Invite to apply
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/application/new')} // Check route if needed
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2"
                        >
                            New Application
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Filter Section */}
                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={handleSearchChange}
                    onFiltersChange={handleFiltersChange}
                    initialFilters={filters}
                    showMoreFilters={false}
                    showClearAll={true}
                />

                {/* Sort and Count */}
                {applications.length > 0 && (
                    <div className="flex items-center gap-4 mb-6">
                        {/* Property Names Display - Only show when property data exists */}
                        {(() => {
                            // Get unique property names from applications
                            const propertyNames = applications
                                .map(app => {
                                    const property = app.leasing?.property;
                                    const unit = app.leasing?.unit;

                                    if (!property || !property.propertyName) return null;

                                    // For MULTI properties, show property name + unit name
                                    if (property.propertyType === 'MULTI' && unit?.unitName) {
                                        return `${property.propertyName} - ${unit.unitName}`;
                                    }

                                    // For SINGLE properties, just show property name
                                    return property.propertyName;
                                })
                                .filter((name): name is string => name !== null);

                            // Get unique property names
                            const uniqueNames = Array.from(new Set(propertyNames));

                            // Only show if we have property names from backend
                            if (uniqueNames.length === 0) return null;

                            const displayText = uniqueNames.length === 1
                                ? uniqueNames[0]
                                : `${uniqueNames.length} Properties`;

                            return (
                                <button
                                    onClick={handleSortToggle}
                                    className="flex items-center gap-1 hover:bg-black/5 px-2 py-1 rounded-lg transition-colors"
                                >
                                    <span className="text-lg font-bold text-black">
                                        {displayText}
                                    </span>
                                    <svg
                                        width="10"
                                        height="6"
                                        viewBox="0 0 10 6"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`transition-transform duration-200 ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                                    >
                                        <path d="M1 1L5 5L9 1" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            );
                        })()}

                        <div className="bg-[#3A6D6C] text-white px-4 py-1 rounded-full text-sm">
                            {sortedApplications.length} Application{sortedApplications.length !== 1 ? 's' : ''}
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                        <span className="ml-3 text-gray-600">Loading applications...</span>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-800 text-sm">
                            {error instanceof Error ? error.message : 'Failed to load applications. Please try again.'}
                        </p>
                    </div>
                )}

                {/* Applications Grid */}
                {!isLoading && !error && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {currentApplications.length > 0 ? (
                            currentApplications.map((app) => (
                                <ApplicationCard
                                    key={app.id}
                                    {...app}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-600">
                                    {searchQuery || Object.keys(filters).length > 0
                                        ? 'No applications match your filters'
                                        : 'No applications found'}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-auto">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages || 1}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
            {/* Invite Modal */}
            <InviteToApplyModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onSend={async (email) => {
                    // TODO: Implement API call to send invitation
                    console.log('Sending invitation to:', email);
                    // Replace with actual API call when ready
                    // await invitationService.sendInvitation(email);
                    setIsInviteModalOpen(false);
                }}
            />
        </div>
    );
};

export default Application;
