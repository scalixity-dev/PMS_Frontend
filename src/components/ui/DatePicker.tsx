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
};

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, placeholder = 'Select date', className, popoverClassName }) => {
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
        onClick={() => setOpen(v => !v)}
        className={cn(
          "w-full text-left rounded-md bg-white px-4 py-3 text-sm text-gray-700 outline-none shadow-sm focus:ring-2 focus:ring-[#84CC16]/20 flex items-center justify-between",
          className
        )}
      >
        <span className={cn(!value && "text-gray-400")}>{value ? format(value, 'MMM dd, yyyy') : placeholder}</span>
        <CalendarIcon className="w-4 h-4 text-gray-500 ml-2" />
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
            .rdp-month_caption {
              font-size: 0.875rem;
              margin-bottom: 0.5rem;
            }
            .rdp-weekdays {
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              gap: 0;
              margin-bottom: 0.25rem;
            }
            .rdp-weekday {
              width: 100%;
              text-align: center;
              font-size: 0.75rem;
              font-weight: 500;
              color: #374151;
              padding: 0.125rem;
            }
            .rdp-week {
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              gap: 0;
              margin-bottom: 0.125rem;
            }
            .rdp-day {
              width: 100%;
              aspect-ratio: 1;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .rdp-day button {
              width: 100%;
              height: 100%;
              max-width: 2rem;
              max-height: 2rem;
              font-size: 0.75rem;
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
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
