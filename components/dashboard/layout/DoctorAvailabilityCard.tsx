import React from 'react'
import Link from 'next/link'
import {} from 'lucide-react'

type AvailabilityRange = {
  start: string
  end: string
}

type DayAvailability = {
  day: string
  ranges: AvailabilityRange[]
}

type Props = {
  availability?: DayAvailability[]
  onEdit?: () => void
}

const SAMPLE: DayAvailability[] = [
  { day: 'Mon', ranges: [{ start: '08:30', end: '12:00' }, { start: '13:30', end: '17:00' }] },
  { day: 'Tue', ranges: [{ start: '09:00', end: '12:30' }] },
  { day: 'Thu', ranges: [{ start: '14:00', end: '17:30' }] }
]

function minutesFromTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function totalMinutes(availability: DayAvailability[]) {
  return availability.reduce((sum, d) => {
    return sum + d.ranges.reduce((s, r) => s + (minutesFromTime(r.end) - minutesFromTime(r.start)), 0)
  }, 0)
}

const DAY_NAME_FR: Record<string, string> = {
  Mon: 'Lundi',
  Tue: 'Mardi',
  Wed: 'Mercredi',
  Thu: 'Jeudi',
  Fri: 'Vendredi',
  Sat: 'Samedi',
  Sun: 'Dimanche',
}

function toFrenchDay(code: string) {
  return DAY_NAME_FR[code] || code
}

export default function DoctorOwnAvailabilityCard({ availability = SAMPLE, onEdit }: Props) {
  const days = availability.map((d) => toFrenchDay(d.day))
  const minutes = totalMinutes(availability)
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

return (
  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">

    {/* Header */}
  <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Your availability
      </h3>
      <p className="text-sm text-gray-500 mt-1">
        Quick overview
      </p>
    </div>

    {/* Main content: left = summary + days; right = hours & count */}
    <div className="mb-4 flex items-start justify-between">
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Summary of your weekly availability</div>

        <div className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-200">
          {days.map((d) => (
            <div key={d} className="w-full px-3 py-1 text-sm bg-[#F9FAFB] text-gray-700 dark:bg-gray-700/20 dark:text-gray-200 rounded-md">{d}</div>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 text-right ml-4">
        <div className="text-3xl font-semibold text-gray-900">{hours}{mins ? <span className="text-base font-medium"> h {mins}m</span> : <span className="text-base font-medium"> h</span>}</div>
        <div className="text-sm text-gray-600 mt-1">{days.length} active day{days.length === 1 ? '' : 's'}</div>
      </div>
    </div>

    {/* Manage Button */}
        <div className="mt-3 text-right">
          {onEdit ? (
            <button onClick={onEdit} type="button" className="text-xs text-gray-500 hover:text-gray-700 hover:underline">Manage availability</button>
          ) : (
            <Link href="/dashboard/availability" className="text-xs text-gray-500 hover:text-gray-700 hover:underline">Manage availability</Link>
          )}
        </div>

  </div>
)

}