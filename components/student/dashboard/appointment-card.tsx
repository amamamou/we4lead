import { Calendar, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react'

interface AppointmentCardProps {
  doctor: string
  specialty?: string
  date: string
  time: string
  location: string
  isCompleted?: boolean
}

export function AppointmentCard({
  doctor,
  specialty,
  date,
  time,
  location,
  isCompleted
}: AppointmentCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-foreground text-base">{doctor}</h3>
            {isCompleted ? (
              <CheckCircle className="w-5 h-5 text-green-100 bg-green-50 rounded-full p-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-blue-100 bg-blue-50 rounded-full p-0.5" />
            )}
          </div>
          {specialty && <p className="text-sm text-gray-600">{specialty}</p>}
        </div>
        {!isCompleted && (
          <span className="text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 rounded">
            À venir
          </span>
        )}
        {isCompleted && (
          <span className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded">
            Complété
          </span>
        )}
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-3 text-sm text-foreground">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{date}</span>
          <Clock className="w-4 h-4 text-gray-400 ml-2" />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-foreground">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{location}</span>
        </div>
      </div>

    </div>
  )
}
