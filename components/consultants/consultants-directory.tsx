'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarDays, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

/* ================= TYPES ================= */

interface Creneau {
  id: string
  jour: string
  debut: string
  fin: string
}

interface Medecin {
  id: string
  email: string
  nom: string | null
  prenom: string | null
  photoUrl: string | null
  creneaux: Creneau[]
}

/* ================= COMPONENT ================= */

export function ConsultantsDirectory() {
  const router = useRouter()
  const [consultants, setConsultants] = useState<Medecin[]>([])
  const [page, setPage] = useState(0)

  /* ================= FETCH MEDECINS ================= */

  useEffect(() => {
    const fetchMedecins = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/users/medecins`
        )

        if (!res.ok) throw new Error('Failed to load doctors')

        const data = await res.json()
        setConsultants(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchMedecins()
  }, [])

  /* ================= HELPERS ================= */

  const getInitials = (nom?: string | null, prenom?: string | null) => {
    return `${prenom?.[0] ?? ''}${nom?.[0] ?? ''}`.toUpperCase() || 'DR'
  }

  const cardsPerPage = 3
  const totalPages = Math.ceil(consultants.length / cardsPerPage)

  const canPrev = page > 0
  const canNext = page < totalPages - 1

  const visibleConsultants = consultants.slice(
    page * cardsPerPage,
    page * cardsPerPage + cardsPerPage
  )

  /* ================= UI ================= */

  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-gray-900">
            Nos Consultants
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Des professionnels qualifiés à votre écoute.
          </p>
        </div>

        <div className="flex items-center gap-4">

          {/* LEFT */}
          <button
            onClick={() => setPage(page - 1)}
            disabled={!canPrev}
            className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm disabled:opacity-40"
          >
            <ChevronLeft />
          </button>

          {/* CARDS */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {visibleConsultants.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center text-center min-h-[340px]"
              >

                <Avatar className="w-28 h-28 mb-3">
                  <AvatarImage
                    src={
                      c.photoUrl
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${c.photoUrl}`
                        : undefined
                    }
                  />
                  <AvatarFallback>
                    {getInitials(c.nom, c.prenom)}
                  </AvatarFallback>
                </Avatar>

                <h3 className="font-semibold">
                  {c.prenom} {c.nom}
                </h3>

                <p className="text-xs text-gray-500 mb-4">Médecin</p>

                {/* CRENEAUX */}
                <div className="flex items-center gap-1.5 bg-gray-100 text-xs px-3 py-1.5 rounded-md mb-5">
                  <CalendarDays className="w-3.5 h-3.5 text-[#2B61D6]" />
                  <span>
                    {c.creneaux.length > 0
                      ? c.creneaux.map(cr => `${cr.jour} ${cr.debut}-${cr.fin}`).join(' | ')
                      : 'Aucun créneau'}
                  </span>
                </div>

                <button
                  onClick={() => router.push(`/consultants/${c.id}`)}
                  className="mt-auto w-full h-10 rounded-lg bg-[#2B61D6] text-white text-xs font-semibold"
                >
                  Prendre rendez-vous
                </button>

              </div>
            ))}

          </div>

          {/* RIGHT */}
          <button
            onClick={() => setPage(page + 1)}
            disabled={!canNext}
            className="hidden lg:flex w-10 h-10 items-center justify-center rounded-full bg-white shadow-sm disabled:opacity-40"
          >
            <ChevronRight />
          </button>

        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => router.push('/consultants')}
            className="inline-flex items-center gap-1.5 text-[#2B61D6] text-sm font-medium"
          >
            Voir tous les consultants
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  )
}
