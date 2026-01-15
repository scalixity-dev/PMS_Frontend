import React, { useState, useMemo, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plus, ChevronLeft } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
import UnitGroupCard, { type UnitGroup } from './components/UnitGroupCard';
import SingleUnitCard from './components/SingleUnitCard';
import { useGetAllProperties } from '../../../../hooks/usePropertyQueries';
import { useGetAllListings } from '../../../../hooks/useListingQueries';
import { unitService } from '../../../../services/unit.service';
import type { Unit } from './components/UnitItem';
import type { BackendListing } from '../../../../services/listing.service';
import Breadcrumb from '../../../../components/ui/Breadcrumb';

const Units: React.FC = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>() || { sidebarCollapsed: false };
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const { data: properties, isLoading: isLoadingProperties, error: propertiesError } = useGetAllProperties();
    const { data: listings = [], isLoading: isLoadingListings, error: listingsError } = useGetAllListings();

    // Get all MULTI properties to fetch their units
    const multiProperties = useMemo(() => {
        return properties?.filter(p => p.propertyType === 'MULTI') || [];
    }, [properties]);

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

    // Combine loading and error states
    const isLoadingUnits = unitQueries.some(query => query.isLoading);
    const unitsError = unitQueries.find(query => query.error)?.error;
    const isLoading = isLoadingProperties || isLoadingUnits || isLoadingListings;
    const error = propertiesError || unitsError || listingsError;

    // Create maps of listings for quick lookup (active and draft)
    const listingsMap = useMemo(() => {
        const activePropertyListingsMap = new Map<string, BackendListing>();
        const activeUnitListingsMap = new Map<string, BackendListing>();
        const draftPropertyListingsMap = new Map<string, BackendListing>();
        const draftUnitListingsMap = new Map<string, BackendListing>();

        listings.forEach((listing: BackendListing) => {
            if (listing.listingStatus === 'ACTIVE' && listing.isActive) {
                if (listing.unitId) {
                    // Unit-level listing
                    const existing = activeUnitListingsMap.get(listing.unitId);
                    if (!existing || new Date(listing.listedAt) > new Date(existing.listedAt)) {
                        activeUnitListingsMap.set(listing.unitId, listing);
                    }
                } else {
                    // Property-level listing
                    const existing = activePropertyListingsMap.get(listing.propertyId);
                    if (!existing || new Date(listing.listedAt) > new Date(existing.listedAt)) {
                        activePropertyListingsMap.set(listing.propertyId, listing);
                    }
                }
            } else if (listing.listingStatus === 'DRAFT') {
                if (listing.unitId) {
                    // Unit-level draft listing
                    const existing = draftUnitListingsMap.get(listing.unitId);
                    if (!existing || new Date(listing.listedAt) > new Date(existing.listedAt)) {
                        draftUnitListingsMap.set(listing.unitId, listing);
                    }
                } else {
                    // Property-level draft listing
                    const existing = draftPropertyListingsMap.get(listing.propertyId);
                    if (!existing || new Date(listing.listedAt) > new Date(existing.listedAt)) {
                        draftPropertyListingsMap.set(listing.propertyId, listing);
                    }
                }
            }
        });

        return {
            activePropertyListingsMap,
            activeUnitListingsMap,
            draftPropertyListingsMap,
            draftUnitListingsMap
        };
    }, [listings]);

    // Transform backend properties to UnitGroup format
    const allUnitGroups: UnitGroup[] = useMemo(() => {
        if (!properties || properties.length === 0) return [];

        // Create a map of propertyId -> units data from unit queries
        const unitsByPropertyId = new Map<string, any[]>();
        multiProperties.forEach((property, index) => {
            const unitsData = unitQueries[index]?.data;
            if (unitsData && Array.isArray(unitsData)) {
                unitsByPropertyId.set(property.id, unitsData);
            }
        });

        return properties
            .filter(property => {
                // Only include properties that have units (MULTI) or single unit details (SINGLE)
                if (property.propertyType === 'MULTI') {
                    const units = unitsByPropertyId.get(property.id);
                    return units && units.length > 0;
                } else if (property.propertyType === 'SINGLE') {
                    return property.singleUnitDetails !== null && property.singleUnitDetails !== undefined;
                }
                return false;
            })
            .map(property => {
                // Format address and extract country
                let address = 'Address not available';
                let country: string | undefined;
                if (property.address) {
                    country = property.address.country;
                    address = `${property.address.streetAddress}, ${property.address.city}, ${property.address.stateRegion} ${property.address.zipCode}, ${property.address.country}`;
                }

                // Map property status from backend to frontend
                const statusMap: Record<string, 'active' | 'archived'> = {
                    'ACTIVE': 'active',
                    'ARCHIVED': 'archived',
                };
                const propertyStatus = property.status
                    ? (statusMap[property.status] || 'archived')
                    : 'archived';

                // Get cover photo or first photo - for multi-apartment, use empty string if no image
                const image = property.propertyType === 'MULTI'
                    ? (property.coverPhotoUrl || (property.photos && property.photos.length > 0 ? property.photos[0].photoUrl : '') || '')
                    : (property.coverPhotoUrl || (property.photos && property.photos.length > 0 ? property.photos[0].photoUrl : '') || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80');

                let units: Unit[] = [];
                let status: 'Occupied' | 'Vacant' | 'Partially Occupied' = 'Vacant';

                if (property.propertyType === 'MULTI') {
                    // Get units from unit service data
                    const unitsData = unitsByPropertyId.get(property.id) || [];

                    if (unitsData.length > 0) {
                        // Transform MULTI property units from unit service
                        units = unitsData.map((unit: any) => {
                            // Determine unit status - only Occupied if there's an active lease/tenant
                            // Having leasing data doesn't mean occupied - it just means leasing terms are set
                            let unitStatus: 'Occupied' | 'Vacant' = 'Vacant';

                            // Check if unit has an active listing with OCCUPIED status
                            // First check the fetched listings map (most reliable)
                            const activeListing = listingsMap.activeUnitListingsMap.get(unit.id);
                            if (activeListing && (activeListing.occupancyStatus === 'OCCUPIED' || activeListing.occupancyStatus === 'PARTIALLY_OCCUPIED')) {
                                unitStatus = 'Occupied';
                            } else if (unit.listings && Array.isArray(unit.listings) && unit.listings.length > 0) {
                                // Fallback to unit's listings array if available
                                const unitListing = unit.listings.find((l: any) =>
                                    l.listingStatus === 'ACTIVE' &&
                                    l.isActive &&
                                    (l.occupancyStatus === 'OCCUPIED' || l.occupancyStatus === 'PARTIALLY_OCCUPIED')
                                );
                                if (unitListing) {
                                    unitStatus = 'Occupied';
                                }
                            }


                            let unitImage = '';
                            if (unit.photos && Array.isArray(unit.photos) && unit.photos.length > 0) {
                                // Use primary photo or first photo
                                const primaryPhoto = unit.photos.find((p: any) => p.isPrimary);
                                unitImage = primaryPhoto?.photoUrl || unit.photos[0].photoUrl;
                            } else if (unit.coverPhotoUrl) {
                                unitImage = unit.coverPhotoUrl;
                            }
                            // If no unit photos or coverPhotoUrl, unitImage remains empty string (will show "No Image")

                            // Check if unit has an active listing
                            const hasActiveListing = listingsMap.activeUnitListingsMap.has(unit.id);
                            const hasDraftListing = listingsMap.draftUnitListingsMap.has(unit.id);

                            return {
                                id: unit.id,
                                name: unit.unitName || 'Unit',
                                type: unit.apartmentType || 'Apartment',
                                status: unitStatus,
                                rent: unit.rent ? (typeof unit.rent === 'string' ? parseFloat(unit.rent) : Number(unit.rent)) : 0,
                                beds: unit.beds || 0,
                                baths: unit.baths ? (typeof unit.baths === 'string' ? parseFloat(unit.baths) : Number(unit.baths)) : 0,
                                sqft: unit.sizeSqft ? (typeof unit.sizeSqft === 'string' ? parseFloat(unit.sizeSqft) : Number(unit.sizeSqft)) : 0,
                                image: unitImage,
                                hasActiveListing,
                                hasDraftListing,
                            };
                        });

                        // Calculate property status based on units
                        const occupiedCount = units.filter(u => u.status === 'Occupied').length;
                        if (occupiedCount === 0) {
                            status = 'Vacant';
                        } else if (occupiedCount === units.length) {
                            status = 'Occupied';
                        } else {
                            status = 'Partially Occupied';
                        }
                    }
                } else if (property.propertyType === 'SINGLE' && property.singleUnitDetails) {
                    // Transform SINGLE property to a unit
                    const singleUnit = property.singleUnitDetails;

                    // Determine status for single unit - only Occupied if there's an active lease/tenant
                    let unitStatus: 'Occupied' | 'Vacant' = 'Vacant';

                    // Check if property has an active listing with OCCUPIED status
                    // First check the fetched listings map (most reliable)
                    const activeListing = listingsMap.activePropertyListingsMap.get(property.id);
                    if (activeListing && (activeListing.occupancyStatus === 'OCCUPIED' || activeListing.occupancyStatus === 'PARTIALLY_OCCUPIED')) {
                        unitStatus = 'Occupied';
                    } else if (property.listings && Array.isArray(property.listings) && property.listings.length > 0) {
                        // Fallback to property's listings array if available
                        const propertyListing = property.listings.find((l: any) =>
                            l.listingStatus === 'ACTIVE' &&
                            l.isActive &&
                            (l.occupancyStatus === 'OCCUPIED' || l.occupancyStatus === 'PARTIALLY_OCCUPIED')
                        );
                        if (propertyListing) {
                            unitStatus = 'Occupied';
                        }
                    }

                    // Check if property has an active listing
                    const hasActiveListing = listingsMap.activePropertyListingsMap.has(property.id);
                    const hasDraftListing = listingsMap.draftPropertyListingsMap.has(property.id);

                    units = [{
                        id: property.id,
                        name: property.propertyName,
                        type: 'Single-Family',
                        status: unitStatus,
                        rent: property.marketRent ? (typeof property.marketRent === 'string' ? parseFloat(property.marketRent) : Number(property.marketRent)) : 0,
                        beds: singleUnit.beds || 0,
                        baths: singleUnit.baths ? (typeof singleUnit.baths === 'string' ? parseFloat(singleUnit.baths) : Number(singleUnit.baths)) : 0,
                        sqft: property.sizeSqft ? (typeof property.sizeSqft === 'string' ? parseFloat(property.sizeSqft) : Number(property.sizeSqft)) : 0,
                        image: image,
                        hasActiveListing,
                        hasDraftListing,
                    }];

                    status = unitStatus;
                }

                // Calculate total monthly rent for balance category
                let totalMonthlyRent = 0;
                if (units.length > 0) {
                    // Sum up all unit rents
                    totalMonthlyRent = units.reduce((sum, unit) => sum + (unit.rent || 0), 0);
                } else if (property.marketRent) {
                    // Fallback to property market rent if no units
                    totalMonthlyRent = typeof property.marketRent === 'string'
                        ? parseFloat(property.marketRent) || 0
                        : Number(property.marketRent) || 0;
                }

                // Map country to currency (default to USD if country not found)
                const countryToCurrency: Record<string, string> = {
                    'United States': 'USD',
                    'USA': 'USD',
                    'US': 'USD',
                    'Canada': 'CAD',
                    'United Kingdom': 'GBP',
                    'UK': 'GBP',
                    'Australia': 'AUD',
                    'New Zealand': 'NZD',
                    'India': 'INR',
                    'China': 'CNY',
                    'Japan': 'JPY',
                    'Germany': 'EUR',
                    'France': 'EUR',
                    'Italy': 'EUR',
                    'Spain': 'EUR',
                    'Netherlands': 'EUR',
                    'Belgium': 'EUR',
                    'Switzerland': 'CHF',
                    'Singapore': 'SGD',
                    'Hong Kong': 'HKD',
                    'UAE': 'AED',
                    'United Arab Emirates': 'AED',
                    'Saudi Arabia': 'SAR',
                    'South Africa': 'ZAR',
                    'Brazil': 'BRL',
                    'Mexico': 'MXN',
                };
                const currency = country ? (countryToCurrency[country] || 'USD') : 'USD';

                // Determine balance category based on total monthly rent and currency
                let balanceCategory: 'low' | 'medium' | 'high' = 'medium';

                // Currency-specific thresholds (in base currency units)
                const currencyThresholds: Record<string, { low: number; high: number }> = {
                    'USD': { low: 25000, high: 75000 },
                    'CAD': { low: 33000, high: 100000 },
                    'GBP': { low: 20000, high: 60000 },
                    'EUR': { low: 23000, high: 69000 },
                    'AUD': { low: 37000, high: 110000 },
                    'INR': { low: 2000000, high: 6000000 },
                    'CNY': { low: 180000, high: 540000 },
                    'JPY': { low: 3500000, high: 10500000 },
                    'SGD': { low: 33000, high: 100000 },
                    'HKD': { low: 195000, high: 585000 },
                    'AED': { low: 92000, high: 275000 },
                    'SAR': { low: 94000, high: 280000 },
                };

                const thresholds = currencyThresholds[currency] || currencyThresholds['USD'];
                if (totalMonthlyRent < thresholds.low) {
                    balanceCategory = 'low';
                } else if (totalMonthlyRent > thresholds.high) {
                    balanceCategory = 'high';
                }

                return {
                    id: property.id,
                    propertyName: property.propertyName,
                    address,
                    image,
                    status,
                    units,
                    propertyType: property.propertyType,
                    country,
                    propertyStatus,
                    balanceCategory,
                };
            });
    }, [properties, unitQueries, multiProperties, listingsMap]);

    const unitGroups = useMemo(() => {
        return allUnitGroups.filter(group => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                group.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                group.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                group.units.some(unit => unit.name.toLowerCase().includes(searchQuery.toLowerCase()));

            // Status filter
            const matchesStatus = !filters.status?.length ||
                (group.propertyStatus && filters.status.includes(group.propertyStatus));

            // Occupancy filter
            const matchesOccupancy = !filters.occupancy?.length ||
                (filters.occupancy.includes('occupied') && group.status === 'Occupied') ||
                (filters.occupancy.includes('vacant') && group.status === 'Vacant') ||
                (filters.occupancy.includes('partially_occupied') && group.status === 'Partially Occupied');

            // Property Type filter
            const matchesPropertyType = !filters.propertyType?.length ||
                (group.propertyType && filters.propertyType.includes(group.propertyType));

            // Marketing Status filter
            // Check if any unit in the group has an active listing, draft listing, or is unlisted
            const hasActiveListing = group.units.some(unit => unit.hasActiveListing);
            const hasDraftListing = group.units.some(unit => unit.hasDraftListing);
            const isUnlisted = !hasActiveListing && !hasDraftListing;

            const matchesMarketingStatus = !filters.marketingStatus?.length ||
                (filters.marketingStatus.includes('listed') && hasActiveListing) ||
                (filters.marketingStatus.includes('unlisted') && isUnlisted) ||
                (filters.marketingStatus.includes('draft') && hasDraftListing);

            // Balance filter
            const matchesBalance = !filters.balance?.length ||
                (group.balanceCategory && filters.balance.includes(group.balanceCategory));

            return matchesSearch && matchesStatus && matchesOccupancy && matchesPropertyType && matchesMarketingStatus && matchesBalance;
        });
    }, [allUnitGroups, searchQuery, filters]);

    // Reset to first page when filters or search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filters]);

    // Calculate pagination
    const totalPages = Math.ceil(unitGroups.length / itemsPerPage);

    // Get current page items
    const currentUnitGroups = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return unitGroups.slice(startIndex, startIndex + itemsPerPage);
    }, [unitGroups, currentPage, itemsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const filterOptions: Record<string, FilterOption[]> = {
        status: [
            { value: 'active', label: 'Active' },
            { value: 'archived', label: 'Archived' },
        ],
        occupancy: [
            { value: 'occupied', label: 'Occupied' },
            { value: 'vacant', label: 'Vacant' },
            { value: 'partially_occupied', label: 'Partially Occupied' },
        ],
        propertyType: [
            { value: 'SINGLE', label: 'Single Apartment' },
            { value: 'MULTI', label: 'Multi Apartment' },
        ],
        marketingStatus: [
            { value: 'listed', label: 'Listed' },
            { value: 'unlisted', label: 'Unlisted' },
            { value: 'draft', label: 'Draft' },
        ],
        balance: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
        ]
    };

    const filterLabels: Record<string, string> = {
        status: 'Status',
        occupancy: 'Occupancy',
        propertyType: 'Property Type',
        marketingStatus: 'Marketing Status',
        balance: 'Balance'
    };

    return (
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen transition-all duration-300`}>
            {/* Breadcrumb */}
            <Breadcrumb
                items={[
                    { label: 'Dashboard', path: '/dashboard' },
                    { label: 'Units' }
                ]}
                className="mb-4 md:mb-6 px-3 md:px-4"
            />

            <div className="p-4 md:p-6 bg-[#E0E8E7] min-h-screen rounded-[1.5rem] md:rounded-[2rem] overflow-visible flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="flex items-center gap-1 md:gap-2">
                        <button onClick={() => navigate(-1)} className="p-1.5 md:p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-800" />
                        </button>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Units</h1>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={() => navigate('/dashboard/properties/import')}
                            className="hidden md:block px-5 py-2 text-sm font-medium text-white bg-[#3A6D6C] rounded-full hover:bg-[#2c5251] transition-colors"
                        >
                            Import
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/property/add')}
                            className="flex items-center gap-1 px-3 md:px-5 py-2 text-sm font-medium text-white bg-[#3A6D6C] rounded-full hover:bg-[#2c5251] transition-colors"
                        >
                            <span className="hidden md:inline">Add Properties</span>
                            <span className="md:hidden">Add</span>
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Filter */}
                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={setFilters}
                    initialFilters={filters}
                    showClearAll={true}
                />

                {/* Units List */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-gray-600">Loading units...</div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-red-600">Error loading units: {error instanceof Error ? error.message : 'Unknown error'}</div>
                        {error instanceof Error && (
                            <div className="mt-2 text-xs text-gray-500">
                                Check console for details
                            </div>
                        )}
                    </div>
                ) : unitGroups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="text-gray-600 mb-2">No units found</div>
                        {properties && properties.length > 0 && allUnitGroups.length === 0 && (
                            <div className="text-xs text-gray-500">
                                Found {properties.length} property(ies), but none have units or single unit details configured
                            </div>
                        )}
                        {allUnitGroups.length > 0 && (
                            <div className="text-xs text-gray-500 mt-2">
                                {allUnitGroups.length} unit group(s) found, but filtered out by search/filters. Try clearing your search or filters.
                            </div>
                        )}
                        {!properties && (
                            <div className="text-xs text-gray-500 mt-2">
                                No properties data available
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col">
                            {currentUnitGroups.map(group => (
                                group.units.length === 1 ? (
                                    <SingleUnitCard key={group.id} group={group} />
                                ) : (
                                    <UnitGroupCard key={group.id} group={group} />
                                )
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            className="mt-auto py-6"
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Units;
