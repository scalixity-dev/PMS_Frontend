import React from 'react';
import { createPortal } from 'react-dom';
import { X, Check } from 'lucide-react';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onSave: () => void;
    children: React.ReactNode;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, title, onSave, children }) => {
    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 bg-black/20  z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200 font-['Urbanist']"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 overflow-y-auto custom-scrollbar">
                    {children}
                </div>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 border border-transparent transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="px-6 py-2.5 rounded-lg text-white font-medium text-sm bg-[#7CD947] border border-white shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
                    >
                        <Check size={16} strokeWidth={3} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default EditProfileModal;
