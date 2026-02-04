import { Calendar, Stethoscope, FileCheck } from 'lucide-react'
import { StatCard } from './stat-card'
import { AppointmentsList } from './appointments-list'
import { CalendarWidget } from './calendar-widget'

interface Appointment {
  id: string
  doctor: string
  specialty: string
  date: string
  time: string
  location: string
  status: 'upcoming' | 'completed'
}

interface OverviewTabProps {
  upcomingAppointments: Appointment[]
}

export function OverviewTab({ upcomingAppointments }: OverviewTabProps) {
  return (
    <div className="space-y-8">
      {/* Stats Grid + Calendar */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Stats and Appointments */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <StatCard
              icon={<Calendar className="w-6 h-6 text-gray-400" />}
              label="Prochain RDV"
              value="15 Fév"
            />
            <StatCard
              icon={<Stethoscope className="w-6 h-6 text-gray-400" />}
              label="Consultants"
              value="5"
            />
            <StatCard
              icon={<FileCheck className="w-6 h-6 text-gray-400" />}
              label="Complétés"
              value="12"
            />
          </div>

          {/* Upcoming Appointments */}
          <AppointmentsList
            title="Rendez-vous à venir"
            appointments={upcomingAppointments.slice(0, 3)}
          />
        </div>

        {/* Right: Calendar */}
        <CalendarWidget />
      </div>
    </div>
  )
}
