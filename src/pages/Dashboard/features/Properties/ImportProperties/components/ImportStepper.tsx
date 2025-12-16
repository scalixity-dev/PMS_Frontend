import React from 'react';
import { Check } from 'lucide-react';

interface ImportStepperProps {
    currentStep: number;
}

const steps = [
    { id: 1, label: 'Template' },
    { id: 2, label: 'Upload File' },
    { id: 3, label: 'Fields Mapping' },
    { id: 4, label: 'Validations' },
];

const ImportStepper: React.FC<ImportStepperProps> = ({ currentStep }) => {
    return (
        <div className="w-full max-w-4xl mx-auto mb-8 px-4">
            <div className="bg-gray-100 rounded-full py-4 px-8 relative flex items-center justify-between shadow-sm">
                {/* Progress bar container */}
                <div className="absolute left-20 right-20 top-1/2 h-1 bg-gray-300 -z-0 -translate-y-[15px]">
                    <div
                        className="h-full bg-[#5cdcae] transition-all duration-300"
                        style={{
                            width: `${((Math.min(currentStep, 4) - 1) / (steps.length - 1)) * 100}%`
                        }}
                    />
                </div>

                {steps.map((step) => {
                    const isCompleted = currentStep > step.id;
                    const isActive = currentStep === step.id;

                    return (
                        <div key={step.id} className="flex flex-col items-center relative z-10 w-24">
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

export default ImportStepper;
