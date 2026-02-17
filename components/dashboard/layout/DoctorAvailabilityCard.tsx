import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, Loader2 } from 'lucide-react'

type AvailabilityRange = {
  start: string
  end: string
  id?: string
}

type DayAvailability = {
  day: string
  ranges: AvailabilityRange[]
}

type Props = {
  doctorId?: string
  onEdit?: () => void
}

const DAY_NAME_FR: Record<string, string> = {
  Monday: 'Lundi',
  Tuesday: 'Mardi',
  Wednesday: 'Mercredi',
  Thursday: 'Jeudi',
  Friday: 'Vendredi',
  Saturday: 'Samedi',
  Sunday: 'Dimanche',
}

const DAY_ORDER: Record<string, number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

function minutesFromTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function totalMinutes(availability: DayAvailability[]) {
  return availability.reduce((sum, d) => {
    return sum + d.ranges.reduce((s, r) => s + (minutesFromTime(r.end) - minutesFromTime(r.start)), 0)
  }, 0)
}

function toFrenchDay(englishDay: string) {
  return DAY_NAME_FR[englishDay] || englishDay
}

export default function DoctorOwnAvailabilityCard({ doctorId, onEdit }: Props) {
  const [availability, setAvailability] = useState<DayAvailability[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        setLoading(true)
        setError(null)

        const token = localStorage.getItem('supabaseAccessToken')
        const userId = doctorId || localStorage.getItem('userId')
        
        if (!userId) {
          throw new Error('No user ID found')
        }

        // Determine which endpoint to use
        const url = token
          ? `${BACKEND_URL}/medecin/creneaux` // Authenticated endpoint for current doctor
          : `${BACKEND_URL}/public/doctors/${userId}/creneaux` // Public endpoint for viewing others

        const headers: HeadersInit = {}
        if (token) {
          headers.Authorization = `Bearer ${token}`
        }

        const response = await fetch(url, { headers })

        if (!response.ok) {
          throw new Error('Failed to fetch availability')
        }

        const data: Array<{ id: string; jour: string; debut: string; fin: string }> = await response.json()
        
        console.log('Raw availability data:', data)

        // Group by day and transform to the required format
        const groupedByDay = data.reduce((acc, item) => {
          const englishDay = item.jour // Backend returns French day names
          
          if (!acc[englishDay]) {
            acc[englishDay] = []
          }
          
          acc[englishDay].push({
            id: item.id,
            start: item.debut,
            end: item.fin
          })
          
          return acc
        }, {} as Record<string, AvailabilityRange[]>)

        // Convert to array format and sort by day order
        const transformed: DayAvailability[] = Object.entries(groupedByDay)
          .map(([day, ranges]) => ({
            day,
            ranges
          }))
          .sort((a, b) => (DAY_ORDER[a.day] || 0) - (DAY_ORDER[b.day] || 0))

        console.log('Transformed availability:', transformed)
        setAvailability(transformed)
      } catch (err) {
        console.error('Error fetching availability:', err)
        setError(err instanceof Error ? err.message : 'Failed to load availability')
      } finally {
        setLoading(false)
      }
    }

    fetchAvailability()
  }, [doctorId])

  // Calculate stats
  const days = availability.map((d) => toFrenchDay(d.day))
  const minutes = totalMinutes(availability)
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  const totalSlots = availability.reduce((sum, day) => sum + day.ranges.length, 0)

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
          <p className="text-sm text-gray-500">Chargement de vos disponibilités...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="text-center py-6">
          <p className="text-red-500 text-sm mb-3">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-xs text-blue-600 hover:underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  if (availability.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="text-center py-6">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Aucune disponibilité</h3>
          <p className="text-sm text-gray-500 mb-4">
            Vous n'avez pas encore configuré vos disponibilités.
          </p>
          <Link 
            href="/dashboard/availability" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
          >
            <Clock className="w-4 h-4" />
            Configurer mes disponibilités
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Your availability 
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Quick overview
        </p>
      </div>

      {/* Main content */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900 mb-3">
            Summary of your weekly availability
          </div>

          <div className="space-y-2">
            {days.map((d, index) => (
              <div key={index} className="flex items-center justify-between w-full px-3 py-2 text-sm bg-[#F9FAFB] text-gray-700 dark:bg-gray-700/20 dark:text-gray-200 rounded-md">
                <span>{d}</span>
                
              </div>
            ))}
          </div>

         
        </div>

        <div className="flex-shrink-0 text-left sm:text-right">
          <div className="text-3xl font-semibold text-gray-900">
            {hours}
            {mins ? <span className="text-base font-medium ml-1">h {mins}min</span> : <span className="text-base font-medium ml-1">h</span>}
          </div>
          <div className="text-sm text-gray-600 mt-1">
             {days.length} active day{days.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>


      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <div className="text-xs text-gray-400">
       Dernière mise à jour: {new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}

        </div>
        <div>
          {onEdit ? (
            <button 
              onClick={onEdit} 
              type="button" 
              className="text-sm text-gray-600 hover:text-blue-800 font-small hover:underline inline-flex items-center gap-1"
            >
        
              Manage my availability
            </button>
          ) : (
            <Link 
              href="/dashboard/availability" 
              className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline inline-flex items-center gap-1"
            >
              <Clock className="w-4 h-4" />
              Gérer mes disponibilités
            </Link>
          )}
        </div>
      </div>
    </div>
  )
} 