import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate, UNSAFE_NavigationContext } from "react-router-dom";
import { useNewRequestForm } from "./hooks/useNewRequestForm";
import Stepper from "./components/new-request/Stepper";
import UnsavedChangesModal from "../../../Dashboard/components/UnsavedChangesModal";
import User__AdvancedRequestForm from "./components/UserStep1RequestForm";
import UserStep2PropertyTenants from "./components/UserStep2PropertyTenants";
import UserStep3DueDateMaterials from "./components/UserStep3DueDateMaterials";
import { propertiesList } from "./constants/requestData";




const NewRequest: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldAllowNavigation, setShouldAllowNavigation] = useState(false);
  const [nextLocation, setNextLocation] = useState<string | null>(null);

  const {
    currentStep,
    prevStep,
    nextStep,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    selectedProblem,
    setSelectedProblem,
    finalDetail,
    setFinalDetail,
    title,
    setTitle,
    description,
    setDescription,
    authorization,
    setAuthorization,
    authCode,
    setAuthCode,
    pets,
    setPets,
    availability,
    setAvailability,
    dateDue,
    setDateDue,
    priority,
    setPriority,
    materials,
    setMaterials,
    submissionError,
    setSubmissionError,
    handleSubmit,
    hasFormData,
    property,
    setProperty,
    attachments,
    setAttachments,
    video,
    setVideo,
    selectedEquipment,
    setSelectedEquipment,
    setEquipmentSerial,
    setEquipmentCondition,
  } = useNewRequestForm();




  // Access the navigation context to intercept navigation
  const navigationContext = React.useContext(UNSAFE_NavigationContext);

  /* Use a ref to track navigation allowance synchronously, 
     preventing race conditions between state updates and navigation events */
  const shouldAllowNavigationRef = React.useRef(false);

  // Block navigation when form has unsaved changes
  useEffect(() => {
    // Sync ref with state when state changes (for other cases)
    shouldAllowNavigationRef.current = shouldAllowNavigation;

    if (!hasFormData || shouldAllowNavigation) return;

    const { navigator } = navigationContext;
    const originalPush = navigator.push;
    const originalReplace = navigator.replace;

    // Intercept push navigation
    navigator.push = (...args: Parameters<typeof originalPush>) => {
      // Check ref directly for immediate feedback during submission
      if (shouldAllowNavigationRef.current) {
        return originalPush(...args);
      }

      const [to] = args;
      const targetPath = typeof to === 'string' ? to : to.pathname;

      if (targetPath !== location.pathname) {
        setNextLocation(targetPath || '');
        setIsModalOpen(true);
      } else {
        originalPush(...args);
      }
    };

    // Intercept replace navigation
    navigator.replace = (...args: Parameters<typeof originalReplace>) => {
      // Check ref directly
      if (shouldAllowNavigationRef.current) {
        return originalReplace(...args);
      }

      const [to] = args;
      const targetPath = typeof to === 'string' ? to : to.pathname;

      if (targetPath !== location.pathname) {
        setNextLocation(targetPath || '');
        setIsModalOpen(true);
      } else {
        originalReplace(...args);
      }
    };

    // Cleanup
    return () => {
      navigator.push = originalPush;
      navigator.replace = originalReplace;
    };
  }, [hasFormData, shouldAllowNavigation, location.pathname, navigationContext]);

  // Handle browser navigation (refresh, close tab, etc.)
  useEffect(() => {
    // For browser native events, the state is sufficient usually, 
    // but the ref is consistent.
    if (!hasFormData || shouldAllowNavigation) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldAllowNavigationRef.current) return;
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasFormData, shouldAllowNavigation]);

  const handleConfirmLeave = useCallback(() => {
    setIsModalOpen(false);
    shouldAllowNavigationRef.current = true;
    setShouldAllowNavigation(true);

    // Navigate to the target location
    if (nextLocation) {
      setTimeout(() => {
        navigate(nextLocation);
      }, 0);
    }
  }, [nextLocation, navigate]);

  const handleCancelLeave = useCallback(() => {
    setIsModalOpen(false);
    setNextLocation(null);
  }, []);

  // Wrap handleSubmit to allow navigation after successful submission
  const handleFormSubmit = async () => {
    // Temporarily allow navigation for the submission-triggered redirect
    shouldAllowNavigationRef.current = true;
    setShouldAllowNavigation(true);

    const success = await handleSubmit();

    // If submission failed, we should restore navigation blocking to prevent data loss
    if (!success) {
      shouldAllowNavigationRef.current = false;
      setShouldAllowNavigation(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <User__AdvancedRequestForm
            onNext={(data) => {
              console.log('Advanced Data:', data);
              setSelectedCategory(data.category);
              setSelectedSubCategory(data.subCategory);
              setSelectedProblem(data.issue);
              setFinalDetail(data.subIssue);
              setTitle(data.title);
              setDescription(data.details);

              // Correctly handle files from step 1
              if (data.files && Array.isArray(data.files)) {
                const newAttachments = data.files.filter((f: File) => !f.type.startsWith('video/'));
                const newVideo = data.files.find((f: File) => f.type.startsWith('video/')) || null;
                setAttachments(newAttachments);
                setVideo(newVideo);
              }

              nextStep(2);
            }}
            onDiscard={() => navigate('/userdashboard/requests')}
            initialData={{
              category: selectedCategory,
              subCategory: selectedSubCategory,
              issue: selectedProblem,
              subIssue: finalDetail,
              title: title,
              details: description,
              attachments: attachments,
              video: video
            }}
          />
        );
      case 2:
        return (
          <UserStep2PropertyTenants
            onNext={(data) => {
              console.log('Step 2 Data:', data);
              setProperty(data.property);
              setSelectedEquipment(data.equipmentName);
              setEquipmentSerial(data.equipmentSerial || null);
              setEquipmentCondition('Good'); // Default condition for newly linked equipment

              setAuthorization(data.tenantAuthorization ? 'yes' : 'no');
              setAuthCode(data.accessCode);
              setPets(data.selectedPets);
              // Store availability data
              const mappedAvailability = data.dateOptions.map((opt: any) => ({
                id: opt.id,
                date: opt.date ? opt.date.toISOString() : '',
                timeSlots: opt.timeSlots
              }));
              setAvailability(mappedAvailability);
              nextStep(3);
            }}
            onBack={prevStep}
            properties={propertiesList}
            initialData={{
              property: property,
              equipment: selectedEquipment,

              tenantAuthorization: authorization === 'yes',
              accessCode: authCode,
              selectedPets: pets,
              petsInResidence: pets.length > 0 ? 'yes' : (authorization ? 'no' : ''),
              dateOptions: availability.map(opt => ({
                id: opt.id.toString(),
                date: opt.date ? new Date(opt.date) : undefined,
                timeSlots: opt.timeSlots
              })),
            }}
          />
        );
      case 3:
        return (
          <UserStep3DueDateMaterials
            onNext={(data) => {
              console.log('Step 3 Data:', data);
              setDateDue(data.dateDue ? data.dateDue.toISOString() : null);
              setMaterials(data.materials);
              // Map priority values
              const priorityMap: Record<string, "Critical" | "Normal" | "Low"> = {
                'low': 'Low',
                'normal': 'Normal',
                'high': 'Critical',
                'urgent': 'Critical'
              };
              setPriority(priorityMap[data.priority] || 'Normal');
              // Final submission
              handleFormSubmit();
            }}
            onBack={prevStep}
            initialData={{
              dateDue: dateDue ? new Date(dateDue) : undefined,
              priority: priority?.toLowerCase() || 'normal',
              materials: materials,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-2 sm:p-4 md:p-10 relative">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#F5F5F5] rounded-xl shadow-[0px_3.9px_3.9px_0px_#00000040] border border-gray-100 p-4 sm:p-6 md:p-8 relative">
          <button
            onClick={prevStep}
            className="flex items-center gap-1 text-[#004D40] font-bold text-sm mb-6 hover:opacity-80 transition-opacity"
          >
            <ChevronLeft size={18} />
            BACK
          </button>

          <Stepper currentStep={currentStep} />

          {/* Error Message Display */}
          {submissionError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start justify-between">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-red-800">Submission Error</h3>
                  <p className="text-sm text-red-700 mt-1">{submissionError}</p>
                </div>
              </div>
              <button
                onClick={() => setSubmissionError(null)}
                className="text-red-600 hover:text-red-800 transition-colors"
                aria-label="Dismiss error"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          <div className="step-content">
            {renderStep()}
          </div>
        </div>
      </div>

      {/* Modal positioned relative to content area */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={handleCancelLeave} />
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-in zoom-in-95 duration-200 overflow-hidden relative z-10">
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

export default NewRequest;