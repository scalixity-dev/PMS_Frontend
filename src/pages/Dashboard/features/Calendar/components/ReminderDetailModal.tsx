import React, { useRef, useEffect, useCallback } from 'react';
import { X, Calendar, Clock, Building2, FileText, User, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { type Reminder } from '../Calendar';

interface ReminderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit?: (reminder: Reminder) => void;
    onDelete?: (reminder: Reminder) => void;
    reminder: Reminder | null;
}

const ReminderDetailModal: React.FC<ReminderDetailModalProps> = ({ isOpen, onClose, onEdit, onDelete, reminder }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    // Handle Escape key and manage body scroll
    useEffect(() => {
        if (isOpen) {
            // Store the previously focused element
            previousActiveElement.current = document.activeElement as HTMLElement;
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Focus trap implementation
    const handleFocusTrap = useCallback((event: KeyboardEvent) => {
        if (event.key !== 'Tab' || !modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
            // Shift + Tab: moving backwards
            if (document.activeElement === firstElement) {
                event.preventDefault();
                lastElement?.focus();
            }
        } else {
            // Tab: moving forwards
            if (document.activeElement === lastElement) {
                event.preventDefault();
                firstElement?.focus();
            }
        }
    }, []);

    // Set up focus trap and initial focus
    useEffect(() => {
        if (isOpen && modalRef.current) {
            // Focus the first focusable element
            const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }

            document.addEventListener('keydown', handleFocusTrap);
        }

        return () => {
            document.removeEventListener('keydown', handleFocusTrap);
            // Restore focus to previously focused element when modal closes
            if (previousActiveElement.current && !isOpen) {
                previousActiveElement.current.focus();
            }
        };
    }, [isOpen, handleFocusTrap]);

    if (!isOpen || !reminder) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reminder-modal-title"
        >
            <div
                ref={modalRef}
                className="bg-white rounded-[2rem] w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="bg-[#3A6D6C] p-6 flex items-center justify-between text-white flex-shrink-0">
                    <h2 id="reminder-modal-title" className="text-xl font-bold truncate pr-4">Reminder details</h2>
                    <button
                        onClick={onClose}
                        className="hover:bg-white/10 p-2 rounded-full transition-colors flex-shrink-0"
                        aria-label="Close reminder details"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-8 overflow-y-auto flex-1">
                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Title</label>
                            <p className="text-xl font-bold text-gray-800 leading-tight">{reminder.title}</p>
                        </div>

                        {/* Date */}
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-[#3A6D6C]">
                                <Calendar size={20} aria-hidden="true" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Date</label>
                                <p className="font-semibold text-gray-700">
                                    {format(reminder.date, 'EEEE, d MMMM yyyy')}
                                </p>
                            </div>
                        </div>

                        {/* Time & Assignee Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-[#3A6D6C]">
                                    <Clock size={20} aria-hidden="true" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Time</label>
                                    <p className="font-semibold text-gray-700">{reminder.time || 'All day'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-[#3A6D6C]">
                                    <User size={20} aria-hidden="true" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Assignee</label>
                                    <p className="font-semibold text-gray-700">{reminder.assigneeName || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Property */}
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-[#3A6D6C]">
                                <Building2 size={20} aria-hidden="true" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Property</label>
                                <p className="font-semibold text-gray-700">{reminder.property || 'N/A'}</p>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-[#3A6D6C]">
                                <FileText size={20} aria-hidden="true" />
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Details</label>
                                <p className="font-semibold text-gray-700 whitespace-pre-wrap">{reminder.details || 'No details provided'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-8 pt-4 flex gap-3 flex-shrink-0 bg-white border-t border-gray-100">
                    <button
                        onClick={() => {
                            if (onEdit && reminder) {
                                onEdit(reminder);
                            }
                        }}
                        className="flex-1 bg-blue-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg flex items-center justify-center gap-2"
                        aria-label="Edit reminder"
                    >
                        <Edit size={16} />
                        Edit
                    </button>
                    <button
                        onClick={() => {
                            if (onDelete && reminder) {
                                onDelete(reminder);
                            }
                        }}
                        className="flex-1 bg-red-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors shadow-lg flex items-center justify-center gap-2"
                        aria-label="Delete reminder"
                    >
                        <Trash2 size={16} />
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-[#3A6D6C] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#2c5251] transition-colors shadow-lg"
                        aria-label="Close reminder details"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReminderDetailModal;

