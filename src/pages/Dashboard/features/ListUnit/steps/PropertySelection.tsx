import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Building, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import PropertyCard from '../components/PropertyCard';
import { leasingService } from '../../../../../services/leasing.service';
import { propertyService } from '../../../../../services/property.service';
import { listingService } from '../../../../../services/listing.service';
import { useGetAllPropertiesTransformed, useGetProperty, propertyQueryKeys } from '../../../../../hooks/usePropertyQueries';
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

// Check if property has an active listing
const hasActiveListing = async (propertyId: string): Promise<boolean> => {
  try {
    const listings = await listingService.getByPropertyId(propertyId);
    
    // If no listings exist, property doesn't have an active listing
    if (!listings || listings.length === 0) {
      return false;
    }
    
    // Check if any listing is active (listingStatus === 'ACTIVE' AND isActive === true)
    const hasActive = listings.some(
      listing => listing.listingStatus === 'ACTIVE' && listing.isActive === true
    );
    
    return hasActive;
  } catch (err) {
    // If error fetching listings (e.g., 404), assume no active listing
    console.error('Error checking active listing:', err);
    return false;
  }
};

// Check if property has all listing data filled (property, leasing, application, contact)
const isPropertyListingComplete = async (propertyId: string): Promise<boolean> => {
  try {
    // Check property details completeness
    const property = await propertyService.getOne(propertyId);
    
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

    // Check leasing data
    const leasing = await leasingService.getByPropertyId(propertyId);
    
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
    // Error fetching property, consider incomplete
    console.error('Error checking property completeness:', err);
    return false;
  }
};

const PropertySelection: React.FC<PropertySelectionProps> = ({ onCreateProperty, onEditProperty, onNext }) => {
  const { formData, updateFormData } = useListUnitStore();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [incompleteProperties, setIncompleteProperties] = useState<Property[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use React Query to fetch all properties
  // Refetch on mount to ensure fresh data (important when switching users)
  const { 
    data: allProperties = [], 
    isLoading: loading, 
    error: queryError,
    refetch: refetchProperties
  } = useGetAllPropertiesTransformed();

  // Use React Query to fetch full property data when selected
  const { 
    data: fullPropertyData
  } = useGetProperty(formData.property || null, !!formData.property);

  
  useEffect(() => {
    // Remove any stale property queries to prevent cross-user data leakage
    queryClient.removeQueries({ queryKey: propertyQueryKeys.all });
    // Refetch to get fresh data for current user
    refetchProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount

  // Filter properties based on completeness and active listing status
  useEffect(() => {
    const filterIncompleteProperties = async () => {
      if (!allProperties || allProperties.length === 0) {
        setIncompleteProperties([]);
        // If no properties and a property is selected, clear the selection
        if (formData.property) {
          updateFormData('property', '');
        }
        return;
      }

      // Check completeness and active listing status in parallel
      const propertyChecks = await Promise.all(
        allProperties.map(async (property) => ({
          property,
          isComplete: await isPropertyListingComplete(property.id),
          hasActiveListing: await hasActiveListing(property.id)
        }))
      );
      
      // Only show properties that:
      // 1. Are NOT complete (incomplete properties), AND
      // 2. Do NOT have an active listing (inactive listing)
      const incomplete = propertyChecks
        .filter(result => !result.isComplete && !result.hasActiveListing)
        .map(result => result.property);
      
      setIncompleteProperties(incomplete);
      
      // If currently selected property is now complete or has active listing, clear the selection
      if (formData.property) {
        const selectedProperty = propertyChecks.find(
          result => result.property.id === formData.property
        );
        
        if (selectedProperty && (selectedProperty.isComplete || selectedProperty.hasActiveListing)) {
          updateFormData('property', '');
        }
      }
    };

    filterIncompleteProperties();
  }, [allProperties, formData.property, updateFormData]);

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
