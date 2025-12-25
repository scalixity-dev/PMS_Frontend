import React from 'react';
import { X, Calendar, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { type Reminder } from '../Calendar';

interface ReminderDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    reminder: Reminder | null;
}

const ReminderDetailModal: React.FC<ReminderDetailModalProps> = ({ isOpen, onClose, reminder }) => {
    // Prevent background scrolling
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !reminder) return null;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
                {/* Header */}
                <div className="bg-[#3A6D6C] p-6 flex items-center justify-between text-white">
                    <h2 className="text-xl font-bold truncate pr-4">Reminder details</h2>
                    <button
                        onClick={onClose}
                        className="hover:bg-white/10 p-2 rounded-full transition-colors flex-shrink-0"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        {/* Title */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">Title</label>
                            <p className="text-xl font-bold text-gray-800 leading-tight">{reminder.title}</p>
                        </div>

                        {/* Date */}
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="p-2 bg-white rounded-lg shadow-sm text-[#3A6D6C]">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Date</label>
                                <p className="font-semibold text-gray-700">
                                    {format(reminder.date, 'EEEE, d MMMM yyyy')}
                                </p>
                            </div>
                        </div>

                        {/* Time & Type Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-[#3A6D6C]">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Time</label>
                                    <p className="font-semibold text-gray-700">{reminder.time || 'All day'}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-[#3A6D6C]">
                                    <Tag size={20} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Type</label>
                                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mt-1 uppercase
                                        ${reminder.type === 'maintenance' ? 'bg-red-100 text-red-700' :
                                            reminder.type === 'viewing' ? 'bg-blue-100 text-blue-700' :
                                                reminder.type === 'meeting' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-gray-200 text-gray-700'
                                        }`}>
                                        {reminder.type}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            onClick={onClose}
                            className="w-full bg-[#3A6D6C] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#2c5251] transition-colors shadow-lg"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReminderDetailModal;
