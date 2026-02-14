import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { LogOut } from '@/components/ui/icons'

export type MenuItem = {
  key: string
  label: string
  icon?: React.ComponentType<Record<string, unknown>>
}

type Props = {
  menu: MenuItem[]
  activeKey?: string
  onChange?: (key: string) => void
}

export default function Sidebar({ menu, activeKey, onChange }: Props) {
  const isCondensed = menu.length > 5

  return (
    <>
      {/* Desktop / md+ sidebar (unchanged) */}
  <aside className={`hidden md:flex ${isCondensed ? 'w-[72px]' : 'w-20'} border-r dark:bg-gray-900 dark:border-gray-700 md:h-screen md:sticky md:top-0 flex flex-col items-center ${isCondensed ? 'py-4' : 'py-8'} z-50`}>
        <nav className="flex-1 w-full">
          <ul className={`flex flex-col items-center ${isCondensed ? 'gap-8' : 'gap-12'}`}>
            {menu.map((it) => {
              const Icon = it.icon
              const isActive = it.key === activeKey
              return (
                <li key={it.key} className="w-full">
                  <button
                    type="button"
                    onClick={() => onChange?.(it.key)}
                    title={it.label}
                    className={`group relative w-full flex items-center justify-center ${isCondensed ? 'p-4' : 'p-6'} rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#020E68]/40`}
                    aria-label={it.label}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {isActive && <span className="absolute left-0 h-10 w-1 bg-[#020E68] rounded-r" />}

                    {Icon ? <Icon size={isCondensed ? 22 : 28} /> : <span className="w-6 h-6 bg-gray-200 rounded" />}

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

          {(() => {
            const isActive = activeKey === 'account'
            return (
                <button
                type="button"
                onClick={() => onChange?.('account')}
                title="Account"
                className={`group relative flex items-center justify-center w-full ${isCondensed ? 'p-3' : 'p-3'} rounded-md text-gray-600 dark:text-gray-300 transition ${isActive ? '' : ''}`}
                aria-label="Account"
              >
                <Avatar className={`${isCondensed ? 'w-8 h-8' : 'w-9 h-9'} rounded-md transform transition-transform duration-200 group-hover:scale-110 overflow-hidden`}>
                  <AvatarImage src="/placeholder.svg" alt="Account" className="object-cover w-full h-full rounded-md" />
                  <AvatarFallback className="bg-[#F3F4F6] text-gray-700 text-xs font-medium rounded-md">AB</AvatarFallback>
                </Avatar>

                <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">Account</span>
                {isActive && <span className="absolute left-0 h-10 w-1 bg-[#020E68] rounded-r" />}
              </button>
            )
          })()}

          <button
            aria-label="Sign out"
            title="Sign out"
            className="group relative flex items-center justify-center w-full p-3 rounded-md text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-200 dark:text-red-300"
          >
            <LogOut size={20} />
            <span className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity z-50">Sign out</span>
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav: visible only on small screens */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg px-1 py-1 flex items-center justify-between">
          <ul className="flex items-center justify-between w-full gap-1 overflow-x-auto">
            {menu.map((it) => {
              const Icon = it.icon
              const isActive = it.key === activeKey
              return (
                 <li key={it.key} className={`${isCondensed ? 'w-auto flex-initial' : 'flex-1'} text-center`}>
                  <button
                    type="button"
                    onClick={() => onChange?.(it.key)}
                    title={it.label}
                    className={`flex flex-col items-center justify-center ${isCondensed ? 'w-14 px-2 py-1' : 'w-full px-2 py-2'} rounded-lg transition ${
                      isActive ? 'bg-[#020E68]/10 text-[#020E68]' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    aria-label={it.label}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    {Icon ? <Icon size={isCondensed ? 16 : 20} /> : <span className="w-5 h-5 bg-gray-200 rounded" />}
                    <span className={`${isCondensed ? 'sr-only' : 'text-[10px] mt-1 truncate'}`}>{it.label}</span>
                  </button>
                </li>
              )
            })}

            {/* Account quick action */}
            <li className="flex-0">
              <button
                type="button"
                onClick={() => onChange?.('account')}
                title="Account"
                className={`flex flex-col items-center justify-center ${isCondensed ? 'px-1 py-1' : 'px-2 py-2'} rounded-lg transition ${activeKey === 'account' ? 'bg-[#020E68]/10 text-[#020E68]' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <Avatar className={`${isCondensed ? 'w-7 h-7' : 'w-7 h-7'} rounded-md overflow-hidden`}>
                  <AvatarImage src="/placeholder.svg" alt="Account" className="object-cover w-full h-full rounded-md" />
                  <AvatarFallback className="bg-[#F3F4F6] text-gray-700 text-xs font-medium rounded-md">AB</AvatarFallback>
                </Avatar>
                <span className={`${isCondensed ? 'sr-only' : 'text-[10px] mt-1'}`}>Account</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
