import React from 'react';

interface MoveInStepperProps {
    currentStep: number;
}

const steps = [
    { id: 1, label: 'Property & Tenants' },
    { id: 2, label: 'Lease Transactions' },
    { id: 3, label: 'Extra fees & Utilities' },
];

const MoveInStepper: React.FC<MoveInStepperProps> = ({ currentStep }) => {
    const currentStepLabel = steps.find(s => s.id === currentStep)?.label || '';

    return (
        <div className="w-full max-w-3xl mx-auto mb-8 md:mb-12">
            {/* Mobile View: Simplified Step Indicator */}
            <div className="md:hidden w-full flex flex-col items-center gap-2">
                <div className="text-sm font-bold text-[#3D7475] uppercase tracking-wide">
                    Step {currentStep} of {steps.length}
                </div>
                <div className="text-lg font-bold text-gray-800">
                    {currentStepLabel}
                </div>
                {/* Simple Progress Bar */}
                <div className="w-full max-w-[200px] h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div
                        className="h-full bg-[#10B981] transition-all duration-300 ease-in-out"
                        style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Desktop View: Full Stepper */}
            <div className="hidden md:block relative">
                {/* Connecting Line */}
                <div className="absolute top-4 left-12 right-12 h-[3px] bg-gray-200 -translate-y-1/2 z-0">
                    <div
                        className="h-full bg-[#10B981] transition-all duration-300 ease-in-out"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />
                </div>

                {/* Steps */}
                <div className="flex justify-between relative z-10">
                    {steps.map((step) => {
                        const isActive = step.id === currentStep;
                        const isCompleted = step.id < currentStep;

                        return (
                            <div key={step.id} className="flex flex-col items-center gap-3">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${isActive || isCompleted
                                        ? 'bg-[#10B981] text-white' // Emerald green for active/completed
                                        : 'bg-[#6B7280] text-white' // Gray for inactive
                                        }`}
                                >
                                    {step.id}
                                </div>
                                <span
                                    className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MoveInStepper;
