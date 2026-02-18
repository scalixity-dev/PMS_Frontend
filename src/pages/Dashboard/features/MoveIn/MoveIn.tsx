import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import MoveInStepper from './components/MoveInStepper';
import MoveInPropertySelection from './steps/MoveInPropertySelection';
import MoveInTenantSelection from './steps/MoveInTenantSelection';
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
import { useCreateLease, useUpdateLease } from '../../../../hooks/useLeaseQueries';

// Helper to map current flow step to stepper visual step (1-based)
const getVisualStep = (step: number) => {
    if (step === 1 || step === 2) return 1; // Property, Tenant -> Step 1
    if (step === 3 || step === 4 || step === 5 || step === 6) return 2; // Recurring Rent, Settings, Deposit, Deposit Settings -> Step 2
    if (step >= 7) return 3; // Late Fees and beyond -> Step 3
    return 1;
};

const MoveIn: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        formData,
        currentStep,
        setCurrentStep,
        setPropertyId,
        resetForm,
        loadExistingLease,
    } = useMoveInStore();

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [createdLeaseId, setCreatedLeaseId] = useState<string | null>(null);
    const [existingLeaseId, setExistingLeaseId] = useState<string | null>(null);
    const [propertyName, setPropertyName] = useState<string>('Property');
    const [successPropertyId, setSuccessPropertyId] = useState<string | null>(null);
    const createLeaseMutation = useCreateLease();
    const updateLeaseMutation = useUpdateLease();

    // Handle pre-selection from navigation state or existing lease
    useEffect(() => {
        const state = location.state as {
            preSelectedPropertyId?: string;
            leaseId?: string;
            existingLease?: any;
        } | null;

        if (state?.existingLease) {
            // Load existing lease data and determine starting step
            loadExistingLease(state.existingLease);
            const leaseId = state.leaseId || state.existingLease.id || null;
            setExistingLeaseId(leaseId);
            // Set property name from existing lease
            if (state.existingLease.property?.propertyName) {
                setPropertyName(state.existingLease.property.propertyName);
            }
        } else if (state?.preSelectedPropertyId) {
            setPropertyId(state.preSelectedPropertyId);
        }
    }, [location.state, setPropertyId, loadExistingLease]);

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate(-1);
        }
    };

    const handlePropertyNext = () => {
        // Proceed to Step 2 (Tenant)
        setCurrentStep(2);
    };

    const handleTenantNext = () => {
        // Proceed to Step 3 (Recurring Rent)
        setCurrentStep(3);
    };

    const handleRecurringRentNext = (enabled: boolean) => {
        if (enabled) {
            // Proceed to Step 4 (Recurring Rent Settings)
            setCurrentStep(4);
        } else {
            // Skip to Step 5 (Deposit)
            setCurrentStep(5);
        }
    }

    const handleRecurringRentSettingsNext = () => {
        // Proceed to Step 5 (Deposit)
        setCurrentStep(5);
    }

    const handleDepositNext = (hasDeposit: boolean) => {
        if (hasDeposit) {
            // Proceed to Step 6 (Deposit Settings)
            setCurrentStep(6);
        } else {
            // Skip to Step 7 (Late Fees)
            setCurrentStep(7);
        }
    }

    const handleDepositSettingsNext = () => {
        // Proceed to Step 7 (Late Fees)
        setCurrentStep(7);
    }

    const handleLateFeesNext = (enableLateFees: boolean) => {
        if (enableLateFees) {
            // Proceed to Step 8 (Late Fees Type)
            setCurrentStep(8);
        } else {
            // Show completion modal immediately
            handleCompleteMoveIn();
        }
    }

    const handleLateFeesTypeNext = () => {
        // Proceed to Step 9 (One Time Late Fee or Daily Late Fee)
        setCurrentStep(9);
    }

    const handleCompleteMoveIn = async () => {
        // Validate required fields
        if (!formData.tenantId || !formData.propertyId) {
            alert('Please complete all required fields (Property and Tenant)');
            return;
        }

        // Prepare lease data from form
        const leaseData = {
            tenantId: formData.tenantId,
            propertyId: formData.propertyId,
            unitId: formData.unitId || undefined,
            sharedTenantIds: formData.sharedTenantIds.length > 0 ? formData.sharedTenantIds : undefined,
            deposit: formData.deposit.hasDeposit ? {
                category: formData.deposit.category,
                amount: parseFloat(formData.deposit.amount) || 0,
                invoiceDate: formData.deposit.invoiceDate?.toISOString(),
            } : undefined,
            recurringRent: formData.recurringRent.enabled ? {
                enabled: true,
                amount: parseFloat(formData.recurringRent.amount) || 0,
                invoiceSchedule: formData.recurringRent.invoiceSchedule,
                startOn: formData.recurringRent.startOn?.toISOString() || new Date().toISOString(),
                endOn: formData.recurringRent.endOn?.toISOString(),
                isMonthToMonth: formData.recurringRent.isMonthToMonth,
                markPastPaid: formData.recurringRent.markPastPaid,
            } : undefined,
            lateFees: formData.lateFees.enabled ? {
                enabled: true,
                scheduleType: formData.lateFees.scheduleType || undefined,
                oneTimeFee: formData.lateFees.oneTimeFee ? {
                    type: formData.lateFees.oneTimeFee.type,
                    amount: parseFloat(formData.lateFees.oneTimeFee.amount) || 0,
                    gracePeriodDays: formData.lateFees.oneTimeFee.gracePeriodDays,
                    time: formData.lateFees.oneTimeFee.time,
                } : undefined,
                dailyFee: formData.lateFees.dailyFee ? {
                    type: formData.lateFees.dailyFee.type,
                    amount: parseFloat(formData.lateFees.dailyFee.amount) || 0,
                    maxMonthlyBalance: parseFloat(formData.lateFees.dailyFee.maxMonthlyBalance) || 0,
                    gracePeriod: formData.lateFees.dailyFee.gracePeriod,
                    time: formData.lateFees.dailyFee.time,
                } : undefined,
            } : undefined,
        };

        try {
            let result;
            if (existingLeaseId) {

                result = await updateLeaseMutation.mutateAsync({
                    id: existingLeaseId,
                    data: {
                        status: 'ACTIVE' as const,
                        startDate: leaseData.recurringRent?.startOn || undefined,
                        endDate: leaseData.recurringRent?.endOn || undefined,
                    },
                });
                setCreatedLeaseId(existingLeaseId);
            } else {
                // Create new lease
                result = await createLeaseMutation.mutateAsync(leaseData);
                setCreatedLeaseId(result.id);
                // Set property name from result
                if (result.property?.propertyName) {
                    setPropertyName(result.property.propertyName);
                }
            }
            // Persist propertyId for use in success modal uploads
            setSuccessPropertyId(formData.propertyId);
            setIsSuccessModalOpen(true);
            // Reset form after successful creation/update
            resetForm();
        } catch (error) {
            console.error('Failed to create/update lease:', error);
            alert(error instanceof Error ? error.message : 'Failed to create/update lease. Please try again.');
        }
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

                    {/* Stepper Logic (Step 1+) */}
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
                                <MoveInRecurringRent
                                    onNext={handleRecurringRentNext}
                                    onBack={handleBack}
                                />
                            )}

                            {currentStep === 4 && (
                                <MoveInRecurringRentSettings
                                    onNext={handleRecurringRentSettingsNext}
                                    onBack={handleBack}
                                />
                            )}

                            {currentStep === 5 && (
                                <MoveInDeposit
                                    onNext={handleDepositNext}
                                    onBack={handleBack}
                                />
                            )}

                            {currentStep === 6 && (
                                <MoveInDepositSettings
                                    onNext={handleDepositSettingsNext}
                                    onBack={handleBack}
                                />
                            )}

                            {currentStep === 7 && (
                                <MoveInLateFees
                                    onNext={handleLateFeesNext}
                                    onBack={handleBack}
                                />
                            )}

                            {currentStep === 8 && (
                                <MoveInLateFeesType
                                    onNext={handleLateFeesTypeNext}
                                    onBack={handleBack}
                                />
                            )}

                            {currentStep === 9 && formData.lateFees.scheduleType === 'one-time' && (
                                <MoveInOneTimeLateFees
                                    onNext={handleCompleteMoveIn}
                                    onBack={handleBack}
                                />
                            )}

                            {currentStep === 9 && formData.lateFees.scheduleType === 'daily' && (
                                <MoveInDailyLateFees
                                    onNext={handleCompleteMoveIn}
                                    onBack={handleBack}
                                />
                            )}

                            {currentStep === 9 && formData.lateFees.scheduleType === 'both' && (
                                <MoveInBothLateFees
                                    onNext={handleCompleteMoveIn}
                                    onBack={handleBack}
                                />
                            )}

                            {currentStep === 9 && !['one-time', 'daily', 'both'].includes(formData.lateFees.scheduleType || '') && (
                                <div className="flex flex-col items-center justify-center p-8 text-center">
                                    <p className="text-gray-500 mb-4">Invalid late fee schedule type selected.</p>
                                    <button
                                        onClick={handleBack}
                                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Go Back
                                    </button>
                                </div>
                            )}


                        </div>
                    </div>
                </div>
            </div>
            <MoveInSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => {
                    setIsSuccessModalOpen(false);
                    navigate('/dashboard/application');
                }}
                onBackToLease={() => {
                    setIsSuccessModalOpen(false);
                    const leaseId = createdLeaseId || existingLeaseId;
                    if (leaseId) {
                        navigate(`/dashboard/leasing/leases/${leaseId}`);
                    } else {
                        navigate('/dashboard/application');
                    }
                }}
                onRequestSignature={() => {
                    setIsSuccessModalOpen(false);
                    // Logic for e-signature request
                    const leaseId = createdLeaseId || existingLeaseId;
                    if (leaseId) {
                        navigate(`/dashboard/leasing/leases/${leaseId}/signature`);
                    }
                }}
                propertyName={propertyName}
                leaseNumber={createdLeaseId ? createdLeaseId.slice(-4) : (existingLeaseId ? existingLeaseId.slice(-4) : '')}
                leaseId={createdLeaseId || existingLeaseId || undefined}
                propertyId={successPropertyId || undefined}
            />
        </div>
    );
};

export default MoveIn;
