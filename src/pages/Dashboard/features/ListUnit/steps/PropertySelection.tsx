import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Building, Loader2 } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { propertyService } from '../../../../../services/property.service';
import { listingService } from '../../../../../services/listing.service';
import { useGetAllProperties, useGetProperty } from '../../../../../hooks/usePropertyQueries';
import { useListUnitStore } from '../store/listUnitStore';
import type { Property, BackendProperty } from '../../../../../services/property.service';

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
      (listing: any) => listing.listingStatus === 'ACTIVE' && listing.isActive === true
    );
    return hasActive;
  }
  
  // Otherwise, check cache first
  const cachedListings = listingsCache.get(property.id);
  if (cachedListings !== undefined) {
    return cachedListings.some(
      (listing: any) => listing.listingStatus === 'ACTIVE' && listing.isActive === true
    );
  }
  
  // Lazy load listings for this property
  try {
    const listings = await listingService.getByPropertyId(property.id);
    listingsCache.set(property.id, listings);
    
    return listings.some(
      (listing: any) => listing.listingStatus === 'ACTIVE' && listing.isActive === true
    );
  } catch (err) {
    // If error fetching listings, assume no active listing
    console.error('Error checking active listing:', err);
    listingsCache.set(property.id, []); // Cache empty result
    return false;
  }
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

const PropertySelection: React.FC<PropertySelectionProps> = ({ onCreateProperty, onEditProperty, onNext }) => {
  const { formData, updateFormData } = useListUnitStore();
  const [isOpen, setIsOpen] = useState(false);
  const [incompleteProperties, setIncompleteProperties] = useState<Property[]>([]);
  const incompletePropertiesRef = useRef<Property[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use React Query to fetch all properties WITHOUT listings for better performance
  // Listings will be lazy loaded only when checking active status
  const { 
    data: allBackendProperties = [], 
    isLoading: loading, 
    error: queryError,
  } = useGetAllProperties(true, false); // enabled=true, includeListings=false
  
  // Transform backend properties to Property format for display (only when needed)
  // We'll transform on-demand in the filter effect to avoid unnecessary computation

  // Use React Query to fetch full property data when selected
  const { 
    data: fullPropertyData
  } = useGetProperty(formData.property || null, !!formData.property);

  
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

  // Filter properties based on completeness and active listing status
  useEffect(() => {
    let mounted = true;

    (async () => {
      if (!allBackendProperties || allBackendProperties.length === 0) {
        // Only update if it's different - use ref to avoid stale closure
        if (!areSameById(incompletePropertiesRef.current, [])) {
          if (!mounted) return;
          setIncompleteProperties([]);
        }
        return;
      }

      try {
        // Check completeness and active listings for ALL properties
        // Exclude properties that have active listings (already listed)
        const propertyChecks = await Promise.all(
          allBackendProperties.map(async (backendProperty) => {
            const transformedProperty = propertyService.transformProperty(backendProperty);
            const isComplete = isPropertyListingComplete(backendProperty);
            
            // Check for active listings for ALL properties (not just complete ones)
            // Properties with active listings should be excluded from selection
            const hasActive = await checkHasActiveListing(backendProperty, listingsCacheRef.current);
            
            return {
              property: transformedProperty,
              isComplete,
              hasActiveListing: hasActive
            };
          })
        );

        // Filter to show only:
        // 1. Incomplete properties (need more data)
        // 2. AND properties without active listings (not already listed)
        const newIncomplete = propertyChecks
          .filter(result => !result.isComplete && !result.hasActiveListing)
          .map(result => result.property);

        // Only update state if the list actually changed - use ref to avoid stale closure
        if (!areSameById(incompletePropertiesRef.current, newIncomplete)) {
          if (!mounted) return;
          setIncompleteProperties(newIncomplete);
        }
      } catch (err) {
        // optionally handle/log error
        console.error('filterIncompleteProperties failed', err);
      }
    })();

    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allBackendProperties]); // keep dependency on allBackendProperties only

  // Clear selected property if it's no longer in incomplete list
  useEffect(() => {
    const currentPropertyId = formData.property; // include current value in deps
    if (!currentPropertyId) return; // nothing selected

    // If no incomplete properties and property selected -> clear
    if (!incompleteProperties || incompleteProperties.length === 0) {
      if (currentPropertyId !== '') {
        updateFormData('property', '');
      }
      return;
    }

    // If selected property is not in the incomplete list, clear it
    const isPropertyInList = incompleteProperties.some(p => p.id === currentPropertyId);
    if (!isPropertyInList && currentPropertyId !== '') {
      updateFormData('property', '');
    }
  }, [incompleteProperties, formData.property, updateFormData]); // now depends on the current selected id

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

  const handleSelect = (propertyId: string) => {
    updateFormData('property', propertyId);
    setIsOpen(false);
  };

  const handleCreateProperty = () => {
    setIsOpen(false);
    onCreateProperty();
  };

  const handleDelete = () => {
    updateFormData('property', '');
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

  // Get cover photo URL from full property data if available, otherwise use transformed property image
  const propertyImage = fullPropertyData?.coverPhotoUrl 
    || fullPropertyData?.photos?.find((p) => p.isPrimary)?.photoUrl 
    || fullPropertyData?.photos?.[0]?.photoUrl 
    || selectedProperty?.image 
    || '';

  return (
    <div className="bg-transparent p-8 rounded-lg w-full flex flex-col items-center">
      {selectedProperty ? (
        // Show Property Card when selected
        <PropertyCard
          property={{
            ...selectedProperty,
            image: propertyImage,
            country: fullPropertyData?.address?.country, // Pass country for currency symbol
          }}
          onDelete={handleDelete}
          onBack={handleDelete} // Reusing handleDelete as it clears selection, which is the desired "Back" behavior for now
          onEdit={onEditProperty ? () => onEditProperty(selectedProperty.id) : undefined}
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
                {incompleteProperties.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No properties found in database. Create your first property!
                  </div>
                ) : (
                  incompleteProperties.map((property) => (
                    <button
                      key={property.id}
                      onClick={() => handleSelect(property.id)}
                      className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                          <Building size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900">{property.name}</p>
                          <p className="text-xs text-gray-500">{property.unit}</p>
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
