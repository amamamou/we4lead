/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { MapPin, Phone, Clock, Users, CheckCircle, Calendar, Search, School } from 'lucide-react'

interface University {
  id: number
  nom: string
  code: string
  adresse: string | null
  telephone: string | null
  nbEtudiants: number | null
  consultationsAvailable?: number // optional if backend doesn't provide
  horaire: string | null
  specializations?: string[] // optional
  logoPath: string | null
}

export default function InstitutionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [universities, setUniversities] = useState<University[]>([])

  // ================= FETCH UNIVERSITIES =================
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/users/universites`)
        if (!res.ok) throw new Error('Failed to fetch universities')
        const data = await res.json()
        setUniversities(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchUniversities()
  }, [])

  // ================= FILTERED =================
  const filteredInstitutions = universities.filter(
    (institution) =>
      institution.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institution.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Header Section */}
      <section className="py-8 bg-gradient-to-r from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 mt-10">
            Liste des établissements
          </h1>
          <p className="text-gray-600 text-base max-w-2xl">
            Nos établissements partenaires avec leurs équipes de professionnels dédiés
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-6 border-b border-gray-100 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 lg:max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher par nom ou code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2B61D6]/20 focus:border-[#2B61D6]/30 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">{filteredInstitutions.length}</span> établissement{filteredInstitutions.length > 1 ? 's' : ''} trouvé{filteredInstitutions.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </section>

      {/* Institutions Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInstitutions.map((institution) => (
              <div key={institution.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                
                {/* Card Header */}
                <div className="p-6 border-b border-gray-50">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Logo */}
                    <div className="w-16 h-16 bg-white rounded-xl border-2 border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:border-[#2B61D6]/20 transition-colors duration-300 overflow-hidden">
                      {institution.logoPath ? (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${institution.logoPath}`}
                          alt={`${institution.nom} logo`}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      ) : (
                        <School size={32} className="text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="inline-flex items-center px-3 py-1 bg-[#2B61D6]/10 text-[#2B61D6] text-xs font-medium rounded-full mb-2">
                        {institution.code}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2">{institution.nom}</h3>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm mb-1">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    {institution.adresse || 'Adresse non disponible'}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                    {institution.telephone || 'Téléphone non disponible'}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <Users className="w-5 h-5 text-[#2B61D6] mx-auto mb-1" />
                      <div className="text-lg font-semibold text-gray-900">{institution.nbEtudiants || 'N/A'}</div>
                      <div className="text-xs text-gray-500">Étudiants</div>
                    </div>
                    <div className="text-center">
                      <Clock className="w-5 h-5 text-[#2B61D6] mx-auto mb-1" />
                      <div className="text-lg font-semibold text-gray-900">{institution.consultationsAvailable || 'N/A'}</div>
                      <div className="text-xs text-gray-500">Créneaux/sem</div>
                    </div>
                    <div className="text-center">
                      <CheckCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                      <div className="text-lg font-semibold text-gray-900">100%</div>
                      <div className="text-xs text-gray-500">Gratuit</div>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="text-xs font-medium text-gray-600 mb-1">Horaires d'ouverture</div>
                    <div className="text-sm text-gray-900">{institution.horaire || 'Non renseigné'}</div>
                  </div>

                  {/* Specializations */}
                  <div className="mb-6">
                    <div className="text-xs font-medium text-gray-600 mb-2">Spécialisations disponibles</div>
                    <div className="flex flex-wrap gap-1">
                      {(institution.specializations || []).map((spec, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">{spec}</span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center group">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" /> Prendre Rendez-vous
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
