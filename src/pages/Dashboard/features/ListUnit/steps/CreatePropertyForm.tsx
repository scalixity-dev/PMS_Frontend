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
import { useGetProperty, useUpdateProperty, useCreateProperty } from '../../../../../hooks/usePropertyQueries';

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
    resetForm,
  } = useCreatePropertyStore();

  const [error, setError] = useState<string | null>(null);
  // True while photo files are being uploaded to S3 (step 6).
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);

  // Track if we've just created a property to prevent step reset
  const isNewlyCreatedRef = useRef(false);

  // Track previous initialPropertyId to detect when we switch between create/edit
  const previousInitialPropertyIdRef = useRef<string | undefined>(initialPropertyId);

  // Use store values or fallback to local state
  const propertyId = storePropertyId || initialPropertyId || null;
  const managerId = storeManagerId;

  // Reset form when switching from edit to create mode (initialPropertyId changes from value to undefined)
  useEffect(() => {
    // If we had a propertyId before and now we don't (switching to create mode), reset the form
    if (previousInitialPropertyIdRef.current && !initialPropertyId) {
      resetForm();
    }
    previousInitialPropertyIdRef.current = initialPropertyId;
  }, [initialPropertyId, resetForm]);

  // React Query hooks
  const { data: propertyData, isLoading: isLoadingProperty, error: propertyError } = useGetProperty(initialPropertyId || null, !!initialPropertyId);
  const updatePropertyMutation = useUpdateProperty();
  const createPropertyMutation = useCreateProperty();

  // The form is "busy" (block Next) while any save is in flight.
  const isBusy = createPropertyMutation.isPending || updatePropertyMutation.isPending || isUploadingPhotos;

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

  // Track previous propertyId to detect changes
  const previousPropertyIdRef = useRef<string | undefined>(initialPropertyId);
  // Track if we've already loaded the data for this property to prevent re-loading
  const dataLoadedForPropertyRef = useRef<string | null>(null);

  // Load existing property data when editing (initialPropertyId is provided)
  // When editing, pre-fill all form fields and start from step 1 (like creation flow)
  useEffect(() => {
    // Only load if we have an initialPropertyId (editing mode) and property data
    if (!initialPropertyId || !propertyData) {
      // If we were editing and now we're not, reset the form
      if (previousPropertyIdRef.current && !initialPropertyId) {
        resetForm();
        previousPropertyIdRef.current = undefined;
        dataLoadedForPropertyRef.current = null;
      }
      return;
    }

    // Don't interfere if we just created this property
    if (isNewlyCreatedRef.current) return;

    // If we've already loaded data for this property, don't reload (prevents step reset)
    if (dataLoadedForPropertyRef.current === propertyData.id) {
      return;
    }

    // If propertyId changed, reset form first to avoid mixing data
    if (previousPropertyIdRef.current && previousPropertyIdRef.current !== initialPropertyId) {
      resetForm();
      dataLoadedForPropertyRef.current = null;
    }
    previousPropertyIdRef.current = initialPropertyId;

    setPropertyId(propertyData.id);


    const formatDecimalForInput = (value: unknown): string => {
      if (value === null || value === undefined) return '';
      const num = Number(value);
      if (Number.isNaN(num)) return String(value);
      return num.toString();
    };

    const mappedData: any = {
      propertyName: propertyData.propertyName || '',
      propertyType: '',
      isManufactured: '', // Will be set by user in GeneralInfo if needed
      marketRent: formatDecimalForInput(propertyData.marketRent),
      address: propertyData.address?.streetAddress || '',
      city: propertyData.address?.city || '',
      stateRegion: propertyData.address?.stateRegion || '',
      country: propertyData.address?.country || '',
      zip: propertyData.address?.zipCode || '',
      beds: propertyData.singleUnitDetails?.beds?.toString() || '',
      bathrooms: formatDecimalForInput(propertyData.singleUnitDetails?.baths),
      sizeSquareFt: formatDecimalForInput(propertyData.sizeSqft),
      yearBuilt: propertyData.yearBuilt?.toString() || '',
      // Keep amenities in UPPERCASE (enum values) - BasicAmenities expects uppercase
      parking: propertyData.amenities?.parking || '',
      laundry: propertyData.amenities?.laundry || '',
      ac: propertyData.amenities?.airConditioning || '',
      extendedAmenities: propertyData.amenities?.propertyAmenities || [],
      features: propertyData.amenities?.propertyFeatures || [],
      marketingDescription: propertyData.description || '',
      coverPhoto: propertyData.coverPhotoUrl || propertyData.photos?.find(p => p.isPrimary)?.photoUrl || null,
      galleryPhotos: propertyData.photos?.filter(p => !p.isPrimary).map(p => p.photoUrl) || [],
      youtubeUrl: propertyData.youtubeUrl || '',
      ribbonType: propertyData.ribbonType?.toLowerCase() || 'none',
      ribbonTitle: propertyData.ribbonTitle || '',
    };

    // Set all form data at once
    setFormData(mappedData);

    // Mark that we've loaded data for this property
    dataLoadedForPropertyRef.current = propertyData.id;

    // When editing, always start from step 1 (GeneralInfo) with pre-filled data
    // This makes the edit flow work exactly like creation flow, but with existing data
    // Only set step to 1 on initial load (when storePropertyId doesn't match or is null)
    // This prevents resetting step when user navigates through the form
    if (!storePropertyId || storePropertyId !== propertyData.id) {
      setCurrentStep(1);
    }
  }, [initialPropertyId, propertyData, setPropertyId, setFormData, setCurrentStep, resetForm, currentStep, storePropertyId]);

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

    // Prepare photos. By the time we build the final payload the photo step has
    // already uploaded any File objects and replaced them with URL strings.
    const photos: Array<{ photoUrl: string; isPrimary: boolean }> = [];
    let coverPhotoUrl = '';
    if (formData.coverPhoto) {
      // Extract URL from coverPhoto (can be string or PhotoFile object)
      coverPhotoUrl = typeof formData.coverPhoto === 'string'
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
      coverPhotoUrl: coverPhotoUrl || undefined,
      youtubeUrl: formData.youtubeUrl || undefined,
      ribbonType: mapRibbonType(formData.ribbonType || 'none'),
      ribbonTitle: formData.ribbonTitle && formData.ribbonType !== 'none' ? formData.ribbonTitle : undefined,
      singleUnitDetails,
      amenities,
      photos: photos.length > 0 ? photos : undefined,
    };
  };

  // Upload a single photo File to S3 WITHOUT a propertyId — the endpoint just
  // returns the URL and creates no DB row (the final create/update persists the
  // photo set). Existing photos are already URL strings and pass through.
  const uploadPhotoFile = async (file: File): Promise<string> => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      credentials: 'include',
      body: fd,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to upload image');
    }
    const data = await res.json();
    return data.url;
  };

  const resolvePhotoToUrl = async (photo: any): Promise<string> => {
    if (typeof photo === 'string') return photo;
    if (photo && typeof photo === 'object' && 'file' in photo && photo.file) {
      return uploadPhotoFile(photo.file as File);
    }
    throw new Error('Invalid photo');
  };

  // Single network call at the end: create a brand-new property (no propertyId)
  // or update the existing one (edit flow). All form data lives in the store.
  const finalSubmit = async () => {
    if (!managerId) {
      setError('User information not available. Please refresh the page.');
      return;
    }
    setError(null);
    try {
      const payload = mapFormDataToBackend();
      if (propertyId) {
        // Edit: never change ownership (managerId) or property type via this
        // wizard — send everything else.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { managerId: _omitManager, propertyType: _omitType, ...updateData } = payload;
        const updated = await updatePropertyMutation.mutateAsync({ propertyId, updateData });
        onSubmit(updated);
      } else {
        const created = await createPropertyMutation.mutateAsync(payload);
        if (created?.id) setPropertyId(created.id);
        onSubmit(created);
      }
    } catch (err) {
      console.error('Error saving property:', err);
      setError(err instanceof Error ? err.message : 'Failed to save property. Please try again.');
    }
  };

  // Called when GeneralInfo (step 1) is valid. No API call anymore — just keep
  // the data in the store and advance. The property is created at the very end.
  const handleGeneralInfoContinue = () => {
    setError(null);
    setCurrentStep(2);
  };

  const handleNext = async () => {
    setError(null);

    // Steps 2-5 (map, amenities, extended amenities, features): no API calls —
    // their data is already in the store. Just advance.
    if (currentStep >= 2 && currentStep <= 5) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Step 6 (Photos): validate, then upload any new File objects to S3 to get
    // URLs and store them back in the store. No property is touched here.
    if (currentStep === 6) {
      if (!formData.coverPhoto) {
        setError('Cover photo is required. Please upload a cover photo.');
        return;
      }
      if (!formData.galleryPhotos || formData.galleryPhotos.length === 0) {
        setError('At least one gallery photo is required. Please add gallery photos.');
        return;
      }
      if (formData.youtubeUrl && formData.youtubeUrl.trim()) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
        if (!youtubeRegex.test(formData.youtubeUrl.trim())) {
          setError('Please enter a valid YouTube URL.');
          return;
        }
      }

      try {
        setIsUploadingPhotos(true);
        const { updateFormData } = useCreatePropertyStore.getState();

        // Resolve cover photo to a URL (upload if it's a new file).
        const coverUrl = await resolvePhotoToUrl(formData.coverPhoto);
        updateFormData('coverPhoto', coverUrl);

        // Resolve every gallery photo to a URL.
        const galleryUrls: string[] = [];
        for (const galleryPhoto of formData.galleryPhotos) {
          galleryUrls.push(await resolvePhotoToUrl(galleryPhoto));
        }
        updateFormData('galleryPhotos', galleryUrls);

        setCurrentStep(7);
      } catch (err) {
        console.error('Error uploading photos:', err);
        setError(err instanceof Error ? err.message : 'Failed to upload photos. Please try again.');
      } finally {
        setIsUploadingPhotos(false);
      }
      return;
    }

    // Step 7 (Marketing): data is in the store. When editing an existing
    // property, allow finishing here; otherwise continue to the ribbon step.
    if (currentStep === 7) {
      if (initialPropertyId && propertyData) {
        await finalSubmit();
      } else {
        setCurrentStep(8);
      }
      return;
    }

    // Step 8 (Ribbon) — final step: one create/update call with the whole form.
    if (currentStep === 8) {
      await finalSubmit();
      return;
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
          onContinue={handleGeneralInfoContinue}
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
            disabled={isBusy || currentStep === 1}
            className="flex items-center gap-2 px-4 md:px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            Back
          </button>
          {/* Next Button */}
          <NextStepButton onClick={handleNext} disabled={isBusy || !managerId}>
            {isBusy
              ? (isUploadingPhotos ? 'Uploading...' : 'Saving...')
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
