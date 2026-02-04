'use client'

import { Menu, LogOut, Calendar } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-dropdown]')) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className={`w-full z-50 transition-all duration-300 border-b border-gray-100 sticky top-0 ${
        scrolled ? 'bg-white/70 backdrop-blur-md shadow-md' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logos */}
          <div className="flex items-center gap-3">
            <Image
              src="/universitedesousse.png"
              alt="University of Sousse"
              width={82}
              height={62}
              className="object-contain"
            />

            <div className="w-px h-8 bg-gray-300" />

            <Image
              src="/we4lead.png"
              alt="WE4LEAD"
              width={100}
              height={92}
              className="object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-foreground hover:text-gray-600 transition-colors"
            >
              Accueil
            </Link>
            <Link
              href="/institutions"
              className="text-sm font-medium text-foreground hover:text-gray-600 transition-colors"
            >
              Institutions
            </Link>
            <Link
              href="/consultants"
              className="text-sm font-medium text-foreground hover:text-gray-600 transition-colors"
            >
              Consultants
            </Link>
            <Link
              href="/apropos"
              className="text-sm font-medium text-foreground hover:text-gray-600 transition-colors"
            >
              À propos
            </Link>
          </nav>

          {/* User Profile Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            <div className="relative" data-dropdown>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-semibold">
                  JD
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">John Doe</p>
                  <p className="text-xs text-gray-600">Étudiant</p>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                  {/* Profile Header */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                        JD
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">John Doe</p>
                        <p className="text-xs text-gray-600">john.doe@student.us.tn</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      href="/dashboard"
                      className="px-6 py-3 text-sm text-foreground hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <Calendar className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200 py-2">
                    <button className="w-full px-6 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                      <LogOut className="w-4 h-4" />
                      Se déconnecter
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          <button className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  )
}
