/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState, useEffect } from 'react'
import { School } from 'lucide-react'

interface University {
  id: number
  nom: string
  ville: string
  adresse: string
  phone: string
  nbEtudiants: number
  horaire: string
  logoPath: string | null
  code: string
}

export default function InstitutionFinder() {
  const [universities, setUniversities] = useState<University[]>([])

  // ================= FETCH UNIVERSITIES =================
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/public/users/universites`)
        if (!res.ok) throw new Error('Failed to fetch universities')

        const data: University[] = await res.json()
        setUniversities(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchUniversities()
  }, [])

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            Établissements Universitaires
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Consultez les établissements partenaires et leurs informations
          </p>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {universities.map((uni) => (
            <div
              key={uni.id}
              className="
                group
                relative
                bg-white
                rounded-2xl
                p-6
                border border-gray-200
                shadow-sm
                hover:shadow-lg
                hover:border-[#2B61D6]/30
                hover:-translate-y-1
                transition-all
                duration-300
                cursor-pointer
              "
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#2B61D6]/20 to-transparent group-hover:via-[#2B61D6]/60 transition-all duration-300" />

              {/* Logo */}
              <div className="flex justify-center mb-4">
                {uni.logoPath ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${uni.logoPath}`}
                    alt={uni.nom}
                    className="h-16 w-16 object-contain"
                  />
                ) : (
                  <School size={32} className="text-gray-400" />
                )}
              </div>

              {/* University info */}
              <h3 className="font-semibold text-gray-900 mb-1 text-sm leading-tight group-hover:text-gray-800 transition-colors">
                {uni.nom}
              </h3>
              <p className="text-xs text-gray-500 mb-1">{uni.ville}</p>
              <p className="text-xs text-gray-500 mb-1">{uni.adresse}</p>
              <p className="text-xs text-gray-500 mb-1">Tel: {uni.phone}</p>
              <p className="text-xs text-gray-500 mb-1">Étudiants: {uni.nbEtudiants}</p>
              <p className="text-xs text-gray-500 mb-2">Horaire: {uni.horaire}</p>

              {/* Code + Arrow */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 group-hover:text-[#2B61D6] transition-colors duration-300">
                  {uni.code}
                </span>

                <div className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-[#2B61D6] flex items-center justify-center transition-all duration-300">
                  <svg
                    className="w-3 h-3 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
