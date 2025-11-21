import React, { useState } from 'react';
import GeneralInfo from './create-property/GeneralInfo';
import PropertySummaryMap from './create-property/PropertySummaryMap';
import BasicAmenities from './BasicAmenities';
import PropertyFeatures from './create-property/PropertyFeatures';
import PropertyPhotos from './create-property/PropertyPhotos';
import MarketingDescription from './create-property/MarketingDescription';
import AddRibbon from './create-property/AddRibbon';
import NextStepButton from '../components/NextStepButton';

interface CreatePropertyFormProps {
  onSubmit: (propertyData: any) => void;
}

const CreatePropertyForm: React.FC<CreatePropertyFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
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

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    } else {
      onSubmit(formData);
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
        return <GeneralInfo data={formData} updateData={updateFormData} />;
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

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-4 w-full max-w-md justify-center">
      
          <NextStepButton onClick={handleNext}>
            {currentStep === 7 ? 'Create Property' : 'Next'}
          </NextStepButton>
        
      </div>
    </div>
  );
};

export default CreatePropertyForm;
