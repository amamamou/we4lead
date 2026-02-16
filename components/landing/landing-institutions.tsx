'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

const INSTITUTIONS = [
  {
    id: 1,
    name: 'École Supérieure des Sciences et de la Technologie de Hammam Sousse',
    location: 'Sousse, Tunisia',
    phone: '+216 73 369 900',
    doctors: [
      { id: 1, name: 'Dr. Mohamed Karim', specialty: 'Psychology', availability: 'Mon-Wed' },
      { id: 2, name: 'Dr. Fatima Bennour', specialty: 'Counseling', availability: 'Tue-Thu' },
      { id: 3, name: 'Dr. Ahmed Selim', specialty: 'Clinical Psychology', availability: 'Wed-Fri' },
    ],
  },
  {
    id: 2,
    name: 'Clinique Universitaire de Santé Mentale',
    location: 'Sousse, Tunisia',
    phone: '+216 73 369 901',
    doctors: [
      { id: 4, name: 'Dr. Leila Mansour', specialty: 'Psychiatry', availability: 'Mon-Fri' },
      { id: 5, name: 'Dr. Khalil Ben Salem', specialty: 'Psychotherapy', availability: 'Tue-Thu' },
    ],
  },
  {
    id: 3,
    name: 'Centre de Consultation Étudiante',
    location: 'Sousse, Tunisia',
    phone: '+216 73 369 902',
    doctors: [
      { id: 6, name: 'Dr. Amal Charfi', specialty: 'Student Wellness', availability: 'Daily' },
      { id: 7, name: 'Dr. Romain Dupont', specialty: 'Career Counseling', availability: 'Mon-Wed' },
      { id: 8, name: 'Dr. Yasmine Boussoffara', specialty: 'Stress Management', availability: 'Tue-Thu' },
    ],
  },
  {
    id: 4,
    name: 'Hôpital Universitaire Ibn Sina',
    location: 'Sousse, Tunisia',
    phone: '+216 73 369 903',
    doctors: [
      { id: 9, name: 'Dr. Hassan Abdelhamid', specialty: 'General Practice', availability: 'Mon-Fri' },
      { id: 10, name: 'Dr. Noor Al-Deen', specialty: 'Family Medicine', availability: 'Wed-Fri' },
    ],
  },
  {
    id: 5,
    name: 'Institut de Psychologie Appliquée',
    location: 'Sousse, Tunisia',
    phone: '+216 73 369 904',
    doctors: [
      { id: 11, name: 'Dr. Sofiane Jarray', specialty: 'Behavioral Psychology', availability: 'Tue-Thu' },
      { id: 12, name: 'Dr. Myriam Ghazouani', specialty: 'Cognitive Therapy', availability: 'Mon-Fri' },
      { id: 13, name: 'Dr. Ibrahim Said', specialty: 'Group Therapy', availability: 'Wed' },
    ],
  },
  {
    id: 6,
    name: 'Centre de Bien-être et Santé Mentale',
    location: 'Sousse, Tunisia',
    phone: '+216 73 369 905',
    doctors: [
      { id: 14, name: 'Dr. Samira Abdallah', specialty: 'Holistic Wellness', availability: 'Mon-Thu' },
    ],
  },
  {
    id: 7,
    name: 'Clinique Médicale Universitaire el-Amal',
    location: 'Sousse, Tunisia',
    phone: '+216 73 369 906',
    doctors: [
      { id: 15, name: 'Dr. Tarek Bourguiba', specialty: 'Internal Medicine', availability: 'Daily' },
      { id: 16, name: 'Dr. Zainab Masri', specialty: 'Women Health', availability: 'Mon-Wed' },
    ],
  },
  {
    id: 8,
    name: 'Centre de Santé Communautaire de Msaken',
    location: 'Msaken, Tunisia',
    phone: '+216 73 369 907',
    doctors: [
      { id: 17, name: 'Dr. Walid Hamadi', specialty: 'Community Health', availability: 'Tue-Fri' },
      { id: 18, name: 'Dr. Hana Gharbi', specialty: 'Preventive Medicine', availability: 'Mon-Thu' },
    ],
  },
  {
    id: 9,
    name: 'Polyclinique Universitaire de Mahdia',
    location: 'Mahdia, Tunisia',
    phone: '+216 73 369 908',
    doctors: [
      { id: 19, name: 'Dr. Fares Rhouma', specialty: 'General Medicine', availability: 'Mon-Fri' },
      { id: 20, name: 'Dr. Dina Khaled', specialty: 'Emergency Medicine', availability: 'Daily' },
      { id: 21, name: 'Dr. Sami Loukil', specialty: 'Pediatrics', availability: 'Wed-Fri' },
    ],
  },
  {
    id: 10,
    name: 'Établissement Médical al-Noor',
    location: 'Monastir, Tunisia',
    phone: '+216 73 369 909',
    doctors: [
      { id: 22, name: 'Dr. Leila Bouraoui', specialty: 'Cardiology', availability: 'Tue-Thu' },
      { id: 23, name: 'Dr. Jamal Ghezela', specialty: 'Neurology', availability: 'Mon-Fri' },
    ],
  },
  {
    id: 11,
    name: 'Centre Médical de Sfax - Campus Affiliated',
    location: 'Sfax, Tunisia',
    phone: '+216 74 369 900',
    doctors: [
      { id: 24, name: 'Dr. Amira Belhaj', specialty: 'Rheumatology', availability: 'Mon-Wed' },
      { id: 25, name: 'Dr. Nasim Ayadi', specialty: 'Physical Medicine', availability: 'Tue-Thu' },
      { id: 26, name: 'Dr. Fatuma Mzali', specialty: 'Rehabilitation', availability: 'Wed-Fri' },
    ],
  },
  {
    id: 12,
    name: 'Clinique Spécialisée de Skhira',
    location: 'Skhira, Tunisia',
    phone: '+216 75 369 800',
    doctors: [
      { id: 27, name: 'Dr. Rached Belkhouden', specialty: 'Surgery', availability: 'Mon-Fri' },
      { id: 28, name: 'Dr. Nilhan Sellami', specialty: 'Anesthesia', availability: 'Tue-Thu' },
    ],
  },
  {
    id: 13,
    name: 'Institut de Formation Médico-Social',
    location: 'Tunis, Tunisia',
    phone: '+216 71 369 700',
    doctors: [
      { id: 29, name: 'Dr. Kamel Dardouri', specialty: 'Social Medicine', availability: 'Mon-Wed' },
      { id: 30, name: 'Dr. Saida Gaied', specialty: 'Occupational Health', availability: 'Wed-Fri' },
      { id: 31, name: 'Dr. Moncef Belaid', specialty: 'Public Health', availability: 'Tue-Thu' },
    ],
  },
  {
    id: 14,
    name: 'Centre Médical de Mahdia',
    location: 'Mahdia, Tunisia',
    phone: '+216 73 369 910',
    doctors: [
      { id: 32, name: 'Dr. Hichem Marzouk', specialty: 'General Medicine', availability: 'Mon-Fri' },
      { id: 33, name: 'Dr. Salma Trabelsi', specialty: 'Dermatology', availability: 'Tue-Thu' },
    ],
  },
  {
    id: 15,
    name: 'Centre Médical de Sfax',
    location: 'Sfax, Tunisia',
    phone: '+216 74 369 910',
    doctors: [
      { id: 34, name: 'Dr. Najla Ferchichi', specialty: 'Pediatrics', availability: 'Mon-Wed' },
      { id: 35, name: 'Dr. Rami Khemiri', specialty: 'Ophthalmology', availability: 'Thu-Fri' },
    ],
  },
  {
    id: 16,
    name: 'Clinique Spécialisée Skhira',
    location: 'Skhira, Tunisia',
    phone: '+216 75 369 801',
    doctors: [
      { id: 36, name: 'Dr. Ons Zribi', specialty: 'Surgery', availability: 'Mon-Fri' },
    ],
  },
  {
    id: 17,
    name: 'Institut Médico-Social Tunis',
    location: 'Tunis, Tunisia',
    phone: '+216 71 369 701',
    doctors: [
      { id: 37, name: 'Dr. Manel Jebali', specialty: 'Psychology', availability: 'Tue-Thu' },
      { id: 38, name: 'Dr. Sami Ben Amor', specialty: 'Counseling', availability: 'Mon-Wed' },
    ],
  },
]

export default function LandingInstitutions() {
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

  const filteredInstitutions = INSTITUTIONS

  // Parent-controlled openId so only one card can be open at a time.
  const [openId, setOpenId] = useState<number | null>(null)

  // Controlled InstitutionCard: receives `open` and `onToggle` from parent
  function InstitutionCard({
    institution,
    open,
    onToggle,
  }: {
    institution: (typeof INSTITUTIONS)[number]
    open: boolean
    onToggle: () => void
  }) {
    return (
  <article className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1 overflow-hidden flex flex-col ${open ? '' : 'h-56 md:h-64'}`}>
        <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col items-start gap-2 flex-1 min-w-0">
            <div className="relative w-20 h-20 md:w-24 md:h-24 bg-gray-50 rounded-lg overflow-hidden">
              {logos[institution.id - 1] && (
                <Image src={logos[institution.id - 1].src} alt={logos[institution.id - 1].alt} fill className="object-contain" />
              )}
            </div>

            <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-snug break-words whitespace-normal" title={institution.name}>
              {keepLastTwoWordsTogether(institution.name)}
            </h3>

            
          </div>

          <div className="flex-shrink-0 w-16 flex flex-col items-start gap-1 mt-2 md:mt-3">
            {/* Badge: show above chevron (stacked) */}
            <div className="text-xs font-medium text-gray-700 px-1 py-0.5 inline-flex items-center justify-center">
              {institution.doctors.length} doctors
            </div>

            <button aria-expanded={open} onClick={onToggle} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 hover:bg-gray-50 flex-shrink-0 self-end" title="Show doctors">
              <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </header>

        {open && (
          <div className="mt-4 bg-gray-50 rounded-lg border border-gray-100 p-4">
            <ul className="space-y-3">
              {institution.doctors.map((doctor) => (
                <li key={doctor.id} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-900">{doctor.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-xs font-medium px-2 py-0.5 rounded-md bg-transparent text-gray-900 hover:bg-gray-50 transition flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-200" aria-label={`Book appointment with ${doctor.name}`}>
                      <Calendar className="w-3 h-3 mr-1.5 text-gray-900" />
                      <span className="text-xs">Book</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    )
  }

  return (
  <section id="institutions" className="py-8 md:py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-12">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-sm tracking-widest text-gray-400 mb-4 uppercase">Here for you</p>

            <h2 className="text-4xl md:text-5xl font-semibold text-[#0A1A3A] leading-tight mb-4">Support you can rely on</h2>

            <p className="text-lg text-gray-600 max-w-3xl leading-relaxed mb-6">
              We connect University of Sousse students with trusted doctors assigned to each institute. Each institute has dedicated doctors ready to help you.
            </p>

            
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
              {logos.map((logo) => (
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
          {filteredInstitutions.map((institution) => (
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
