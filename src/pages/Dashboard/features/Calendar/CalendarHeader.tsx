import React from 'react';
import { format, setMonth, setYear } from 'date-fns';
import { Plus } from 'lucide-react';
import CustomDropdown from '../../components/CustomDropdown';

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
        const newDate = setMonth(currentDate, parseInt(value));
        onDateChange(newDate);
    };

    const handleYearChange = (value: string) => {
        const newDate = setYear(currentDate, parseInt(value));
        onDateChange(newDate);
    };

    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="w-40">
                    <CustomDropdown
                        value={currentDate.getMonth().toString()}
                        onChange={handleMonthChange}
                        options={months}
                        buttonClassName="rounded-full border-green-500 text-green-700 font-medium"
                    />
                </div>
                <div className="w-28">
                    <CustomDropdown
                        value={currentDate.getFullYear().toString()}
                        onChange={handleYearChange}
                        options={years}
                        buttonClassName="rounded-full border-green-500 text-green-700 font-medium"
                    />
                </div>
                <button
                    onClick={onTodayClick}
                    className="px-6 py-2.5 bg-[#86efac] text-white font-medium rounded-full hover:bg-green-500 transition-colors"
                >
                    Today
                </button>
                <button
                    onClick={onAddReminder}
                    className="flex items-center gap-2 px-4 py-2.5 border border-green-500 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
                >
                    Add Reminder
                    <Plus size={18} />
                </button>
            </div>

            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-green-500 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors">
                    Property & Units
                    <Plus size={16} />
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-green-500 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors">
                    Events Type
                    <Plus size={16} />
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-green-500 text-gray-700 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors">
                    Frequency
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
};

export default CalendarHeader;
