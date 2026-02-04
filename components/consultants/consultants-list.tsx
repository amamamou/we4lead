'use client'

import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MapPin, Calendar } from 'lucide-react'
import { Consultant } from '@/types/consultant'

interface ConsultantsListProps {
  consultants: Consultant[]
}

// Function to convert name to slug
function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

export  function ConsultantsList({ consultants }: ConsultantsListProps) {
  const router = useRouter()

  const handleConsultantClick = (consultant: Consultant) => {
    const slug = nameToSlug(consultant.name)
    router.push(`/consultants/${slug}`)
  }
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
      {consultants.map((consultant) => (
        <div 
          key={consultant.id} 
          onClick={() => handleConsultantClick(consultant)}
          className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-700 group h-fit flex flex-col cursor-pointer"
        >
          
          {/* Background Image on Hover */}
          <div 
            className="absolute inset-0 bg-cover bg-center transform scale-105 opacity-0 group-hover:opacity-25 group-hover:scale-100 transition-all duration-700 ease-out z-0"
            style={{ backgroundImage: `url(${consultant.image})` }}
          ></div>
          
          {/* Card Content */}
          <div className="relative z-10 p-4 group-hover:bg-white/90 transition-all duration-700 ease-in-out flex flex-col h-full">
            <div className="flex items-start gap-4 mb-2">
              {/* Avatar */}
              <Avatar className="w-14 h-14 border-2 border-gray-100 group-hover:border-gray-200 transition-colors duration-300">
                <AvatarImage src={consultant.image} alt={consultant.name} />
                <AvatarFallback className="bg-gray-100 text-gray-600 text-base font-semibold">
                  {consultant.name.split(' ').reduce((initials, word) => initials + word[0], '')}
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
            </div>

            {/* Institution */}
            <div className="flex items-center text-gray-600 text-sm mb-3">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
              <span className="truncate leading-5">{consultant.institution}</span>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-3 mb-2 py-2 px-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-base font-semibold text-gray-900">{consultant.availableDays.length}</div>
                <div className="text-xs text-gray-500">Jours/semaine</div>
              </div>
              <div className="text-center">
                <div className="text-base font-semibold text-gray-900">
                  {consultant.availability === 'Disponible' ? '✓' : '—'}
                </div>
                <div className="text-xs text-gray-500">Disponibilité</div>
              </div>
            </div>

            {/* Next Available */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Prochain créneau:</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{consultant.nextSlot}</span>
            </div>

            {/* Available Days */}
            <div className="mb-3">
              <div className="text-sm text-gray-600 mb-2">Jours disponibles:</div>
              <div className="flex flex-wrap gap-1">
                {consultant.availableDays.map((day, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium">
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
  )
}