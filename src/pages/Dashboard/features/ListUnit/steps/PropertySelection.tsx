import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Plus, Building, Loader2 } from 'lucide-react';
import { useQueries } from '@tanstack/react-query';
import PropertyCard from '../components/PropertyCard';
import { propertyService } from '../../../../../services/property.service';
import { listingService } from '../../../../../services/listing.service';
import { unitService } from '../../../../../services/unit.service';
import { useGetAllProperties, useGetProperty } from '../../../../../hooks/usePropertyQueries';
import { useGetUnit } from '../../../../../hooks/useUnitQueries';
import { useListUnitStore } from '../store/listUnitStore';
import type { Property, BackendProperty } from '../../../../../services/property.service';
import type { BackendUnit } from '../../../../../services/unit.service';

interface PropertySelectionProps {
  onCreateProperty: () => void;
  onEditProperty?: (propertyId: string) => void;
  onNext?: (propertyId: string) => void;
}

// Utility function to determine the next incomplete property creation step
const getNextIncompleteStep = (property: BackendProperty): number | null => {
  // Step 1: GeneralInfo - needs propertyName and address
  if (!property.propertyName || !property.address) {
    return 1;
  }

  // Step 3: BasicAmenities - needs amenities with parking, laundry, airConditioning
  if (!property.amenities || 
      !property.amenities.parking || 
      !property.amenities.laundry || 
      !property.amenities.airConditioning) {
    return 3;
  }

  // Step 4: PropertyFeatures - needs propertyFeatures array (can be empty but should exist)
  if (!property.amenities.propertyFeatures) {
    return 4;
  }

  // Step 5: PropertyPhotos - needs coverPhotoUrl and at least one gallery photo (non-primary)
  if (!property.coverPhotoUrl) {
    return 5;
  }
  // Check for gallery photos (non-primary photos)
  const galleryPhotos = property.photos?.filter(p => !p.isPrimary) || [];
  if (galleryPhotos.length === 0) {
    return 5;
  }

  // Step 6: MarketingDescription - needs description
  if (!property.description) {
    return 6;
  }

  // All steps complete
  return null;
};

// Check if property has an active listing (lazy load if not in property data)
const checkHasActiveListing = async (property: BackendProperty, listingsCache: Map<string, any[]>): Promise<boolean> => {
  // If listings are already in property data, use them
  if (property.listings && property.listings.length > 0) {
    const hasActive = property.listings.some(
      (listing: any) => listing.listingStatus === 'ACTIVE' && listing.isActive === true && !listing.unitId
    );
    return hasActive;
  }
  
  // Otherwise, check cache first
  const cachedListings = listingsCache.get(property.id);
  if (cachedListings !== undefined) {
    return cachedListings.some(
      (listing: any) => listing.listingStatus === 'ACTIVE' && listing.isActive === true && !listing.unitId
    );
  }
  
  // Lazy load listings for this property
  try {
    const listings = await listingService.getByPropertyId(property.id);
    listingsCache.set(property.id, listings);
    
    return listings.some(
      (listing: any) => listing.listingStatus === 'ACTIVE' && listing.isActive === true && !listing.unitId
    );
  } catch (err) {
    // If error fetching listings, assume no active listing
    console.error('Error checking active listing:', err);
    listingsCache.set(property.id, []); // Cache empty result
    return false;
  }
};

// Check if unit has an active listing
const checkUnitHasActiveListing = async (unitId: string, listingsCache: Map<string, any[]>): Promise<boolean> => {
  // Check cache first
  const cachedListings = listingsCache.get(unitId);
  if (cachedListings !== undefined) {
    return cachedListings.some(
      (listing: any) => listing.listingStatus === 'ACTIVE' && listing.isActive === true && listing.unitId === unitId
    );
  }
  
  // Lazy load listings for this unit (we'll need to fetch by property and filter by unitId)
  // For now, return false and let the parent handle fetching
  return false;
};

// Check if property has all listing data filled (using data from BackendProperty)
const isPropertyListingComplete = (property: BackendProperty): boolean => {
  try {
    // Property must have: name, address, amenities, photos, description
    const hasPropertyDetails = !!(
      property.propertyName &&
      property.propertyName.trim() !== '' &&
      property.address &&
      property.address.streetAddress &&
      property.address.city &&
      property.address.stateRegion &&
      property.address.zipCode &&
      property.address.country &&
      property.amenities?.parking &&
      property.amenities?.parking !== 'NONE' &&
      property.amenities?.laundry &&
      property.amenities?.laundry !== 'NONE' &&
      property.amenities?.airConditioning &&
      property.amenities?.airConditioning !== 'NONE' &&
      property.coverPhotoUrl &&
      property.coverPhotoUrl.trim() !== '' &&
      property.photos &&
      property.photos.filter((p: { isPrimary: boolean }) => !p.isPrimary).length > 0 &&
      property.description &&
      property.description.trim() !== ''
    );

    if (!hasPropertyDetails) {
      return false;
    }

    // Check leasing data (already included in BackendProperty)
    const leasing = property.leasing;
    
    // If leasing doesn't exist (null), property is incomplete
    if (!leasing) {
      return false;
    }
    
    // Check all required leasing fields
    const monthlyRent = typeof leasing.monthlyRent === 'string' 
      ? parseFloat(leasing.monthlyRent) 
      : Number(leasing.monthlyRent);
    
    const hasLeasingData = !!(
      leasing.monthlyRent &&
      monthlyRent > 0 &&
      leasing.securityDeposit !== null &&
      leasing.securityDeposit !== undefined &&
      leasing.amountRefundable !== null &&
      leasing.amountRefundable !== undefined &&
      leasing.dateAvailable &&
      leasing.minLeaseDuration &&
      leasing.maxLeaseDuration &&
      leasing.description !== undefined // Description can be empty string but should exist
    );

    if (!hasLeasingData) {
      return false;
    }

    // Check pets policy - if petsAllowed is true, pet details must be filled
    if (leasing.petsAllowed === true) {
      const hasPetDetails = !!(
        Array.isArray(leasing.petCategory) &&
        leasing.petCategory.length > 0 &&
        (leasing.petDeposit !== null && leasing.petDeposit !== undefined) &&
        (leasing.petFee !== null && leasing.petFee !== undefined) &&
        leasing.petDescription &&
        leasing.petDescription.trim() !== ''
      );
      
      if (!hasPetDetails) {
        return false;
      }
    }

    // Check application settings - must be explicitly set (not null/undefined)
    const hasApplicationSettings = 
      leasing.onlineRentalApplication !== null &&
      leasing.onlineRentalApplication !== undefined;

    if (!hasApplicationSettings) {
      return false;
    }

    // Check application fee (if required)
    if (leasing.requireApplicationFee === true) {
      const applicationFee = typeof leasing.applicationFee === 'string'
        ? parseFloat(leasing.applicationFee)
        : Number(leasing.applicationFee);
      
      const hasApplicationFee = 
        leasing.applicationFee !== null && 
        leasing.applicationFee !== undefined &&
        !isNaN(applicationFee) &&
        applicationFee > 0;
      
      if (!hasApplicationFee) {
        return false;
      }
    }

    // Check listing contact - all fields must be filled
    const hasListingContact = !!(
      property.listingContactName &&
      property.listingContactName.trim() !== '' &&
      property.listingPhoneNumber &&
      property.listingPhoneNumber.trim() !== '' &&
      property.listingEmail &&
      property.listingEmail.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(property.listingEmail) // Basic email validation
    );

    if (!hasListingContact) {
      return false;
    }

    // All checks passed - property is complete
    return true;
  } catch (err) {
    // Error checking property, consider incomplete
    console.error('Error checking property completeness:', err);
    return false;
  }
};

// Interface for selectable items (properties or units)
interface SelectableItem {
  id: string;
  name: string;
  address: string;
  type: 'property' | 'unit';
  propertyId: string;
  unitId?: string;
  propertyType?: 'SINGLE' | 'MULTI';
  image?: string;
}

const PropertySelection: React.FC<PropertySelectionProps> = ({ onCreateProperty, onEditProperty, onNext }) => {
  const { formData, updateFormData } = useListUnitStore();
  const [isOpen, setIsOpen] = useState(false);
  const [incompleteProperties, setIncompleteProperties] = useState<Property[]>([]);
  const [selectableItems, setSelectableItems] = useState<SelectableItem[]>([]);
  const incompletePropertiesRef = useRef<Property[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use React Query to fetch all properties WITHOUT listings for better performance
  // Listings will be lazy loaded only when checking active status
  const { 
    data: allBackendProperties = [], 
    isLoading: loading, 
    error: queryError,
  } = useGetAllProperties(true, false); // enabled=true, includeListings=false
  
  // Get all MULTI properties to fetch their units
  const multiProperties = useMemo(() => {
    return allBackendProperties.filter(p => p.propertyType === 'MULTI') || [];
  }, [allBackendProperties]);

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

  // Use React Query to fetch full property data when selected
  const { 
    data: fullPropertyData
  } = useGetProperty(formData.property || null, !!formData.property);

  // Fetch unit data if unitId is selected
  const selectedUnitId = formData.unit || null;
  const { data: selectedUnitData } = useGetUnit(selectedUnitId, !!selectedUnitId);

  
  // Helper: shallow compare arrays of objects by id (order-insensitive)
  const areSameById = (a: { id: string }[] = [], b: { id: string }[] = []) => {
    if (a.length !== b.length) return false;
    const setA = new Set(a.map(x => x.id));
    return b.every(x => setA.has(x.id));
  };

  // Keep ref in sync with state
  useEffect(() => {
    incompletePropertiesRef.current = incompleteProperties;
  }, [incompleteProperties]);

  // Removed explicit refetch - React Query automatically fetches on mount
  // Cache invalidation is handled at logout/login in DashboardNavbar

  // Cache for listings to avoid redundant API calls
  const listingsCacheRef = useRef<Map<string, any[]>>(new Map());

  // Filter properties and units based on completeness and active listing status
  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!allBackendProperties || allBackendProperties.length === 0) {
        // Only update if it's different - use ref to avoid stale closure
        if (!areSameById(incompletePropertiesRef.current, [])) {
          if (!mounted) return;
          setIncompleteProperties([]);
          setSelectableItems([]);
        }
        return;
      }

      try {
        // Create a map of propertyId -> units data from unit queries
        const unitsByPropertyId = new Map<string, BackendUnit[]>();
        multiProperties.forEach((property, index) => {
          const unitsData = unitQueries[index]?.data;
          if (unitsData && Array.isArray(unitsData)) {
            unitsByPropertyId.set(property.id, unitsData);
          }
        });

        // Check completeness and active listings for ALL properties
        const propertyChecks = await Promise.all(
          allBackendProperties.map(async (backendProperty) => {
            const transformedProperty = propertyService.transformProperty(backendProperty);
            const isComplete = isPropertyListingComplete(backendProperty);
            
            // Check for active property-level listings (not unit-level)
            const hasActive = await checkHasActiveListing(backendProperty, listingsCacheRef.current);
            
            return {
              property: transformedProperty,
              backendProperty,
              isComplete,
              hasActiveListing: hasActive
            };
          })
        );

        // Filter incomplete properties (for SINGLE properties or MULTI properties without units)
        const newIncomplete = propertyChecks
          .filter(result => {
            // For MULTI properties, we'll show units separately, so exclude them from property list
            if (result.backendProperty.propertyType === 'MULTI') {
              return false;
            }
            return !result.isComplete && !result.hasActiveListing;
          })
          .map(result => result.property);

        // Build selectable items list
        const items: SelectableItem[] = [];

        // Add SINGLE properties that are incomplete and don't have active listings
        propertyChecks.forEach((result) => {
          if (result.backendProperty.propertyType === 'SINGLE' && !result.isComplete && !result.hasActiveListing) {
            const address = result.backendProperty.address
              ? `${result.backendProperty.address.streetAddress}, ${result.backendProperty.address.city}, ${result.backendProperty.address.stateRegion} ${result.backendProperty.address.zipCode}, ${result.backendProperty.address.country}`
              : 'Address not available';

            items.push({
              id: result.backendProperty.id,
              name: result.backendProperty.propertyName,
              address,
              type: 'property',
              propertyId: result.backendProperty.id,
              propertyType: 'SINGLE',
              image: result.backendProperty.coverPhotoUrl || result.backendProperty.photos?.[0]?.photoUrl || '',
            });
          }
        });

        // Add units from MULTI properties that don't have active listings
        // For MULTI properties, we need to check each unit individually
        // First, fetch and cache listings for all MULTI properties
        const propertyListingsCache = new Map<string, any[]>();
        const multiPropertyResults = propertyChecks.filter(
          result => result.backendProperty.propertyType === 'MULTI' && !result.isComplete
        );

        // Fetch listings for all MULTI properties in parallel
        await Promise.all(
          multiPropertyResults.map(async (result) => {
            try {
              const listings = await listingService.getByPropertyId(result.backendProperty.id);
              propertyListingsCache.set(result.backendProperty.id, listings);
            } catch (err) {
              console.error(`Error fetching listings for property ${result.backendProperty.id}:`, err);
              // Cache empty array on error - treat as no active listings (include units as fallback)
              propertyListingsCache.set(result.backendProperty.id, []);
            }
          })
        );

        // Now iterate units and check against cached listings
        for (const result of multiPropertyResults) {
          const units = unitsByPropertyId.get(result.backendProperty.id) || [];
          const propertyAddress = result.backendProperty.address
            ? `${result.backendProperty.address.streetAddress}, ${result.backendProperty.address.city}, ${result.backendProperty.address.stateRegion} ${result.backendProperty.address.zipCode}, ${result.backendProperty.address.country}`
            : 'Address not available';

          // Get cached listings for this property
          const propertyListings = propertyListingsCache.get(result.backendProperty.id) || [];

          // Check each unit for active listings using cached data
          for (const unit of units) {
            // Check if unit has active listing from cached listings
            const hasActiveUnitListing = propertyListings.some(
              (listing: any) => listing.unitId === unit.id && listing.listingStatus === 'ACTIVE' && listing.isActive === true
            );

            if (!hasActiveUnitListing) {
              const unitImage = unit.photos?.find((p: any) => p.isPrimary)?.photoUrl 
                || unit.photos?.[0]?.photoUrl 
                || unit.coverPhotoUrl 
                || result.backendProperty.coverPhotoUrl 
                || '';

              items.push({
                id: unit.id,
                name: `${result.backendProperty.propertyName} - ${unit.unitName || 'Unit'}`,
                address: propertyAddress,
                type: 'unit',
                propertyId: result.backendProperty.id,
                unitId: unit.id,
                propertyType: 'MULTI',
                image: unitImage,
              });
            }
          }
        }

        // Only update state if the list actually changed - use ref to avoid stale closure
        if (!areSameById(incompletePropertiesRef.current, newIncomplete)) {
          if (!mounted) return;
          setIncompleteProperties(newIncomplete);
        }

        // Update selectable items
        if (mounted) {
          setSelectableItems(items);
        }
      } catch (err) {
        // optionally handle/log error
        console.error('filterIncompleteProperties failed', err);
      }
    })();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBackendProperties, multiProperties, unitQueries]); // keep dependency on allBackendProperties, multiProperties, and unitQueries

  // Clear selected property/unit if it's no longer in selectable list
  useEffect(() => {
    const currentPropertyId = formData.property;
    const currentUnitId = formData.unit;

    // If no selectable items and something selected -> clear
    if (!selectableItems || selectableItems.length === 0) {
      if (currentPropertyId !== '' || currentUnitId !== '') {
        updateFormData('property', '');
        updateFormData('unit', '');
      }
      return;
    }

    // If selected property/unit is not in the selectable list, clear it
    const isInList = selectableItems.some(item => 
      item.propertyId === currentPropertyId && 
      (item.type === 'property' || item.unitId === currentUnitId)
    );

    if (!isInList && (currentPropertyId !== '' || currentUnitId !== '')) {
      updateFormData('property', '');
      updateFormData('unit', '');
    }
  }, [selectableItems, formData.property, formData.unit, updateFormData]);

  // Find selected item (property or unit)
  const selectedItem = selectableItems.find(item => 
    item.propertyId === formData.property && 
    (item.type === 'property' || item.unitId === formData.unit)
  );
  
  // For backward compatibility, also check incompleteProperties
  const selectedProperty = incompleteProperties.find(p => p.id === formData.property);
  const error = queryError ? (queryError instanceof Error ? queryError.message : 'Failed to load properties') : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNext = () => {
    if (!fullPropertyData || !onNext) return;

    // If a unit is selected, we can proceed directly (units don't need property completion)
    if (formData.unit && selectedUnitData) {
      onNext(fullPropertyData.id);
      return;
    }

    const nextStep = getNextIncompleteStep(fullPropertyData);
    
    if (nextStep !== null) {
      // Property has incomplete steps, open edit mode
      if (onEditProperty) {
        onEditProperty(fullPropertyData.id);
      }
    } else {
      // All property steps complete, proceed to lease
      onNext(fullPropertyData.id);
    }
  };

  const handleSelect = (item: SelectableItem) => {
    updateFormData('property', item.propertyId);
    if (item.type === 'unit' && item.unitId) {
      updateFormData('unit', item.unitId);
    } else {
      updateFormData('unit', ''); // Clear unit if selecting a property
    }
    setIsOpen(false);
  };

  const handleCreateProperty = () => {
    setIsOpen(false);
    onCreateProperty();
  };

  const handleDelete = () => {
    updateFormData('property', '');
    updateFormData('unit', '');
  };

  if (loading) {
    return (
      <div className="bg-transparent p-8 rounded-lg w-full flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
        <p className="mt-4 text-gray-600">Loading properties...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-transparent p-8 rounded-lg w-full flex flex-col items-center">
        <div className="w-full max-w-md bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Get cover photo URL from full property data or selected unit data
  const propertyImage = selectedUnitData?.photos?.find((p: any) => p.isPrimary)?.photoUrl
    || selectedUnitData?.photos?.[0]?.photoUrl
    || selectedUnitData?.coverPhotoUrl
    || fullPropertyData?.coverPhotoUrl 
    || fullPropertyData?.photos?.find((p) => p.isPrimary)?.photoUrl 
    || fullPropertyData?.photos?.[0]?.photoUrl 
    || selectedItem?.image
    || selectedProperty?.image 
    || '';

  // Get display name
  const displayName = selectedItem?.name || selectedProperty?.name || '';

  // Get address
  const address = selectedItem?.address || selectedProperty?.address || '';

  // Get price, bedrooms, bathrooms from unit or property
  const price = selectedUnitData?.rent 
    ? (typeof selectedUnitData.rent === 'string' ? parseFloat(selectedUnitData.rent) : Number(selectedUnitData.rent))
    : (fullPropertyData?.marketRent 
      ? (typeof fullPropertyData.marketRent === 'string' ? parseFloat(fullPropertyData.marketRent) : Number(fullPropertyData.marketRent))
      : 0);
  
  const bedrooms = selectedUnitData?.beds || fullPropertyData?.singleUnitDetails?.beds || 0;
  const bathrooms = selectedUnitData?.baths
    ? (typeof selectedUnitData.baths === 'string' ? parseFloat(selectedUnitData.baths) : Number(selectedUnitData.baths))
    : (fullPropertyData?.singleUnitDetails?.baths
      ? (typeof fullPropertyData.singleUnitDetails.baths === 'string' ? parseFloat(fullPropertyData.singleUnitDetails.baths) : Number(fullPropertyData.singleUnitDetails.baths))
      : 0);

  // Get country
  const country = fullPropertyData?.address?.country || (selectedItem?.address ? selectedItem.address.split(', ').pop() : undefined);

  return (
    <div className="bg-transparent p-8 rounded-lg w-full flex flex-col items-center">
      {selectedItem || selectedProperty ? (
        // Show Property Card when selected
        <PropertyCard
          property={{
            id: selectedItem?.propertyId || selectedProperty?.id || '',
            name: displayName,
            address,
            price,
            bedrooms,
            bathrooms,
            image: propertyImage,
            country,
          }}
          onDelete={handleDelete}
          onBack={handleDelete} // Reusing handleDelete as it clears selection, which is the desired "Back" behavior for now
          onEdit={onEditProperty && (selectedItem?.type === 'property' || selectedProperty) ? () => onEditProperty(selectedItem?.propertyId || selectedProperty?.id || '') : undefined}
          onNext={onNext ? handleNext : undefined}
        />
      ) : (
        // Show Dropdown when no selection
        <div className="w-full max-w-md relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Property</label>

          {/* Dropdown Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                <Building size={16} />
              </div>
              <span className="text-gray-500">Select a property</span>
            </div>
            <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-100">
              <div className="max-h-60 overflow-y-auto">
                {selectableItems.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No properties or units found. Create your first property!
                  </div>
                ) : (
                  selectableItems.map((item) => (
                    <button
                      key={`${item.type}-${item.id}`}
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.type === 'unit' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          <Building size={16} />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500 truncate">{item.address}</p>
                          {item.type === 'unit' && (
                            <p className="text-xs text-green-600 mt-0.5">Unit</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Create Property Option */}
              <button
                onClick={handleCreateProperty}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 text-[var(--color-primary)] font-medium border-t border-gray-200 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <Plus size={16} />
                </div>
                Create New Property
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertySelection;
