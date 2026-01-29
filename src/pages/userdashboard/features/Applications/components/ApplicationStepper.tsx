import React from "react";
import { Check } from "lucide-react";

interface StepperProps {
    currentStep: number;
}

const steps = [
    { id: 1, name: "Applicant Info" },
    { id: 2, name: "Occupants & Assets" },
    { id: 3, name: "Residence & Income" },
    { id: 4, name: "Background" },
    { id: 5, name: "Documents" },
];

const ApplicationStepper: React.FC<StepperProps> = ({ currentStep }) => {
    return (
        <div
            className="max-w-3xl mx-auto mb-8 md:mb-12 px-2 py-3 bg-[#F0F0F6] rounded-2xl md:rounded-3xl relative"
            style={{ boxShadow: "0px -1.27px 5.09px 0px #E4E3E4 inset, 0px 1.79px 3.58px 0px #17151540" }}
        >
            <div className="flex justify-between items-center relative z-10 px-2 sm:px-4">
                {steps.map((step, index) => {
                    let isCompleted = false;
                    let isCurrent = false;

                    // Grouping steps for the visual stepper
                    if (step.id === 1) {
                        isCompleted = currentStep > 1;
                        isCurrent = currentStep === 1;
                    } else if (step.id === 2) {
                        isCompleted = currentStep > 4;
                        isCurrent = currentStep >= 2 && currentStep <= 4;
                    } else if (step.id === 3) {
                        isCompleted = currentStep > 9;
                        isCurrent = currentStep >= 5 && currentStep <= 9;
                    } else if (step.id === 4) {
                        isCompleted = currentStep > 10;
                        isCurrent = currentStep === 10;
                    } else if (step.id === 5) {
                        isCompleted = false;
                        isCurrent = currentStep === 11;
                    }

                    let progressWidth = "0%";
                    if (step.id === 1) {
                        if (currentStep > 1) progressWidth = "100%";
                    } else if (step.id === 2) {
                        if (currentStep === 2) progressWidth = "0%";
                        else if (currentStep === 3) progressWidth = "50%";
                        else if (currentStep === 4) progressWidth = "100%";
                        else if (currentStep > 4) progressWidth = "100%";
                    } else if (step.id === 3) {
                        if (currentStep === 5) progressWidth = "0%";
                        else if (currentStep === 6) progressWidth = "25%";
                        else if (currentStep === 7) progressWidth = "50%";
                        else if (currentStep === 8) progressWidth = "75%";
                        else if (currentStep === 9) progressWidth = "100%";
                        else if (currentStep > 9) progressWidth = "100%";
                    } else if (step.id === 4) {
                        if (currentStep === 10) progressWidth = "100%";
                        else if (currentStep > 10) progressWidth = "100%";
                    }

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-1 flex-1 relative">
                            {index < steps.length - 1 && (
                                <div className="absolute left-1/2 w-full top-[10px] md:top-[11px] h-[2px] bg-gray-300">
                                    <div
                                        className="h-full bg-[#7ED957] transition-all duration-500 ease-in-out"
                                        style={{ width: progressWidth }}
                                    />
                                </div>
                            )}
                            <div
                                className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[10px] md:text-sm font-bold transition-all duration-300 z-10 ${isCompleted || isCurrent
                                    ? "bg-[#7ED957] text-white"
                                    : "bg-gray-500 text-white"
                                    }`}
                            >
                                {isCompleted ? <Check className="w-3 h-3 md:w-[18px] md:h-[18px]" strokeWidth={3} /> : step.id}
                            </div>
                            <span className={`text-[10px] md:text-sm font-medium text-center whitespace-nowrap md:whitespace-normal transition-colors duration-300 hidden md:block ${isCurrent ? "text-gray-900" : "text-gray-500"}`}>
                                {step.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ApplicationStepper;
