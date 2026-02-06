'use client'

import React from "react"
import Image from 'next/image'

import { LayoutDashboard, Users, Calendar, Settings, LogOut } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
}

interface AdminSidebarProps {
  activeNav: string
  onNavChange: (id: string) => void
  isSuperAdmin?: boolean
  userName: string
  instituteName?: string
  instituteLogo?: string
}

export function AdminSidebar({ activeNav, onNavChange, isSuperAdmin = false, userName, instituteName, instituteLogo }: AdminSidebarProps) {
  const navItems: NavItem[] = isSuperAdmin
    ? [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
        { id: 'institutes', label: 'Institutes', icon: <Settings className="w-5 h-5" /> },
        { id: 'admins', label: 'Admins', icon: <Users className="w-5 h-5" /> },
        { id: 'doctors', label: 'Doctors', icon: <Users className="w-5 h-5" /> },
        { id: 'students', label: 'Students', icon: <Users className="w-5 h-5" /> },
        { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5" /> }
      ]
    : [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
        { id: 'institute', label: 'Institute', icon: <Settings className="w-5 h-5" /> },
        { id: 'doctors', label: 'Doctors', icon: <Users className="w-5 h-5" /> },
        { id: 'students', label: 'Students', icon: <Users className="w-5 h-5" /> },
        { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5" /> }
      ]

  return (
  <div className="w-72 bg-white border-r border-black/10 h-screen flex flex-col">
      {/* Header */}
      <div className="p-8">
        {!isSuperAdmin && instituteName ? (
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-28 h-28 overflow-hidden flex items-center justify-center">
              <Image src={instituteLogo ?? '/universitedesousse.png'} alt={instituteName ?? 'institute logo'} width={88} height={88} className="object-contain" />
            </div>

            <div className="min-w-0 px-1">
              <h2 title={instituteName} className="text-sm font-semibold text-gray-800 leading-tight break-words whitespace-normal max-w-[14rem]">{instituteName}</h2>
              <p className="text-xs text-gray-500 mt-1">Université de Sousse</p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-md bg-gray-50 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6 20v-1c0-2.21 3.582-4 6-4s6 1.79 6 4v1" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-sm font-medium text-gray-900">{isSuperAdmin ? 'Super Admin' : 'Admin'}</h1>
              <p className="text-xs text-gray-500 mt-1">{userName}</p>
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-gray-100" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
              activeNav === item.id
                ? 'text-gray-900 font-semibold'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {/* icon */}
            <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>

            <span className="leading-none">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-black/10 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-black hover:bg-black/5 transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
