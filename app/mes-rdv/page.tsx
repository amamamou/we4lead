'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Mock appointments data
const mockAppointments = [
  {
    id: 1,
    consultant: 'Dr. Sarah Martin',
    consultantSpecialty: 'Orientation Académique',
    consultantAvatar: 'SM',
    date: '2026-02-05',
    time: '10:00',
    duration: 60,
    status: 'confirmed',
    type: 'Visioconférence',
    notes: 'Discussion sur le choix de master en informatique'
  },
  {
    id: 2,
    consultant: 'Prof. Ahmed Bennani',
    consultantSpecialty: 'Développement Personnel',
    consultantAvatar: 'AB',
    date: '2026-02-07',
    time: '14:30',
    duration: 45,
    status: 'pending',
    type: 'Présentiel',
    notes: 'Préparation aux entretiens d&apos;embauche'
  },
  {
    id: 3,
    consultant: 'Dr. Marie Dubois',
    consultantSpecialty: 'Gestion du Stress',
    consultantAvatar: 'MD',
    date: '2026-01-30',
    time: '09:00',
    duration: 60,
    status: 'completed',
    type: 'Visioconférence',
    notes: 'Techniques de relaxation pour les examens'
  }
]

export default function MyAppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'pending'>('upcoming')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Confirmé</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">En attente</Badge>
      case 'completed':
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Terminé</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Inconnu</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(date)
  }

  const filteredAppointments = mockAppointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date)
    const today = new Date()
    
    switch (filter) {
      case 'upcoming':
        return appointmentDate >= today && appointment.status !== 'completed'
      case 'completed':
        return appointment.status === 'completed'
      case 'pending':
        return appointment.status === 'pending'
      default:
        return true
    }
  })

  return (
    <main className="bg-white min-h-screen">
      <Header />

      {/* ================= HEADER ================= */}
      <section className="pt-28 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-semibold text-[#0A1A3A] mb-2">
                Mes rendez-vous
              </h1>
              <p className="text-gray-600">
                Gérez vos consultations et suivez votre parcours d&apos;accompagnement
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={filter === 'upcoming' ? 'default' : 'outline'}
                onClick={() => setFilter('upcoming')}
                size="sm"
              >
                À venir
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilter('pending')}
                size="sm"
              >
                En attente
              </Button>
              <Button
                variant={filter === 'completed' ? 'default' : 'outline'}
                onClick={() => setFilter('completed')}
                size="sm"
              >
                Terminés
              </Button>
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                Tous
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ================= APPOINTMENTS LIST ================= */}
            <div className="lg:col-span-2 space-y-6">
              
              {filteredAppointments.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 7h.01M12 12v4" />
                      </svg>
                    </div>
                    <p className="text-gray-500 mb-2">Aucun rendez-vous trouvé</p>
                    <p className="text-sm text-gray-400">
                      {filter === 'upcoming' && 'Vous n&apos;avez pas de rendez-vous à venir.'}
                      {filter === 'pending' && 'Aucun rendez-vous en attente de confirmation.'}
                      {filter === 'completed' && 'Aucun rendez-vous terminé.'}
                      {filter === 'all' && 'Vous n&apos;avez encore aucun rendez-vous.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredAppointments.map((appointment) => (
                  <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        
                        <div className="flex gap-4">
                          {/* Consultant Avatar */}
                          <div className="w-12 h-12 rounded-full bg-[#2B61D6] flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-sm font-semibold">
                              {appointment.consultantAvatar}
                            </span>
                          </div>

                          {/* Appointment Info */}
                          <div className="flex-1">
                            <h3 className="font-semibold text-[#0A1A3A] mb-1">
                              {appointment.consultant}
                            </h3>
                            <p className="text-sm text-[#2B61D6] mb-2">
                              {appointment.consultantSpecialty}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 7v8a3 3 0 01-3 3H6a3 3 0 01-3-3v-1M2 17h20" />
                                </svg>
                                {formatDate(appointment.date)}
                              </div>
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {appointment.time} ({appointment.duration} min)
                              </div>
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {appointment.type}
                              </div>
                            </div>

                            {appointment.notes && (
                              <p className="text-sm text-gray-600 mb-3">
                                {appointment.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex flex-col items-end gap-3">
                          {getStatusBadge(appointment.status)}
                          
                          <div className="flex gap-2">
                            {appointment.status === 'confirmed' && (
                              <>
                                <Button variant="outline" size="sm">
                                  Rejoindre
                                </Button>
                                <Button variant="outline" size="sm">
                                  Reprogrammer
                                </Button>
                              </>
                            )}
                            {appointment.status === 'pending' && (
                              <Button variant="outline" size="sm">
                                Modifier
                              </Button>
                            )}
                            {appointment.status === 'completed' && (
                              <Button variant="outline" size="sm">
                                Voir détails
                              </Button>
                            )}
                          </div>
                        </div>

                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* ================= SIDEBAR ================= */}
            <div className="space-y-6">
              
              {/* Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Calendrier</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border-0"
                  />
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total rendez-vous</span>
                    <span className="font-semibold text-[#0A1A3A]">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">À venir</span>
                    <span className="font-semibold text-green-600">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Terminés</span>
                    <span className="font-semibold text-gray-600">1</span>
                  </div>
                </CardContent>
              </Card>

            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}