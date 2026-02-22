'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import AdminDashboard from '@/components/admin-dashboard'
import StudentDashboard from '@/components/dashboard/roles/student/StudentDashboard'
import DoctorDashboard from '@/components/dashboard/roles/doctor/DoctorDashboard'

type Role = 'SUPER_ADMIN' | 'ADMIN' | 'MEDECIN' | 'ETUDIANT'

interface User {
  id: string
  email: string
  nom: string
  prenom: string
  telephone: string | null
  role: Role
  photoPath: string | null
}

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('supabaseAccessToken') 

    if (!token) {
      // 👇 Redirection vers login si pas de token
      router.push('/login')
      return
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          // 👇 Si erreur 401, rediriger vers login
          if (res.status === 401) {
            localStorage.removeItem('supabaseAccessToken')
            router.push('/login')
            return
          }
          throw new Error('Unauthorized')
        }

        const data = await res.json()
        const role = (data.role || '').toUpperCase() as Role

        setUser({
          id: data.id,
          email: data.email,
          nom: data.nom,
          prenom: data.prenom,
          telephone: data.telephone || null,
          role,
          photoPath: data.photoPath || null,
        })
      } catch (err) {
        console.error(err)
        setUser(null)
        // 👇 En cas d'erreur, rediriger vers login
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#020E68]"></div>
      </div>
    )
  }

  if (!user) {
    return null // Ne devrait pas arriver car redirigé
  }

  return (
    <>
      {user.role === 'ETUDIANT' && <StudentDashboard />}
      {user.role === 'MEDECIN' && <DoctorDashboard />}
      {user.role === 'ADMIN' && <AdminDashboard />}
      {user.role === 'SUPER_ADMIN' && <AdminDashboard isSuperAdmin={true} />}
    </>
  )
}