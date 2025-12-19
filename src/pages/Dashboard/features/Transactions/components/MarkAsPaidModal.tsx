import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';

import { useTransactionStore } from '../store/transactionStore';

interface MarkAsPaidModalProps {
    onConfirm?: (data: MarkAsPaidFormData) => void;
}

interface MarkAsPaidFormData {
    datePaid: string;
    amountPaid: string;
    method: string;
    paymentDetails: string;
}

const MarkAsPaidModal: React.FC<MarkAsPaidModalProps> = ({ onConfirm }) => {
    const { isMarkAsPaidOpen, setMarkAsPaidOpen } = useTransactionStore();
    const isOpen = isMarkAsPaidOpen;
    const onClose = () => setMarkAsPaidOpen(false);
    const [datePaid, setDatePaid] = useState('');
    const [amountPaid, setAmountPaid] = useState('');
    const [method, setMethod] = useState('');
    const [paymentDetails, setPaymentDetails] = useState('');

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
            onConfirm({ datePaid, amountPaid, method, paymentDetails });
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
                    <h2 className="text-xl font-semibold">Mark as paid</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {/* Date Paid */}
                    <div className="mb-6">
                        <CustomDropdown
                            label="Date Paid*"
                            value={datePaid}
                            onChange={setDatePaid}
                            placeholder="Choose Type"
                            options={[
                                { value: 'today', label: 'Today' },
                                { value: 'yesterday', label: 'Yesterday' },
                                { value: 'custom', label: 'Custom Date' },
                            ]}
                            buttonClassName={inputClasses}
                            dropdownClassName="z-50"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Amount Paid */}
                        <div>
                            <label className={labelClasses}>Amount Paid *</label>
                            <input
                                type="text"
                                placeholder="Type here"
                                className={inputClasses}
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                            />
                        </div>

                        {/* Method */}
                        <div>
                            <CustomDropdown
                                label="Method *"
                                value={method}
                                onChange={setMethod}
                                placeholder="Type here"
                                options={[
                                    { value: 'Cash', label: 'Cash' },
                                    { value: 'Bank Transfer', label: 'Bank Transfer' },
                                    { value: 'Cheque', label: 'Cheque' },
                                    { value: 'UPI', label: 'UPI' },
                                    { value: 'Others', label: 'Others' },
                                ]}
                                buttonClassName={inputClasses}
                                dropdownClassName="z-50"
                            />
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="mb-8">
                        <label className={labelClasses}>Payment Details *</label>
                        <textarea
                            placeholder="Type here"
                            className={`${inputClasses} h-32 resize-none`}
                            value={paymentDetails}
                            onChange={(e) => setPaymentDetails(e.target.value)}
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

export default MarkAsPaidModal;
