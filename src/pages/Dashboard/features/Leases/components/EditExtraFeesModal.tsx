import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Info, Zap, Check } from 'lucide-react';
import SearchableDropdown from '../../../../../components/ui/SearchableDropdown';
import TimePicker from '../../../../../components/ui/TimePicker';
import { cn } from '../../../../../lib/utils';

interface EditExtraFeesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    initialData?: any;
}

const EditExtraFeesModal: React.FC<EditExtraFeesModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    // One Time Fee State
    const [oneTimeFeeEnabled, setOneTimeFeeEnabled] = useState(true);
    const [oneTimeFeeType, setOneTimeFeeType] = useState('Percentage of outstanding charges');
    const [oneTimeFeeAmount, setOneTimeFeeAmount] = useState('1');

    // Daily Fee State
    const [dailyFeeEnabled, setDailyFeeEnabled] = useState(true);
    const [dailyFeeType, setDailyFeeType] = useState('Percentage of recurring charges');
    const [dailyFeeAmount, setDailyFeeAmount] = useState('1');
    const [maxMonthlyBalance, setMaxMonthlyBalance] = useState('1.00');

    // Grace Period State
    const [gracePeriod, setGracePeriod] = useState('5 days');
    const [graceTime, setGraceTime] = useState('06:00 PM');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (initialData && initialData.isConfigured) {
                if (initialData.oneTimeFee) {
                    setOneTimeFeeEnabled(initialData.oneTimeFee.enabled);
                    setOneTimeFeeType(initialData.oneTimeFee.type);
                    setOneTimeFeeAmount(initialData.oneTimeFee.amount);
                }
                if (initialData.dailyFee) {
                    setDailyFeeEnabled(initialData.dailyFee.enabled);
                    setDailyFeeType(initialData.dailyFee.type);
                    setDailyFeeAmount(initialData.dailyFee.amount);
                    setMaxMonthlyBalance(initialData.dailyFee.maxBalance);
                }
                if (initialData.gracePeriod) {
                    setGracePeriod(initialData.gracePeriod.days);
                    setGraceTime(initialData.gracePeriod.time);
                }
            }
        } else {
            document.body.style.overflow = 'unset';
            // Optional: Reset state to defaults on close if desired, ensuring next open is clean if no initialData passed
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialData]);

    const inputClasses = "w-full p-3 rounded-lg border border-gray-200 outline-none text-gray-700 placeholder-gray-400 font-medium focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all bg-white";
    // Added [&>span]:truncate [&>span]:flex-1 [&>span]:text-left to ensure text truncates and takes available space
    const dropdownButtonClasses = "w-full p-3 rounded-lg border border-gray-200 outline-none text-gray-700 font-medium bg-white flex items-center justify-between hover:bg-gray-50 transition-colors [&>span]:truncate [&>span]:flex-1 [&>span]:text-left";

    const feeTypeOptions = [
        'Percentage of outstanding charges',
        'Percentage of recurring charges',
        'Fixed amount'
    ];

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#dfe5e3] rounded-[1.5rem] w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between shrink-0">
                    <h2 className="text-white text-lg font-medium">Edit late fees</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar">

                    {/* Late fees settings section */}
                    <div className="space-y-4">
                        <h3 className="text-[#2c3e50] font-bold text-base">Late fees settings</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            The system will generate the late fees after the tenant's grace period ends. You can enable both fees, with the daily fee starting the day after the one time fee is applied.
                        </p>

                        {/* One time fee */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setOneTimeFeeEnabled(!oneTimeFeeEnabled)}
                                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${oneTimeFeeEnabled ? 'bg-[#3A6D6C] border-[#3A6D6C]' : 'border-gray-400 bg-white'}`}
                                >
                                    {oneTimeFeeEnabled && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                                </button>
                                <span className="text-gray-900 font-medium text-sm">One time rent late fee</span>
                                <Info size={16} className="text-[#3A6D6C]/70" />
                            </div>

                            {oneTimeFeeEnabled && (
                                // Adjusted grid columns to give more space to Type of Fee
                                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Type of fee <span className="text-red-500">*</span></label>
                                        <SearchableDropdown
                                            value={oneTimeFeeType}
                                            onChange={setOneTimeFeeType}
                                            options={feeTypeOptions}
                                            buttonClassName={dropdownButtonClasses}
                                            placeholder="Select type"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">
                                            {oneTimeFeeType.includes('Percentage') ? 'Amount in %' : 'Amount'} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={oneTimeFeeAmount}
                                            onChange={(e) => setOneTimeFeeAmount(e.target.value)}
                                            className={inputClasses}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Daily fee */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setDailyFeeEnabled(!dailyFeeEnabled)}
                                    className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${dailyFeeEnabled ? 'bg-[#3A6D6C] border-[#3A6D6C]' : 'border-gray-400 bg-white'}`}
                                >
                                    {dailyFeeEnabled && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                                </button>
                                <span className="text-gray-900 font-medium text-sm">Daily rent late fee</span>
                                <Info size={16} className="text-[#3A6D6C]/70" />
                            </div>

                            {dailyFeeEnabled && (
                                // Adjusted grid columns to give more space to Type of Fee
                                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1.2fr] gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Type of fee <span className="text-red-500">*</span></label>
                                        <SearchableDropdown
                                            value={dailyFeeType}
                                            onChange={setDailyFeeType}
                                            options={feeTypeOptions}
                                            buttonClassName={dropdownButtonClasses}
                                            placeholder="Select type"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">
                                            {dailyFeeType.includes('Percentage') ? 'Amount in %' : 'Amount'} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            value={dailyFeeAmount}
                                            onChange={(e) => setDailyFeeAmount(e.target.value)}
                                            className={inputClasses}
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Maximum monthly balance <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={maxMonthlyBalance}
                                            onChange={(e) => setMaxMonthlyBalance(e.target.value)}
                                            className={inputClasses}
                                            prefix="₹"
                                            onFocus={(e) => e.target.select()}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Grace period settings */}
                    <div className="space-y-4">
                        <h3 className="text-[#2c3e50] font-bold text-base">Grace period settings</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            The grace period is the extra time given to tenants to pay without being charged late fees.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Grace period</label>
                                <SearchableDropdown
                                    value={gracePeriod}
                                    onChange={setGracePeriod}
                                    options={['0 days', '1 day', '2 days', '3 days', '4 days', '5 days', '10 days']}
                                    buttonClassName={dropdownButtonClasses}
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Time</label>
                                <TimePicker
                                    value={graceTime}
                                    onChange={setGraceTime}
                                    className="w-full"
                                    buttonClassName={cn(dropdownButtonClasses, "h-[46px]")}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Example Summary Box */}
                    <div className="flex gap-4 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                        <Zap className="w-5 h-5 text-yellow-500 shrink-0 fill-yellow-500" />
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {(() => {
                                // Calculations matching MoveInBothLateFees logic with fallback for dates
                                let dateStr = "DD MMM, YYYY";
                                const today = new Date();
                                const daysToAdd = parseInt(gracePeriod) || 0;

                                const oneTimeDate = new Date(today);
                                oneTimeDate.setDate(today.getDate() + daysToAdd);
                                dateStr = oneTimeDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

                                const dailyDate = new Date(oneTimeDate);
                                dailyDate.setDate(oneTimeDate.getDate() + 1);
                                // Not used in display but part of logic flow

                                // Format values
                                const oneTimeAmtDisplay = oneTimeFeeType !== 'Fixed amount' ? `${oneTimeFeeAmount}% of ${oneTimeFeeType.toLowerCase().replace('percentage of ', '')}` : `₹${Number(oneTimeFeeAmount).toLocaleString()}`;
                                const dailyAmtDisplay = dailyFeeType !== 'Fixed amount' ? `${dailyFeeAmount}% of ${dailyFeeType.toLowerCase().replace('percentage of ', '')}` : `₹${Number(dailyFeeAmount).toLocaleString()}`;

                                return (
                                    <>
                                        If tenant’s exact portion of Rent payment is not received by {graceTime} (Asia/Kolkata) on {dateStr},
                                        {oneTimeFeeEnabled ? ` one time rent late fee in ${oneTimeAmtDisplay} will be applied` : ''}
                                        {oneTimeFeeEnabled && dailyFeeEnabled ? ' and' : ''}
                                        {dailyFeeEnabled ? ` a daily rent late fee of ${dailyAmtDisplay} will start posting daily on the next day until the tenant’s balance is positive.` : '.'}
                                        {dailyFeeEnabled && maxMonthlyBalance && ` If the maximum monthly balance of ₹${Number(maxMonthlyBalance).toLocaleString()} is reached, late fees won't be posted.`}
                                    </>
                                );
                            })()}
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 px-6 py-4 shrink-0 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full sm:flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave({
                            oneTimeFee: { enabled: oneTimeFeeEnabled, type: oneTimeFeeType, amount: oneTimeFeeAmount },
                            dailyFee: { enabled: dailyFeeEnabled, type: dailyFeeType, amount: dailyFeeAmount, maxBalance: maxMonthlyBalance },
                            gracePeriod: { days: gracePeriod, time: graceTime }
                        })}
                        className="w-full sm:flex-1 bg-[#3A6D6C] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default EditExtraFeesModal;
