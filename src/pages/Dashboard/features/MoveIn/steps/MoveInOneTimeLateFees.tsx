import React, { useState } from 'react';
import CustomDropdown from '../../../components/CustomDropdown';
import TimePicker from '@/components/ui/TimePicker';

interface MoveInOneTimeLateFeesProps {
    onNext: () => void;
    onBack: () => void;
    recurringRentAmount: string;
}

const MoveInOneTimeLateFees: React.FC<MoveInOneTimeLateFeesProps> = ({ onNext, recurringRentAmount }) => {
    const [lateFeeType, setLateFeeType] = useState<string>('fixed');
    const [amount, setAmount] = useState<string>('');
    const [gracePeriod, setGracePeriod] = useState<string>('none');
    const [time, setTime] = useState<string>('8:00 AM');

    const typeOptions = [
        { value: 'fixed', label: 'Fixed amount' },
        { value: 'outstanding', label: 'Percentage of outstanding charges' },
        { value: 'recurring', label: 'Percentage of recurring charges' }
    ];

    // Generate days 1-30 for options along with "None"
    const gracePeriodOptions = [
        { value: 'none', label: 'None' },
        ...Array.from({ length: 30 }, (_, i) => ({
            value: `${i + 1}`,
            label: `${i + 1} Day${i + 1 > 1 ? 's' : ''}`
        }))
    ];

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-12">
                <h2 className="text-xl font-bold mb-2 text-[#374151]">One time late fee</h2>
                <p className="text-[#6B7280]">Choose type of fee and specify one time late fee.</p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-6 w-full max-w-2xl bg-transparent">
                {/* Type of fee */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-700 ml-1">Type of fee *</label>
                    <CustomDropdown
                        value={lateFeeType}
                        onChange={setLateFeeType}
                        options={typeOptions}
                        placeholder="Select type"
                        buttonClassName="bg-[#7BD747] border-none rounded-[1.5rem] px-5 py-3 h-[52px]"
                        textClassName="text-white font-medium text-base"
                        iconClassName="text-white"
                        dropdownClassName="rounded-xl mt-1"
                    />
                </div>

                {/* Amount */}
                <div className="flex flex-col gap-2 relative">
                    <label className="text-xs font-bold text-gray-700 ml-1">Amount *</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-[#7BD747] text-white font-medium text-base placeholder-white/70 px-6 py-3 rounded-[1.5rem] border-none outline-none ring-0 h-[52px]"
                            placeholder="00.00"
                        />
                        {(lateFeeType === 'outstanding' || lateFeeType === 'recurring') && (
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white font-medium text-lg">%</span>
                        )}
                    </div>
                </div>

                {/* Grace Period */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-700 ml-1">Grace Period *</label>
                    <CustomDropdown
                        value={gracePeriod}
                        onChange={setGracePeriod}
                        options={gracePeriodOptions}
                        placeholder="Select period"
                        buttonClassName="bg-[#7BD747] border-none rounded-[1.5rem] px-5 py-3 h-[52px]"
                        textClassName="text-white font-medium text-base"
                        iconClassName="text-white"
                        dropdownClassName="rounded-xl mt-1"
                    />
                </div>

                {/* Time */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-700 ml-1">Time*</label>
                    <div className="relative">
                        <TimePicker
                            value={time}
                            onChange={setTime}
                            className="w-full"
                            buttonClassName="bg-[#7BD747] text-white font-medium text-base px-6 py-3 rounded-[1.5rem] border-none outline-none h-[52px] hover:bg-[#7BD747] hover:opacity-90 placeholder:text-white/70"
                        />
                    </div>
                </div>

                {(lateFeeType === 'outstanding' || lateFeeType === 'recurring') && (
                    <div className="col-span-2 mt-4 text-center">
                        <p className="text-[#6B7280] text-sm">
                            {(() => {
                                // Default date if no calculation possible
                                const placeholderDate = "06 Dec, 2025";

                                // Calculate date: Current Date + Grace Period days
                                let dateStr = placeholderDate;
                                const today = new Date();
                                const daysToAdd = parseInt(gracePeriod);
                                if (!isNaN(daysToAdd)) {
                                    const targetDate = new Date(today);
                                    targetDate.setDate(today.getDate() + daysToAdd);
                                    dateStr = targetDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                                }

                                // Format currency
                                const formattedRent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(recurringRentAmount) || 0);

                                const chargeType = lateFeeType === 'outstanding' ? 'outstanding charges' : 'recurring charges';

                                return `If ${formattedRent} of Rent payment is not received by ${time} on ${dateStr}, one time rent late fee in ${amount || '0'}% of ${chargeType} will be applied.`;
                            })()}
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-16">
                <button
                    onClick={onNext}
                    className="px-8 py-3 bg-[#3D7475] text-white rounded-lg font-bold text-lg hover:opacity-90 transition-opacity shadow-sm min-w-[200px]"
                >
                    Complete Move In
                </button>
            </div>
        </div>
    );
};

export default MoveInOneTimeLateFees;
