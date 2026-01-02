import React, { useState } from 'react';
import CustomDropdown from '../../../components/CustomDropdown';
import TimePicker from '@/components/ui/TimePicker';

interface MoveInBothLateFeesProps {
    onNext: () => void;
    onBack: () => void;
    recurringRentAmount: string;
}

const MoveInBothLateFees: React.FC<MoveInBothLateFeesProps> = ({ onNext, recurringRentAmount }) => {
    // One Time Fee State
    const [oneTimeType, setOneTimeType] = useState<string>('fixed');
    const [oneTimeAmount, setOneTimeAmount] = useState<string>('');
    const [oneTimeGracePeriod, setOneTimeGracePeriod] = useState<string>('0');
    const [oneTimeTime, setOneTimeTime] = useState<string>('8:00 AM');

    // Daily Fee State
    // Daily Fee State
    const [dailyType, setDailyType] = useState<string>('fixed');
    const [dailyAmount, setDailyAmount] = useState<string>('');
    const [maxMonthlyBalance, setMaxMonthlyBalance] = useState<string>('');
    const [dailyTime, setDailyTime] = useState<string>('06:00 PM'); // Usually same as one-time, but let's keep separate for flexibility

    const [errors, setErrors] = useState<Record<string, string>>({});

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

    const handleNext = () => {
        if (validateForm()) {
            onNext();
        }
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
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
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



                    <div className="grid grid-cols-[0.8fr_1.2fr] gap-x-8 gap-y-6">
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
                        <div className="flex flex-row gap-4">
                            {/* Amount */}
                            <div className="flex flex-col gap-2 shrink-0 w-[140px]">
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
                            <div className="flex flex-col gap-2 flex-1">
                                <label className="text-xs font-bold text-gray-700 ml-1 whitespace-nowrap">Max monthly balance *</label>
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
                        <div className="flex flex-col gap-2 col-span-2">
                            <label className="text-xs font-bold text-gray-700 ml-1">Time*</label>
                            <div className="relative max-w-[50%]">
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

            <div className="mt-16">
                <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-[#3D7475] text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity shadow-sm min-w-[200px]"
                >
                    Complete Move In
                </button>
            </div>
        </div>
    );
};

export default MoveInBothLateFees;
