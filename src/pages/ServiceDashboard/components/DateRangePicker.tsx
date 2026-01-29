import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Calendar } from '../../../components/ui/calendar';
import { cn } from '../../../lib/utils';

interface DateRangePickerProps {
    dateRange: DateRange | undefined;
    onDateRangeChange: (range: DateRange | undefined) => void;
    className?: string;
    placeholder?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    dateRange,
    onDateRangeChange,
    className,
    placeholder = "Pick a date range"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [numberOfMonths, setNumberOfMonths] = useState(2);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside & Handle Resize
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        const handleResize = () => {
            if (window.innerWidth < 768) {
                setNumberOfMonths(1);
            } else {
                setNumberOfMonths(2);
            }
        };

        // Initial check
        handleResize();

        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('resize', handleResize);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const formatDateRange = (range: DateRange | undefined) => {
        if (!range?.from) return placeholder;
        if (range.to) {
            return `${format(range.from, 'MMM dd, yyyy')} - ${format(range.to, 'MMM dd, yyyy')}`;
        }
        return format(range.from, 'MMM dd, yyyy');
    };

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-50 transition-colors shadow-md shadow-black/20 min-w-[220px] justify-between h-[38px]"
            >
                <div className="flex items-center gap-2 truncate">
                    <CalendarIcon size={16} className="text-gray-500" />
                    <span>{formatDateRange(dateRange)}</span>
                </div>
                {dateRange?.from && (
                    <button
                        type="button"
                        aria-label="Clear date range"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDateRangeChange(undefined);
                        }}
                        className="p-0.5 hover:bg-gray-200 rounded-full"
                    >
                        <X size={14} className="text-gray-400" />
                    </button>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 md:left-auto md:right-auto mt-2 z-50 p-4 bg-white border border-gray-200 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-w-[90vw] w-max md:w-auto">
                    <style>{`
                        /* Scope styles to this specific calendar instance to avoid global pollution */
                        .calendar-wrapper {
                            --rdp-cell-size: 40px; /* Restore comfortable touch target size */
                            --rdp-accent-color: #7BE156;
                            --rdp-background-color: #fff;
                            color: #111827; /* Gray-900 */
                        }
                        
                        /* Layout fixes */
                        .calendar-wrapper .rdp-months {
                            gap: 2rem !important;
                            justify-content: center;
                        }
                        .calendar-wrapper .rdp-month {
                            background-color: transparent;
                        }
                        .calendar-wrapper .rdp-table {
                            border-collapse: collapse;
                            max-width: 100%;
                        }
                        
                        /* Header spacing */
                        .calendar-wrapper .rdp-caption {
                            margin-bottom: 1.5rem !important;
                            position: relative;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                        }
                        .calendar-wrapper .rdp-caption_label {
                            font-size: 1rem;
                            font-weight: 600;
                            color: #111827;
                        }
                        
                        /* Cell formatting */
                        .calendar-wrapper .rdp-head_cell {
                            color: #6B7280; /* Gray-500 */
                            font-weight: 500;
                            font-size: 0.875rem;
                            width: var(--rdp-cell-size);
                            height: var(--rdp-cell-size);
                            text-align: center;
                        }
                        .calendar-wrapper .rdp-day {
                            width: var(--rdp-cell-size);
                            height: var(--rdp-cell-size);
                            border-radius: 8px;
                            font-size: 0.875rem;
                            transition: background-color 0.2s, color 0.2s;
                            color: #374151; /* Gray-700 */
                        }
                        
                        /* Interactive States */
                        .calendar-wrapper .rdp-button:hover:not([disabled]) {
                            background-color: #F3F4F6; /* Gray-100 for hover */
                            border-radius: 8px;
                        }
                        
                        /* Selected States */
                        .calendar-wrapper .rdp-day_selected, 
                        .calendar-wrapper .rdp-day_selected:focus-visible, 
                        .calendar-wrapper .rdp-day_selected:hover {
                            background-color: #7BE156 !important; /* Accounting Green */
                            color: white !important;
                            border-radius: 8px; /* Consistent rounded look */
                        }
                        .calendar-wrapper .rdp-day_today {
                             background-color: #F0FDF4; /* Light Green bg */
                             font-weight: bold;
                             color: #15803D; /* Darker Green text */
                        }
                        
                        /* Range Connectors */
                        .calendar-wrapper [data-selected-single="true"],
                        .calendar-wrapper [data-range-start="true"],
                        .calendar-wrapper [data-range-end="true"] {
                             background-color: #7BE156 !important;
                             color: white !important;
                             border-radius: 8px !important;
                        }
                        .calendar-wrapper [data-range-middle="true"] {
                             background-color: #DCFCE7 !important; /* Very light green (green-100) */
                             color: #15803D !important; /* Dark green text */
                             border-radius: 0 !important;
                        }
                        
                        /* Arrow visibility */
                        .calendar-wrapper .lucide {
                            color: #4B5563; /* Gray-600 */
                            width: 16px;
                            height: 16px;
                        }
                        .calendar-wrapper .rdp-nav_button:hover {
                            background-color: #F3F4F6;
                        }
                        
                        /* Mobile Responsive tweaks */
                        @media (max-width: 768px) {
                           .calendar-wrapper {
                               --rdp-cell-size: 36px; /* Slightly smaller on mobile */
                           }
                           .calendar-wrapper .rdp-months {
                               gap: 0 !important;
                           }
                        }
                    `}</style>
                    <div className="calendar-wrapper">
                        <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={onDateRangeChange}
                            numberOfMonths={numberOfMonths}
                            // Using standard spacing classes from Tailwind to help layout
                            className="p-1 md:p-4"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DateRangePicker;
