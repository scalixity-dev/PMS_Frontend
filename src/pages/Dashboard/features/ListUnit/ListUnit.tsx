import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Stepper from './components/Stepper';
import PropertySelection from './steps/PropertySelection';
import LeasingDetails from './steps/LeasingDetails';
import ApplicationSettings from './steps/ApplicationSettings';
import ApplicationFee from './steps/ApplicationFee';
import ApplicationFeeDetails from './steps/ApplicationFeeDetails';
import ListingContact from './steps/ListingContact';
import CreatePropertyForm from './steps/CreatePropertyForm';
import ListingSuccessModal from './components/ListingSuccessModal';
import NextStepButton from './components/NextStepButton';
import PetPolicy from './steps/PetPolicy';
import PetDetails from './steps/PetDetails';

const ListUnit: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [leasingStep, setLeasingStep] = useState(1); // 1: Details, 2: Pets Policy, 3: Pet Details
  const [applicationStep, setApplicationStep] = useState(1); // 1: Online Apps, 2: Application Fee, 3: Fee Details, 4: Listing Contact
  const [showCreateProperty, setShowCreateProperty] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
    ac: '',
    // Application Settings
    receiveApplicationsOnline: null as boolean | null,
    applicationFee: null as boolean | null,
    applicationFeeAmount: '',
    // Listing Contact
    contactName: '',
    countryCode: '+91',
    phoneNumber: '',
    email: '',
    displayPhonePublicly: false,
  });

  const propertyDisplay = formData.property || "New Property";

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
    } else if (currentStep === 3) {
      if (applicationStep === 4) {
        if (formData.applicationFee) {
          setApplicationStep(3);
        } else {
          setApplicationStep(2);
        }
      } else if (applicationStep === 3) {
        setApplicationStep(2);
      } else if (applicationStep === 2) {
        setApplicationStep(1);
      } else {
        setCurrentStep(2);
        if (formData.petsAllowed) {
          setLeasingStep(3);
        } else {
          setLeasingStep(2);
        }
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
          setApplicationStep(1);
        }
      } else {
        setCurrentStep(3);
        setApplicationStep(1);
      }
    } else if (currentStep === 3) {
      if (applicationStep === 1) {
        setApplicationStep(2);
      } else if (applicationStep === 2) {
        if (formData.applicationFee) {
          setApplicationStep(3);
        } else {
          setApplicationStep(4);
        }
      } else if (applicationStep === 3) {
        setApplicationStep(4);
      } else {
        // Handle submission from step 4
        console.log('Form Submitted:', formData);
        setShowSuccessModal(true);
      }
    }
  };

  const handleBackToList = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  const handleListAnother = () => {
    setShowSuccessModal(false);
    // Reset form and go to step 1
    setCurrentStep(1);
    setLeasingStep(1);
    setApplicationStep(1);
    setFormData({
      property: '',
      unit: '',
      bedrooms: '',
      bathrooms: '',
      size: '',
      rent: '',
      deposit: '',
      refundable: '',
      leaseDuration: '',
      minLeaseDuration: '',
      maxLeaseDuration: '',
      availableDate: '',
      monthToMonth: false,
      petsAllowed: null,
      pets: [],
      petDeposit: '',
      petRent: '',
      petDescription: '',
      description: '',
      amenities: [],
      publish: false,
      parking: '',
      laundry: '',
      ac: '',
      receiveApplicationsOnline: null,
      applicationFee: null,
      applicationFeeAmount: '',
      contactName: '',
      countryCode: '+91',
      phoneNumber: '',
      email: '',
      displayPhonePublicly: false,
    });
  };

  const handleCreateProperty = () => {
    setShowCreateProperty(true);
  };

  const handleEditProperty = (propertyId: string) => {
    updateFormData('property', propertyId);
    setShowCreateProperty(true);
  };

  const handlePropertyCreated = (propertyData: any) => {
    console.log('Property Created/Updated:', propertyData);
    const propertyId = propertyData.id || formData.property;
    updateFormData('property', propertyId);
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
                <CreatePropertyForm 
                  onSubmit={handlePropertyCreated}
                  propertyId={formData.property || undefined}
                />
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
                      onEditProperty={handleEditProperty}
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
                    {applicationStep === 1 ? (
                      <>
                        <ApplicationSettings data={formData} updateData={updateFormData} />
                        <div className="w-full max-w-md mt-8 flex justify-center">
                          <NextStepButton onClick={handleNext} />
                        </div>
                      </>
                    ) : applicationStep === 2 ? (
                      <>
                        <ApplicationFee data={formData} updateData={updateFormData} />
                        <div className="w-full max-w-md mt-8 flex justify-center">
                          <NextStepButton onClick={handleNext}>{formData.applicationFee ? 'Next' : 'Next'}</NextStepButton>
                        </div>
                      </>
                    ) : applicationStep === 3 ? (
                      <>
                        <ApplicationFeeDetails data={formData} updateData={updateFormData} />
                        <div className="w-full max-w-md mt-8 flex justify-center">
                          <NextStepButton onClick={handleNext}>Next</NextStepButton>
                        </div>
                      </>
                    ) : (
                      <ListingContact data={formData} updateData={updateFormData} onSubmit={handleNext} />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <ListingSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        onBackToList={handleBackToList}
        onListAnother={handleListAnother}
        propertyDetails={propertyDisplay}
      />
    </div>
  );
};

export default ListUnit;
