import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import DatePicker from '@/components/ui/DatePicker';
import CustomDropdown from '../../../components/CustomDropdown';

import { useTransactionStore } from '../store/transactionStore';

const EditPaymentModal: React.FC = () => {
    const { isEditPaymentModalOpen, setEditPaymentModalOpen } = useTransactionStore();
    const isOpen = isEditPaymentModalOpen;
    const onClose = () => setEditPaymentModalOpen(false);
    // Form State
    const [datePaid, setDatePaid] = useState<Date | undefined>(undefined);
    const [amountPaid, setAmountPaid] = useState('');
    const [method, setMethod] = useState('');
    const [details, setDetails] = useState('');

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
                    <h2 className="text-xl font-semibold">Edit payment</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Date Paid */}
                        <div>
                            <label className={labelClasses}>Date Paid</label>
                            <div className="relative">
                                <DatePicker
                                    value={datePaid}
                                    onChange={setDatePaid}
                                    placeholder="DD/MM/YYYY"
                                    className={inputClasses}
                                />
                                {/* Optional Calendar Icon overlay if DatePicker doesn't have one naturally, 
                                    but usually DatePicker handles it. 
                                    If distinct styling needed: pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 */}
                            </div>
                        </div>

                        {/* Amount Paid */}
                        <div>
                            <label className={labelClasses}>Amount Paid*</label>
                            <input
                                type="text"
                                placeholder="Type here"
                                className={inputClasses}
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Method */}
                    <div className="mb-6">
                        <CustomDropdown
                            label="Method"
                            value={method}
                            onChange={setMethod}
                            placeholder="Select payment method"
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
                    <div className="mb-8">
                        <label className={labelClasses}>Payment Details *</label>
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
                        <button className="flex-1 py-3 px-6 bg-[#3A6D6C] text-white rounded-lg font-medium hover:bg-[#2c5251] transition-colors shadow-lg">
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditPaymentModal;
