"use client"
import React, { useEffect, useMemo, useState } from 'react'

type EventItem = {
  id: string
  title: string
}

function formatDateKey(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getMonthMatrix(year: number, month: number) {
  // month: 0-indexed
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)

  const matrix: (Date | null)[][] = []
  let week: (Date | null)[] = []

  // week starts on Sunday
  const startDay = first.getDay() // 0-6
  for (let i = 0; i < startDay; i++) {
    week.push(null)
  }

  for (let day = 1; day <= last.getDate(); day++) {
    week.push(new Date(year, month, day))
    if (week.length === 7) {
      matrix.push(week)
      week = []
    }
  }

  if (week.length) {
    while (week.length < 7) week.push(null)
    matrix.push(week)
  }

  return matrix
}

export default function Calendar() {
  const today = useMemo(() => new Date(), [])
  const [viewDate] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState<Date>(today)

  // initialize events from localStorage lazily (safe for SSR checks)
  const [events, setEvents] = useState<Record<string, EventItem[]>>(() => {
    try {
      if (typeof window === 'undefined') return {}
      const raw = localStorage.getItem('dashboard_events')
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return
      localStorage.setItem('dashboard_events', JSON.stringify(events))
    } catch {
      // ignore
    }
  }, [events])

  const monthMatrix = useMemo(() => getMonthMatrix(viewDate.getFullYear(), viewDate.getMonth()), [viewDate])

  // No month navigation controls (kept intentionally minimal/clean)

  const selectedKey = formatDateKey(selected)
  const items = events[selectedKey] ?? []

  // Add event UI intentionally removed per request

  function removeEvent(id: string) {
    const key = selectedKey
    setEvents((prev) => ({ ...(prev ?? {}), [key]: (prev[key] ?? []).filter((e) => e.id !== id) }))
  }

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="text-sm font-medium">
          {viewDate.toLocaleString(undefined, { month: 'long' })} {viewDate.getFullYear()}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-xs text-center text-gray-500">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1 text-sm">
        {monthMatrix.map((week, i) =>
          week.map((day, j) => {
            const isToday = day ? day.toDateString() === today.toDateString() : false
            const isSelected = day ? day.toDateString() === selected.toDateString() : false
            const key = day ? formatDateKey(day) : `empty-${i}-${j}`
            return (
              <button
                key={key}
                onClick={() => day && setSelected(new Date(day))}
                className={`h-10 flex items-center justify-center rounded ${
                  isSelected ? 'bg-[#020E68] text-white' : 'bg-transparent text-gray-700 dark:text-gray-200'
                } ${isToday && !isSelected ? 'ring-1 ring-[#020E68]/20' : ''} hover:bg-gray-100 dark:hover:bg-gray-800`}
                aria-pressed={isSelected}
                disabled={!day}
              >
                {day ? day.getDate() : ''}
              </button>
            )
          })
        )}
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium">Events — {selectedKey}</h4>
        <div className="mt-2 space-y-2">
          {items.length === 0 && <div className="text-xs text-gray-500">No events</div>}
          {items.map((ev) => (
            <div key={ev.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
              <div className="text-sm">{ev.title}</div>
              <button onClick={() => removeEvent(ev.id)} className="text-xs text-red-500 ml-2">
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
