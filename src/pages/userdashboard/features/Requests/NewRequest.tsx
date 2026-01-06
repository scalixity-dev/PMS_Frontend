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
    handleSubmit,
    hasFormData
  } = useNewRequestForm();

  // Access the navigation context to intercept navigation
  const navigationContext = React.useContext(UNSAFE_NavigationContext);
  
  // Block navigation when form has unsaved changes
  useEffect(() => {
    if (!hasFormData || shouldAllowNavigation) return;

    const { navigator } = navigationContext;
    const originalPush = navigator.push;
    const originalReplace = navigator.replace;

    // Intercept push navigation
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

    // Intercept replace navigation
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

    // Cleanup
    return () => {
      navigator.push = originalPush;
      navigator.replace = originalReplace;
    };
  }, [hasFormData, shouldAllowNavigation, location.pathname, navigationContext]);

  // Handle browser navigation (refresh, close tab, etc.)
  useEffect(() => {
    if (!hasFormData || shouldAllowNavigation) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasFormData, shouldAllowNavigation]);

  const handleConfirmLeave = useCallback(() => {
    setIsModalOpen(false);
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
    setShouldAllowNavigation(true);
    await handleSubmit();
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
                setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
              }
            }}
            onVideoChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setVideo(e.target.files[0]);
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