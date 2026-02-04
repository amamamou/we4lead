'use client'

import React, { useMemo, useState } from 'react'
import { CheckCircle, Calendar, Clock, User } from 'lucide-react'

interface AppointmentRecord {
  id: string
  studentName: string
  studentEmail: string
  date: string
  iso: string
  time: string
  specialty: string
  notes: string
}

const appointmentHistoryData: AppointmentRecord[] = [
  {
    id: '1',
    studentName: 'Fatima Alzahra',
    studentEmail: 'fatima@student.us.tn',
    date: '8 Février 2026',
    iso: '2026-02-08',
    time: '14:30 - 15:00',
    specialty: 'Psychologie Clinique',
    notes: 'Patient en bon état, suivi recommandé'
  },
  {
    id: '2',
    studentName: 'Ahmed Ben Said',
    studentEmail: 'ahmed@student.us.tn',
    date: '1 Février 2026',
    iso: '2026-02-01',
    time: '10:00 - 10:30',
    specialty: 'Thérapie Cognitive',
    notes: 'Exercices à pratiquer hebdomadairement'
  },
  {
    id: '3',
    studentName: 'Leila Mansouri',
    studentEmail: 'leila@student.us.tn',
    date: '25 Janvier 2026',
    iso: '2026-01-25',
    time: '15:30 - 16:00',
    specialty: 'Gestion du Stress',
    notes: 'Demander les tests de suivi'
  }
]

export function AppointmentHistory() {
  const [query, setQuery] = useState('')
  const [filterDate, setFilterDate] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const appointments = useMemo(() => appointmentHistoryData, [])

  const visible = useMemo(() => {
    let list = appointments.slice()
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((a) => a.studentName.toLowerCase().includes(q) || a.studentEmail.toLowerCase().includes(q))
    }
    if (filterDate) {
      list = list.filter((a) => a.iso === filterDate)
    }
    list.sort((a, b) => (a.iso > b.iso ? 1 : -1) * (sortOrder === 'asc' ? 1 : -1))
    return list
  }, [appointments, query, filterDate, sortOrder])

  return (
    <div className="max-w-4xl space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Historique des Rendez-vous</h2>
            <p className="text-gray-600 text-sm">Consultations passées avec vos étudiants</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Rechercher par nom ou email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-sm px-3 py-2 border border-gray-200 rounded-md bg-white w-full sm:w-64"
            />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="text-sm px-2 py-2 border border-gray-200 rounded-md bg-white w-full sm:w-auto"
            />
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="text-sm px-3 py-2 border border-gray-200 rounded-md bg-white w-full sm:w-auto"
            >
              <option value="desc">Trier: plus récent</option>
              <option value="asc">Trier: plus ancien</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {visible.map((appointment) => (
          <div key={appointment.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-700 bg-green-50 rounded-full p-0.5" />
                  <h3 className="font-semibold text-foreground">{appointment.studentName}</h3>
                </div>
                <p className="text-sm text-gray-600">{appointment.specialty}</p>
              </div>
              <span className="text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 rounded self-start sm:self-center">Complété</span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm text-foreground">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{appointment.studentEmail}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
