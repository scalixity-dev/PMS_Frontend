import React, { useState } from "react";
import { ChevronLeft, Monitor, Lightbulb, Home, Brush, TreePine, Droplets, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";


const categories = [
  { id: "appliances", name: "Appliances", icon: Monitor },
  { id: "electrical", name: "Electrical", icon: Lightbulb },
  { id: "exterior", name: "Exterior", icon: Home },
  { id: "households", name: "Households", icon: Brush },
  { id: "outdoors", name: "Outdoors", icon: TreePine },
  { id: "plumbing", name: "Plumbing", icon: Droplets },
];

const NewRequest: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);

  const steps = [
    { id: 1, name: "General Details" },
    { id: 2, name: "Authorization to enter" },
    { id: 3, name: "Priority" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-10">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}


        {/* Main Card */}
        <div className="bg-[#F5F5F5] rounded-xl shadow-[0px_3.9px_3.9px_0px_#00000040] border border-gray-100 p-8 md:p-8 relative overflow-hidden">
          <button
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate(-1)}
            className="flex items-center gap-1 text-[#004D40] font-bold text-sm mb-6 hover:opacity-80 transition-opacity"
          >
            <ChevronLeft size={18} />
            BACK
          </button>
          {/* Stepper */}
          <div
            className="max-w-3xl mx-auto mb-12 px-2 py-3 bg-[#F0F0F6] rounded-3xl relative"
            style={{ boxShadow: "0px -1.27px 5.09px 0px #E4E3E4 inset, 0px 1.79px 3.58px 0px #17151540" }}
          >
            <div className="flex justify-between items-center relative z-10">
              {steps.map((step, index) => {
                // Determine completion status based on visual step ID vs logical currentStep
                // Visual Step 1 (id:1) covers Logical Steps 1 & 2.
                // Visual Step 2 (id:2) covers Logical Step 3.
                // Visual Step 3 (id:3) covers Logical Step 4.

                let isCompleted = false;
                let isCurrent = false;

                if (step.id === 1) {
                  isCompleted = currentStep >= 4;
                  isCurrent = currentStep === 1 || currentStep === 2 || currentStep === 3;
                } else if (step.id === 2) {
                  isCompleted = currentStep >= 5;
                  isCurrent = currentStep === 4;
                } else if (step.id === 3) {
                  isCompleted = false; // Last step
                  isCurrent = currentStep === 5;
                }

                // Calculate progress width for the line following this step
                let progressWidth = "0%";
                if (step.id === 1) {
                  if (currentStep === 1) progressWidth = "0%";
                  else if (currentStep === 2) progressWidth = "33%"; // First sub-step
                  else if (currentStep === 3) progressWidth = "66%"; // Second sub-step
                  else if (currentStep >= 4) progressWidth = "100%";
                } else if (step.id === 2) {
                  if (currentStep >= 5) progressWidth = "100%";
                  else progressWidth = "0%";
                }

                return (
                  <div key={step.id} className="flex flex-col items-center gap-1 flex-1 relative">
                    {/* Connection Line */}
                    {index < steps.length - 1 && (
                      <div className="absolute left-1/2 w-full top-[11px] h-[2px] bg-gray-300">
                        <div
                          className="h-full bg-[#7ED957] transition-all duration-500 ease-in-out"
                          style={{ width: progressWidth }}
                        />
                      </div>
                    )}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 z-10 ${isCompleted || isCurrent
                        ? "bg-[#7ED957] text-white"
                        : "bg-gray-500 text-white"
                        }`}
                    >
                      {isCompleted ? <Check size={18} strokeWidth={3} /> : step.id}
                    </div>
                    <span className={`text-sm font-medium text-center whitespace-nowrap transition-colors duration-300 ${isCurrent ? "text-gray-900" : "text-gray-500"}`}>
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Content */}
          {currentStep === 1 && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-xl font-medium text-[#1A1A1A] mb-1">
                  What is this Request about?
                </h1>
                <p className="text-gray-400 text-sm font-normal">
                  Start Selecting the category to define the issue
                </p>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-5 px-10 max-w-xl mx-auto">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className="cursor-pointer group flex flex-col items-center"
                  >
                    <div className={`relative w-full  aspect-[5/3] rounded-2xl border-2 transition-all duration-300 flex items-center justify-center bg-white ${selectedCategory === category.id
                      ? "border-[#7ED957]"
                      : "border-gray-100 group-hover:border-gray-200"
                      }`}>
                      <category.icon size={48} strokeWidth={1.2} className={`${selectedCategory === category.id ? "text-gray-900" : "text-gray-800"
                        }`} />

                      <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-transparent shadow-sm transition-all duration-300 ${selectedCategory === category.id
                        ? "bg-[#7ED957]"
                        : "bg-[#F3F4F6] border-white"
                        }`} />
                    </div>
                    <span className={`mt-2 font-medium  text-base transition-colors ${selectedCategory === category.id ? "#1F2937" : "text-gray-700"
                      }`}>
                      {category.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Next Button */}
              <div className="mt-6 mb-2 flex justify-center">
                <PrimaryActionButton
                  disabled={!selectedCategory}
                  onClick={() => setCurrentStep(2)}
                  className={!selectedCategory ? "!bg-gray-100 !text-gray-400 cursor-not-allowed uppercase shadow-none" : "bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/80"}
                  text="Next"
                />
              </div>

            </>
          )}

          {currentStep === 2 && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-xl font-medium text-[#1A1A1A] mb-1">
                  Please specify the request
                </h1>
                <p className="text-gray-400 text-sm font-normal">
                  Start Selecting the category to define the issue
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto px-4 mb-4">
                {["Landscaping", "Fencing & Roof", "Pool", "Parking"].map((item) => (
                  <div key={item}
                    onClick={() => setSelectedSubCategory(item)}
                    className={`group cursor-pointer flex items-center gap-4 bg-white px-4 py-2 rounded-lg border-2 transition-all duration-200 box-border h-[72px] ${selectedSubCategory === item ? "border-[#7ED957] shadow-sm" : "border-gray-100 hover:border-gray-300"}`}
                  >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${selectedSubCategory === item ? "bg-[#7ED957] border-[#7ED957]" : "border-gray-300 group-hover:border-[#7ED957]"}`}>
                      {selectedSubCategory === item && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </div>
                    <span className={`font-normal text-lg ${selectedSubCategory === item ? "text-[#1A1A1A]" : "text-gray-900"}`}>{item}</span>
                  </div>
                ))}
              </div>

              {/* "None of the above? Skips" */}
              <div className="text-center mb-8">
                <span className="text-gray-500 text-sm">None of the above? </span>
                <button className="text-[#004D40] text-sm font-medium hover:underline" onClick={() => setCurrentStep(3)}>Skips</button>
              </div>

              {/* Navigation */}
              <div className="mt-6 mb-2 flex justify-center">
                <PrimaryActionButton
                  onClick={() => setCurrentStep(3)}
                  className="bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/80 px-12"
                  text="Next"
                />
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-xl font-medium text-[#1A1A1A] mb-1">
                  Define the problem
                </h1>
                <p className="text-gray-400 text-sm font-normal">
                  Start Selecting the category to define the issue
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto px-4 mb-4">
                {["Dirty", "Fencing & Roof", "Pool", "Parking"].map((item) => (
                  <div key={item}
                    onClick={() => setSelectedProblem(item)}
                    className={`group cursor-pointer flex items-center gap-4 bg-white px-4 py-2 rounded-lg border-2 transition-all duration-200 box-border h-[72px] ${selectedProblem === item ? "border-[#7ED957] shadow-sm" : "border-gray-100 hover:border-gray-300"}`}
                  >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${selectedProblem === item ? "bg-[#7ED957] border-[#7ED957]" : "border-gray-300 group-hover:border-[#7ED957]"}`}>
                      {selectedProblem === item && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                    </div>
                    <span className={`font-normal text-lg ${selectedProblem === item ? "text-[#1A1A1A]" : "text-gray-900"}`}>{item}</span>
                  </div>
                ))}
              </div>

              {/* "None of the above? Skips" */}
              <div className="text-center mb-8">
                <span className="text-gray-500 text-sm">None of the above? </span>
                <button className="text-[#004D40] text-sm font-medium hover:underline" onClick={() => setCurrentStep(4)}>Skips</button>
              </div>

              {/* Navigation */}
              <div className="mt-6 mb-2 flex justify-center">
                <PrimaryActionButton
                  onClick={() => setCurrentStep(4)}
                  className="bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/80 px-12"
                  text="Next"
                />
              </div>
            </>
          )}

          {currentStep === 4 && (
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6">Authorization to enter</h1>
              <p className="text-gray-500 mb-10">Please provide details about entry authorization.</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setCurrentStep(3)} className="px-8 py-3 rounded-xl border border-gray-200 font-bold hover:bg-gray-50 transition-colors">Back</button>
                <PrimaryActionButton onClick={() => setCurrentStep(5)} text="Next" className="bg-[#7ED957] hover:bg-[#6BC847]" />

              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="text-center py-20">
              <h1 className="text-3xl font-bold text-[#1A1A1A] mb-6">Set Priority</h1>
              <p className="text-gray-500 mb-10">How urgent is this request?</p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setCurrentStep(4)} className="px-8 py-3 rounded-xl border border-gray-200 font-bold hover:bg-gray-50 transition-colors">Back</button>
                <PrimaryActionButton
                  onClick={() => navigate("/userdashboard/requests")}
                  text="Submit Request"
                  className="bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/30"
                />

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewRequest;