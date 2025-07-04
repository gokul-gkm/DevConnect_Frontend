"use client"

import { forwardRef } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

export type CalendarProps = {
  mode?: "single" | "range"
  selected?: Date | null
  onSelect?: (date: Date | null) => void
  className?: string
  showOutsideDays?: boolean
  disabled?: { before: Date }
  required?: boolean
  inline?: boolean
}

function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
  showOutsideDays = true,
  disabled,
  required = false,
  inline = false,
  ...props
}: CalendarProps) {
  const CustomHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
  }: {
    date: Date
    decreaseMonth: () => void
    increaseMonth: () => void
  }) => (
    <div className="flex items-center justify-between px-2 py-2">
      <button
        onClick={decreaseMonth}
        className="p-1 rounded-full hover:bg-white/10"
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
        </svg>
      </button>
      <span className="text-sm font-medium">
        {format(date, 'MMMM yyyy')}
      </span>
      <button
        onClick={increaseMonth}
        className="p-1 rounded-full hover:bg-white/10"
      >
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.35022 10.7954 7.64949 10.6151 7.84183L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84183C5.94673 3.64037 5.95694 3.32395 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
        </svg>
      </button>
    </div>
  )

  const CustomInput = forwardRef<
    HTMLDivElement,
    { value?: string; onClick?: () => void }
  >(({ value, onClick }, ref) => (
    <div
      className="flex items-center space-x-2 p-2 border rounded-md cursor-pointer hover:bg-white/5"
      onClick={onClick}
      ref={ref}
    >
      <CalendarIcon className="h-5 w-5" />
      <span>{value}</span>
    </div>
  ))
  CustomInput.displayName = "CustomInput"

  if (inline) {
    return (
      <div className={cn("datepicker-wrapper", className)}>
        <DatePicker
          selected={selected}
          onChange={onSelect}
          inline
          dateFormat="MMMM d, yyyy"
          minDate={disabled?.before}
          required={required}
          calendarClassName="bg-black text-white border border-white/10 rounded-xl shadow-lg"
          dayClassName={(_date) => 
            "text-center hover:bg-white/10 rounded-full w-8 h-8 mx-auto flex items-center justify-center"
          }
          renderCustomHeader={CustomHeader}
          wrapperClassName="w-full"
          {...props}
        />
      </div>
    )
  }

  return (
    <div className={cn("datepicker-wrapper", className)}>
      <DatePicker
        selected={selected}
        onChange={onSelect}
        dateFormat="MMMM d, yyyy"
        minDate={disabled?.before}
        required={required}
        customInput={<CustomInput />}
        calendarClassName="bg-black text-white border border-white/10 rounded-xl shadow-lg"
        dayClassName={(_date) => 
          "text-center hover:bg-white/10 rounded-full w-8 h-8 mx-auto flex items-center justify-center"
        }
        renderCustomHeader={CustomHeader}
        wrapperClassName="w-full"
        {...props}
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
