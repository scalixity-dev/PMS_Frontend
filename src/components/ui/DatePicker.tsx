import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from './calendar';
import type { Matcher } from 'react-day-picker';
import { cn } from '../../lib/utils';
import { computePopoverPosition, type PopoverPosition } from './popoverPosition';

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
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState<PopoverPosition | null>(null);

  /**
   * The calendar is portalled to the body rather than nested in the field.
   *
   * Every modal in this app is a scroll container (`max-h-[90vh]
   * overflow-y-auto`), and overflow clips its descendants whatever z-index they
   * carry. Nested in the field, the Edit lease terms calendar was cut off at
   * the modal's bottom edge with only the first row of days reachable: clicks
   * on any day below it landed outside the clip box, the outside-click handler
   * closed the picker, and the field silently kept its old date.
   */
  const reposition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const popover = popoverRef.current;

    setPosition(
      computePopoverPosition({
        trigger: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        // Before the first paint the popover has no size yet. Assume roughly a
        // calendar's worth so the initial placement is already close, then the
        // layout effect corrects it with the measured height.
        popover: {
          width: popover?.offsetWidth || Math.max(rect.width, 288),
          height: popover?.offsetHeight || 360,
        },
        viewport: { width: window.innerWidth, height: window.innerHeight },
      }),
    );
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }
    reposition();
  }, [open, reposition]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (popoverRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    // A fixed popover does not travel with its trigger, so follow anything that
    // moves it. `true` catches scrolling inside the modal, not just the page.
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [open, reposition]);

  return (
    // The wrapper stays even though the popover no longer lives inside it:
    // 53 call sites lay this component out as a single block child.
    <div className="relative">
      <button
        type="button"
        ref={triggerRef}
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

      {open && createPortal(
        <div
          ref={popoverRef}
          style={{
            position: 'fixed',
            top: position?.top ?? 0,
            left: position?.left ?? 0,
            minWidth: position?.minWidth,
            // Hidden until measured, so it never flashes in the wrong spot.
            visibility: position ? 'visible' : 'hidden',
            maxHeight: `calc(100vh - 16px)`,
          }}
          className={cn("z-[1000] bg-white rounded-lg shadow-lg border border-gray-200 overflow-auto p-2", popoverClassName)}
        >
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
            startMonth={minDate}
            endMonth={maxDate}
            disabled={[
              ...(minDate ? [{ before: minDate }] : []),
              ...(maxDate ? [{ after: maxDate }] : []),
            ] satisfies Matcher[]}
          />
        </div>,
        document.body,
      )}
    </div>
  );
};

export default DatePicker;
