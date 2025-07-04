"use client"

import { DayPicker, DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/shadcn-button"

export type CalendarProps = {
  mode?: "single" | "range"
  selected?: Date | DateRange | null
  onSelect?: ((date: Date | null) => void) | ((date: DateRange | null) => void)
  className?: string
  classNames?: Record<string, string>
  showOutsideDays?: boolean
  disabled?: { before: Date }
  required?: boolean
}

function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
  classNames,
  showOutsideDays = true,
  disabled,
  required = false,
  ...props
}: CalendarProps) {

  const selectedValue = selected === null ? undefined : selected;

  const commonProps = {
    showOutsideDays,
    disabled,
    required,
    className: cn("p-3", className),
    classNames: {
      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
      month: "space-y-4",
      caption: "flex justify-center pt-1 relative items-center",
      caption_label: "text-sm font-medium",
      nav: "space-x-1 flex items-center",
      nav_button: cn(
        buttonVariants({ variant: "outline" }),
        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
      ),
      nav_button_previous: "absolute left-1",
      nav_button_next: "absolute right-1",
      table: "w-full border-collapse space-y-1",
      head_row: "flex",
      head_cell: "text-muted-foreground rounded-md w-9 h-9 flex items-center justify-center font-normal text-[1rem]", // ✅ Properly aligned weekdays
      row: "flex w-full mt-2",
      cell: "h-9 w-9 text-center text-sm flex items-center justify-center p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20", // ✅ Properly aligned dates
      day: cn(
        buttonVariants({ variant: "ghost" }),
        "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
      ),
      day_range_end: "day-range-end",
      day_selected:
        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
      day_today: "bg-accent text-accent-foreground",
      day_outside:
        "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
      day_disabled: "text-muted-foreground opacity-50",
      day_range_middle:
        "aria-selected:bg-accent aria-selected:text-accent-foreground",
      day_hidden: "invisible",
      ...classNames,
    },
    ...props,
  }

  if (mode === "range") {
    return (
      <DayPicker
        mode="range"
        selected={selectedValue as DateRange}
        onSelect={(value: DateRange | undefined) => {
          if (onSelect) {
            (onSelect as (date: DateRange | null) => void)(value ?? null);
          }
        }}
        {...commonProps}
      />
    )
  }

  return (
    <DayPicker
      mode="single"
      selected={selectedValue as Date}
      onSelect={(value: Date | undefined) => {
        if (onSelect) {
          (onSelect as (date: Date | null) => void)(value ?? null);
        }
      }}
      {...commonProps}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
