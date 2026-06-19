import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useTeamPermissions } from '../../../../context/TeamPermissionContext';
import ListingHeader from './components/ListingHeader';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
import ListingCard from './components/ListingCard';
import { useGetListingDashboard } from '../../../../hooks/useListingQueries';
import type { ListingDashboardQuery } from '../../../../services/listing.service';

const ITEMS_PER_PAGE = 9;

const Listing: React.FC = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed = false } = useOutletContext<{ sidebarCollapsed: boolean }>() ?? {};
    const { isTeamMember, canManage } = useTeamPermissions();
    const canEdit = !isTeamMember || canManage('listing');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<{
        status: string[];
        daysListed: string[];
        syndication: string[];
        bedrooms: string[];
        bathrooms: string[];
    }>({
        status: [],
        daysListed: [],
        syndication: [],
        bedrooms: [],
        bathrooms: []
    });

    // Build the server query from current state
    const dashboardQuery = useMemo<ListingDashboardQuery>(() => {
        const q: ListingDashboardQuery = {
            page: currentPage,
            limit: ITEMS_PER_PAGE,
        };

        if (searchQuery) q.search = searchQuery;

        // Status filter — only send if exactly one is selected (both = no filter)
        if (filters.status.length === 1) {
            q.status = filters.status[0];
        }

        // Bedrooms filter — convert discrete values to min/max range
        if (filters.bedrooms.length > 0) {
            const nums = filters.bedrooms.map((v) => (v === '5+' ? 5 : parseInt(v, 10)));
            q.minBeds = Math.min(...nums);
            if (!filters.bedrooms.includes('5+')) {
                q.maxBeds = Math.max(...nums);
            }
        }

        // Bathrooms filter
        if (filters.bathrooms.length > 0) {
            const nums = filters.bathrooms.map((v) => (v === '4+' ? 4 : parseInt(v, 10)));
            q.minBaths = Math.min(...nums);
            if (!filters.bathrooms.includes('4+')) {
                q.maxBaths = Math.max(...nums);
            }
        }

        return q;
    }, [currentPage, searchQuery, filters]);

    // Server-side paginated + filtered query
    const { data: response, isLoading, error, isFetching } = useGetListingDashboard(dashboardQuery);

    const cards = response?.data ?? [];
    const pagination = response?.pagination;
    const totalPages = pagination?.totalPages ?? 0;

    // Client-side filters that don't have server equivalents (daysListed, syndication)
    const filteredCards = useMemo(() => {
        return cards.filter((listing) => {
            const matchesDaysListed = !filters.daysListed?.length ||
                (listing.daysListed !== null && (
                    (filters.daysListed.includes('new') && listing.daysListed < 7) ||
                    (filters.daysListed.includes('recent') && listing.daysListed >= 7 && listing.daysListed <= 30) ||
                    (filters.daysListed.includes('old') && listing.daysListed > 30)
                ));

            const matchesSyndication = !filters.syndication?.length ||
                (filters.syndication.includes('yes') && listing.isSyndicated) ||
                (filters.syndication.includes('no') && !listing.isSyndicated);

            return matchesDaysListed && matchesSyndication;
        });
    }, [cards, filters.daysListed, filters.syndication]);

    const handleAddListing = () => {
        navigate('/dashboard/list-unit');
    };

    const handleSearchChange = useCallback((value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    }, []);

    const handleFiltersChange = useCallback((newFilters: any) => {
        setFilters(newFilters);
        setCurrentPage(1);
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filterOptions: Record<string, FilterOption[]> = {
        status: [
            { value: 'listed', label: 'Listed' },
            { value: 'unlisted', label: 'Unlisted' },
        ],
        daysListed: [
            { value: 'new', label: '< 7 Days' },
            { value: 'recent', label: '7 - 30 Days' },
            { value: 'old', label: '> 30 Days' },
        ],
        syndication: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
        ],
        bedrooms: [
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
            { value: '5+', label: '5+' },
        ],
        bathrooms: [
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4+', label: '4+' },
        ]
    };

    const filterLabels: Record<string, string> = {
        status: 'Listing Status',
        daysListed: 'Days Listed',
        syndication: 'Syndication',
        bedrooms: 'Bedrooms',
        bathrooms: 'Bathrooms'
    };

    const showLoading = isLoading;

    return (
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen transition-all duration-300`}>
            <div className="inline-flex items-center px-3 md:px-4 py-2 bg-[#E0E8E7] rounded-full mb-4 md:mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-xs md:text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-xs md:text-sm font-semibold">Listings</span>
            </div>

            <div className="p-4 md:p-6 bg-[#E0E8E7] rounded-[1.5rem] md:rounded-[2rem] overflow-visible flex flex-col">
                <ListingHeader onAddListing={canEdit ? handleAddListing : undefined} canEdit={canEdit} />

                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={handleSearchChange}
                    onFiltersChange={handleFiltersChange}
                    initialFilters={filters}
                    showMoreFilters={false}
                    showClearAll={true}
                />

                <div className="flex-1 flex flex-col">
                    {showLoading ? (
                        <div className="text-center py-12 bg-white rounded-2xl">
                            <p className="text-gray-500 text-lg">Loading listings...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 bg-white rounded-2xl">
                            <p className="text-red-500 text-lg">Error loading listings</p>
                            <p className="text-gray-400 text-sm mt-2">
                                {error instanceof Error ? error.message : 'An unexpected error occurred'}
                            </p>
                        </div>
                    ) : filteredCards.length > 0 ? (
                        <>
                            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 ${isFetching ? 'opacity-60 transition-opacity' : ''}`}>
                                {filteredCards.map((listing) => (
                                    <ListingCard
                                        key={listing.id}
                                        id={listing.id}
                                        name={listing.name}
                                        address={listing.address}
                                        price={listing.price}
                                        status={listing.status}
                                        bathrooms={listing.bathrooms}
                                        bedrooms={listing.bedrooms}
                                        image={listing.image}
                                        country={listing.country ?? undefined}
                                        listingId={listing.listingId ?? undefined}
                                        propertyId={listing.propertyId}
                                    />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="mt-auto">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                        className="pb-8"
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl">
                            <p className="text-gray-500 text-lg">No listings found matching your filters</p>
                            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Listing;
