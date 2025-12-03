import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { addMonths, subMonths, startOfMonth, format, isSameMonth } from 'date-fns';
import CalendarHeader from './CalendarHeader';
import MonthGrid from './MonthGrid';
import AddReminderModal from './components/AddReminderModal';

export interface Reminder {
    id: string;
    title: string;
    date: Date;
    time: string;
    type: 'maintenance' | 'viewing' | 'meeting' | 'other';
}

const Calendar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    // Initialize with previous, current, and next month
    const [months, setMonths] = useState<Date[]>([
        subMonths(startOfMonth(new Date()), 1),
        startOfMonth(new Date()),
        addMonths(startOfMonth(new Date()), 1),
    ]);
    const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

    // Reminders State
    const [reminders, setReminders] = useState<Reminder[]>([
        {
            id: '1',
            title: 'AC Maintenance',
            date: new Date(new Date().getFullYear(), new Date().getMonth(), 10),
            time: '10:00 AM',
            type: 'maintenance'
        },
        {
            id: '2',
            title: 'Unit 204 Viewing',
            date: new Date(new Date().getFullYear(), new Date().getMonth(), 15),
            time: '2:30 PM',
            type: 'viewing'
        },
        {
            id: '3',
            title: 'Lease Renewal Meeting',
            date: new Date(new Date().getFullYear(), new Date().getMonth(), 22),
            time: '11:00 AM',
            type: 'meeting'
        },
        {
            id: '4',
            title: 'Plumbing Check',
            date: new Date(new Date().getFullYear(), new Date().getMonth(), 22),
            time: '4:00 PM',
            type: 'maintenance'
        }
    ]);

    const handleAddReminder = (data: any) => {
        const newReminder: Reminder = {
            id: Date.now().toString(),
            title: data.title,
            date: data.date || new Date(),
            time: data.time,
            type: 'other' // Default type for now, or infer from data if possible
        };
        setReminders(prev => [...prev, newReminder]);
        setIsReminderModalOpen(false);
    };

    const containerRef = useRef<HTMLDivElement>(null);
    const [isPrepend, setIsPrepend] = useState(false);
    const previousScrollHeightRef = useRef(0);

    // Handle scroll for infinite loading
    const handleScroll = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;

        // Threshold to load more
        const threshold = 50;

        // Load previous month
        if (scrollTop < threshold) {
            setIsPrepend(true);
            previousScrollHeightRef.current = scrollHeight;
            setMonths((prev) => {
                const firstMonth = prev[0];
                return [subMonths(firstMonth, 1), ...prev];
            });
        }

        // Load next month
        if (scrollTop + clientHeight > scrollHeight - threshold) {
            setMonths((prev) => {
                const lastMonth = prev[prev.length - 1];
                return [...prev, addMonths(lastMonth, 1)];
            });
        }
    }, []);

    // Adjust scroll position after prepending
    useLayoutEffect(() => {
        if (isPrepend && containerRef.current) {
            const container = containerRef.current;
            const newScrollHeight = container.scrollHeight;
            const diff = newScrollHeight - previousScrollHeightRef.current;
            // Only adjust if diff is positive (content added)
            if (diff > 0) {
                container.scrollTop += diff;
            }
            setIsPrepend(false);
        }
    }, [months, isPrepend]);

    // Update header date based on visible month
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                        const dateStr = entry.target.getAttribute('data-date');
                        if (dateStr) {
                            const visibleDate = new Date(dateStr);
                            if (!isSameMonth(visibleDate, currentDate)) {
                                setCurrentDate(visibleDate);
                            }
                        }
                    }
                });
            },
            {
                root: container,
                threshold: [0.1, 0.5, 0.9],
            }
        );

        const monthElements = container.querySelectorAll('.month-section');
        monthElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [months, currentDate]);

    // Sync header with scroll position
    const handleScrollForHeader = () => {
        const container = containerRef.current;
        if (!container) return;

        const monthElements = Array.from(container.querySelectorAll('.month-section')) as HTMLElement[];

        // Find the month that is most visible or at the top
        for (const el of monthElements) {
            const rect = el.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            // Check if the element covers the top part of the container
            if (rect.bottom > containerRect.top + 100 && rect.top < containerRect.bottom - 100) {
                const dateStr = el.getAttribute('data-date');
                if (dateStr) {
                    const date = new Date(dateStr);
                    if (!isSameMonth(date, currentDate)) {
                        setCurrentDate(date);
                    }
                }
                break;
            }
        }
    };

    const onScroll = () => {
        handleScroll();
        handleScrollForHeader();
    }

    const handleDateChange = (newDate: Date) => {
        setCurrentDate(newDate);
        setMonths([
            subMonths(newDate, 1),
            newDate,
            addMonths(newDate, 1),
        ]);
        // Scroll to the new date
        setTimeout(() => {
            if (containerRef.current) {
                // Try to find the specific day cell first (e.g. for Today)
                const todayEl = containerRef.current.querySelector('.today-cell');
                if (todayEl) {
                    todayEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
                } else {
                    // Fallback to month start
                    const el = containerRef.current.querySelector(`[data-date="${newDate.toISOString()}"]`);
                    if (el) {
                        el.scrollIntoView({ block: 'start', behavior: 'smooth' });
                    }
                }
            }
        }, 100);
    };

    const handleTodayClick = () => {
        handleDateChange(new Date());
    };

    const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-transparent overflow-hidden">
            {/* Fixed Header Section */}
            <div className="flex-none pb-0 z-20 bg-gray-100/90 backdrop-blur-sm">
                <CalendarHeader
                    currentDate={currentDate}
                    onDateChange={handleDateChange}
                    onTodayClick={handleTodayClick}
                    onAddReminder={() => setIsReminderModalOpen(true)}
                />

                {/* Weekday Header - Aligned with the grid */}
                <div className="flex">
                    {/* Spacer for the side label column */}
                    <div className="w-12 flex-none"></div>

                    {/* Weekdays */}
                    <div className="flex-1 grid grid-cols-7 mb-2 bg-[#43767c] text-white rounded-t-lg overflow-hidden shadow-md">
                        {weekDays.map((day) => (
                            <div key={day} className="py-3 text-center text-sm font-semibold tracking-wider border-r border-[#54878d] last:border-r-0">
                                {day}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scrollable Month Area */}
            <div
                ref={containerRef}
                onScroll={onScroll}
                className="flex-1 overflow-y-auto relative scrollbar-hide px-0 pb-6 scroll-smooth"
                style={{ scrollBehavior: isPrepend ? 'auto' : 'smooth' }}
            >
                {months.map((month) => (
                    <div
                        key={month.toISOString()}
                        data-date={month.toISOString()}
                        className="month-section flex mb-4"
                    >
                        {/* Rotated Month Label */}
                        <div className="w-12 flex-none flex items-center justify-center relative">
                            <div className="absolute transform rotate-180 text-gray-700 font-bold tracking-widest text-sm uppercase" style={{ writingMode: 'vertical-rl' }}>
                                {format(month, 'MMMM yyyy')}
                            </div>
                        </div>

                        {/* Month Grid */}
                        <div className="flex-1">
                            <MonthGrid month={month} reminders={reminders} />
                        </div>
                    </div>
                ))}
            </div>
            <AddReminderModal
                isOpen={isReminderModalOpen}
                onClose={() => setIsReminderModalOpen(false)}
                onSave={handleAddReminder}
            />
        </div>
    );
};

export default Calendar;
