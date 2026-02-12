'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/header'

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
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('supabaseAccessToken') 

    if (!token) {
      setLoading(false)
      return
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error('Unauthorized')

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
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return (
      <>
        <Header />
        <div className="pt-32 text-center">Chargement...</div>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="pt-32 text-center text-red-500">
          Veuillez vous connecter
        </div>
      </>
    )
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
