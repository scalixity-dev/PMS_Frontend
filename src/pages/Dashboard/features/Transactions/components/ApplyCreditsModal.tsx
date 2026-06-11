import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import CustomTextBox from '../../../components/CustomTextBox';
import DatePicker from '@/components/ui/DatePicker';
import { validateFile } from '@/utils/fileValidation';
import { useTransactionStore } from '../store/transactionStore';
import { useGetAvailableDepositsAndCredits, useApplyDepositCredit } from '../../../../../hooks/useTransactionQueries';
import { useToast } from '../../../../../components/common/Toast';

interface ApplyCreditsModalProps {
    transactionId?: string;
    payerId?: string | null;
    contactId?: string | null;
    leaseId?: string | null;
    amountOwed?: string;
}

const ApplyCreditsModal: React.FC<ApplyCreditsModalProps> = ({
    transactionId,
    payerId,
    contactId,
    leaseId,
    amountOwed = '$45,000.00'
}) => {
    const { isApplyCreditsOpen, setApplyCreditsOpen } = useTransactionStore();
    const toast = useToast();
    const isOpen = isApplyCreditsOpen;
    const onClose = () => setApplyCreditsOpen(false);

    const [selectedCreditId, setSelectedCreditId] = useState('');
    const [dateApplied, setDateApplied] = useState<Date | undefined>(undefined);
    const [applyAmount, setApplyAmount] = useState('');
    const [details, setDetails] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string>('');
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [fieldErrors, setFieldErrors] = useState<{
        selectedCreditId?: string;
        dateApplied?: string;
        applyAmount?: string;
        details?: string;
    }>({});

    const { data: depositsAndCredits = [], isLoading: isLoadingCredits } = useGetAvailableDepositsAndCredits(
        payerId,
        contactId,
        leaseId,
    );

    const availableCredits = depositsAndCredits.filter(item => item.type === 'CREDIT');

    const applyMutation = useApplyDepositCredit();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setSelectedCreditId('');
            setDateApplied(undefined);
            setApplyAmount('');
            setDetails('');
            setSelectedFile(null);
            setUploadError('');
            setFieldErrors({});
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
        const errors: typeof fieldErrors = {};

        if (!selectedCreditId) {
            errors.selectedCreditId = 'Please select a credit to apply from';
        }
        if (!dateApplied || isNaN(dateApplied.getTime())) {
            errors.dateApplied = 'Please select a valid date';
        }
        const amountNum = parseFloat(applyAmount);
        if (!applyAmount || applyAmount.trim() === '') {
            errors.applyAmount = 'Please enter an amount';
        } else if (isNaN(amountNum) || amountNum <= 0) {
            errors.applyAmount = 'Amount must be a positive number';
        } else {
            const selectedCredit = availableCredits.find(c => c.id === selectedCreditId);
            if (selectedCredit && amountNum > selectedCredit.balance) {
                errors.applyAmount = `Amount exceeds available balance ($${selectedCredit.balance})`;
            }
        }
        if (!details || details.trim() === '') {
            errors.details = 'Please provide details';
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }
        setFieldErrors({});

        if (!transactionId) {
            toast.error('Transaction ID is missing');
            return;
        }

        applyMutation.mutate(
            {
                applyData: {
                    payerId: payerId || undefined,
                    contactId: contactId || undefined,
                    leaseId: leaseId || undefined,
                    applications: [
                        {
                            sourceTransactionId: selectedCreditId,
                            targetTransactionId: transactionId,
                            amount: parseFloat(applyAmount),
                            notes: details,
                        },
                    ],
                },
                file: selectedFile || undefined,
            },
            {
                onSuccess: () => {
                    toast.success('Credit applied successfully');
                    onClose();
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to apply credit');
                },
            }
        );
    };

    if (!isOpen) return null;

    const inputClasses = "w-full bg-white p-4 rounded-lg border border-gray-200 outline-none text-gray-700 placeholder-gray-400 font-medium";
    const labelClasses = "block text-sm font-bold text-[#2c3e50] mb-2";

    const creditOptions = isLoadingCredits
        ? [{ value: '', label: 'Loading credits...' }]
        : availableCredits.length === 0
            ? [{ value: '', label: 'No credits available' }]
            : availableCredits.map(c => ({
                value: c.id,
                label: `${c.transactionId} — Balance: $${c.balance.toFixed(2)}`,
            }));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4">
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
                <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar">
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
                        <label className={labelClasses}>Apply From*</label>
                        <select
                            value={selectedCreditId}
                            onChange={(e) => setSelectedCreditId(e.target.value)}
                            className={inputClasses}
                        >
                            <option value="">Select credit</option>
                            {creditOptions.map(opt => (
                                <option key={opt.value} value={opt.value} disabled={opt.value === ''}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        {fieldErrors.selectedCreditId && (
                            <p className="text-red-600 text-xs mt-1 ml-1">{fieldErrors.selectedCreditId}</p>
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
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={handleFileChange}
                        />
                        <button
                            onClick={handleFileClick}
                            className="w-full sm:flex-1 py-3 px-6 bg-[#5F6D7E] text-white rounded-lg font-medium hover:bg-[#4a5563] transition-colors shadow-lg"
                        >
                            Upload File
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={applyMutation.isPending}
                            className="w-full sm:flex-1 py-3 px-6 bg-[#3A6D6C] text-white rounded-lg font-medium hover:bg-[#2c5251] transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {applyMutation.isPending && (
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            {applyMutation.isPending ? 'Applying...' : 'Confirm'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplyCreditsModal;
