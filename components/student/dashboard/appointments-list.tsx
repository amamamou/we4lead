import { AppointmentCard } from './appointment-card'

interface Appointment {
  id: string
  doctor: string
  specialty: string
  date: string
  time: string
  location: string
  status: 'upcoming' | 'completed'
}

interface AppointmentsListProps {
  title: string
  appointments: Appointment[]
  isCompleted?: boolean
}

export function AppointmentsList({ title, appointments, isCompleted }: AppointmentsListProps) {
  if (appointments.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <p className="text-gray-600">Aucun rendez-vous</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      <div className="space-y-4">
        {appointments.map((apt) => (
          <AppointmentCard
            key={apt.id}
            doctor={apt.doctor}
            specialty={apt.specialty}
            date={apt.date}
            time={apt.time}
            location={apt.location}
            isCompleted={isCompleted}
          />
        ))}
      </div>
    </div>
  )
}
