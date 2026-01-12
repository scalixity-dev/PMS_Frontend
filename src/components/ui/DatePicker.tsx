import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from './calendar';
import { cn } from '../../lib/utils';

type DatePickerProps = {
  value?: Date | undefined;
  onChange?: (date?: Date) => void;
  placeholder?: string;
  className?: string;
  popoverClassName?: string;
  disabled?: boolean;
  iconClassName?: string;
  placeholderClassName?: string;
  minDate?: Date;
  maxDate?: Date;
};

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder = 'Select date', className, popoverClassName, disabled, iconClassName, placeholderClassName, minDate, maxDate }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(v => !v)}
        disabled={disabled}
        className={cn(
          "w-full text-left rounded-md bg-white px-4 py-3 text-sm text-gray-700 outline-none shadow-sm focus:ring-2 focus:ring-[#84CC16]/20 flex items-center justify-between",
          disabled && "opacity-50 cursor-not-allowed bg-gray-100",
          className
        )}
      >
        <span className={cn(!value && "text-gray-400", !value && placeholderClassName)}>{value ? format(value, 'MMM dd, yyyy') : placeholder}</span>
        <CalendarIcon className={cn("w-4 h-4 text-gray-500 ml-2", iconClassName)} />
      </button>

      {open && (
        <div className={cn("absolute z-50 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden p-2 w-full", popoverClassName)}>
          <style>{`
            [data-selected-single="true"] {
              background-color: #7BD747 !important;
              color: white !important;
            }
            [data-selected-single="true"]:hover {
              background-color: #6BC637 !important;
            }
            .rdp-root {
              --rdp-accent-color: #7BD747 !important;
              --rdp-accent-background-color: #7BD747 !important;
              width: 100%;
            }
            .rdp-months {
              width: 100%;
            }
            .rdp-month {
              width: 100%;
            }
            .rdp-day {
              aspect-ratio: auto !important;
              height: 28px;
            }
            .rdp-day button {
              width: 100% !important;
              height: 100% !important;
              max-width: none !important;
              max-height: none !important;
            }
            [data-slot="button"] {
              padding: 0 !important;
            }
          `}</style>
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
            fromDate={minDate}
            toDate={maxDate}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
