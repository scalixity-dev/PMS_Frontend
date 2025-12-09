import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import UnitGroupCard, { type UnitGroup } from './components/UnitGroupCard';
import SingleUnitCard from './components/SingleUnitCard';
import { useGetAllProperties } from '../../../../hooks/usePropertyQueries';
import { unitService } from '../../../../services/unit.service';
import type { Unit } from './components/UnitItem';

const Units: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const { data: properties, isLoading: isLoadingProperties, error: propertiesError } = useGetAllProperties();

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
    const isLoading = isLoadingProperties || isLoadingUnits;
    const error = propertiesError || unitsError;

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
                // Format address
                const address = property.address
                    ? `${property.address.streetAddress}, ${property.address.city}, ${property.address.stateRegion} ${property.address.zipCode}, ${property.address.country}`
                    : 'Address not available';

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
                            // Determine unit status
                            let unitStatus: 'Occupied' | 'Vacant' = 'Vacant';
                            if (unit.listings && Array.isArray(unit.listings) && unit.listings.length > 0) {
                                const activeListing = unit.listings[0];
                                if (activeListing.occupancyStatus === 'OCCUPIED' || activeListing.occupancyStatus === 'PARTIALLY_OCCUPIED') {
                                    unitStatus = 'Occupied';
                                }
                            } else if (unit.leasing) {
                                unitStatus = 'Occupied';
                            }

                            // Get unit image - prioritize unit photos, then coverPhotoUrl
                            // Show empty string (no image) if unit has no photos or coverPhotoUrl
                            let unitImage = '';
                            if (unit.photos && Array.isArray(unit.photos) && unit.photos.length > 0) {
                                // Use primary photo or first photo
                                const primaryPhoto = unit.photos.find((p: any) => p.isPrimary);
                                unitImage = primaryPhoto?.photoUrl || unit.photos[0].photoUrl;
                            } else if (unit.coverPhotoUrl) {
                                unitImage = unit.coverPhotoUrl;
                            }
                            // If no unit photos or coverPhotoUrl, unitImage remains empty string (will show "No Image")

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
                    
                    // Determine status for single unit
                    let unitStatus: 'Occupied' | 'Vacant' = 'Vacant';
                    // Check if property has active listings (property-level listings)
                    if (property.listings && Array.isArray(property.listings) && property.listings.length > 0) {
                        // For SINGLE properties, if there's an active listing, check leasing for occupancy
                        if (property.leasing) {
                            unitStatus = 'Occupied';
                        }
                    } else if (property.leasing) {
                        unitStatus = 'Occupied';
                    }

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
                    }];

                    status = unitStatus;
                }

                return {
                    id: property.id,
                    propertyName: property.propertyName,
                    address,
                    image,
                    status,
                    units,
                    propertyType: property.propertyType,
                };
            });
    }, [properties, unitQueries, multiProperties]);

    const unitGroups = useMemo(() => {
        return allUnitGroups.filter(group => {
            const matchesSearch = group.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                group.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                group.units.some(unit => unit.name.toLowerCase().includes(searchQuery.toLowerCase()));

            // Basic filter implementation - can be expanded based on specific requirements
            // Treat 'Partially Occupied' as occupied for filtering purposes
            const matchesDisplay = !filters.display?.length ||
                filters.display.includes('all') ||
                (filters.display.includes('occupied') && (group.status === 'Occupied' || group.status === 'Partially Occupied')) ||
                (filters.display.includes('vacant') && group.status === 'Vacant');

            return matchesSearch && matchesDisplay;
        });
    }, [allUnitGroups, searchQuery, filters]);

    const filterOptions: Record<string, FilterOption[]> = {
        display: [
            { value: 'all', label: 'All' },
            { value: 'occupied', label: 'Occupied' },
            { value: 'vacant', label: 'Vacant' }
        ],
        property: [
            { value: 'luxury', label: 'Luxury Apartment' },
            { value: 'avaza', label: 'Avaza Apartment' }
        ],
        unitType: [
            { value: 'single', label: 'Single Family' },
            { value: 'apartment', label: 'Apartment' }
        ],
        marketingStatus: [
            { value: 'listed', label: 'Listed' },
            { value: 'unlisted', label: 'Unlisted' }
        ]
    };

    const filterLabels: Record<string, string> = {
        display: 'Display',
        property: 'Property',
        unitType: 'Unit Type',
        marketingStatus: 'Marketing Status'
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Units</span>
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex items-center gap-6 mb-8">
                    <div className="flex items-center gap-2">
                        <button onClick={() => window.history.back()} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Units</h1>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-[#3A6D6C] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2">
                            Import
                        </button>
                        <button className="bg-[#3A6D6C] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2">
                            Add Properties
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
                <div className="flex flex-col">
                    {unitGroups.map(group => (
                        group.units.length === 1 ? (
                            <SingleUnitCard key={group.id} group={group} />
                        ) : (
                            <UnitGroupCard key={group.id} group={group} />
                        )
                    ))}
                </div>
                )}
            </div>
        </div>
    );
};

export default Units;
