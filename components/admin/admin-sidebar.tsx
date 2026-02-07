'use client'

import React, { useState, useEffect } from "react"
import Image from 'next/image'

import { LayoutDashboard, Users, UserCheck, GraduationCap, Settings, LogOut, PanelLeft, Globe, Sun, Moon } from 'lucide-react'
import { Stethoscope, Clock } from '../../components/ui/icons'

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
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark')
    }
    return false
  })

  // Keyboard shortcut for toggling sidebar (Ctrl/Cmd + B)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault()
        setIsCollapsed(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const navItems: NavItem[] = isSuperAdmin
  ? [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'institutes', label: 'Institutes', icon: <GraduationCap className="w-5 h-5" /> },
        { id: 'admins', label: 'Admins', icon: <UserCheck className="w-5 h-5" /> },
        { id: 'doctors', label: 'Doctors', icon: <Stethoscope className="w-5 h-5" /> },
        { id: 'students', label: 'Students', icon: <Users className="w-5 h-5" /> },
        { id: 'appointments', label: 'Appointments', icon: <Clock className="w-5 h-5" /> }
      ]
    : [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
        { id: 'doctors', label: 'Doctors', icon: <Stethoscope className="w-5 h-5" /> },
        { id: 'students', label: 'Students', icon: <Users className="w-5 h-5" /> },
        { id: 'appointments', label: 'Appointments', icon: <Clock className="w-5 h-5" /> }
      ]

  // localized labels
  const L = {
    overview: lang === 'fr' ? 'Aperçu' : 'Overview',
    institutes: lang === 'fr' ? 'Institutions' : 'Institutes',
    admins: lang === 'fr' ? 'Administrateurs' : 'Admins',
    doctors: lang === 'fr' ? 'Médecins' : 'Doctors',
    students: lang === 'fr' ? 'Étudiants' : 'Students',
    appointments: lang === 'fr' ? 'Rendez‑vous' : 'Appointments',
    settings: lang === 'fr' ? 'Paramètres' : 'Settings',
    logout: lang === 'fr' ? 'Déconnexion' : 'Logout',
    superAdmin: lang === 'fr' ? 'Super administrateur' : 'Super Admin',
    admin: lang === 'fr' ? 'Administrateur' : 'Admin',
    switchLanguage: lang === 'fr' ? `Changer la langue (${lang.toUpperCase()})` : `Switch language (${lang.toUpperCase()})`,
    themeLight: lang === 'fr' ? 'Clair' : 'Light',
    themeDark: lang === 'fr' ? 'Sombre' : 'Dark',
    toggleTheme: (isDarkLocal: boolean) => lang === 'fr' ? `Basculer le thème (${isDarkLocal ? 'Sombre' : 'Clair'})` : `Toggle theme (${isDarkLocal ? 'Dark' : 'Light'})`,
    toggleSidebarExpand: lang === 'fr' ? 'Ouvrir la barre latérale' : 'Expand sidebar',
    toggleSidebarCollapse: lang === 'fr' ? 'Réduire la barre latérale' : 'Collapse sidebar',
  }
  // labels-only map (strings only) for nav lookups to avoid function types
  const labelsOnly: Record<string, string> = {
    overview: L.overview,
    institutes: L.institutes,
    admins: L.admins,
    doctors: L.doctors,
    students: L.students,
    appointments: L.appointments,
  }

  // apply localized labels to nav items
  const localizedNavItems = navItems.map(item => ({ ...item, label: labelsOnly[item.id] ?? item.label }))

  // define logical separators between groups (used when collapsed)
  const navSeparators = isSuperAdmin ? ['institutes', 'students'] : ['overview', 'students']

  return (
  <div className={`${isCollapsed ? 'w-16' : 'w-72'} bg-white border-r border-gray-200/40 min-h-screen sticky top-0 self-start flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Toggle Button - Minimal Header */}
      <div className="flex items-center justify-end px-4 py-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all duration-200"
          aria-label={isCollapsed ? L.toggleSidebarExpand : L.toggleSidebarCollapse}
        >
          <PanelLeft className={`w-4 h-4 text-gray-400 hover:text-gray-600 transition-all duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Header */}
  <div className={`${isCollapsed ? 'px-4 pt-6 pb-4' : 'px-6 pb-6'}`}>
        {!isSuperAdmin && instituteName ? (
          <div className="flex flex-col items-center text-center space-y-2">
            <div className={`${isCollapsed ? 'w-12 h-12' : 'w-16 h-16'} ${isCollapsed ? 'overflow-visible' : 'overflow-hidden'} ${isCollapsed ? '' : 'rounded-lg'} flex items-center justify-center`}> 
              {/* When collapsed: larger, not rounded, allow full logo to show */}
              <Image
                src={instituteLogo ?? '/universitedesousse.png'}
                alt={instituteName ?? 'institute logo'}
                width={isCollapsed ? 48 : 64}
                height={isCollapsed ? 48 : 64}
                className={`object-contain ${isCollapsed ? 'transform scale-95' : ''}`}
              />
            </div>
            {!isCollapsed && (
              <div className="space-y-0.5">
                <h2 className="text-sm font-medium text-gray-800 leading-tight break-words whitespace-normal max-w-[14rem]">{instituteName}</h2>
                <p className="text-xs text-gray-500">Université de Sousse</p>
              </div>
            )}
          </div>
        ) : (
          // For super-admins show the university branding instead of role text
          <div title={userName} className={`${isCollapsed ? 'flex-col items-center space-y-2' : 'flex items-center space-x-3' } flex` }>
            <div className={`${isCollapsed ? 'w-12 h-12' : 'w-16 h-16'} ${isCollapsed ? '' : 'rounded-lg'} flex items-center justify-center`}> 
              <Image
                src={instituteLogo ?? '/universitedesousse.png'}
                alt={'Université de Sousse'}
                width={isCollapsed ? 48 : 64}
                height={isCollapsed ? 48 : 64}
                className={`object-contain ${isCollapsed ? 'transform scale-95' : ''}`}
              />
            </div>
            {!isCollapsed && (
              <div className="space-y-0.5">
                <h2 className="text-sm font-medium text-gray-800 leading-tight">Université de Sousse</h2>
              </div>
            )}
          </div>
        )}
  </div>

  {/* sub-header separator: expanded = full, collapsed = centered short line */}
  <div className={isCollapsed ? 'mx-auto my-2 w-6 h-px bg-gray-100/30' : 'mx-4 my-2 h-px bg-gray-100/60'} />

  {/* Navigation */}
      <nav className="flex-1 px-4 py-2">
        <div className="space-y-0.5">
          {localizedNavItems.map(item => (
            <React.Fragment key={item.id}>
              <button
                onClick={() => onNavChange(item.id)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-1' : 'justify-start px-2'} py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeNav === item.id
                    ? 'bg-gray-50 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                } focus:outline-none focus:ring-1 focus:ring-gray-200`}
                title={isCollapsed ? item.label : undefined}
              >
                <span className={`flex items-center justify-center transition-colors duration-200 ${
                  activeNav === item.id ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                }`}>
                  {item.icon}
                </span>
                  {!isCollapsed && (
                  <span className="ml-2 leading-none truncate">{item.label}</span>
                )}
              </button>

              {/* collapsed-only separator for logical groups */}
              {isCollapsed && navSeparators.includes(item.id) && (
                <div className="mx-auto my-2 w-6 h-px bg-gray-100/30" />
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className={`${isCollapsed ? 'px-4 py-4' : 'px-4 py-4'}`}>
        <div className="mb-3">
          {/* Language + Theme controls */}
          <div className={`flex ${isCollapsed ? 'flex-col items-center space-y-2' : 'flex-col items-start space-y-2'}`}>
            <button
              onClick={() => setLang(prev => (prev === 'fr' ? 'en' : 'fr'))}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-2 py-1 px-2 rounded-md text-sm text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-200`}
              title={isCollapsed ? (lang === 'fr' ? 'FR' : 'EN') : L.switchLanguage}
            >
              <Globe className={`w-4 h-4 ${isCollapsed ? 'text-gray-400' : 'text-gray-500'}`} />
              {!isCollapsed && <span className="uppercase text-xs tracking-wide">{lang}</span>}
            </button>

            <button
              onClick={() => {
                try {
                  const html = document.documentElement
                  html.classList.toggle('dark')
                  setIsDark(html.classList.contains('dark'))
                } catch {
                  // noop
                }
              }}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-2 py-1 px-2 rounded-md text-sm text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-1 focus:ring-gray-200`}
                title={isCollapsed ? (isDark ? L.themeDark : L.themeLight) : L.toggleTheme(isDark)}
            >
              {isDark ? (
                <Moon className="w-4 h-4 text-gray-500" />
              ) : (
                <Sun className="w-4 h-4 text-gray-500" />
              )}
                {!isCollapsed && <span className="text-xs">{isDark ? L.themeDark : L.themeLight}</span>}
            </button>
          </div>
        </div>

  {/* fine divider between controls and actions: subtle variant when collapsed */}
  <div className={isCollapsed ? 'mx-auto my-2 w-6 h-px bg-gray-100/30' : 'mx-2 my-2 h-px bg-gray-100/60'} />

        <div className="space-y-0.5">
          <button className={`w-full flex items-center ${isCollapsed ? 'justify-center px-1' : 'justify-start px-2'} py-2 text-sm font-medium rounded-md text-gray-600 hover:text-gray-900 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-gray-200`} title={isCollapsed ? L.settings : undefined}>
            <Settings className={`flex items-center justify-center transition-colors duration-200 ${isCollapsed ? 'w-4 h-4' : 'w-4 h-4'} text-gray-400 hover:text-gray-600`} />
            {!isCollapsed && <span className="ml-2">{L.settings}</span>}
          </button>
          <button className={`w-full flex items-center ${isCollapsed ? 'justify-center px-1' : 'justify-start px-2'} py-2 text-sm font-medium rounded-md text-red-500 hover:text-red-600 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-red-200`} title={isCollapsed ? L.logout : undefined}>
            <LogOut className={`flex items-center justify-center transition-colors duration-200 ${isCollapsed ? 'w-4 h-4' : 'w-4 h-4'} text-red-400 hover:text-red-500`} />
            {!isCollapsed && <span className="ml-2">{L.logout}</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
