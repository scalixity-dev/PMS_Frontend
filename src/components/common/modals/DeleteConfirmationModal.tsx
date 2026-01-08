import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: React.ReactNode;
    itemName?: string;
    confirmText?: string;
    confirmButtonClass?: string;
    headerClassName?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Delete Item',
    message,
    itemName,
    confirmText = 'Delete',
    confirmButtonClass = 'bg-red-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-sm',
    headerClassName = 'bg-red-600'
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white w-full max-w-[95%] sm:max-w-sm rounded-[1.5rem] sm:rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className={`${headerClassName} px-6 py-4 flex items-center justify-between shadow-sm`}>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-white" />
                        <h2 className="text-lg font-bold text-white">{title}</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6">
                    <p className="text-gray-600 mb-6 text-center text-sm sm:text-base">
                        {message || (
                            <>
                                Are you sure you want to delete <span className="font-bold text-gray-800">{itemName || 'this item'}</span>?
                                <br />This action cannot be undone.
                            </>
                        )}
                    </p>

                    {/* Footer / Action */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition-colors order-2 sm:order-1"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 ${confirmButtonClass} order-1 sm:order-2`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
