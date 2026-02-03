'use client'

import { useState, useMemo, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  ArrowLeft,
  CheckCircle
} from 'lucide-react'

// Types
interface SessionType {
  type: string
  duration: string
}

interface Review {
  id: number
  author: string
  rating: number
  date: string
  comment: string
}

interface Consultant {
  id: number
  name: string
  slug: string
  title: string
  institution: string
  institutionCode: string
  specializations: string[]
  availability: string
  availableDays: string[]
  nextSlot: string
  rating: number
  reviewsCount: number
  experience: string
  consultationsCount: number
  image: string
  description: string
  languages: string[]
  sessionTypes: SessionType[]
  qualifications: string[]
  workingHours: Record<string, string[]>
  reviews: Review[]
}

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

// Mock data - in a real app, this would come from a database
const consultants: Consultant[] = [
  {
    id: 1,
    name: 'Dr. Amira Ben Salem',
    slug: 'dr-amira-ben-salem',
    title: 'Psychologue Clinicienne',
    institution: 'Faculté de Médecine de Sousse',
    institutionCode: 'FMS',
    specializations: ['Psychologie Clinique', 'Thérapie Cognitive', 'Anxiété'],
    availability: 'Disponible',
    availableDays: ['Lundi', 'Mardi', 'Jeudi'],
    nextSlot: '15 Février 2026',
    rating: 4.9,
    reviewsCount: 156,
    experience: '8 ans',
    consultationsCount: 450,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&face',
    description: 'Spécialisée dans la thérapie cognitive et comportementale, j&apos;aide les étudiants à surmonter l&apos;anxiété, la dépression et les troubles de l&apos;adaptation. Mon approche combine techniques traditionnelles et innovations numériques.',
    languages: ['Français', 'Arabe', 'Anglais'],
    sessionTypes: [
      { type: 'Consultation en personne', duration: '45 min' }
    ],
    qualifications: [
      'Doctorat en Psychologie Clinique - Université de Tunis',
      'Master en Thérapie Cognitive - Université Paris Descartes',
      'Certification en Thérapie EMDR',
      'Formation en Psychotrauma - Institut Français'
    ],
    workingHours: {
      'Lundi': ['09:00', '12:00', '14:00', '17:00'],
      'Mardi': ['08:30', '12:30', '13:30', '16:30'],
      'Mercredi': [],
      'Jeudi': ['09:00', '13:00', '14:00', '18:00'],
      'Vendredi': [],
      'Samedi': [],
      'Dimanche': []
    },
    reviews: [
      {
        id: 1,
        author: 'Sarah M.',
        rating: 5,
        date: '28 Janvier 2026',
        comment: 'Dr. Ben Salem m&apos;a énormément aidée avec mon anxiété. Ses techniques sont très efficaces et elle est très à l&apos;écoute.'
      },
      {
        id: 2,
        author: 'Ahmed K.',
        rating: 5,
        date: '20 Janvier 2026',
        comment: 'Excellente psychologue ! J&apos;ai pu surmonter mes difficultés d&apos;adaptation à l&apos;université grâce à son aide.'
      },
      {
        id: 3,
        author: 'Lina T.',
        rating: 4,
        date: '15 Janvier 2026',
        comment: 'Très professionnelle et empathique. Les séances en ligne sont très pratiques.'
      }
    ]
  },
  {
    id: 2,
    name: 'M. Sami Mansour',
    slug: 'm-sami-mansour',
    title: 'Thérapeute Cognitif',
    institution: 'Faculté de Médecine de Sousse',
    institutionCode: 'FMS',
    specializations: ['Thérapie Cognitive', 'Dépression', 'Stress Académique'],
    availability: 'Occupé',
    availableDays: ['Mercredi', 'Vendredi'],
    nextSlot: '20 Février 2026',
    rating: 4.7,
    reviewsCount: 89,
    experience: '6 ans',
    consultationsCount: 320,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&face',
    description: 'Spécialisé dans la thérapie cognitive comportementale, j&apos;accompagne les étudiants dans la gestion du stress académique et des épisodes dépressifs. Mon approche est personnalisée selon les besoins de chaque individu.',
    languages: ['Français', 'Arabe'],
    sessionTypes: [
      { type: 'Consultation en personne', duration: '45 min'}
    ],
    qualifications: [
      'Master en Psychologie Clinique - Université de Sousse',
      'Certification en Thérapie Cognitive Comportementale',
      'Formation en Gestion du Stress - Centre Français de Formation',
      'Spécialisation en Psychologie de l&apos;Adolescent'
    ],
    workingHours: {
      'Lundi': [],
      'Mardi': [],
      'Mercredi': ['10:00', '13:00', '15:00', '18:00'],
      'Jeudi': [],
      'Vendredi': ['09:00', '12:00', '14:00', '17:00'],
      'Samedi': [],
      'Dimanche': []
    },
    reviews: [
      {
        id: 1,
        author: 'Mohamed S.',
        rating: 5,
        date: '25 Janvier 2026',
        comment: 'M. Mansour m&apos;a beaucoup aidé pendant ma période de dépression. Très professionnel et bienveillant.'
      },
      {
        id: 2,
        author: 'Fatma B.',
        rating: 4,
        date: '18 Janvier 2026',
        comment: 'Bon thérapeute, les techniques de relaxation qu&apos;il enseigne sont très efficaces.'
      }
    ]
  },
  {
    id: 3,
    name: 'Dr. Leila Trabelsi',
    slug: 'dr-leila-trabelsi',
    title: 'Psychologue du Travail',
    institution: 'Faculté des Sciences Économiques et de Gestion',
    institutionCode: 'FSEG',
    specializations: ['Psychologie du Travail', 'Orientation Professionnelle', 'Burn-out'],
    availability: 'Disponible',
    availableDays: ['Lundi', 'Mercredi', 'Vendredi'],
    nextSlot: '14 Février 2026',
    rating: 4.8,
    reviewsCount: 203,
    experience: '10 ans',
    consultationsCount: 680,
    image: 'https://images.unsplash.com/photo-1594824919066-63ffc0e8324a?w=300&h=300&fit=crop&face',
    description: 'Experte en psychologie du travail et orientation professionnelle. J&apos;aide les étudiants et jeunes diplômés à définir leur projet professionnel et à prévenir le burn-out. Mon approche intègre les enjeux actuels du marché du travail.',
    languages: ['Français', 'Arabe', 'Anglais', 'Allemand'],
    sessionTypes: [
      { type: 'Consultation carrière', duration: '60 min'}
    ],
    qualifications: [
      'Doctorat en Psychologie du Travail - Université Paris 8',
      'Master en Gestion des Ressources Humaines - FSEG Sousse',
      'Certification en Coaching Professionnel - ICF',
      'Formation en Prévention du Burn-out - Institut Européen'
    ],
    workingHours: {
      'Lundi': ['08:00', '12:00', '13:00', '17:00'],
      'Mardi': [],
      'Mercredi': ['09:00', '13:00', '14:00', '18:00'],
      'Jeudi': [],
      'Vendredi': ['08:30', '12:30', '14:00', '16:30'],
      'Samedi': [],
      'Dimanche': []
    },
    reviews: [
      {
        id: 1,
        author: 'Karim L.',
        rating: 5,
        date: '30 Janvier 2026',
        comment: 'Dr. Trabelsi m&apos;a aidé à clarifier mon projet professionnel. Très compétente et à l&apos;écoute.'
      },
      {
        id: 2,
        author: 'Amina K.',
        rating: 5,
        date: '22 Janvier 2026',
        comment: 'Excellent bilan de compétences ! J&apos;ai découvert des aspects de ma personnalité que je ne connaissais pas.'
      },
      {
        id: 3,
        author: 'Yassine M.',
        rating: 4,
        date: '16 Janvier 2026',
        comment: 'Très bon coaching. Les conseils sont pratiques et applicables immédiatement.'
      }
    ]
  },
  {
    id: 5,
    name: 'Dr. Nadia Khemiri',
    slug: 'dr-nadia-khemiri',
    title: 'Spécialiste Addiction Numérique',
    institution: 'Institut Supérieur d\'Informatique et de Multimédia',
    institutionCode: 'ISIMS',
    specializations: ['Addiction aux Écrans', 'Psychologie Numérique', 'Détox Digitale'],
    availability: 'Disponible',
    availableDays: ['Lundi', 'Mardi', 'Mercredi', 'Vendredi'],
    nextSlot: '13 Février 2026',
    rating: 4.9,
    reviewsCount: 178,
    experience: '5 ans',
    consultationsCount: 290,
    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300&h=300&fit=crop&face',
    description: 'Pionnière dans le domaine de la psychologie numérique en Tunisie. Je traite les addictions aux écrans, réseaux sociaux et jeux vidéo. Mon approche moderne combine thérapie comportementale et techniques de détox digitale.',
    languages: ['Français', 'Arabe', 'Anglais'],
    sessionTypes: [
      { type: 'Consultation spécialisée', duration: '55 min' }
    ],
    qualifications: [
      'Doctorat en Psychologie Cognitive - Université de Lille',
      'Master en Sciences Cognitives - École Normale Supérieure',
      'Certification en Thérapies Numériques - Stanford University',
      'Formation en Addiction Comportementale - Institut Fédératif'
    ],
    workingHours: {
      'Lundi': ['09:00', '12:00', '15:00', '18:00'],
      'Mardi': ['08:30', '12:30', '13:30', '17:30'],
      'Mercredi': ['10:00', '13:00', '14:00', '17:00'],
      'Jeudi': [],
      'Vendredi': ['09:00', '12:00', '14:30', '17:30'],
      'Samedi': [],
      'Dimanche': []
    },
    reviews: [
      {
        id: 1,
        author: 'Salim R.',
        rating: 5,
        date: '29 Janvier 2026',
        comment: 'Dr. Khemiri m&apos;a aidé à reprendre le contrôle sur mon utilisation des réseaux sociaux. Approche très moderne et efficace.'
      },
      {
        id: 2,
        author: 'Ines H.',
        rating: 5,
        date: '24 Janvier 2026',
        comment: 'Programme de détox digital excellent ! J&apos;ai retrouvé un équilibre dans ma vie numérique.'
      },
      {
        id: 3,
        author: 'Omar T.',
        rating: 4,
        date: '19 Janvier 2026',
        comment: 'Très bonne spécialiste. Les techniques pour gérer l&apos;addiction aux jeux vidéo sont très pratiques.'
      }
    ]
  }
]

// Function to convert name to slug
function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

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
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedSessionType, setSelectedSessionType] = useState<string>('')
  const [isBookingOpen, setIsBookingOpen] = useState(false)

  if (!consultant) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Consultant non trouvé</h2>
          <Button onClick={() => router.push('/consultants')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux consultants
          </Button>
        </div>
      </div>
    )
  }

  const getAvailableTimesForDate = (date: Date): string[] => {
    const dayName = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][date.getDay()]
    const workingTimes = consultant.workingHours[dayName] || []
    
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
      alert(`Rendez-vous réservé!\nDate: ${selectedDate.toLocaleDateString('fr-FR')}\nHeure: ${selectedTime}\nType: ${selectedSessionType}`)
      setIsBookingOpen(false)
      setSelectedTime('')
      setSelectedSessionType('')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Button 
          onClick={() => router.push('/consultants')} 
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux consultants
        </Button>
      </div>

      {/* Profile Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 py-12">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-48 h-48 rounded-xl overflow-hidden shadow-lg bg-gray-100">
                  <Image 
                    src={consultant.image} 
                    alt={consultant.name}
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
                {consultant.availability === 'Disponible' && (
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-gray-900">{consultant.name}</h1>
                <p className="text-lg text-gray-600 mb-6">{consultant.title}</p>
                
                {/* Specializations */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-8">
                  {consultant.specializations.map((spec: string, index: number) => (
                    <Badge key={index} variant="outline" className="border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100">
                      {spec}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-center lg:justify-start">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-600">{consultant.institution}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="lg:w-64">
                <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium rounded-xl h-12">
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      Réserver un créneau
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
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
                
                <div className="mt-4 text-center text-gray-500">
                  <div className="text-sm">Prochain créneau</div>
                  <div className="text-sm font-medium">{consultant.nextSlot}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card className="border-gray-100 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-gray-900">À propos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600 leading-relaxed text-base">{consultant.description}</p>
                
                {/* Languages */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Langues parlées</h4>
                  <div className="flex flex-wrap gap-2">
                    {consultant.languages.map((language: string, index: number) => (
                      <Badge key={index} variant="outline" className="border-gray-200 text-gray-700 bg-gray-50">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Availability Schedule */}
            <Card className="border-gray-100 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-gray-900">Disponibilités</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(consultant.workingHours)
                    .filter(([day]) => day !== 'Dimanche')
                    .map(([day, hours]: [string, string[]]) => (
                    <div key={day} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">{day}</span>
                      <span className="text-sm text-gray-600">
                        {hours.length === 0 ? 'Indispo' : 
                         hours.length >= 4 ? `${hours[0]} - ${hours[1]}, ${hours[2]} - ${hours[3]}` :
                         hours.length >= 2 ? `${hours[0]} - ${hours[1]}` : 'Indispo'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

// Booking Interface Component
function BookingInterface({ 
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
    if (consultant.sessionTypes.length > 0 && !selectedSessionType) {
      setSelectedSessionType(consultant.sessionTypes[0].type)
    }
  }, [consultant.sessionTypes, selectedSessionType, setSelectedSessionType])

  return (
    <div className="space-y-6">
      {/* Step 1: Select Date */}
      <div>
        <h3 className="text-lg font-semibold mb-4">1. Choisissez une date</h3>
        <div className="border rounded-lg p-6 flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date: Date) => {
              const dayName = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][date.getDay()]
              const workingTimes = consultant.workingHours[dayName] || []
              return date < new Date() || workingTimes.length === 0
            }}
            className="rounded-md w-full max-w-md"
          />
        </div>
      </div>

      {/* Step 2: Select Time */}
      {selectedDate && (
        <div>
          <h3 className="text-lg font-semibold mb-4">2. Choisissez un horaire</h3>
          {availableTimes.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
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

      {/* Confirmation */}
      {selectedDate && selectedTime && (
        <div>
          <h3 className="text-lg font-semibold mb-4">3. Confirmation</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div><strong>Date:</strong> {selectedDate.toLocaleDateString('fr-FR')}</div>
            <div><strong>Heure:</strong> {selectedTime}</div>
            <div><strong>Consultant:</strong> {consultant.name}</div>
          </div>
          
          <Button 
            onClick={onBook}
            className="w-full mt-4 bg-[#2B61D6] hover:bg-[#1e40af]"
            size="lg"
          >
            Confirmer le rendez-vous
          </Button>
        </div>
      )}
    </div>
  )
}