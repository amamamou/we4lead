import React from 'react'
import Link from 'next/link'
import { Bell, Clock } from 'lucide-react'

type Appt = {
  id: string
  token: string
  datetime: string
  doctor: string
}

const SAMPLE: Appt[] = [
  { id: 'a1', token: 'T-102', datetime: 'Mon, 12 Apr • 10:00', doctor: 'Pr. Selma Ben Youssef' },
  { id: 'a2', token: 'T-118', datetime: 'Tue, 13 Apr • 14:30', doctor: 'Dr. Houssem K.' }
]

export default function UpcomingAppointments({ appointments = SAMPLE, role = 'user', onViewAll }: { appointments?: Appt[], role?: 'doctor' | 'user' | 'student', onViewAll?: () => void }) {
  // Helper to render a single row (appointment or placeholder) — compact spacing
  const renderRow = (a: Appt | undefined, idx: number) => (
    <div key={a?.id ?? `empty-${idx}`} className="flex items-center justify-between py-2">
      <div>
        {a ? (
          <>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{a.datetime}</div>
            <div className="text-sm text-gray-600">{a.doctor}</div>
          </>
        ) : (
          <>
            <div className="text-sm font-medium text-gray-400">—</div>
            <div className="text-sm text-gray-400">No sessions</div>
          </>
        )}
      </div>

      <div className="text-right">
        <div className={a ? "inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-50 dark:bg-gray-800 text-xs font-medium text-gray-900 dark:text-gray-100" : "inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-50 text-xs font-medium text-gray-400"}>
          <span>{a ? a.token : '—'}</span>
        </div>
      </div>
    </div>
  )

  if (role === 'doctor') {
  // Single card, show up to 2 upcoming rows (flexible: don't pad placeholders)
  const rows: Array<Appt | undefined> = appointments.slice(0, 2)

    return (
      <div className="p-3 bg-white rounded-lg shadow-sm dark:bg-gray-800">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-red-50">
                <Bell className="w-3 h-3 text-red-500" />
              </span>
              Upcoming sessions
            </h3>
            <p className="text-xs text-gray-500 mt-1">Doctors from your faculty and their next available slot.</p>
          </div>

          <div className="ml-4 mt-1">
            {onViewAll ? (
              <button type="button" onClick={onViewAll} aria-label="View all sessions" className="text-xs text-gray-500 hover:text-gray-700 hover:underline cursor-pointer transition-colors">View all</button>
            ) : (
              <Link href="/dashboard?activeTab=calendar" className="text-xs text-gray-500">View all</Link>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {rows.map((a, idx) => renderRow(a, idx))}
        </div>
      </div>
    )
  }

  // Default / user: show two cards — upcoming (1 row) and last rendez-vous (1 row)
  const next = appointments[0] ?? undefined
  const last = appointments[1] ?? undefined

  return (
    <div className="flex flex-col gap-3">
      <div className="p-3 bg-white rounded-lg shadow-sm dark:bg-gray-800">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-red-50">
                <Bell className="w-3 h-3 text-red-500" />
              </span>
              Upcoming sessions
            </h3>
            <p className="text-xs text-gray-500 mt-1">Your next tokens for upcoming sessions.</p>
          </div>
          <div className="ml-4 mt-1">
            {onViewAll ? (
              <button type="button" onClick={onViewAll} aria-label="View all sessions" className="text-xs text-gray-500 hover:text-gray-700 hover:underline cursor-pointer transition-colors">View all</button>
            ) : (
              <Link href="/dashboard?activeTab=calendar" className="text-xs text-gray-500">View all</Link>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {renderRow(next, 0)}
        </div>
      </div>

      <div className="p-3 bg-white rounded-lg shadow-sm dark:bg-gray-800">
        <div className="mb-2 flex items-start justify-between">
          <div>
              <h3 className="text-sm font-semibold flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-50">
                <Clock className="w-3 h-3 text-slate-500" />
              </span>
              Last session
            </h3>
            <p className="text-xs text-gray-500 mt-1">Your most recent session.</p>
          </div>
          <div className="ml-4 mt-1">
            {onViewAll ? (
              <button type="button" onClick={onViewAll} aria-label="View all sessions" className="text-xs text-gray-500 hover:text-gray-700 hover:underline cursor-pointer transition-colors">View all</button>
            ) : (
              <Link href="/dashboard?activeTab=calendar" className="text-xs text-gray-500">View all</Link>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {renderRow(last, 1)}
        </div>
      </div>
    </div>
  )
}
