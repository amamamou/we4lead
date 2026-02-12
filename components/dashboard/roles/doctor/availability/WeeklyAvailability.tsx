import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import DayAvailability from './DayAvailability'
import AvailabilitySummary from './AvailabilitySummary'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']

type TimeRange = { start: string; end: string; id: string }

export default function WeeklyAvailability() {
  const [data, setData] = useState<Record<string, TimeRange[]>>(() => {
    // default empty
    return {}
  })

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const timerRef = useRef<number | null>(null)

  const totalHours = useMemo(() => {
    let sum = 0
    Object.values(data).forEach(ranges => {
      ranges.forEach(r => {
        const [sh, sm] = r.start.split(':').map(Number)
        const [eh, em] = r.end.split(':').map(Number)
        const start = sh + sm/60
        const end = eh + em/60
        const diff = Math.max(0, end - start)
        sum += diff
      })
    })
    return Math.round(sum*10)/10
  }, [data])

  const handleChange = useCallback((day: string, ranges: TimeRange[]) => {
    // update local state and schedule persistent save
    setData(prev => {
      const next = { ...prev, [day]: ranges }
      setSaving(true)
      setSaved(false)
      if (timerRef.current) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => {
        saveAvailability(next)
      }, 700) as unknown as number
      return next
    })
  }, [])

  async function saveAvailability(payload: Record<string, TimeRange[]>) {
    try {
      const res = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const json = await res.json()
      if (!res.ok || !json.ok) throw new Error(json?.error || 'Save failed')
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 1200)
    } catch (err) {
      // keep saving false but surface error via saved=false state
      setSaving(false)
      setSaved(false)
      // optionally show a toast here
      console.error('Failed to save availability', err)
    } finally {
      timerRef.current = null
    }
  }

  // load saved availability on mount
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/availability')
        const json = await res.json()
        if (mounted && json?.ok && json?.data) {
          setData(json.data)
        }
      } catch (err) {
        // ignore for now
        console.error('Failed to load availability', err)
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          

          <div className="space-y-3">
            {DAYS.map(d => (
              <DayAvailability
                key={d}
                day={d}
                initial={data[d] || []}
                onChange={(ranges) => handleChange(d, ranges)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="md:sticky md:top-24">
            <AvailabilitySummary totalHours={totalHours} saving={saving} saved={saved} />
          </div>
        </div>
      </div>
    </div>
  )
}
