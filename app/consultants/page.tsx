/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Filter, MapPin, Calendar, Users, ChevronDown, X } from 'lucide-react'

const consultants = [
  {
    id: 1,
    name: 'Dr. Amira Ben Salem',
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
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&face'
  },
  {
    id: 2,
    name: 'M. Sami Mansour',
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
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&face'
  },
  {
    id: 3,
    name: 'Dr. Leila Trabelsi',
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
    image: 'https://images.unsplash.com/photo-1594824919066-63ffc0e8324a?w=300&h=300&fit=crop&face'
  },
  {
    id: 4,
    name: 'M. Ahmed Kraiem',
    title: 'Psychologue Social',
    institution: 'Faculté de Droit et des Sciences Politiques',
    institutionCode: 'FDSP',
    specializations: ['Psychologie Sociale', 'Médiation', 'Communication'],
    availability: 'Disponible',
    availableDays: ['Mardi', 'Jeudi', 'Samedi'],
    nextSlot: '16 Février 2026',
    rating: 4.6,
    reviewsCount: 142,
    experience: '7 ans',
    consultationsCount: 380,
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&face'
  },
  {
    id: 5,
    name: 'Dr. Nadia Khemiri',
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
    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300&h=300&fit=crop&face'
  },
  {
    id: 6,
    name: 'Dr. Hichem Bouaziz',
    title: 'Art-thérapeute',
    institution: 'Faculté des Lettres et Sciences Humaines',
    institutionCode: 'FLSH',
    specializations: ['Art-thérapie', 'Expression Créative', 'Trauma'],
    availability: 'Occupé',
    availableDays: ['Mercredi', 'Jeudi'],
    nextSlot: '22 Février 2026',
    rating: 4.8,
    reviewsCount: 95,
    experience: '12 ans',
    consultationsCount: 520,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&face'
  },
  {
    id: 7,
    name: 'Dr. Fatma Jebali',
    title: 'Coach en Performance',
    institution: 'École Nationale d\'Ingénieurs de Sousse',
    institutionCode: 'ENISO',
    specializations: ['Coaching Personnel', 'Performance Académique', 'Motivation'],
    availability: 'Disponible',
    availableDays: ['Lundi', 'Mardi', 'Jeudi', 'Vendredi'],
    nextSlot: '15 Février 2026',
    rating: 4.7,
    reviewsCount: 167,
    experience: '9 ans',
    consultationsCount: 445,
    image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=300&h=300&fit=crop&face'
  },
  {
    id: 8,
    name: 'M. Karim Sfaxi',
    title: 'Spécialiste Stress Professionnel',
    institution: 'École Supérieure de Commerce de Sousse',
    institutionCode: 'ESCS',
    specializations: ['Stress Professionnel', 'Leadership', 'Négociation'],
    availability: 'Disponible',
    availableDays: ['Mardi', 'Mercredi', 'Vendredi'],
    nextSlot: '17 Février 2026',
    rating: 4.6,
    reviewsCount: 134,
    experience: '11 ans',
    consultationsCount: 590,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&face'
  },
  {
    id: 9,
    name: 'Dr. Leila Mansouri',
    title: 'Conseillère en Orientation Universitaire',
    institution: 'Université de Sousse',
    institutionCode: 'US',
    specializations: ['Orientation Universitaire', 'Choix de Parcours', 'Échanges Internationaux'],
    availability: 'Disponible',
    availableDays: ['Lundi', 'Mercredi', 'Jeudi'],
    nextSlot: '14 Février 2026',
    rating: 4.8,
    reviewsCount: 298,
    experience: '12 ans',
    consultationsCount: 720,
    image: 'https://images.unsplash.com/photo-1594824694996-8ad830e3677b?w=300&h=300&fit=crop&face'
  },
  {
    id: 10,
    name: 'M. Youssef Trabelsi',
    title: 'Expert en Entrepreneuriat',
    institution: 'École Supérieure de Commerce de Sousse',
    institutionCode: 'ESCS',
    specializations: ['Entrepreneuriat', 'Business Plan', 'Innovation'],
    availability: 'Occupé',
    availableDays: ['Mardi', 'Jeudi'],
    nextSlot: '25 Février 2026',
    rating: 4.7,
    reviewsCount: 187,
    experience: '15 ans',
    consultationsCount: 680,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&face'
  },
  {
    id: 11,
    name: 'Dr. Nesrine Bouaziz',
    title: 'Psychologue Clinicienne',
    institution: 'Institut Supérieur des Sciences Humaines de Sousse',
    institutionCode: 'ISSHS',
    specializations: ['Psychologie Clinique', 'Thérapie Cognitive', 'Anxiété'],
    availability: 'Disponible',
    availableDays: ['Lundi', 'Mardi', 'Vendredi'],
    nextSlot: '12 Février 2026',
    rating: 4.9,
    reviewsCount: 245,
    experience: '8 ans',
    consultationsCount: 456,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&face'
  },
  {
    id: 12,
    name: 'M. Hamza Ghanmi',
    title: 'Consultant en Technologies',
    institution: 'École Nationale d\'Ingénieurs de Sousse',
    institutionCode: 'ENIS',
    specializations: ['Intelligence Artificielle', 'Cybersécurité', 'Développement Web'],
    availability: 'Disponible',
    availableDays: ['Mercredi', 'Jeudi', 'Samedi'],
    nextSlot: '16 Février 2026',
    rating: 4.6,
    reviewsCount: 156,
    experience: '6 ans',
    consultationsCount: 320,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&face'
  },
  {
    id: 13,
    name: 'Dr. Sonia Mehri',
    title: 'Spécialiste en Médecine Préventive',
    institution: 'Faculté de Médecine de Sousse',
    institutionCode: 'FMS',
    specializations: ['Médecine Préventive', 'Santé Publique', 'Épidémiologie'],
    availability: 'Disponible',
    availableDays: ['Lundi', 'Mercredi', 'Vendredi'],
    nextSlot: '15 Février 2026',
    rating: 4.8,
    reviewsCount: 203,
    experience: '14 ans',
    consultationsCount: 580,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&face'
  },
  {
    id: 14,
    name: 'M. Rami Kallel',
    title: 'Conseiller en Finance',
    institution: 'Institut Supérieur de Gestion de Sousse',
    institutionCode: 'ISGS',
    specializations: ['Finance', 'Investissement', 'Analyse Financière'],
    availability: 'Occupé',
    availableDays: ['Mardi', 'Jeudi'],
    nextSlot: '28 Février 2026',
    rating: 4.5,
    reviewsCount: 167,
    experience: '10 ans',
    consultationsCount: 445,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&face'
  },
  {
    id: 15,
    name: 'Dr. Imen Khelifi',
    title: 'Consultante en Développement Personnel',
    institution: 'Institut Supérieur des Sciences Humaines de Sousse',
    institutionCode: 'ISSHS',
    specializations: ['Développement Personnel', 'Confiance en Soi', 'Communication'],
    availability: 'Disponible',
    availableDays: ['Lundi', 'Mercredi', 'Samedi'],
    nextSlot: '13 Février 2026',
    rating: 4.7,
    reviewsCount: 189,
    experience: '9 ans',
    consultationsCount: 520,
    image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=300&h=300&fit=crop&face'
  },
  {
    id: 16,
    name: 'M. Firas Agrebi',
    title: 'Expert en Marketing Digital',
    institution: 'École Supérieure de Commerce de Sousse',
    institutionCode: 'ESCS',
    specializations: ['Marketing Digital', 'Réseaux Sociaux', 'E-commerce'],
    availability: 'Disponible',
    availableDays: ['Mardi', 'Jeudi', 'Vendredi'],
    nextSlot: '18 Février 2026',
    rating: 4.6,
    reviewsCount: 142,
    experience: '7 ans',
    consultationsCount: 380,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&face'
  },
  {
    id: 17,
    name: 'Dr. Mayssa Ben Salem',
    title: 'Spécialiste en Nutrition',
    institution: 'Institut Supérieur de Biotechnologie de Sousse',
    institutionCode: 'ISBS',
    specializations: ['Nutrition', 'Diététique', 'Santé Alimentaire'],
    availability: 'Disponible',
    availableDays: ['Lundi', 'Mercredi', 'Vendredi'],
    nextSlot: '14 Février 2026',
    rating: 4.8,
    reviewsCount: 234,
    experience: '11 ans',
    consultationsCount: 640,
    image: 'https://images.unsplash.com/photo-1594824694996-8ad830e3677b?w=300&h=300&fit=crop&face'
  },
  {
    id: 18,
    name: 'M. Wassim Jemli',
    title: 'Consultant en Management',
    institution: 'Institut Supérieur de Gestion de Sousse',
    institutionCode: 'ISGS',
    specializations: ['Management', 'Ressources Humaines', 'Leadership'],
    availability: 'Occupé',
    availableDays: ['Mercredi', 'Vendredi'],
    nextSlot: '22 Février 2026',
    rating: 4.5,
    reviewsCount: 178,
    experience: '13 ans',
    consultationsCount: 590,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&face'
  },
  {
    id: 19,
    name: 'Dr. Salma Hadj Ali',
    title: 'Experte en Recherche Scientifique',
    institution: 'Faculté des Sciences de Sousse',
    institutionCode: 'FSS',
    specializations: ['Recherche Scientifique', 'Méthodologie', 'Publications'],
    availability: 'Disponible',
    availableDays: ['Mardi', 'Jeudi', 'Samedi'],
    nextSlot: '16 Février 2026',
    rating: 4.9,
    reviewsCount: 267,
    experience: '16 ans',
    consultationsCount: 750,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&face'
  },
  {
    id: 20,
    name: 'M. Khalil Makni',
    title: 'Conseiller en Carrières Internationales',
    institution: 'Université de Sousse',
    institutionCode: 'US',
    specializations: ['Carrières Internationales', 'Mobilité', 'Langues Étrangères'],
    availability: 'Disponible',
    availableDays: ['Lundi', 'Mercredi', 'Vendredi'],
    nextSlot: '15 Février 2026',
    rating: 4.7,
    reviewsCount: 198,
    experience: '12 ans',
    consultationsCount: 560,
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&face'
  },
  {
    id: 21,
    name: 'Dr. Rim Cherif',
    title: 'Psychologue du Travail',
    institution: 'Institut Supérieur des Sciences Humaines de Sousse',
    institutionCode: 'ISSHS',
    specializations: ['Psychologie du Travail', 'Burn-out', 'Motivation'],
    availability: 'Disponible',
    availableDays: ['Mardi', 'Jeudi', 'Samedi'],
    nextSlot: '17 Février 2026',
    rating: 4.8,
    reviewsCount: 221,
    experience: '10 ans',
    consultationsCount: 480,
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&face'
  },
  {
    id: 22,
    name: 'M. Nizar Bouguerra',
    title: 'Expert en Innovation',
    institution: 'École Nationale d\'Ingénieurs de Sousse',
    institutionCode: 'ENIS',
    specializations: ['Innovation', 'Start-up', 'Propriété Intellectuelle'],
    availability: 'Disponible',
    availableDays: ['Lundi', 'Mercredi', 'Vendredi'],
    nextSlot: '19 Février 2026',
    rating: 4.6,
    reviewsCount: 154,
    experience: '8 ans',
    consultationsCount: 340,
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&face'
  }
]

export default function ConsultantsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInstitution, setSelectedInstitution] = useState('all')
  const [selectedSpecialization, setSelectedSpecialization] = useState('all')
  const [selectedAvailability, setSelectedAvailability] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  const consultantsPerPage = 9
  const [openSpecializations, setOpenSpecializations] = useState<{[key: number]: boolean}>({})

  const institutions = ['all', ...new Set(consultants.map(c => c.institutionCode))]
  const specializations = ['all', ...new Set(consultants.flatMap(c => c.specializations))]
  const availabilities = ['all', 'Disponible', 'Occupé']
  const ratings = ['all', '4.5+', '4.7+', '4.8+']

  const filteredConsultants = useMemo(() => {
    return consultants.filter(consultant => {
      const matchesSearch = consultant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           consultant.specializations.some(spec => 
                             spec.toLowerCase().includes(searchTerm.toLowerCase())
                           ) ||
                           consultant.institution.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesInstitution = selectedInstitution === 'all' || 
                                consultant.institutionCode === selectedInstitution
      
      const matchesSpecialization = selectedSpecialization === 'all' || 
                                   consultant.specializations.includes(selectedSpecialization)
      
      const matchesAvailability = selectedAvailability === 'all' || 
                                 consultant.availability === selectedAvailability
      
      const matchesRating = selectedRating === 'all' || 
                           (selectedRating === '4.5+' && consultant.rating >= 4.5) ||
                           (selectedRating === '4.7+' && consultant.rating >= 4.7) ||
                           (selectedRating === '4.8+' && consultant.rating >= 4.8)
      
      return matchesSearch && matchesInstitution && matchesSpecialization && 
             matchesAvailability && matchesRating
    })
  }, [searchTerm, selectedInstitution, selectedSpecialization, selectedAvailability, selectedRating])

  // Pagination logic
  const totalPages = Math.ceil(filteredConsultants.length / consultantsPerPage)
  const startIndex = (currentPage - 1) * consultantsPerPage
  const paginatedConsultants = filteredConsultants.slice(startIndex, startIndex + consultantsPerPage)

  const toggleSpecializations = (consultantId: number) => {
    setOpenSpecializations(prev => ({
      ...prev,
      [consultantId]: !prev[consultantId]
    }))
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedInstitution('all')
    setSelectedSpecialization('all')
    setSelectedAvailability('all')
    setSelectedRating('all')
    setCurrentPage(1)
  }

  // Helper functions to reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleInstitutionChange = (value: string) => {
    setSelectedInstitution(value)
    setCurrentPage(1)
  }

  const handleSpecializationChange = (value: string) => {
    setSelectedSpecialization(value)
    setCurrentPage(1)
  }

  const handleAvailabilityChange = (value: string) => {
    setSelectedAvailability(value)
    setCurrentPage(1)
  }

  const handleRatingChange = (value: string) => {
    setSelectedRating(value)
    setCurrentPage(1)
  }

  const activeFiltersCount = [selectedInstitution, selectedSpecialization, selectedAvailability, selectedRating]
    .filter(filter => filter !== 'all').length

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Header Section */}
      <section className="py-8 bg-gradient-to-r from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 mt-10">
                Liste des consultants
              </h1>
              <p className="text-gray-600 text-base max-w-2xl">
                Trouvez le professionnel idéal selon votre établissement, vos besoins et votre disponibilité
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-6 border-b border-gray-100 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row gap-4">
            
            {/* Search Bar */}
            <div className="relative flex-1 lg:max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher consultant, spécialité..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-12 pr-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2B61D6]/20 focus:border-[#2B61D6]/30 transition-all duration-200"
              />
            </div>
            
            {/* Filter Toggle for Mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 rounded-xl font-medium text-gray-700 hover:bg-gray-200 transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Desktop Filters */}
            <div className={`${showFilters ? 'block' : 'hidden lg:flex'} flex flex-col lg:flex-row gap-4`}>
              
              {/* Institution Filter */}
              <select
                value={selectedInstitution}
                onChange={(e) => handleInstitutionChange(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2B61D6]/20 focus:border-[#2B61D6]/30 transition-all duration-200 cursor-pointer"
              >
                <option value="all">Tous les établissements</option>
                {institutions.slice(1).map(institution => (
                  <option key={institution} value={institution}>{institution}</option>
                ))}
              </select>

              {/* Specialization Filter */}
              <select
                value={selectedSpecialization}
                onChange={(e) => handleSpecializationChange(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2B61D6]/20 focus:border-[#2B61D6]/30 transition-all duration-200 cursor-pointer"
              >
                <option value="all">Toutes les spécialités</option>
                {specializations.slice(1).map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>

              {/* Availability Filter */}
              <select
                value={selectedAvailability}
                onChange={(e) => handleAvailabilityChange(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2B61D6]/20 focus:border-[#2B61D6]/30 transition-all duration-200 cursor-pointer"
              >
                <option value="all">Toute disponibilité</option>
                {availabilities.slice(1).map(availability => (
                  <option key={availability} value={availability}>{availability}</option>
                ))}
              </select>

              {/* Rating Filter */}
              <select
                value={selectedRating}
                onChange={(e) => handleRatingChange(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2B61D6]/20 focus:border-[#2B61D6]/30 transition-all duration-200 cursor-pointer"
              >
                <option value="all">Toutes les notes</option>
                {ratings.slice(1).map(rating => (
                  <option key={rating} value={rating}>{rating}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Counter - Moved below filters */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">{filteredConsultants.length}</span> consultant{filteredConsultants.length > 1 ? 's' : ''} trouvé{filteredConsultants.length > 1 ? 's' : ''}
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Effacer les filtres
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Consultants Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredConsultants.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun consultant trouvé</h3>
              <p className="text-gray-500 mb-4">Essayez d'ajuster vos critères de recherche</p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-[#2B61D6] text-white rounded-xl font-medium hover:bg-[#1f52c4] transition-colors duration-200"
              >
                Voir tous les consultants
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {paginatedConsultants.map((consultant) => (
                <div key={consultant.id} className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-700 group h-[520px] flex flex-col">
                  
                  {/* Background Image on Hover */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transform scale-105 opacity-0 group-hover:opacity-25 group-hover:scale-100 transition-all duration-700 ease-out z-0"
                    style={{ backgroundImage: `url(${consultant.image})` }}
                  ></div>
                  
                  {/* Card Content */}
                  <div className="relative z-10 p-6 group-hover:bg-white/90 transition-all duration-700 ease-in-out flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      {/* Avatar */}
                      <Avatar className="w-20 h-20 border-2 border-gray-100 group-hover:border-gray-200 transition-colors duration-300">
                        <AvatarImage src={consultant.image} alt={consultant.name} />
                        <AvatarFallback className="bg-gray-100 text-gray-600 text-xl font-semibold">
                          {consultant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Basic Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg mb-1">
                          {consultant.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">{consultant.title}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            {consultant.institutionCode}
                          </span>
                        </div>
                      </div>
                      
                      {/* Availability Badge */}
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        consultant.availability === 'Disponible' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {consultant.availability}
                      </div>
                    </div>

                    {/* Institution */}
                    <div className="flex items-center text-gray-600 text-sm mb-4">
                      <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{consultant.institution}</span>
                    </div>

                    {/* Specializations */}
                    <div className="mb-4">
                      <div className="relative">
                        {/* Show first specialization + dropdown */}
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                            {consultant.specializations[0]}
                          </span>
                          {consultant.specializations.length > 1 && (
                            <div className="relative">
                              <button 
                                onClick={() => toggleSpecializations(consultant.id)}
                                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1 hover:bg-gray-200 transition-colors duration-200"
                              >
                                +{consultant.specializations.length - 1}
                                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openSpecializations[consultant.id] ? 'rotate-180' : ''}`} />
                              </button>
                              
                              {/* Dropdown */}
                              {openSpecializations[consultant.id] && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                                  <div className="p-2 space-y-1">
                                    {consultant.specializations.slice(1).map((spec, index) => (
                                      <div key={index} className="px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded">
                                        {spec}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 gap-4 mb-4 py-3 px-4 bg-gray-50 rounded-xl">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">{consultant.availableDays.length}</div>
                        <div className="text-xs text-gray-500">Jours/semaine</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-gray-900">
                          {consultant.availability === 'Disponible' ? 'Ouvert' : 'Complet'}
                        </div>
                        <div className="text-xs text-gray-500">Statut</div>
                      </div>
                    </div>

                    {/* Next Available */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Prochain créneau:</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{consultant.nextSlot}</span>
                    </div>

                    {/* Available Days */}
                    <div className="mb-6">
                      <div className="text-sm text-gray-600 mb-2">Jours disponibles:</div>
                      <div className="flex flex-wrap gap-1">
                        {consultant.availableDays.map((day, index) => (
                          <span key={index} className="px-2 py-1 bg-[#2B61D6]/10 text-[#2B61D6] text-xs rounded-full">
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Spacer to push button to bottom */}
                    <div className="flex-grow"></div>

                    {/* Action Button */}
                    <button 
                      onClick={() => window.location.href = `/consultants/${consultant.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`}
                      className="w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200 flex items-center justify-center group mt-auto"
                    >
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      Voir Profil & Réserver
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center space-x-2">
              
              {/* Previous button */}
              <button
                onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-lg bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-sm font-medium"
              >
                ‹
              </button>

              {/* Page numbers */}
              <div className="flex items-center space-x-1 mx-4">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1
                  const isCurrentPage = pageNumber === currentPage
                  
                  // Show first page, last page, current page, and pages around current
                  const showPage = pageNumber === 1 || 
                                 pageNumber === totalPages || 
                                 Math.abs(pageNumber - currentPage) <= 1
                  
                  if (!showPage && pageNumber === currentPage - 2) {
                    return <span key={pageNumber} className="px-2 text-gray-400 text-sm">•••</span>
                  }
                  
                  if (!showPage && pageNumber === currentPage + 2) {
                    return <span key={pageNumber} className="px-2 text-gray-400 text-sm">•••</span>
                  }
                  
                  if (!showPage) return null

                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                        isCurrentPage
                          ? 'bg-white text-gray-900 shadow-md font-semibold'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  )
                })}
              </div>

              {/* Next button */}
              <button
                onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-lg bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-sm font-medium"
              >
                ›
              </button>
            </div>

            {/* Results info centered below */}
            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">
                Page {currentPage} sur {totalPages} • {filteredConsultants.length} résultat{filteredConsultants.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}
