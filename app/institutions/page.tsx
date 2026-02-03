/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { MapPin, Phone, Clock, Users, CheckCircle, Calendar, Search } from 'lucide-react'

export default function InstitutionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const institutions = [
    {
      id: 1,
      name: 'Faculté de Médecine de Sousse',
      code: 'FMS',
      address: 'Avenue Mohamed Karoui, Sousse 4000',
      phone: '+216 73 224 300',
      students: '2,800+',
      consultationsAvailable: 15,
      hours: 'Lun-Ven: 8h-17h',
      specializations: ['Psychologie Clinique', 'Psychiatrie', 'Thérapie Cognitive'],
      logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=80&h=80&fit=crop'
    },
    {
      id: 2,
      name: 'Faculté des Sciences Économiques et de Gestion',
      code: 'FSEG',
      address: 'Rue Abderrazak Bourguiba, Sousse 4023',
      phone: '+216 73 368 201',
      students: '3,200+',
      consultationsAvailable: 12,
      hours: 'Lun-Ven: 8h30-16h30',
      specializations: ['Psychologie du Travail', 'Gestion du Stress', 'Orientation Professionnelle'],
      logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=80&h=80&fit=crop'
    },
    {
      id: 3,
      name: 'Faculté de Droit et des Sciences Politiques',
      code: 'FDSP',
      address: 'Boulevard Environnement, Sousse 4000',
      phone: '+216 73 368 512',
      students: '2,100+',
      consultationsAvailable: 10,
      hours: 'Lun-Ven: 9h-16h',
      specializations: ['Psychologie Sociale', 'Médiation', 'Thérapie de Groupe'],
      logo: 'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=80&h=80&fit=crop'
    },
    {
      id: 4,
      name: 'Institut Supérieur d\'Informatique et de Multimédia',
      code: 'ISIMS',
      address: 'Cité Riadh, Sousse 4023',
      phone: '+216 73 368 818',
      students: '1,500+',
      consultationsAvailable: 8,
      hours: 'Lun-Ven: 8h-17h',
      specializations: ['Psychologie Numérique', 'Addiction aux Écrans', 'Anxiété Technologique'],
      logo: 'https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=80&h=80&fit=crop'
    },
    {
      id: 5,
      name: 'Faculté des Lettres et Sciences Humaines',
      code: 'FLSH',
      address: 'Boulevard du 14 Janvier, Sousse 4000',
      phone: '+216 73 224 188',
      students: '1,800+',
      consultationsAvailable: 11,
      hours: 'Lun-Ven: 8h30-16h',
      specializations: ['Psychologie Clinique', 'Art-thérapie', 'Psychologie de l\'Éducation'],
      logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=80&h=80&fit=crop'
    },
    {
      id: 6,
      name: 'École Nationale d\'Ingénieurs de Sousse',
      code: 'ENISO',
      address: 'Pôle Technologique de Sousse, 4054',
      phone: '+216 73 369 500',
      students: '1,200+',
      consultationsAvailable: 9,
      hours: 'Lun-Ven: 8h-17h30',
      specializations: ['Burn-out Académique', 'Gestion du Stress', 'Coaching Personnel'],
      logo: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=80&h=80&fit=crop'
    },
    {
      id: 7,
      name: 'Institut Supérieur des Sciences Appliquées et de Technologie',
      code: 'ISSAT',
      address: 'Cité Taffala, Ibn Khaldoun, Sousse 4003',
      phone: '+216 73 369 400',
      students: '2,200+',
      consultationsAvailable: 13,
      hours: 'Lun-Ven: 8h-16h30',
      specializations: ['Gestion du Stress Technique', 'Psychologie Cognitive', 'Accompagnement Professionnel'],
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop'
    },
    {
      id: 8,
      name: 'Faculté des Sciences de Sousse',
      code: 'FSS',
      address: 'Cité Riadh, Sousse 4023',
      phone: '+216 73 368 500',
      students: '1,900+',
      consultationsAvailable: 10,
      hours: 'Lun-Ven: 8h30-17h',
      specializations: ['Anxiété de Performance', 'Gestion du Stress Académique', 'Orientation'],
      logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=80&h=80&fit=crop'
    },
    {
      id: 9,
      name: 'Institut Supérieur des Sciences Humaines de Sousse',
      code: 'ISSHS',
      address: 'Avenue Abou Nawas, Sousse 4000',
      phone: '+216 73 225 800',
      students: '1,400+',
      consultationsAvailable: 9,
      hours: 'Lun-Ven: 8h-16h',
      specializations: ['Psychologie Sociale', 'Thérapie Familiale', 'Développement Personnel'],
      logo: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=80&h=80&fit=crop'
    },
    {
      id: 10,
      name: 'Institut Supérieur de Musique de Sousse',
      code: 'ISMS',
      address: 'Avenue de la République, Sousse 4000',
      phone: '+216 73 226 400',
      students: '650+',
      consultationsAvailable: 6,
      hours: 'Lun-Ven: 9h-16h',
      specializations: ['Art-thérapie', 'Gestion du Trac', 'Créativité et Bien-être'],
      logo: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=80&h=80&fit=crop'
    },
    {
      id: 11,
      name: 'Institut Supérieur des Beaux Arts de Sousse',
      code: 'ISBAS',
      address: 'Avenue de la Corniche, Sousse 4000',
      phone: '+216 73 227 200',
      students: '800+',
      consultationsAvailable: 7,
      hours: 'Lun-Ven: 8h30-17h',
      specializations: ['Art-thérapie', 'Expression Créative', 'Gestion de la Sensibilité Artistique'],
      logo: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=80&h=80&fit=crop'
    },
    {
      id: 12,
      name: 'Institut Supérieur d\'Éducation et de Formation Continue',
      code: 'ISEFC',
      address: 'Rue Ibn Sina, Sousse 4000',
      phone: '+216 73 228 100',
      students: '1,100+',
      consultationsAvailable: 8,
      hours: 'Lun-Ven: 8h-16h',
      specializations: ['Psychologie de l\'Éducation', 'Formation Continue', 'Accompagnement Professionnel'],
      logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop'
    },
    {
      id: 13,
      name: 'École Supérieure de Commerce de Sousse',
      code: 'ESCS',
      address: 'Avenue Abdelhamid El Kadhi, Sousse 4011',
      phone: '+216 73 369 950',
      students: '2,500+',
      consultationsAvailable: 14,
      hours: 'Lun-Ven: 8h-17h',
      specializations: ['Psychologie du Commerce', 'Leadership', 'Gestion du Stress Professionnel'],
      logo: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=80&h=80&fit=crop'
    },
    {
      id: 14,
      name: 'Institut Supérieur de Finance et Fiscalité de Sousse',
      code: 'ISFFS',
      address: 'Route de Ceinture, Sousse 4054',
      phone: '+216 73 368 700',
      students: '1,600+',
      consultationsAvailable: 9,
      hours: 'Lun-Ven: 8h30-16h30',
      specializations: ['Gestion du Stress Financier', 'Prise de Décision', 'Anxiété Professionnelle'],
      logo: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=80&h=80&fit=crop'
    },
    {
      id: 15,
      name: 'École Supérieure des Sciences et Techniques de la Santé',
      code: 'ESSTSS',
      address: 'Avenue Ibn El Jazzar, Sousse 4002',
      phone: '+216 73 224 800',
      students: '1,300+',
      consultationsAvailable: 11,
      hours: 'Lun-Ven: 8h-17h',
      specializations: ['Psychologie de la Santé', 'Burn-out Soignant', 'Empathie Médicale'],
      logo: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=80&h=80&fit=crop'
    }
  ]

  const filteredInstitutions = institutions.filter(institution =>
    institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    institution.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Header Section */}
      <section className="py-8 bg-gradient-to-r from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 mt-10">
                Liste des établissements
              </h1>
              <p className="text-gray-600 text-base max-w-2xl">
                Nos établissements partenaires avec leurs équipes de professionnels dédiés
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
                placeholder="Rechercher par nom ou code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2B61D6]/20 focus:border-[#2B61D6]/30 transition-all duration-200"
              />
            </div>
          </div>

          {/* Results Counter - Moved below filters */}
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
          
          {/* Institutions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInstitutions.map((institution) => (
              <div key={institution.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                
                {/* Card Header with Logo */}
                <div className="p-6 border-b border-gray-50">
                  <div className="flex items-start gap-4 mb-4">
                    {/* University Logo */}
                    <div className="w-16 h-16 bg-white rounded-xl border-2 border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:border-[#2B61D6]/20 transition-colors duration-300 overflow-hidden">
                      <Image
                        src={institution.logo || 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/University_of_Sousse_logo.png/120px-University_of_Sousse_logo.png'}
                        alt={`${institution.name} logo`}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    
                    {/* Institution Info */}
                    <div className="flex-1 min-w-0">
                      <div className="inline-flex items-center px-3 py-1 bg-[#2B61D6]/10 text-[#2B61D6] text-xs font-medium rounded-full mb-2">
                        {institution.code}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2">
                        {institution.name}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{institution.address}</span>
                  </div>
                  
                  {/* Phone */}
                  <div className="flex items-center text-gray-500 text-sm">
                    <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{institution.phone}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  
                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <Users className="w-5 h-5 text-[#2B61D6] mx-auto mb-1" />
                      <div className="text-lg font-semibold text-gray-900">{institution.students}</div>
                      <div className="text-xs text-gray-500">Étudiants</div>
                    </div>
                    <div className="text-center">
                      <Clock className="w-5 h-5 text-[#2B61D6] mx-auto mb-1" />
                      <div className="text-lg font-semibold text-gray-900">{institution.consultationsAvailable}</div>
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
                    <div className="text-sm text-gray-900">{institution.hours}</div>
                  </div>

                  {/* Specializations */}
                  <div className="mb-6">
                    <div className="text-xs font-medium text-gray-600 mb-2">Spécialisations disponibles</div>
                    <div className="flex flex-wrap gap-1">
                      {institution.specializations.map((spec, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center group">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    Prendre Rendez-vous
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