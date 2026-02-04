'use client'

import { useState } from 'react'
import { TabNavigation } from './dashboard/tab-navigation'
import { DoctorOverview } from './dashboard/doctor-overview'
import { AvailabilityForm } from './dashboard/availability-form'
import { AppointmentHistory } from './dashboard/appointment-history'
import { DoctorProfile } from './dashboard/doctor-profile'
import Footer from '../footer'

type TabType = 'overview' | 'availability' | 'history' | 'profile'

const doctorData = {
  name: 'Dr. Amira Ben Salem',
  email: 'amira.bensalem@univ-sousse.tn',
  phone: '+216 94 567 890',
  specialty: 'Psychologie Clinique',
  institution: 'Faculté de Médecine de Sousse',
  experience: '8 ans',
  licenseNumber: 'PSY-2018-001847',
  address: 'Salle 205, Faculté de Médecine, 4000 Sousse',
  avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop'
}

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  // tabs are defined inside the TabNavigation component for consistency

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Title */}
        <div className="pt-8 pb-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground">Dashboard Médecin</h1>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={(t) => setActiveTab(t)} />

        <div className="py-12">
          {activeTab === 'overview' && <DoctorOverview />}

          {activeTab === 'availability' && <AvailabilityForm />}

          {activeTab === 'history' && <AppointmentHistory />}

          {activeTab === 'profile' && (
            <DoctorProfile
              name={doctorData.name}
              email={doctorData.email}
              phone={doctorData.phone}
              specialty={doctorData.specialty}
              institution={doctorData.institution}
              experience={doctorData.experience}
              avatar={doctorData.avatar}
              licenseNumber={doctorData.licenseNumber}
              address={doctorData.address}
            />
          )}
        </div>
      </div>
            <Footer />
      
    </div>
  )
}
