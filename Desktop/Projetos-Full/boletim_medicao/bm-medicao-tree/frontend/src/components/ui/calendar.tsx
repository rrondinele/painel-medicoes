import * as React from "react"
import { cn } from "@/lib/utils"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export type DateRange = {
  from?: Date
  to?: Date
}

const DEFAULT_DATE_RANGE: DateRange = {
  from: undefined,
  to: undefined
}

interface CalendarProps {
  mode?: "single" | "range"
  selected?: Date | DateRange
  onSelect?: (date: Date | DateRange | undefined) => void
  className?: string
  numberOfMonths?: number
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
  numberOfMonths = 1,
}: CalendarProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    mode === "single" ? (selected as Date) : undefined
  )
  const [range, setRange] = React.useState<DateRange>(
    mode === "range" ? (selected as DateRange) ?? DEFAULT_DATE_RANGE : DEFAULT_DATE_RANGE
  )

  React.useEffect(() => {
    if (mode === "single") {
      onSelect?.(date)
    } else {
      onSelect?.(range)
    }
  }, [date, range, mode, onSelect])

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
  }

  const handleRangeChange = (part: 'from' | 'to', value: Date | undefined) => {
    setRange(prev => ({
      ...prev,
      [part]: value
    }))
  }

  return (
    <div className={cn("space-y-4", className)}>
      {mode === "single" ? (
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={date ? format(date, "yyyy-MM-dd") : ""}
          onChange={(e) => handleDateChange(e.target.value ? new Date(e.target.value) : undefined)}
        />
      ) : (
        <div className="flex gap-4">
          <div>
            <p className="text-sm mb-2">De:</p>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={range.from ? format(range.from, "yyyy-MM-dd") : ""}
              onChange={(e) =>
                handleRangeChange('from', e.target.value ? new Date(e.target.value) : undefined)
              }
            />
          </div>
          <div>
            <p className="text-sm mb-2">Até:</p>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={range.to ? format(range.to, "yyyy-MM-dd") : ""}
              onChange={(e) =>
                handleRangeChange('to', e.target.value ? new Date(e.target.value) : undefined)
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}

interface DatePickerProps {
  onDateChange?: (date: Date | undefined) => void
  initialDate?: Date
}

export function DatePicker({ onDateChange, initialDate }: DatePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(initialDate)

  const handleDateChange = (selectedDate: Date | DateRange | undefined) => {
    if (selectedDate instanceof Date || selectedDate === undefined) {
      setDate(selectedDate)
      onDateChange?.(selectedDate)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-gray-500"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy") : <span>Selecione a data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
        />
      </PopoverContent>
    </Popover>
  )
}

interface DateRangePickerProps {
  onRangeChange?: (range: DateRange) => void
  initialRange?: DateRange
}

export function DateRangePicker({ onRangeChange, initialRange = DEFAULT_DATE_RANGE }: DateRangePickerProps) {
  const [range, setRange] = React.useState<DateRange>(initialRange)

  const handleRangeChange = (newRange: DateRange) => {
    setRange(newRange)
    onRangeChange?.(newRange)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !range.from && "text-gray-500"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {range.from ? (
            range.to ? (
              <>
                {format(range.from, "dd/MM/yyyy")} - {format(range.to, "dd/MM/yyyy")}
              </>
            ) : (
              format(range.from, "dd/MM/yyyy")
            )
          ) : (
            <span>Selecione o período</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={range}
          onSelect={(selected) => {
            if (selected && !(selected instanceof Date)) {
              handleRangeChange(selected)
            }
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}