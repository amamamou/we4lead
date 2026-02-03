/* eslint-disable react/no-unescaped-entities */
'use client'

import { School } from 'lucide-react'

export default function InstitutionFinder() {
  const institutions = [
    {
      id: 1,
      name: 'Faculté de Médecine de Sousse',
      location: 'Avenue Mohamed Karoui, Sousse',
      doctors: [
        {
          id: 1,
          name: 'Dr. Amira Ben Salem',
          role: 'Psychologie Clinique',
          available: 'Lun, Mar, Jeu',
        },
        {
          id: 2,
          name: 'M. Sami Mansour',
          role: 'Thérapie Cognitive',
          available: 'Mer, Ven',
        },
      ],
    },
  ]

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900">
            Établissements de l&apos;Université de Sousse
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Consultez les établissements partenaires et les professionnels disponibles
          </p>
        </div>

        {/* ================= GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Faculté de Droit et des Sciences Politiques de Sousse', code: 'FDSPS' },
            { name: 'Faculté des Sciences Économiques et de Gestion de Sousse', code: 'FSEGS' },
            { name: 'Faculté de Médecine de Sousse', code: 'FMS' },
            { name: 'Institut Supérieur de Gestion de Sousse', code: 'ISG' },
            { name: 'Institut Supérieur de Finance et Fiscalité de Sousse', code: 'ISFFS' },
            { name: 'Institut Supérieur des Sciences Infirmières de Sousse', code: 'ISSIS' },
            { name: 'École Supérieure des Sciences et Technique de Santé de Sousse', code: 'ESSTS' },
            { name: 'Institut Supérieur des Sciences Agricoles de Chott Mariem', code: 'ISA' },
            { name: 'École Supérieure des Sciences et de Technologie de Hammam Sousse', code: 'ESSTHS' },
            { name: "Institut Supérieur d'Informatique et des Technologies de Communication", code: 'ISTIC' },
            { name: 'Institut Supérieur des Beaux-Arts de Sousse', code: 'ISBAS' },
            { name: 'Institut Supérieur de Musique de Sousse', code: 'ISM' },
          ].map((item, index) => (
            <div
              key={index}
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
              
              {/* Icon Container */}
              <div
                className="
                  w-12 h-12
                  bg-gray-50
                  group-hover:bg-[#EEF4FF]
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  mb-4
                  transition-all
                  duration-300
                "
              >
                <School
                  size={22}
                  className="
                    text-gray-400
                    group-hover:text-[#2B61D6]
                    transition-colors
                    duration-300
                  "
                />
              </div>

              {/* Content */}
              <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight group-hover:text-gray-800 transition-colors">
                {item.name}
              </h3>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 group-hover:text-[#2B61D6] transition-colors duration-300">
                  {item.code}
                </span>
                
                {/* Arrow indicator */}
                <div className="w-6 h-6 rounded-lg bg-gray-100 group-hover:bg-[#2B61D6] flex items-center justify-center transition-all duration-300">
                  <svg className="w-3 h-3 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
