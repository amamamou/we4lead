"use client"

import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MapPin, Calendar, Search, ChevronsUpDown } from 'lucide-react'
import { Consultant } from '@/types/consultant'

interface DoctorsListProps {
  consultants: Consultant[]
  title?: string
}

// Function to convert name to slug
function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

export function DoctorsList({ consultants, title }: DoctorsListProps) {
  const router = useRouter()

  // Local UI state
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<'name' | 'availability' | 'rating' | 'next'>('name')

  const commonInstitution = useMemo(() => {
    if (!consultants || consultants.length === 0) return null
    const first = consultants[0].institution
    for (let i = 1; i < consultants.length; i++) {
      if (consultants[i].institution !== first) return null
    }
    return first
  }, [consultants])

  // Default to a concise French header when no specific institution/title is provided
  const displayTitle = title ?? (commonInstitution ? `Médecins disponibles pour ${commonInstitution}` : 'Médecins disponibles')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return consultants.filter((c) => {
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.institution.toLowerCase().includes(q)
      )
    })
  }, [consultants, query])

  const sorted = useMemo(() => {
    const list = [...filtered]
    switch (sort) {
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'availability':
        // Disponible first
        list.sort((a, b) => (a.availability === b.availability ? 0 : a.availability === 'Disponible' ? -1 : 1))
        break
      case 'rating':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'next':
        // place those with a nextSlot earlier (or present) first — best-effort by existence
        list.sort((a, b) => {
          if (a.nextSlot && !b.nextSlot) return -1
          if (!a.nextSlot && b.nextSlot) return 1
          return a.nextSlot.localeCompare(b.nextSlot)
        })
        break
    }
    return list
  }, [filtered, sort])

  const handleConsultantClick = (consultant: Consultant) => {
    const slug = consultant.slug ? consultant.slug : nameToSlug(consultant.name)
    router.push(`/dashboard/consultants/${slug}`)
  }
  return (
    <div>
      {/* Top controls: compact on mobile, full controls on md+ */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 truncate">{displayTitle}</h2>
            <div className="hidden md:block text-sm text-gray-600 mt-1">{sorted.length} consultants trouvés</div>
          </div>

          {/* compact count on mobile */}
          <div className="md:hidden text-sm text-gray-600">{sorted.length} trouvés</div>
        </div>

        {/* mobile compact search + sort (visible only under md) */}
        <div className="mt-2 md:hidden flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher..."
              className="pl-10 pr-3 py-2 rounded-full border border-gray-200 text-sm w-full bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1">
            <ChevronsUpDown className="w-4 h-4 text-gray-400" />
            <select
              value={sort}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSort(e.target.value as 'name' | 'availability' | 'rating' | 'next')}
              className="text-sm bg-white border border-gray-200 rounded-lg py-2 px-2 w-[110px]"
            >
            <option value="name">Nom</option>
            <option value="availability">Disponibilité</option>
            <option value="rating">Note</option>
            <option value="next">Prochain</option>
            </select>
          </div>
        </div>

        {/* search + sort: visible on md+ only */}
        <div className="mt-3 hidden md:flex md:items-center md:justify-between gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un consultant, établissement ou spécialité..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm md:w-[320px] w-full bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <ChevronsUpDown className="w-4 h-4 text-gray-400" />
            <select
              value={sort}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSort(e.target.value as 'name' | 'availability' | 'rating' | 'next')}
              className="text-sm bg-white border border-gray-200 rounded-lg py-2 px-3 focus:outline-none"
            >
              <option value="name">Trier: Nom (A–Z)</option>
              <option value="availability">Trier: Disponibilité</option>
              <option value="rating">Trier: Note</option>
              <option value="next">Trier: Prochain créneau</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-8 z-0">
      {sorted.map((consultant) => (
        <div 
          key={consultant.id} 
          onClick={() => handleConsultantClick(consultant)}
          className="relative z-0 bg-white rounded-xl md:rounded-2xl shadow-sm border border-gray-100 overflow-hidden md:hover:shadow-lg transition-all duration-500 group flex md:flex-col items-center md:items-stretch p-3 md:p-0 cursor-pointer"
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
              <Avatar className="w-12 h-12 md:w-14 md:h-14 border border-gray-100 md:group-hover:border-gray-200 transition-colors duration-300 rounded-md flex-shrink-0">
                <AvatarImage className="rounded-md w-full h-full object-cover object-center" src={consultant.image} alt={consultant.name} />
                <AvatarFallback className="bg-gray-100 text-gray-600 text-base font-semibold rounded-md">
                  {consultant.name.split(' ').reduce((initials, word) => initials + word[0], '')}
                </AvatarFallback>
              </Avatar>
              
              {/* Basic Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {consultant.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{consultant.title}</p>

                {/* Mobile compact meta */}
                <div className="md:hidden flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span>{consultant.availableDays?.length || 0} j/sem</span>
                  <span>•</span>
                  <span>{consultant.nextSlot}</span>
                  <span>•</span>
                  <span className={consultant.availability === 'Disponible' ? 'text-green-600 font-medium' : 'text-gray-400'}>
                    {consultant.availability}
                  </span>
                </div>

                <div className="flex items-center gap-2 hidden md:flex">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-none">
                    {consultant.institutionCode}
                  </span>
                </div>
              
              {/* Mobile arrow */}
              <div className="md:hidden ml-auto text-gray-300 group-hover:text-gray-500 transition">›</div>
              </div>
            </div>

            {/* Institution */}
            <div className="hidden md:flex items-center text-gray-600 text-sm mb-3">
              <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
              <span className="truncate leading-5">{consultant.institution}</span>
            </div>

            {/* Quick Info */}
            <div className="hidden md:grid grid-cols-2 gap-3 mb-2 py-2 px-3 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-base font-semibold text-gray-900">{consultant.availableDays?.length || 0}</div>
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
            <div className="hidden md:block mb-3">
              <div className="text-sm text-gray-600 mb-2">Jours disponibles:</div>
              <div className="flex flex-wrap gap-1">
                {(consultant.availableDays || []).map((day: string, index: number) => (
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
              onClick={(e) => { e.stopPropagation(); handleConsultantClick(consultant); }}
              className="hidden md:flex w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200 items-center justify-center group mt-auto"
            >
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              Voir Profil & Réserver
            </button>
          </div>
        </div>
      ))}
      </div>
    </div>
  )
}
