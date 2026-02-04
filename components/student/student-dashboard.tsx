'use client'
import { useState } from 'react'
import { ConsultantsList } from '@/components/consultants'
import { consultants } from '@/lib/consultant-data'
import { TabNavigation } from '@/components/student/dashboard/tab-navigation'
import { OverviewTab } from '@/components/student/dashboard/overview-tab'
import { AppointmentsList } from '@/components/student/dashboard/appointments-list'
import { ProfileTab } from '@/components/student/dashboard/profile-tab'
import { InstitutionTab } from '@/components/student/dashboard/institution-tab'
import Footer from '@/components/footer'

type TabType = 'overview' | 'appointments' | 'profile' | 'institution' | 'doctors'

// Use consultants from shared data and filter for dashboard
const dashboardConsultants = consultants.filter(consultant => 
  ['FMS', 'FSEG', 'ISIMS'].includes(consultant.institutionCode)
)

interface Appointment {
  id: string
  doctor: string
  specialty: string
  date: string
  time: string
  location: string
  status: 'upcoming' | 'completed'
}

const studentData = {
  name: 'John Doe',
  email: 'john.doe@student.us.tn',
  phone: '+216 94 123 456',
  enrollment: 'STU-2024-001847',
  major: 'Psychologie Clinique',
  year: 'Master 1',
  institution: 'Faculté de Médecine de Sousse',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
}

const upcomingAppointments: Appointment[] = [
  {
    id: '1',
    doctor: 'Dr. Amira Ben Salem',
    specialty: 'Psychologie Clinique',
    date: '15 Février 2026',
    time: '14:30',
    location: 'Salle 205 - FMS',
    status: 'upcoming'
  },
  {
    id: '2',
    doctor: 'M. Sami Mansour',
    specialty: 'Thérapie Cognitive',
    date: '22 Février 2026',
    time: '10:00',
    location: 'Salle 101 - FMS',
    status: 'upcoming'
  }
]

const completedAppointments: Appointment[] = [
  {
    id: '3',
    doctor: 'Dr. Leila Trabelsi',
    specialty: 'Orientation Professionnelle',
    date: '8 Février 2026',
    time: '15:00',
    location: 'Salle 302 - FSEG',
    status: 'completed'
  },
  {
    id: '4',
    doctor: 'Dr. Nadia Khemiri',
    specialty: 'Gestion du Stress',
    date: '1 Février 2026',
    time: '11:30',
    location: 'Salle 450 - ISIMS',
    status: 'completed'
  }
]

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Title */}
        <div className="pt-12 pb-8">
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="py-12">
          {activeTab === 'overview' && <OverviewTab upcomingAppointments={upcomingAppointments} />}

          {activeTab === 'appointments' && (
            <div className="space-y-12">
              <AppointmentsList
                title="Rendez-vous à venir"
                appointments={upcomingAppointments}
              />
              <div className="border-t border-gray-200 pt-12">
                <AppointmentsList
                  title="Rendez-vous complétés"
                  appointments={completedAppointments}
                  isCompleted
                />
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <ProfileTab
              name={studentData.name}
              email={studentData.email}
              phone={studentData.phone}
              enrollment={studentData.enrollment}
              major={studentData.major}
              year={studentData.year}
              institution={studentData.institution}
              avatar={studentData.avatar}
            />
          )}

          {activeTab === 'institution' && <InstitutionTab />}

          {activeTab === 'doctors' && (() => {
            const institutionConsultants = dashboardConsultants.filter(consultant => 
              consultant.institutionCode === 'FMS'
            )
            const count = institutionConsultants.length
            
            return (
              <div className="space-y-8">
                {/* Title Section */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-foreground">
                    Consultants Disponibles
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {count} consultant{count > 1 ? 's' : ''} trouvé{count > 1 ? 's' : ''} pour votre institution
                    </span>
                  </div>
                </div>
                
                <ConsultantsList consultants={dashboardConsultants} />
              </div>
            )
          })()}
        </div>
      </div>
      <Footer />
    </div>
  )
}
