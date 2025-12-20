import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, Check } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import { useTransactionStore } from '../../Transactions/store/transactionStore';

interface RefundPaymentModalProps {
    onConfirm?: (data: RefundPaymentFormData) => void;
}

interface RefundPaymentFormData {
    method: string;
    details: string;
}

const RefundPaymentModal: React.FC<RefundPaymentModalProps> = ({ onConfirm }) => {
    const { isRefundModalOpen, setRefundModalOpen, selectedPayment } = useTransactionStore();
    const isOpen = isRefundModalOpen;
    const onClose = () => setRefundModalOpen(false);

    const [method, setMethod] = useState('');
    const [details, setDetails] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);

    // Derived state from selectedPayment
    const [receiver, setReceiver] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (isOpen && selectedPayment) {
            document.body.style.overflow = 'hidden';
            setReceiver(selectedPayment.contact || '');
            setAmount(selectedPayment.amount ? `₹${selectedPayment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '');
            setMethod('');
            setDetails('');
            setIsConfirmed(false);
        } else if (isOpen) {
            document.body.style.overflow = 'hidden';
            setReceiver('');
            setAmount('');
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, selectedPayment]);

    const handleConfirm = () => {
        if (!isConfirmed) return;

        if (onConfirm) {
            onConfirm({ method, details });
        }
        // Logic to process refund would go here
        console.log('Refund confirmed', { receiver, amount, method, details });
        onClose();
    };

    if (!isOpen) return null;

    const inputClasses = "w-full bg-[#F5F6F8] p-4 rounded-lg border border-gray-200 outline-none text-gray-500 font-medium cursor-not-allowed"; // Grayed out style
    const activeInputClasses = "w-full bg-white p-4 rounded-lg border border-gray-200 outline-none text-gray-700 placeholder-gray-400 font-medium";
    const labelClasses = "block text-sm font-bold text-[#2c3e50] mb-2";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className=" rounded-[1.5rem] w-full max-w-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 relative overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className=" bg-[var(--color-primary)] p-6 border-b border-gray-100 flex items-center justify-between">
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors mr-2">
                        <ChevronLeft size={24} className="text-white" />
                    </button>

                    <h2 className="text-xl font-semibold text-white">Refund {selectedPayment?.category || 'Payment'}</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={24} className="text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="bg-[#DFE5E3] p-8 overflow-y-auto custom-scrollbar">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Receiver */}
                        <div>
                            <label className={labelClasses}>Receiver</label>
                            <input
                                type="text"
                                className={inputClasses}
                                value={receiver}
                                readOnly
                            />
                        </div>

                        {/* Amount */}
                        <div>
                            <label className={labelClasses}>Amount</label>
                            <input
                                type="text"
                                className={inputClasses}
                                value={amount}
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Method */}
                    <div className="mb-6">
                        <CustomDropdown
                            label="Method"
                            value={method}
                            onChange={setMethod}
                            placeholder="Select Method"
                            options={[
                                { value: 'Cash', label: 'Cash' },
                                { value: 'Bank Transfer', label: 'Bank Transfer' },
                                { value: 'Check', label: 'Check' },
                                { value: 'Others', label: 'Others' },
                            ]}
                            buttonClassName={activeInputClasses}
                            dropdownClassName="z-50"
                        />
                    </div>

                    {/* Details */}
                    <div className="mb-2">
                        <label className={labelClasses}>Details</label>
                        <textarea
                            placeholder="Type here"
                            className={`${activeInputClasses} h-32 resize-none`}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            maxLength={150}
                        />
                        <p className="text-right text-xs text-gray-400 mt-1">
                            Character limit: {details.length} / 150
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-[#DFE5E3] p-6 flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsConfirmed(!isConfirmed)}
                            className="flex items-center justify-center"
                        >
                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isConfirmed ? 'bg-[#7BD747]' : 'bg-white border border-gray-300'}`}>
                                {isConfirmed && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                        </button>
                        <label
                            onClick={() => setIsConfirmed(!isConfirmed)}
                            className="ml-2 text-sm font-semibold text-[#1a2b4b] cursor-pointer"
                        >
                            Confirm refund <span className='font-bold'>{amount}</span> to <span className='font-bold'>{receiver}</span>
                        </label>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 border bg-[#5F6D7E] text-white rounded-lg font-medium hover:bg-[#4a5563] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!isConfirmed}
                            className={`px-6 py-2 rounded-lg font-medium text-white transition-colors shadow-sm ${isConfirmed ? 'bg-[#3A6D6C] hover:bg-[#2c5251]' : 'bg-gray-300 cursor-not-allowed'}`}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundPaymentModal;
