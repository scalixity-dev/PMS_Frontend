import React from "react";
import { Check } from "lucide-react";

interface StepperProps {
    currentStep: number;
}

const steps = [
    { id: 1, name: "General Details" },
    { id: 2, name: "Property" },
    { id: 3, name: "Due date & Priority" },
];

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
    if (currentStep === 0) return null;

    return (
        <div
            className="max-w-3xl mx-auto mb-6 md:mb-10 lg:mb-12 px-2 md:px-3 py-2 md:py-3 bg-[#F0F0F6] rounded-2xl md:rounded-3xl relative"
            style={{ boxShadow: "0px -1.27px 5.09px 0px #E4E3E4 inset, 0px 1.79px 3.58px 0px #17151540" }}
        >
            <div className="flex justify-between items-center relative z-10">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > step.id;
                    const isCurrent = currentStep === step.id;
                    const progressWidth = isCompleted ? "100%" : "0%";

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-0.5 md:gap-1 flex-1 relative">
                            {/* Progress Line */}
                            {index < steps.length - 1 && (
                                <div className="absolute left-1/2 w-full top-[9px] md:top-[11px] h-[2px] bg-gray-300">
                                    <div
                                        className="h-full bg-[#7ED957] transition-all duration-500 ease-in-out"
                                        style={{ width: progressWidth }}
                                    />
                                </div>
                            )}
                            {/* Step Circle */}
                            <div
                                className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs md:text-sm font-bold transition-all duration-300 z-10 ${isCompleted || isCurrent
                                    ? "bg-[#7ED957] text-white"
                                    : "bg-gray-500 text-white"
                                    }`}
                            >
                                {isCompleted ? <Check size={14} className="md:w-[18px] md:h-[18px]" strokeWidth={3} /> : step.id}
                            </div>
                            {/* Step Name */}
                            <span className={`text-[10px] sm:text-xs md:text-sm font-medium text-center whitespace-normal sm:whitespace-nowrap transition-colors duration-300 px-1 leading-tight ${isCurrent ? "text-gray-900" : "text-gray-500"}`}>
                                {step.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Stepper;
