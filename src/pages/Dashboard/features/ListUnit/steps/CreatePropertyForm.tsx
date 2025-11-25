import React, { useState, useEffect } from 'react';
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
}

const CreatePropertyForm: React.FC<CreatePropertyFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [managerId, setManagerId] = useState<string | null>(null);
  const [propertyId, setPropertyId] = useState<string | null>(null);
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

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
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

    // Map frontend amenity values to backend enum values
    const mapParkingType = (value: string): 'NONE' | 'STREET' | 'GARAGE' | 'DRIVEWAY' | 'ASSIGNED' => {
      const mapping: Record<string, 'NONE' | 'STREET' | 'GARAGE' | 'DRIVEWAY' | 'ASSIGNED'> = {
        'none': 'NONE',
        'street': 'STREET',
        'garage': 'GARAGE',
        'private_lot': 'ASSIGNED',
      };
      return mapping[value.toLowerCase()] || 'NONE';
    };

    const mapLaundryType = (value: string): 'NONE' | 'IN_UNIT' | 'ON_SITE' | 'HOOKUPS' => {
      const mapping: Record<string, 'NONE' | 'IN_UNIT' | 'ON_SITE' | 'HOOKUPS'> = {
        'none': 'NONE',
        'in_unit': 'IN_UNIT',
        'on_site': 'ON_SITE',
        'hookups': 'HOOKUPS',
      };
      return mapping[value.toLowerCase()] || 'NONE';
    };

    const mapACType = (value: string): 'NONE' | 'CENTRAL' | 'WINDOW' | 'PORTABLE' => {
      const mapping: Record<string, 'NONE' | 'CENTRAL' | 'WINDOW' | 'PORTABLE'> = {
        'none': 'NONE',
        'central': 'CENTRAL',
        'window': 'WINDOW',
        'portable': 'PORTABLE',
      };
      return mapping[value.toLowerCase()] || 'NONE';
    };

    // Prepare amenities
    const amenities = formData.parking || formData.laundry || formData.ac
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
          <NextStepButton onClick={handleNext} disabled={isSubmitting || !managerId || !propertyId}>
            {isSubmitting ? 'Updating...' : currentStep === 7 ? 'Complete Property' : 'Next'}
          </NextStepButton>
        </div>
      )}
    </div>
  );
};

export default CreatePropertyForm;
