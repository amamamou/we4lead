import React from 'react'
import WeeklyAvailability from './WeeklyAvailability'
import { Calendar, Clock, Repeat } from '@/components/ui/icons'

function formatWeekRange(date = new Date()) {
  // compute Monday - Sunday range for current week
  const d = new Date(date)
  const day = d.getDay() || 7 // make Sunday=7
  const monday = new Date(d)
  monday.setDate(d.getDate() - (day - 1))
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const fmt = (dt: Date) => dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  return `${fmt(monday)} – ${fmt(sunday)}`
}

export default function AvailabilityPage() {
  const weekRange = formatWeekRange()

  return (
    <div className="mx-auto">
      <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">

        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">Weekly Availability</h3>
            <p className="text-sm text-gray-500 mt-1">Students can book consultations only during the hours you set below.</p>
          </div>
          <div className="ml-4" />
        </div>

        <div className="flex flex-wrap gap-6 mt-4">
          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">Viewing week: {weekRange}</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">Consultation duration: 30 minutes</span>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-700">
            <Repeat className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">Repeats every week</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <WeeklyAvailability />
      </div>
    </div>
  )
}
