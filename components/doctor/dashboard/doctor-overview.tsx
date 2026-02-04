"use client"

import React, { useMemo, useState } from "react"

import { Calendar, Users, CheckCircle, Clock } from 'lucide-react'

interface StatCard {
  icon: React.ReactNode
  label: string
  value: string
}

const StatCard = ({ icon, label, value }: StatCard) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3 hover:border-gray-300 transition-colors">
    <div className="flex items-center justify-between">
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-gray-400">{icon}</div>
    </div>
    <p className="text-sm text-gray-600 font-medium">{label}</p>
  </div>
)

export function DoctorOverview() {
  const [query, setQuery] = useState('')
  const [filterDate, setFilterDate] = useState('') // ISO yyyy-mm-dd
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const sessions = useMemo(
    () => [
      { student: 'Fatima Alzahra', date: '15 Février 2026', iso: '2026-02-15', time: '14:30', room: 'Salle 205' },
      { student: 'Ahmed Ben Said', date: '17 Février 2026', iso: '2026-02-17', time: '10:00', room: 'Salle 101' },
      { student: 'Leila Mansouri', date: '19 Février 2026', iso: '2026-02-19', time: '15:30', room: 'Salle 302' }
    ],
    []
  )

  const visibleSessions = useMemo(() => {
    let list = sessions.slice()
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((s) => s.student.toLowerCase().includes(q))
    }
    if (filterDate) {
      list = list.filter((s) => s.iso === filterDate)
    }
    list.sort((a, b) => (a.iso > b.iso ? 1 : -1) * (sortOrder === 'asc' ? 1 : -1))
    return list
  }, [query, filterDate, sortOrder, sessions])

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard icon={<Calendar className="w-6 h-6" />} label="RDV cette semaine" value="4" />
        <StatCard icon={<Users className="w-6 h-6" />} label="Étudiants" value="15" />
        <StatCard icon={<CheckCircle className="w-6 h-6" />} label="Complétés" value="28" />
      </div>

      {/* Upcoming Sessions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Prochaines consultations</h2>
            <p className="text-gray-600 text-sm">Liste des étudiants attendus pour vos prochaines sessions.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ml-auto">
            <input
              type="text"
              placeholder="Rechercher par nom"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="text-sm px-3 py-2 border border-gray-200 rounded-md bg-white w-full sm:w-48"
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
              <option value="asc">Trier: date ↑</option>
              <option value="desc">Trier: date ↓</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {visibleSessions.map((session, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                <div>
                  <h3 className="font-semibold text-foreground">{session.student}</h3>
                </div>
                <span className="text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 rounded">À venir</span>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{session.time}</span>
                </div>
                <div className="text-foreground font-medium">{session.room}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
