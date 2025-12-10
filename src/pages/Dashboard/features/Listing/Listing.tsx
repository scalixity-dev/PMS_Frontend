import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import ListingHeader from './components/ListingHeader';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
import ListingCard from './components/ListingCard';
import { useGetAllListings } from '../../../../hooks/useListingQueries';
import { useGetAllProperties } from '../../../../hooks/usePropertyQueries';
import { unitService } from '../../../../services/unit.service';
import type { BackendListing } from '../../../../services/listing.service';
import type { BackendProperty } from '../../../../services/property.service';
import type { BackendUnit } from '../../../../services/unit.service';

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

    // Get all MULTI properties to fetch their units
    const multiProperties = useMemo(() => {
        return backendProperties.filter(p => p.propertyType === 'MULTI') || [];
    }, [backendProperties]);

    // Fetch units for all MULTI properties in parallel
    const unitQueries = useQueries({
        queries: multiProperties.map(property => ({
            queryKey: ['units', 'list', property.id],
            queryFn: () => unitService.getAllByProperty(property.id),
            enabled: !!property.id,
            staleTime: 2 * 60 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: 1,
        })),
    });

    // Combine loading and error states for units
    const isLoadingUnits = unitQueries.some(query => query.isLoading);
    const unitsError = unitQueries.find(query => query.error)?.error;

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
        // Create a map of propertyId -> active listing (for properties)
        const activeListingsMap = new Map<string, BackendListing>();
        // Create a map of unitId -> active listing (for units)
        const activeUnitListingsMap = new Map<string, BackendListing>();
        
        listings.forEach((listing: BackendListing) => {
            if (listing.listingStatus === 'ACTIVE' && listing.isActive) {
                // Check if listing is for a unit or property
                if (listing.unitId) {
                    // Unit listing
                    const existing = activeUnitListingsMap.get(listing.unitId);
                    if (!existing || new Date(listing.listedAt) > new Date(existing.listedAt)) {
                        activeUnitListingsMap.set(listing.unitId, listing);
                    }
                } else {
                    // Property listing
                    const existing = activeListingsMap.get(listing.propertyId);
                    if (!existing || new Date(listing.listedAt) > new Date(existing.listedAt)) {
                        activeListingsMap.set(listing.propertyId, listing);
                    }
                }
            }
        });

        // Create a set of property IDs that have active listings
        const listedPropertyIds = new Set(activeListingsMap.keys());

        // Create a map of propertyId -> units data from unit queries
        const unitsByPropertyId = new Map<string, BackendUnit[]>();
        multiProperties.forEach((property, index) => {
            const unitsData = unitQueries[index]?.data;
            if (unitsData && Array.isArray(unitsData)) {
                unitsByPropertyId.set(property.id, unitsData);
            }
        });

        const transformed: ListingCardData[] = [];

        // Process MULTI properties - each unit becomes a separate listing
        backendProperties.forEach((backendProperty: BackendProperty) => {
            if (backendProperty.propertyType === 'MULTI') {
                const units = unitsByPropertyId.get(backendProperty.id) || [];
                
                // Format address for the property
                let propertyAddress = 'Address not available';
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
                        propertyAddress = addressParts.join(', ');
                    }
                }

                // Transform each unit into a ListingCardData
                units.forEach((unit: BackendUnit) => {
                    const activeListing = activeUnitListingsMap.get(unit.id);
                    const hasActiveListing = !!activeListing;

                    // Get price from unit listing, unit leasing, or unit rent
                    let price: number | null = null;
                    if (hasActiveListing && activeListing) {
                        if (activeListing.listingPrice !== null && activeListing.listingPrice !== undefined) {
                            price = typeof activeListing.listingPrice === 'string' 
                                ? parseFloat(activeListing.listingPrice) 
                                : Number(activeListing.listingPrice);
                        } else if (activeListing.monthlyRent !== null && activeListing.monthlyRent !== undefined) {
                            price = typeof activeListing.monthlyRent === 'string' 
                                ? parseFloat(activeListing.monthlyRent) 
                                : Number(activeListing.monthlyRent);
                        }
                    } else if (unit.leasing?.monthlyRent) {
                        price = typeof unit.leasing.monthlyRent === 'string'
                            ? parseFloat(unit.leasing.monthlyRent) || 0
                            : Number(unit.leasing.monthlyRent) || 0;
                        if (price === 0) price = null;
                    } else if (unit.rent) {
                        price = typeof unit.rent === 'string'
                            ? parseFloat(unit.rent) || 0
                            : Number(unit.rent) || 0;
                        if (price === 0) price = null;
                    }

                    // Get bedrooms and bathrooms from unit
                    const bedrooms = unit.beds || 0;
                    const bathrooms = unit.baths
                        ? typeof unit.baths === 'string'
                            ? parseFloat(unit.baths) || 0
                            : Number(unit.baths) || 0
                        : 0;

                    // Get image from unit photos or coverPhotoUrl
                    let image = '';
                    if (unit.photos && Array.isArray(unit.photos) && unit.photos.length > 0) {
                        const primaryPhoto = unit.photos.find((p) => p.isPrimary);
                        image = primaryPhoto?.photoUrl || unit.photos[0].photoUrl;
                    } else if (unit.coverPhotoUrl) {
                        image = unit.coverPhotoUrl;
                    } else if (backendProperty.coverPhotoUrl) {
                        image = backendProperty.coverPhotoUrl;
                    } else if (backendProperty.photos && backendProperty.photos.length > 0) {
                        const primaryPhoto = backendProperty.photos.find((p) => p.isPrimary);
                        image = primaryPhoto?.photoUrl || backendProperty.photos[0].photoUrl;
                    }

                    // Generate stable ID for unit
                    const unitIdNum = (() => {
                        const parsed = Number(unit.id);
                        if (!isNaN(parsed) && isFinite(parsed)) {
                            return parsed;
                        }
                        let hash = 0;
                        for (let i = 0; i < unit.id.length; i++) {
                            const char = unit.id.charCodeAt(i);
                            hash = ((hash << 5) - hash) + char;
                            hash = hash & hash;
                        }
                        return Math.abs(hash);
                    })();

                    transformed.push({
                        id: unitIdNum,
                        name: `${backendProperty.propertyName} - ${unit.unitName || 'Unit'}`,
                        address: propertyAddress,
                        price,
                        status: hasActiveListing ? 'listed' : 'unlisted',
                        bathrooms,
                        bedrooms,
                        image,
                        country,
                        listingId: activeListing?.id,
                        propertyId: backendProperty.id,
                    });
                });
            }
        });

        // Process SINGLE properties - show as before
        backendProperties.forEach((backendProperty: BackendProperty) => {
            if (backendProperty.propertyType === 'SINGLE') {
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

                transformed.push({
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
                });
            }
        });

        return transformed;
    }, [listings, backendProperties, multiProperties, unitQueries]);

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
    const isLoading = listingsLoading || propertiesLoading || isLoadingUnits;

    // Error state
    const error = listingsError || propertiesError || unitsError;

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
