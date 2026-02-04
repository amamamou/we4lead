'use client'

import { useState } from 'react'
import { Trash2, Plus, Clock, Save } from 'lucide-react'

interface TimeSlot {
  id: string
  day: string
  startTime: string
  endTime: string
}

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

export function AvailabilityForm() {
  const [slots, setSlots] = useState<TimeSlot[]>([
    { id: '1', day: 'Lundi', startTime: '09:00', endTime: '17:00' },
    { id: '2', day: 'Mercredi', startTime: '14:00', endTime: '18:00' }
  ])


  const addSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      day: 'Lundi',
      startTime: '09:00',
      endTime: '17:00'
    }
    setSlots([...slots, newSlot])
  }

  const removeSlot = (id: string) => {
    setSlots(slots.filter(slot => slot.id !== id))
  }

  const updateSlot = (id: string, field: keyof TimeSlot, value: string) => {
    setSlots(slots.map(slot => 
      slot.id === id ? { ...slot, [field]: value } : slot
    ))
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Gérer votre Disponibilité</h2>
          <p className="text-gray-600 text-sm">Définissez vos jours et heures de consultation (sessions de 30 minutes)</p>
        </div>

        {/* Slots List (each slot as bordered card) */}
        <div className="space-y-4">
          {slots.map((slot) => (
            <div key={slot.id} className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="w-full sm:flex-1">
                <label className="block text-xs text-gray-600 font-medium mb-2">Jour</label>
                <select
                  value={slot.day}
                  onChange={(e) => updateSlot(slot.id, 'day', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm text-foreground bg-white hover:border-gray-300 transition-colors"
                >
                  {DAYS.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>

              <div className="w-full sm:w-48">
                <label className="block text-xs text-gray-600 font-medium mb-2">Heure de début</label>
                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => updateSlot(slot.id, 'startTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm text-foreground bg-white hover:border-gray-300 transition-colors"
                />
              </div>

              <div className="w-full sm:w-48">
                <label className="block text-xs text-gray-600 font-medium mb-2">Heure de fin</label>
                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => updateSlot(slot.id, 'endTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded text-sm text-foreground bg-white hover:border-gray-300 transition-colors"
                />
              </div>

              <div className="self-end sm:self-auto">
                <button
                  onClick={() => removeSlot(slot.id)}
                  className="px-3 py-2 bg-white border border-gray-200 text-foreground rounded hover:bg-red-50 hover:border-red-200 transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Slot Button */}
        <button
          onClick={addSlot}
          className="w-full px-4 py-2.5 bg-white border border-gray-200 text-foreground rounded font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter un créneau
        </button>

        {/* Session Duration Info (inline, no box) */}
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
          <div>
            <p className="text-sm font-medium text-foreground">Durée des sessions</p>
            <p className="text-xs text-gray-600 mt-1">Chaque session dure 30 minutes. Le nombre de sessions disponibles est calculé automatiquement.</p>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button className="px-6 py-2.5 bg-white border border-gray-200 text-foreground rounded font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" />
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </div>
  )
}
