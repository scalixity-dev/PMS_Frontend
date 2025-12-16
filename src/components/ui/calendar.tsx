import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "../../lib/utils"
import { Button, buttonVariants } from "./button"

type CalendarView = "days" | "months" | "years"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()
  const [view, setView] = React.useState<CalendarView>("days")
  const yearContainerRef = React.useRef<HTMLDivElement>(null)
  
  // Safely access selected date
  const getSelectedDate = () => {
    if ('selected' in props && props.selected instanceof Date) {
      return props.selected
    }
    return new Date()
  }
  
  const initialDate = getSelectedDate()
  const [selectedYear, setSelectedYear] = React.useState<number>(initialDate.getFullYear())
  const [selectedMonth, setSelectedMonth] = React.useState<number>(initialDate.getMonth())
  const [displayMonth, setDisplayMonth] = React.useState<Date>(initialDate)

  // Sync internal state with selected prop changes
  React.useEffect(() => {
    const currentSelectedDate = getSelectedDate()
    const newYear = currentSelectedDate.getFullYear()
    const newMonth = currentSelectedDate.getMonth()
    const newDate = currentSelectedDate.getDate()
    
    // Only update if year, month, or date has changed to avoid infinite loops
    if (
      newYear !== selectedYear ||
      newMonth !== selectedMonth ||
      newDate !== displayMonth.getDate() ||
      displayMonth.getFullYear() !== newYear ||
      displayMonth.getMonth() !== newMonth
    ) {
      setSelectedYear(newYear)
      setSelectedMonth(newMonth)
      setDisplayMonth(new Date(newYear, newMonth, newDate))
    }
  }, ['selected' in props ? props.selected : undefined])

  // Generate years array (current year ± 100 years)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 201 }, (_, i) => currentYear - 100 + i)

  // Scroll to selected year when year view opens
  React.useEffect(() => {
    if (view === "years" && yearContainerRef.current) {
      const yearIndex = years.findIndex(y => y === selectedYear)
      if (yearIndex !== -1) {
        // Calculate approximate scroll position (each button is ~36px + gap)
        const scrollPosition = Math.floor(yearIndex / 4) * 42 - 42
        yearContainerRef.current.scrollTop = Math.max(0, scrollPosition)
      }
    }
  }, [view, selectedYear, years])
  
  // Month names
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const handleYearSelect = (year: number) => {
    setSelectedYear(year)
    setView("months")
  }

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex)
    const newDate = new Date(selectedYear, monthIndex, 1)
    setDisplayMonth(newDate)
    setView("days")
  }

  const handleYearClick = () => {
    setView("years")
  }

  const handleMonthClick = () => {
    setView("months")
  }

  // Render year selection view
  if (view === "years") {
    return (
      <div
        className={cn(
          "bg-background group/calendar p-3 [--cell-size:2rem]",
          className
        )}
      >
        <div className="flex flex-col gap-2">
          <div className="text-center font-medium text-sm mb-1">Select Year</div>
          <div ref={yearContainerRef} className="grid grid-cols-4 gap-1.5 max-h-[196px] overflow-y-auto">
            {years.map((year) => (
              <Button
                key={year}
                variant={year === selectedYear ? "default" : "ghost"}
                className={cn(
                  "h-9 text-xs",
                  year === selectedYear && "bg-primary text-primary-foreground"
                )}
                onClick={() => handleYearSelect(year)}
              >
                {year}
              </Button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Render month selection view
  if (view === "months") {
    return (
      <div
        className={cn(
          "bg-background group/calendar p-3 [--cell-size:2rem]",
          className
        )}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center mb-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setView("years")}
              className="text-sm font-medium hover:underline h-8"
            >
              {selectedYear}
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {months.map((month, index) => (
              <Button
                key={month}
                variant={index === selectedMonth ? "default" : "ghost"}
                className={cn(
                  "h-9 text-xs px-1",
                  index === selectedMonth && "bg-primary text-primary-foreground"
                )}
                onClick={() => handleMonthSelect(index)}
              >
                {month.slice(0, 3)}
              </Button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      month={displayMonth}
      onMonthChange={setDisplayMonth}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 pointer-events-none [&>*]:pointer-events-auto",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size] relative z-10",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "bg-popover absolute inset-0 opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label"
            ? "text-sm"
            : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-[--cell-size] select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn(
          "bg-accent rounded-l-md",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        MonthCaption: ({ calendarMonth }) => {
          const monthName = calendarMonth.date.toLocaleString("default", { month: "long" })
          const year = calendarMonth.date.getFullYear()
          
          return (
            <div className="flex items-center justify-center gap-1">
              <button
                type="button"
                onClick={handleMonthClick}
                className="text-sm font-medium hover:underline focus:outline-none cursor-pointer"
              >
                {monthName}
              </button>
              <button
                type="button"
                onClick={handleYearClick}
                className="text-sm font-medium hover:underline focus:outline-none cursor-pointer"
              >
                {year}
              </button>
            </div>
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("size-4", className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
