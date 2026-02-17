import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Doctor = {
  id: string
  name: string
  specialty: string
  nextAvailable: string
  faculty: string
  facultyId?: number
}

type MedecinResponse = {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  universites: Array<{
    id: number
    nom: string
    code: string
  }>
  creneaux: Array<{
    id: string
    jour: string
    debut: string
    fin: string
  }>
}

type Props = {
  faculty?: string
  facultyId?: number
  doctors?: Doctor[]
  onViewAll?: () => void
  limit?: number
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

// Map French day names to English for display
const DAY_MAPPING: Record<string, string> = {
  'Lundi': 'Mon',
  'Mardi': 'Tue',
  'Mercredi': 'Wed',
  'Jeudi': 'Thu',
  'Vendredi': 'Fri',
  'Samedi': 'Sat',
  'Dimanche': 'Sun'
}

// Format next available slot
function formatNextAvailable(creneaux: Array<{ jour: string; debut: string }>): string {
  if (!creneaux || creneaux.length === 0) {
    return 'No slots available'
  }

  // Sort by day of week (Lundi = 1, etc.)
  const sorted = [...creneaux].sort((a, b) => {
    const dayOrder: Record<string, number> = {
      'Lundi': 1, 'Mardi': 2, 'Mercredi': 3, 'Jeudi': 4, 'Vendredi': 5, 'Samedi': 6, 'Dimanche': 7
    }
    return (dayOrder[a.jour] || 0) - (dayOrder[b.jour] || 0)
  })

  const first = sorted[0]
  const shortDay = DAY_MAPPING[first.jour] || first.jour.slice(0, 3)
  
  // For demo, we'll use a generic date
  // In production, you'd calculate the actual next date
  return `${shortDay} • ${first.debut}`
}

export default function FacultyDoctors({ 
  faculty: propFaculty, 
  facultyId: propFacultyId,
  doctors: propDoctors, 
  onViewAll,
  limit = 2 
}: Props) {
  const router = useRouter()
  const [doctors, setDoctors] = useState<Doctor[]>(propDoctors || [])
  const [loading, setLoading] = useState(!propDoctors)
  const [error, setError] = useState<string | null>(null)
  const [facultyName, setFacultyName] = useState<string>(propFaculty || '')

  // Get faculty from localStorage if not provided
  const getFacultyInfo = () => {
    if (typeof window === 'undefined') return { name: propFaculty, id: propFacultyId }

    const storedUniversityId = localStorage.getItem('universityId')
    const storedUniversityName = localStorage.getItem('universityName')
    
    return {
      name: propFaculty || storedUniversityName || '',
      id: propFacultyId || (storedUniversityId ? parseInt(storedUniversityId) : undefined)
    }
  }

  useEffect(() => {
    if (propDoctors) {
      setDoctors(propDoctors)
      setLoading(false)
      return
    }

    const fetchDoctors = async () => {
      try {
        setLoading(true)
        setError(null)

        const { name, id } = getFacultyInfo()
        setFacultyName(name)

        // If we have a faculty ID, fetch doctors for that specific university
        let url = id 
          ? `${BACKEND_URL}/public/users/universites/${id}/with-doctors`
          : `${BACKEND_URL}/public/users/medecins`

        console.log('Fetching doctors from:', url)

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to fetch doctors')
        }

        const data = await response.json()
        
        // Transform based on response type
        let transformed: Doctor[] = []
        
        if (id) {
          // Response is a single university with doctors array
          transformed = data.medecins?.map((m: MedecinResponse) => ({
            id: m.id,
            name: `Dr. ${m.prenom} ${m.nom}`,
            specialty: 'General Medicine', // You might want to add specialty to your backend
            nextAvailable: formatNextAvailable(m.creneaux || []),
            faculty: data.nom,
            facultyId: data.id
          })) || []
        } else {
          // Response is an array of doctors
          transformed = (data as MedecinResponse[]).map(m => ({
            id: m.id,
            name: `Dr. ${m.prenom} ${m.nom}`,
            specialty: 'General Medicine',
            nextAvailable: formatNextAvailable(m.creneaux || []),
            faculty: m.universites[0]?.nom || 'Unknown Faculty',
            facultyId: m.universites[0]?.id
          }))
        }

        // Filter by faculty name if we have one
        const filtered = facultyName 
          ? transformed.filter(d => d.faculty === facultyName)
          : transformed

        setDoctors(filtered)
      } catch (err) {
        console.error('Error fetching doctors:', err)
        setError(err instanceof Error ? err.message : 'Failed to load doctors')
        // Fallback to sample data on error
        setDoctors(SAMPLE)
      } finally {
        setLoading(false)
      }
    }

    fetchDoctors()
  }, [propDoctors, propFaculty, propFacultyId])

  const visible = doctors.slice(0, limit)
  const displayFaculty = facultyName || propFaculty || 'your faculty'

  const handleDoctorClick = (doctorId: string) => {
    router.push(`/dashboard/consultants/${doctorId}`)
  }

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-center py-6">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
          <span className="text-sm text-gray-500">Loading doctors...</span>
        </div>
      </div>
    )
  }

  if (error && doctors.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
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

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Doctors available in {displayFaculty}</h3>
          <p className="text-sm text-gray-500 mt-1">Doctors from your faculty and their next available slot.</p>
        </div>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {visible.length > 0 ? (
          visible.map((d) => (
            <div 
              key={d.id} 
              onClick={() => handleDoctorClick(d.id)}
              className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors px-2 -mx-2 rounded"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-none bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-300">
                  {d.name.split(' ').map(n => n[0]).slice(0,2).join('')}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{d.name}</div>
                  <div className="text-xs text-gray-500">{d.specialty}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-900 dark:text-gray-100">{d.nextAvailable}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-4 text-sm text-gray-500 text-center">
            No doctors found for your faculty.
          </div>
        )}
      </div>

      {doctors.length > limit && (
        <div className="mt-3 text-right">
          {onViewAll ? (
            <button
              type="button"
              onClick={onViewAll}
              aria-label={`View all doctors in ${displayFaculty}`}
              className="text-xs text-gray-500 hover:text-gray-700 hover:underline cursor-pointer transition-colors"
            >
              View all ({doctors.length})
            </button>
          ) : (
            <Link href="/dashboard/doctors" className="text-xs text-gray-500 hover:text-gray-700 hover:underline">
              View all ({doctors.length})
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

// Sample data for fallback
const SAMPLE: Doctor[] = [
  { id: 'd1', name: 'Pr. Selma Ben Youssef', specialty: 'Cardiology', nextAvailable: 'Mon • 10:00', faculty: 'Faculté A' },
  { id: 'd2', name: 'Dr. Houssem K.', specialty: 'Neurology', nextAvailable: 'Tue • 14:30', faculty: 'Faculté B' },
  { id: 'd3', name: 'Dr. Amina Gharbi', specialty: 'General Medicine', nextAvailable: 'Wed • 09:00', faculty: 'Faculté A' },
  { id: 'd4', name: 'Dr. Karim S.', specialty: 'Pediatrics', nextAvailable: 'Thu • 11:00', faculty: 'Faculté C' }
]