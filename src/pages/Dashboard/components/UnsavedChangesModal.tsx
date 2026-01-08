import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface UnsavedChangesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    noBlur?: boolean;
}

const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Unsaved Changes",
    message = "You have unsaved changes. Are you sure you want to leave? Your changes will be lost.",
    confirmText = "Leave without saving",
    cancelText = "Keep editing",
    noBlur = false
}) => {
    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200 ${noBlur ? '' : 'backdrop-blur-sm'}`}>
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[var(--color-primary)]">
                    <div className="flex items-center gap-2 text-white">
                        <AlertTriangle className="w-5 h-5" />
                        <h2 className="text-lg font-bold text-white">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <p className="text-gray-600 font-medium">
                        {message}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50/50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 font-bold text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-white font-bold text-sm bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-sm"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnsavedChangesModal;
