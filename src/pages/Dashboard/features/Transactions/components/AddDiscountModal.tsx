import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import CustomTextBox from '../../../components/CustomTextBox';
import DatePicker from '@/components/ui/DatePicker';

import { useTransactionStore } from '../store/transactionStore';

interface AddDiscountModalProps {
    onConfirm?: (data: AddDiscountFormData) => void;
    amountOwned?: string;
}

interface AddDiscountFormData {
    discountType: string;
    dateApplied: Date | undefined;
    discountAmount: string;
    details: string;
}

const AddDiscountModal: React.FC<AddDiscountModalProps> = ({
    onConfirm,
    amountOwned = '₹45,000.00'
}) => {
    const { isAddDiscountOpen, setAddDiscountOpen } = useTransactionStore();
    const isOpen = isAddDiscountOpen;
    const onClose = () => setAddDiscountOpen(false);
    const [discountType, setDiscountType] = useState('');
    const [dateApplied, setDateApplied] = useState<Date | undefined>(undefined);
    const [discountAmount, setDiscountAmount] = useState('');
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
            onConfirm({ discountType, dateApplied, discountAmount, details });
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
                    <h2 className="text-xl font-semibold">Add discount</h2>
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

                    {/* Discount Type */}
                    <div className="mb-6">
                        <CustomDropdown
                            label="Discount Type*"
                            value={discountType}
                            onChange={setDiscountType}
                            placeholder="Choose Type"
                            options={[
                                { value: 'percentage', label: 'Percentage' },
                                { value: 'fixed', label: 'Fixed Amount' },
                                { value: 'early_payment', label: 'Early Payment Discount' },
                                { value: 'loyalty', label: 'Loyalty Discount' },
                            ]}
                            buttonClassName={inputClasses}
                            dropdownClassName="z-50"
                        />
                    </div>

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

                        {/* Discount Amount */}
                        <div>
                            <label className={labelClasses}>Discount Amount*</label>
                            <input
                                type="text"
                                placeholder="Type here"
                                className={inputClasses}
                                value={discountAmount}
                                onChange={(e) => setDiscountAmount(e.target.value)}
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

export default AddDiscountModal;
