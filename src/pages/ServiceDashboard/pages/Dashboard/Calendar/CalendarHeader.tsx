import React from 'react';
import { format, setMonth, setYear, getDate, setDate, getDaysInMonth } from 'date-fns';
import { Plus } from 'lucide-react';
import CustomDropdown from '../../../../Dashboard/components/CustomDropdown';

interface CalendarHeaderProps {
    currentDate: Date;
    onDateChange: (date: Date) => void;
    onTodayClick: () => void;
    onAddReminder: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
    currentDate,
    onDateChange,
    onTodayClick,
    onAddReminder,
}) => {
    const months = Array.from({ length: 12 }, (_, i) => ({
        value: i.toString(),
        label: format(new Date(2000, i, 1), 'MMMM'),
    }));

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => {
        const year = currentYear - 5 + i;
        return {
            value: year.toString(),
            label: year.toString(),
        };
    });

    const handleMonthChange = (value: string) => {
        const originalDay = getDate(currentDate);
        const baseDate = setDate(currentDate, 1);
        const newMonthDate = setMonth(baseDate, parseInt(value));
        const allowedDay = Math.min(originalDay, getDaysInMonth(newMonthDate));
        const newDate = setDate(newMonthDate, allowedDay);
        onDateChange(newDate);
    };

    const handleYearChange = (value: string) => {
        const originalDay = getDate(currentDate);
        const baseDate = setDate(currentDate, 1);
        const newYearDate = setYear(baseDate, parseInt(value));
        const allowedDay = Math.min(originalDay, getDaysInMonth(newYearDate));
        const newDate = setDate(newYearDate, allowedDay);
        onDateChange(newDate);
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6 gap-4 md:gap-0">
            <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                <div className="flex w-full md:w-auto gap-3">
                    <div className="flex-1 md:w-40">
                        <CustomDropdown
                            value={currentDate.getMonth().toString()}
                            onChange={handleMonthChange}
                            options={months}
                            buttonClassName="w-full justify-between rounded-full border-green-500 text-green-700 font-medium"
                        />
                    </div>
                    <div className="flex-1 md:w-28">
                        <CustomDropdown
                            value={currentDate.getFullYear().toString()}
                            onChange={handleYearChange}
                            options={years}
                            buttonClassName="w-full justify-between rounded-full border-green-500 text-green-700 font-medium"
                        />
                    </div>
                </div>

                <div className="flex w-full md:w-auto gap-3">
                    <button
                        onClick={onTodayClick}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-[#A4C295] text-white font-medium rounded-full hover:bg-[#7CD755] transition-colors text-center"
                    >
                        Today
                    </button>
                    <button
                        onClick={onAddReminder}
                        className="flex-1 md:flex-none flex justify-center bg-white items-center gap-2 px-4 py-2.5 border border-green-500 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
                    >
                        Add Reminder
                        <Plus size={18} />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default CalendarHeader;
