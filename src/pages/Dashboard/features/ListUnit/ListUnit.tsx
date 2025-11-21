import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Stepper from './components/Stepper';
import PropertySelection from './steps/PropertySelection';
import LeasingDetails from './steps/LeasingDetails';
import ApplicationSettings from './steps/ApplicationSettings';
import CreatePropertyForm from './steps/CreatePropertyForm';
import NextStepButton from './components/NextStepButton';
import PetPolicy from './steps/PetPolicy';
import PetDetails from './steps/PetDetails';

const ListUnit: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [leasingStep, setLeasingStep] = useState(1); // 1: Details, 2: Pets Policy, 3: Pet Details
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
    refundable: '',
    leaseDuration: '',
    minLeaseDuration: '',
    maxLeaseDuration: '',
    availableDate: '',
    monthToMonth: false,
    petsAllowed: null as boolean | null,
    pets: [] as string[],
    petDeposit: '',
    petRent: '',
    petDescription: '',
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
      navigate('/dashboard');
    } else if (currentStep === 2) {
      if (leasingStep === 3) {
        setLeasingStep(2);
      } else if (leasingStep === 2) {
        setLeasingStep(1);
      } else {
        setCurrentStep(1);
      }
    } else {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setLeasingStep(1);
    } else if (currentStep === 2) {
      if (leasingStep === 1) {
        setLeasingStep(2);
      } else if (leasingStep === 2) {
        if (formData.petsAllowed) {
          setLeasingStep(3);
        } else {
          setCurrentStep(3);
        }
      } else {
        setCurrentStep(3);
      }
    } else if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Handle submission
      console.log('Form Submitted:', formData);
      navigate('/dashboard');
    }
  };

  const handleCreateProperty = () => {
    setShowCreateProperty(true);
  };

  const handlePropertyCreated = (propertyData: any) => {
    console.log('New Property Created:', propertyData);
    updateFormData('property', 'new-property-id');
    setShowCreateProperty(false);
    setCurrentStep(2);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[var(--color-background)] px-6 overflow-y-auto">
      <div className="flex-1 flex items-start justify-center">
        <div className="bg-[#DFE5E3] rounded-2xl shadow-lg w-full max-w-3xl min-h-[600px] p-8">
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

          <div className="mb-12">
            <Stepper currentStep={currentStep} />
          </div>

          <div className="flex flex-col items-center justify-start w-full">
            {showCreateProperty ? (
              <div className="w-full flex flex-col items-center">
                <CreatePropertyForm onSubmit={handlePropertyCreated} />
              </div>
            ) : (
              <>
                {currentStep === 1 && (
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

                {currentStep === 2 && (
                  <div className="w-full flex flex-col items-center">
                    {leasingStep === 1 ? (
                      <>
                        <div className="text-center mb-8">
                          <h2 className="text-xl font-bold mb-2 text-[var(--color-heading)]">Lease details</h2>
                          <p className="text-[var(--color-subheading)]">Add main lease terms and other leasing details if necessary.</p>
                        </div>
                        <LeasingDetails data={formData} updateData={updateFormData} />
                        <div className="w-full max-w-md mt-8 flex justify-center">
                          <NextStepButton onClick={handleNext} />
                        </div>
                      </>
                    ) : leasingStep === 2 ? (
                      <>
                        <PetPolicy data={formData} updateData={updateFormData} />
                        <div className="w-full max-w-md mt-8 flex justify-center">
                          <NextStepButton onClick={handleNext} />
                        </div>
                      </>
                    ) : (
                      <>
                        <PetDetails data={formData} updateData={updateFormData} />
                        <div className="w-full max-w-md mt-8 flex justify-center">
                          <NextStepButton onClick={handleNext} />
                        </div>
                      </>
                    )}
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
