'use client'

import { useState, useMemo } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { ConsultantsList } from '@/components/consultants'
import { consultants } from '@/lib/consultant-data'
import { Search, Filter, ChevronDown, X } from 'lucide-react'

export default function ConsultantsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInstitution, setSelectedInstitution] = useState('all')
  const [selectedSpecialization, setSelectedSpecialization] = useState('all')
  const [selectedAvailability, setSelectedAvailability] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique values for filters
  const institutions = useMemo(() => {
    const institutionSet = new Set(consultants.map(c => c.institution))
    return Array.from(institutionSet)
  }, [])

  const specializations = useMemo(() => {
    const specializationSet = new Set(consultants.flatMap(c => c.specializations || []))
    return Array.from(specializationSet)
  }, [])

  // Filter consultants based on selected filters
  const filteredConsultants = useMemo(() => {
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
  }, [searchTerm, selectedInstitution, selectedSpecialization, selectedAvailability, selectedRating])

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedInstitution('all')
    setSelectedSpecialization('all')
    setSelectedAvailability('all')
    setSelectedRating('all')
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
                Nos Consultants Experts
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Découvrez notre réseau de consultants spécialisés prêts à vous accompagner 
                dans votre parcours académique et professionnel
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
                  <option value="all">Toutes les institutions</option>
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
            {filteredConsultants.length} consultant{filteredConsultants.length > 1 ? 's' : ''} trouvé{filteredConsultants.length > 1 ? 's' : ''}
          </p>
        </section>

        {/* Consultants Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ConsultantsList consultants={filteredConsultants} />
        </section>
      </main>

      <Footer />
    </div>
  )
}