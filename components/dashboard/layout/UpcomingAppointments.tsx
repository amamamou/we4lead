import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Clock, Loader2 } from 'lucide-react'

type Appt = {
  id: string
  token: string
  datetime: string
  doctor: string
  patient?: string
  status: string
}

type RdvResponse = {
  id: string
  date: string
  heure: string
  status: string
  medecin: {
    id: string
    nom: string
    prenom: string
    universites: Array<{ nom: string }>
  }
  etudiant: {
    id: string
    nom: string
    prenom: string
  }
}

type Props = {
  appointments?: Appt[]
  role?: 'doctor' | 'user' | 'student'
  onViewAll?: () => void
  limit?: number
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

// Format date to display format
function formatDateTime(date: string, time: string): string {
  const d = new Date(date + 'T' + time)
  return d.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).replace(',', ' •')
}

// Generate a simple token from ID
function generateToken(id: string): string {
  return 'T-' + id.slice(0, 4).toUpperCase()
}

export default function UpcomingAppointments({ 
  appointments: propAppointments, 
  role = 'user', 
  onViewAll,
  limit = 2 
}: Props) {
  const [appointments, setAppointments] = useState<Appt[]>(propAppointments || [])
  const [loading, setLoading] = useState(!propAppointments)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (propAppointments) {
      setAppointments(propAppointments)
      setLoading(false)
      return
    }

    const fetchAppointments = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem('supabaseAccessToken')
        const userRole = localStorage.getItem('userRole')
        
        if (!token) {
          // If no token, use sample data for demo
          setAppointments(SAMPLE)
          setLoading(false)
          return
        }

        // Determine endpoint based on role
        let endpoint = ''
        if (role === 'doctor' || userRole === 'medecin') {
          endpoint = `${BACKEND_URL}/medecin/rdvs/upcoming`
        } else {
          endpoint = `${BACKEND_URL}/etudiant/rdvs/upcoming`
        }

        console.log('Fetching appointments from:', endpoint)

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch appointments')
        }
 console.log(userRole)
        const data: RdvResponse[] = await response.json()

        
        // Transform to Appt format
        const transformed: Appt[] = data.map(rdv => {
          const doctorName = `Dr. ${rdv.medecin.prenom} ${rdv.medecin.nom}`
          const patientName = rdv.etudiant ? `${rdv.etudiant.prenom} ${rdv.etudiant.nom}` : 'Patient'
          
          return {
            id: rdv.id,
            token: generateToken(rdv.id),
            datetime: formatDateTime(rdv.date, rdv.heure),
            doctor: doctorName,
            patient: patientName,
            status: rdv.status
          }
        })

        setAppointments(transformed)
      } catch (err) {
        console.error('Error fetching appointments:', err)
       
        setError(err instanceof Error ? err.message : 'Failed to load appointments')
        // Fallback to sample data on error
        setAppointments(SAMPLE)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [propAppointments, role])

  // Helper to render a single row (appointment or placeholder) — compact spacing
  const renderRow = (a: Appt | undefined, idx: number) => (
    <div key={a?.id ?? `empty-${idx}`} className="flex items-center justify-between py-2">
      <div>
        {a ? (
          <>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{a.datetime}</div>
            <div className="text-sm text-gray-600">
              {role === 'doctor' ? a.patient : a.doctor}
            </div>
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
        {a?.status && a.status !== 'CONFIRMED' && (
          <div className={`text-xs mt-1 ${
            a.status === 'CANCELED' ? 'text-red-500' : 'text-yellow-500'
          }`}>
            {a.status.toLowerCase()}
          </div>
        )}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="p-3 bg-white rounded-lg shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin mr-2" />
          <span className="text-sm text-gray-500">Loading sessions...</span>
        </div>
      </div>
    )
  }

  if (error && appointments.length === 0) {
    return (
      <div className="p-3 bg-white rounded-lg shadow-sm dark:bg-gray-800">
        <div className="text-center py-4">
          <p className="text-sm text-red-500 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-xs text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (role === 'doctor') {
    // Doctor view: show up to limit upcoming appointments
    const rows: Array<Appt | undefined> = appointments.slice(0, limit)
    const hasMore = appointments.length > limit

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
            <p className="text-xs text-gray-500 mt-1">Your next appointments with patients.</p>
          </div>

          <div className="ml-4 mt-1">
            {onViewAll ? (
              <button type="button" onClick={onViewAll} aria-label="View all sessions" className="text-xs text-gray-500 hover:text-gray-700 hover:underline cursor-pointer transition-colors">
                {hasMore ? `View all (${appointments.length})` : 'View all'}
              </button>
            ) : (
              <Link href="/dashboard?activeTab=calendar" className="text-xs text-gray-500 hover:text-gray-700 hover:underline">
                {hasMore ? `View all (${appointments.length})` : 'View all'}
              </Link>
            )}
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-sm text-gray-400">No upcoming sessions</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {rows.map((a, idx) => renderRow(a, idx))}
          </div>
        )}
      </div>
    )
  }

  // Student view: show next appointment and last appointment
  const next = appointments[0]
  const last = appointments[1]

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
              <button type="button" onClick={onViewAll} aria-label="View all sessions" className="text-xs text-gray-500 hover:text-gray-700 hover:underline cursor-pointer transition-colors">
                {appointments.length > 1 ? `View all (${appointments.length})` : 'View all'}
              </button>
            ) : (
              <Link href="/dashboard?activeTab=calendar" className="text-xs text-gray-500 hover:text-gray-700 hover:underline">
                {appointments.length > 1 ? `View all (${appointments.length})` : 'View all'}
              </Link>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {next ? renderRow(next, 0) : (
            <div className="py-3 text-center">
              <p className="text-sm text-gray-400">No upcoming sessions</p>
            </div>
          )}
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
              <Link href="/dashboard?activeTab=calendar" className="text-xs text-gray-500 hover:text-gray-700 hover:underline">View all</Link>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {last ? renderRow(last, 1) : (
            <div className="py-3 text-center">
              <p className="text-sm text-gray-400">No past sessions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Sample data for fallback
const SAMPLE: Appt[] = [
  { 
    id: 'a1', 
    token: 'T-102', 
    datetime: 'Mon, 12 Apr • 10:00', 
    doctor: 'Pr. Selma Ben Youssef',
    patient: 'Amira Ben Salem',
    status: 'CONFIRMED'
  },
  { 
    id: 'a2', 
    token: 'T-118', 
    datetime: 'Tue, 13 Apr • 14:30', 
    doctor: 'Dr. Houssem K.',
    patient: 'Mohamed Ksontini',
    status: 'CONFIRMED'
  }
]