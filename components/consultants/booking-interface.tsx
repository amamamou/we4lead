'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Clock, ArrowLeft, Check } from 'lucide-react'
import { Consultant } from '@/types/consultant'

interface BookingInterfaceProps {
  consultant: Consultant
  selectedDate: Date | undefined
  setSelectedDate: (date: Date | undefined) => void
  selectedTime: string
  setSelectedTime: (time: string) => void
  selectedSessionType: string
  setSelectedSessionType: (type: string) => void
  getAvailableTimesForDate: (date: Date) => string[]
  onBook: () => void
}

export function BookingInterface({ 
  consultant, 
  selectedDate, 
  setSelectedDate, 
  selectedTime, 
  setSelectedTime, 
  selectedSessionType, 
  setSelectedSessionType,
  getAvailableTimesForDate,
  onBook 
}: BookingInterfaceProps) {
  const availableTimes = selectedDate ? getAvailableTimesForDate(selectedDate) : []
  
  // Auto-select the first (and only) session type if not already selected
  useEffect(() => {
    if (consultant.sessionTypes && consultant.sessionTypes.length > 0 && !selectedSessionType) {
      setSelectedSessionType(consultant.sessionTypes[0].type)
    }
  }, [consultant.sessionTypes, selectedSessionType, setSelectedSessionType])

  return (
    <div className="space-y-8">
      {/* Step 2: Confirmation (replaces everything when both date and time are selected) */}
      {selectedDate && selectedTime ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">2. Confirmation</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div><strong>Date:</strong> {selectedDate?.toLocaleDateString('fr-FR')}</div>
            <div><strong>Heure:</strong> {selectedTime}</div>
            <div><strong>Consultant:</strong> {consultant.name}</div>
          </div>
          
          <div className="flex gap-4 mt-6">
            <Button 
              onClick={() => setSelectedTime('')}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <Button 
              onClick={onBook}
              className="flex-1 bg-[#2B61D6] hover:bg-[#2B61D6]/90"
              size="lg"
            >
              <Check className="w-4 h-4 mr-2" />
              Confirmer le rendez-vous
            </Button>
          </div>
        </div>
      ) : (
        /* Step 1: Select Date and Time */
        <div>
          <h3 className="text-lg font-semibold mb-4">1. Choisissez une date et un horaire</h3>
          
          {/* Calendar */}
          <div className="border rounded-lg p-6 flex justify-center mb-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date: Date) => {
                const dayName = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][date.getDay()]
                const workingTimes = consultant.workingHours?.[dayName] || []
                return date < new Date() || workingTimes.length === 0
              }}
              className="rounded-md w-full max-w-md [&_.rdp-day_selected]:bg-[#2B61D6] [&_.rdp-day_selected]:text-white [&_.rdp-button:hover]:bg-[#2B61D6]/10"
            />
          </div>

          {/* Time slots appear under calendar when date is selected */}
          {selectedDate && (
            <div>
              <h4 className="text-md font-medium mb-4 text-gray-700">Créneaux disponibles pour le {selectedDate.toLocaleDateString('fr-FR')}</h4>
              {availableTimes.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                  {availableTimes.map((time: string) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 border rounded-lg text-sm font-medium transition-all ${
                        selectedTime === time
                          ? 'border-[#2B61D6] bg-[#2B61D6] text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Clock className="w-4 h-4 inline mr-1" />
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Aucun créneau disponible pour cette date
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}