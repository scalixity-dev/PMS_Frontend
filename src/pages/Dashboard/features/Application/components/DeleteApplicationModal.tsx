import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface DeleteApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
}

const DeleteApplicationModal: React.FC<DeleteApplicationModalProps> = ({ isOpen, onClose, onDelete }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-slide-in-from-bottom-8 relative overflow-hidden flex flex-col font-sans">

                {/* Header */}
                <div className="bg-red-600 p-5 flex items-center justify-between text-white rounded-t-2xl">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={20} />
                        <h2 className="text-lg font-medium">Delete Application</h2>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    <p className="text-gray-700 text-sm mb-8 leading-relaxed">
                        Are you sure you want to delete this application? This action cannot be undone and all associated data will be permanently removed.
                    </p>

                    {/* Footer Buttons */}
                    <div className="flex items-center gap-4 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-[#4A5568] text-white py-3 rounded-xl font-medium hover:bg-[#2D3748] transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onDelete();
                                onClose();
                            }}
                            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 transition-colors shadow-sm"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteApplicationModal;
