import React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalButton {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    icon?: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footerButtons?: ModalButton[];
    maxWidth?: string;
    padding?: string;
    showCloseIcon?: boolean;
    headerBorder?: boolean;
    footerBorder?: boolean;
    titleSize?: string;
    className?: string;
}

const BaseModal: React.FC<BaseModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footerButtons,
    maxWidth = "max-w-lg",
    padding = "px-6 py-6",
    showCloseIcon = true,
    headerBorder = true,
    footerBorder = true,
    titleSize = "text-lg",
    className = ""
}) => {
    if (!isOpen) return null;

    const getButtonStyles = (variant: ModalButton['variant']) => {
        switch (variant) {
            case 'primary':
                return "bg-[var(--dashboard-accent)] text-white shadow-md hover:shadow-lg";
            case 'secondary':
                return "bg-white border border-[#E5E7EB] text-[#1A1A1A] hover:bg-gray-50";
            case 'danger':
                return "bg-[#FF4F5B] text-white hover:bg-red-700";
            case 'ghost':
                return "text-gray-700 hover:bg-gray-50";
            default:
                return "bg-[#DDE4EE] text-white border border-white shadow-sm";
        }
    };

    return createPortal(
        <div
            className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200 font-['Urbanist']"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-2xl shadow-xl w-full ${maxWidth} flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 relative overflow-hidden ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`flex items-center justify-between px-6 py-4 ${headerBorder ? 'border-b border-gray-200' : ''}`}>
                    <h2 className={`${titleSize} font-semibold text-gray-900`}>
                        {title}
                    </h2>
                    {showCloseIcon && (
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            aria-label="Close modal"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className={`${padding} overflow-y-auto custom-scrollbar`}>
                    {children}
                </div>

                {/* Footer */}
                {footerButtons && footerButtons.length > 0 && (
                    <div className={`px-6 py-4 ${footerBorder ? 'border-t border-gray-100' : ''} flex justify-end gap-3`}>
                        {footerButtons.map((btn, idx) => (
                            <button
                                key={idx}
                                onClick={btn.onClick}
                                disabled={btn.disabled}
                                className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${getButtonStyles(btn.variant)} ${btn.className || ''}`}
                            >
                                {btn.icon}
                                {btn.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

export default BaseModal;
