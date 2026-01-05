import React, { useState, useRef, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PreciseTimePickerProps {
    value?: string;
    onChange: (time: string) => void;
    placeholder?: string;
    className?: string;
    buttonClassName?: string;
    iconClassName?: string;
    disabled?: boolean;
}

const PreciseTimePicker: React.FC<PreciseTimePickerProps> = ({
    value,
    onChange,
    placeholder = "Select time",
    className,
    buttonClassName,
    iconClassName,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse parsing logic
    const parseTime = (timeStr?: string) => {
        if (!timeStr) return { hour: 12, minute: 0, amp: 'AM' as const };
        const match = timeStr.match(/(\d+):(\d+)\s?(AM|PM)/i);
        if (match) {
            let h = parseInt(match[1]);
            const m = parseInt(match[2]);
            const ap = match[3].toUpperCase() as 'AM' | 'PM';

            // Validate ranges
            if (h >= 1 && h <= 12 && m >= 0 && m <= 59 && (ap === 'AM' || ap === 'PM')) {
                return { hour: h, minute: m, amp: ap };
            }
        }
        return { hour: 12, minute: 0, amp: 'AM' as const };
    };

    const [tempTime, setTempTime] = useState(parseTime(value));

    useEffect(() => {
        setTempTime(parseTime(value));
    }, [value]);

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const minutes = Array.from({ length: 60 }, (_, i) => i);
    const amps = ['AM', 'PM'] as const;

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

    const handleChange = (newTime: typeof tempTime) => {
        setTempTime(newTime);
        const formattedTime = `${newTime.hour}:${newTime.minute.toString().padStart(2, '0')} ${newTime.amp}`;
        onChange(formattedTime);
    };


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
                <div className="absolute z-50 mt-2 w-full min-w-[200px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden p-2 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-start justify-center gap-2 h-48">
                        {/* Hours */}
                        <div className="flex-1 h-full overflow-y-auto scrollbar-hide text-center border-r border-gray-50">
                            <div className="text-[10px] font-bold text-gray-400 mb-1 sticky top-0 bg-white z-10 py-1">HR</div>
                            {hours.map((h) => (
                                <button
                                    key={h}
                                    type="button"
                                    onClick={() => handleChange({ ...tempTime, hour: h })}
                                    className={cn(
                                        "w-full py-1.5 text-sm rounded-md transition-colors",
                                        tempTime.hour === h ? "bg-[#3D7475]/10 text-[#3D7475] font-bold" : "text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    {h}
                                </button>
                            ))}
                        </div>

                        {/* Minutes */}
                        <div className="flex-1 h-full overflow-y-auto scrollbar-hide text-center border-r border-gray-50">
                            <div className="text-[10px] font-bold text-gray-400 mb-1 sticky top-0 bg-white z-10 py-1">MIN</div>
                            {minutes.map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => handleChange({ ...tempTime, minute: m })}
                                    className={cn(
                                        "w-full py-1.5 text-sm rounded-md transition-colors",
                                        tempTime.minute === m ? "bg-[#3D7475]/10 text-[#3D7475] font-bold" : "text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    {m.toString().padStart(2, '0')}
                                </button>
                            ))}
                        </div>

                        {/* AM/PM */}
                        <div className="flex-1 h-full overflow-y-auto scrollbar-hide text-center">
                            <div className="text-[10px] font-bold text-gray-400 mb-1 sticky top-0 bg-white z-10 py-1">AM/PM</div>
                            {amps.map((ap) => (
                                <button
                                    key={ap}
                                    type="button"
                                    onClick={() => handleChange({ ...tempTime, amp: ap })}
                                    className={cn(
                                        "w-full py-1.5 text-sm rounded-md transition-colors",
                                        tempTime.amp === ap ? "bg-[#3D7475]/10 text-[#3D7475] font-bold" : "text-gray-600 hover:bg-gray-50"
                                    )}
                                >
                                    {ap}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="w-full bg-[#3E706F] text-white py-1.5 rounded-lg text-xs font-bold hover:bg-[#2c5251] transition-colors"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PreciseTimePicker;
