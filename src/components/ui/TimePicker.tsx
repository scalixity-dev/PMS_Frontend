import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TimePickerProps {
    value?: string;
    onChange: (time: string) => void;
    placeholder?: string;
    className?: string;
    buttonClassName?: string;
    iconClassName?: string;
    disabled?: boolean;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange, placeholder = "Select time", className, buttonClassName, iconClassName, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const times = [];
    for (let i = 0; i < 24; i++) {
        for (let j = 0; j < 60; j += 30) {
            const hour = i === 0 ? 12 : i > 12 ? i - 12 : i;
            const minute = j === 0 ? '00' : j;
            const ampm = i < 12 ? 'AM' : 'PM';
            times.push(`${hour}:${minute} ${ampm}`);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    "w-full bg-white text-gray-800 placeholder-gray-400 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all shadow-sm flex items-center justify-between border border-transparent hover:border-gray-200",
                    buttonClassName,
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                <span className={cn("text-sm", !value && "text-gray-400")}>
                    {value || placeholder}
                </span>
                <Clock size={18} className={cn("text-gray-400", iconClassName)} />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto scrollbar-hide">
                    {times.map((time) => (
                        <button
                            key={time}
                            type="button"
                            onClick={() => {
                                onChange(time);
                                setIsOpen(false);
                            }}
                            className={cn(
                                "w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors",
                                value === time && "bg-[#3D7475]/10 text-[#3D7475] font-medium"
                            )}
                        >
                            {time}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TimePicker;
