import React from 'react';
import { Check } from 'lucide-react';

interface ApplicationStepperProps {
    currentStep: number;
}

const steps = [
    { id: 1, label: 'Applicant' },
    { id: 2, label: 'Occupants' },
    { id: 3, label: 'Residences & Income' },
    { id: 4, label: 'Contacts' },
    { id: 5, label: 'Documents' },
];

const ApplicationStepper: React.FC<ApplicationStepperProps> = ({ currentStep }) => {
    const currentStepLabel = steps.find(s => s.id === currentStep)?.label || '';
    const progressPercentage = ((Math.min(currentStep, 5) - 1) / (steps.length - 1)) * 100;

    return (
        <div className="w-full max-w-4xl mx-auto mb-6 sm:mb-8 px-2 sm:px-4">
            {/* Mobile View - Simple Progress */}
            <div className="block md:hidden">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[#2c3e50]">
                        Step {currentStep} of {steps.length}
                    </span>
                    <span className="text-sm font-medium text-gray-500">
                        {currentStepLabel}
                    </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#7BD747] transition-all duration-300 rounded-full"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>
            </div>

            {/* Desktop View - Full Stepper */}
            <div className="hidden md:flex bg-gray-100 rounded-full py-4 px-8 relative items-center justify-between shadow-sm">
                {/* Progress bar container */}
                <div className="absolute left-20 right-20 top-1/2 h-1 bg-gray-300 -z-0 -translate-y-[15px]">
                    <div
                        className="h-full bg-[#7BD747] transition-all duration-300"
                        style={{
                            width: `${((Math.min(currentStep, 5) - 1) / (steps.length - 1)) * 100}%`
                        }}
                    />
                </div>

                {steps.map((step) => {
                    const isCompleted = currentStep > step.id;
                    const isActive = currentStep === step.id;

                    return (
                        <div key={step.id} className="flex flex-col items-center relative z-10 w-32">
                            <div
                                className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1
                                    transition-colors duration-300
                                    ${isActive || isCompleted
                                        ? 'bg-[#10b981] text-white'
                                        : 'bg-gray-500 text-white'
                                    }
                                `}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    step.id
                                )}
                            </div>
                            <span
                                className={`
                                    text-sm font-medium whitespace-nowrap
                                    ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'}
                                `}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ApplicationStepper;
