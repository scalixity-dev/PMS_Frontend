import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
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
import { leasingService } from '../../../../services/leasing.service';
import { listingService } from '../../../../services/listing.service';
import { useGetProperty, propertyQueryKeys } from '../../../../hooks/usePropertyQueries';
import { useGetUnit } from '../../../../hooks/useUnitQueries';
import { propertyService } from '../../../../services/property.service';
import { useListUnitStore } from './store/listUnitStore';
import { useCreatePropertyStore } from './store/createPropertyStore';
import type { LeaseDuration } from '../../../../services/leasing.service';

// Reverse mapping from backend enum to frontend numeric string
const LEASE_DURATION_REVERSE_MAP: Record<string, string> = {
  'ONE_MONTH': '1',
  'TWO_MONTHS': '2',
  'THREE_MONTHS': '3',
  'FOUR_MONTHS': '4',
  'FIVE_MONTHS': '5',
  'SIX_MONTHS': '6',
  'SEVEN_MONTHS': '7',
  'EIGHT_MONTHS': '8',
  'NINE_MONTHS': '9',
  'TEN_MONTHS': '10',
  'ELEVEN_MONTHS': '11',
  'TWELVE_MONTHS': '12',
  'THIRTEEN_MONTHS': '13',
  'FOURTEEN_MONTHS': '14',
  'FIFTEEN_MONTHS': '15',
  'SIXTEEN_MONTHS': '16',
  'SEVENTEEN_MONTHS': '17',
  'EIGHTEEN_MONTHS': '18',
  'NINETEEN_MONTHS': '19',
  'TWENTY_MONTHS': '20',
  'TWENTY_ONE_MONTHS': '21',
  'TWENTY_TWO_MONTHS': '22',
  'TWENTY_THREE_MONTHS': '23',
  'TWENTY_FOUR_MONTHS': '24',
  'THIRTY_SIX_PLUS_MONTHS': '36',
};

const ListUnit: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    formData,
    currentStep,
    leasingStep,
    applicationStep,
    showCreateProperty,
    showSuccessModal,
    leasingId,
    isSubmitting,
    error,
    updateFormData,
    setCurrentStep,
    setLeasingStep,
    setApplicationStep,
    setShowCreateProperty,
    setShowSuccessModal,
    setLeasingId,
    setIsSubmitting,
    setError,
    resetForm,
  } = useListUnitStore();

  // Get createPropertyStore reset function
  const { resetForm: resetCreatePropertyForm } = useCreatePropertyStore();

  // Reset both forms and clear cache only on initial mount (not on every render)
  useEffect(() => {
    // Reset the ListUnit form to initial state
    resetForm();
    // Reset the CreateProperty form to initial state
    resetCreatePropertyForm();
    // Invalidate property queries to ensure fresh data
    queryClient.removeQueries({ queryKey: propertyQueryKeys.all });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Use React Query to fetch property data when property is selected
  const { data: propertyData } = useGetProperty(formData.property || null, !!formData.property);

  // Use React Query to fetch unit data when unit is selected
  const { data: unitData } = useGetUnit(formData.unit || null, !!formData.unit);

  // Get property display name (use property name if available, otherwise fallback to ID or "New Property")
  const propertyDisplay = propertyData?.propertyName || formData.property || "New Property";

  // Load property contact info when property data is available
  useEffect(() => {
    if (propertyData) {
      updateFormData('contactName', propertyData.listingContactName || '');
      updateFormData('countryCode', propertyData.listingPhoneCountryCode || '+91');
      updateFormData('phoneNumber', propertyData.listingPhoneNumber || '');
      updateFormData('email', propertyData.listingEmail || '');
      updateFormData('displayPhonePublicly', propertyData.displayPhonePublicly ?? false);
    }
  }, [propertyData, updateFormData]);

  // Map numeric lease duration to backend enum
  const mapLeaseDuration = (months: string): LeaseDuration => {
    const mapping: Record<string, LeaseDuration> = {
      '1': 'ONE_MONTH',
      '2': 'TWO_MONTHS',
      '3': 'THREE_MONTHS',
      '4': 'FOUR_MONTHS',
      '5': 'FIVE_MONTHS',
      '6': 'SIX_MONTHS',
      '7': 'SEVEN_MONTHS',
      '8': 'EIGHT_MONTHS',
      '9': 'NINE_MONTHS',
      '10': 'TEN_MONTHS',
      '11': 'ELEVEN_MONTHS',
      '12': 'TWELVE_MONTHS',
      '13': 'THIRTEEN_MONTHS',
      '14': 'FOURTEEN_MONTHS',
      '15': 'FIFTEEN_MONTHS',
      '16': 'SIXTEEN_MONTHS',
      '17': 'SEVENTEEN_MONTHS',
      '18': 'EIGHTEEN_MONTHS',
      '19': 'NINETEEN_MONTHS',
      '20': 'TWENTY_MONTHS',
      '21': 'TWENTY_ONE_MONTHS',
      '22': 'TWENTY_TWO_MONTHS',
      '23': 'TWENTY_THREE_MONTHS',
      '24': 'TWENTY_FOUR_MONTHS',
      '36': 'THIRTY_SIX_PLUS_MONTHS',
    };
    return mapping[months] || 'TWELVE_MONTHS';
  };

  // Check if leasing exists for property/unit when property/unit is selected
  // Use propertyData.leasing or unitData.leasing if available (from backend), otherwise check via API only if needed
  useEffect(() => {
    const checkExistingLeasing = async () => {
      if (!formData.property) {
        // Clear all leasing data when no property is selected
        setLeasingId(null);
        updateFormData('rent', '');
        updateFormData('deposit', '');
        updateFormData('refundable', '');
        updateFormData('availableDate', '');
        updateFormData('minLeaseDuration', '');
        updateFormData('maxLeaseDuration', '');
        updateFormData('description', '');
        updateFormData('petsAllowed', null);
        updateFormData('pets', []);
        updateFormData('petDeposit', '');
        updateFormData('petRent', '');
        updateFormData('petDescription', '');
        updateFormData('receiveApplicationsOnline', null);
        updateFormData('applicationFee', null);
        updateFormData('applicationFeeAmount', '');
        return;
      }

      // Clear all leasing data FIRST before loading new data to prevent data leakage
      setLeasingId(null);
      updateFormData('rent', '');
      updateFormData('deposit', '');
      updateFormData('refundable', '');
      updateFormData('availableDate', '');
      updateFormData('minLeaseDuration', '');
      updateFormData('maxLeaseDuration', '');
      updateFormData('description', '');
      updateFormData('petsAllowed', null);
      updateFormData('pets', []);
      updateFormData('petDeposit', '');
      updateFormData('petRent', '');
      updateFormData('petDescription', '');
      updateFormData('receiveApplicationsOnline', null);
      updateFormData('applicationFee', null);
      updateFormData('applicationFeeAmount', '');

      // If a unit is selected, check for unit-level leasing
      if (formData.unit && unitData) {
        // Unit is selected - check unit-level leasing
        if (unitData.leasing && unitData.leasing.id) {
          // Unit has leasing - fetch full leasing data
          try {
            const leasing = await leasingService.getOne(unitData.leasing.id);
            setLeasingId(leasing.id);
            // Load existing leasing data into form
            updateFormData('rent', leasing.monthlyRent?.toString() || '');
            updateFormData('deposit', leasing.securityDeposit?.toString() || '');
            updateFormData('refundable', leasing.amountRefundable?.toString() || '');
            updateFormData('availableDate', leasing.dateAvailable ? new Date(leasing.dateAvailable).toISOString().split('T')[0] : '');
            // Map backend enum to numeric string for frontend
            updateFormData('minLeaseDuration', LEASE_DURATION_REVERSE_MAP[leasing.minLeaseDuration] || '');
            updateFormData('maxLeaseDuration', LEASE_DURATION_REVERSE_MAP[leasing.maxLeaseDuration] || '');
            updateFormData('description', leasing.description || '');
            updateFormData('petsAllowed', leasing.petsAllowed ?? null);
            updateFormData('pets', leasing.petCategory || []);
            updateFormData('petDeposit', leasing.petDeposit?.toString() || '');
            updateFormData('petRent', leasing.petFee?.toString() || '');
            updateFormData('petDescription', leasing.petDescription || '');
            updateFormData('receiveApplicationsOnline', leasing.onlineRentalApplication ?? null);
            updateFormData('applicationFee', leasing.requireApplicationFee ?? null);
            updateFormData('applicationFeeAmount', leasing.applicationFee?.toString() || '');
          } catch (err) {
            // If API call fails, leasing doesn't exist
            setLeasingId(null);
            return;
          }
        } else {
          // Unit data exists but no leasing - leasing doesn't exist
          setLeasingId(null);
          return;
        }
        return; // Exit early for unit-level leasing
      }

      // For property-level leasing (SINGLE properties or when no unit is selected)
      // First, check if leasing data is already available in propertyData (from backend)
      // This avoids unnecessary API calls when we know leasing doesn't exist
      let leasing = null;

      if (propertyData) {
        // Property data is loaded - check if leasing exists
        if (propertyData.leasing) {
          // Leasing exists in property data - call API to get full leasing with id
          try {
            leasing = await leasingService.getByPropertyId(formData.property);
          } catch (err) {
            // If API call fails, leasing doesn't exist
            setLeasingId(null);
            return;
          }
        } else {
          // Property data exists but no leasing - leasing doesn't exist, no need to call API
          setLeasingId(null);
          return;
        }
      } else {
        // PropertyData not loaded yet - make API call as fallback
        try {
          leasing = await leasingService.getByPropertyId(formData.property);
        } catch (err) {
          // If API call fails (including 404), leasing doesn't exist
          setLeasingId(null);
          return;
        }
      }

      // If leasing doesn't exist (null), that's okay - form is already cleared above
      if (!leasing) {
        setLeasingId(null);
        return;
      }

      setLeasingId(leasing.id);
      // Load existing leasing data into form
      updateFormData('rent', leasing.monthlyRent?.toString() || '');
      updateFormData('deposit', leasing.securityDeposit?.toString() || '');
      updateFormData('refundable', leasing.amountRefundable?.toString() || '');
      updateFormData('availableDate', leasing.dateAvailable ? new Date(leasing.dateAvailable).toISOString().split('T')[0] : '');
      // Map backend enum to numeric string for frontend
      updateFormData('minLeaseDuration', LEASE_DURATION_REVERSE_MAP[leasing.minLeaseDuration] || '');
      updateFormData('maxLeaseDuration', LEASE_DURATION_REVERSE_MAP[leasing.maxLeaseDuration] || '');
      updateFormData('description', leasing.description || '');
      updateFormData('petsAllowed', leasing.petsAllowed ?? null);
      updateFormData('pets', leasing.petCategory || []);
      updateFormData('petDeposit', leasing.petDeposit?.toString() || '');
      updateFormData('petRent', leasing.petFee?.toString() || '');
      updateFormData('petDescription', leasing.petDescription || '');
      updateFormData('receiveApplicationsOnline', leasing.onlineRentalApplication ?? null);
      updateFormData('applicationFee', leasing.requireApplicationFee ?? null);
      updateFormData('applicationFeeAmount', leasing.applicationFee?.toString() || '');
    };

    checkExistingLeasing();
  }, [formData.property, formData.unit, propertyData, unitData, updateFormData, setLeasingId]);

  // Save pet policy when moving from leasingStep 2
  const handleSavePetPolicy = async () => {
    if (!formData.property || !leasingId) {
      setError('Property and leasing information not available. Please start from step 1.');
      return;
    }

    if (formData.petsAllowed === null || formData.petsAllowed === undefined) {
      setError('Please select whether pets are allowed.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updateData: any = {
        petsAllowed: formData.petsAllowed,
      };

      await leasingService.update(leasingId, updateData);

      // Move to next step based on petsAllowed
      if (formData.petsAllowed) {
        setLeasingStep(3);
      } else {
        setCurrentStep(3);
        setApplicationStep(1);
      }
    } catch (err) {
      console.error('Error saving pet policy:', err);
      setError(err instanceof Error ? err.message : 'Failed to save pet policy. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save application settings when moving from applicationStep 1 to 2
  const handleSaveApplicationSettings = async () => {
    if (!formData.property || !leasingId) {
      setError('Property and leasing information not available. Please start from step 1.');
      return;
    }

    if (formData.receiveApplicationsOnline === null || formData.receiveApplicationsOnline === undefined) {
      setError('Please select whether to receive rental applications online.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updateData: any = {
        onlineRentalApplication: formData.receiveApplicationsOnline,
      };

      await leasingService.update(leasingId, updateData);

      // Move to next step
      setApplicationStep(2);
    } catch (err) {
      console.error('Error saving application settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to save application settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save application fee preference when moving from applicationStep 2
  const handleSaveApplicationFee = async () => {
    if (!formData.property || !leasingId) {
      setError('Property and leasing information not available. Please start from step 1.');
      return;
    }

    if (formData.applicationFee === null || formData.applicationFee === undefined) {
      setError('Please select whether to require application fee.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updateData: any = {
        requireApplicationFee: formData.applicationFee,
        // If application fee is not required, set fee to null
        applicationFee: formData.applicationFee ? (formData.applicationFeeAmount ? parseFloat(formData.applicationFeeAmount) : null) : null,
      };

      await leasingService.update(leasingId, updateData);

      // Move to next step based on applicationFee
      if (formData.applicationFee) {
        setApplicationStep(3);
      } else {
        setApplicationStep(4);
      }
    } catch (err) {
      console.error('Error saving application fee preference:', err);
      setError(err instanceof Error ? err.message : 'Failed to save application fee preference. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save listing contact when submitting final step
  const handleSaveListingContact = async () => {
    if (!formData.property) {
      setError('Property is required. Please select a property first.');
      return;
    }

    // Validate required fields
    if (!formData.contactName || !formData.phoneNumber || !formData.email) {
      setError('Please fill in all required fields (contact name, phone number, and email).');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Step 1: Update property with listing contact information
      const updateData: any = {
        listingContactName: formData.contactName,
        listingPhoneCountryCode: formData.countryCode || '+91',
        listingPhoneNumber: formData.phoneNumber,
        listingEmail: formData.email,
        displayPhonePublicly: formData.displayPhonePublicly || false,
      };

      await propertyService.update(formData.property, updateData);

      // Step 2: Create listing and update property status to ACTIVE
      // The backend service will handle both creating the listing and updating property status
      await listingService.create({
        propertyId: formData.property,
        unitId: formData.unit || undefined, // Include unitId if a unit is selected
        // The backend will automatically populate listing data from property/unit and leasing
      });

      // Show success modal
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Error saving listing contact and creating listing:', err);
      setError(err instanceof Error ? err.message : 'Failed to save listing contact and create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save application fee details when moving from applicationStep 3 to 4
  const handleSaveApplicationFeeDetails = async () => {
    if (!formData.property || !leasingId) {
      setError('Property and leasing information not available. Please start from step 1.');
      return;
    }

    if (!formData.applicationFeeAmount || parseFloat(formData.applicationFeeAmount) <= 0) {
      setError('Please enter a valid application fee amount.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updateData: any = {
        applicationFee: parseFloat(formData.applicationFeeAmount),
      };

      await leasingService.update(leasingId, updateData);

      // Move to next step
      setApplicationStep(4);
    } catch (err) {
      console.error('Error saving application fee details:', err);
      setError(err instanceof Error ? err.message : 'Failed to save application fee details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save pet details when moving from leasingStep 3
  const handleSavePetDetails = async () => {
    if (!formData.property || !leasingId) {
      setError('Property and leasing information not available. Please start from step 1.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updateData: any = {
        petCategory: Array.isArray(formData.pets) ? formData.pets : [],
        petDeposit: formData.petDeposit ? parseFloat(formData.petDeposit) : null,
        petFee: formData.petRent ? parseFloat(formData.petRent) : null,
        petDescription: formData.petDescription || null,
      };

      await leasingService.update(leasingId, updateData);

      // Move to next step
      setCurrentStep(3);
      setApplicationStep(1);
    } catch (err) {
      console.error('Error saving pet details:', err);
      setError(err instanceof Error ? err.message : 'Failed to save pet details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save leasing details when moving from leasingStep 1 to 2
  const handleSaveLeasingDetails = async () => {
    if (!formData.property) {
      setError('Property is required. Please select a property first.');
      return;
    }

    // Validate required fields
    if (!formData.rent || !formData.deposit || !formData.refundable || !formData.availableDate || !formData.minLeaseDuration || !formData.maxLeaseDuration) {
      setError('Please fill in all required fields (rent, deposit, refundable, date available, and lease durations).');
      return;
    }

    // For MULTI properties, unitId is required
    if (propertyData?.propertyType === 'MULTI' && !formData.unit) {
      setError('Unit is required for MULTI properties. Please select a unit first.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const leasingData = {
        propertyId: formData.property,
        unitId: formData.unit || undefined, // Include unitId if a unit is selected (required for MULTI properties)
        monthlyRent: parseFloat(formData.rent),
        securityDeposit: parseFloat(formData.deposit),
        amountRefundable: parseFloat(formData.refundable),
        dateAvailable: new Date(formData.availableDate).toISOString(),
        minLeaseDuration: mapLeaseDuration(formData.minLeaseDuration),
        maxLeaseDuration: mapLeaseDuration(formData.maxLeaseDuration),
        description: formData.description || undefined,
        petsAllowed: formData.petsAllowed ?? false,
        onlineRentalApplication: formData.receiveApplicationsOnline ?? false,
      };

      if (leasingId) {
        // Update existing leasing
        await leasingService.update(leasingId, leasingData);
      } else {
        // Create new leasing
        const createdLeasing = await leasingService.create(leasingData);
        setLeasingId(createdLeasing.id);
      }

      // Move to next step
      setLeasingStep(2);
    } catch (err) {
      console.error('Error saving leasing details:', err);
      setError(err instanceof Error ? err.message : 'Failed to save leasing details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      setLeasingStep(1);
    } else if (currentStep === 2) {
      if (leasingStep === 1) {
        // Save leasing details before moving to next step
        await handleSaveLeasingDetails();
        // handleSaveLeasingDetails will move to next step on success
      } else if (leasingStep === 2) {
        // Save pet policy before moving to next step
        await handleSavePetPolicy();
        // handleSavePetPolicy will move to next step on success
      } else if (leasingStep === 3) {
        // Save pet details before moving to next step
        await handleSavePetDetails();
        // handleSavePetDetails will move to next step on success
      }
    } else if (currentStep === 3) {
      if (applicationStep === 1) {
        // Save application settings before moving to next step
        await handleSaveApplicationSettings();
        // handleSaveApplicationSettings will move to next step on success
      } else if (applicationStep === 2) {
        // Save application fee preference before moving to next step
        await handleSaveApplicationFee();
        // handleSaveApplicationFee will move to next step on success
      } else if (applicationStep === 3) {
        // Save application fee details before moving to next step
        await handleSaveApplicationFeeDetails();
        // handleSaveApplicationFeeDetails will move to next step on success
      } else {
        // Handle submission from step 4 - save listing contact
        await handleSaveListingContact();
        // handleSaveListingContact will show success modal on success
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
    resetForm();
  };

  const handleCreateProperty = () => {
    setShowCreateProperty(true);
  };

  const handleEditProperty = (propertyId: string) => {
    updateFormData('property', propertyId);
    setShowCreateProperty(true);
  };

  const handlePropertyNext = (propertyId: string) => {
    // All property steps are complete, proceed to lease (step 2)
    updateFormData('property', propertyId);
    setCurrentStep(2);
    setLeasingStep(1);
  };

  const handlePropertyCreated = (propertyData: any) => {

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
                      onCreateProperty={handleCreateProperty}
                      onEditProperty={handleEditProperty}
                      onNext={handlePropertyNext}
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
                        <LeasingDetails
                          propertyId={formData.property}
                          unitId={formData.unit || undefined}
                        />
                        {error && (
                          <div className="w-full max-w-md mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-sm">{error}</p>
                          </div>
                        )}
                        <div className="w-full max-w-md mt-8 flex justify-center">
                          <NextStepButton onClick={handleNext} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Next'}
                          </NextStepButton>
                        </div>
                      </>
                    ) : leasingStep === 2 ? (
                      <>
                        <PetPolicy propertyId={formData.property} />
                        {error && (
                          <div className="w-full max-w-md mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-sm">{error}</p>
                          </div>
                        )}
                        <div className="w-full max-w-md mt-8 flex justify-center">
                          <NextStepButton onClick={handleNext} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Next'}
                          </NextStepButton>
                        </div>
                      </>
                    ) : (
                      <>
                        <PetDetails propertyId={formData.property} />
                        {error && (
                          <div className="w-full max-w-md mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-sm">{error}</p>
                          </div>
                        )}
                        <div className="w-full max-w-md mt-8 flex justify-center">
                          <NextStepButton onClick={handleNext} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Next'}
                          </NextStepButton>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="w-full flex flex-col items-center">
                    {applicationStep === 1 ? (
                      <>
                        <ApplicationSettings propertyId={formData.property} />
                        {error && (
                          <div className="w-full max-w-md mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-sm">{error}</p>
                          </div>
                        )}
                        <div className="w-full max-w-md mt-8 flex justify-center">
                          <NextStepButton onClick={handleNext} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Next'}
                          </NextStepButton>
                        </div>
                      </>
                    ) : applicationStep === 2 ? (
                      <>
                        <ApplicationFee propertyId={formData.property} />
                        {error && (
                          <div className="w-full max-w-md mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-sm">{error}</p>
                          </div>
                        )}
                        <div className="w-full max-w-md mt-8 flex justify-center">
                          <NextStepButton onClick={handleNext} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Next'}
                          </NextStepButton>
                        </div>
                      </>
                    ) : applicationStep === 3 ? (
                      <>
                        <ApplicationFeeDetails propertyId={formData.property} />
                        {error && (
                          <div className="w-full max-w-md mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-sm">{error}</p>
                          </div>
                        )}
                        <div className="w-full max-w-md mt-8 flex justify-center">
                          <NextStepButton onClick={handleNext} disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Next'}
                          </NextStepButton>
                        </div>
                      </>
                    ) : (
                      <>
                        <ListingContact onSubmit={handleNext} />
                        {error && (
                          <div className="w-full max-w-md mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-800 text-sm">{error}</p>
                          </div>
                        )}
                      </>
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
