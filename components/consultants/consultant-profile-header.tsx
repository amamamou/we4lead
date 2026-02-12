'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar as CalendarIcon, MapPin } from 'lucide-react'
import { Consultant } from '@/types/consultant'
import { useState } from 'react'

interface ConsultantProfileHeaderProps {
  consultant: Consultant
  onBookingClick: () => void
}

export function ConsultantProfileHeader({ consultant, onBookingClick }: ConsultantProfileHeaderProps) {
  const [imageError, setImageError] = useState(false)
  
  // Get initials from consultant name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }

  return (
  <section className="w-full pb-16">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-48 h-48 rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
                {!imageError && consultant.image ? (
                  <Image 
                    src={consultant.image} 
                    alt={consultant.name}
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-600 text-4xl font-semibold">
                      {getInitials(consultant.name)}
                    </span>
                  </div>
                )}
              </div>
              {/* availability icon intentionally removed */}
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

              <div className="flex items-center justify-center lg:justify-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600 text-center lg:text-left">{consultant.institution}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:w-64">
              <Button 
                size="lg" 
                onClick={onBookingClick}
                className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium rounded-xl h-12"
              >
                <CalendarIcon className="w-5 h-5 mr-2" />
                Réserver un créneau
              </Button>
              
              <div className="mt-4 text-center text-gray-500">
                <div className="text-sm">Prochain créneau</div>
                <div className="text-sm font-medium">{consultant.nextSlot}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}