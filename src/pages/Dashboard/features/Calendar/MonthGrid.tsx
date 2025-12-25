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
import { getReminderColor } from './calendarUtils';

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

    const dayList = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

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
                            className={`min-h-[120px] border-b border-r border-gray-100 p-2 text-left transition-colors hover:bg-gray-50
                 ${!isCurrentMonth ? 'bg-gray-50/50 text-gray-400' : 'bg-white text-gray-900'}
                 ${index % 7 === 6 ? 'border-r-0' : ''}
                 ${isDayToday ? 'today-cell' : ''}
               `}
                        >
                            <span
                                className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium
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
                        </div>
                    );
                })}
            </div>

            {/* Reminder Detail Modal */}
            <ReminderDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                reminder={selectedReminder}
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
        </div>
    );
};

export default MonthGrid;
