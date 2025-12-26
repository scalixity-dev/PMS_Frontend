import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    fileName?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    fileName
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white w-full max-w-sm rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-[var(--color-primary)] px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-white" />
                        <h2 className="text-lg font-bold text-white">Delete File</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-gray-600 mb-6 text-center">
                        Are you sure you want to delete <span className="font-bold text-gray-800">{fileName || 'this file'}</span>?
                        <br />This action cannot be undone.
                    </p>

                    {/* Footer / Action */}
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 bg-[var(--color-primary)] text-white px-4 py-2.5 rounded-lg font-bold hover:bg-[#b71c1c] transition-colors shadow-sm"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
