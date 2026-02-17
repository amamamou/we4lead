import React from 'react'
import Calendar from '@/components/dashboard/layout/Calendar'
import { Bell, Stethoscope, ArrowRight, Clock, User } from '@/components/ui/icons'
import UpcomingAppointments from '@/components/dashboard/layout/UpcomingAppointments'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'

// Dynamic Upcoming Widget Component
const UpcomingWidget = () => {
  const { user, isAuthenticated } = useAuth()
  const [nextAppointment, setNextAppointment] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNextAppointment = async () => {
      if (!isAuthenticated) {
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem('supabaseAccessToken')
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/medecin/rdvs `, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Upcoming appointments:', data)
          setNextAppointment(data[0] || null)
        }
      } catch (error) {
        console.error('Error fetching next appointment:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNextAppointment()
  }, [isAuthenticated])

  if (loading) {
    return (
      <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
        <li className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-xs text-gray-500">Loading...</div>
        </li>
      </ul>
    )
  }

  if (!nextAppointment) {
    return (
      <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
        <li className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-center gap-2">
          <Bell size={16} className="text-gray-400" />
          <div>
            <div className="font-medium text-sm">No upcoming consultations</div>
            <div className="text-xs text-gray-500">Your schedule is clear</div>
          </div>
        </li>
      </ul>
    )
  }

  // Format the appointment time
  const appointmentDate = new Date(nextAppointment.date + 'T' + nextAppointment.heure)
  const today = new Date()
  const isToday = appointmentDate.toDateString() === today.toDateString()
  
  const timeStr = appointmentDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
  
  const dateStr = isToday ? 'Today' : appointmentDate.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })

  return (
    <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
      <li className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer">
        <Bell size={16} className="text-blue-500" />
        <div className="flex-1">
          <div className="font-medium text-sm">
            {nextAppointment.etudiant?.prenom} {nextAppointment.etudiant?.nom}
          </div>
          <div className="text-xs text-gray-500">
            {dateStr}, {timeStr} • {nextAppointment.heure}
          </div>
        </div>
        <div className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
          Next
        </div>
      </li>
    </ul>
  )
}

// Dynamic Actions Component
const DynamicActions = () => {
  const { user, isAuthenticated } = useAuth()
  const [hasActiveConsultation, setHasActiveConsultation] = useState(false)

  useEffect(() => {
    // You can implement logic to check if there's an active consultation
    // For now, we'll just check if there's an appointment within the next 30 minutes
    const checkActiveConsultation = async () => {
      if (!isAuthenticated) return

      try {
        const token = localStorage.getItem('supabaseAccessToken')
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/medecin/rdvs/upcoming`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          const now = new Date()
          const hasSoonAppointment = data.some((apt: any) => {
            const aptTime = new Date(apt.date + 'T' + apt.heure)
            const diffMinutes = (aptTime.getTime() - now.getTime()) / (1000 * 60)
            return diffMinutes > 0 && diffMinutes <= 30
          })
          setHasActiveConsultation(hasSoonAppointment)
        }
      } catch (error) {
        console.error('Error checking active consultation:', error)
      }
    }

    checkActiveConsultation()
  }, [isAuthenticated])

  return (
    <>
      <button
        onClick={() => window.location.href = '/dashboard/consultations/active'}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
          hasActiveConsultation 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <Stethoscope className="w-4 h-4" />
          {hasActiveConsultation ? 'Continue consultation' : 'Start consultation'}
        </span>
        <ArrowRight className="w-4 h-4" />
      </button>

      <button
        onClick={() => window.open('/api/export/schedule', '_blank')}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <ArrowRight className="w-4 h-4 rotate-45" />
          Export schedule
        </span>
        <ArrowRight className="w-4 h-4 text-gray-400" />
      </button>

      <button
        onClick={() => window.location.href = '/dashboard/analytics'}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          <Clock className="w-4 h-4" />
          View analytics
        </span>
        <ArrowRight className="w-4 h-4 text-gray-400" />
      </button>
    </>
  )
}

export const doctorRightAside = {
  widgets: [
    {
      id: 'calendar',
      title: 'Calendar',
      content: <Calendar />,
      headerAction: { 
        id: 'thisMonth', 
        label: 'This month',
        onClick: () => window.location.href = '/dashboard/calendar'
      },
    },
    {
      id: 'upcoming',
      title: 'Upcoming',
      bare: true,
      content: <UpcomingWidget />,
    },
  ],
  actions: [
    {
      id: 'start-consult',
      label: 'Start consultation',
      icon: <Stethoscope className="w-4 h-4" />,
      primary: true,
      component: <DynamicActions />, // Custom component for actions
    },
  ],
}

// Alternative: If you prefer to keep the actions array structure
export const doctorRightAsideWithActions = {
  widgets: [
    {
      id: 'calendar',
      title: 'Calendar',
      content: <Calendar />,
      headerAction: { 
        id: 'thisMonth', 
        label: 'This month',
        onClick: () => window.location.href = '/dashboard/calendar'
      },
    },
    {
      id: 'upcoming',
      title: 'Upcoming',
      bare: true,
      content: <UpcomingWidget />,
    },
  ],
  actions: [
    {
      id: 'start-consult',
      label: 'Start consultation',
      icon: <Stethoscope className="w-4 h-4" />,
      primary: true,
      onClick: () => {
        // Check for next appointment and redirect
        const checkAndRedirect = async () => {
          const token = localStorage.getItem('supabaseAccessToken')
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/medecin/rdvs/upcoming`, {
              headers: { Authorization: `Bearer ${token}` }
            })
            const data = await response.json()
            if (data.length > 0) {
              window.location.href = `/dashboard/consultations/${data[0].id}`
            } else {
              window.location.href = '/dashboard/consultations/new'
            }
          } catch {
            window.location.href = '/dashboard/consultations/new'
          }
        }
        checkAndRedirect()
      },
    },
    {
      id: 'export',
      label: 'Export schedule',
      icon: <ArrowRight className="w-4 h-4 rotate-45" />,
      onClick: () => window.open('/api/export/schedule', '_blank'),
    },
    {
      id: 'analytics',
      label: 'View analytics',
      icon: <Clock className="w-4 h-4" />,
      onClick: () => window.location.href = '/dashboard/analytics',
    },
  ],
}

export default doctorRightAsideWithActions