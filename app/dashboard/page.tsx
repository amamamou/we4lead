'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DesignaliCreative from '@/components/admin_panel/DesignaliCreative'

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
      router.push('/login')
      return
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
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
    return null
  }

  return (
    <>
      {user.role === 'SUPER_ADMIN' && <DesignaliCreative />}
    </>
  )
}