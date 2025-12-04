import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingHeader from './components/ListingHeader';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
import ListingCard from './components/ListingCard';
import { useGetAllListings } from '../../../../hooks/useListingQueries';
import { useGetAllProperties } from '../../../../hooks/usePropertyQueries';
import type { BackendListing } from '../../../../services/listing.service';
import type { BackendProperty } from '../../../../services/property.service';

// Interface for the combined listing data
interface ListingCardData {
    id: number;
    name: string;
    address: string;
    price: number | null;
    status: 'listed' | 'unlisted';
    bathrooms: number;
    bedrooms: number;
    image: string;
    country?: string; // Country code for currency
    listingId?: string; // For navigation to listing detail
    propertyId: string; // For navigation to list unit
}

const Listing: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<{
        status: string[];
        daysListed: string[];
        syndication: string[];
    }>({
        status: [],
        daysListed: [],
        syndication: []
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    // Fetch listings and properties using React Query
    const { data: listings = [], isLoading: listingsLoading, error: listingsError } = useGetAllListings();
    const { data: backendProperties = [], isLoading: propertiesLoading, error: propertiesError } = useGetAllProperties();

    const handleAddListing = () => {
        navigate('/dashboard/list-unit');
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
        ]
    };

    const filterLabels: Record<string, string> = {
        status: 'Status',
        daysListed: 'Days Listed',
        syndication: 'Syndication'
    };

    // Transform listings and properties into ListingCardData
    const allListingsData = useMemo(() => {
        // Create a map of propertyId -> active listing
        const activeListingsMap = new Map<string, BackendListing>();
        listings.forEach((listing: BackendListing) => {
            if (listing.listingStatus === 'ACTIVE' && listing.isActive) {
                // If property already has an active listing, keep the most recent one
                const existing = activeListingsMap.get(listing.propertyId);
                if (!existing || new Date(listing.listedAt) > new Date(existing.listedAt)) {
                    activeListingsMap.set(listing.propertyId, listing);
                }
            }
        });

        // Create a set of property IDs that have active listings
        const listedPropertyIds = new Set(activeListingsMap.keys());

        // Transform backend properties into ListingCardData
        const transformed: ListingCardData[] = backendProperties.map((backendProperty: BackendProperty, index: number) => {
            const hasActiveListing = listedPropertyIds.has(backendProperty.id);
            const activeListing = activeListingsMap.get(backendProperty.id);

            // Format address
            let address = 'Address not available';
            let country: string | undefined;
            if (backendProperty.address) {
                country = backendProperty.address.country;
                const addressParts = [
                    backendProperty.address.streetAddress,
                    backendProperty.address.city,
                    backendProperty.address.stateRegion,
                    backendProperty.address.zipCode,
                    backendProperty.address.country,
                ].filter(part => part && part.trim() !== '');
                
                if (addressParts.length > 0) {
                    address = addressParts.join(', ');
                }
            }

            // Get price from listing or property
            let price: number | null = null;
            if (hasActiveListing && activeListing) {
                // Prefer listingPrice, fallback to monthlyRent
                if (activeListing.listingPrice !== null && activeListing.listingPrice !== undefined) {
                    price = typeof activeListing.listingPrice === 'string' 
                        ? parseFloat(activeListing.listingPrice) 
                        : Number(activeListing.listingPrice);
                } else if (activeListing.monthlyRent !== null && activeListing.monthlyRent !== undefined) {
                    price = typeof activeListing.monthlyRent === 'string' 
                        ? parseFloat(activeListing.monthlyRent) 
                        : Number(activeListing.monthlyRent);
                }
            } else if (backendProperty.marketRent) {
                price = typeof backendProperty.marketRent === 'string'
                    ? parseFloat(backendProperty.marketRent) || 0
                    : Number(backendProperty.marketRent) || 0;
                if (price === 0) price = null;
            }

            // Get bedrooms and bathrooms
            const bedrooms = backendProperty.singleUnitDetails?.beds || 0;
            const bathrooms = backendProperty.singleUnitDetails?.baths
                ? typeof backendProperty.singleUnitDetails.baths === 'string'
                    ? parseFloat(backendProperty.singleUnitDetails.baths) || 0
                    : Number(backendProperty.singleUnitDetails.baths) || 0
                : 0;

            // Get image
            const image = backendProperty.coverPhotoUrl 
                || backendProperty.photos?.find((p) => p.isPrimary)?.photoUrl 
                || backendProperty.photos?.[0]?.photoUrl 
                || '';

            // Convert backend property ID to number (stable identifier)
            // Try parsing as number first, fallback to hash if it's a non-numeric string (e.g., UUID)
            const propertyIdNum = (() => {
                const parsed = Number(backendProperty.id);
                if (!isNaN(parsed) && isFinite(parsed)) {
                    return parsed;
                }
                // Deterministic hash for non-numeric IDs (e.g., UUIDs)
                let hash = 0;
                for (let i = 0; i < backendProperty.id.length; i++) {
                    const char = backendProperty.id.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash; // Convert to 32-bit integer
                }
                return Math.abs(hash);
            })();

            return {
                id: propertyIdNum,
                name: backendProperty.propertyName,
                address,
                price,
                status: hasActiveListing ? 'listed' : 'unlisted',
                bathrooms,
                bedrooms,
                image,
                country,
                listingId: activeListing?.id,
                propertyId: backendProperty.id,
            };
        });

        return transformed;
    }, [listings, backendProperties]);

    // Filter listings based on search and filters
    const filteredListings = useMemo(() => {
        return allListingsData.filter(listing => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                listing.address.toLowerCase().includes(searchQuery.toLowerCase());

            // Status filter
            const matchesStatus = filters.status.length === 0 ||
                filters.status.includes(listing.status);

            // Days listed filter (mock for now - would need listing date)
            const matchesDaysListed = true;

            // Syndication filter (mock for now)
            const matchesSyndication = true;

            return matchesSearch && matchesStatus && matchesDaysListed && matchesSyndication;
        });
    }, [allListingsData, searchQuery, filters]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filters]);

    const totalPages = Math.ceil(filteredListings.length / itemsPerPage);

    const currentListings = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredListings.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredListings, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Loading state
    const isLoading = listingsLoading || propertiesLoading;

    // Error state
    const error = listingsError || propertiesError;

    return (
        <div className="max-w-7xl mx-auto min-h-screen">
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Listings</span>
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem] overflow-visible">
                <ListingHeader onAddListing={handleAddListing} />

                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={(newFilters) => setFilters(newFilters as any)}
                    showMoreFilters={false}
                />

                {isLoading ? (
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
                ) : filteredListings.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {currentListings.map((listing) => (
                                <ListingCard
                                    key={`${listing.propertyId}-${listing.id}`}
                                    id={listing.id}
                                    name={listing.name}
                                    address={listing.address}
                                    price={listing.price}
                                    status={listing.status}
                                    bathrooms={listing.bathrooms}
                                    bedrooms={listing.bedrooms}
                                    image={listing.image}
                                    country={listing.country}
                                    listingId={listing.listingId}
                                    propertyId={listing.propertyId}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            className="pb-8"
                        />
                    </>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <p className="text-gray-500 text-lg">No listings found matching your filters</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Listing;
