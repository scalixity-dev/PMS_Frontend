import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import GetStartedButton from '../../../../components/common/buttons/GetStartedButton';
import MoveInStepper from './components/MoveInStepper';
import MoveInPropertySelection from './steps/MoveInPropertySelection';
import MoveInTenantSelection from './steps/MoveInTenantSelection';
import MoveInShareLease from './steps/MoveInShareLease';
import MoveInRecurringRent from './steps/MoveInRecurringRent';
import MoveInRecurringRentSettings from './steps/MoveInRecurringRentSettings';
import MoveInDeposit from './steps/MoveInDeposit';
import MoveInDepositSettings from './steps/MoveInDepositSettings';
import MoveInLateFees from './steps/MoveInLateFees';
import MoveInLateFeesType from './steps/MoveInLateFeesType';
import MoveInOneTimeLateFees from './steps/MoveInOneTimeLateFees';
import MoveInDailyLateFees from './steps/MoveInDailyLateFees';
import MoveInBothLateFees from './steps/MoveInBothLateFees';
import MoveInSuccessModal from './components/MoveInSuccessModal';
import { useMoveInStore } from './store/moveInStore';

interface MoveInScenarioCardProps {
    type: 'easy' | 'advanced';
    selected: boolean;
    onClick: () => void;
}

const MoveInScenarioCard: React.FC<MoveInScenarioCardProps> = ({ type, selected, onClick }) => {
    const isEasy = type === 'easy';
    const title = isEasy ? 'Easy move in' : 'Advanced move in';
    const description = isEasy
        ? 'Add basic lease information such as property and tenant details, recurring rent, deposit, enabling late fees, and requesting renter\'s insurance.'
        : 'Add more detailed lease information such as dependents, other lease transactions, utilities, and management fees. It also allows you to save the lease as a draft.';

    return (
        <div
            onClick={onClick}
            className={`
        relative flex flex-col items-start p-6 md:p-8 rounded-3xl cursor-pointer transition-all duration-300 w-full max-w-sm h-auto
        ${selected
                    ? 'bg-[#F0F2F5] border-2 border-[#7BD747] shadow-none'
                    : 'bg-white shadow-lg border-2 border-transparent hover:shadow-xl'
                }
      `}
        >
            {/* Pill Badge */}
            <div className={`
        flex items-center gap-2 px-6 py-2 rounded-full mb-8
        ${selected ? 'bg-[#7BD747] text-white' : 'bg-[#7BD747] text-white'}
      `}>
                <div className={`
          w-4 h-4 rounded-full border-2 border-white flex items-center justify-center
        `}>
                    {selected && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <span className="font-bold text-lg">{title}</span>
            </div>

            {/* Description */}
            <p className="text-left text-gray-500 text-sm leading-relaxed">
                {description}
            </p>
        </div>
    );
};

// Helper to map current flow step to stepper visual step (1-based)
const getVisualStep = (step: number) => {
    if (step === 1 || step === 2 || step === 3) return 1; // Property, Tenant, Share Lease -> Step 1
    if (step === 4 || step === 5 || step === 6 || step === 7) return 2; // Recurring Rent, Settings, Deposit, Deposit Settings -> Step 2
    if (step >= 8) return 3; // Late Fees and beyond -> Step 3
    return 1;
};

const MoveIn: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        formData,
        currentStep,
        setCurrentStep,
        setSelectedScenario,
        setPropertyId,
    } = useMoveInStore();
    
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    // Handle pre-selection from navigation state
    useEffect(() => {
        const state = location.state as { preSelectedPropertyId?: string } | null;
        if (state?.preSelectedPropertyId) {
            setPropertyId(state.preSelectedPropertyId);
        }
    }, [location.state, setPropertyId]);

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate(-1);
        }
    };

    const handleGetStarted = () => {
        if (!formData.selectedScenario) return;
        // Proceed to Step 1 (Property)
        setCurrentStep(1);
    };

    const handlePropertyNext = () => {
        // Proceed to Step 2 (Tenant)
        setCurrentStep(2);
    };

    const handleTenantNext = () => {
        // Proceed to Step 3 (Share Lease)
        setCurrentStep(3);
    };

    const handleShareLeaseNext = () => {
        // Proceed to Step 4 (Recurring Rent)
        setCurrentStep(4);
    };

    const handleRecurringRentNext = (enabled: boolean) => {
        if (enabled) {
            // Proceed to Step 5 (Recurring Rent Settings)
            setCurrentStep(5);
        } else {
            // Skip to Step 6 (Deposit)
            setCurrentStep(6);
        }
    }

    const handleRecurringRentSettingsNext = () => {
        // Proceed to Step 6 (Deposit)
        setCurrentStep(6);
    }

    const handleDepositNext = (hasDeposit: boolean) => {
        if (hasDeposit) {
            // Proceed to Step 7 (Deposit Settings)
            setCurrentStep(7);
        } else {
            // Skip to Step 8 (Late Fees)
            setCurrentStep(8);
        }
    }

    const handleDepositSettingsNext = () => {
        // Proceed to Step 8 (Late Fees)
        setCurrentStep(8);
    }

    const handleLateFeesNext = (enableLateFees: boolean) => {
        if (enableLateFees) {
            // Proceed to Step 9 (Late Fees Type)
            setCurrentStep(9);
        } else {
            // Show completion modal immediately
            handleCompleteMoveIn();
        }
    }

    const handleLateFeesTypeNext = () => {
        // Proceed to Step 10 (One Time Late Fee or Daily Late Fee)
        setCurrentStep(10);
    }

    const handleCompleteMoveIn = () => {
        setIsSuccessModalOpen(true);
    }

    return (
        <div className="flex flex-col h-full w-full bg-[var(--color-background)] px-6 overflow-y-auto">
            <div className="flex-1 flex items-start justify-center pt-4 md:pt-8 pb-8">
                <div className={`bg-[#DFE5E3] rounded-[2rem] p-4 sm:p-8 md:p-12 flex flex-col items-center w-full shadow-sm min-h-[80vh] relative max-w-4xl`}>

                    {/* Back Button */}
                    <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-[#3D7475] font-bold hover:opacity-80 transition-opacity uppercase tracking-wide text-sm md:text-base bg-[#DFE5E3]/80 p-2 md:p-0 rounded md:bg-transparent backdrop-blur-sm md:backdrop-blur-none"
                        >
                            <ArrowLeft size={20} strokeWidth={2.5} />
                            <span className="hidden md:inline">BACK</span>
                        </button>
                    </div>

                    {/* Scenario Selection Content (Step 0) */}
                    {currentStep === 0 && (
                        <div className="flex flex-col items-center w-full mt-8">
                            <div className="text-center mb-12">
                                <h1 className="text-3xl font-semibold text-gray-800 mb-2">Move in process</h1>
                                <h2 className="text-xl text-gray-700 mb-2">Select the move in scenario</h2>
                                <p className="text-gray-500">Move in your tenant(s) to the property and start collecting rent.</p>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8 mb-16 w-full justify-center items-center md:items-stretch">
                                <MoveInScenarioCard
                                    type="easy"
                                    selected={formData.selectedScenario?.type === 'easy'}
                                    onClick={() => setSelectedScenario({ type: 'easy' })}
                                />
                                <MoveInScenarioCard
                                    type="advanced"
                                    selected={formData.selectedScenario?.type === 'advanced'}
                                    onClick={() => setSelectedScenario({ type: 'advanced' })}
                                />
                            </div>

                            <GetStartedButton
                                text="Get Started"
                                widthClass="w-full sm:w-auto px-12"
                                onClick={handleGetStarted}
                                disabled={!formData.selectedScenario}
                            />
                        </div>
                    )}

                    {/* Stepper Logic (Step 1+) */}
                    {currentStep > 0 && (
                        <div className="w-full flex flex-col items-center mt-8">
                            <MoveInStepper currentStep={getVisualStep(currentStep)} />

                            <div className="w-full mt-12">
                                {currentStep === 1 && (
                                    <MoveInPropertySelection
                                        onNext={handlePropertyNext}
                                    />
                                )}

                                {currentStep === 2 && (
                                    <MoveInTenantSelection
                                        onNext={handleTenantNext}
                                        onBack={handleBack}
                                    />
                                )}

                                {currentStep === 3 && (
                                    <MoveInShareLease
                                        onNext={handleShareLeaseNext}
                                    />
                                )}

                                {currentStep === 4 && (
                                    <MoveInRecurringRent
                                        onNext={handleRecurringRentNext}
                                        onBack={handleBack}
                                    />
                                )}

                                {currentStep === 5 && (
                                    <MoveInRecurringRentSettings
                                        onNext={handleRecurringRentSettingsNext}
                                        onBack={handleBack}
                                    />
                                )}

                                {currentStep === 6 && (
                                    <MoveInDeposit
                                        onNext={handleDepositNext}
                                        onBack={handleBack}
                                    />
                                )}

                                {currentStep === 7 && (
                                    <MoveInDepositSettings
                                        onNext={handleDepositSettingsNext}
                                        onBack={handleBack}
                                    />
                                )}

                                {currentStep === 8 && (
                                    <MoveInLateFees
                                        onNext={handleLateFeesNext}
                                        onBack={handleBack}
                                    />
                                )}

                                {currentStep === 9 && (
                                    <MoveInLateFeesType
                                        onNext={handleLateFeesTypeNext}
                                        onBack={handleBack}
                                    />
                                )}

                                {currentStep === 10 && formData.lateFees.scheduleType === 'one-time' && (
                                    <MoveInOneTimeLateFees
                                        onNext={handleCompleteMoveIn}
                                        onBack={handleBack}
                                    />
                                )}

                                {currentStep === 10 && formData.lateFees.scheduleType === 'daily' && (
                                    <MoveInDailyLateFees
                                        onNext={handleCompleteMoveIn}
                                        onBack={handleBack}
                                    />
                                )}

                                {currentStep === 10 && formData.lateFees.scheduleType === 'both' && (
                                    <MoveInBothLateFees
                                        onNext={handleCompleteMoveIn}
                                        onBack={handleBack}
                                    />
                                )}

                                {/* Placeholders for future steps */}
                                {currentStep === 11 && (
                                    <div className="text-center text-gray-500">
                                        Step 3: Extra fees & Utilities Content Coming Soon
                                        <br />
                                        <button onClick={handleCompleteMoveIn} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
                                            Simulate Complete (Debug)
                                        </button>
                                    </div>
                                )}
                                {currentStep === 12 && (
                                    <div className="text-center text-gray-500">
                                        End of Flow
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
            <MoveInSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                onBackToLease={() => {
                    setIsSuccessModalOpen(false);
                    // Logic to go back to lease details? For now just close or navigate.
                    // navigate('/dashboard/leases/9'); 
                }}
                onRequestSignature={() => {
                    setIsSuccessModalOpen(false);
                    // Logic for e-signature request
                }}
                propertyName="abc"
                leaseNumber="9"
            />
        </div>
    );
};

export default MoveIn;
