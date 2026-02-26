import React from 'react'
import { useRouter } from 'next/navigation'
import { LogOut } from '@/components/ui/icons'
import { useAuth } from '@/contexts/AuthContext'

export type MenuItem = {
  key: string
  label: string
  icon?: React.ComponentType<Record<string, unknown>>
}

type Props = {
  menu: MenuItem[]
  activeKey?: string
  onChange?: (key: string) => void
  /** When true the sidebar is fixed (removed from document flow) on md+ screens */
  fixed?: boolean
  /** When true use tighter spacing / smaller paddings for icons */
  compact?: boolean
  /** When true render larger icons and increased spacing (used for super-admin) */
  largeIcons?: boolean
}

export default function Sidebar({ menu, activeKey, onChange, fixed = false, compact = false, largeIcons = false }: Props) {
  const router = useRouter()
  const { logout } = useAuth()
  const isCondensed = menu.length > 5
  const isCompact = !!compact
  const isLarge = !!largeIcons

  const handleLogout = async () => {
    try {
      await logout()
      // AuthProvider handles state cleanup
      router.refresh()
      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <>
      {/* Desktop / md+ sidebar */}
      <aside
        className={
          `hidden md:flex ${isCondensed ? 'w-[72px]' : 'w-20'} border-r dark:bg-gray-900 dark:border-gray-700 md:h-screen ${fixed ? 'md:fixed md:top-0 md:left-0' : 'md:sticky md:top-0'} flex flex-col items-center ${isCompact ? 'py-3' : 'py-8'} z-50`
        }
      >
        <nav className="flex-1 w-full">
          <ul className={`flex flex-col items-center ${isCompact ? (isLarge ? 'gap-10' : 'gap-8') : isCondensed ? (isLarge ? 'gap-6' : 'gap-4') : (isLarge ? 'gap-8' : 'gap-6')}`}>
            {menu.map((it) => {
              const Icon = it.icon
              const isActive = it.key === activeKey

              // base sizes, slightly larger for the 'institutes' icon
              const baseInstituteSize = isCondensed ? (isCompact ? 20 : 22) : (isCompact ? 24 : 30)
              const baseDefaultSize = isCondensed ? (isCompact ? 18 : 20) : (isCompact ? 20 : 24)
              // scale up if largeIcons requested
              const scale = isLarge ? 1.35 : 1
              const desktopIconSize = Math.round((it.key === 'institutes' ? baseInstituteSize : baseDefaultSize) * scale)

              return (
                <li key={it.key} className="w-full">
                  <button
                    type="button"
                    onClick={() => onChange?.(it.key)}
                    title={it.label}
                    className={`group relative w-full flex items-center justify-center ${isCompact ? (isLarge ? 'p-4' : 'p-3') : isCondensed ? (isLarge ? 'p-5' : 'p-4') : (isLarge ? 'p-8' : 'p-6')} rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#020E68]/40`}
                    aria-label={it.label}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {isActive && <span className="absolute left-0 h-10 w-1 bg-[#020E68] rounded-r" />}

                    {Icon ? <Icon size={desktopIconSize} /> : <span className="w-5 h-5 bg-gray-200 rounded" />}

                    <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity z-50">
                      {it.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex flex-col items-center gap-6 mt-6 w-full px-2">
          <div role="separator" aria-hidden="true" className="w-full flex justify-center">
            <div className="w-10 h-px bg-gray-200 dark:bg-gray-800 rounded mt-1 mb-1" />
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            aria-label="Se déconnecter"
            title="Se déconnecter"
            className="group relative flex items-center justify-center w-full p-3 rounded-md text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-200 dark:text-red-300"
          >
            <LogOut size={20} />
            <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">
              Se déconnecter
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg px-1 py-1 flex items-center justify-between">
          <ul className="flex items-center justify-between w-full gap-1 overflow-x-auto">
            {menu.map((it) => {
              const Icon = it.icon
              const isActive = it.key === activeKey

              // mobile sizes (bottom nav). Scale up for largeIcons too.
              const defaultIconSize = Math.round((isCondensed ? 16 : 20) * (isLarge ? 1.2 : 1))
              const instituteIconSize = Math.round((isCondensed ? 14 : 16) * (isLarge ? 1.15 : 1))
              const iconSize = it.key === 'institutes' ? instituteIconSize : defaultIconSize

              return (
                  <li key={it.key} className={`${isCondensed ? 'w-auto flex-initial' : 'flex-1'} text-center`}>
                  <button
                    type="button"
                    onClick={() => onChange?.(it.key)}
                    title={it.label}
                    className={`flex flex-col items-center justify-center ${isCondensed ? (isLarge ? 'w-16 px-3 py-2' : 'w-14 px-2 py-1') : (isLarge ? 'w-full px-3 py-3' : 'w-full px-2 py-2')} rounded-lg transition ${
                      isActive ? 'bg-[#020E68]/10 text-[#020E68]' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    aria-label={it.label}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {Icon ? (
                      <Icon
                        size={iconSize}
                        strokeWidth={it.key === 'institutes' ? 1.4 : undefined}
                        className={it.key === 'institutes' ? 'w-5 h-5 md:w-4 md:h-4' : undefined}
                      />
                    ) : (
                      <span className="w-5 h-5 bg-gray-200 rounded" />
                    )}
                    <span className={`${isCondensed ? 'sr-only' : 'text-[10px] mt-1 truncate'}`}>{it.label}</span>
                  </button>
                </li>
              )
            })}

            {/* Mobile logout button - optional, can be added here if needed */}
            <li className={`${isCondensed ? 'w-auto flex-initial' : 'flex-1'} text-center`}>
              <button
                onClick={handleLogout}
                title="Se déconnecter"
                className="flex flex-col items-center justify-center ${isCondensed ? 'w-14 px-2 py-1' : 'w-full px-2 py-2'} rounded-lg transition text-red-600 hover:bg-red-50"
              >
                <LogOut size={isCondensed ? 16 : 20} />
                <span className={`${isCondensed ? 'sr-only' : 'text-[10px] mt-1'}`}>Déconnexion</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}