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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [fieldErrors, setFieldErrors] = useState<{
        discountType?: string;
        dateApplied?: string;
        discountAmount?: string;
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

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
            setUploadError('File size must be less than 10MB');
            return;
        }

        // Validate file type (documents and images)
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg',
            'image/png',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (!allowedTypes.includes(file.type)) {
            setUploadError('Please upload a PDF, image, or Word document');
            return;
        }

        setSelectedFile(file);
        setUploadError('');
        // TODO: Implement actual file upload to server
    };

    const handleConfirm = () => {
        // Reset field errors
        const errors: typeof fieldErrors = {};

        // Validate discountType
        if (!discountType || discountType.trim() === '') {
            errors.discountType = 'Please select a discount type';
        }

        // Validate dateApplied
        if (!dateApplied || !(dateApplied instanceof Date) || isNaN(dateApplied.getTime())) {
            errors.dateApplied = 'Please select a valid date';
        }

        // Validate discountAmount
        const amountNum = parseFloat(discountAmount);
        if (!discountAmount || discountAmount.trim() === '') {
            errors.discountAmount = 'Please enter a discount amount';
        } else if (isNaN(amountNum) || amountNum <= 0) {
            errors.discountAmount = 'Amount must be a positive number';
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
            onConfirm({ discountType, dateApplied, discountAmount, details });
        }
        // TODO: Handle file upload before closing if selectedFile exists
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
                    {/* Amount Owed Pill */}
                    <div className="mb-6">
                        <div className="inline-block bg-[#7BD747] rounded-full px-6 py-3 shadow-md">
                            <span className="text-white text-sm font-bold block mb-1">Amount Owed*</span>
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
                        {fieldErrors.discountType && (
                            <p className="text-red-600 text-xs mt-1 ml-1">{fieldErrors.discountType}</p>
                        )}
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
                            {fieldErrors.dateApplied && (
                                <p className="text-red-600 text-xs mt-1 ml-1">{fieldErrors.dateApplied}</p>
                            )}
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
                            {fieldErrors.discountAmount && (
                                <p className="text-red-600 text-xs mt-1 ml-1">{fieldErrors.discountAmount}</p>
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

export default AddDiscountModal;
