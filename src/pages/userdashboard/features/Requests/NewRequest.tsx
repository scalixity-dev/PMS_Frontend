import React from "react";
import { ChevronLeft } from "lucide-react";
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

const NewRequest: React.FC = () => {
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
    location,
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
    handleSubmit
  } = useNewRequestForm();

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
            location={location}
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
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-10">
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
    </div>
  );
};

export default NewRequest;