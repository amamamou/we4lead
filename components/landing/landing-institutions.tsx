'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { t, Locale } from '../../lib/i18n'
import { useLanguage } from '@/contexts/LanguageContext'

interface Universite {
  id: number
  nom: string
  ville: string
  adresse: string
  telephone: string | null
  nbEtudiants: number | null
  horaire: string | null
  logoUrl: string | null
  code: string
}

export default function LandingInstitutions({ locale }: { locale?: Locale }) {
  const { locale: ctxLocale } = useLanguage()
  const usedLocale = locale ?? ctxLocale

  const [universites, setUniversites] = useState<Universite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  // Scroll affordance for the logo strip
  const stripRef = useRef<HTMLDivElement | null>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
  const [activePage, setActivePage] = useState(0)
  const pageSize = 3

  // Charger les universités depuis l'API publique
  useEffect(() => {
    const fetchUniversites = async () => {
      try {
        setLoading(true)
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
        const res = await fetch(`${baseUrl}/public/users/universites`)
        
        if (!res.ok) {
          throw new Error(`Erreur HTTP: ${res.status}`)
        }
        
        const data = await res.json()
        setUniversites(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Erreur chargement universités:', err)
        setError('Erreur de chargement')
      } finally {
        setLoading(false)
      }
    }

    fetchUniversites()
  }, [])

  useEffect(() => {
    const el = stripRef.current
    if (!el) return

    const check = () => {
      setShowLeft(el.scrollLeft > 8)
      setShowRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)

      const children = Array.from(el.children) as HTMLElement[]
      if (children.length === 0) return
      const containerCenter = el.scrollLeft + el.clientWidth / 2
      let nearestIndex = 0
      let nearestDist = Infinity
      children.forEach((child, idx) => {
        const childCenter = child.offsetLeft + child.clientWidth / 2
        const dist = Math.abs(childCenter - containerCenter)
        if (dist < nearestDist) {
          nearestDist = dist
          nearestIndex = idx
        }
      })
      setActivePage(Math.floor(nearestIndex / pageSize))
    }

    check()

    el.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)

    return () => {
      el.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [universites])

  const scrollStrip = (direction: 'left' | 'right') => {
    const el = stripRef.current
    if (!el) return
    const distance = Math.round(el.clientWidth * 0.7)
    el.scrollBy({ left: direction === 'left' ? -distance : distance, behavior: 'smooth' })
  }

  // Construire l'URL correcte pour le logo
  const getLogoUrl = (universite: Universite): string | null => {
    if (!universite.logoUrl) return null
    
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
    
    // Si l'URL commence déjà par http, la retourner telle quelle
    if (universite.logoUrl.startsWith('http')) {
      return universite.logoUrl
    }
    
    // Extraire le nom du fichier du chemin
    let filename = universite.logoUrl
    
    // Supprimer tous les préfixes jusqu'au nom du fichier
    // Exemples:
    // "/uploads//universites/logos/fichier.png" -> "fichier.png"
    // "/uploads/fichier.png" -> "fichier.png"
    // "universites/logos/fichier.png" -> "fichier.png"
    
    // Prendre tout ce qui est après le dernier slash
    const parts = filename.split('/')
    filename = parts[parts.length - 1]
    
    // Nettoyer les caractères spéciaux (déjà encodés par le backend)
    // L'URL finale doit être: baseUrl/universites/logos/filename
    const finalUrl = `${baseUrl}/universites/logos/${filename}`
    
    
    return finalUrl
  }

  // Gérer l'erreur de chargement d'image
  const handleImageError = (universiteId: number, logoUrl: string) => {
    console.log(`Erreur de chargement pour l'université ${universiteId}, URL: ${logoUrl}`)
    setImageErrors(prev => ({ ...prev, [universiteId]: true }))
  }

  // Obtenir les initiales de l'université
  const getInitials = (nom: string): string => {
    if (!nom) return 'UNIV'
    return nom
      .split(' ')
      .map(word => word[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  // Obtenir une couleur basée sur l'ID pour le fallback
  const getColorClass = (id: number): string => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-red-500', 'bg-indigo-500', 'bg-teal-500',
      'bg-amber-500', 'bg-pink-500', 'bg-cyan-500'
    ]
    return colors[id % colors.length]
  }

  if (error) {
    return (
      <section id="institutions" className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">Erreur de chargement des institutions</p>
        </div>
      </section>
    )
  }

  return (
    <section id="institutions" className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center md:text-left">
            <p className="text-xs sm:text-sm tracking-widest text-gray-400 mb-3 uppercase">
              {t('institutions.hereForYou', usedLocale)}
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-[#0A1A3A] leading-tight mb-3 sm:mb-4">
              {t('institutions.supportTitle', usedLocale)}
            </h2>

            <p className="text-sm sm:text-lg text-gray-600 leading-relaxed mb-4 md:mb-6">
              {t('institutions.supportDesc', usedLocale)}
            </p>
          </div>
        </div>

        {/* Logo strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white relative">
            {/* Left gradient hint */}
            <div className={`pointer-events-none hidden md:block absolute left-0 top-0 bottom-0 w-12 ${showLeft ? '' : 'opacity-0'} transition-opacity`}>
              <div className="h-full w-full bg-gradient-to-r from-white to-transparent" />
            </div>

            {/* Right gradient hint */}
            <div className={`pointer-events-none hidden md:block absolute right-0 top-0 bottom-0 w-12 ${showRight ? '' : 'opacity-0'} transition-opacity`}>
              <div className="h-full w-full bg-gradient-to-l from-white to-transparent" />
            </div>

            {/* Scroll buttons for desktop */}
            <button
              aria-label="Scroll logos left"
              onClick={() => scrollStrip('left')}
              className={`hidden md:flex items-center justify-center absolute left-2 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-white border border-gray-100 rounded-full shadow-sm transition-opacity ${showLeft ? '' : 'opacity-0 pointer-events-none'}`}
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>

            <button
              aria-label="Scroll logos right"
              onClick={() => scrollStrip('right')}
              className={`hidden md:flex items-center justify-center absolute right-2 top-1/2 transform -translate-y-1/2 w-9 h-9 bg-white border border-gray-100 rounded-full shadow-sm transition-opacity ${showRight ? '' : 'opacity-0 pointer-events-none'}`}
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>

            <div 
              ref={stripRef} 
              className="flex items-center gap-4 overflow-x-auto py-2 px-3 touch-pan-x no-scrollbar scroll-smooth" 
              aria-label="Institutions partenaires" 
              tabIndex={0}
            >
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="flex-shrink-0 w-56 h-24 md:w-48 md:h-16 bg-gray-100 rounded-md flex items-center justify-center p-2 animate-pulse"
                    aria-hidden
                  >
                    <div className="w-32 h-6 bg-gray-200 rounded" />
                  </div>
                ))
              ) : universites.length === 0 ? (
                <div className="w-full text-center py-8 text-gray-500">
                  Aucune institution disponible
                </div>
              ) : (
                universites.map((uni) => {
                  const logoUrl = getLogoUrl(uni)
                  const hasError = imageErrors[uni.id]
                  const initials = getInitials(uni.nom)
                  const colorClass = getColorClass(uni.id)
                  
                  return (
                    <div 
                      key={uni.id} 
                      className="flex-shrink-0 w-56 h-24 md:w-48 md:h-16 bg-gray-50 border border-gray-100 rounded-md flex items-center justify-center p-2 hover:shadow-md transition-shadow group relative"
                      role="img"
                      aria-label={uni.nom}
                    >
                      {logoUrl && !hasError ? (
                        <img 
                          src={logoUrl}
                          alt={uni.nom}
                          className="max-w-full max-h-full object-contain"
                          onError={() => handleImageError(uni.id, logoUrl)}
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <div className={`w-12 h-12 ${colorClass} rounded-md flex items-center justify-center text-white text-sm font-medium mb-1`}>
                            {initials}
                          </div>
                          <span className="text-xs text-gray-500 truncate max-w-full px-2">
                            {uni.ville || 'Université'}
                          </span>
                        </div>
                      )}
                      
                      {/* Tooltip au survol */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {uni.nom}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Pagination dots - mobile only */}
            {universites.length > 0 && (
              <div className="flex md:hidden justify-center gap-2 mt-3">
                {Array.from({ length: Math.ceil(universites.length / pageSize) }).map((_, idx) => (
                  <span
                    key={`dot-${idx}`}
                    className={`w-2 h-2 rounded-full transition-colors ${idx === activePage ? 'bg-gray-700' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}