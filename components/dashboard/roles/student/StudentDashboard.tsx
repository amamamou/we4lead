"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Sidebar from '@/components/dashboard/layout/Sidebar'
import studentMenu from '@/lib/dashboard/menus/student'
import Core from '@/components/dashboard/layout/Core'
import FacultyDoctors from '@/components/dashboard/layout/FacultyDoctors'
import { DoctorsList } from '@/components/dashboard/layout/DoctorsList'
import { consultants } from '@/lib/consultant-data'
import UpcomingAppointments from '@/components/dashboard/layout/UpcomingAppointments'
import CalendarRendezvous from '@/components/dashboard/layout/CalendarRendezvous'
import { InstitutionTab } from '@/components/dashboard/layout/institution-tab'
import { ProfileTab } from '@/components/dashboard/layout/profile-tab'
import RightAside from '@/components/dashboard/layout/RightAside'
import DashboardFooter from '@/components/dashboard/layout/DashboardFooter'
import studentRightAside from '@/lib/dashboard/configs/right.student'

interface UserData {
  id: string
  email: string
  nom: string | null
  prenom: string | null
  telephone: string | null
  role: string
  photoPath: string | null
  universite: {
    id: number
    nom: string
    ville: string
    adresse: string
    code: string
    horaire: string | null
    logoPath: string
    nbEtudiants: number
    telephone: string
  } | null
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

export default function StudentDashboard() {
  const searchParams = useSearchParams()
  const [userId, setUserId] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [universityId, setUniversityId] = useState<string | null>(null)
  
  // Prefer URL ?activeTab=...; if absent, fall back to a one-time localStorage hint set by the profile back button
  const paramTab = (searchParams?.get('activeTab') as
    | 'overview'
    | 'calendar'
    | 'doctors'
    | 'reports'
    | 'institutions'
    | 'account'
    | null)

  const storedTab = typeof window !== 'undefined' ? (localStorage.getItem('we4lead_activeTab') as
    | 'overview'
    | 'calendar'
    | 'doctors'
    | 'reports'
    | 'institutions'
    | 'account'
    | null) : null

  const initialTab = paramTab ?? storedTab ?? 'overview'

  const [activeTab, setActiveTab] = useState<typeof initialTab>(initialTab)

  // Fetch university data if not in localStorage
  const fetchUniversityData = async (token: string) => {
    try {
      console.log('Fetching university data from /etudiant/university')
      const response = await fetch(`${BACKEND_URL}/etudiant/university`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.ok) {
        const universityData = await response.json()
        console.log('University data fetched:', universityData)
        
        if (universityData && universityData.id) {
          localStorage.setItem('universityId', universityData.id.toString())
          localStorage.setItem('universityName', universityData.nom)
          setUniversityId(universityData.id.toString())
          return universityData
        }
      } else {
        console.log('No university found for this student')
      }
    } catch (err) {
      console.error('Error fetching university data:', err)
    }
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('supabaseAccessToken')
        
        if (!token) {
          setError('No authentication token found')
          setLoading(false)
          return
        }

        const response = await fetch(`${BACKEND_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const data: UserData = await response.json()
        console.log('User data fetched:', data)
        
        setUserData(data)
        setUserId(data.id)
        
        // Store user data in localStorage
        localStorage.setItem('userId', data.id)
        localStorage.setItem('userRole', data.role.toLowerCase())
        
        // Check if university data is in the /me response
        if (data.universite) {
          localStorage.setItem('universityId', data.universite.id.toString())
          localStorage.setItem('universityName', data.universite.nom)
          setUniversityId(data.universite.id.toString())
        } else {
          // If no university in /me response, try to fetch it separately
          await fetchUniversityData(token)
        }
        
        setError(null)
      } catch (err) {
        console.error('Error fetching user data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Also check localStorage on mount for universityId
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUniversityId = localStorage.getItem('universityId')
      if (storedUniversityId) {
        setUniversityId(storedUniversityId)
      }
    }
  }, [])

  // If we consumed a storedTab, remove it so it doesn't persist for subsequent visits
  useEffect(() => {
    if (storedTab) {
      try { localStorage.removeItem('we4lead_activeTab') } catch { /* ignore */ }
    }
  }, [storedTab])

  // Breadcrumbs for student views: show when not on overview
  const tabLabelMap: Record<string, string> = {
    overview: 'Aperçu',
    calendar: 'Calendrier',
    doctors: 'Médecins',
    reports: 'Rapports',
    institutions: 'Instituts',
    account: 'Compte'
  }

  const breadcrumbs = [
    { label: 'Tableau de bord' },
    { label: tabLabelMap[activeTab] ?? activeTab }
  ]

  // Format user name from nom/prenom
  const formatUserName = () => {
    if (!userData) return 'Loading...'
    if (userData.prenom && userData.nom) {
      return `${userData.prenom} ${userData.nom}`
    }
    return userData.email.split('@')[0] || 'User'
  }

  if (loading && !userData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error && !userData) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row">
        <Sidebar menu={studentMenu} activeKey={activeTab} onChange={(k: string) => setActiveTab(k as 'overview' | 'calendar' | 'doctors' | 'reports' | 'institutions' | 'account')} />

        <Core
          role="student"
          breadcrumbs={breadcrumbs}
          showHero={activeTab !== 'calendar' && activeTab !== 'doctors' && activeTab !== 'institutions' && activeTab !== 'account'}
          onNavigate={(k: string) => setActiveTab(k as 'overview' | 'calendar' | 'doctors' | 'reports' | 'institutions' | 'account')}
        >
          {activeTab === 'calendar' ? (
            <CalendarRendezvous />
          ) : activeTab === 'doctors' ? (
            <DoctorsList consultants={consultants} />
          ) : activeTab === 'institutions' ? (
            <InstitutionTab doctorId={userId || undefined} />
          ) : activeTab === 'account' ? (
            <ProfileTab
              name={formatUserName()}
              email={userData?.email || ''}
              phone={userData?.universite?.telephone || '+216 00 000 000'}
              enrollment={userData?.universite?.code || 'Not available'}
              major={userData?.universite?.ville || 'Not specified'}
              year="Not specified" 
              institution={userData?.universite?.nom || 'Not specified'}
              avatar={userData?.photoPath || '/placeholder.svg'}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FacultyDoctors 
                onViewAll={() => setActiveTab('doctors')} 
                facultyId={universityId ? parseInt(universityId) : undefined}
              />
              <UpcomingAppointments onViewAll={() => setActiveTab('calendar')} />
            </div>
          )}
        </Core>

        {activeTab !== 'account' && (
          <RightAside widgets={studentRightAside.widgets} actions={studentRightAside.actions} activeTab={activeTab} />
        )}
      </div>

      {/* Mobile footer: show globally for non-overview tabs; for overview it's rendered inside RightAside */}
      {activeTab !== 'overview' && (
        <div className="md:hidden">
          <DashboardFooter />
        </div>
      )}
    </div>
  )
}