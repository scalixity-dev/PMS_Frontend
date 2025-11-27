import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import GeneralInfo from './create-property/GeneralInfo';
import PropertySummaryMap from './create-property/PropertySummaryMap';
import BasicAmenities from './BasicAmenities';
import PropertyFeatures from './create-property/PropertyFeatures';
import PropertyPhotos from './create-property/PropertyPhotos';
import MarketingDescription from './create-property/MarketingDescription';
import AddRibbon from './create-property/AddRibbon';
import NextStepButton from '../components/NextStepButton';
import { propertyService } from '../../../../../services/property.service';
import { authService } from '../../../../../services/auth.service';

interface CreatePropertyFormProps {
  onSubmit: (propertyData: any) => void;
  propertyId?: string; // If provided, load existing property and resume from appropriate step
}

const CreatePropertyForm: React.FC<CreatePropertyFormProps> = ({ onSubmit, propertyId: initialPropertyId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [managerId, setManagerId] = useState<string | null>(null);
  const [propertyId, setPropertyId] = useState<string | null>(initialPropertyId || null);
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);
  const [formData, setFormData] = useState({
    // General Info
    propertyName: '',
    propertyType: '',
    isManufactured: '',
    marketRent: '',
    beds: '',
    bathrooms: '',
    sizeSquareFt: '',
    yearBuilt: '',
    address: '',
    city: '',
    stateRegion: '',
    country: '',
    zip: '',
    // Basic Amenities
    parking: '',
    laundry: '',
    ac: '',
    // Features
    features: [],
    // Photos
    coverPhoto: null,
    galleryPhotos: [],
    youtubeUrl: '',
    // Marketing
    marketingDescription: '',
    // Ribbon
    ribbonType: 'none',
    ribbonTitle: '',
    ribbonColor: ''
  });

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
    fetchUser();
  }, []);

  // Load existing property data if propertyId is provided
  useEffect(() => {
    const loadPropertyData = async () => {
      if (!initialPropertyId) return;

      setIsLoadingProperty(true);
      setError(null);

      try {
        const property = await propertyService.getOne(initialPropertyId);
        setPropertyId(property.id);

        // Map backend property to form data
        const mappedData: any = {
          propertyName: property.propertyName || '',
          propertyType: property.propertyType?.toLowerCase() || '',
          marketRent: property.marketRent?.toString() || '',
          address: property.address?.streetAddress || '',
          city: property.address?.city || '',
          stateRegion: property.address?.stateRegion || '',
          country: property.address?.country || '',
          zip: property.address?.zipCode || '',
          beds: property.singleUnitDetails?.beds?.toString() || '',
          bathrooms: property.singleUnitDetails?.baths?.toString() || '',
          sizeSquareFt: property.sizeSqft?.toString() || '',
          yearBuilt: property.yearBuilt?.toString() || '',
          parking: property.amenities?.parking?.toLowerCase() || '',
          laundry: property.amenities?.laundry?.toLowerCase() || '',
          ac: property.amenities?.airConditioning?.toLowerCase() || '',
          features: property.amenities?.propertyFeatures || [],
          marketingDescription: property.description || '',
          coverPhoto: property.coverPhotoUrl || property.photos?.find(p => p.isPrimary)?.photoUrl || null,
          galleryPhotos: property.photos?.filter(p => !p.isPrimary).map(p => p.photoUrl) || [],
          youtubeUrl: property.youtubeUrl || '',
          ribbonType: property.ribbonType?.toLowerCase() || 'none',
          ribbonTitle: property.ribbonTitle || '',
        };

        setFormData(prev => ({ ...prev, ...mappedData }));

        // Determine starting step based on what's completed
        // Step 1: GeneralInfo (propertyName, address, beds, bathrooms, etc.)
        // Step 2: PropertySummaryMap (always show after step 1)
        // Step 3: BasicAmenities (parking, laundry, ac)
        // Step 4: PropertyFeatures (features array) - User wants to start here after GeneralInfo
        // Step 5: PropertyPhotos (photos)
        // Step 6: MarketingDescription (description)
        // Step 7: AddRibbon (optional)

        let startingStep = 1;
        // If GeneralInfo is completed (has propertyName and address), start from PropertyFeatures (step 4)
        if (property.propertyName && property.address) {
          startingStep = 4; // Start from PropertyFeatures after GeneralInfo
          // If PropertyFeatures is also completed, continue to next steps
          if (property.amenities?.propertyFeatures && property.amenities.propertyFeatures.length > 0) {
            if (property.photos && property.photos.length > 0) {
              startingStep = 5; // PropertyPhotos completed
              if (property.description) {
                startingStep = 6; // MarketingDescription completed
                // Step 7 (AddRibbon) is optional, so we'll start from step 6 if description exists
              }
            }
          }
        }

        setCurrentStep(startingStep);
      } catch (err) {
        console.error('Error loading property:', err);
        setError(err instanceof Error ? err.message : 'Failed to load property data. Please try again.');
      } finally {
        setIsLoadingProperty(false);
      }
    };

    loadPropertyData();
  }, [initialPropertyId]);

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

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
    const amenities = formData.parking || formData.laundry || formData.ac || (Array.isArray(formData.features) && formData.features.length > 0)
      ? {
          parking: mapParkingType(formData.parking || 'none'),
          laundry: mapLaundryType(formData.laundry || 'none'),
          airConditioning: mapACType(formData.ac || 'none'),
          propertyFeatures: Array.isArray(formData.features) ? formData.features : [],
        }
      : undefined;

    // Prepare photos
    const photos: Array<{ photoUrl: string; isPrimary: boolean }> = [];
    if (formData.coverPhoto) {
      photos.push({ photoUrl: formData.coverPhoto, isPrimary: true });
    }
    if (Array.isArray(formData.galleryPhotos)) {
      formData.galleryPhotos.forEach((photo: string) => {
        if (photo && !photos.some(p => p.photoUrl === photo)) {
          photos.push({ photoUrl: photo, isPrimary: false });
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
  const handlePropertyCreated = (id: string) => {
    setPropertyId(id);
    // Move to next step after saving GeneralInfo
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleNext = async () => {
    // Save basic amenities (parking, laundry, AC) when on step 3 (BasicAmenities)
    if (currentStep === 3) {
      if (!managerId || !propertyId) {
        setError('Property information not available. Please start from step 1.');
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        // Prepare amenities with parking, laundry, and AC
        // Always provide all three fields (required by DTO), using selected values or 'NONE' as default
        const amenities = {
          parking: mapParkingType(formData.parking || 'NONE'),
          laundry: mapLaundryType(formData.laundry || 'NONE'),
          airConditioning: mapACType(formData.ac || 'NONE'),
          // Preserve existing features if any
          propertyFeatures: Array.isArray(formData.features) ? formData.features : [],
        };

        const updateData: any = {
          amenities: amenities,
        };

        await propertyService.update(propertyId, updateData);
        setCurrentStep(prev => prev + 1);
      } catch (err) {
        console.error('Error updating basic amenities:', err);
        setError(err instanceof Error ? err.message : 'Failed to save amenities. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Save features when on step 4 (PropertyFeatures)
    if (currentStep === 4) {
      if (!managerId || !propertyId) {
        setError('Property information not available. Please start from step 1.');
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        // Prepare amenities with features for update
        // Include parking, laundry, AC from previous step and add features
        // Always provide all three fields (required by DTO), using selected values or 'NONE' as default
        const amenities = {
          parking: mapParkingType(formData.parking || 'NONE'),
          laundry: mapLaundryType(formData.laundry || 'NONE'),
          airConditioning: mapACType(formData.ac || 'NONE'),
          propertyFeatures: Array.isArray(formData.features) ? formData.features : [],
        };

        const updateData: any = {
          amenities: amenities,
        };

        await propertyService.update(propertyId, updateData);
        setCurrentStep(prev => prev + 1);
      } catch (err) {
        console.error('Error updating property features:', err);
        setError(err instanceof Error ? err.message : 'Failed to save features. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Save photos when on step 5 (PropertyPhotos)
    if (currentStep === 5) {
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

      setIsSubmitting(true);
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

        await propertyService.update(propertyId, updateData);
        setCurrentStep(prev => prev + 1);
      } catch (err) {
        console.error('Error uploading photos:', err);
        setError(err instanceof Error ? err.message : 'Failed to upload photos. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Save marketing description when on step 6 (MarketingDescription)
    if (currentStep === 6) {
      if (!managerId || !propertyId) {
        setError('Property information not available. Please start from step 1.');
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        // Update property with marketing description
        const updateData: any = {
          description: formData.marketingDescription || null,
        };

        await propertyService.update(propertyId, updateData);
        setCurrentStep(prev => prev + 1);
      } catch (err) {
        console.error('Error updating marketing description:', err);
        setError(err instanceof Error ? err.message : 'Failed to save description. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Save ribbon data when on step 7 (AddRibbon)
    if (currentStep === 7) {
      if (!managerId || !propertyId) {
        setError('Property information not available. Please start from step 1.');
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        // Map ribbon type to backend format
        const ribbonType = mapRibbonType(formData.ribbonType || 'none');
        
        // Update property with ribbon data
        const updateData: any = {
          ribbonType: ribbonType,
          ribbonTitle: formData.ribbonTitle && formData.ribbonType !== 'none' ? formData.ribbonTitle : null,
        };

        await propertyService.update(propertyId, updateData);
        
        // After saving ribbon, complete the property creation
        const backendData = mapFormDataToBackend();
        // Remove managerId and propertyName from update (they shouldn't change)
        const { managerId: _, propertyName: __, ...finalUpdateData } = backendData;
        const updatedProperty = await propertyService.update(propertyId, finalUpdateData);
        
        // Call the onSubmit callback with the updated property
        onSubmit(updatedProperty);
      } catch (err) {
        console.error('Error updating ribbon:', err);
        setError(err instanceof Error ? err.message : 'Failed to save ribbon. Please try again.');
        setIsSubmitting(false);
      }
      return;
    }

    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Update existing property with remaining data
      if (!managerId || !propertyId) {
        setError('Property information not available. Please start from step 1.');
        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const backendData = mapFormDataToBackend();
        // Remove managerId and propertyName from update (they shouldn't change)
        const { managerId: _, propertyName: __, ...updateData } = backendData;
        const updatedProperty = await propertyService.update(propertyId, updateData);
        
        // Call the onSubmit callback with the updated property
        onSubmit(updatedProperty);
      } catch (err) {
        console.error('Error updating property:', err);
        setError(err instanceof Error ? err.message : 'Failed to update property. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <GeneralInfo 
          data={formData} 
          updateData={updateFormData} 
          onPropertyCreated={handlePropertyCreated}
          propertyId={propertyId || undefined}
        />;
      case 2:
        return <PropertySummaryMap data={formData} onBack={handleBack} />;
      case 3:
        return <BasicAmenities data={formData} updateData={updateFormData} />;
      case 4:
        return <PropertyFeatures data={formData} updateData={updateFormData} />;
      case 5:
        return <PropertyPhotos data={formData} updateData={updateFormData} />;
      case 6:
        return <MarketingDescription data={formData} updateData={updateFormData} />;
      case 7:
        return <AddRibbon data={formData} updateData={updateFormData} />;
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
            disabled={isSubmitting || currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          {/* Next Button */}
          <NextStepButton onClick={handleNext} disabled={isSubmitting || !managerId || !propertyId}>
            {isSubmitting ? 'Updating...' : currentStep === 7 ? 'Complete Property' : 'Next'}
          </NextStepButton>
        </div>
      )}
    </div>
  );
};

export default CreatePropertyForm;
