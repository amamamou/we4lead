type TimeRange = { start: string; end: string; id?: string }

export function toMinutes(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

export function validateRanges(ranges: TimeRange[]) {
  // normalize and sort
  const list = ranges
    .map(r => ({ start: r.start, end: r.end }))
    .sort((a, b) => toMinutes(a.start) - toMinutes(b.start))

  for (let i = 0; i < list.length; i++) {
    const cur = list[i]
    const s = toMinutes(cur.start)
    const e = toMinutes(cur.end)
    if (e <= s) return { ok: false, message: `End must be after start (${cur.start}–${cur.end})` }
    if (i > 0) {
      const prev = list[i - 1]
      const prevE = toMinutes(prev.end)
      if (s < prevE) return { ok: false, message: `Overlapping ranges (${prev.start}–${prev.end}) & (${cur.start}–${cur.end})` }
    }
  }

  return { ok: true }
}

export function findNextDefaultRange(existing: TimeRange[], length = 60) {
  // try to find a slot of `length` minutes between 08:30 and 18:00 not overlapping existing ranges
  const step = 30 // minutes
  const startMin = 8 * 60 + 30 // 08:30
  const endMin = 18 * 60 // 18:00

  const taken = existing.map(r => ({ s: toMinutes(r.start), e: toMinutes(r.end) }))

  for (let s = startMin; s + length <= endMin; s += step) {
    const e = s + length
    const conflict = taken.some(t => !(e <= t.s || s >= t.e))
    if (!conflict) {
      const sh = String(Math.floor(s / 60)).padStart(2, '0')
      const sm = String(s % 60).padStart(2, '0')
      const eh = String(Math.floor(e / 60)).padStart(2, '0')
      const em = String(e % 60).padStart(2, '0')
      return { start: `${sh}:${sm}`, end: `${eh}:${em}` }
    }
  }

  return null
}
