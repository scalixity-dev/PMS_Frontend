import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { useTransactionStore } from '../store/transactionStore';
import { useVoidTransaction } from '../../../../../hooks/useTransactionQueries';
import { useToast } from '../../../../../components/common/Toast';

interface VoidTransactionModalProps {
    transactionId?: string;
}

const VoidTransactionModal: React.FC<VoidTransactionModalProps> = ({ transactionId: propTransactionId }) => {
    const { isVoidModalOpen, setVoidModalOpen, selectedTransactionId } = useTransactionStore();
    const toast = useToast();
    const isOpen = isVoidModalOpen;
    const onClose = () => setVoidModalOpen(false);
    const transactionId = propTransactionId || (selectedTransactionId ? String(selectedTransactionId) : undefined);
    const [reason, setReason] = useState('');
    const [reasonError, setReasonError] = useState('');
    const [apiError, setApiError] = useState('');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const voidMutation = useVoidTransaction();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setReason('');
            setReasonError('');
            setApiError('');
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleConfirm = () => {
        const trimmedReason = reason.trim();
        if (!trimmedReason) {
            setReasonError('Please provide a reason for voiding this transaction');
            textareaRef.current?.focus();
            return;
        }
        if (!transactionId) {
            setReasonError('Transaction ID is missing');
            return;
        }
        setReasonError('');

        voidMutation.mutate(
            { transactionId, reason: trimmedReason },
            {
                onSuccess: () => {
                    toast.success('Transaction voided successfully');
                    onClose();
                },
                onError: (error: any) => {
                    setApiError(error.message || 'Failed to void transaction');
                },
            }
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4">
            <div className="bg-white rounded-[1.5rem] w-full max-w-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 relative overflow-hidden flex flex-col">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-5 flex items-center justify-between text-white">
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-xl font-semibold">Void transaction</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-8">
                    <p className="text-lg text-[#2c3e50] mb-6">
                        Are you sure you want to void this transaction? Enter the reason if necessary.
                    </p>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-[#2c3e50] mb-2">Reason*</label>
                        <textarea
                            ref={textareaRef}
                            placeholder="Add some details*"
                            className="w-full bg-white p-4 rounded-lg border border-gray-300 outline-none text-gray-700 placeholder-gray-500 font-medium h-40 resize-none focus:ring-1 focus:ring-[#3A6D6C] focus:border-[#3A6D6C]"
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                if (reasonError) setReasonError('');
                                if (apiError) setApiError('');
                            }}
                        />
                        {reasonError && (
                            <p className="text-red-600 text-xs mt-1 ml-1">{reasonError}</p>
                        )}
                    </div>

                    <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                        Voiding a transaction does not delete the invoice or initiate a refund, but it will remove it from your financial statements.
                    </p>

                    {apiError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
                            {apiError}
                        </div>
                    )}

                    <div className="border-t border-gray-100 -mx-4 px-4 sm:-mx-8 sm:px-8 pt-6 flex justify-end">
                        <button
                            onClick={handleConfirm}
                            disabled={voidMutation.isPending}
                            className="w-full sm:w-auto bg-[#3A6D6C] text-white px-10 py-3 rounded-lg font-medium hover:bg-[#2c5251] transition-colors shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {voidMutation.isPending && (
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            {voidMutation.isPending ? 'Voiding...' : 'Confirm'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoidTransactionModal;
