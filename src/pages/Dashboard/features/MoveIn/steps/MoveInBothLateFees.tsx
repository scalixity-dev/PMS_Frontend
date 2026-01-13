import React, { useState, useEffect } from 'react';
import CustomDropdown from '../../../components/CustomDropdown';
import TimePicker from '@/components/ui/TimePicker';
import { useMoveInStore } from '../store/moveInStore';
import { useCreateLease } from '../../../../../hooks/useLeaseQueries';
import { Loader2 } from 'lucide-react';

interface MoveInBothLateFeesProps {
    onNext: () => void;
    onBack: () => void;
}

const MoveInBothLateFees: React.FC<MoveInBothLateFeesProps> = ({ onNext }) => {
    const { formData, setLateFees } = useMoveInStore();
    const createLeaseMutation = useCreateLease();
    const recurringRentAmount = formData.recurringRent.amount || '0';
    
    // Initialize from store or defaults
    const existingOneTimeFee = formData.lateFees.oneTimeFee;
    const existingDailyFee = formData.lateFees.dailyFee;
    
    // One Time Fee State
    const [oneTimeType, setOneTimeType] = useState<string>(existingOneTimeFee?.type || 'fixed');
    const [oneTimeAmount, setOneTimeAmount] = useState<string>(existingOneTimeFee?.amount || '');
    const [oneTimeGracePeriod, setOneTimeGracePeriod] = useState<string>(existingOneTimeFee?.gracePeriodDays || '0');
    const [oneTimeTime, setOneTimeTime] = useState<string>(existingOneTimeFee?.time || '8:00 AM');

    // Daily Fee State
    const [dailyType, setDailyType] = useState<string>(existingDailyFee?.type || 'fixed');
    const [dailyAmount, setDailyAmount] = useState<string>(existingDailyFee?.amount || '');
    const [maxMonthlyBalance, setMaxMonthlyBalance] = useState<string>(existingDailyFee?.maxMonthlyBalance || '');
    const [dailyTime, setDailyTime] = useState<string>(existingDailyFee?.time || '06:00 PM');
    // Grace period for daily fee (stored but not shown in "both" mode UI - defaults to 'none')
    const gracePeriod = existingDailyFee?.gracePeriod || 'none';

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Update store when values change
    useEffect(() => {
        setLateFees({
            oneTimeFee: {
                type: oneTimeType,
                amount: oneTimeAmount,
                gracePeriodDays: oneTimeGracePeriod,
                time: oneTimeTime,
            },
            dailyFee: {
                type: dailyType,
                amount: dailyAmount,
                maxMonthlyBalance,
                gracePeriod,
                time: dailyTime,
            },
        });
    }, [oneTimeType, oneTimeAmount, oneTimeGracePeriod, oneTimeTime, dailyType, dailyAmount, maxMonthlyBalance, gracePeriod, dailyTime, setLateFees]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!oneTimeAmount || isNaN(Number(oneTimeAmount)) || Number(oneTimeAmount) <= 0) {
            newErrors.oneTimeAmount = 'Amount is required and must be greater than zero';
        }
        if (!oneTimeGracePeriod || isNaN(Number(oneTimeGracePeriod)) || Number(oneTimeGracePeriod) < 0) {
            newErrors.oneTimeGracePeriod = 'Grace period is required and must be non-negative';
        }
        if (!dailyAmount || isNaN(Number(dailyAmount)) || Number(dailyAmount) <= 0) {
            newErrors.dailyAmount = 'Amount is required and must be greater than zero';
        }
        if (!maxMonthlyBalance || isNaN(Number(maxMonthlyBalance)) || Number(maxMonthlyBalance) <= 0) {
            newErrors.maxMonthlyBalance = 'Max balance is required and must be greater than zero';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        if (!validateForm()) {
            return;
        }

        // Update store with final values
        setLateFees({
            oneTimeFee: {
                type: oneTimeType,
                amount: oneTimeAmount,
                gracePeriodDays: oneTimeGracePeriod,
                time: oneTimeTime,
            },
            dailyFee: {
                type: dailyType,
                amount: dailyAmount,
                maxMonthlyBalance,
                gracePeriod,
                time: dailyTime,
            },
        });

        // Proceed to next step (which will trigger handleCompleteMoveIn)
        onNext();
    };

    const typeOptions = [
        { value: 'fixed', label: 'Fixed amount' },
        { value: 'outstanding', label: 'Percentage of outstanding charges' },
        { value: 'recurring', label: 'Percentage of recurring charges' }
    ];



    return (
        <div className="w-full flex flex-col items-center pb-8">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2 text-[#374151]">Both Late Fees</h2>
                <p className="text-[#6B7280]">Configure both one-time and daily late fees.</p>
            </div>

            <div className="w-full max-w-4xl space-y-12">
                {/* Section 1: One Time Rent Late Fee */}
                <div className="bg-white/50 p-6 rounded-3xl border border-gray-100">
                    <h3 className="text-lg font-bold text-[#374151] mb-6 border-b pb-2">1. One Time Rent Late Fee</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Type of fee */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-700 ml-1">Type of fee *</label>
                            <CustomDropdown
                                value={oneTimeType}
                                onChange={setOneTimeType}
                                options={typeOptions}
                                placeholder="Select type"
                                buttonClassName="bg-[#7BD747] border-none rounded-[1.5rem] px-5 py-3 h-[52px]"
                                textClassName="text-white font-medium text-base"
                                iconClassName="text-white"
                                dropdownClassName="rounded-xl mt-1 z-30"
                            />
                        </div>

                        {/* Amount */}
                        <div className="flex flex-col gap-2 relative">
                            <label className="text-xs font-bold text-gray-700 ml-1">Amount *</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={oneTimeAmount}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (/^\d*\.?\d*$/.test(val)) {
                                            setOneTimeAmount(val);
                                            if (errors.oneTimeAmount) {
                                                setErrors(prev => {
                                                    const next = { ...prev };
                                                    delete next.oneTimeAmount;
                                                    return next;
                                                });
                                            }
                                        }
                                    }}
                                    className={`w-full bg-[#7BD747] text-white font-medium text-base placeholder-white/70 px-6 py-3 rounded-[1.5rem] border-none outline-none ring-0 h-[52px] ${errors.oneTimeAmount ? 'ring-2 ring-red-500' : ''}`}
                                    placeholder="00.00"
                                />
                                {(oneTimeType === 'outstanding' || oneTimeType === 'recurring') && (
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white font-medium text-lg">%</span>
                                )}
                            </div>
                            {errors.oneTimeAmount && <span className="text-red-500 text-xs ml-2">{errors.oneTimeAmount}</span>}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-700 ml-1">Grace Period (days) *</label>
                            <input
                                type="text"
                                value={oneTimeGracePeriod}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (/^\d*$/.test(val)) {
                                        setOneTimeGracePeriod(val);
                                        if (errors.oneTimeGracePeriod) {
                                            setErrors(prev => {
                                                const next = { ...prev };
                                                delete next.oneTimeGracePeriod;
                                                return next;
                                            });
                                        }
                                    }
                                }}
                                className={`w-full bg-[#7BD747] text-white font-medium text-base placeholder-white/70 px-6 py-3 rounded-[1.5rem] border-none outline-none ring-0 h-[52px] ${errors.oneTimeGracePeriod ? 'ring-2 ring-red-500' : ''}`}
                            />
                            {errors.oneTimeGracePeriod && <span className="text-red-500 text-xs ml-2">{errors.oneTimeGracePeriod}</span>}
                        </div>

                        {/* Time */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-700 ml-1">Time*</label>
                            <div className="relative">
                                <TimePicker
                                    value={oneTimeTime}
                                    onChange={setOneTimeTime}
                                    className="w-full"
                                    buttonClassName="bg-[#7BD747] text-white font-medium text-base px-6 py-3 rounded-[1.5rem] border-none outline-none h-[52px] hover:bg-[#7BD747] hover:opacity-90 placeholder:text-white/70"
                                    iconClassName="text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transition */}
                <div className="flex items-center gap-4 justify-center">
                    <div className="h-[1px] bg-gray-300 flex-1 max-w-[100px]"></div>
                    <span className="text-gray-500 font-medium text-sm">THEN</span>
                    <div className="h-[1px] bg-gray-300 flex-1 max-w-[100px]"></div>
                </div>

                {/* Section 2: Daily Rent Late Fee */}
                <div className="bg-white/50 p-6 rounded-3xl border border-gray-100">
                    <h3 className="text-lg font-bold text-[#374151] mb-6 border-b pb-2">2. Daily Rent Late Fee</h3>



                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Type of fee */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-gray-700 ml-1">Type of fee *</label>
                            <CustomDropdown
                                value={dailyType}
                                onChange={setDailyType}
                                options={typeOptions}
                                placeholder="Select type"
                                buttonClassName="bg-[#7BD747] border-none rounded-[1.5rem] px-5 py-3 h-[52px]"
                                textClassName="text-white font-medium text-base"
                                iconClassName="text-white"
                                dropdownClassName="rounded-xl mt-1 z-30"
                            />
                        </div>

                        {/* Amount and Max Monthly Balance */}
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Amount */}
                            <div className="flex flex-col gap-2 shrink-0 w-full md:w-[140px]">
                                <label className="text-xs font-bold text-gray-700 ml-1">Amount *</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={dailyAmount}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^\d*\.?\d*$/.test(val)) {
                                                setDailyAmount(val);
                                                if (errors.dailyAmount) {
                                                    setErrors(prev => {
                                                        const next = { ...prev };
                                                        delete next.dailyAmount;
                                                        return next;
                                                    });
                                                }
                                            }
                                        }}
                                        className={`w-full bg-[#7BD747] text-white font-medium text-base placeholder-white/70 px-6 py-3 rounded-[1.5rem] border-none outline-none ring-0 h-[52px] ${errors.dailyAmount ? 'ring-2 ring-red-500' : ''}`}
                                        placeholder="00.00"
                                    />
                                </div>
                                {errors.dailyAmount && <span className="text-red-500 text-xs ml-2">{errors.dailyAmount}</span>}
                            </div>

                            {/* Maximum monthly balance */}
                            <div className="flex flex-col gap-2 flex-1 w-full">
                                <label className="text-xs font-bold text-gray-700 ml-1">Max monthly balance *</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={maxMonthlyBalance}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (/^\d*\.?\d*$/.test(val)) {
                                                setMaxMonthlyBalance(val);
                                                if (errors.maxMonthlyBalance) {
                                                    setErrors(prev => {
                                                        const next = { ...prev };
                                                        delete next.maxMonthlyBalance;
                                                        return next;
                                                    });
                                                }
                                            }
                                        }}
                                        className={`w-full bg-[#7BD747] text-white font-medium text-base placeholder-white/70 px-6 py-3 rounded-[1.5rem] border-none outline-none ring-0 h-[52px] ${errors.maxMonthlyBalance ? 'ring-2 ring-red-500' : ''}`}
                                        placeholder="00.00"
                                    />
                                </div>
                                {errors.maxMonthlyBalance && <span className="text-red-500 text-xs ml-2">{errors.maxMonthlyBalance}</span>}
                                {maxMonthlyBalance && dailyAmount && (
                                    <p className="text-gray-400 text-[10px] mt-1.5 ml-1">
                                        {(() => {
                                            const rent = Number(recurringRentAmount) || 0;
                                            const max = Number(maxMonthlyBalance) || 0;
                                            const amount = Number(dailyAmount) || 0;
                                            let dailyFee = 0;

                                            if (dailyType === 'fixed') {
                                                dailyFee = amount;
                                            } else {
                                                // Assuming percentage of rent for outstanding as well for estimation, or we'd need current balance
                                                // Given 'recurring' is % of recurring charges (rent)
                                                // 'outstanding' usually starts at rent amount if unpaid
                                                dailyFee = (amount / 100) * rent;
                                            }

                                            if (dailyFee <= 0) return null;

                                            const days = Math.ceil(max / dailyFee);

                                            if (days > 31) { // Using 31 as max days in a month
                                                return `Limit reached in ${days} days (exceeds a month)`;
                                            }

                                            return `Limit reached in ${days} day${days !== 1 ? 's' : ''}`;
                                        })()}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Daily Time (Optional, maybe hidden if same?) */}
                        <div className="flex flex-col gap-2 lg:col-span-2">
                            <label className="text-xs font-bold text-gray-700 ml-1">Time*</label>
                            <div className="relative w-full md:w-1/2 lg:w-1/2">
                                <TimePicker
                                    value={dailyTime}
                                    onChange={setDailyTime}
                                    className="w-full"
                                    buttonClassName="bg-[#7BD747] text-white font-medium text-base px-6 py-3 rounded-[1.5rem] border-none outline-none h-[52px] hover:bg-[#7BD747] hover:opacity-90 placeholder:text-white/70"
                                    iconClassName="text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Text */}
                <div className="text-center bg-gray-50/80 p-6 rounded-2xl">
                    <p className="text-[#6B7280] text-sm leading-relaxed">
                        {(() => {
                            // Calculations for One Time
                            let dateStr = "DD MMM, YYYY";
                            const today = new Date();
                            const oneTimeDaysToAdd = parseInt(oneTimeGracePeriod);

                            // Initialize One Time Date
                            const oneTimeDate = new Date(today);
                            if (!isNaN(oneTimeDaysToAdd) && oneTimeDaysToAdd >= 0) {
                                oneTimeDate.setDate(today.getDate() + oneTimeDaysToAdd);
                            }
                            dateStr = oneTimeDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

                            // Calculate Daily Date (One Time Date + 1 Day)
                            const dailyDate = new Date(oneTimeDate);
                            dailyDate.setDate(oneTimeDate.getDate() + 1);
                            let dailyDateStr = dailyDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

                            const formattedRent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(recurringRentAmount) || 0);
                            const oneTimeChargeType = oneTimeType === 'outstanding' ? 'outstanding charges' : (oneTimeType === 'recurring' ? 'recurring charges' : '');
                            const oneTimeFeeDisplay = oneTimeType === 'fixed' ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(oneTimeAmount) || 0) : `${oneTimeAmount}% of ${oneTimeChargeType}`;

                            const dailyChargeType = dailyType === 'outstanding' ? 'outstanding charges' : (dailyType === 'recurring' ? 'recurring charges' : '');
                            const dailyFeeDisplay = dailyType === 'fixed' ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(dailyAmount) || 0) : `${dailyAmount}% of ${dailyChargeType}`;
                            const formattedMaxBalance = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(maxMonthlyBalance) || 0);


                            return (
                                <>
                                    If <strong>{formattedRent}</strong> of rent is not received by <strong>{oneTimeTime}</strong> on <strong>{dateStr}</strong>,
                                    a one-time late fee of <strong>{oneTimeFeeDisplay}</strong> will be applied.
                                    <br className="my-2" />
                                    Then, starting from <strong>{dailyDateStr}</strong>,
                                    a daily late fee of <strong>{dailyFeeDisplay}</strong> will be charged daily until the balance is paid,
                                    up to a maximum balance of <strong>{formattedMaxBalance}</strong>.
                                </>
                            );
                        })()}
                    </p>
                </div>
            </div>

            <div className="mt-16 flex flex-col items-center gap-4">
                {Object.keys(errors).length > 0 && (
                    <div className="w-full max-w-4xl bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm font-medium mb-2">Please fix the following errors:</p>
                        <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                            {Object.values(errors).map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {createLeaseMutation.isError && (
                    <div className="w-full max-w-4xl bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">
                            {createLeaseMutation.error instanceof Error 
                                ? createLeaseMutation.error.message 
                                : 'An error occurred while saving'}
                        </p>
                    </div>
                )}

                <button
                    onClick={handleNext}
                    disabled={createLeaseMutation.isPending}
                    className="px-8 py-3 bg-[#3D7475] text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity shadow-sm min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {createLeaseMutation.isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Complete Move In'
                    )}
                </button>
            </div>
        </div>
    );
};

export default MoveInBothLateFees;
