import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import DatePicker from '@/components/ui/DatePicker';
import { validateFile } from '@/utils/fileValidation';

import { useTransactionStore } from '../store/transactionStore';

interface MarkAsPaidModalProps {
    onConfirm?: (data: MarkAsPaidFormData) => void;
}

interface MarkAsPaidFormData {
    datePaid: Date | undefined;
    amountPaid: string;
    method: string;
    paymentDetails: string;
    selectedFile: File | null;
}

const MarkAsPaidModal: React.FC<MarkAsPaidModalProps> = ({ onConfirm }) => {
    const { isMarkAsPaidOpen, setMarkAsPaidOpen, markAsPaidData } = useTransactionStore();
    const isOpen = isMarkAsPaidOpen;
    const onClose = () => setMarkAsPaidOpen(false);
    const [datePaid, setDatePaid] = useState<Date | undefined>(undefined);
    const [amountPaid, setAmountPaid] = useState('');
    const [method, setMethod] = useState('');
    const [paymentDetails, setPaymentDetails] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [fieldErrors, setFieldErrors] = useState<{
        datePaid?: string;
        amountPaid?: string;
        method?: string;
        paymentDetails?: string;
    }>({});

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';

            // Pre-fill data if available
            if (markAsPaidData) {
                if (markAsPaidData.date) {
                    setDatePaid(markAsPaidData.date);
                } else {
                    setDatePaid(undefined);
                }

                if (markAsPaidData.amount) {
                    setAmountPaid(markAsPaidData.amount);
                } else {
                    setAmountPaid('');
                }
            } else {
                // Reset if no data passed (optional, depends on desired behavior)
                // setDatePaid(undefined);
                // setAmountPaid('');
            }

        } else {
            document.body.style.overflow = 'unset';
            // Optional: reset on close
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, markAsPaidData]);

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
        // Reset field errors
        const errors: typeof fieldErrors = {};

        // Validate datePaid
        if (!datePaid || !(datePaid instanceof Date) || isNaN(datePaid.getTime())) {
            errors.datePaid = 'Please select a valid payment date';
        }

        // Validate amountPaid
        const amountNum = parseFloat(amountPaid);
        if (!amountPaid || amountPaid.trim() === '') {
            errors.amountPaid = 'Please enter the amount paid';
        } else if (isNaN(amountNum) || amountNum <= 0) {
            errors.amountPaid = 'Amount must be a positive number';
        }

        // Validate method
        if (!method || method.trim() === '') {
            errors.method = 'Please select a payment method';
        }

        // Validate paymentDetails
        if (!paymentDetails || paymentDetails.trim() === '') {
            errors.paymentDetails = 'Please provide payment details';
        }

        // If there are errors, set them and don't proceed
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        // Clear any previous errors
        setFieldErrors({});

        // All validation passed, proceed with confirm
        if (onConfirm) {
            onConfirm({ datePaid, amountPaid, method, paymentDetails, selectedFile });
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
                        <label className={labelClasses}>Date Paid*</label>
                        <DatePicker
                            value={datePaid}
                            onChange={setDatePaid}
                            placeholder="Select payment date"
                            className={inputClasses}
                            aria-label="Select payment date"
                        />
                        {fieldErrors.datePaid && (
                            <p className="text-red-600 text-xs mt-1 ml-1">{fieldErrors.datePaid}</p>
                        )}
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
                            {fieldErrors.amountPaid && (
                                <p className="text-red-600 text-xs mt-1 ml-1">{fieldErrors.amountPaid}</p>
                            )}
                        </div>

                        {/* Method */}
                        <div>
                            <CustomDropdown
                                label="Method *"
                                value={method}
                                onChange={setMethod}
                                placeholder="Type here"
                                options={[
                                    { value: 'CASH', label: 'Cash' },
                                    { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
                                    { value: 'CHEQUE', label: 'Cheque' },
                                    { value: 'UPI', label: 'UPI' },
                                    { value: 'CARD', label: 'Card' },
                                    { value: 'OTHERS', label: 'Others' },
                                ]}
                                buttonClassName={inputClasses}
                                dropdownClassName="z-50"
                            />
                            {fieldErrors.method && (
                                <p className="text-red-600 text-xs mt-1 ml-1">{fieldErrors.method}</p>
                            )}
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
                        {fieldErrors.paymentDetails && (
                            <p className="text-red-600 text-xs mt-1 ml-1">{fieldErrors.paymentDetails}</p>
                        )}
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

export default MarkAsPaidModal;
