import React, { useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
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
import IncomeStep from './steps/IncomeStep';
import AdditionalIncomeStep from './steps/AdditionalIncomeStep';
import EmergencyContactStep from './steps/EmergencyContactStep';
import DocumentsStep from './steps/DocumentsStep';
import { useApplicationStore } from './store/applicationStore';
import ApplicationSuccessModal from './components/ApplicationSuccessModal';
import ApplicationErrorModal from './components/ApplicationErrorModal';

const STORAGE_KEY = 'application_draft';

const NewApplication: React.FC = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed = false } = useOutletContext<{ sidebarCollapsed: boolean }>() || {};

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
            formData.incomes.length > 0 ||
            formData.dob !== undefined ||
            formData.moveInDate !== undefined
        );
    }, [formData]);

    // Helper to recursively convert date strings to Date objects
    const walkAndConvertDates = (obj: any): any => {
        if (obj === null || obj === undefined) return obj;

        // If it's an array, recurse into each element
        if (Array.isArray(obj)) {
            return obj.map(item => walkAndConvertDates(item));
        }

        // If it's an object, recurse into each property
        if (typeof obj === 'object') {
            const converted: any = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    const value = obj[key];
                    // Convert known date property names
                    if ((key === 'dob' || key === 'moveInDate' || key === 'moveOutDate') && typeof value === 'string') {
                        converted[key] = new Date(value);
                    } else {
                        converted[key] = walkAndConvertDates(value);
                    }
                }
            }
            return converted;
        }

        return obj;
    };

    // Restore form data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Convert all date strings to Date objects recursively
                parsed.formData = walkAndConvertDates(parsed.formData);

                // Check if documents were saved but files are lost
                if (parsed.formData.documents && parsed.formData.documents.length > 0) {
                    setDocumentsNeedReupload(true);
                    // Clear documentFiles since they can't be restored
                    parsed.formData.documentFiles = [];
                }

                // Clear photoFile as it can't be restored from localStorage
                if (parsed.formData.photo) {
                    parsed.formData.photoFile = null;
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
            // Exclude non-serializable File objects from localStorage
            const { documentFiles, photoFile, ...serializableFormData } = formData;

            const dataToSave = {
                formData: serializableFormData,
                currentStep,
                isPropertySelected,
                timestamp: new Date().toISOString()
            };

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
            } catch (error) {
                console.error('Failed to save form data to localStorage:', error);
            }
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
    const [lastOccupantSubStep, setLastOccupantSubStep] = React.useState<'occupants' | 'pets' | 'vehicles'>('vehicles');
    const [residenceSubStep, setResidenceSubStep] = React.useState<'history' | 'additional' | 'income' | 'additionalIncome'>('history');
    const [lastResidenceSubStep, setLastResidenceSubStep] = React.useState<'history' | 'additional' | 'income' | 'additionalIncome'>('additionalIncome');
    const [showSuccessModal, setShowSuccessModal] = React.useState(false);
    const [showErrorModal, setShowErrorModal] = React.useState(false);
    const [errorMessages, setErrorMessages] = React.useState<string[]>([]);
    const [documentsNeedReupload, setDocumentsNeedReupload] = React.useState(false);

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
            // Clear form data and storage to prevent dirty state blocking
            resetForm();
            localStorage.removeItem(STORAGE_KEY);

            // Force navigation to applications page
            setTimeout(() => {
                navigate('/dashboard/leasing/applications');
            }, 0);
        } else if (currentStep === 2) {
            if (occupantSubStep === 'pets') {
                setOccupantSubStep('occupants');
            } else if (occupantSubStep === 'vehicles') {
                setOccupantSubStep('pets');
            } else {
                setCurrentStep(currentStep - 1);
            }
        } else if (currentStep === 3) {
            if (residenceSubStep === 'additionalIncome') {
                setResidenceSubStep('income');
            } else if (residenceSubStep === 'income') {
                setResidenceSubStep('additional');
            } else if (residenceSubStep === 'additional') {
                setResidenceSubStep('history');
            } else {
                // Go back to Step 2 - restore last visited sub-step
                setCurrentStep(currentStep - 1);
                setOccupantSubStep(lastOccupantSubStep);
            }
        } else if (currentStep === 4) {
            // Go back to Step 3 - restore last visited residence sub-step
            setCurrentStep(currentStep - 1);
            setResidenceSubStep(lastResidenceSubStep);
        } else if (currentStep === 5) {
            setCurrentStep(currentStep - 1);
        } else {
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
    const handleSubmitSuccess = async () => {
        try {
            // Get leasingId from propertyId and unitId
            const { leasingService } = await import('../../../../services/leasing.service');
            const { applicationService } = await import('../../../../services/application.service');

            // First, try to get leasing by propertyId
            let leasing = await leasingService.getByPropertyId(formData.propertyId);

            // If no leasing found and we have a unitId, we might need to check unit-level leasing
            // For now, we'll require that a leasing exists for the property
            if (!leasing) {
                throw new Error('No leasing found for the selected property. Please create a leasing first.');
            }

            // Submit the application
            await applicationService.create(formData, leasing.id);

            // Clear form and show success
            resetForm();
            localStorage.removeItem(STORAGE_KEY);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Failed to submit application:', error);
            let errors: string[] = [];

            if (error instanceof Error) {
                // Check if error has messages array (from our service)
                if ('messages' in error && Array.isArray((error as any).messages)) {
                    errors = (error as any).messages;
                } else {
                    // Fallback to error message
                    errors = [error.message];
                }
            } else {
                errors = ['Failed to submit application. Please try again.'];
            }

            setErrorMessages(errors);
            setShowErrorModal(true);
        }
    };

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
                        setLastOccupantSubStep(occupantSubStep); // Save last visited sub-step
                        setCurrentStep(currentStep + 1);
                    }} />;
                }
            case 3:
                if (residenceSubStep === 'history') {
                    return <ResidencesStep onNext={() => setResidenceSubStep('additional')} />;
                } else if (residenceSubStep === 'additional') {
                    return <AdditionalResidenceInfoStep onNext={() => setResidenceSubStep('income')} />;
                } else if (residenceSubStep === 'income') {
                    return <IncomeStep onNext={() => setResidenceSubStep('additionalIncome')} />;
                } else {
                    return <AdditionalIncomeStep
                        onNext={() => {
                            setLastResidenceSubStep(residenceSubStep); // Save last visited sub-step
                            setCurrentStep(currentStep + 1);
                        }}
                    />;
                }
            // ...
            // ...
            case 4:
                return <EmergencyContactStep onNext={() => setCurrentStep(currentStep + 1)} />;
            case 5:
                return <DocumentsStep onNext={handleSubmitSuccess} />;
            default:
                return null;
        }
    };

    return (
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto bg-[#DFE5E3] p-4 sm:p-6 pb-20 flex flex-col rounded-xl transition-all duration-300`}>
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

            {/* Document re-upload warning */}
            {documentsNeedReupload && currentStep === 5 && (
                <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-yellow-800 mb-1">Document Files Need Re-upload</h3>
                            <p className="text-xs text-yellow-700">
                                Your document information was saved, but the actual files cannot be restored after a page refresh.
                                Please re-upload your documents ({formData.documents.length} file{formData.documents.length !== 1 ? 's' : ''} previously attached).
                            </p>
                            <button
                                onClick={() => {
                                    setDocumentsNeedReupload(false);
                                    // Clear the document metadata since files can't be restored
                                    setFormData({ ...formData, documents: [], documentFiles: [] });
                                }}
                                className="mt-2 text-xs text-yellow-800 underline hover:text-yellow-900"
                            >
                                Clear saved document information
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="w-full flex-1 mt-4">
                {renderContent()}
            </div>

            <ApplicationSuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
            />

            <ApplicationErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                errors={errorMessages}
            />
        </div>
    );
};

export default NewApplication;
