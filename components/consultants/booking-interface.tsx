'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Consultant } from '@/types/consultant'
import { CalendarCheck } from 'lucide-react'

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

  const scrollRef = useRef<HTMLDivElement>(null)

  const availableTimes = useMemo(
    () => (selectedDate ? getAvailableTimesForDate(selectedDate) : []),
    [selectedDate, getAvailableTimesForDate]
  )

  useEffect(() => {
    if (consultant.sessionTypes?.length && !selectedSessionType) {
      setSelectedSessionType(consultant.sessionTypes[0].type)
    }
  }, [consultant.sessionTypes, selectedSessionType, setSelectedSessionType])

  useEffect(() => {
    const el = scrollRef.current?.querySelector('[data-selected="true"]')
    if (el) el.scrollIntoView({ block: 'center' })
  }, [selectedTime])

  const isDayDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0,0,0,0)

    const dayName = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'][date.getDay()]
    const workingTimes = consultant.workingHours?.[dayName] || []

    return date < today || workingTimes.length === 0
  }

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      })
    : null

  const canConfirm = selectedDate && selectedTime

  return (
    <div className="rounded-xl overflow-hidden bg-[#F9F9F9] border border-[#020E68]/10">

      <div className="grid md:grid-cols-[340px_1fr] min-h-[540px]">

        {/* CALENDAR */}
        <div className="border-b md:border-b-0 md:border-r border-[#020E68]/10 p-4 bg-white/60">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date)
              setSelectedTime('')
            }}
            disabled={isDayDisabled}
            className="w-full
              [&_.rdp-day_selected]:bg-[#020E68]
              [&_.rdp-day_selected]:text-white
              [&_.rdp-button:hover]:bg-[#020E68]/10
              [&_.rdp-day_today]:border-[#020E68]"
          />
        </div>

        {/* TIMES */}
        <div className="flex flex-col bg-[#F9F9F9] md:bg-transparent">

          <div className="px-5 md:px-6 py-4 border-b border-[#020E68]/10 text-sm text-gray-700 capitalize">
            {formattedDate || "Choisissez une date"}
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 pb-28 md:pb-6">

            {!selectedDate && (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Sélectionnez un jour
              </div>
            )}

            {selectedDate && availableTimes.length === 0 && (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Aucun créneau disponible
              </div>
            )}

            {selectedDate && availableTimes.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {availableTimes.map(time => {
                  const selected = selectedTime === time
                  return (
                    <button
                      key={time}
                      data-selected={selected}
                      onClick={() => setSelectedTime(time)}
                      className={`h-11 rounded-md text-sm font-medium transition-all border
                      ${
                        selected
                          ? 'bg-[#020E68] text-white border-[#020E68]'
                          : 'bg-white border-[#020E68]/15 hover:border-[#020E68]/35 hover:bg-[#020E68]/5 text-gray-800'
                      }`}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* MOBILE FRIENDLY CONFIRM BAR */}
          <div className="border-t border-[#020E68]/10 px-4 md:px-6 py-3 flex items-center justify-between bg-white md:bg-white/70 sticky bottom-0">

            <div className="text-xs text-gray-500">
              {canConfirm
                ? `${formattedDate} à ${selectedTime}`
                : "Sélectionnez un créneau"}
            </div>

            <button
              onClick={onBook}
              disabled={!canConfirm}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#020E68] text-white text-sm font-medium
              hover:bg-[#020E68]/90 active:scale-[0.98] transition disabled:opacity-30"
            >
              <CalendarCheck className="w-4 h-4" />
              Confirmer
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}
