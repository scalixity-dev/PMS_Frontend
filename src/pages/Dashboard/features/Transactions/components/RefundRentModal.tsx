import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, Check } from 'lucide-react';
import DatePicker from '@/components/ui/DatePicker';
import CustomDropdown from '../../../components/CustomDropdown';

import { useTransactionStore } from '../store/transactionStore';

interface RefundRentModalProps {
    onConfirm?: (data: RefundFormData) => void;
}

interface RefundFormData {
    receiver: Date | undefined;
    amount: string;
    method: string;
    paymentDetails: string;
    confirmRefund: boolean;
    file?: File | null;
}

const RefundRentModal: React.FC<RefundRentModalProps> = ({ onConfirm }) => {
    const { isRefundModalOpen, setRefundModalOpen } = useTransactionStore();
    const isOpen = isRefundModalOpen;
    const onClose = () => setRefundModalOpen(false);
    // Form State
    const [receiver, setReceiver] = useState<Date | undefined>(undefined);
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('');
    const [paymentDetails, setPaymentDetails] = useState('');
    const [confirmRefund, setConfirmRefund] = useState(false);

    // Prevent scrolling when modal is open
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
            onConfirm({
                receiver,
                amount,
                method,
                paymentDetails,
                confirmRefund,
            });
        }
        onClose();
    };

    if (!isOpen) return null;

    const inputClasses = "w-full bg-white p-4 rounded-lg border border-gray-200 outline-none text-gray-700 placeholder-gray-400 font-medium";
    const labelClasses = "block text-sm font-bold text-[#2c3e50] mb-2";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="bg-white rounded-[1.5rem] w-full max-w-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 relative overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-5 flex items-center justify-between text-white">
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-xl font-semibold">Refund Rent</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Receiver */}
                        <div>
                            <label className={labelClasses}>Receiver</label>
                            <div className="relative">
                                <DatePicker
                                    value={receiver}
                                    onChange={setReceiver}
                                    placeholder="DD/MM/YYYY"
                                    className={inputClasses}
                                />
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className={labelClasses}>Amount</label>
                            <input
                                type="text"
                                placeholder="Type here"
                                className={inputClasses}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Method */}
                    <div className="mb-6">
                        <CustomDropdown
                            label="Method"
                            value={method}
                            onChange={setMethod}
                            placeholder="Select refund method"
                            options={[
                                { value: 'Cash', label: 'Cash' },
                                { value: 'Bank Transfer', label: 'Bank Transfer' },
                                { value: 'Cheque', label: 'Cheque' },
                                { value: 'Others', label: 'Others' },
                            ]}
                            buttonClassName={inputClasses}
                            dropdownClassName="z-50"
                        />
                    </div>

                    {/* Payment Details */}
                    <div className="mb-6">
                        <label className={labelClasses}>Payment Details *</label>
                        <textarea
                            placeholder="Type here"
                            className={`${inputClasses} h-32 resize-none`}
                            value={paymentDetails}
                            onChange={(e) => setPaymentDetails(e.target.value)}
                        />
                    </div>

                    {/* Confirm Refund Checkbox */}
                    <div className="mb-8 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setConfirmRefund(!confirmRefund)}
                            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${confirmRefund
                                ? 'bg-[#7BD747] border-[#7BD747]'
                                : 'bg-white border-gray-300 hover:border-gray-400'
                                }`}
                        >
                            {confirmRefund && <Check size={16} className="text-white" />}
                        </button>
                        <span className="text-sm font-semibold text-[#2c3e50]">Confirm Refund</span>
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

export default RefundRentModal;
