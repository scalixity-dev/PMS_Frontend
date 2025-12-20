import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import CustomTextBox from '../../../components/CustomTextBox';
import DatePicker from '@/components/ui/DatePicker';
import { validateFile } from '@/utils/fileValidation';

import { useTransactionStore } from '../store/transactionStore';

interface ApplyCreditsModalProps {
    onConfirm?: (data: ApplyCreditsFormData) => void;
    amountOwed?: string;
}

interface ApplyCreditsFormData {
    applyFrom: string;
    dateApplied: Date | undefined;
    applyAmount: string;
    details: string;
    selectedFile: File | null;
}

const ApplyCreditsModal: React.FC<ApplyCreditsModalProps> = ({
    onConfirm,
    amountOwed = '₹45,000.00'
}) => {
    const { isApplyCreditsOpen, setApplyCreditsOpen } = useTransactionStore();
    const isOpen = isApplyCreditsOpen;
    const onClose = () => setApplyCreditsOpen(false);
    const [applyFrom, setApplyFrom] = useState('');
    const [dateApplied, setDateApplied] = useState<Date | undefined>(undefined);
    const [applyAmount, setApplyAmount] = useState('');
    const [details, setDetails] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [fieldErrors, setFieldErrors] = useState<{
        applyFrom?: string;
        dateApplied?: string;
        applyAmount?: string;
        details?: string;
    }>({});

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

        // Validate applyFrom
        if (!applyFrom || applyFrom.trim() === '') {
            errors.applyFrom = 'Please select where to apply from';
        }

        // Validate dateApplied
        if (!dateApplied || !(dateApplied instanceof Date) || isNaN(dateApplied.getTime())) {
            errors.dateApplied = 'Please select a valid date';
        }

        // Validate applyAmount
        const amountNum = parseFloat(applyAmount);
        if (!applyAmount || applyAmount.trim() === '') {
            errors.applyAmount = 'Please enter an amount';
        } else if (isNaN(amountNum) || amountNum <= 0) {
            errors.applyAmount = 'Amount must be a positive number';
        }

        // Validate details
        if (!details || details.trim() === '') {
            errors.details = 'Please provide details';
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
            onConfirm({ applyFrom, dateApplied, applyAmount, details, selectedFile });
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
                    <h2 className="text-xl font-semibold">Apply credits</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {/* Amount Owed Pill */}
                    <div className="mb-6">
                        <div className="inline-block bg-[#7BD747] rounded-full px-6 py-3 shadow-md">
                            <span className="text-white text-sm font-bold block mb-1">Amount Owed*</span>
                            <CustomTextBox
                                value={amountOwed}
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
                                { value: 'credit_balance', label: 'Credit Balance' },
                                { value: 'overpayment', label: 'Overpayment' },
                                { value: 'other', label: 'Other' },
                            ]}
                            buttonClassName={inputClasses}
                            dropdownClassName="z-50"
                        />
                        {fieldErrors.applyFrom && (
                            <p className="text-red-600 text-xs mt-1 ml-1">{fieldErrors.applyFrom}</p>
                        )}
                    </div>

                    {/* Help text */}
                    <p className="text-gray-600 text-sm mb-6">
                        No credit available. Click <span className="text-[#3A6D6C] font-semibold cursor-pointer hover:underline">here</span> to add credit.
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
                            {fieldErrors.dateApplied && (
                                <p className="text-red-600 text-xs mt-1 ml-1">{fieldErrors.dateApplied}</p>
                            )}
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
                            {fieldErrors.applyAmount && (
                                <p className="text-red-600 text-xs mt-1 ml-1">{fieldErrors.applyAmount}</p>
                            )}
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
                        {fieldErrors.details && (
                            <p className="text-red-600 text-xs mt-1 ml-1">{fieldErrors.details}</p>
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

export default ApplyCreditsModal;
