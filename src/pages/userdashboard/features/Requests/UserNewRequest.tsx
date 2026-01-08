import React, { useState, useEffect, useCallback } from "react";
import { ChevronLeft } from "lucide-react";
import { useLocation, useNavigate, UNSAFE_NavigationContext } from "react-router-dom";
import { useNewRequestForm } from "./hooks/useNewRequestForm";
import Stepper from "./components/new-request/Stepper";
import Step1Category from "./components/new-request/Step1Category";
import Step2SubCategory from "./components/new-request/Step2SubCategory";
import Step3Problem from "./components/new-request/Step3Problem";
import Step4FinalDetail from "./components/new-request/Step4FinalDetail";
import Step5Media from "./components/new-request/Step5Media";
import Step6Detail from "./components/new-request/Step6Detail";
import Step7Location from "./components/new-request/Step7Location";
import Step8AuthChoice from "./components/new-request/Step8AuthChoice";
import Step9AuthDetails from "./components/new-request/Step9AuthDetails";
import Step10DateTimeChoice from "./components/new-request/Step10DateTimeChoice";
import Step11Availability from "./components/new-request/Step11Availability";
import Step12Priority from "./components/new-request/Step12Priority";
import UnsavedChangesModal from "../../../Dashboard/components/UnsavedChangesModal";

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
    attachments,
    setAttachments,
    video,
    setVideo,
    attachmentsInputRef,
    videoInputRef,
    handleRemoveAttachment,
    handleRemoveVideo,
    title,
    setTitle,
    description,
    setDescription,
    location: locationField,
    setLocation,
    authorization,
    setAuthorization,
    authCode,
    setAuthCode,
    pets,
    handleTogglePet,
    setUpDateTime,
    setSetUpDateTime,
    availability,
    handleDateChange,
    handleSlotToggle,
    handleRemoveDate,
    handleAddDate,
    priority,
    setPriority,
    isPriorityDropdownOpen,
    setIsPriorityDropdownOpen,
    priorityDropdownRef,
    submissionError,
    setSubmissionError,
    isSubmitting,
    handleSubmit,
    hasFormData
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
          <Step1Category
            selectedCategory={selectedCategory}
            onSelect={(id) => {
              setSelectedCategory(id);
              setSelectedSubCategory(null);
              setSelectedProblem(null);
              setFinalDetail(null);
            }}
            onNext={() => nextStep(2)}
          />
        );
      case 2:
        return (
          <Step2SubCategory
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            onSelect={(item) => {
              setSelectedSubCategory(item);
              setSelectedProblem(null);
              setFinalDetail(null);
            }}
            onNext={() => nextStep(3)}
            onSkip={() => nextStep(3)}
          />
        );
      case 3:
        return (
          <Step3Problem
            selectedCategory={selectedCategory}
            selectedSubCategory={selectedSubCategory}
            selectedProblem={selectedProblem}
            onSelect={(item) => {
              setSelectedProblem(item);
              setFinalDetail(null);
            }}
            onNext={() => nextStep(4)}
            onSkip={() => nextStep(4)}
          />
        );
      case 4:
        return (
          <Step4FinalDetail
            selectedCategory={selectedCategory}
            selectedProblem={selectedProblem}
            finalDetail={finalDetail}
            onSelect={setFinalDetail}
            onNext={() => nextStep(5)}
            onSkip={() => nextStep(5)}
          />
        );
      case 5:
        return (
          <Step5Media
            attachments={attachments}
            video={video}
            attachmentsInputRef={attachmentsInputRef}
            videoInputRef={videoInputRef}
            onAttachmentsChange={(e) => {
              if (e.target.files) {
                const files = Array.from(e.target.files);
                const MAX_SIZE = 10 * 1024 * 1024; // 10MB
                const ALLOWED_TYPES = [
                  'image/jpeg', 'image/png', 'image/webp', 'image/gif',
                  'application/pdf', 'application/msword',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                ];

                const validFiles = files.filter(file => {
                  if (!ALLOWED_TYPES.includes(file.type)) {
                    setSubmissionError(`File "${file.name}" is not a supported type.`);
                    return false;
                  }
                  if (file.size > MAX_SIZE) {
                    setSubmissionError(`File "${file.name}" is too large (max 10MB).`);
                    return false;
                  }
                  return true;
                });

                if (validFiles.length > 0) {
                  setAttachments(prev => [...prev, ...validFiles]);
                  setSubmissionError(null);
                }
                e.target.value = '';
              }
            }}
            onVideoChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const MAX_SIZE = 50 * 1024 * 1024; // 50MB
                if (!file.type.startsWith('video/')) {
                  setSubmissionError("Please select a valid video file.");
                  return;
                }
                if (file.size > MAX_SIZE) {
                  setSubmissionError("Video file is too large (max 50MB).");
                  return;
                }
                setVideo(file);
                setSubmissionError(null);
                e.target.value = '';
              }
            }}
            onRemoveAttachment={handleRemoveAttachment}
            onRemoveVideo={handleRemoveVideo}
            onNext={() => nextStep(6)}
            onSkip={() => nextStep(6)}
          />
        );
      case 6:
        return (
          <Step6Detail
            title={title}
            description={description}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onNext={() => nextStep(7)}
          />
        );
      case 7:
        return (
          <Step7Location
            location={locationField}
            onLocationChange={setLocation}
            onNext={() => nextStep(8)}
          />
        );
      case 8:
        return (
          <Step8AuthChoice
            authorization={authorization}
            onSelect={setAuthorization}
            onNext={() => nextStep(authorization === "no" ? 10 : 9)}
          />
        );
      case 9:
        return (
          <Step9AuthDetails
            authCode={authCode}
            pets={pets}
            onAuthCodeChange={setAuthCode}
            onTogglePet={handleTogglePet}
            onNext={() => nextStep(10)}
          />
        );
      case 10:
        return (
          <Step10DateTimeChoice
            setUpDateTime={setUpDateTime}
            onSelect={setSetUpDateTime}
            onNext={() => nextStep(setUpDateTime === "No" ? 12 : 11)}
          />
        );
      case 11:
        return (
          <Step11Availability
            availability={availability}
            onDateChange={handleDateChange}
            onSlotToggle={handleSlotToggle}
            onRemoveDate={handleRemoveDate}
            onAddDate={handleAddDate}
            onNext={() => nextStep(12)}
          />
        );
      case 12:
        return (
          <Step12Priority
            priority={priority}
            isPriorityDropdownOpen={isPriorityDropdownOpen}
            priorityDropdownRef={priorityDropdownRef}
            setIsPriorityDropdownOpen={setIsPriorityDropdownOpen}
            onSelect={setPriority}
            onSubmit={handleFormSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-10 relative">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#F5F5F5] rounded-xl shadow-[0px_3.9px_3.9px_0px_#00000040] border border-gray-100 p-8 md:p-8 relative">
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