import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronDown, Paperclip } from 'lucide-react';

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: { details: string; date: string; assignee: string }, file?: File | null) => void;
    initialData?: { details: string; date: string; assignee: string; image?: string | null };
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onCreate, initialData }) => {
    const [details, setDetails] = useState(initialData?.details || '');
    const [date, setDate] = useState(initialData?.date || '');
    const [assignee, setAssignee] = useState(initialData?.assignee || '');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [existingFileUrl, setExistingFileUrl] = useState<string | null>(initialData?.image || null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const modalRef = React.useRef<HTMLDivElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const returnFocusRef = React.useRef<HTMLElement | null>(null);

    // Effect 1: Initialize form data when modal opens
    React.useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setDetails(initialData.details);
                setDate(initialData.date);
                setAssignee(initialData.assignee);
                setExistingFileUrl(initialData.image || null);
                setSelectedFile(null);
            } else {
                setDetails('');
                setDate('');
                setAssignee('');
                setExistingFileUrl(null);
                setSelectedFile(null);
            }
        }
    }, [isOpen]); // Only run when modal opens/closes, not when initialData changes

    // Effect 2: Handle keyboard events and focus management
    React.useEffect(() => {
        if (!isOpen) return;

        // Save the element that had focus before modal opened
        returnFocusRef.current = document.activeElement as HTMLElement;

        // Focus the textarea after a short delay
        const focusTimeout = setTimeout(() => textareaRef.current?.focus(), 100);

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

        // Cleanup: restore focus when modal closes
        return () => {
            clearTimeout(focusTimeout);
            window.removeEventListener('keydown', handleKeyDown);
            // Restore focus to the element that had focus before modal opened
            returnFocusRef.current?.focus();
        };
    }, [isOpen, onClose]); // onClose is stable, won't cause unnecessary re-runs

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
                aria-labelledby="task-modal-title"
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
                    <span id="task-modal-title" className="absolute left-1/2 -translate-x-1/2 text-lg font-bold font-outfit">Task</span>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {/* Date & Time */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-[#1A1A1A]">Select Date & Time *</label>
                            <div className="relative">
                                <input
                                    type="datetime-local"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#3E706F] transition-colors text-gray-700 text-sm font-medium placeholder-gray-400 appearance-none cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Assign to */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-[#1A1A1A]">Assign to *</label>
                            <div className="relative">
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Type here"
                                        value={assignee}
                                        onChange={(e) => setAssignee(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#3E706F] transition-colors text-gray-700 text-sm font-medium placeholder-gray-400"
                                    />
                                    <ChevronDown className="absolute right-4 text-gray-400 pointer-events-none" size={16} />
                                </div>
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
                                    aria-label="Remove file"
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
                                    onCreate({ details, date, assignee }, selectedFile);
                                    setDetails('');
                                    setDate('');
                                    setAssignee('');
                                    setSelectedFile(null);
                                    onClose();
                                }}
                                className="bg-[#3E706F] text-white px-8 py-2.5 rounded-lg font-bold shadow-lg hover:bg-[#2c5251] transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddTaskModal;
