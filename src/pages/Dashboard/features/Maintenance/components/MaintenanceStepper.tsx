import React from 'react';

interface MaintenanceStepperProps {
    currentStep: number;
    steps?: { id: number; label: string }[];
}

const defaultSteps = [
    { id: 1, label: 'General Details' },
    { id: 2, label: 'Property' },
    { id: 3, label: 'Priority' },
];

const MaintenanceStepper: React.FC<MaintenanceStepperProps> = ({ currentStep, steps = defaultSteps }) => {
    return (
        <div className="w-full max-w-2xl mx-auto mb-8 px-4 md:px-0">
            <div className="flex items-center justify-between relative">
                {steps.map((step, index) => {
                    const isActive = step.id === currentStep;
                    const isCompleted = step.id < currentStep;

                    return (
                        <React.Fragment key={step.id}>
                            {/* Step Circle and Label Container */}
                            <div className="flex flex-col items-center relative z-10 group">
                                <div
                                    className={`
                                        w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm md:text-base font-bold transition-all duration-300 shadow-sm
                                        ${isActive || isCompleted
                                            ? 'bg-[#3D7475] text-white ring-4 ring-[#3D7475]/20'
                                            : 'bg-white text-gray-400 border-2 border-gray-200'
                                        }
                                    `}
                                >
                                    {isCompleted ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        step.id
                                    )}
                                </div>

                                {/* Responsive Label */}
                                <span
                                    className={`
                                        absolute top-10 md:top-12 w-24 text-center text-xs md:text-sm font-semibold transition-colors duration-300
                                        ${isActive ? 'text-[#3D7475]' : 'text-gray-400'}
                                    `}
                                >
                                    <span className="md:inline hidden">{step.label}</span>
                                    <span className="md:hidden inline">{isActive ? step.label : `Step ${step.id}`}</span>
                                </span>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-[2px] bg-gray-100 mx-2 md:mx-4 relative rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[#3D7475] transition-all duration-500 ease-out"
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
