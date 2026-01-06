import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, Paperclip } from 'lucide-react';
import { format, parse } from 'date-fns';
import DatePicker from '@/components/ui/DatePicker';
import PreciseTimePicker from '@/components/ui/PreciseTimePicker';
import SearchableDropdown from '@/components/ui/SearchableDropdown';

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (data: { details: string; date: string; assignee: string }, file?: File | null) => void;
    initialData?: { details: string; date: string; assignee: string; image?: string | null };
    assignees?: string[];
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({
    isOpen,
    onClose,
    onCreate,
    initialData,
    assignees = ['Admin', 'Manager', 'Staff', 'Maintenance']
}) => {
    const [details, setDetails] = useState(initialData?.details || '');
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        initialData?.date ? new Date(initialData.date) : undefined
    );
    const [selectedTime, setSelectedTime] = useState(
        initialData?.date && !isNaN(new Date(initialData.date).getTime())
            ? format(new Date(initialData.date), 'h:mm a')
            : ''
    );

    const [assignee, setAssignee] = useState(initialData?.assignee || '');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [existingFileUrl, setExistingFileUrl] = useState<string | null>(initialData?.image || null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const modalRef = React.useRef<HTMLDivElement>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const returnFocusRef = React.useRef<HTMLElement | null>(null);

    // Effect 1: Initialize form data when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setDetails(initialData.details);
                const dateObj = new Date(initialData.date);
                if (!isNaN(dateObj.getTime())) {
                    setSelectedDate(dateObj);
                    setSelectedTime(format(dateObj, 'h:mm a'));
                } else {
                    setSelectedDate(undefined);
                    setSelectedTime('');
                }
                setAssignee(initialData.assignee);
                setExistingFileUrl(initialData.image || null);
                setSelectedFile(null);
            } else {
                setDetails('');
                setSelectedDate(undefined);
                setSelectedTime('');
                setAssignee('');
                setExistingFileUrl(null);
                setSelectedFile(null);
            }
        }
    }, [isOpen, initialData?.details, initialData?.date, initialData?.assignee, initialData?.image]);

    // Effect 2: Handle keyboard events and focus management
    useEffect(() => {
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
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleCreate = () => {
        if (!selectedDate || !selectedTime) {
            alert('Please select both date and time');
            return;
        }

        if (!assignee) {
            alert('Please select an assignee');
            return;
        }

        try {
            // Parse time string and combine with date
            const timeDate = parse(selectedTime, 'h:mm a', selectedDate);
            const dateString = format(timeDate, "yyyy-MM-dd'T'HH:mm");

            onCreate({ details, date: dateString, assignee }, selectedFile);

            // Clear form
            setDetails('');
            setSelectedDate(undefined);
            setSelectedTime('');
            setAssignee('');
            setSelectedFile(null);
            onClose();
        } catch (error) {
            console.error('Error processing date/time:', error);
            alert('Invalid date or time');
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
                className="bg-white rounded-3xl w-full max-w-[95%] sm:max-w-2xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-visible mx-4"
            >
                {/* Header */}
                <div className="bg-[#3E706F] px-5 py-3 flex items-center justify-between text-white relative rounded-t-3xl">
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
                <div className="p-4 sm:p-6 bg-[#F8FAFC] rounded-b-3xl">
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
                        <div className="space-y-1.5 col-span-1 md:col-span-2">
                            <label className="block text-xs font-bold text-[#1A1A1A]">Select Date & Time *</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <DatePicker
                                    value={selectedDate}
                                    onChange={setSelectedDate}
                                    placeholder="Select date"
                                    className="w-full"
                                    popoverClassName="z-[110]"
                                />
                                <PreciseTimePicker
                                    value={selectedTime}
                                    onChange={setSelectedTime}
                                    placeholder="Select time"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Assign to */}
                        <div className="space-y-1.5 col-span-1 md:col-span-2">
                            <SearchableDropdown
                                label="Assign to *"
                                value={assignee}
                                onChange={setAssignee}
                                options={assignees}
                                placeholder="Search user..."
                                className="w-full"
                                buttonClassName="w-full flex items-center justify-between bg-white border border-gray-200 px-4 py-3 rounded-md text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-[#84CC16]/20"
                            />
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
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*,.pdf,.doc,.docx"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full sm:w-auto bg-[#4F5867] text-white px-6 py-2.5 rounded-lg font-bold shadow-lg hover:bg-[#3f4753] transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
                            >
                                Upload File
                            </button>
                            <button
                                onClick={handleCreate}
                                className="w-full sm:w-auto bg-[#3E706F] text-white px-8 py-2.5 rounded-lg font-bold shadow-lg hover:bg-[#2c5251] transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
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

export default AddTaskModal;
