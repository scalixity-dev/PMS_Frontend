import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, Paperclip } from 'lucide-react';

interface AddMeetingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: { details: string; date: string }, file?: File | null) => void;
    initialData?: { details: string; date: string; image?: string | null };
}

const AddMeetingModal: React.FC<AddMeetingModalProps> = ({ isOpen, onClose, onCreate, initialData }) => {
    const [details, setDetails] = useState(initialData?.details || '');
    const [date, setDate] = useState(initialData?.date || '');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [existingFileUrl, setExistingFileUrl] = useState<string | null>(initialData?.image || null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const modalRef = React.useRef<HTMLDivElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const returnFocusRef = React.useRef<HTMLElement | null>(null);

    React.useEffect(() => {
        if (isOpen) {
            returnFocusRef.current = document.activeElement as HTMLElement;
            // Short delay to ensure modal is rendered and animations are starting
            setTimeout(() => textareaRef.current?.focus(), 100);

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

            if (initialData) {
                setDetails(initialData.details);
                setDate(initialData.date);
                setExistingFileUrl(initialData.image || null);
                setSelectedFile(null);
            } else {
                setDetails('');
                setDate('');
                setExistingFileUrl(null);
                setSelectedFile(null);
            }

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                returnFocusRef.current?.focus();
            };
        }
    }, [isOpen, initialData, onClose]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

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
                aria-labelledby="meeting-modal-title"
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
                    <span id="meeting-modal-title" className="absolute left-1/2 -translate-x-1/2 text-lg font-bold font-outfit">Log a meeting</span>
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
                    {/* Textarea */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-3 shadow-sm min-h-[120px] flex flex-col mb-6">
                        <textarea
                            ref={textareaRef}
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder="Add some details*"
                            className="w-full flex-1 resize-none outline-none text-gray-700 font-medium placeholder-gray-400 p-2 text-sm"
                        />
                    </div>

                    {/* Inputs Row */}
                    <div className="grid grid-cols-1 gap-4 mb-8">
                        {/* Date & Time */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-[#1A1A1A]">Select Date & Time *</label>
                            <div className="relative">
                                <input
                                    type="datetime-local"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#3E706F] transition-colors text-gray-700 text-sm font-medium placeholder-gray-400 cursor-text [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6 -mx-6 px-6 flex flex-col gap-4">
                        {(selectedFile || existingFileUrl) && (
                            <div className="flex items-center gap-2 bg-[#EAF5E8] px-3 py-1.5 rounded-lg text-xs text-[#3E706F] font-bold border border-[#D1E2CF] self-start animate-in slide-in-from-left-2">
                                <Paperclip size={14} />
                                <span className="truncate max-w-[150px]">{selectedFile ? selectedFile.name : 'Existing Attachment'}</span>
                                <button
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setExistingFileUrl(null);
                                    }}
                                    aria-label="Remove attachment"
                                    className="ml-2 hover:text-red-500"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*,.pdf,.doc,.docx"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-[#4F5867] text-white px-6 py-2.5 rounded-lg font-bold shadow-lg hover:bg-[#3f4753] transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
                            >
                                Upload File
                            </button>
                            <button
                                onClick={() => {
                                    onCreate({ details, date }, selectedFile);
                                    setDetails('');
                                    setDate('');
                                    setSelectedFile(null);
                                    onClose();
                                }}
                                className="bg-[#3E706F] text-white px-8 py-2.5 rounded-lg font-bold shadow-lg hover:bg-[#2c5251] transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
                            >
                                {initialData ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddMeetingModal;
