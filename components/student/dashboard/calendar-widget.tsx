'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1))

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const eventDays = [15, 22]

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const days = []
  for (let i = 0; i < firstDayOfMonth(currentDate); i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth(currentDate); i++) {
    days.push(i)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-foreground capitalize">{monthName}</h3>
        <div className="flex gap-1">
          <button
            onClick={prevMonth}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Day labels */}
        <div className="grid grid-cols-7 gap-2">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
            <div key={index} className="text-center text-xs font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => (
            <button
              key={idx}
              disabled={day === null}
              className={`aspect-square flex items-center justify-center rounded-lg font-medium text-sm transition-colors ${
                day === null
                  ? 'invisible'
                  : eventDays.includes(day)
                    ? 'bg-blue-50 border border-blue-200 text-blue-700 font-semibold'
                    : 'text-foreground hover:bg-gray-100'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
