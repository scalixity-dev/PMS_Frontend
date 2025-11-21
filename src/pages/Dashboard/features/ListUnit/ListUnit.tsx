import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Stepper from './components/Stepper';
import PropertySelection from './steps/PropertySelection';
import BasicAmenities from './steps/BasicAmenities';
import LeasingDetails from './steps/LeasingDetails';
import ApplicationSettings from './steps/ApplicationSettings';
import CreatePropertyForm from './steps/CreatePropertyForm';
import NextStepButton from './components/NextStepButton';

const ListUnit: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [subStep, setSubStep] = useState<'selection' | 'amenities'>('selection');
  const [showCreateProperty, setShowCreateProperty] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1
    property: '',
    unit: '',
    bedrooms: '',
    bathrooms: '',
    size: '',
    // Step 2
    rent: '',
    deposit: '',
    leaseDuration: '',
    availableDate: '',
    // Step 3
    description: '',
    amenities: [],
    publish: false,
    // Basic Amenities
    parking: '',
    laundry: '',
    ac: ''
  });

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleBack = () => {
    if (showCreateProperty) {
      setShowCreateProperty(false);
      return;
    }
    
    if (currentStep === 1) {
      if (subStep === 'amenities') {
        setSubStep('selection');
      } else {
        navigate('/dashboard');
      }
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (subStep === 'selection') {
        if (formData.property) {
          setSubStep('amenities');
        }
      } else {
        setCurrentStep(2);
      }
    } else if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Handle submission
      console.log('Form Submitted:', formData);
      navigate('/dashboard'); // Or wherever appropriate
    }
  };

  const handleCreateProperty = () => {
    setShowCreateProperty(true);
  };

  const handlePropertyCreated = (propertyData: any) => {
    console.log('New Property Created:', propertyData);
    // Here you would typically:
    // 1. Send data to backend
    // 2. Add to properties list
    // 3. Auto-select the new property
    setShowCreateProperty(false);
  };

  const handleCancelCreate = () => {
    setShowCreateProperty(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[var(--color-background)] p-6 overflow-y-auto">
      {/* Centered Card Container */}
      <div className="flex-1 flex items-start justify-center pt-8">
        <div className="bg-[#DFE5E3] rounded-2xl shadow-lg w-full max-w-3xl min-h-[600px] p-8">
          {/* Header with Back Button and Title */}
          <div className="relative flex items-center mb-8">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-[#3D7475] font-bold hover:text-[var(--color-primary)] transition-colors"
            >
              <ArrowLeft size={18} />
              BACK
            </button>
            <h1 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold text-[var(--color-heading)]">
              List a Unit
            </h1>
          </div>

          {/* Stepper */}
          <div className="mb-12">
            <Stepper currentStep={currentStep} />
          </div>

          {/* Content Area */}
          <div className="flex flex-col items-center justify-start w-full">
            {showCreateProperty ? (
              <div className="w-full flex flex-col items-center">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-bold mb-2 text-[var(--color-heading)]">Create New Property</h2>
                  <p className="text-[var(--color-subheading)]">Enter the details for your new property.</p>
                </div>
                <CreatePropertyForm onBack={handleCancelCreate} onSubmit={handlePropertyCreated} />
              </div>
            ) : (
              <>
                {currentStep === 1 && subStep === 'selection' && (
                   <div className="w-full flex flex-col items-center">
                     <div className="text-center">
                       <h2 className="text-xl font-bold mb-2 text-[var(--color-heading)]">Select property</h2>
                       <p className="text-[var(--color-subheading)]">Select the property or unit you want to list or create a new one.</p>
                     </div>
                     <PropertySelection 
                       data={formData} 
                       updateData={updateFormData}
                       onCreateProperty={handleCreateProperty}
                     />
                     {formData.property && (
                        <div className="w-full max-w-md mt-6 flex justify-center">
                          <NextStepButton onClick={handleNext} />
                        </div>
                     )}
                   </div>
                )}

                {currentStep === 1 && subStep === 'amenities' && (
                  <div className="w-full flex flex-col items-center">
                    <BasicAmenities 
                      data={formData} 
                      updateData={updateFormData} 
                    />
                    <div className="w-full max-w-md mt-8 flex justify-center">
                      <NextStepButton onClick={handleNext} />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                    <div className="w-full flex flex-col items-center">
                      <div className="text-center mb-8">
                        <h2 className="text-xl font-bold mb-2 text-[var(--color-heading)]">Leasing details</h2>
                        <p className="text-[var(--color-subheading)]">Set your rent, deposit, and lease terms.</p>
                      </div>
                      <LeasingDetails data={formData} updateData={updateFormData} />
                      <div className="w-full max-w-md mt-8 flex justify-center">
                        <NextStepButton onClick={handleNext} />
                      </div>
                    </div>
                )}
                {currentStep === 3 && (
                    <div className="w-full flex flex-col items-center">
                       <div className="text-center mb-8">
                         <h2 className="text-xl font-bold mb-2 text-[var(--color-heading)]">Application settings</h2>
                         <p className="text-[var(--color-subheading)]">Customize your listing and application preferences.</p>
                       </div>
                       <ApplicationSettings data={formData} updateData={updateFormData} />
                       <div className="w-full max-w-md mt-8 flex justify-center">
                         <NextStepButton onClick={handleNext}>Publish Listing</NextStepButton>
                       </div>
                    </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListUnit;
