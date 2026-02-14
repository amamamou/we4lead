
'use client'

import React from "react"
import Image from 'next/image'
import { Stethoscope, Clock, CheckCircle, University } from '../ui/icons'
import { Users } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-black/60 font-medium">{label}</p>
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-[#F9FAFB]">
          <div className="text-gray-600">{icon}</div>
        </div>
      </div>
      <p className="text-3xl font-extrabold text-black">{value}</p>
    </div>
  )
}

interface InstituteInfo {
  id: number
  name: string
  admin?: string
  doctors?: number
  students?: number
  appointments?: number
  logo?: string
}

interface AdminOverviewProps {
  isSuperAdmin?: boolean
  stats?: Record<string, string | number>
  institute?: InstituteInfo | undefined
}

export function AdminOverview({ isSuperAdmin = false, stats, institute }: AdminOverviewProps) {
  const defaultStats = isSuperAdmin
    ? {
        institutes: 12,
        doctors: 48,
        students: 524,
        appointments: 1240
      }
    : {
        doctors: 8,
        students: 145,
        appointments: 342,
        completed: 298
      }

  const displayStats = stats || defaultStats

  // French labels for the overview
  const labelsMap: Record<string, string> = {
    institutes: 'Institutions',
    doctors: 'Médecins',
    students: 'Étudiants',
    appointments: 'Rendez‑vous',
    completed: 'Terminés'
  }

  return (
    <div className="space-y-6">
      <div>
  <h1 className="text-2xl font-semibold text-gray-800">Tableau de bord</h1>
        <p className="text-black/60 text-sm mt-2">
          {isSuperAdmin ? 'Gérer toutes les institutions, médecins, étudiants et rendez‑vous' : 'Gérer votre établissement, les médecins, les étudiants et les rendez‑vous'}
        </p>
      </div>

      {/* Branding will be shown at the end of the page (see bottom) */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(displayStats).map(([key, value]) => {
          const label = labelsMap[key] ?? (key.charAt(0).toUpperCase() + key.slice(1))

          const icon = (() => {
            switch (key) {
              case 'doctors':
                return <Stethoscope className="w-5 h-5" />
              case 'students':
                return <Users className="w-5 h-5" />
              case 'appointments':
                return <Clock className="w-5 h-5" />
              case 'institutes':
                return <University className="w-5 h-5" />
              case 'completed':
                return <CheckCircle className="w-5 h-5" />
              default:
                return <CheckCircle className="w-5 h-5" />
            }
          })()

          return (
            <StatCard key={key} label={label} value={value} icon={icon} />
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
  <div className="bg-white border border-gray-100 rounded-lg p-6">
          <h2 className="font-semibold text-black mb-4">Activités récentes</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                <p className="text-sm text-black/70">Activité {i}</p>
                <p className="text-xs text-black/40">il y a 2 heures</p>
              </div>
            ))}
          </div>
        </div>

  <div className="bg-white border border-gray-100 rounded-lg p-6">
          <h2 className="font-semibold text-black mb-4">Actions rapides</h2>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 text-left text-sm rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1" style={{backgroundColor: '#020E68', color: '#FFFFFF', borderColor: '#020E68'}}>
              Ajouter un médecin
            </button>
            <button className="w-full px-4 py-2 text-left text-sm border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">
              Ajouter un étudiant
            </button>
            <button className="w-full px-4 py-2 text-left text-sm border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">
              Voir les rapports
            </button>
            <button className="w-full px-4 py-2 text-left text-sm border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">
              Exporter les données
            </button>
          </div>
        </div>
      </div>
      {/* Institute info for non-super admins */}
      {!isSuperAdmin && institute && (
        <div className="bg-white border border-gray-100 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-black mb-4">Informations sur l&apos;établissement</h2>

          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
              <Image src={institute.logo ?? '/universitedesousse.png'} alt={institute.name} width={80} height={80} className="object-contain" />
            </div>

            <div className="flex-1">
              <p className="text-sm text-gray-500">Nom de l&apos;établissement</p>
              <p className="text-lg font-semibold text-black mt-1">{institute.name}</p>

              <div className="mt-3">
                <p className="text-sm text-gray-500">Université</p>
                <p className="text-sm text-black mt-1">Université de Sousse</p>
              </div>

              {institute.appointments !== undefined && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500">Rendez‑vous planifiés</p>
                  <p className="text-sm text-black mt-1">{institute.appointments}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
