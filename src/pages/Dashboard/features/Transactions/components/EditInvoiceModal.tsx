import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import DatePicker from '@/components/ui/DatePicker';
import { validateFile } from '@/utils/fileValidation';

import { useTransactionStore } from '../store/transactionStore';

interface EditInvoiceModalProps {
    onConfirm?: (data: EditInvoiceFormData) => void;
}

interface EditInvoiceFormData {
    category: string;
    amount: string;
    dueOn: Date | undefined;
    details: string;
    tags: string;
    selectedFile: File | null;
}

const EditInvoiceModal: React.FC<EditInvoiceModalProps> = ({ onConfirm }) => {
    const { isEditInvoiceOpen, setEditInvoiceOpen } = useTransactionStore();
    const isOpen = isEditInvoiceOpen;
    const onClose = () => setEditInvoiceOpen(false);
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [dueOn, setDueOn] = useState<Date | undefined>(undefined);
    const [details, setDetails] = useState('');
    const [tags, setTags] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [fieldErrors, setFieldErrors] = useState<{
        category?: string;
        amount?: string;
        dueOn?: string;
        details?: string;
        tags?: string;
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

        // Validate category
        if (!category || category.trim() === '') {
            errors.category = 'Please select a category';
        }

        // Validate amount
        const amountNum = parseFloat(amount);
        if (!amount || amount.trim() === '') {
            errors.amount = 'Please enter an amount';
        } else if (isNaN(amountNum) || amountNum <= 0) {
            errors.amount = 'Amount must be a positive number';
        }

        // Validate dueOn
        if (!dueOn || !(dueOn instanceof Date) || isNaN(dueOn.getTime())) {
            errors.dueOn = 'Please select a valid due date';
        }

        // Validate details
        if (!details || details.trim() === '') {
            errors.details = 'Please provide details';
        }

        // Validate tags
        if (!tags || tags.trim() === '') {
            errors.tags = 'Please select at least one tag';
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
            onConfirm({ category, amount, dueOn, details, tags, selectedFile });
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
                    <h2 className="text-xl font-semibold">Edit invoice</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {/* Category & Subcategory */}
                    <div className="mb-6">
                        <CustomDropdown
                            label="Category & Subcategory*"
                            value={category}
                            onChange={setCategory}
                            placeholder="Choose Type"
                            options={[
                                { value: 'rent', label: 'Rent' },
                                { value: 'maintenance', label: 'Maintenance' },
                                { value: 'parking', label: 'Parking' },
                                { value: 'utilities', label: 'Utilities' },
                            ]}
                            buttonClassName={inputClasses}
                            dropdownClassName="z-50"
                        />
                        {fieldErrors.category && (
                            <p className="text-red-600 text-xs mt-1 ml-1">{fieldErrors.category}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Amount */}
                        <div>
                            <label className={labelClasses}>Amount *</label>
                            <input
                                type="text"
                                placeholder="Type here"
                                className={inputClasses}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            {fieldErrors.amount && (
                                <p className="text-red-600 text-xs mt-1 ml-1">{fieldErrors.amount}</p>
                            )}
                        </div>

                        {/* Due On */}
                        <div>
                            <label className={labelClasses}>Due On *</label>
                            <div className="relative">
                                <DatePicker
                                    value={dueOn}
                                    onChange={setDueOn}
                                    placeholder="Select Date"
                                    className={inputClasses}
                                />
                            </div>
                            {fieldErrors.dueOn && (
                                <p className="text-red-600 text-xs mt-1 ml-1">{fieldErrors.dueOn}</p>
                            )}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="mb-6">
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

                    {/* Tags */}
                    <div className="mb-8">
                        <CustomDropdown
                            label="Tags*"
                            value={tags}
                            onChange={setTags}
                            placeholder="Choose Type"
                            options={[
                                { value: 'urgent', label: 'Urgent' },
                                { value: 'recurring', label: 'Recurring' },
                                { value: 'pending', label: 'Pending' },
                            ]}
                            buttonClassName={inputClasses}
                            dropdownClassName="z-50"
                        />
                        {fieldErrors.tags && (
                            <p className="text-red-600 text-xs mt-1 ml-1">{fieldErrors.tags}</p>
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

export default EditInvoiceModal;
