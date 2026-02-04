'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

export function ConsultantsDirectory() {
  const router = useRouter()
  const consultants = [
    {
      id: 1,
      name: 'Dr. Amira Ben Salem',
      specialty: 'Psychologie Clinique',
      available: 'Lun, Mar, Jeu',
      badge: 'DABS',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&face',
    },
    {
      id: 2,
      name: 'M. Sami Mansour',
      specialty: 'Thérapies Cognitives',
      available: 'Mar, Ven',
      badge: 'Spécialiste',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&face',
    },
    {
      id: 3,
      name: 'Mme. Fatima Gharbi',
      specialty: 'Psychopédagogie',
      available: 'Lun, Mer',
      badge: 'Éducatrice',
      image: 'https://images.unsplash.com/photo-1594824919066-63ffc0e8324a?w=300&h=300&fit=crop&face',
    },
    {
      id: 4,
      name: 'Dr. Yasmine Bakri',
      specialty: 'Neuropsychologie',
      available: 'Mar, Jeu, Ven',
      badge: 'Spécialiste',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&face',
    },
    {
      id: 5,
      name: 'Dr. Karim Toumi',
      specialty: 'Psychiatrie',
      available: 'Lun, Mer, Ven',
      badge: 'Psychiatre',
      image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300&h=300&fit=crop&face',
    },
    {
      id: 6,
      name: 'Mme. Salma Hajri',
      specialty: 'Coaching Personnel',
      available: 'Mar, Jeu',
      badge: 'Coach',
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&face',
    },
    {
      id: 7,
      name: 'Dr. Nadia Ferjani',
      specialty: 'Thérapie Familiale',
      available: 'Lun, Mar',
      badge: 'Thérapeute',
      image: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=300&h=300&fit=crop&face',
    },
    {
      id: 8,
      name: 'M. Youssef Dridi',
      specialty: 'Orientation Scolaire',
      available: 'Mer, Ven',
      badge: 'Conseiller',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&face',
    },
  ]

  const getInitials = (name: string) =>
    name
      .replace(/Dr\.|Mme\.|M\./g, '')
      .trim()
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()

  const cardsPerPage = 3
  const totalPages = Math.ceil(consultants.length / cardsPerPage)
  const [page, setPage] = useState(0)

  const canPrev = page > 0
  const canNext = page < totalPages - 1

  // Manual navigation function
  const handleManualNavigation = (newPage: number) => {
    setPage(newPage)
  }

  const visibleConsultants = consultants.slice(
    page * cardsPerPage,
    page * cardsPerPage + cardsPerPage
  )

  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ========== HEADER ========== */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-gray-900">
            Nos Consultants
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Des professionnels qualifiés à votre écoute pour vous accompagner.
          </p>
        </div>

        {/* ========== CARDS SLIDER WITH SIDE ARROWS ========== */}
        <div className="flex items-center gap-4">

          {/* Left Arrow */}
          <button
            onClick={() => handleManualNavigation(page - 1)}
            disabled={!canPrev}
            className="
              hidden lg:flex
              w-10 h-10
              items-center justify-center
              rounded-full
              bg-white
              text-gray-500
              shadow-sm
              hover:shadow-md
              hover:text-[#2B61D6]
              disabled:opacity-40
              disabled:cursor-not-allowed
              transition
              flex-shrink-0
            "
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Cards Grid */}
          <div 
            className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {visibleConsultants.map((c) => (
              <div
                key={c.id}
                className="
                  group
                  relative
                  bg-white
                  rounded-2xl
                  shadow-sm
                  hover:shadow-lg
                  hover:scale-102
                  transition-all
                  duration-700
                  min-h-[340px]
                  w-full
                  overflow-hidden
              "
            >
              {/* Background Image on Hover */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-30 transition-all duration-700 ease-out z-0"
                style={{ backgroundImage: `url(${c.image})` }}
              ></div>

              {/* Card Content - back to original structure */}
              <div className="relative z-10 p-6 flex flex-col items-center text-center w-full h-full">
              
              {/* Avatar */}
              <div
                className="
                  rounded-full
                  p-0
                  border-4
                  border-transparent
                  group-hover:border-[#D0DCF6]
                  transition
                  mb-3
                "
              >
                <Avatar className="w-28 h-28 shadow-sm">
                  <AvatarImage
                    src={c.image}
                    alt={c.name}
                  />
                  <AvatarFallback className="text-lg font-semibold text-gray-600 bg-gray-100">
                    {getInitials(c.name)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Name */}
              <h3 className="font-semibold text-gray-900 text-base leading-tight mb-1 mt-2">
                {c.name}
              </h3>

              {/* Specialty */}
              <p className="text-xs text-gray-500 mb-4">{c.specialty}</p>

              {/* Availability Chip */}
              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  bg-gray-100
                  text-gray-600
                  text-xs
                  font-medium
                  px-3
                  py-1.5
                  rounded-md
                  mb-5
                "
              >
                <CalendarDays className="w-3.5 h-3.5 text-[#2B61D6]" />
                <span>{c.available}</span>
              </div>

              {/* CTA Button */}
              <button
                className="
                  mt-auto
                  w-full
                  h-10
                  rounded-lg
                  bg-[#2B61D6]
                  text-white
                  text-xs
                  font-semibold
                  hover:bg-[#1f52c4]
                  transition
                "
              >
                Prendre rendez-vous
              </button>
              
              </div>
            </div>
          ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => handleManualNavigation(page + 1)}
            disabled={!canNext}
            className="
              hidden lg:flex
              w-10 h-10
              items-center justify-center
              rounded-full
              bg-white
              text-gray-500
              shadow-sm
              hover:shadow-md
              hover:text-[#2B61D6]
              disabled:opacity-40
              disabled:cursor-not-allowed
              transition
              flex-shrink-0
            "
          >
            <ChevronRight className="w-5 h-5" />
          </button>

        </div>

        {/* ========== VIEW ALL LINK ========== */}
        <div className="mt-10 text-center">
          <button
            onClick={() => router.push('/consultants')}
            className="
              inline-flex
              items-center
              gap-1.5
              text-[#2B61D6]
              text-sm
              font-medium
              hover:underline
              hover:underline-offset-2
              transition
            "
          >
            Voir tous les consultants
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  )
}