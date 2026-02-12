"use client"

import React, { useMemo, useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, ArrowRight } from '@/components/ui/icons'

type Appointment = {
  id: string
  date: string // ISO date
  time: string // e.g. '14:00'
  therapist: string
  faculty?: string
  mode?: 'online' | 'in-person'
  location?: string
  notes?: string
  status?: 'confirmed' | 'pending' | 'cancelled'
}

// generate a few demo appointments (past and upcoming) across faculties
const days = (n: number) => new Date(Date.now() + n * 24 * 60 * 60 * 1000)
const seed: Appointment[] = [
  // user-requested upcoming rendez-vous (kept as explicit date/time)
  { id: 'a1', date: '2026-02-08', time: '10:00', therapist: 'Pr. Selma Ben Youssef', faculty: "Faculté A", mode: 'online', location: 'Zoom', notes: '', status: 'confirmed' },
  { id: 'a2', date: days(-2).toISOString().slice(0, 10), time: '11:30', therapist: 'Mr. Ali Ben', faculty: "Faculté A", mode: 'online', location: 'Zoom', notes: 'Short check-in', status: 'confirmed' },
  { id: 'a3', date: days(-1).toISOString().slice(0, 10), time: '14:00', therapist: 'Dr. Sana Khabir', faculty: "Faculté B", mode: 'in-person', location: 'Room 12', notes: '', status: 'cancelled' },
  { id: 'a4', date: days(0).toISOString().slice(0, 10), time: '10:30', therapist: 'Dr. Emna J.', faculty: "Faculté A", mode: 'in-person', location: 'Counselling Hub', notes: 'Student card is needed.', status: 'confirmed' },
  { id: 'a5', date: days(1).toISOString().slice(0, 10), time: '15:00', therapist: 'Pr. Selma Ben', faculty: "Faculté A", mode: 'online', location: 'Zoom', notes: 'New intake', status: 'pending' },
  { id: 'a6', date: days(3).toISOString().slice(0, 10), time: '09:00', therapist: 'Dr. Houssem K.', faculty: "Faculté A", mode: 'in-person', location: 'Room 5', notes: '', status: 'confirmed' },
  { id: 'a7', date: days(5).toISOString().slice(0, 10), time: '13:00', therapist: 'Dr. Karim S.', faculty: "Faculté C", mode: 'in-person', location: 'Room 7', notes: '', status: 'confirmed' },
  { id: 'a8', date: days(8).toISOString().slice(0, 10), time: '16:00', therapist: 'Dr. Leila Mansour', faculty: "Faculté A", mode: 'online', location: 'Zoom', notes: 'Support session', status: 'pending' }
  ,
  // four additional random past confirmed appointments
  { id: 'a9', date: days(-20).toISOString().slice(0, 10), time: '08:30', therapist: 'Dr. Youssef Trabelsi', faculty: "Faculté A", mode: 'in-person', location: 'Room 2', notes: 'Initial consult', status: 'confirmed' },
  { id: 'a10', date: days(-14).toISOString().slice(0, 10), time: '10:00', therapist: 'Dr. Amina Ghazali', faculty: "Faculté A", mode: 'online', location: 'Zoom', notes: 'Assessment', status: 'confirmed' },
  { id: 'a11', date: days(-11).toISOString().slice(0, 10), time: '12:30', therapist: 'Mr. Hichem L.', faculty: "Faculté B", mode: 'in-person', location: 'Room 6', notes: '', status: 'confirmed' },
  { id: 'a12', date: days(-5).toISOString().slice(0, 10), time: '09:15', therapist: 'Dr. Monia R.', faculty: "Faculté A", mode: 'in-person', location: 'Room 1', notes: 'Closure session', status: 'confirmed' }
]

export default function CalendarRendezvous({ faculty = seed[0].faculty }: { faculty?: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const raw = localStorage.getItem('we4lead_appointments')
      return raw ? JSON.parse(raw) : seed
    } catch {
      return seed
    }
  })

  

  // persist simple local copy so the UI feels stateful
  React.useEffect(() => {
    try {
      localStorage.setItem('we4lead_appointments', JSON.stringify(appointments))
    } catch {}
  }, [appointments])

  const initials = (name = '') => name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
  const [pastQuery, setPastQuery] = useState<string>('')
  const [pastPage, setPastPage] = useState<number>(1)
  const PAGE_SIZE = 5

  function resetDemoData() {
    try {
      localStorage.removeItem('we4lead_appointments')
    } catch {}
    setAppointments(seed)
  }

  // Always limit to the same faculty and pick the next upcoming non-cancelled appointment
  const { upcoming, past } = useMemo(() => {
    const now = new Date()
    // Only include confirmed appointments. Ensure we always show at least one upcoming (fallback to all faculties if needed).
    let list = appointments
      .filter((a) => a.faculty === faculty)
      .filter((a) => a.status === 'confirmed')
      .map((a) => ({ ...a, datetime: new Date(a.date + 'T' + (a.time || '00:00')) }))
      .sort((x, y) => x.datetime.getTime() - y.datetime.getTime())

    if (list.length === 0) {
      list = appointments
        .filter((a) => a.status === 'confirmed')
        .map((a) => ({ ...a, datetime: new Date(a.date + 'T' + (a.time || '00:00')) }))
        .sort((x, y) => x.datetime.getTime() - y.datetime.getTime())
    }

    // upcoming: only the next confirmed appointment
    const upcomingAll = list.filter((a) => a.datetime >= now)
    const upcoming = upcomingAll.slice(0, 1)
    const past = list.filter((a) => a.datetime < now)
    return { upcoming, past }
  }, [appointments, faculty])

  // reset pagination when filters or data change
  useEffect(() => {
    // only reset if we're not already on page 1; schedule async to avoid synchronous setState inside effect
    if (pastPage !== 1) {
      const t = setTimeout(() => setPastPage(1), 0)
      return () => clearTimeout(t)
    }
    return
  }, [pastQuery, appointments, faculty, pastPage])

  function cancelAppointment(id: string) {
    setAppointments((s) => s.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)))
  }

  

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">

        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">Upcoming sessions</h3>
            <p className="text-sm text-gray-500 mt-1">Upcoming sessions you can join or get directions for.</p>
          </div>
          <div className="ml-4">
            <button onClick={resetDemoData} className="text-sm text-[#020E68] hover:underline">Reset demo data</button>
          </div>
        </div>

          {upcoming.length === 0 ? (
            <div className="p-6 text-center text-gray-600">No upcoming sessions.</div>
          ) : (
            <div className="space-y-2">
              {upcoming.map((a) => (
                <div key={a.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition border">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-none bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700">{initials(a.therapist)}</div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{a.therapist}</div>
                      <div className="text-xs text-gray-500">{a.faculty}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1"><strong>{a.date}</strong> · {a.time} · {a.location}</div>
                    <div className="text-sm text-gray-600 mt-2">{a.notes}</div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className={`text-xs px-2 py-0.5 rounded inline-flex items-center gap-1 ${a.status === 'confirmed' ? 'bg-green-100 text-green-800' : a.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {a.status === 'confirmed' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                      <span className="capitalize">{a.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {a.mode === 'online' ? (
                        <button className="text-xs px-2 py-1 rounded-md bg-[#020E68] text-white inline-flex items-center gap-2">
                          <ArrowRight size={14} />
                          Join
                        </button>
                      ) : null}
                      <button onClick={() => cancelAppointment(a.id)} className="text-xs px-2 py-1 rounded-md border text-red-600 inline-flex items-center gap-2">
                        <AlertCircle size={14} />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
          <div className="mb-3">
          <h3 className="text-lg font-semibold">Past sessions</h3>
          <p className="text-sm text-gray-500 mt-1">Previous sessions.</p>
        </div>

        {past.length === 0 ? (
          <div className="p-6 text-center text-gray-600">No past sessions.</div>
        ) : (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div />
              <div className="flex items-center gap-2">
                <input
                  value={pastQuery}
                  onChange={(e) => setPastQuery(e.target.value)}
                  placeholder="Search past sessions"
                  className="text-sm px-3 py-2 border rounded-md w-auto"
                />
              </div>
            </div>

            <div className="space-y-2">
              {(() => {
                const filtered = past.filter((a) => {
                  if (!pastQuery) return true
                  const q = pastQuery.toLowerCase()
                  return a.therapist.toLowerCase().includes(q) || (a.notes || '').toLowerCase().includes(q)
                })

                const total = filtered.length
                const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
                const start = (pastPage - 1) * PAGE_SIZE
                const pageItems = filtered.slice(start, start + PAGE_SIZE)

                return (
                  <>
                    {pageItems.map((a) => (
                      <div key={a.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition border">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-none bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700">{initials(a.therapist)}</div>
                        </div>

                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{a.therapist}</div>
                          <div className="text-xs text-gray-500">{a.faculty} · {a.date} · {a.time}</div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className={`text-xs px-2 py-0.5 rounded inline-flex items-center gap-1 ${a.status === 'confirmed' ? 'bg-green-100 text-green-800' : a.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {a.status === 'confirmed' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                            <span className="capitalize">{a.status}</span>
                          </div>
                          {/* Details button removed per request */}
                        </div>
                      </div>
                    ))}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-gray-500">Showing {start + 1}–{Math.min(start + PAGE_SIZE, total)} of {total}</div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPastPage((p) => Math.max(1, p - 1))}
                          disabled={pastPage === 1}
                          className={`text-sm px-2 py-1 rounded-md border ${pastPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Prev
                        </button>
                        <div className="text-sm">{pastPage} / {totalPages}</div>
                        <button
                          onClick={() => setPastPage((p) => Math.min(totalPages, p + 1))}
                          disabled={pastPage === totalPages}
                          className={`text-sm px-2 py-1 rounded-md border ${pastPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
