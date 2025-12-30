import React, { useState } from 'react';
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    isSameMonth,
    isToday,
    getDate,
} from 'date-fns';

import { type Reminder } from './Calendar';
import ReminderDetailModal from './components/ReminderDetailModal';
import DayDetailModal from './components/DayDetailModal';
import AddReminderModal from './components/AddReminderModal';
import { getReminderColor } from './calendarUtils';
import { useDeleteReminder } from '../../../../hooks/useReminderQueries';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface MonthGridProps {
    month: Date;
    reminders: Reminder[];
}

const MonthGrid: React.FC<MonthGridProps> = ({ month, reminders }) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // State for DayDetailModal
    const [selectedDayDate, setSelectedDayDate] = useState<Date | null>(null);
    const [dayReminders, setDayReminders] = useState<Reminder[]>([]);
    const [isDayDetailModalOpen, setIsDayDetailModalOpen] = useState(false);

    // State for Edit Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [reminderToEdit, setReminderToEdit] = useState<Reminder | null>(null);

    // State for Delete Confirmation
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [reminderToDelete, setReminderToDelete] = useState<Reminder | null>(null);

    // Delete mutation
    const deleteReminderMutation = useDeleteReminder();

    const dayList = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    // Handle Edit
    const handleEdit = (reminder: Reminder) => {
        setReminderToEdit(reminder);
        setIsDetailModalOpen(false);
        setIsEditModalOpen(true);
    };

    // Handle Delete
    const handleDelete = (reminder: Reminder) => {
        setReminderToDelete(reminder);
        setIsDeleteModalOpen(true);
    };

    // Confirm Delete
    const confirmDelete = async () => {
        if (reminderToDelete) {
            try {
                await deleteReminderMutation.mutateAsync(reminderToDelete.id);
                setIsDeleteModalOpen(false);
                setIsDetailModalOpen(false);
                setReminderToDelete(null);
            } catch (error) {
                console.error('Failed to delete reminder:', error);
            }
        }
    };

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
            <div className="grid grid-cols-7 text-center">
                {dayList.map((dayItem, index) => {
                    const isCurrentMonth = isSameMonth(dayItem, monthStart);
                    const isDayToday = isToday(dayItem);

                    // Filter reminders for this day
                    const daysReminders = reminders.filter(
                        (reminder) =>
                            isSameMonth(reminder.date, monthStart) &&
                            getDate(reminder.date) === getDate(dayItem)
                    );

                    // Logic for visible reminders (max 2) + overflow
                    const MAX_VISIBLE_REMINDERS = 2;
                    const visibleReminders = daysReminders.slice(0, MAX_VISIBLE_REMINDERS);
                    const hiddenCount = daysReminders.length - MAX_VISIBLE_REMINDERS;

                    return (
                        <div
                            key={dayItem.toString()}
                            className={`min-h-[120px] border-b border-r border-gray-100 p-2 text-left transition-colors
                 ${!isCurrentMonth ? 'bg-gray-50/50' : 'bg-white hover:bg-gray-50'}
                 ${index % 7 === 6 ? 'border-r-0' : ''}
                 ${isDayToday ? 'today-cell' : ''}
               `}
                        >
                            {/* Only show content for current month dates */}
                            {isCurrentMonth && (
                                <>
                                    <span
                                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium text-gray-900
                   ${isDayToday ? 'bg-green-500 text-white' : ''}
                 `}
                                    >
                                        {format(dayItem, 'd')}
                                    </span>

                                    {/* Reminders */}
                                    <div className="mt-1 space-y-1">
                                        {visibleReminders.map((reminder) => (
                                            <div
                                                key={reminder.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedReminder(reminder);
                                                    setIsDetailModalOpen(true);
                                                }}
                                                className={`px-1.5 py-0.5 rounded text-[10px] font-medium truncate border cursor-pointer hover:opacity-80 transition-opacity
                                                ${getReminderColor(reminder.id)}`}
                                            >
                                                {reminder.time} {reminder.title}
                                            </div>
                                        ))}

                                        {hiddenCount > 0 && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedDayDate(dayItem);
                                                    setDayReminders(daysReminders);
                                                    setIsDayDetailModalOpen(true);
                                                }}
                                                className="w-full px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors text-center"
                                            >
                                                +{hiddenCount} more
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Reminder Detail Modal */}
            <ReminderDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                reminder={selectedReminder}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {/* Day Detail Modal (for overflow) */}
            {selectedDayDate && (
                <DayDetailModal
                    isOpen={isDayDetailModalOpen}
                    onClose={() => setIsDayDetailModalOpen(false)}
                    date={selectedDayDate}
                    reminders={dayReminders}
                    onReminderClick={(reminder) => {
                        // Using setTimeout to ensure smooth transition if needed, but synchronous is fine
                        setSelectedReminder(reminder);
                        setIsDetailModalOpen(true);
                    }}
                />
            )}

            {/* Edit Reminder Modal */}
            <AddReminderModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setReminderToEdit(null);
                }}
                editReminder={reminderToEdit}
                mode="edit"
            />

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="bg-red-500 p-4 flex items-center justify-between text-white">
                            <div className="flex items-center gap-2">
                                <AlertTriangle size={20} className="stroke-2" />
                                <span className="font-semibold">Delete Reminder?</span>
                            </div>
                            <button
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setReminderToDelete(null);
                                }}
                                className="hover:bg-white/10 p-1 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 text-center">
                            <p className="text-gray-700 mb-2">
                                Are you sure you want to delete this reminder?
                            </p>
                            {reminderToDelete && (
                                <p className="text-gray-900 font-semibold mb-6">
                                    "{reminderToDelete.title}"
                                </p>
                            )}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setReminderToDelete(null);
                                    }}
                                    disabled={deleteReminderMutation.isPending}
                                    className="flex-1 bg-gray-200 text-gray-800 py-2.5 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={deleteReminderMutation.isPending}
                                    className="flex-1 bg-red-500 text-white py-2.5 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    {deleteReminderMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MonthGrid;

