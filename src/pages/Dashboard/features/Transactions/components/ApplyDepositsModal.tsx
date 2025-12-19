import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import CustomTextBox from '../../../components/CustomTextBox';
import DatePicker from '@/components/ui/DatePicker';

import { useTransactionStore } from '../store/transactionStore';

interface ApplyDepositsModalProps {
    onConfirm?: (data: ApplyDepositsFormData) => void;
    amountOwned?: string;
}

interface ApplyDepositsFormData {
    applyFrom: string;
    dateApplied: Date | undefined;
    applyAmount: string;
    details: string;
}

const ApplyDepositsModal: React.FC<ApplyDepositsModalProps> = ({
    onConfirm,
    amountOwned = '₹45,000.00'
}) => {
    const { isApplyDepositsOpen, setApplyDepositsOpen } = useTransactionStore();
    const isOpen = isApplyDepositsOpen;
    const onClose = () => setApplyDepositsOpen(false);
    const [applyFrom, setApplyFrom] = useState('');
    const [dateApplied, setDateApplied] = useState<Date | undefined>(undefined);
    const [applyAmount, setApplyAmount] = useState('');
    const [details, setDetails] = useState('');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm({ applyFrom, dateApplied, applyAmount, details });
        }
        onClose();
    };

    if (!isOpen) return null;

    const inputClasses = "w-full bg-white p-4 rounded-lg border border-gray-200 outline-none text-gray-700 placeholder-gray-400 font-medium";
    const labelClasses = "block text-sm font-bold text-[#2c3e50] mb-2";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="bg-[#dfe5e3] rounded-[1.5rem] w-full max-w-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 relative overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-5 flex items-center justify-between text-white">
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-xl font-semibold">Apply deposits</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {/* Amount Owned Pill */}
                    <div className="mb-6">
                        <div className="inline-block bg-[#7BD747] rounded-full px-6 py-3 shadow-md">
                            <span className="text-white text-sm font-bold block mb-1">Amount Owned*</span>
                            <CustomTextBox
                                value={amountOwned}
                                className="bg-[#E3EBDE] px-1 text-center"
                                valueClassName="text-[#2c3e50] font-bold text-sm"
                            />
                        </div>
                    </div>

                    {/* Apply From */}
                    <div className="mb-4">
                        <CustomDropdown
                            label="Apply From*"
                            value={applyFrom}
                            onChange={setApplyFrom}
                            placeholder="Choose Type"
                            options={[
                                { value: 'security_deposit', label: 'Security Deposit' },
                                { value: 'advance_payment', label: 'Advance Payment' },
                                { value: 'other', label: 'Other' },
                            ]}
                            buttonClassName={inputClasses}
                            dropdownClassName="z-50"
                        />
                    </div>

                    {/* Help text */}
                    <p className="text-gray-600 text-sm mb-6">
                        No deposit available. Click <span className="text-[#3A6D6C] font-semibold cursor-pointer hover:underline">here</span> to add deposit.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Date Applied */}
                        <div>
                            <label className={labelClasses}>Date Applied*</label>
                            <div className="relative">
                                <DatePicker
                                    value={dateApplied}
                                    onChange={setDateApplied}
                                    placeholder="Select Date"
                                    className={inputClasses}
                                />
                            </div>
                        </div>

                        {/* Apply Amount */}
                        <div>
                            <label className={labelClasses}>Apply Amount*</label>
                            <input
                                type="text"
                                placeholder="Type here"
                                className={inputClasses}
                                value={applyAmount}
                                onChange={(e) => setApplyAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Details */}
                    <div className="mb-8">
                        <label className={labelClasses}>Details *</label>
                        <textarea
                            placeholder="Type here"
                            className={`${inputClasses} h-32 resize-none`}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center gap-4">
                        <button className="flex-1 py-3 px-6 bg-[#5F6D7E] text-white rounded-lg font-medium hover:bg-[#4a5563] transition-colors shadow-lg">
                            Upload File
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 py-3 px-6 bg-[#3A6D6C] text-white rounded-lg font-medium hover:bg-[#2c5251] transition-colors shadow-lg"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplyDepositsModal;
