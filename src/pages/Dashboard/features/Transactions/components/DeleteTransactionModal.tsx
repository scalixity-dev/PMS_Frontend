import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

import { useTransactionStore } from '../store/transactionStore';

interface DeleteTransactionModalProps {
    onConfirm: () => void;
    isLoading?: boolean;
}

const DeleteTransactionModal: React.FC<DeleteTransactionModalProps> = ({
    onConfirm,
    isLoading = false,
}) => {
    const { isDeleteTransactionOpen, setDeleteTransactionOpen } = useTransactionStore();
    const isOpen = isDeleteTransactionOpen;
    const onClose = () => setDeleteTransactionOpen(false);
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                {/* Header */}
                <div className="flex bg-[#3A6D6C] items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-6 h-6 text-white" />
                        <h3 className="text-lg font-semibold text-white">Delete transaction</h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-white hover:text-white/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-700 mb-6 leading-relaxed">
                        Deleting a transaction means it will be deleted from your accounting and from payer's portals if this transaction is shared.
                    </p>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 py-3 px-6 bg-[#5F6D7E] text-white rounded-lg font-medium hover:bg-[#4a5563] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="flex-1 py-3 px-6 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteTransactionModal;
