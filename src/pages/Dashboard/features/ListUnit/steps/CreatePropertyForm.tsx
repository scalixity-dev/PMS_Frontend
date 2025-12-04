import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import GeneralInfo from './create-property/GeneralInfo';
import PropertySummaryMap from './create-property/PropertySummaryMap';
import BasicAmenities from './BasicAmenities';
import BasicAmenitiesExtended from './BasicAmenitiesExtended';
import PropertyFeatures from './create-property/PropertyFeatures';
import PropertyPhotos from './create-property/PropertyPhotos';
import MarketingDescription from './create-property/MarketingDescription';
import AddRibbon from './create-property/AddRibbon';
import NextStepButton from '../components/NextStepButton';
import { authService } from '../../../../../services/auth.service';
import { useCreatePropertyStore } from '../store/createPropertyStore';
import { useGetProperty, useUpdateProperty } from '../../../../../hooks/usePropertyQueries';

interface CreatePropertyFormProps {
  onSubmit: (propertyData: any) => void;
  propertyId?: string; // If provided, load existing property and resume from appropriate step
}

const CreatePropertyForm: React.FC<CreatePropertyFormProps> = ({ onSubmit, propertyId: initialPropertyId }) => {
  // Get state from Zustand store
  const {
    formData,
    currentStep,
    propertyId: storePropertyId,
    managerId: storeManagerId,
    setFormData,
    setCurrentStep,
    setPropertyId,
    setManagerId,
    prevStep: storePrevStep,
  } = useCreatePropertyStore();

  const [error, setError] = useState<string | null>(null);
  
  // Track if we've just created a property to prevent step reset
  const isNewlyCreatedRef = useRef(false);

  // Use store values or fallback to local state
  const propertyId = storePropertyId || initialPropertyId || null;
  const managerId = storeManagerId;

  // React Query hooks
  const { data: propertyData, isLoading: isLoadingProperty, error: propertyError } = useGetProperty(initialPropertyId || null, !!initialPropertyId);
  const updatePropertyMutation = useUpdateProperty();

  // Get current user ID on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        setManagerId(user.userId);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setError('Failed to load user information. Please refresh the page.');
      }
    };
    if (!managerId) {
      fetchUser();
    }
  }, [managerId, setManagerId]);

  // Load existing property data ONLY when editing (initialPropertyId is provided)
  // Don't load data when creating a new property - let GeneralInfo handle that
  useEffect(() => {
    // Only load if we have an initialPropertyId (editing mode) and property data
    if (!initialPropertyId || !propertyData) return;
    
    // Don't interfere if we just created this property
    if (isNewlyCreatedRef.current) return;

    setPropertyId(propertyData.id);

    // Map backend property to form data
    const mappedData: any = {
      propertyName: propertyData.propertyName || '',
      propertyType: propertyData.propertyType?.toLowerCase() || '',
      marketRent: propertyData.marketRent?.toString() || '',
      address: propertyData.address?.streetAddress || '',
      city: propertyData.address?.city || '',
      stateRegion: propertyData.address?.stateRegion || '',
      country: propertyData.address?.country || '',
      zip: propertyData.address?.zipCode || '',
      beds: propertyData.singleUnitDetails?.beds?.toString() || '',
      bathrooms: propertyData.singleUnitDetails?.baths?.toString() || '',
      sizeSquareFt: propertyData.sizeSqft?.toString() || '',
      yearBuilt: propertyData.yearBuilt?.toString() || '',
      parking: propertyData.amenities?.parking?.toLowerCase() || '',
      laundry: propertyData.amenities?.laundry?.toLowerCase() || '',
      ac: propertyData.amenities?.airConditioning?.toLowerCase() || '',
      extendedAmenities: propertyData.amenities?.propertyAmenities || [],
      features: propertyData.amenities?.propertyFeatures || [],
      marketingDescription: propertyData.description || '',
      coverPhoto: propertyData.coverPhotoUrl || propertyData.photos?.find(p => p.isPrimary)?.photoUrl || null,
      galleryPhotos: propertyData.photos?.filter(p => !p.isPrimary).map(p => p.photoUrl) || [],
      youtubeUrl: propertyData.youtubeUrl || '',
      ribbonType: propertyData.ribbonType?.toLowerCase() || 'none',
      ribbonTitle: propertyData.ribbonTitle || '',
    };

    setFormData((prev) => ({ ...prev, ...mappedData }));

    // Determine starting step based on what's completed (only when editing)
    let startingStep = 1;
    if (propertyData.propertyName && propertyData.address) {
      startingStep = 4; // Start from BasicAmenitiesExtended after BasicAmenities
      if (propertyData.amenities?.propertyAmenities && propertyData.amenities.propertyAmenities.length > 0) {
        if (propertyData.amenities?.propertyFeatures && propertyData.amenities.propertyFeatures.length > 0) {
          if (propertyData.photos && propertyData.photos.length > 0) {
            startingStep = 6; // PropertyPhotos completed
            if (propertyData.description) {
              startingStep = 7; // MarketingDescription completed
            }
          }
        }
      }
    }

    setCurrentStep(startingStep);
  }, [initialPropertyId, propertyData, setPropertyId, setFormData, setCurrentStep]);

  // Handle property loading error
  useEffect(() => {
    if (propertyError) {
      setError(propertyError instanceof Error ? propertyError.message : 'Failed to load property data. Please try again.');
    }
  }, [propertyError]);

  // updateFormData is now handled by the store

  // Map frontend amenity values to backend enum values
  // Since BasicAmenities now uses enum values directly, we just validate and pass through
  const mapParkingType = (value: string): 'NONE' | 'STREET' | 'GARAGE' | 'DRIVEWAY' | 'DEDICATED_SPOT' | 'PRIVATE_LOT' | 'ASSIGNED' => {
      const validValues: Array<'NONE' | 'STREET' | 'GARAGE' | 'DRIVEWAY' | 'DEDICATED_SPOT' | 'PRIVATE_LOT' | 'ASSIGNED'> = [
        'NONE', 'STREET', 'GARAGE', 'DRIVEWAY', 'DEDICATED_SPOT', 'PRIVATE_LOT', 'ASSIGNED'
      ];
      // Support both enum values and legacy lowercase values for backward compatibility
      const mapping: Record<string, 'NONE' | 'STREET' | 'GARAGE' | 'DRIVEWAY' | 'DEDICATED_SPOT' | 'PRIVATE_LOT' | 'ASSIGNED'> = {
        'none': 'NONE',
        'street': 'STREET',
        'garage': 'GARAGE',
        'driveway': 'DRIVEWAY',
        'dedicated_spot': 'DEDICATED_SPOT',
        'dedicated spot': 'DEDICATED_SPOT',
        'private_lot': 'PRIVATE_LOT',
        'private lot': 'PRIVATE_LOT',
        'assigned': 'ASSIGNED',
      };
      const upperValue = value.toUpperCase();
      if (validValues.includes(upperValue as any)) {
        return upperValue as any;
      }
      return mapping[value.toLowerCase()] || 'NONE';
    };

    const mapLaundryType = (value: string): 'NONE' | 'IN_UNIT' | 'ON_SITE' | 'HOOKUPS' => {
      const validValues: Array<'NONE' | 'IN_UNIT' | 'ON_SITE' | 'HOOKUPS'> = [
        'NONE', 'IN_UNIT', 'ON_SITE', 'HOOKUPS'
      ];
      // Support both enum values and legacy lowercase values for backward compatibility
      const mapping: Record<string, 'NONE' | 'IN_UNIT' | 'ON_SITE' | 'HOOKUPS'> = {
        'none': 'NONE',
        'in_unit': 'IN_UNIT',
        'in unit': 'IN_UNIT',
        'on_site': 'ON_SITE',
        'on site': 'ON_SITE',
        'hookups': 'HOOKUPS',
      };
      const upperValue = value.toUpperCase();
      if (validValues.includes(upperValue as any)) {
        return upperValue as any;
      }
      return mapping[value.toLowerCase()] || 'NONE';
    };

    const mapACType = (value: string): 'NONE' | 'CENTRAL' | 'WINDOW' | 'PORTABLE' | 'COOLER' => {
      const validValues: Array<'NONE' | 'CENTRAL' | 'WINDOW' | 'PORTABLE' | 'COOLER'> = [
        'NONE', 'CENTRAL', 'WINDOW', 'PORTABLE', 'COOLER'
      ];
      // Support both enum values and legacy lowercase values for backward compatibility
      const mapping: Record<string, 'NONE' | 'CENTRAL' | 'WINDOW' | 'PORTABLE' | 'COOLER'> = {
        'none': 'NONE',
        'central': 'CENTRAL',
        'window': 'WINDOW',
        'portable': 'PORTABLE',
        'cooler': 'COOLER',
      };
      const upperValue = value.toUpperCase();
      if (validValues.includes(upperValue as any)) {
        return upperValue as any;
      }
      return mapping[value.toLowerCase()] || 'NONE';
    };

  // Map ribbon type from frontend format to backend enum
  const mapRibbonType = (value: string): 'NONE' | 'CHAT' | 'CUSTOM' => {
    const mapping: Record<string, 'NONE' | 'CHAT' | 'CUSTOM'> = {
      'none': 'NONE',
      'chat': 'CHAT',
      'custom': 'CUSTOM',
    };
    const upperValue = value.toUpperCase();
    if (upperValue === 'NONE' || upperValue === 'CHAT' || upperValue === 'CUSTOM') {
      return upperValue as 'NONE' | 'CHAT' | 'CUSTOM';
    }
    return mapping[value.toLowerCase()] || 'NONE';
  };

  // Map form data to backend DTO format
  const mapFormDataToBackend = () => {
    // Map property type - for now, assume all are SINGLE properties
    // (since GeneralInfo has beds/bathrooms directly, not units)
    const propertyType: 'SINGLE' | 'MULTI' = 'SINGLE';

    // Prepare address object
    const address = formData.address && formData.city && formData.stateRegion && formData.zip && formData.country
      ? {
          streetAddress: formData.address,
          city: formData.city,
          stateRegion: formData.stateRegion,
          zipCode: formData.zip,
          country: formData.country,
        }
      : undefined;

    // Prepare single unit details
    const singleUnitDetails = formData.beds
      ? {
          beds: parseInt(formData.beds) || 0,
          baths: formData.bathrooms ? parseFloat(formData.bathrooms) : undefined,
          marketRent: formData.marketRent ? parseFloat(formData.marketRent) : undefined,
        }
      : undefined;

    // Prepare amenities
    const amenities = formData.parking || formData.laundry || formData.ac || (Array.isArray(formData.extendedAmenities) && formData.extendedAmenities.length > 0) || (Array.isArray(formData.features) && formData.features.length > 0)
      ? {
          parking: mapParkingType(formData.parking || 'none'),
          laundry: mapLaundryType(formData.laundry || 'none'),
          airConditioning: mapACType(formData.ac || 'none'),
          propertyAmenities: Array.isArray(formData.extendedAmenities) ? formData.extendedAmenities : [],
          propertyFeatures: Array.isArray(formData.features) ? formData.features : [],
        }
      : undefined;

    // Prepare photos
    const photos: Array<{ photoUrl: string; isPrimary: boolean }> = [];
    if (formData.coverPhoto) {
      // Extract URL from coverPhoto (can be string or PhotoFile object)
      const coverPhotoUrl = typeof formData.coverPhoto === 'string' 
        ? formData.coverPhoto 
        : formData.coverPhoto.previewUrl || '';
      if (coverPhotoUrl) {
        photos.push({ photoUrl: coverPhotoUrl, isPrimary: true });
      }
    }
    if (Array.isArray(formData.galleryPhotos)) {
      formData.galleryPhotos.forEach((photo) => {
        // Extract URL from photo (can be string or PhotoFile object)
        const photoUrl = typeof photo === 'string' 
          ? photo 
          : photo.previewUrl || '';
        if (photoUrl && !photos.some(p => p.photoUrl === photoUrl)) {
          photos.push({ photoUrl: photoUrl, isPrimary: false });
        }
      });
    }

    return {
      managerId: managerId!,
      propertyName: formData.propertyName,
      propertyType,
      yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : undefined,
      sizeSqft: formData.sizeSquareFt ? parseFloat(formData.sizeSquareFt) : undefined,
      marketRent: formData.marketRent ? parseFloat(formData.marketRent) : undefined,
      address,
      description: formData.marketingDescription || undefined,
      ribbonType: mapRibbonType(formData.ribbonType || 'none'),
      ribbonTitle: formData.ribbonTitle && formData.ribbonType !== 'none' ? formData.ribbonTitle : undefined,
      singleUnitDetails,
      amenities,
      photos: photos.length > 0 ? photos : undefined,
    };
  };

  // Handle property creation from GeneralInfo
  // This is called when GeneralInfo saves - move to step 2 (PropertySummaryMap)
  const handlePropertyCreated = (id: string) => {
    // Mark that we just created this property
    isNewlyCreatedRef.current = true;
    setPropertyId(id);
    // Move to step 2 (PropertySummaryMap) after saving GeneralInfo
    setCurrentStep(2);
    // Clear the flag after a short delay to allow step update to complete
    setTimeout(() => {
      isNewlyCreatedRef.current = false;
    }, 100);
  };

  const handleNext = async () => {
    // Save basic amenities (parking, laundry, AC) when on step 3 (BasicAmenities)
    if (currentStep === 3) {
      if (!managerId || !propertyId) {
        setError('Property information not available. Please start from step 1.');
        return;
      }

      setError(null);

      try {
        // Prepare amenities with parking, laundry, and AC
        // Always provide all three fields (required by DTO), using selected values or 'NONE' as default
        const amenities = {
          parking: mapParkingType(formData.parking || 'NONE'),
          laundry: mapLaundryType(formData.laundry || 'NONE'),
          airConditioning: mapACType(formData.ac || 'NONE'),
          // Preserve existing extended amenities and features if any
          propertyAmenities: Array.isArray(formData.extendedAmenities) ? formData.extendedAmenities : [],
          propertyFeatures: Array.isArray(formData.features) ? formData.features : [],
        };

        const updateData: any = {
          amenities: amenities,
        };

        await updatePropertyMutation.mutateAsync({
          propertyId,
          updateData,
        });
        setCurrentStep(currentStep + 1);
      } catch (err) {
        console.error('Error updating basic amenities:', err);
        setError(err instanceof Error ? err.message : 'Failed to save amenities. Please try again.');
      }
      return;
    }

    // Save extended amenities when on step 4 (BasicAmenitiesExtended)
    if (currentStep === 4) {
      if (!managerId || !propertyId) {
        setError('Property information not available. Please start from step 1.');
        return;
      }

      setError(null);

      try {
        // Prepare amenities with extended amenities for update
        // Include parking, laundry, AC from previous step and add extended amenities
        const amenities = {
          parking: mapParkingType(formData.parking || 'NONE'),
          laundry: mapLaundryType(formData.laundry || 'NONE'),
          airConditioning: mapACType(formData.ac || 'NONE'),
          propertyAmenities: Array.isArray(formData.extendedAmenities) ? formData.extendedAmenities : [],
          // Preserve existing features if any
          propertyFeatures: Array.isArray(formData.features) ? formData.features : [],
        };

        const updateData: any = {
          amenities: amenities,
        };

        await updatePropertyMutation.mutateAsync({
          propertyId,
          updateData,
        });
        setCurrentStep(currentStep + 1);
      } catch (err) {
        console.error('Error updating extended amenities:', err);
        setError(err instanceof Error ? err.message : 'Failed to save extended amenities. Please try again.');
      }
      return;
    }

    // Save features when on step 5 (PropertyFeatures)
    if (currentStep === 5) {
      if (!managerId || !propertyId) {
        setError('Property information not available. Please start from step 1.');
        return;
      }

      setError(null);

      try {
        // Prepare amenities with features for update
        // Include parking, laundry, AC, extended amenities from previous steps and add features
        // Always provide all three fields (required by DTO), using selected values or 'NONE' as default
        const amenities = {
          parking: mapParkingType(formData.parking || 'NONE'),
          laundry: mapLaundryType(formData.laundry || 'NONE'),
          airConditioning: mapACType(formData.ac || 'NONE'),
          propertyAmenities: Array.isArray(formData.extendedAmenities) ? formData.extendedAmenities : [],
          propertyFeatures: Array.isArray(formData.features) ? formData.features : [],
        };

        const updateData: any = {
          amenities: amenities,
        };

        await updatePropertyMutation.mutateAsync({
          propertyId,
          updateData,
        });
        setCurrentStep(currentStep + 1);
      } catch (err) {
        console.error('Error updating property features:', err);
        setError(err instanceof Error ? err.message : 'Failed to save features. Please try again.');
      }
      return;
    }

    // Save photos when on step 6 (PropertyPhotos)
    if (currentStep === 6) {
      // Validate cover photo (required)
      if (!formData.coverPhoto) {
        setError('Cover photo is required. Please upload a cover photo.');
        return;
      }

      // Validate gallery photos (required - at least one)
      if (!formData.galleryPhotos || formData.galleryPhotos.length === 0) {
        setError('At least one gallery photo is required. Please add gallery photos.');
        return;
      }

      // Validate YouTube URL format if provided (optional)
      if (formData.youtubeUrl && formData.youtubeUrl.trim()) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        if (!youtubeRegex.test(formData.youtubeUrl.trim())) {
          setError('Please enter a valid YouTube URL.');
          return;
        }
      }

      if (!managerId || !propertyId) {
        setError('Property information not available. Please start from step 1.');
        return;
      }

      setError(null);

      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        
        // Handle cover photo - can be a string URL (existing) or object with file (new upload)
        let coverPhotoUrl: string;
        
        if (typeof formData.coverPhoto === 'string') {
          // Existing cover photo URL - use it directly
          coverPhotoUrl = formData.coverPhoto;
        } else if (formData.coverPhoto && typeof formData.coverPhoto === 'object' && 'file' in formData.coverPhoto) {
          // New cover photo upload
          const coverPhotoFile = (formData.coverPhoto as { file: File; previewUrl: string }).file;
          if (!coverPhotoFile) {
            throw new Error('Cover photo file is missing');
          }

          const coverPhotoFormData = new FormData();
          coverPhotoFormData.append('file', coverPhotoFile);
          coverPhotoFormData.append('propertyId', propertyId);

          const coverPhotoResponse = await fetch(`${API_BASE_URL}/upload/image`, {
            method: 'POST',
            credentials: 'include',
            body: coverPhotoFormData,
          });

          if (!coverPhotoResponse.ok) {
            const errorData = await coverPhotoResponse.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to upload cover photo');
          }

          const coverPhotoData = await coverPhotoResponse.json();
          coverPhotoUrl = coverPhotoData.url;
        } else {
          throw new Error('Cover photo is invalid');
        }

        // Handle gallery photos - can be strings (existing URLs) or objects with files (new uploads)
        const galleryPhotoUrls: string[] = [];
        const galleryPhotos = formData.galleryPhotos || [];
        
        for (const galleryPhoto of galleryPhotos) {
          if (typeof galleryPhoto === 'string') {
            // Existing gallery photo URL - use it directly
            galleryPhotoUrls.push(galleryPhoto);
          } else if (galleryPhoto && typeof galleryPhoto === 'object' && 'file' in galleryPhoto) {
            // New gallery photo upload
            const galleryPhotoFile = (galleryPhoto as { file: File; previewUrl: string }).file;
            if (galleryPhotoFile) {
              const galleryFormData = new FormData();
              galleryFormData.append('file', galleryPhotoFile);
              galleryFormData.append('propertyId', propertyId);

              const galleryResponse = await fetch(`${API_BASE_URL}/upload/image`, {
                method: 'POST',
                credentials: 'include',
                body: galleryFormData,
              });

              if (galleryResponse.ok) {
                const galleryData = await galleryResponse.json();
                galleryPhotoUrls.push(galleryData.url);
              } else {
                console.warn('Failed to upload gallery photo:', galleryPhoto);
              }
            }
          }
        }

        // Prepare photos array for PropertyPhoto table
        // The /upload/image endpoint already creates PropertyPhoto records,
        // but we need to ensure the cover photo is marked as primary
        const photos = [
          { photoUrl: coverPhotoUrl, isPrimary: true },
          ...galleryPhotoUrls.map(url => ({ photoUrl: url, isPrimary: false })),
        ];

        // Update property with coverPhotoUrl, photos (to set isPrimary correctly), and youtubeUrl
        const updateData: any = {
          coverPhotoUrl: coverPhotoUrl,
          youtubeUrl: formData.youtubeUrl || null,
          photos: photos,
        };

        await updatePropertyMutation.mutateAsync({
          propertyId,
          updateData,
        });
        setCurrentStep(currentStep + 1);
      } catch (err) {
        console.error('Error uploading photos:', err);
        setError(err instanceof Error ? err.message : 'Failed to upload photos. Please try again.');
      }
      return;
    }

    // Save marketing description when on step 7 (MarketingDescription)
    if (currentStep === 7) {
      if (!managerId || !propertyId) {
        setError('Property information not available. Please start from step 1.');
        return;
      }

      setError(null);

      try {
        // Update property with marketing description
        const updateData: any = {
          description: formData.marketingDescription || null,
        };

        const updatedProperty = await updatePropertyMutation.mutateAsync({
          propertyId,
          updateData,
        });
        
        // If property is already complete (being edited), allow completing directly from step 7
        // Otherwise, move to step 8 (AddRibbon)
        if (initialPropertyId && propertyData) {
          // Property is being edited and is already complete - complete the form
          onSubmit(updatedProperty);
        } else {
          // New property or incomplete - move to step 8
          setCurrentStep(currentStep + 1);
        }
      } catch (err) {
        console.error('Error updating marketing description:', err);
        setError(err instanceof Error ? err.message : 'Failed to save description. Please try again.');
      }
      return;
    }

    // Save ribbon data when on step 8 (AddRibbon)
    if (currentStep === 8) {
      if (!managerId || !propertyId) {
        setError('Property information not available. Please start from step 1.');
        return;
      }

      setError(null);

      try {
        // Map ribbon type to backend format
        const ribbonType = mapRibbonType(formData.ribbonType || 'none');
        
        // Update property with ribbon data
        const updateData: any = {
          ribbonType: ribbonType,
          ribbonTitle: formData.ribbonTitle && formData.ribbonType !== 'none' ? formData.ribbonTitle : null,
        };

        // The mutation returns the updated property
        const updatedProperty = await updatePropertyMutation.mutateAsync({
          propertyId,
          updateData,
        });
        
        // Call the onSubmit callback with the updated property
        onSubmit(updatedProperty);
      } catch (err) {
        console.error('Error updating ribbon:', err);
        setError(err instanceof Error ? err.message : 'Failed to save ribbon. Please try again.');
      }
      return;
    }

    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    } else {
      // Update existing property with remaining data
      if (!managerId || !propertyId) {
        setError('Property information not available. Please start from step 1.');
        return;
      }

      setError(null);

      try {
        const backendData = mapFormDataToBackend();
        // Remove managerId and propertyName from update (they shouldn't change)
        const { managerId: _, propertyName: __, ...updateData } = backendData;
        const updatedProperty = await updatePropertyMutation.mutateAsync({
          propertyId,
          updateData,
        });
        
        // Call the onSubmit callback with the updated property
        onSubmit(updatedProperty);
      } catch (err) {
        console.error('Error updating property:', err);
        setError(err instanceof Error ? err.message : 'Failed to update property. Please try again.');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      storePrevStep();
    }
  };

  // Helper function to update form data using store
  const updateFormDataHelper = (key: string, value: any) => {
    const { updateFormData } = useCreatePropertyStore.getState();
    updateFormData(key as any, value);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <GeneralInfo 
          onPropertyCreated={handlePropertyCreated}
          propertyId={propertyId || undefined}
        />;
      case 2:
        return <PropertySummaryMap onBack={handleBack} />;
      case 3:
        return <BasicAmenities data={formData} updateData={updateFormDataHelper} />;
      case 4:
        return <BasicAmenitiesExtended data={formData} updateData={updateFormDataHelper} />;
      case 5:
        return <PropertyFeatures />;
      case 6:
        return <PropertyPhotos />;
      case 7:
        return <MarketingDescription />;
      case 8:
        return <AddRibbon />;
      default:
        return null;
    }
  };

  if (isLoadingProperty) {
    return (
      <div className="w-full flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)] mb-4"></div>
          <p className="text-gray-600">Loading property data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      {/* Step Content */}
      <div className="w-full mb-8">
        {renderStep()}
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-md mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {/* Navigation Buttons - Only show for steps 2-7 (step 1 has its own save button) */}
      {currentStep > 1 && (
        <div className="flex gap-4 pt-4 w-full max-w-md justify-center">
          {/* Back Button */}
          <button
            onClick={handleBack}
            disabled={updatePropertyMutation.isPending || currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          {/* Next Button */}
          <NextStepButton onClick={handleNext} disabled={updatePropertyMutation.isPending || !managerId || !propertyId}>
            {updatePropertyMutation.isPending 
              ? 'Updating...' 
              : currentStep === 8 || (currentStep === 7 && initialPropertyId && propertyData)
              ? 'Complete Property' 
              : 'Next'}
          </NextStepButton>
        </div>
      )}
    </div>
  );
};

export default CreatePropertyForm;
