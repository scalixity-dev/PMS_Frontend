import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import DatePicker from '@/components/ui/DatePicker';
import { validateFile } from '@/utils/fileValidation';
import CustomDropdown from '../../../components/CustomDropdown';

import { useTransactionStore } from '../store/transactionStore';

interface EditPaymentModalProps {
    onConfirm?: (data: any) => void;
}

const EditPaymentModal: React.FC<EditPaymentModalProps> = ({ onConfirm }) => {
    const { isEditPaymentModalOpen, setEditPaymentModalOpen, selectedPayment } = useTransactionStore();
    const isOpen = isEditPaymentModalOpen;
    const onClose = () => setEditPaymentModalOpen(false);
    // Form State
    const [datePaid, setDatePaid] = useState<Date | undefined>(undefined);
    const [amountPaid, setAmountPaid] = useState('');
    const [method, setMethod] = useState('');
    const [details, setDetails] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Prevent scrolling when modal is open
    // Prevent scrolling when modal is open and reset/fill form
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';

            if (selectedPayment) {
                if (selectedPayment.date) {
                    // Try to parse mock date "08 Dec, 2025" or standard date string
                    const parsedDate = new Date(selectedPayment.date);
                    if (!isNaN(parsedDate.getTime())) {
                        setDatePaid(parsedDate);
                    }
                }

                if (selectedPayment.amount) {
                    // Clean currency symbols if mock data has them "₹53,200.00"
                    const amountStr = String(selectedPayment.amount).replace(/[^0-9.]/g, '');
                    setAmountPaid(amountStr);
                }
            }
        } else {
            document.body.style.overflow = 'unset';
            // Optional: reset on close
            /*
            setDatePaid(undefined);
            setAmountPaid('');
            setMethod('');
            setDetails('');
            */
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, selectedPayment]);

    const handleFileClick = () => {
        setUploadError('');
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validation = validateFile(file);
        if (!validation.isValid) {
            setUploadError(validation.error || 'Invalid file');
            return;
        }

        setSelectedFile(file);
        setUploadError('');
    };

    const handleConfirm = () => {
        // Basic validation
        if (!amountPaid) {
            alert("Please enter amount paid");
            return;
        }

        if (onConfirm) {
            onConfirm({
                datePaid,
                amountPaid,
                method,
                details,
                file: selectedFile
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

                    {/* File Upload Error/Success Message */}
                    {uploadError && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                            {uploadError}
                        </div>
                    )}
                    {selectedFile && !uploadError && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-700 text-sm">
                            File selected: {selectedFile.name}
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center gap-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={handleFileClick}
                            className="flex-1 py-3 px-6 bg-[#5F6D7E] text-white rounded-lg font-medium hover:bg-[#4a5563] transition-colors shadow-lg"
                        >
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

export default EditPaymentModal;
