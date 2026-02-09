'use client'

import { useState, useMemo, useEffect } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { ConsultantsList } from '@/components/consultants'
import { Search, Filter, ChevronDown, X } from 'lucide-react'
import { Consultant } from '@/types/consultant'

// Define the interface for API response
interface Creneau {
  id: string
  jour: string
  debut: string
  fin: string
}

interface ApiMedecin {
  id: string
  nom: string
  prenom: string
  email: string
  photoUrl: string | null
  creneaux: Creneau[]
}

// Mock data for missing fields
const mockSpecializations = [
  'Médecine Générale',
  'Cardiologie',
  'Pédiatrie',
  'Dermatologie',
  'Neurologie',
  'Gynécologie',
  'Orthopédie',
  'Ophtalmologie'
]

const mockInstitutions = [
  { name: 'Hôpital Général Paris', code: 'HGP' },
  { name: 'Centre Médical Universitaire', code: 'CMU' },
  { name: 'Clinique Spécialisée Lyon', code: 'CSL' },
  { name: 'Centre de Santé Marseille', code: 'CSM' }
]

const mockTitles = ['Dr.', 'Prof.', 'Dr. Spécialiste']

const mockLanguages = ['Français', 'Anglais', 'Arabe', 'Espagnol']

const mockDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

export default function ConsultantsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInstitution, setSelectedInstitution] = useState('all')
  const [selectedSpecialization, setSelectedSpecialization] = useState('all')
  const [selectedAvailability, setSelectedAvailability] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [consultants, setConsultants] = useState<Consultant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data from API
  useEffect(() => {
    const fetchMedecins = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/users/medecins`)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const apiData: ApiMedecin[] = await response.json()
        
        // Transform API data to match Consultant interface
        const transformedData: Consultant[] = apiData.map((medecin, index) => {
          // Determine availability based on creneaux
          let availability = 'Occupé'
          let availableDays: string[] = []
          let nextSlot = ''
          
          if (medecin.creneaux && medecin.creneaux.length > 0) {
            availability = 'Disponible'
            // Extract available days from creneaux
            medecin.creneaux.forEach(creneau => {
              const days = creneau.jour.split(',').map(d => d.trim())
              days.forEach(day => {
                if (!availableDays.includes(day)) {
                  availableDays.push(day)
                }
              })
            })
            
            // Set next slot from first creneau
            if (medecin.creneaux[0]) {
              const firstDay = medecin.creneaux[0].jour.split(',')[0].trim()
              nextSlot = `${firstDay} ${medecin.creneaux[0].debut}`
            }
          } else {
            // If no creneaux, use random mock days
            availableDays = mockDays
              .sort(() => 0.5 - Math.random())
              .slice(0, Math.floor(Math.random() * 3) + 2)
            nextSlot = `${availableDays[0]} 09:00`
          }

          // Get random specializations (2-3 per doctor)
          const specializations = [...mockSpecializations]
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random() * 2) + 2)

          // Select random institution
          const institution = mockInstitutions[Math.floor(Math.random() * mockInstitutions.length)]

          // Calculate rating and reviews
          const rating = 3.5 + Math.random() * 1.5 // 3.5 to 5.0
          const reviewsCount = Math.floor(Math.random() * 50) + 5 // 5 to 55 reviews

          // Generate mock reviews
          const reviews = Array.from({ length: Math.min(3, reviewsCount) }, (_, i) => ({
            id: `${medecin.id}-review-${i}`,
            name: ['Jean Dupont', 'Marie Curie', 'Pierre Martin', 'Sophie Bernard'][i % 4],
            date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR'),
            rating: Math.min(5, rating + (Math.random() - 0.5)),
            comment: 'Excellent professionnel, très à l\'écoute.'
          }))

          // Get random languages (1-3)
          const languages = [...mockLanguages]
            .sort(() => 0.5 - Math.random())
            .slice(0, Math.floor(Math.random() * 3) + 1)

          return {
            id: medecin.id,
            name: `${medecin.prenom} ${medecin.nom}`,
            title: mockTitles[Math.floor(Math.random() * mockTitles.length)],
            institution: institution.name,
            institutionCode: institution.code,
            specializations,
            rating: parseFloat(rating.toFixed(1)),
            reviews,
            experience: `${Math.floor(Math.random() * 20) + 5} ans d'expérience`,
            languages,
            availability,
            availableDays,
            nextSlot,
            consultationFee: Math.floor(Math.random() * 100) + 50, // 50-150 €
            image: medecin.photoUrl || '/default-doctor.jpg',
            reviewsCount,
            email: medecin.email
          }
        })

        setConsultants(transformedData)
        setError(null)
      } catch (err) {
        console.error('Error fetching medecins:', err)
        setError('Impossible de charger la liste des consultants. Veuillez réessayer plus tard.')
        setConsultants([])
      } finally {
        setLoading(false)
      }
    }

    fetchMedecins()
  }, [])

  // Extract unique values for filters
  const institutions = useMemo(() => {
    const institutionSet = new Set(consultants.map(c => c.institution))
    return Array.from(institutionSet)
  }, [consultants])

  const specializations = useMemo(() => {
    const specializationSet = new Set(consultants.flatMap(c => c.specializations || []))
    return Array.from(specializationSet)
  }, [consultants])

  // Filter consultants based on selected filters
  const filteredConsultants = useMemo(() => {
    if (!consultants || consultants.length === 0) return []
    
    return consultants.filter(consultant => {
      const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          consultant.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          consultant.specializations?.some(spec => 
                            spec.toLowerCase().includes(searchTerm.toLowerCase())
                          )

      const matchesInstitution = selectedInstitution === 'all' || 
                               consultant.institution === selectedInstitution

      const matchesSpecialization = selectedSpecialization === 'all' ||
                                  consultant.specializations?.includes(selectedSpecialization)

      const matchesAvailability = selectedAvailability === 'all' ||
                                consultant.availability === selectedAvailability

      const matchesRating = selectedRating === 'all' ||
                          (selectedRating === '4.5+' && consultant.rating >= 4.5) ||
                          (selectedRating === '4.0+' && consultant.rating >= 4.0) ||
                          (selectedRating === '3.5+' && consultant.rating >= 3.5)

      return matchesSearch && matchesInstitution && matchesSpecialization && 
             matchesAvailability && matchesRating
    })
  }, [consultants, searchTerm, selectedInstitution, selectedSpecialization, selectedAvailability, selectedRating])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedInstitution('all')
    setSelectedSpecialization('all')
    setSelectedAvailability('all')
    setSelectedRating('all')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="pt-20 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des consultants...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="pt-20 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Nos Consultants
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez notre réseau de consultants spécialisés prêts à vous accompagner 
                dans votre parcours de santé
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, spécialité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filtres
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Filters */}
              <div className={`lg:flex lg:gap-4 ${showFilters ? 'flex flex-col gap-4 mt-4 lg:mt-0' : 'hidden lg:flex'}`}>
                {/* Institution Filter */}
                <select
                  value={selectedInstitution}
                  onChange={(e) => setSelectedInstitution(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">Tous les hôpitaux</option>
                  {institutions.map(institution => (
                    <option key={institution} value={institution}>
                      {institution}
                    </option>
                  ))}
                </select>

                {/* Specialization Filter */}
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">Toutes les spécialisations</option>
                  {specializations.map(specialization => (
                    <option key={specialization} value={specialization}>
                      {specialization}
                    </option>
                  ))}
                </select>

                {/* Availability Filter */}
                <select
                  value={selectedAvailability}
                  onChange={(e) => setSelectedAvailability(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">Toute disponibilité</option>
                  <option value="Disponible">Disponible</option>
                  <option value="Occupé">Occupé</option>
                </select>

                {/* Rating Filter */}
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="all">Toutes les notes</option>
                  <option value="4.5+">4.5+ étoiles</option>
                  <option value="4.0+">4.0+ étoiles</option>
                  <option value="3.5+">3.5+ étoiles</option>
                </select>

                {/* Clear Filters */}
                {(searchTerm || selectedInstitution !== 'all' || selectedSpecialization !== 'all' || 
                  selectedAvailability !== 'all' || selectedRating !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Effacer
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Results Count */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-gray-600">
            {filteredConsultants.length} Consultant {filteredConsultants.length > 1 ? 's' : ''} trouvé{filteredConsultants.length > 1 ? 's' : ''}
          </p>
        </section>

        {/* Consultants Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filteredConsultants.length > 0 ? (
            <ConsultantsList consultants={filteredConsultants} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Aucun Consultant trouvé avec les critères sélectionnés.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}