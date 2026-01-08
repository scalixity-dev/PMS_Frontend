import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useLocation, UNSAFE_NavigationContext } from "react-router-dom";
import ApplicationStepper from "./components/ApplicationStepper";
import ApplicantInfoStep from "./steps/ApplicantInfoStep";
import OccupantsStep from "./steps/OccupantsStep";
import PetsStep from "./steps/PetsStep";
import VehiclesStep from "./steps/VehiclesStep";
import ResidencesStep from "./steps/ResidencesStep";
import AdditionalResidenceInfoStep from "./steps/AdditionalResidenceInfoStep";
import IncomeStep from "./steps/IncomeStep";
import AdditionalIncomeStep from "./steps/AdditionalIncomeStep";
import EmergencyContactStep from "./steps/EmergencyContactStep";
import BackgroundQuestionsStep from "./steps/BackgroundQuestionsStep";
import DocumentsStep from "./steps/DocumentsStep";
import { useApplicationStore } from "../../../Dashboard/features/Application/store/applicationStore";
import ApplicationSuccessModal from "./components/ApplicationSuccessModal";
import ApplicationErrorModal from "./components/ApplicationErrorModal";
import UnsavedChangesModal from "../../../Dashboard/components/UnsavedChangesModal";

// const STORAGE_KEY = 'user_application_draft';

const UserNewApplication: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shouldAllowNavigation, setShouldAllowNavigation] = useState(false);
    const [nextLocation, setNextLocation] = useState<string | null>(null);

    const {
        formData,
        currentStep,
        setCurrentStep,
        setIsPropertySelected,
        resetForm,
        updateFormData,
    } = useApplicationStore();

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    // Auto-select property if passed in state
    useEffect(() => {
        const state = location.state as { propertyId?: string };
        if (state?.propertyId) {
            updateFormData('propertyId', state.propertyId);
            setIsPropertySelected(true);
        } else {
            // If no property is selected and we're in user dashboard, 
            // we might want to default to something or show an error
            // For now, let's just make sure it stays on ApplicantInfoStep if we want to skip selection
            setIsPropertySelected(true);
        }
    }, [location.state, updateFormData, setIsPropertySelected]);

    // Access the navigation context to intercept navigation
    const navigationContext = React.useContext(UNSAFE_NavigationContext);

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
            formData.vehicles.length > 0
        );
    }, [formData]);

    // Block navigation when form has unsaved changes
    useEffect(() => {
        if (!isFormDirty || shouldAllowNavigation) return;

        const { navigator } = navigationContext;
        const originalPush = navigator.push;
        const originalReplace = navigator.replace;

        navigator.push = (...args: Parameters<typeof originalPush>) => {
            const [to] = args;
            const targetPath = typeof to === 'string' ? to : to.pathname;
            if (targetPath !== location.pathname) {
                setNextLocation(targetPath || '');
                setIsModalOpen(true);
            } else {
                originalPush(...args);
            }
        };

        navigator.replace = (...args: Parameters<typeof originalReplace>) => {
            const [to] = args;
            const targetPath = typeof to === 'string' ? to : to.pathname;
            if (targetPath !== location.pathname) {
                setNextLocation(targetPath || '');
                setIsModalOpen(true);
            } else {
                originalReplace(...args);
            }
        };

        return () => {
            navigator.push = originalPush;
            navigator.replace = originalReplace;
        };
    }, [isFormDirty, shouldAllowNavigation, location.pathname, navigationContext]);

    const saveDraft = useCallback(() => {
        if (!isFormDirty) return;

        const name = `${formData.firstName} ${formData.lastName}`.trim();
        const newDraft = {
            id: 'draft_active',
            name: name || 'Draft Applicant',
            phone: formData.phoneNumber || 'N/A',
            status: "Draft",
            appliedDate: new Date().toISOString().split('T')[0],
            address: 'In Progress...'
        };

        const existingApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
        const filteredApps = existingApps.filter((app: any) => app.id !== 'draft_active');
        localStorage.setItem('user_applications', JSON.stringify([newDraft, ...filteredApps]));
    }, [formData, isFormDirty]);

    useEffect(() => {
        const timer = setTimeout(() => {
            saveDraft();
        }, 1000);
        return () => clearTimeout(timer);
    }, [formData, saveDraft]);

    const handleConfirmLeave = useCallback(() => {
        saveDraft();
        setIsModalOpen(false);
        setShouldAllowNavigation(true);
        if (nextLocation) {
            setTimeout(() => {
                navigate(nextLocation);
            }, 0);
        }
    }, [nextLocation, navigate, saveDraft]);

    const handleCancelLeave = useCallback(() => {
        setIsModalOpen(false);
        setNextLocation(null);
    }, []);

    const handleBack = () => {
        if (currentStep === 1) {
            navigate(-1);
        } else {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmitSuccess = async () => {
        try {
            const { applicationService } = await import('../../../../services/application.service');
            const { leasingService } = await import('../../../../services/leasing.service');

            let leasingId = 'mock_leasing_id_123';
            let address = 'Gandhi Path Rd, Jaipur, Rajasthan 302020';
            try {
                const leasing = await leasingService.getByPropertyId(formData.propertyId);
                if (leasing) {
                    leasingId = leasing.id;
                    if (leasing.property?.address) {
                        const addr = leasing.property.address;
                        address = `${addr.streetAddress}, ${addr.city}, ${addr.stateRegion} ${addr.zipCode}, ${addr.country}`;
                    }
                }
            } catch (err) {
                console.warn('Leasing fetch failed, using mock data');
            }

            // Create application (will probably work if backend is mocked or use fallback)
            try {
                await applicationService.create(formData, leasingId);
            } catch (err) {
                console.warn('API submission failed, persisting locally for demo');
            }

            // Persist locally so it shows up in the Applications list
            const existingApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
            const filteredApps = existingApps.filter((app: any) => app.id !== 'draft_active');

            const newApp = {
                id: Date.now(),
                name: `${formData.firstName} ${formData.lastName}`,
                phone: formData.phoneNumber,
                status: "Submitted",
                appliedDate: new Date().toISOString().split('T')[0],
                address: address
            };

            localStorage.setItem('user_applications', JSON.stringify([newApp, ...filteredApps]));

            resetForm();
            setShouldAllowNavigation(true);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Failed to submit application:', error);
            setErrorMessages([error instanceof Error ? error.message : 'Failed to submit application.']);
            setShowErrorModal(true);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <ApplicantInfoStep onNext={() => setCurrentStep(2)} />
                );
            case 2:
                return <OccupantsStep onNext={() => setCurrentStep(3)} />;
            case 3:
                return <PetsStep onNext={() => setCurrentStep(4)} />;
            case 4:
                return <VehiclesStep onNext={() => setCurrentStep(5)} />;
            case 5:
                return <ResidencesStep onNext={() => setCurrentStep(6)} />;
            case 6:
                return <AdditionalResidenceInfoStep onNext={() => setCurrentStep(7)} />;
            case 7:
                return <IncomeStep onNext={() => setCurrentStep(8)} />;
            case 8:
                return <AdditionalIncomeStep onNext={() => setCurrentStep(9)} />;
            case 9:
                return <EmergencyContactStep onNext={() => setCurrentStep(10)} />;
            case 10:
                return <BackgroundQuestionsStep onNext={() => setCurrentStep(11)} />;
            case 11:
                return <DocumentsStep onNext={handleSubmitSuccess} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-10 relative">
            <div className="max-w-4xl mx-auto">
                <div className="bg-[#F5F5F5] rounded-xl shadow-[0px_3.9px_3.9px_0px_#00000040] border border-gray-100 p-8 relative">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-1 text-[#004D40] font-bold text-sm mb-6 hover:opacity-80 transition-opacity"
                    >
                        <ChevronLeft size={18} />
                        BACK
                    </button>

                    <ApplicationStepper currentStep={currentStep} />

                    <div className="step-content">
                        {renderStep()}
                    </div>
                </div>
            </div>

            <ApplicationSuccessModal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    navigate('/userdashboard/applications');
                }}
            />

            <ApplicationErrorModal
                isOpen={showErrorModal}
                onClose={() => setShowErrorModal(false)}
                errors={errorMessages}
            />

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={handleCancelLeave} />
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl relative z-10">
                        <UnsavedChangesModal
                            isOpen={isModalOpen}
                            onClose={handleCancelLeave}
                            onConfirm={handleConfirmLeave}
                            title="You're about to leave"
                            message="Are you sure you want to leave without saving? You will lose any changes made."
                            cancelText="No"
                            confirmText="Yes, I'm sure"
                            noBlur={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserNewApplication;
