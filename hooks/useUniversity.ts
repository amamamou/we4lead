import { useState, useEffect, useCallback } from 'react'

interface University {
  id: number
  nom: string
  ville: string
  adresse: string
  telephone: string
  nbEtudiants: number
  horaire: string
  logoPath: string
  code: string
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

export function useUniversitiesByDoctorId(doctorId: string) {
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUniversities = useCallback(async () => {
    if (!doctorId) {
      console.log('[useUniversitiesByDoctorId] No doctorId provided')
      return
    }
    
    console.log('[useUniversitiesByDoctorId] Fetching universities for doctor:', doctorId)
    setLoading(true)
    setError(null)

    const token = localStorage.getItem('supabaseAccessToken')
    console.log('[useUniversitiesByDoctorId] Token exists:', !!token)
    
    try {
      const url = token 
        ? `${BACKEND_URL}/medecin/${doctorId}/universities`
        : `${BACKEND_URL}/public/doctors/${doctorId}/universities`
      
      console.log('[useUniversitiesByDoctorId] Fetching from URL:', url)
      
      const headers: HeadersInit = {}
      if (token) {
        headers.Authorization = `Bearer ${token}`
        console.log('[useUniversitiesByDoctorId] Using authenticated request')
      } else {
        console.log('[useUniversitiesByDoctorId] Using public endpoint')
      }

      const res = await fetch(url, { headers })
      console.log('[useUniversitiesByDoctorId] Response status:', res.status)
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        console.error('[useUniversitiesByDoctorId] Error response:', errorData)
        throw new Error(errorData.error || `Failed to fetch universities (status: ${res.status})`)
      }

      const data = await res.json()
      console.log('[useUniversitiesByDoctorId] Received data:', data)
      console.log('[useUniversitiesByDoctorId] Number of universities:', data.length)
      
      setUniversities(data)
    } catch (err: any) {
      console.error('[useUniversitiesByDoctorId] Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
      console.log('[useUniversitiesByDoctorId] Loading finished')
    }
  }, [doctorId])

  useEffect(() => {
    fetchUniversities()
  }, [fetchUniversities])

  return { universities, loading, error, refetch: fetchUniversities }
}

export function useMyUniversities() {
  const [universities, setUniversities] = useState<University[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMyUniversities = useCallback(async () => {
    console.log('[useMyUniversities] Fetching current user universities')
    
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) {
      console.error('[useMyUniversities] No authentication token found')
      setError('No authentication token')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const url = `${BACKEND_URL}/medecin/universities`
      console.log('[useMyUniversities] Fetching from URL:', url)
      
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log('[useMyUniversities] Response status:', res.status)
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        console.error('[useMyUniversities] Error response:', errorData)
        throw new Error(errorData.error || `Failed to fetch universities (status: ${res.status})`)
      }

      const data = await res.json()
      console.log('[useMyUniversities] Received data:', data)
      console.log('[useMyUniversities] Number of universities:', data.length)
      
      setUniversities(data)
    } catch (err: any) {
      console.error('[useMyUniversities] Error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
      console.log('[useMyUniversities] Loading finished')
    }
  }, [])

  useEffect(() => {
    fetchMyUniversities()
  }, [fetchMyUniversities])

  return { universities, loading, error, refetch: fetchMyUniversities }
}