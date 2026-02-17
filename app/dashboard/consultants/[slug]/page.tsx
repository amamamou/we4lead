"use client"

import { useState, useMemo, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import Sidebar from '@/components/dashboard/layout/Sidebar'
import studentMenu from '@/lib/dashboard/menus/student'
import Core from '@/components/dashboard/layout/Core'
import { ConsultantProfileHeader, ConsultantProfileContent, BookingInterface } from '@/components/consultants'

// Types
interface DoctorDetail {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  photoUrl: string | null
  universites: Array<{
    id: number
    nom: string
    ville: string
    adresse: string
    telephone: string
    nbEtudiants: number
    horaire: string
    logoPath: string
    code: string
  }>
  creneaux: Array<{
    id: string
    jour: string
    debut: string
    fin: string
  }>
}

// Time slots for booking
const timeSlots = [
  '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
]

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

function SuccessToast({
  open,
  onClose,
  date,
  time,
}: {
  open: boolean
  onClose: () => void
  date?: Date
  time?: string
}) {
  if (!open) return null

  return (
    <div className="fixed inset-x-0 top-8 z-[100] flex justify-center pointer-events-none">
      <div className="pointer-events-auto animate-in fade-in slide-in-from-top-3 duration-300">
        <div className="
          flex items-center gap-4
          rounded-xl
          bg-white
          px-5 py-4
          min-w-[340px]
          shadow-[0_12px_40px_rgba(0,0,0,0.12)]
          border border-black/5
        ">
          {/* success icon */}
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>

          {/* text */}
          <div className="flex-1 leading-tight">
            <p className="font-semibold text-[15px] text-gray-900">
              Réservation confirmée
            </p>
            <p className="text-gray-600 text-sm">
              {date ? date.toLocaleDateString('fr-FR') : ''}
              {time ? ` à ${time}` : ''}
            </p>
          </div>

          {/* close */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-lg leading-none px-1"
            aria-label="Fermer"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ConsultantProfileDashboard() {
  const params = useParams()
  const router = useRouter()
  const [doctorId, setDoctorId] = useState<string | null>(null)
  
  const [doctor, setDoctor] = useState<DoctorDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedSessionType, setSelectedSessionType] = useState<string>('')
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [confirmedDate, setConfirmedDate] = useState<Date | undefined>(undefined)
  const [confirmedTime, setConfirmedTime] = useState<string>('')
  const [bookingLoading, setBookingLoading] = useState(false)

  // Get doctorId from URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const id = searchParams.get('id')
      console.log('Doctor ID from URL:', id)
      setDoctorId(id)
    }
  }, [])

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (!doctorId) {
        setError('ID du médecin non trouvé')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const token = localStorage.getItem('supabaseAccessToken')
        
        if (!token) {
          throw new Error('Token d\'authentification non trouvé')
        }

        const response = await fetch(`${BACKEND_URL}/etudiant/doctors/${doctorId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Médecin non trouvé')
          }
          throw new Error('Erreur lors du chargement des informations')
        }

        const data = await response.json()
        console.log('Doctor data fetched:', data)
        setDoctor(data)
      } catch (err) {
        console.error('Error fetching doctor:', err)
        setError(err instanceof Error ? err.message : 'Impossible de charger les informations du médecin')
      } finally {
        setLoading(false)
      }
    }

    if (doctorId) {
      fetchDoctorDetails()
    } else {
      setLoading(false)
    }
  }, [doctorId])

  // Transform doctor data to consultant format
  const consultant = useMemo(() => {
    if (!doctor) return null

    // Transform creneaux to working hours format
    const workingHours: Record<string, string[]> = {}
    doctor.creneaux.forEach(creneau => {
      if (!workingHours[creneau.jour]) {
        workingHours[creneau.jour] = []
      }
      workingHours[creneau.jour].push(creneau.debut, creneau.fin)
    })

    return {
      id: doctor.id,
      name: `Dr. ${doctor.prenom} ${doctor.nom}`.trim(),
      title: 'Médecin généraliste',
      institution: doctor.universites[0]?.nom || 'Université non spécifiée',
      institutionCode: doctor.universites[0]?.code || '',
      image: doctor.photoUrl || '/default-avatar.png',
      rating: 4.5,
      reviewCount: 0,
      description: `Médecin généraliste à ${doctor.universites[0]?.ville || 'Tunisie'}`,
      languages: ['Français', 'Arabe'],
      workingHours,
      sessionTypes: [{ type: 'Consultation', duration: 30 }],
      education: [
        {
          degree: 'Doctorat en Médecine',
          institution: doctor.universites[0]?.nom || 'Université de Médecine',
          year: '2015'
        }
      ],
      experience: [
        {
          position: 'Médecin généraliste',
          institution: doctor.universites[0]?.nom || 'Cabinet privé',
          period: '2015 - Présent'
        }
      ],
      specializations: ['Médecine générale']
    }
  }, [doctor])

  const getAvailableTimesForDate = (date: Date): string[] => {
    if (!consultant) return []
    
    const dayName = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][date.getDay()]
    const workingTimes = consultant.workingHours?.[dayName] || []
    
    if (workingTimes.length === 0) return []
    
    // Generate available slots based on working hours
    const availableSlots: string[] = []
    for (let i = 0; i < workingTimes.length; i += 2) {
      const startTime = workingTimes[i]
      const endTime = workingTimes[i + 1]
      
      if (startTime && endTime) {
        const slots = timeSlots.filter(slot => slot >= startTime && slot <= endTime)
        availableSlots.push(...slots)
      }
    }
    
    return availableSlots
  }

  const handleBooking = async () => {
    if (!doctor || !selectedDate || !selectedTime || !selectedSessionType) return

    setBookingLoading(true)

    try {
      const token = localStorage.getItem('supabaseAccessToken')
      const studentId = localStorage.getItem('userId')
      
      if (!token || !studentId) {
        throw new Error('Vous devez être connecté pour réserver')
      }

      const formattedDate = selectedDate.toISOString().split('T')[0]

      const response = await fetch(`${BACKEND_URL}/etudiant/rdvs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          medecinId: doctor.id,
          date: formattedDate,
          heure: selectedTime
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Échec de la réservation')
      }

      // Store the confirmed values before clearing
      setConfirmedDate(selectedDate)
      setConfirmedTime(selectedTime)
      
      // Show success message
      setShowSuccessMessage(true)
      setIsBookingOpen(false)
      setSelectedTime('')
      setSelectedSessionType('')
      
      // Hide success message after 3.5 seconds
      setTimeout(() => setShowSuccessMessage(false), 3500)
    } catch (err) {
      console.error('Booking error:', err)
      setError(err instanceof Error ? err.message : 'Échec de la réservation')
    } finally {
      setBookingLoading(false)
    }
  }

  const handleBookingClick = () => {
    setIsBookingOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  if (error || !consultant) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erreur</h2>
          <p className="text-red-600 mb-4">{error || 'Consultant non trouvé'}</p>
          <Button onClick={() => router.push('/dashboard?activeTab=doctors')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux médecins
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row">
        <Sidebar menu={studentMenu} activeKey={'doctors'} onChange={(k: string) => {
          // navigate back to dashboard and set the appropriate tab via query param
          if (k === 'overview') return router.push('/dashboard?activeTab=overview')
          if (k === 'calendar') return router.push('/dashboard?activeTab=calendar')
          if (k === 'doctors') return router.push('/dashboard?activeTab=doctors')
          if (k === 'reports') return router.push('/dashboard?activeTab=reports')
          if (k === 'institutions') return router.push('/dashboard?activeTab=institutions')
          return router.push('/dashboard')
        }} />

        <Core showHero={false}>
          <SuccessToast
            open={showSuccessMessage}
            onClose={() => setShowSuccessMessage(false)}
            date={confirmedDate}
            time={confirmedTime}
          />

          {/* Back Button */}
          <div className="pt-8">
            <Button 
              onClick={() => { 
                localStorage.setItem('we4lead_activeTab', 'doctors'); 
                router.push('/dashboard?activeTab=doctors')
              }}
              variant="outline"
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux médecins
            </Button>
          </div>

          {/* Profile Header */}
          <ConsultantProfileHeader 
            consultant={consultant}
            onBookingClick={handleBookingClick}
          />

          {/* Main Content */}
          <ConsultantProfileContent consultant={consultant} />

          {/* Booking Modal */}
          <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
            <DialogContent disableDefaultSizing contentClassName="w-[720px] max-w-full max-h-[86vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">Réserver avec {consultant.name}</DialogTitle>
              </DialogHeader>
              <BookingInterface 
                consultant={consultant}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                selectedSessionType={selectedSessionType}
                setSelectedSessionType={setSelectedSessionType}
                getAvailableTimesForDate={getAvailableTimesForDate}
                onBook={handleBooking}
              />
            </DialogContent>
          </Dialog>
        </Core>
      </div>
    </div>
  )
}