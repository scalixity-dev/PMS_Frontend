import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronDown } from 'lucide-react';

interface Listing {
    id: string | number;
    title: string;
}

interface InviteToApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (email: string, listing: string) => void;
    initialEmail?: string;
    listings?: Listing[];
}

const InviteToApplyModal: React.FC<InviteToApplyModalProps> = ({
    isOpen,
    onClose,
    onSend,
    initialEmail = '',
    listings = []
}) => {
    const [email, setEmail] = useState(initialEmail);
    const [listing, setListing] = useState('');
    const modalRef = React.useRef<HTMLDivElement>(null);
    const initialFocusRef = React.useRef<HTMLSelectElement>(null);
    const returnFocusRef = React.useRef<HTMLElement | null>(null);

    React.useEffect(() => {
        if (isOpen) {
            setEmail(initialEmail);
            setListing('');
            returnFocusRef.current = document.activeElement as HTMLElement;
            // Short delay to ensure modal is rendered and animations are starting
            setTimeout(() => initialFocusRef.current?.focus(), 100);

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    onClose();
                }

                if (e.key === 'Tab' && modalRef.current) {
                    const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    const firstElement = focusableElements[0];
                    const lastElement = focusableElements[focusableElements.length - 1];

                    if (e.shiftKey) {
                        if (document.activeElement === firstElement) {
                            lastElement.focus();
                            e.preventDefault();
                        }
                    } else {
                        if (document.activeElement === lastElement) {
                            firstElement.focus();
                            e.preventDefault();
                        }
                    }
                }
            };

            window.addEventListener('keydown', handleKeyDown);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                returnFocusRef.current?.focus();
            };
        }
    }, [isOpen, initialEmail, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 animate-in fade-in duration-300"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="invite-modal-title"
                className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden mx-4"
            >
                {/* Header */}
                <div className="bg-[#3E706F] px-5 py-3 flex items-center justify-between text-white relative">
                    <button
                        onClick={onClose}
                        aria-label="Back"
                        className="hover:bg-white/10 p-1 rounded-full transition-colors z-10"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span id="invite-modal-title" className="absolute left-1/2 -translate-x-1/2 text-lg font-bold font-outfit">Invite to Apply</span>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="hover:bg-white/10 p-1 rounded-full transition-colors z-10"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 bg-[#F8FAFC]">
                    <div className="flex flex-col gap-5">
                        {/* Select Listing */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-[#1A1A1A]">Select listings *</label>
                            <div className="relative">
                                <div className="flex items-center w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 has-[:focus]:border-[#3E706F] transition-colors">
                                    <select
                                        ref={initialFocusRef}
                                        value={listing}
                                        onChange={(e) => setListing(e.target.value)}
                                        className="w-full bg-transparent outline-none text-gray-700 text-sm font-medium placeholder-gray-400 appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select a listing</option>
                                        {listings.map((l) => (
                                            <option key={l.id} value={l.title}>{l.title}</option>
                                        ))}
                                        {listings.length === 0 && (
                                            <option value="" disabled>No listings available</option>
                                        )}
                                    </select>
                                    <ChevronDown className="absolute right-4 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-[#1A1A1A]">Type applicant's email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email address"
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#3E706F] transition-colors text-gray-700 text-sm font-medium placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 mt-8 pt-6 flex items-center justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="bg-white text-[#4B5563] px-6 py-2.5 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onSend(email, listing);
                                onClose();
                            }}
                            className="bg-[#3E706F] text-white px-8 py-2.5 rounded-xl font-bold shadow-lg hover:bg-[#2c5251] transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
                        >
                            Send invitation
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default InviteToApplyModal;
