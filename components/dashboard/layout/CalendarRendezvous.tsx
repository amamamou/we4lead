"use client"

import React, { useMemo, useState, useEffect } from 'react'
import { CheckCircle, AlertCircle, ArrowRight, Calendar, XCircle } from '@/components/ui/icons'
import { useAuth } from '@/contexts/AuthContext'

type Appointment = {
  id: string
  date: string           // "2026-12-26"
  time: string           // "15:00" ← from "heure"
  therapist?: string
  therapistId?: string
  patient?: string
  patientId?: string
  faculty?: string
  facultyId?: number
  mode?: 'online' | 'in-person'
  location?: string
  notes?: string
  status: 'confirmed' | 'cancelled'
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

export default function CalendarRendezvous({ faculty }: { faculty?: string }) {
  const { user, token, isAuthenticated } = useAuth()

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [pastQuery, setPastQuery] = useState('')
  const [pastPage, setPastPage] = useState(1)
  const PAGE_SIZE = 5

  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [newDate, setNewDate] = useState('')
  const [newTime, setNewTime] = useState('')

  const userRole = typeof window !== 'undefined'
    ? localStorage.getItem('userRole') || user?.role || 'etudiant'
    : 'etudiant'

  // ── Fetch real data from backend ────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !token) {
      setError("Veuillez vous connecter pour voir vos rendez-vous")
      setLoading(false)
      return
    }

    const fetchRdvs = async () => {
      try {
        setLoading(true)
        setError(null)

        const prefix = userRole === 'medecin' ? 'medecin' : 'etudiant'
        const res = await fetch(`${BACKEND_URL}/${prefix}/rdvs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error(`Erreur ${res.status}`)
        }

        const raw = await res.json()

        const mapped = raw.map((item: any) => {
          const rawStatus = (item.status || '').toUpperCase()
          const status = rawStatus === 'CANCELED' ? 'cancelled' : 'confirmed'

          if (userRole === 'medecin') {
            const etu = item.etudiant || {}
            const uni = etu.universite || {}
            return {
              id: item.id,
              date: item.date,
              time: item.heure,
              patient: etu.prenom && etu.nom ? `${etu.prenom} ${etu.nom}` : (etu.email || 'Étudiant inconnu'),
              patientId: etu.id,
              faculty: uni.nom || '—',
              facultyId: uni.id,
              mode: uni.adresse ? 'in-person' : 'online',
              location: uni.adresse || 'En ligne',
              notes: `Rdv avec ${etu.prenom || 'étudiant'}`,
              status,
            }
          }

          // etudiant view
          const doc = item.medecin || {}
          const uni = doc.universites?.[0] || {}
          return {
            id: item.id,
            date: item.date,
            time: item.heure,
            therapist: `Dr. ${doc.prenom || ''} ${doc.nom || 'Médecin'}`,
            therapistId: doc.id,
            faculty: uni.nom || '—',
            facultyId: uni.id,
            mode: uni.adresse ? 'in-person' : 'online',
            location: uni.adresse || 'En ligne',
            notes: `Rdv avec Dr. ${doc.nom || ''}`,
            status,
          }
        })

        setAppointments(mapped)
      } catch (err: any) {
        console.error(err)
        setError("Impossible de charger les rendez-vous du serveur")
      } finally {
        setLoading(false)
      }
    }

    fetchRdvs()
  }, [isAuthenticated, token, userRole])

  const initials = (name = '') =>
    name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?'

  // ── Split upcoming vs history ───────────────────────────────────────
  const { upcoming, history } = useMemo(() => {
    const now = new Date()

    let list = appointments
    if (faculty) {
      list = list.filter(a => a.faculty === faculty)
    }

    const withDt = list.map(a => ({
      ...a,
      datetime: new Date(`${a.date}T${a.time}:00`),
    }))

    const sorted = withDt.sort((a, b) => a.datetime.getTime() - b.datetime.getTime())

    const upcomingList = sorted.filter(a => a.datetime >= now && a.status === 'confirmed')

    return {
      upcoming: upcomingList.length > 0 ? [upcomingList[0]] : [],
      history: sorted.filter(a => a.datetime < now || a.status === 'cancelled'),
    }
  }, [appointments, faculty])

  const filteredHistory = useMemo(() => {
    if (!pastQuery) return history
    const q = pastQuery.toLowerCase()
    return history.filter(a => {
      const who = userRole === 'medecin' ? (a.patient || '') : (a.therapist || '')
      return (
        who.toLowerCase().includes(q) ||
        a.date.includes(q) ||
        (a.faculty || '').toLowerCase().includes(q) ||
        (a.notes || '').toLowerCase().includes(q)
      )
    })
  }, [history, pastQuery, userRole])

  const paginated = filteredHistory.slice((pastPage - 1) * PAGE_SIZE, pastPage * PAGE_SIZE)
  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / PAGE_SIZE))

  useEffect(() => {
    setPastPage(1)
  }, [pastQuery, faculty])

  // ── Actions ─────────────────────────────────────────────────────────
  const cancelAppointment = async (id: string) => {
    try {
      const prefix = userRole === 'medecin' ? 'medecin' : 'etudiant'
      const res = await fetch(`${BACKEND_URL}/${prefix}/rdvs/${id}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error()

      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a))
    } catch {
      setError("Échec de l'annulation")
    }
  }

  const deleteAppointment = async (id: string) => {
    try {
      const prefix = userRole === 'medecin' ? 'medecin' : 'etudiant'
      const res = await fetch(`${BACKEND_URL}/${prefix}/rdvs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) throw new Error()

      setAppointments(prev => prev.filter(a => a.id !== id))
    } catch {
      setError("Échec de la suppression")
    }
  }

  // ── Render ──────────────────────────────────────────────────────────
  if (loading) {
    return <div className="p-8 text-center">Chargement des rendez-vous...</div>
  }
const TIME_OPTIONS = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00", "18:30", "19:00",
] as const;
const rescheduleAppointment = async (id: string, newDate: string, newTime: string) => {
  try {
    const prefix = userRole === 'medecin' ? 'medecin' : 'etudiant'

    const res = await fetch(`${BACKEND_URL}/${prefix}/rdvs/${id}`, {
      method: 'PUT',                    // or PATCH — depends on your backend
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: newDate,
        heure: newTime,                 // ← important: backend likely expects "heure", not "time"
        // Add other fields only if your backend requires them, e.g.:
        // status: 'confirmed',
      }),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      throw new Error(`Erreur ${res.status}: ${errText || 'Mise à jour échouée'}`)
    }
    setAppointments(prev =>
      prev.map(ap =>
        ap.id === id ? { ...ap, date: newDate, time: newTime } : ap
      )
    )

    return true
  } catch (err: any) {
    console.error('Reschedule failed:', err)
    setError(`Échec de la modification : ${err.message || 'Erreur inconnue'}`)
    return false
  }
}
  return (
    <div className="space-y-4">
      {/* Upcoming */}
      <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {userRole === 'medecin' ? 'Prochains patients' : 'Sessions à venir'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {userRole === 'medecin' ? 'Vos prochaines consultations.' : 'Vos prochains rendez-vous.'}
            </p>
          </div>
        </div>

        {upcoming.length === 0 ? (
          <div className="p-6 text-center text-gray-600">Aucune session à venir.</div>
        ) : (
          upcoming.map(a => (
            <div key={a.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition border">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-none bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700">
                  {initials(userRole === 'medecin' ? a.patient : a.therapist)}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {userRole === 'medecin' ? a.patient : a.therapist}
                  </div>
                  <div className="text-xs text-gray-500">{a.faculty}</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  <strong>{a.date}</strong> · {a.time} · {a.location}
                </div>
                {a.notes && <div className="text-sm text-gray-600 mt-2">{a.notes}</div>}
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800 inline-flex items-center gap-1">
                  <CheckCircle size={12} />
                  Confirmé
                </div>

                <div className="flex items-center gap-2">
                  {a.mode === 'online' && (
                    <button className="text-xs px-2 py-1 rounded-md bg-[#020E68] text-white inline-flex items-center gap-2 hover:bg-opacity-90">
                      <ArrowRight size={14} />
                      Rejoindre
                    </button>
                  )}
                  <button
                    onClick={() => cancelAppointment(a.id)}
                    className="text-xs px-2 py-1 rounded-md border text-red-600 inline-flex items-center gap-2 hover:bg-red-50"
                  >
                    <AlertCircle size={14} />
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAppointment(a)
                      setNewDate(a.date)
                      setNewTime(a.time)
                      setShowRescheduleModal(true)
                    }}
                    className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-200 inline-flex items-center gap-2 hover:bg-blue-100"
                  >
                    <Calendar size={14} />
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* History */}
      <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
        <div className="mb-3">
          <h3 className="text-lg font-semibold">Sessions passées</h3>
          <p className="text-sm text-gray-500 mt-1">Historique de vos rendez-vous.</p>
        </div>

        {history.length === 0 ? (
          <div className="p-6 text-center text-gray-600">Aucune session passée.</div>
        ) : (
          <div>
            <div className="mb-3 flex items-center justify-end">
              <input
                value={pastQuery}
                onChange={e => setPastQuery(e.target.value)}
                placeholder="Rechercher dans l'historique..."
                className="text-sm px-3 py-2 border rounded-md w-64 focus:outline-none focus:ring-2 focus:ring-[#020E68]"
              />
            </div>

            <div className="space-y-2">
              {(() => {
                const total = filteredHistory.length
                const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
                const start = (pastPage - 1) * PAGE_SIZE
                const pageItems = filteredHistory.slice(start, start + PAGE_SIZE)

                return (
                  <>
                    {pageItems.map(a => (
                      <div
                        key={a.id}
                        className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition border ${
                          a.status === 'cancelled' ? 'opacity-75' : ''
                        }`}
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-none bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700">
                            {initials(userRole === 'medecin' ? a.patient : a.therapist)}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {userRole === 'medecin' ? a.patient : a.therapist}
                          </div>
                          <div className="text-xs text-gray-500">
                            {a.faculty} · {a.date} · {a.time}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div
                            className={`text-xs px-2 py-0.5 rounded inline-flex items-center gap-1 ${
                              a.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {a.status === 'confirmed' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                            <span className="capitalize">{a.status === 'confirmed' ? 'Confirmé' : 'Annulé'}</span>
                          </div>

                         
                        </div>
                      </div>
                    ))}

                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        Affichage {start + 1}–{Math.min(start + PAGE_SIZE, total)} sur {total}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPastPage(p => Math.max(1, p - 1))}
                          disabled={pastPage === 1}
                          className={`text-sm px-3 py-1 rounded-md border ${pastPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                        >
                          Précédent
                        </button>
                        <div className="text-sm">{pastPage} / {totalPages}</div>
                        <button
                          onClick={() => setPastPage(p => Math.min(totalPages, p + 1))}
                          disabled={pastPage === totalPages}
                          className={`text-sm px-3 py-1 rounded-md border ${pastPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                        >
                          Suivant
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

      {/* Reschedule modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Modifier le rendez-vous</h3>
            <p className="text-sm text-gray-600 mb-4">
              Avec {userRole === 'medecin' ? selectedAppointment.patient : selectedAppointment.therapist}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nouvelle date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#020E68]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nouvelle heure</label>
                <select
                  value={newTime}
                  onChange={e => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#020E68]"
                >
                  {TIME_OPTIONS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
  onClick={async () => {
    if (!selectedAppointment) return

    const success = await rescheduleAppointment(
      selectedAppointment.id,
      newDate,
      newTime
    )

    if (success) {
      setShowRescheduleModal(false)
      setSelectedAppointment(null)
    }
  }}
  disabled={!newDate || !newTime} 
  className="px-4 py-2 text-sm bg-[#020E68] text-white rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
>
  Confirmer
</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}