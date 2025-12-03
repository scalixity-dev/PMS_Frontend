import React from 'react';
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

interface MonthGridProps {
    month: Date;
    reminders: Reminder[];
}

const MonthGrid: React.FC<MonthGridProps> = ({ month, reminders }) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const dayList = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    return (
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
            {/* Month Label (Optional, maybe sticky?) */}
            {/* <div className="p-4 font-bold text-lg border-b border-gray-200">
        {format(month, 'MMMM yyyy')}
      </div> */}

            <div className="grid grid-cols-7 text-center">
                {dayList.map((dayItem, index) => {
                    // We only want to render the grid, not the headers every time if we are stacking them.
                    // However, for a continuous scroll, usually we just stack the days.
                    // But wait, the design shows a single header for the whole view?
                    // Or does it repeat? The prompt says "scrollable, it should be on the current month but if we scroll up... then the next months should be shown".
                    // Usually infinite scroll calendars have headers per month or a sticky header.
                    // The design shows one header at the top.
                    // If I stack MonthGrids, the days must align perfectly.
                    // So I should NOT render the week headers in MonthGrid, but in the main Calendar component.

                    const isCurrentMonth = isSameMonth(dayItem, monthStart);
                    const isDayToday = isToday(dayItem);

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
                                {reminders
                                    .filter((reminder) => isSameMonth(reminder.date, monthStart) && getDate(reminder.date) === getDate(dayItem))
                                    .map((reminder) => (
                                        <div
                                            key={reminder.id}
                                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium truncate
                                                ${reminder.type === 'maintenance' ? 'bg-red-50 text-red-700 border border-red-100' :
                                                    reminder.type === 'viewing' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                        reminder.type === 'meeting' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                                            'bg-gray-50 text-gray-700 border border-gray-100'
                                                }`}
                                        >
                                            {reminder.time} {reminder.title}
                                        </div>
                                    ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MonthGrid;
