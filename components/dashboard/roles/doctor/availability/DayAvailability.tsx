import React, { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { validateRanges, findNextDefaultRange, toMinutes } from './utils'

type TimeRange = { start: string; end: string; id: string }

type Props = {
  day: string
  initial?: TimeRange[]
  onChange?: (ranges: TimeRange[]) => void
}

// time options limited to 08:30 - 18:00 in 30m steps
const timeOptions: string[] = (() => {
  const out: string[] = []
  const start = 8 * 60 + 30 // 08:30
  const end = 18 * 60 // 18:00
  for (let t = start; t <= end; t += 30) {
    const h = Math.floor(t / 60)
    const m = String(t % 60).padStart(2, '0')
    out.push(`${String(h).padStart(2, '0')}:${m}`)
  }
  return out
})()

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export default function DayAvailability({ day, initial = [], onChange }: Props) {
  const [enabled, setEnabled] = useState(initial.length > 0)
  const [ranges, setRanges] = useState<TimeRange[]>(initial)
  const [error, setError] = useState<string | null>(null)

  function emit(next: TimeRange[]) {
    const v = validateRanges(next)
    if (!v.ok) {
      setError(v.message ?? 'Invalid time range')
      // do not emit invalid state
      return
    }
    setError(null)
    setRanges(next)
    setEnabled(next.length > 0)
    onChange?.(next)
  }

  function addRange() {
    // add a 30-minute default range
    const candidate = findNextDefaultRange(ranges, 30)
    if (!candidate) {
      setError('No free 30m slot available between 08:30 and 18:00')
      return
    }
    const newRange = { ...candidate, id: uid() }
    const next = [...ranges, newRange]
    emit(next)
  }

  function updateRange(id: string, field: 'start' | 'end', value: string) {
    const cur = ranges.find(r => r.id === id)
    if (!cur) return

    if (field === 'start') {
      const newStart = value
      const minEndMinutes = toMinutes(newStart) + 30
      // find the nearest end option >= minEndMinutes
      const possibleEnd = timeOptions.find(t => toMinutes(t) >= minEndMinutes)
      if (!possibleEnd) {
        setError('Start time too late — no available end time within allowed window')
        return
      }
      const next = ranges.map(r => (r.id === id ? { ...r, start: newStart, end: (toMinutes(r.end) >= minEndMinutes ? r.end : possibleEnd) } : r))
      emit(next)
      return
    }

    // field === 'end'
    const next = ranges.map(r => (r.id === id ? { ...r, end: value } : r))
    emit(next)
  }

  function removeRange(id: string) {
    const next = ranges.filter(r => r.id !== id)
    // removal should be allowed even if it results empty
    setError(null)
    setRanges(next)
    if (next.length === 0) setEnabled(false)
    onChange?.(next)
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium">{day}</div>
          <div className="text-xs text-gray-500">{enabled ? 'On' : 'Off'}</div>
        </div>
        <Switch checked={enabled} onCheckedChange={(v: boolean) => { setEnabled(v); if (!v) { setRanges([]); onChange?.([]); setError(null) } }} />
      </div>

      {enabled && (
        <div className="mt-3 space-y-2">
          {ranges.map(r => (
            <div key={r.id} className="flex items-center gap-2">
              <select
                className="rounded-lg border px-3 py-1 text-sm"
                value={r.start}
                onChange={e => updateRange(r.id, 'start', e.target.value)}
              >
                {timeOptions
                  .filter(t => toMinutes(t) <= (18 * 60 - 30)) // prevent start at 18:00 which leaves no end
                  .map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
              </select>

              <span className="text-sm text-gray-500">—</span>

              <select
                className="rounded-lg border px-3 py-1 text-sm"
                value={r.end}
                onChange={e => updateRange(r.id, 'end', e.target.value)}
              >
                {timeOptions
                  .filter(t => toMinutes(t) >= toMinutes(r.start) + 30)
                  .map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
              </select>

              <button
                className="ml-auto text-sm text-red-500"
                onClick={() => removeRange(r.id)}
                aria-label={`Remove time range ${r.start}-${r.end}`}
              >
                ✕
              </button>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <button className="text-sm text-indigo-600 font-medium" onClick={addRange}>
              + Add Time Range
            </button>
            {error && <div className="text-sm text-red-500">{error}</div>}
          </div>
        </div>
      )}
    </div>
  )
}
