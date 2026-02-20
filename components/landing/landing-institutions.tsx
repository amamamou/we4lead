 'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { t, Locale } from '../../lib/i18n'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LandingInstitutions({ locale }: { locale?: Locale }) {
  const { locale: ctxLocale } = useLanguage()
  const usedLocale = locale ?? ctxLocale

  const logos = [
    { src: '/logos/logo-1.svg', alt: 'Université de Sousse - Campus Principal' },
    { src: '/logos/logo-2.svg', alt: 'Clinique Universitaire de Santé Mentale' },
    { src: '/logos/logo-3.svg', alt: 'Centre de Consultation Étudiante' },
    { src: '/logos/logo-4.svg', alt: "Hôpital Universitaire Ibn Sina" },
    { src: '/logos/logo-5.svg', alt: "Institut de Psychologie Appliquée" },
    { src: '/logos/logo-6.svg', alt: 'Centre de Bien-être et Santé Mentale' },
    { src: '/logos/logo-7.svg', alt: 'Clinique Médicale Universitaire el-Amal' },
    { src: '/logos/logo-8.svg', alt: 'Centre de Santé Communautaire de Msaken' },
    { src: '/logos/logo-9.svg', alt: 'Polyclinique Universitaire de Mahdia' },
    { src: '/logos/logo-10.svg', alt: 'Établissement Médical al-Noor' },
    { src: '/logos/logo-11.svg', alt: 'Centre Médical de Sfax - Campus Affiliated' },
    { src: '/logos/logo-12.svg', alt: 'Clinique Spécialisée de Skhira' },
    { src: '/logos/logo-13.svg', alt: 'Institut de Formation Médico-Social' },
    { src: '/logos/logo-14.svg', alt: 'Centre Médical de Mahdia' },
    { src: '/logos/logo-15.svg', alt: 'Centre Médical de Sfax' },
    { src: '/logos/logo-16.svg', alt: 'Clinique Spécialisée Skhira' },
    { src: '/logos/logo-17.svg', alt: 'Institut Médico-Social Tunis' },
  ]

  // Scroll affordance for the logo strip
  const stripRef = useRef<HTMLDivElement | null>(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
  const [activePage, setActivePage] = useState(0)
  const pageSize = 3 // number of logos per pagination dot on mobile

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

    // initial check
    check()

    el.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)

    return () => {
      el.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])

  const scrollStrip = (direction: 'left' | 'right') => {
    const el = stripRef.current
    if (!el) return
    const distance = Math.round(el.clientWidth * 0.7)
    el.scrollBy({ left: direction === 'left' ? -distance : distance, behavior: 'smooth' })
  }

  const loading = false

  return (
    <section id="institutions" className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center md:text-left">
            <p className="text-xs sm:text-sm tracking-widest text-gray-400 mb-3 uppercase">{t('institutions.hereForYou', usedLocale)}</p>

            <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-[#0A1A3A] leading-tight mb-3 sm:mb-4">{t('institutions.supportTitle', usedLocale)}</h2>

            <p className="text-sm sm:text-lg text-gray-600 leading-relaxed mb-4 md:mb-6">{t('institutions.supportDesc', usedLocale)}</p>
          </div>
        </div>

        {/* Logo strip: neutral, professional, responsive */}
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

            <div ref={stripRef} className="flex items-center gap-4 overflow-x-auto py-2 px-3 touch-pan-x no-scrollbar" aria-label="Partner institutions" tabIndex={0}>
              {loading
                ? logos.map((logo) => (
                    <div
                      key={logo.src}
                      className="flex-shrink-0 w-56 h-24 md:w-48 md:h-16 bg-gray-100 rounded-md flex items-center justify-center p-2 animate-pulse"
                      aria-hidden
                    >
                      <div className="w-32 h-6 bg-gray-200 rounded" />
                    </div>
                  ))
                : logos.map((logo) => (
                    <div key={logo.src} className="flex-shrink-0 w-56 h-24 md:w-48 md:h-16 bg-gray-50 border border-gray-100 rounded-md flex items-center justify-center p-2 hover:shadow-md transition-shadow" role="img" aria-label={logo.alt}>
                      <Image src={logo.src} alt={logo.alt} width={180} height={64} className="object-contain" />
                    </div>
                  ))}
            </div>

            {/* Pagination dots - mobile only */}
            <div className="flex md:hidden justify-center gap-2 mt-3">
              {Array.from({ length: Math.ceil(logos.length / pageSize) }).map((_, idx) => (
                <span
                  key={`dot-${idx}`}
                  className={`w-2 h-2 rounded-full transition-colors ${idx === activePage ? 'bg-gray-700' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}