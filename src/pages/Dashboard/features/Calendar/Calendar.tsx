import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } from 'react';
import { addMonths, subMonths, startOfMonth, endOfMonth, format, isSameMonth } from 'date-fns';
import CalendarHeader from './CalendarHeader';
import MonthGrid from './MonthGrid';
import AddReminderModal from './components/AddReminderModal';
import { useGetCalendarEvents } from '../../../../hooks/useCalendarQueries';
import { Loader2 } from 'lucide-react';

export interface Reminder {
    id: string;
    title: string;
    date: Date;
    time: string;
    type: 'maintenance' | 'viewing' | 'meeting' | 'other';
    property?: string;
    propertyId?: string;
    details?: string;
    assigneeName?: string;
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

    // Calculate date range for visible months
    const dateRange = useMemo(() => {
        if (months.length === 0) {
            const now = new Date();
            return {
                startDate: startOfMonth(subMonths(now, 1)),
                endDate: endOfMonth(addMonths(now, 1)),
            };
        }
        const firstMonth = months[0];
        const lastMonth = months[months.length - 1];
        return {
            startDate: startOfMonth(firstMonth),
            endDate: endOfMonth(lastMonth),
        };
    }, [months]);

    // Fetch calendar events (tasks + reminders) from API
    const { data: calendarEvents = [], isLoading: isLoadingEvents } = useGetCalendarEvents(
        dateRange.startDate,
        dateRange.endDate,
        undefined, // No filters - show all tasks and reminders
        true // enabled
    );

    // Parse date string "DD MMM, YYYY" to Date object
    const parseDate = (dateStr: string): Date => {
        if (!dateStr || dateStr.trim() === '') return new Date();

        const parts = dateStr.trim().split(' ');
        if (parts.length < 3) {
            console.warn('Invalid date format:', dateStr);
            return new Date();
        }

        const day = parseInt(parts[0]);
        if (isNaN(day)) {
            console.warn('Invalid day in date:', dateStr);
            return new Date();
        }

        // Remove comma from month name if present (e.g., "Jan," -> "Jan")
        const monthName = parts[1].replace(',', '').trim();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames.indexOf(monthName);
        if (month === -1) {
            console.warn('Invalid month in date:', dateStr, 'monthName:', monthName);
            return new Date();
        }

        // Remove comma from year if present
        const yearStr = parts[2].replace(',', '').trim();
        const year = parseInt(yearStr);
        if (isNaN(year)) {
            console.warn('Invalid year in date:', dateStr);
            return new Date();
        }

        // Create date at midnight in local timezone to avoid timezone issues
        const parsedDate = new Date(year, month, day, 0, 0, 0, 0);
        // Validate the parsed date
        if (isNaN(parsedDate.getTime())) {
            console.warn('Invalid parsed date:', dateStr, '->', parsedDate);
            return new Date();
        }

        return parsedDate;
    };


    const reminders = useMemo<Reminder[]>(() => {
        // Valid reminder types
        const validReminderTypes: Array<'maintenance' | 'viewing' | 'meeting' | 'other'> = [
            'maintenance',
            'viewing',
            'meeting',
            'other',
        ];

        // Keyword patterns with word boundaries for stricter matching
        const keywordPatterns = {
            maintenance: /\b(maintenance|repair|fix|check|inspection|service|upkeep)\b/i,
            viewing: /\b(viewing|show|tour|open\s+house|property\s+view)\b/i,
            meeting: /\b(meeting|appointment|conference|consultation|discussion)\b/i,
        };

        return calendarEvents.map((event) => {
            let reminderType: 'maintenance' | 'viewing' | 'meeting' | 'other' = 'other';
            let inferenceSource: 'metadata' | 'keywords' | 'default' = 'default';
            let inferenceIssues: string[] = [];

            // Strategy 1: Prefer explicit type from metadata (normalize and validate)
            if (event.metadata?.reminderType) {
                const metaType = String(event.metadata.reminderType).toLowerCase().trim();

                // Normalize common variations
                const normalizedType = metaType === 'reminder' ? 'other' : metaType;

                // Validate against allowed values
                if (validReminderTypes.includes(normalizedType as typeof reminderType)) {
                    reminderType = normalizedType as typeof reminderType;
                    inferenceSource = 'metadata';
                } else {
                    // Invalid metadata type - log warning
                    inferenceIssues.push(`Invalid metadata.reminderType: "${metaType}" (normalized: "${normalizedType}")`);
                    console.warn(
                        `[Calendar] Invalid reminder type in metadata for event "${event.id}":`,
                        metaType,
                        'Expected one of:',
                        validReminderTypes.join(', ')
                    );
                }
            }

            // Strategy 2: Fall back to keyword matching with word boundaries if metadata didn't provide valid type
            if (inferenceSource === 'default' && event.title) {
                const titleLower = event.title.toLowerCase();
                const matches: Array<{ type: typeof reminderType; count: number }> = [];

                // Check each keyword pattern
                for (const [type, pattern] of Object.entries(keywordPatterns)) {
                    const matchCount = (titleLower.match(pattern) || []).length;
                    if (matchCount > 0) {
                        matches.push({
                            type: type as typeof reminderType,
                            count: matchCount,
                        });
                    }
                }

                if (matches.length > 0) {
                    // If multiple matches, prefer the one with most occurrences
                    // If tie, prefer maintenance > viewing > meeting > other
                    matches.sort((a, b) => {
                        if (b.count !== a.count) return b.count - a.count;
                        const priority = { maintenance: 0, viewing: 1, meeting: 2, other: 3 };
                        return priority[a.type] - priority[b.type];
                    });

                    reminderType = matches[0].type;
                    inferenceSource = 'keywords';

                    // Log if ambiguous (multiple matches with same count)
                    if (matches.length > 1 && matches[0].count === matches[1].count) {
                        inferenceIssues.push(
                            `Ambiguous keyword match: ${matches.map(m => `${m.type} (${m.count})`).join(', ')}`
                        );
                        console.debug(
                            `[Calendar] Ambiguous keyword inference for event "${event.id}" (title: "${event.title}"):`,
                            matches.map(m => `${m.type} (${m.count} matches)`).join(', ')
                        );
                    }
                }
            }

            // Strategy 3: Default to 'other' (already set, but log if we had issues)
            if (inferenceIssues.length > 0 && inferenceSource !== 'metadata') {
                console.debug(
                    `[Calendar] Reminder type inference for event "${event.id}" (title: "${event.title}"):`,
                    inferenceIssues.join('; '),
                    `-> Using: ${reminderType} (source: ${inferenceSource})`
                );
            }

            return {
                id: event.id,
                title: event.title,
                date: parseDate(event.date),
                time: event.time || '',
                type: reminderType,
                property: event.propertyName,
                propertyId: event.propertyId,
                details: event.description,
                assigneeName: event.assignee,
            };
        });
    }, [calendarEvents]);

    const handleAddReminder = () => {
        // Modal handles API calls internally, just close it
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
                {isLoadingEvents ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <Loader2 className="w-8 h-8 animate-spin text-[#3D7475] mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Loading calendar events...</p>
                        </div>
                    </div>
                ) : (
                    months.map((month) => (
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
                    ))
                )}
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
