"use client"



import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Sidebar from '@/components/dashboard/layout/Sidebar'
import doctorMenu from '@/lib/dashboard/menus/doctor'
import Core from '@/components/dashboard/layout/Core'
import DoctorOwnAvailabilityCard from '@/components/dashboard/layout/DoctorAvailabilityCard'
import { DoctorsList } from '@/components/dashboard/layout/DoctorsList'
import { consultants } from '@/lib/consultant-data'
import UpcomingAppointments from '@/components/dashboard/layout/UpcomingAppointments'
import CalendarRendezvous from '@/components/dashboard/layout/CalendarRendezvous'
import AvailabilityPage from '@/components/dashboard/roles/doctor/availability/AvailabilityPage'
import { InstitutionTab } from '@/components/dashboard/layout/institution-tab'
import { ProfileTab } from '@/components/dashboard/layout/profile-tab'
import RightAside from '@/components/dashboard/layout/RightAside'
import DashboardFooter from '@/components/dashboard/layout/DashboardFooter'
import doctorRightAside from '@/lib/dashboard/configs/right.doctor'

export default function DoctorDashboard() {
  const searchParams = useSearchParams()
  // Prefer URL ?activeTab=...; if absent, fall back to a one-time localStorage hint set by the profile back button
  const paramTab = (searchParams?.get('activeTab') as
    | 'overview'
    | 'calendar'
    | 'availability'
    | 'doctors'
    | 'reports'
    | 'institutions'
    | 'account'
    | null)

  const storedTab = typeof window !== 'undefined' ? (localStorage.getItem('we4lead_activeTab') as
    | 'overview'
    | 'calendar'
    | 'availability'
    | 'doctors'
    | 'reports'
    | 'institutions'
    | 'account'
    | null) : null

  const initialTab = paramTab ?? storedTab ?? 'overview'

  const [activeTab, setActiveTab] = useState<typeof initialTab>(initialTab)

  // If we consumed a storedTab, remove it so it doesn't persist for subsequent visits
  if (storedTab) {
    try { localStorage.removeItem('we4lead_activeTab') } catch { /* ignore */ }
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <div className="flex flex-col md:flex-row">
  <Sidebar menu={doctorMenu} activeKey={activeTab} onChange={(k: string) => setActiveTab(k as 'overview' | 'calendar' | 'availability' | 'doctors' | 'reports' | 'institutions' | 'account')} />

  <Core
    role="doctor"
    showHero={activeTab !== 'calendar' && activeTab !== 'availability' && activeTab !== 'doctors' && activeTab !== 'institutions' && activeTab !== 'account'}
    onNavigate={(k: string) => setActiveTab(k as 'overview' | 'calendar' | 'availability' | 'doctors' | 'reports' | 'institutions' | 'account')}
  >
          {activeTab === 'calendar' ? (
            <CalendarRendezvous />
          ) : activeTab === 'availability' ? (
            <AvailabilityPage />
          ) : activeTab === 'doctors' ? (
            <DoctorsList consultants={consultants} />
          ) : activeTab === 'institutions' ? (
            <InstitutionTab />
          ) : activeTab === 'account' ? (
            <ProfileTab
              name="Alice Ben Ali"
              email="alice.benali@example.tn"
              phone="+216 98 765 432"
              enrollment="202400123"
              major="Médecine Générale"
              year="3ème année"
              institution="Faculté de Médecine de Sousse"
              avatar="/placeholder.svg"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DoctorOwnAvailabilityCard onEdit={() => setActiveTab('availability')} />
              <UpcomingAppointments />
            </div>
          )}
        </Core>

    {activeTab !== 'account' && (
      <RightAside widgets={doctorRightAside.widgets} actions={doctorRightAside.actions} activeTab={activeTab} />
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

