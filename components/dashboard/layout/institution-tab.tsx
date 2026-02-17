/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapPin, Phone, Mail, Globe } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState, useCallback } from 'react'

interface University {
  id: number
  nom: string
  ville: string
  adresse: string
  telephone: string
  nbEtudiants: number
  horaire: string | null
  logoPath: string
  code: string
  email?: string
  website?: string
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

export function InstitutionTab({ doctorId }: { doctorId?: string }) {
  const { isAuthenticated } = useAuth()
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [effectiveId, setEffectiveId] = useState<string | undefined>(doctorId)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId')
      const storedUserRole = localStorage.getItem('userRole')
      
      console.log('InstitutionTab - Reading from localStorage:', { 
        storedUserId, 
        storedUserRole,
        propDoctorId: doctorId 
      })

      setUserRole(storedUserRole)

      if (doctorId) {
        // If doctorId is provided as prop, use it (for doctor viewing another doctor)
        console.log('Using doctorId from props:', doctorId)
        setEffectiveId(doctorId)
      } else if (storedUserId) {
        // Otherwise use the logged-in user's ID
        console.log('Using userId from localStorage:', storedUserId)
        setEffectiveId(storedUserId)
      } else {
        console.log('No valid ID found')
        setEffectiveId(undefined)
      }
    }
  }, [doctorId])

  // 2. Fetch university/university data based on role
  const fetchUniversityData = useCallback(async () => {
    if (!effectiveId) {
      console.log('No effectiveId → skipping fetch')
      return
    }

    setLoading(true)
    setError(null)

    const token = localStorage.getItem('supabaseAccessToken')
    
    try {
      let url = ''
      const headers: HeadersInit = {}
      
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      // Choose endpoint based on role
      if (userRole?.toLowerCase() === 'medecin') {
        // Doctor: fetch their university/universities
        url = token
          ? `${BACKEND_URL}/medecin/${effectiveId}/university`
          : `${BACKEND_URL}/public/doctors/${effectiveId}/university`
      } else {
        // Student: fetch their university using the new endpoint
        url = token
          ? `${BACKEND_URL}/etudiant/university`  // This endpoint uses the JWT token
          : `${BACKEND_URL}/public/students/${effectiveId}/university` // Public fallback
      }

      console.log('Fetching from:', url)
      console.log('User role:', userRole)

      const res = await fetch(url, { headers })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${res.status}`)
      }

      const data = await res.json()
      console.log('Raw API response:', data)

      // Handle both array and single object responses
      const universitiesArray = Array.isArray(data) ? data : data ? [data] : []
      setUniversities(universitiesArray)

      console.log('Set universities:', universitiesArray)
    } catch (err: any) {
      console.error('Fetch error:', err)
      setError(err.message || 'Erreur lors du chargement des informations')
    } finally {
      setLoading(false)
    }
  }, [effectiveId, userRole])

  useEffect(() => {
    if (effectiveId && userRole) {
      fetchUniversityData()
    }
  }, [effectiveId, userRole, fetchUniversityData])

  // 3. Select first university (safely)
  const university = universities.length > 0 ? universities[0] : null

  const handleRetry = () => {
    fetchUniversityData()
  }

  // Determine title based on role
  const getTitle = () => {
    if (userRole?.toLowerCase() === 'medecin') {
      return university?.nom || 'Mon Université'
    }
    return university?.nom || 'Mon Université'
  }

  // ────────────────────────────────────────────────
  //               RENDERING
  // ────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="max-w-6xl space-y-10">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500">Chargement des informations...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl space-y-10">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <p className="text-red-500 text-center">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!university) {
    return (
      <div className="max-w-6xl space-y-10">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-500 mb-2">Aucune université trouvée</p>
              {!isAuthenticated && (
                <p className="text-sm text-gray-400">
                  Veuillez vous connecter pour voir les informations
                </p>
              )}
              {isAuthenticated && effectiveId && (
                <button
                  onClick={handleRetry}
                  className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Réessayer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Prepare display data
  const fullAddress = [university.adresse, university.ville]
    .filter(Boolean)
    .join(', ')

  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`
  const formattedPhone = university.telephone?.replace(/\s+/g, '')

  return (
    <div className="max-w-6xl space-y-10">
      {/* Identity Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-xl border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
            {university.logoPath ? (
              <Image
                src={university.logoPath}
                alt={university.nom}
                width={64}
                height={64}
                className="object-contain"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <span className="text-3xl font-semibold text-indigo-600">
                  {university.nom?.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              {userRole?.toLowerCase() === 'medecin' ? 'Mon Université' : 'Mon Université'}
            </p>
            <h2 className="text-xl font-semibold text-gray-900">{getTitle()}</h2>
            <p className="text-sm text-gray-500">{fullAddress || 'Adresse non disponible'}</p>
            {/* 'code' is intentionally not displayed anymore */}
          </div>
        </div>
      </div>

      {/* Contact + Location */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 space-y-6">
          <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">Contact</div>

          <div className="space-y-4">
            {university.adresse && (
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Adresse</div>
                  <div className="text-sm text-gray-900">{fullAddress}</div>
                </div>
              </div>
            )}

            {university.telephone && (
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Téléphone</div>
                  <a href={`tel:${formattedPhone}`} className="text-sm text-gray-900 hover:text-blue-600 transition">
                    {university.telephone}
                  </a>
                </div>
              </div>
            )}

            {university.email && (
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <a href={`mailto:${university.email}`} className="text-sm text-gray-900 hover:text-blue-600 transition">
                    {university.email}
                  </a>
                </div>
              </div>
            )}

            {university.website && (
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Site web</div>
                  <a
                    href={`https://${university.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-900 hover:text-blue-600 transition"
                  >
                    {university.website}
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex flex-wrap gap-3">
            {university.telephone && (
              <a
                href={`tel:${formattedPhone}`}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              >
                <Phone className="w-4 h-4" /> Appeler
              </a>
            )}
            {university.email && (
              <a
                href={`mailto:${university.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              >
                <Mail className="w-4 h-4" /> Email
              </a>
            )}
            {university.website && (
              <a
                href={`https://${university.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              >
                <Globe className="w-4 h-4" /> Site web
              </a>
            )}
          </div>
        </div>

        {/* Location */}
        {university.adresse && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 space-y-6">
            <div className="text-xs uppercase tracking-wider text-gray-400 font-medium">Localisation</div>

            <div className="w-full h-64 rounded-lg overflow-hidden border border-gray-200">
              <iframe
                src={mapsUrl}
                width="100%"
                height="100%"
                loading="lazy"
                className="border-0"
                title={`Carte de ${university.nom}`}
                allowFullScreen
              />
            </div>

            {university.ville && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Ville:</span> {university.ville}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Additional Info */}
      {(university.nbEtudiants || university.horaire) && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-4">
            Informations Complémentaires
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {university.nbEtudiants && (
              <div>
                <span className="text-sm text-gray-500">Nombre d'étudiants:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {university.nbEtudiants.toLocaleString()}
                </span>
              </div>
            )}
            {university.horaire && (
              <div>
                <span className="text-sm text-gray-500">Horaires:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">{university.horaire}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}