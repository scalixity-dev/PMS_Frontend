import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { useUserApplicationStore } from "./store/userApplicationStore";
import ApplicationSuccessModal from "./components/ApplicationSuccessModal";
import ApplicationErrorModal from "./components/ApplicationErrorModal";
import UnsavedChangesModal from "../../../Dashboard/components/UnsavedChangesModal";

const APPLICATIONS_KEY = 'user_applications';

const getDraftId = (propertyId?: string) => {
    return propertyId ? `draft_${propertyId}` : 'draft_general';
};

const getDraftDataKey = (draftId: string) => {
    return `application_draft_data_${draftId}`;
};

const hasValue = (v: any): boolean =>
    Array.isArray(v) ? v.length > 0 :
        v && typeof v === 'object' ? Object.keys(v).length > 0 :
            typeof v === 'string' ? v.trim() !== '' :
                v !== null && v !== undefined && v !== false;

const UserNewApplication: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [shouldAllowNavigation, setShouldAllowNavigation] = useState(false);
    const pendingNavigationRef = useRef<string | null>(null);

    const {
        formData,
        currentStep,
        setCurrentStep,
        setIsPropertySelected,
        resetForm,
        updateFormData,
        setFormData,
    } = useUserApplicationStore();

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | undefined>(undefined);
    const [isWarning, setIsWarning] = useState(false);

    // Load draft on mount
    useEffect(() => {
        const state = location.state as { propertyId?: string };
        const targetPropertyId = state?.propertyId;
        const draftId = getDraftId(targetPropertyId);
        const dataKey = getDraftDataKey(draftId);

        const savedDraftData = localStorage.getItem(dataKey);

        if (savedDraftData) {
            try {
                const { formData: savedData, currentStep: savedStep } = JSON.parse(savedDraftData);

                // If we have a propertyId from state (Invitation flow)
                if (targetPropertyId) {
                    // Ideally the saved draft propertyId matches the target because the key matched
                    // But double check to be safe
                    if (savedData.propertyId === targetPropertyId) {
                        setFormData(savedData);
                        setCurrentStep(savedStep);
                        setIsPropertySelected(true);
                    } else {
                        // Mismatch (shouldn't happen with unique keys), reset
                        resetForm();
                        updateFormData('propertyId', targetPropertyId);
                        setIsPropertySelected(true);
                    }
                } else {
                    // Continue flow (no state.propertyId) - e.g. resuming a 'general' draft
                    setFormData(savedData);
                    setCurrentStep(savedStep);
                    setIsPropertySelected(!!savedData.propertyId);
                }
            } catch (error) {
                console.error('Failed to parse saved draft:', error);
            }
        } else if (targetPropertyId) {
            // No saved draft for this property, but coming from invitation
            resetForm();
            updateFormData('propertyId', targetPropertyId);
            setIsPropertySelected(true);
        }
    }, [location.state, updateFormData, setCurrentStep, setIsPropertySelected, resetForm]);

    const isFormDirty = React.useMemo(() => {
        // Form is dirty if anything other than propertyId is set, 
        // or if we have a propertyId and we've moved past step 1
        const hasData = Object.entries(formData).some(([key, value]) => {
            if (key === 'propertyId') return false;
            return hasValue(value);
        });
        return hasData || (!!formData.propertyId && currentStep > 1);
    }, [formData, currentStep]);

    // Block browser navigation (refresh, close tab) when form has unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isFormDirty && !shouldAllowNavigation) {
                e.preventDefault();
                e.returnValue = '';
                return '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isFormDirty, shouldAllowNavigation]);

    // Handle browser back/forward button
    useEffect(() => {
        if (!isFormDirty || shouldAllowNavigation) return;

        const handlePopState = () => {
            pendingNavigationRef.current = 'back';
            setIsModalOpen(true);
            // Re-push the trap state if the user tries to go back
            const currentState = window.history.state || {};
            window.history.pushState({ ...currentState, trapped: true }, '', location.pathname);
        };

        // Only push a trap state if we aren't already trapped
        const currentState = window.history.state;
        if (!currentState?.trapped) {
            window.history.pushState({ ...currentState, trapped: true }, '', location.pathname);
        }

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [isFormDirty, shouldAllowNavigation, location.pathname]);

    // Internal Navigation Blocking (Sidebar, Links, etc.)
    const navigationContext = React.useContext(UNSAFE_NavigationContext);
    const shouldAllowNavigationRef = useRef(false);

    useEffect(() => {
        shouldAllowNavigationRef.current = shouldAllowNavigation;

        if (!isFormDirty || shouldAllowNavigation) return;

        const { navigator } = navigationContext;
        const originalPush = navigator.push;
        const originalReplace = navigator.replace;

        navigator.push = (...args: Parameters<typeof originalPush>) => {
            if (shouldAllowNavigationRef.current) {
                return originalPush(...args);
            }
            const [to] = args;
            const targetPath = typeof to === 'string' ? to : to.pathname;

            if (targetPath && targetPath !== location.pathname) {
                pendingNavigationRef.current = targetPath;
                setIsModalOpen(true);
            } else {
                originalPush(...args);
            }
        };

        navigator.replace = (...args: Parameters<typeof originalReplace>) => {
            if (shouldAllowNavigationRef.current) {
                return originalReplace(...args);
            }
            const [to] = args;
            const targetPath = typeof to === 'string' ? to : to.pathname;

            if (targetPath && targetPath !== location.pathname) {
                pendingNavigationRef.current = targetPath;
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
        if (!isFormDirty || shouldAllowNavigation) return;

        const name = `${formData.firstName} ${formData.lastName}`.trim();
        const propertyAddress = formData.propertyId === 'prop_mock_123'
            ? 'Sagar Sadhan Hotel Rd, Thoothukudi, TN 462026, IN'
            : 'In Progress...';

        const draftId = getDraftId(formData.propertyId);

        const newDraft = {
            id: draftId,
            name: name || 'Draft Applicant',
            phone: formData.phoneNumber || 'N/A',
            status: "Draft",
            appliedDate: new Date().toISOString().split('T')[0],
            address: propertyAddress,
            propertyId: formData.propertyId // Link to invitation
        };

        // Save summary for list view
        const existingApps = JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || '[]') as Array<{ id: string | number }>;
        // Remove ANY existing entry with this specific draft ID to update it
        const filteredApps = existingApps.filter((app) => app.id !== draftId);
        localStorage.setItem(APPLICATIONS_KEY, JSON.stringify([newDraft, ...filteredApps]));

        // Save full data for persistence
        const dataKey = getDraftDataKey(draftId);
        localStorage.setItem(dataKey, JSON.stringify({
            formData,
            currentStep
        }));
    }, [formData, currentStep, isFormDirty, shouldAllowNavigation]);

    useEffect(() => {
        const timer = setTimeout(() => {
            saveDraft();
        }, 1000);
        return () => clearTimeout(timer);
    }, [formData, currentStep, saveDraft]);

    const handleConfirmLeave = useCallback(() => {
        saveDraft();
        setShouldAllowNavigation(true);
        setIsModalOpen(false);

        // Navigate to pending location if there is one
        if (pendingNavigationRef.current) {
            if (pendingNavigationRef.current === 'back') {
                // Since we prevent duplicate traps now, navigate(-1) should correctly
                // go back to the previous page from the trapped state.
                // However, browser back (popstate) puts us on the PREVIOUS page temporarily,
                // then we re-push trap. So we are at Trap.
                // navigate(-1) -> Previous.
                navigate(-1);
            } else {
                navigate(pendingNavigationRef.current);
            }
            pendingNavigationRef.current = null;
        } else {
            navigate(-1);
        }
    }, [navigate, saveDraft]);

    const handleCancelLeave = useCallback(() => {
        setIsModalOpen(false);
        pendingNavigationRef.current = null;
    }, []);

    const handleBack = () => {
        if (currentStep === 1) {
            if (isFormDirty && !shouldAllowNavigation) {
                pendingNavigationRef.current = 'back';
                setIsModalOpen(true);
            } else {
                // If we are clean but sitting on a trapped history state (e.g. user cleared form),
                // navigate(-1) won't work because it just goes to the underlying page with same URL.
                // We need to skip the trap (-2).
                const state = window.history.state;
                if (state?.trapped) {
                    navigate(-2);
                } else {
                    navigate(-1);
                }
            }
        } else {
            setCurrentStep(currentStep - 1);
        }
    };

    const fetchLeasingData = async () => {
        const { leasingService } = await import('../../../../services/leasing.service');
        let leasingId: string | undefined;
        let address: string | undefined;
        let leasingFetchFailed = false;

        if (formData.propertyId?.trim()) {
            try {
                const leasing = await leasingService.getByPropertyId(formData.propertyId);
                if (leasing && leasing.id) {
                    leasingId = leasing.id;
                    if (leasing.property?.address) {
                        const addr = leasing.property.address;
                        address = `${addr.streetAddress}, ${addr.city}, ${addr.stateRegion} ${addr.zipCode}, ${addr.country}`;
                    }
                } else {
                    leasingFetchFailed = true;
                }
            } catch (error) {
                leasingFetchFailed = true;
            }
        } else {
            leasingFetchFailed = true;
        }

        if (leasingFetchFailed) {
            if (import.meta.env.DEV) {
                leasingId = 'mock_leasing_id_123';
                address = 'Gandhi Path Rd, Jaipur, Rajasthan 302020';
            } else {
                throw new Error('Unable to verify property details. Please try again or contact support.');
            }
        }

        return { leasingId: leasingId as string, address, leasingFetchFailed };
    };

    const submitApplication = async (leasingId: string) => {
        const { applicationService } = await import('../../../../services/application.service');
        try {
            await applicationService.create(formData, leasingId);
            return true;
        } catch (err) {
            console.warn('API submission failed, persisting locally', err);
            return false;
        }
    };

    const persistApplicationLocally = (address?: string) => {
        const existingApps = JSON.parse(localStorage.getItem(APPLICATIONS_KEY) || '[]') as Array<{ id: string | number }>;
        const draftId = getDraftId(formData.propertyId);
        const filteredApps = existingApps.filter((app) => app.id !== draftId);

        // Also clean up the draft data from storage since it is now submitted
        const dataKey = getDraftDataKey(draftId);
        localStorage.removeItem(dataKey);

        const newApp = {
            id: Date.now(),
            name: `${formData.firstName} ${formData.lastName}`,
            phone: formData.phoneNumber,
            status: "Submitted",
            appliedDate: new Date().toISOString().split('T')[0],
            address: address || 'Address not available'
        };

        localStorage.setItem(APPLICATIONS_KEY, JSON.stringify([newApp, ...filteredApps]));
    };

    const handleSubmitSuccess = async () => {
        try {
            const { leasingId, address, leasingFetchFailed } = await fetchLeasingData();
            const apiSubmissionSuccessful = await submitApplication(leasingId);

            persistApplicationLocally(address);

            resetForm();
            setShouldAllowNavigation(true);

            const warningMessages: string[] = [];
            if (leasingFetchFailed) {
                warningMessages.push("We couldn't retrieve the property address. A placeholder address has been used.");
            }
            if (!apiSubmissionSuccessful) {
                warningMessages.push("Application saved locally. It will be submitted when you're back online.");
            }

            if (apiSubmissionSuccessful && !leasingFetchFailed) {
                setSuccessMessage(undefined);
                setIsWarning(false);
            } else {
                setSuccessMessage(warningMessages.join(' '));
                setIsWarning(true);
            }
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
                message={successMessage}
                isWarning={isWarning}
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
