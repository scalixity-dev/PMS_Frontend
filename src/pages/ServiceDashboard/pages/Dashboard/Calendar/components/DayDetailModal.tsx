import React, { useEffect, useRef } from 'react';
import { X, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { type Reminder } from '../Calendar';
import { getReminderColor } from '../calendarUtils';

interface DayDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    date: Date;
    reminders: Reminder[];
    onReminderClick: (reminder: Reminder) => void;
}

const DayDetailModal: React.FC<DayDetailModalProps> = ({ isOpen, onClose, date, reminders, onReminderClick }) => {
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Focus management and background scrolling
    useEffect(() => {
        if (isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement;
            document.body.style.overflow = 'hidden';
            // Use setTimeout to ensure the modal is rendered before focusing
            const timer = setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 50);
            return () => clearTimeout(timer);
        } else {
            document.body.style.overflow = 'unset';
            previousFocusRef.current?.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="day-detail-header"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="bg-white rounded-[2rem] w-[95%] sm:w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden flex flex-col max-h-[80vh]"
            >
                {/* Header */}
                <div className="bg-[#3A6D6C] p-4 sm:p-6 flex items-center justify-between text-white flex-shrink-0">
                    <div>
                        <h2 id="day-detail-header" className="text-xl font-bold truncate pr-4">
                            {format(date, 'd MMMM')}
                        </h2>
                        <p className="text-white/80 text-sm font-medium">
                            {format(date, 'EEEE, yyyy')}
                        </p>
                    </div>
                    <button
                        ref={closeButtonRef}
                        onClick={onClose}
                        aria-label="Close"
                        className="hover:bg-white/10 p-2 rounded-full transition-colors flex-shrink-0"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {reminders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <Calendar size={48} className="mb-4 opacity-50" />
                            <p className="text-sm font-medium">No reminders for this day</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {reminders.map((reminder) => (
                                <button
                                    key={reminder.id}
                                    onClick={() => onReminderClick(reminder)}
                                    className={`w-full text-left p-3 rounded-md border cursor-pointer hover:shadow-md transition-all group relative overflow-hidden
                                        ${getReminderColor(reminder.id)}`}
                                >
                                    <div className="flex items-start gap-3 relative z-10">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-sm truncate mb-0.5 opacity-90 group-hover:opacity-100">
                                                {reminder.title}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs font-medium opacity-75">
                                                <span>{reminder.time || 'All day'}</span>
                                                {reminder.property && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="truncate">{reminder.property}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DayDetailModal;
