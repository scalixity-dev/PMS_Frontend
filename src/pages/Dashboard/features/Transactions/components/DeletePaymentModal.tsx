import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

import { useTransactionStore } from '../store/transactionStore';

interface DeletePaymentModalProps {
    onConfirm: () => void;
    isLoading?: boolean;
}

const DeletePaymentModal: React.FC<DeletePaymentModalProps> = ({
    onConfirm,
    isLoading = false,
}) => {
    const { isDeleteModalOpen, setDeleteModalOpen, selectedPayment } = useTransactionStore();
    const isOpen = isDeleteModalOpen;
    const onClose = () => setDeleteModalOpen(false);
    const paymentDate = selectedPayment?.date || '';
    const paymentAmount = selectedPayment?.amount || '';
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex bg-[var(--color-primary)] rounded-t-2xl items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Delete Payment</h3>
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
                    <p className="text-gray-700 mb-4">
                        Are you sure you want to delete this payment
                        {paymentDate && paymentAmount && (
                            <span className="font-semibold text-gray-900"> of {paymentAmount} on {paymentDate}</span>
                        )}
                        ?
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                        This action cannot be undone. The payment record will be permanently removed from the transaction history.
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete Payment'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeletePaymentModal;
