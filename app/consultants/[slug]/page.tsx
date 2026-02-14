'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { consultants, nameToSlug } from '@/lib/consultant-data'
import { ConsultantProfileHeader, ConsultantProfileContent, BookingInterface } from '@/components/consultants'

// Time slots for booking
const timeSlots = [
  '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
  '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
]

export default function ConsultantProfile() {
  const params = useParams()
  const router = useRouter()
  
  const consultant = useMemo(() => {
    if (params.slug) {
      return consultants.find(c => nameToSlug(c.name) === params.slug) || null
    }
    return null
  }, [params.slug])
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedSessionType, setSelectedSessionType] = useState<string>('')
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [confirmedDate, setConfirmedDate] = useState<Date | undefined>(undefined)
  const [confirmedTime, setConfirmedTime] = useState<string>('')

  if (!consultant) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Consultant non trouvé</h2>
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au dashboard
          </Button>
        </div>
      </div>
    )
  }

  const getAvailableTimesForDate = (date: Date): string[] => {
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

  const handleBooking = () => {
    if (selectedDate && selectedTime && selectedSessionType) {
      // Store the confirmed values before clearing
      setConfirmedDate(selectedDate)
      setConfirmedTime(selectedTime)
      
      // Show success message
      setShowSuccessMessage(true)
      setIsBookingOpen(false)
      setSelectedTime('')
      setSelectedSessionType('')
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)
    }
  }

  const handleBookingClick = () => {
    setIsBookingOpen(true)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">
                Consultation confirmé pour le {confirmedDate?.toLocaleDateString('fr-FR')} à {confirmedTime}
              </span>
            </div>
            <button 
              onClick={() => setShowSuccessMessage(false)}
              className="text-green-600 hover:text-green-800"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Button 
          onClick={() => router.push('/dashboard')} 
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au dashboard
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
        <DialogContent className="max-w-7xl max-h-[85vh] overflow-y-auto">
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

      <Footer />
    </div>
  )
}