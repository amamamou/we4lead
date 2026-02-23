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
    { src: '/universities/Faculté de Droit et des Sciences Politiques de Sousse.jpg', alt: 'Faculté de Droit et des Sciences Politiques de Sousse' },
    { src: '/universities/Faculté de Médecine de Sousse.webp', alt: 'Faculté de Médecine de Sousse' },
    { src: '/universities/Faculté des Lettres et des Sciences Humaines de Sousse.webp', alt: 'Faculté des Lettres et des Sciences Humaines de Sousse' },
    { src: '/universities/Faculté des Sciences Économiques et de Gestion de Sousse.webp', alt: 'Faculté des Sciences Économiques et de Gestion de Sousse' },
    { src: '/universities/Institut Agronomique de Chott-Mariem de Sousse.webp', alt: 'Institut Agronomique de Chott-Mariem de Sousse' },
    { src: '/universities/Institut de Finance et de Fiscalité de Sousse.webp', alt: 'Institut de Finance et de Fiscalité de Sousse' },
    { src: '/universities/Institut de Musique de Sousse.png', alt: 'Institut de Musique de Sousse' },
    { src: '/universities/Institut de Transport et de Logistique de Sousse.jpg', alt: 'Institut de Transport et de Logistique de Sousse' },
    { src: '/universities/Institut des Beaux-Arts de Sousse.jpg', alt: 'Institut des Beaux-Arts de Sousse' },
    { src: '/universities/Institut des Hautes Études Commerciales de Sousse.webp', alt: 'Institut des Hautes Études Commerciales de Sousse' },
    { src: '/universities/Institut des Sciences Appliquées et de Technologie de Sousse.webp', alt: 'Institut des Sciences Appliquées et de Technologie de Sousse' },
    { src: '/universities/Institut des Sciences Infirmières de Sousse.jpg', alt: 'Institut des Sciences Infirmières de Sousse' },
    { src: '/universities/Institut d’Informatique et de Communication de Sousse.png', alt: 'Institut d’Informatique et de Communication de Sousse' },
    { src: '/universities/Institut Supérieur de Gestion de Sousse.jpg', alt: 'Institut Supérieur de Gestion de Sousse' },
    { src: '/universities/École des Sciences et de la Technologie de Hammam Sousse.jpg', alt: 'École des Sciences et de la Technologie de Hammam Sousse' },
    { src: '/universities/École des Sciences et Techniques de la Santé de Sousse.webp', alt: 'École des Sciences et Techniques de la Santé de Sousse' },
    { src: '/universities/École Nationale d’Ingénieurs de Sousse.webp', alt: 'École Nationale d’Ingénieurs de Sousse' },
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

    
      </div>
    </section>
  )
}