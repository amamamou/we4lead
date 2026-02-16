'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { fetchUniversitiesWithDoctors } from '../../utils/institutions'
import { t, Locale } from '../../lib/i18n'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'



export default function LandingInstitutions({ locale }: { locale?: Locale }) {
  const { locale: ctxLocale } = useLanguage()
  const usedLocale = locale ?? ctxLocale
  const keepLastTwoWordsTogether = (text: string) => {
    if (!text) return text
    const parts = text.split(' ')
    if (parts.length <= 2) return text
    const lastTwo = parts.slice(-2).join('\u00A0')
    return [...parts.slice(0, -2), lastTwo].join(' ')
  }
  
  // NOTE: each card is controlled by parent `openId` so only one may be open.

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

      // compute active index for pagination dots (nearest child to center)
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
    // also check on resize
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

  // UI shape expected by the existing InstitutionCard component
  type UiInstitution = {
    id: number
    name: string
    doctors: { id: string; name: string }[]
  }

  const [institutions, setInstitutions] = useState<UiInstitution[]>([])
  const [loading, setLoading] = useState(true)

  // Parent-controlled openId so only one card can be open at a time.
  const [openId, setOpenId] = useState<number | null>(null)

  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleBook = () => {
    // If user is authenticated -> dashboard, otherwise -> login
    if (isAuthenticated) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  type BackendUniversity = {
    id: number
    nom: string
    medecins?: { id: string | number; nom?: string; prenom?: string }[]
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const data = (await fetchUniversitiesWithDoctors()) as BackendUniversity[]

      const mapped: UiInstitution[] = (data || []).map((u: BackendUniversity) => ({
        id: u.id,
        name: u.nom,

        doctors: (u.medecins || []).map((m) => ({
          id: String(m.id),
          name: `${m.prenom ?? ''} ${m.nom ?? ''}`.trim() || 'Médecin',
        })),
      }))

      setInstitutions(mapped)
      setLoading(false)
    }

    load()
  }, [])

  // Controlled InstitutionCard: receives `open` and `onToggle` from parent
  function InstitutionCard({
    institution,
    open,
    onToggle,
  }: {
    institution: UiInstitution
    open: boolean
    onToggle: () => void
  }) {
    return (
  <article className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1 overflow-hidden flex flex-col ${open ? '' : 'h-56 md:h-64'}`}>
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col items-start gap-2 flex-1 min-w-0">
            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center text-gray-400 text-xs">
              {t('institutions.institutionLabel', usedLocale)}
            </div>

            <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-snug break-words whitespace-normal" title={institution.name}>
              {keepLastTwoWordsTogether(institution.name)}
            </h3>

            
          </div>

            <div className="flex-shrink-0 w-20 md:w-24 flex flex-col items-end gap-1 mt-2 md:mt-3">
            {/* Badge: show above chevron (stacked) */}
            <div className="self-end text-[10px] font-medium text-gray-700 px-1 py-0.5 inline-flex items-center justify-center">
              {institution.doctors.length} {t('institutions.doctorsCount', usedLocale)}
            </div>

              <button aria-expanded={open} onClick={onToggle} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-50 flex-shrink-0 self-end" title={t('institutions.showDoctors', usedLocale)}>
              <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </header>

        {open && (
          <div className="mt-4 bg-gray-50 rounded-lg border border-gray-100 p-4">
            {institution.doctors.length > 0 ? (
              <ul className="space-y-3">
                    {institution.doctors.map((doctor) => (
                  <li key={doctor.id} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-900">{doctor.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleBook()} className="text-xs font-medium px-2 py-0.5 rounded-md bg-transparent text-gray-900 hover:bg-gray-50 transition flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200" aria-label={`Book appointment with ${doctor.name}`}>
                        <Calendar className="w-3 h-3 mr-1.5 text-gray-900" />
                        <span className="text-xs">{t('institutions.book', usedLocale)}</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-sm text-gray-600">
                <p className="font-medium text-gray-900 mb-1">{t('institutions.noDoctorsTitle', usedLocale)}</p>
                <p className="text-xs">{t('institutions.noDoctorsDesc', usedLocale)}</p>
              </div>
            )}
          </div>
        )}
      </article>
    )
  }

  return (
  <section id="institutions" className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 md:mb-12">
          {/* Centered and tighter on mobile; left-aligned on md+ */}
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

            {/* mobile swipe hint removed for a cleaner, more professional UI */}
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

        {/* Search removed per request — showing all institutions */}

  {/* Institutions grid: responsive cards with subtle shadow and clean spacing */}
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-stretch">
          {loading
            ? // render skeleton cards matching the layout
              Array.from({ length: 8 }).map((_, idx) => (
                <article
                  key={`placeholder-${idx}`}
                  className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm overflow-hidden flex flex-col h-56 md:h-64"
                  aria-hidden
                >
                  <header className="flex items-start justify-between gap-4">
                    <div className="flex flex-col items-start gap-2 flex-1 min-w-0">
                      <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <div className="w-12 h-4 bg-gray-200 rounded" />
                      </div>

                      <h3 className="mt-2 w-48 h-5 bg-gray-200 rounded" />
                    </div>

                    <div className="flex-shrink-0 w-20 md:w-24 flex flex-col items-end gap-1 mt-2 md:mt-3">
                      <div className="self-end text-[10px] font-medium text-gray-700 px-1 py-0.5 inline-flex items-center justify-center">
                        <div className="w-10 h-4 bg-gray-200 rounded" />
                      </div>

                      <div className="w-8 h-8 rounded-md bg-gray-100" />
                    </div>
                  </header>

                  <div className="mt-4 bg-gray-50 rounded-lg border border-gray-100 p-4 flex-1">
                    <div className="space-y-3">
                      <div className="w-full h-3 bg-gray-200 rounded" />
                      <div className="w-3/4 h-3 bg-gray-200 rounded" />
                    </div>
                  </div>
                </article>
              ))
            : institutions.map((institution: UiInstitution) => (
                <InstitutionCard
                  key={institution.id}
                  institution={institution}
                  open={openId === institution.id}
                  onToggle={() => setOpenId(openId === institution.id ? null : institution.id)}
                />
              ))}
        </div>
      </div>
    </section>
  )
}