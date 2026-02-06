
'use client'

import React from "react"
import Image from 'next/image'
import { Building2, Stethoscope, Clock, CheckCircle } from '../ui/icons'
import { Users } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white border border-black/10 rounded-lg p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-black/60 font-medium">{label}</p>
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-[#F2F2F2]">
          <div className="text-gray-600">{icon}</div>
        </div>
      </div>
      <p className="text-3xl font-extrabold text-black">{value}</p>
    </div>
  )
}

interface AdminOverviewProps {
  isSuperAdmin?: boolean
  stats?: Record<string, string | number>
}

export function AdminOverview({ isSuperAdmin = false, stats }: AdminOverviewProps) {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-black">Dashboard</h1>
        <p className="text-black/60 text-sm mt-2">
          {isSuperAdmin ? 'Manage all institutions, doctors, students and appointments' : 'Manage your institute, doctors, students and appointments'}
        </p>
      </div>

      {/* Branding will be shown at the end of the page (see bottom) */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(displayStats).map(([key, value]) => {
          const label = key.charAt(0).toUpperCase() + key.slice(1)

          const icon = (() => {
            switch (key) {
              case 'doctors':
                return <Stethoscope className="w-5 h-5" />
              case 'students':
                return <Users className="w-5 h-5" />
              case 'appointments':
                return <Clock className="w-5 h-5" />
              case 'institutes':
                return <Building2 className="w-5 h-5" />
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
        <div className="bg-white border border-black/10 rounded-lg p-6">
          <h2 className="font-semibold text-black mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-black/5">
                <p className="text-sm text-black/70">Activity item {i}</p>
                <p className="text-xs text-black/40">2 hours ago</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded-lg p-6">
          <h2 className="font-semibold text-black mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 text-left text-sm bg-white text-gray-900 border border-gray-200 rounded-md font-medium hover:bg-gray-50 transition-colors">
              Add New Doctor
            </button>
            <button className="w-full px-4 py-2 text-left text-sm border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">
              Add New Student
            </button>
            <button className="w-full px-4 py-2 text-left text-sm border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">
              View Reports
            </button>
            <button className="w-full px-4 py-2 text-left text-sm border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors">
              Export Data
            </button>
          </div>
        </div>
      </div>
      {/* Minimal footer: subtle divider, grayscale logos, concise text */}
      <div className="mt-4">
        <footer className="w-full">
          <div className="max-w-4xl mx-auto w-full py-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Image src="/we4lead.png" alt="We4Lead" width={48} height={48} className="object-contain" />
              </div>

              <div className="text-center flex-1">
                <p className="text-[11px] text-gray-500">Projet Erasmus+ · <a href="/apropos" className="text-gray-600 hover:underline">À propos</a></p>
              </div>

              <div className="flex items-center gap-3">
                <Image src="/universitedesousse.png" alt="Université de Sousse" width={48} height={48} className="object-contain" />
              </div>
            </div>
          </div>
        </footer>
      </div>

    </div>
  )
}
