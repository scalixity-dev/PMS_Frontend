/**
 * NewApplication Component
 * 
 * Form Persistence Strategy:
 * - Auto-saves form data to localStorage on every change when form is dirty
 * - Restores form data from localStorage on mount
 * - Prevents browser refresh/close with beforeunload event when form is dirty
 * - Only resets form explicitly:
 *   1. After successful submission (uncomment handleSubmitSuccess)
 *   2. When user clicks Cancel and confirms
 * - No automatic reset on unmount - protects against accidental data loss
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ApplicationStepper from './components/ApplicationStepper';
import PropertySelectionStep from './steps/PropertySelectionStep';
import ApplicantInfoStep from './steps/ApplicantInfoStep';
import OccupantsStep from './steps/OccupantsStep';
import PetsStep from './steps/PetsStep';
import VehiclesStep from './steps/VehiclesStep';
import AdditionalResidenceInfoStep from './steps/AdditionalResidenceInfoStep';
// ... existing imports ...
import ResidencesStep from './steps/ResidencesStep';
import { useApplicationStore } from './store/applicationStore';

const STORAGE_KEY = 'application_draft';

const NewApplication: React.FC = () => {
    const navigate = useNavigate();

    const {
        formData,
        currentStep,
        setCurrentStep,
        isPropertySelected,
        setIsPropertySelected,
        setFormData,
        resetForm
    } = useApplicationStore();

    // Check if form has any data (is dirty)
    const isFormDirty = React.useMemo(() => {
        return (
            formData.firstName.trim() !== '' ||
            formData.lastName.trim() !== '' ||
            formData.email.trim() !== '' ||
            formData.phoneNumber.trim() !== '' ||
            formData.shortBio.trim() !== '' ||
            formData.propertyId.trim() !== '' ||
            formData.occupants.length > 0 ||
            formData.pets.length > 0 ||
            formData.vehicles.length > 0 ||
            formData.residences.length > 0 ||
            formData.dob !== undefined ||
            formData.moveInDate !== undefined
        );
    }, [formData]);

    // Restore form data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Convert date strings back to Date objects
                if (parsed.formData.dob) {
                    parsed.formData.dob = new Date(parsed.formData.dob);
                }
                if (parsed.formData.moveInDate) {
                    parsed.formData.moveInDate = new Date(parsed.formData.moveInDate);
                }
                setFormData(parsed.formData);
                setCurrentStep(parsed.currentStep);
                setIsPropertySelected(parsed.isPropertySelected);
            } catch (error) {
                console.error('Failed to restore form data:', error);
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, [setFormData, setCurrentStep, setIsPropertySelected]);

    // Persist form data to localStorage on changes
    useEffect(() => {
        if (isFormDirty) {
            const dataToSave = {
                formData,
                currentStep,
                isPropertySelected,
                timestamp: new Date().toISOString()
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        }
    }, [formData, currentStep, isPropertySelected, isFormDirty]);

    // Handle browser refresh/close
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isFormDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isFormDirty]);

    // Add local state
    const [occupantSubStep, setOccupantSubStep] = React.useState<'occupants' | 'pets' | 'vehicles'>('occupants');
    const [residenceSubStep, setResidenceSubStep] = React.useState<'history' | 'additional'>('history');

    const handleCancel = () => {
        if (isFormDirty) {
            const shouldCancel = window.confirm(
                'Are you sure you want to cancel? All progress will be lost.'
            );
            if (shouldCancel) {
                resetForm();
                localStorage.removeItem(STORAGE_KEY);
                navigate('/dashboard/leasing/applications');
            }
        } else {
            navigate('/dashboard/leasing/applications');
        }
    };

    const handleBack = () => {
        if (currentStep === 1) {
            // ... existing logic ...
            if (isPropertySelected) {
                // Go back to property selection
                setIsPropertySelected(false);
            } else {
                // Exit with confirmation if form is dirty
                if (isFormDirty) {
                    handleCancel();
                } else {
                    navigate('/dashboard/leasing/applications');
                }
            }
        } else if (currentStep === 2) {
            if (occupantSubStep === 'pets') {
                setOccupantSubStep('occupants');
            } else if (occupantSubStep === 'vehicles') {
                setOccupantSubStep('pets');
            } else {
                setCurrentStep(currentStep - 1);
            }
        } else if (currentStep === 3) {
            if (residenceSubStep === 'additional') {
                setResidenceSubStep('history');
            } else {
                // Go back to Step 2 (Vehicles)
                // We need to set occupantSubStep to 'vehicles' so user lands on last part of Step 2? 
                // Currently defaults to 'occupants' in useState but logic inside step 2 resets it?
                // Let's just go back to step 2 generally.
                setCurrentStep(currentStep - 1);
                setOccupantSubStep('vehicles'); // Optional convenience
            }
        }
        else {
            setCurrentStep(currentStep - 1);
        }
    };

    const handlePropertySelected = () => {
        setIsPropertySelected(true);
    };

    /**
     * Call this function after successful form submission to clear saved data
     * Usage: <ContactsStep onSubmit={handleSubmitSuccess} />
     */
    /*
    const handleSubmitSuccess = () => {
        resetForm();
        localStorage.removeItem(STORAGE_KEY);
        navigate('/dashboard/leasing/applications');
    };
    */

    const renderContent = () => {
        switch (currentStep) {
            // ... case 1 ...
            case 1:
                return isPropertySelected ? (
                    <ApplicantInfoStep onNext={() => setCurrentStep(currentStep + 1)} />
                ) : (
                    <PropertySelectionStep onNext={handlePropertySelected} />
                );
            // ... case 2 ...
            case 2:
                if (occupantSubStep === 'occupants') {
                    return <OccupantsStep onNext={() => setOccupantSubStep('pets')} />;
                } else if (occupantSubStep === 'pets') {
                    return <PetsStep onNext={() => setOccupantSubStep('vehicles')} />;
                } else {
                    return <VehiclesStep onNext={() => {
                        setOccupantSubStep('occupants'); // Reset logic if needed
                        setCurrentStep(currentStep + 1);
                    }} />;
                }
            case 3:
                if (residenceSubStep === 'history') {
                    return <ResidencesStep onNext={() => setResidenceSubStep('additional')} />;
                } else {
                    return <AdditionalResidenceInfoStep onNext={() => setCurrentStep(currentStep + 1)} />;
                }
            // ...
            // ...
            case 4:
                // TODO: When implementing the final step, call handleSubmitSuccess() after successful submission
                // Example: <ContactsStep onSubmit={handleSubmitSuccess} />
                return <div className="text-center py-10">Contacts Step (Coming Soon)</div>;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-6xl mx-auto bg-[#DFE5E3] p-6 pb-20 flex flex-col rounded-xl">
            {/* Header Navigation */}
            <div className="w-full flex items-center justify-between mb-8">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-[#3A6D6C] font-bold text-sm tracking-wide hover:opacity-80 transition-opacity"
                >
                    <ChevronLeft size={20} strokeWidth={3} />
                    BACK
                </button>
                {isFormDirty && (
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors"
                    >
                        Cancel Application
                    </button>
                )}
            </div>

            {/* Stepper */}
            <ApplicationStepper currentStep={currentStep} />

            {/* Auto-save indicator */}
            {isFormDirty && (
                <div className="text-center py-2">
                    <span className="text-xs text-gray-500 italic">
                        ✓ Progress automatically saved
                    </span>
                </div>
            )}

            {/* Content Area */}
            <div className="w-full flex-1 mt-4">
                {renderContent()}
            </div>
        </div>
    );
};

export default NewApplication;
