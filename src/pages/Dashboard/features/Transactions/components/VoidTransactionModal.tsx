import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';

import { useTransactionStore } from '../store/transactionStore';

interface VoidTransactionModalProps {
    onConfirm?: (reason: string) => void;
}

const VoidTransactionModal: React.FC<VoidTransactionModalProps> = ({ onConfirm }) => {
    const { isVoidModalOpen, setVoidModalOpen } = useTransactionStore();
    const isOpen = isVoidModalOpen;
    const onClose = () => setVoidModalOpen(false);
    const [reason, setReason] = useState('');
    const [reasonError, setReasonError] = useState('');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

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
        // Validate reason is not empty
        const trimmedReason = reason.trim();
        if (!trimmedReason || trimmedReason === '') {
            setReasonError('Please provide a reason for voiding this transaction');
            textareaRef.current?.focus();
            return;
        }

        // Clear any previous errors
        setReasonError('');

        if (onConfirm) {
            onConfirm(trimmedReason);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="bg-white rounded-[1.5rem] w-full max-w-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 relative overflow-hidden flex flex-col mx-4">

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
                <div className="p-8">
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
                            }}
                        />
                        {reasonError && (
                            <p className="text-red-600 text-xs mt-1 ml-1">{reasonError}</p>
                        )}
                    </div>

                    <p className="text-gray-700 text-sm mb-8 leading-relaxed">
                        Voiding a transaction does not delete the invoice or initiate a refund, but it will remove it from your financial statements.
                    </p>

                    <div className="border-t border-gray-100 -mx-8 px-8 pt-6">
                        <button
                            onClick={handleConfirm}
                            className="bg-[#3A6D6C] text-white px-10 py-3 rounded-lg font-medium hover:bg-[#2c5251] transition-colors shadow-lg"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoidTransactionModal;
