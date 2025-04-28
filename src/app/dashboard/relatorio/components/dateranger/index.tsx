// DateRangePicker.tsx
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useState, useEffect } from 'react'

interface Props {
  onChange: (start: Date | null, end: Date | null) => void
}

export function DateRangePicker({ onChange }: Props) {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  useEffect(() => {
    onChange(startDate, endDate)
  }, [startDate, endDate])

  return (
    <div className="flex items-center gap-4">
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        className="p-2 border rounded-md"
        placeholderText="Início"
      />
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        className="p-2 border rounded-md"
        placeholderText="Fim"
      />
    </div>
  )
}
