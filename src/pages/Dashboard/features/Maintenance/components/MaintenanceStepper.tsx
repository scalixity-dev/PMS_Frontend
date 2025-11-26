import React from 'react';

interface MaintenanceStepperProps {
    currentStep: number;
}

const steps = [
    { id: 1, label: 'General Details' },
    { id: 2, label: 'Property' },
    { id: 3, label: 'Priority' },
];

const MaintenanceStepper: React.FC<MaintenanceStepperProps> = ({ currentStep }) => {
    return (
        <div className="w-full max-w-3xl mx-auto mb-12 px-20">
            <div className="flex items-center justify-between relative">
                {steps.map((step, index) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;

                    return (
                        <React.Fragment key={step.id}>
                            {/* Step Circle and Label */}
                            <div className="flex flex-col items-center relative z-10">
                                <div
                                    className={`w-8 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${isActive || isCompleted
                                        ? 'bg-[#10B981] text-white' // Emerald green for active/completed
                                        : 'bg-[#6B7280] text-white' // Gray for inactive
                                        }`}
                                >
                                    {step.id}
                                </div>
                                <span
                                    className={`absolute top-10 w-32 text-center text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-[3px] bg-gray-200 mx-2 relative">
                                    <div
                                        className="h-full bg-[#10B981] transition-all duration-300 ease-in-out"
                                        style={{
                                            width: isCompleted ? '100%' : '0%'
                                        }}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default MaintenanceStepper;
