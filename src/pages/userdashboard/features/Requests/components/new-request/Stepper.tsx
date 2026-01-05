import React from "react";
import { Check } from "lucide-react";

interface StepperProps {
    currentStep: number;
}

const steps = [
    { id: 1, name: "General Details" },
    { id: 2, name: "Authorization to enter" },
    { id: 3, name: "Priority" },
];

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
    return (
        <div
            className="max-w-3xl mx-auto mb-12 px-2 py-3 bg-[#F0F0F6] rounded-3xl relative"
            style={{ boxShadow: "0px -1.27px 5.09px 0px #E4E3E4 inset, 0px 1.79px 3.58px 0px #17151540" }}
        >
            <div className="flex justify-between items-center relative z-10">
                {steps.map((step, index) => {
                    let isCompleted = false;
                    let isCurrent = false;

                    if (step.id === 1) {
                        isCompleted = currentStep >= 7;
                        isCurrent = currentStep >= 1 && currentStep <= 6;
                    } else if (step.id === 2) {
                        isCompleted = currentStep >= 12;
                        isCurrent = currentStep >= 7 && currentStep <= 11;
                    } else if (step.id === 3) {
                        isCompleted = false;
                        isCurrent = currentStep === 12;
                    }

                    let progressWidth = "0%";
                    if (step.id === 1) {
                        if (currentStep === 1) progressWidth = "0%";
                        else if (currentStep === 2) progressWidth = "17%";
                        else if (currentStep === 3) progressWidth = "33%";
                        else if (currentStep === 4) progressWidth = "50%";
                        else if (currentStep === 5) progressWidth = "67%";
                        else if (currentStep === 6) progressWidth = "83%";
                        else if (currentStep >= 7) progressWidth = "100%";
                    } else if (step.id === 2) {
                        if (currentStep === 7) progressWidth = "0%";
                        else if (currentStep === 8) progressWidth = "20%";
                        else if (currentStep === 9) progressWidth = "40%";
                        else if (currentStep === 10) progressWidth = "60%";
                        else if (currentStep === 11) progressWidth = "80%";
                        else if (currentStep >= 12) progressWidth = "100%";
                    }

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-1 flex-1 relative">
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
    );
};

export default Stepper;
