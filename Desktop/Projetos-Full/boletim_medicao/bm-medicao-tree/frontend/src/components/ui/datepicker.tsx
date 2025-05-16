import React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { cn } from "@/lib/utils"

interface CustomDatePickerProps {
  selected: Date | null
  onChange: (date: Date | null) => void
  className?: string
}

export const CustomDatePicker = ({ 
  selected, 
  onChange, 
  className 
}: CustomDatePickerProps) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
        "focus:outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      dateFormat="dd/MM/yyyy"
      placeholderText="Selecione a data"
    />
  )
}