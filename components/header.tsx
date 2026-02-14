'use client'

import {
  Menu,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, supabaseUser, loading, logout } = useAuth()

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.refresh()
  }

  const displayName =
    `${user?.prenom || ''} ${user?.nom || ''}`.trim() ||
    supabaseUser?.user_metadata?.full_name ||
    supabaseUser?.email ||
    'Utilisateur'

  const role = user?.role || 'Compte'

  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const active = pathname === href

    return (
      <Link
        href={href}
        className={`relative px-1 py-2 text-[13.5px] tracking-tight transition-colors
        ${active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
      >
        {label}
        <span
          className={`absolute left-0 -bottom-1 h-[2px] w-full rounded-full transition-all duration-300 ${
            active ? 'bg-gray-800 opacity-100 scale-x-100' : 'bg-gray-300 opacity-0 scale-x-50'
          }`}
        />
      </Link>
    )
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.05)]'
          : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex items-center justify-between h-[64px]">

          {/* LEFT — Logos */}
          <div className="flex items-center gap-3">
            <Image src="/universitedesousse.png" alt="University of Sousse" width={64} height={48} />
            <div className="w-px h-6 bg-gray-200" />
            <Image src="/we4lead.png" alt="WE4LEAD" width={82} height={60} />
          </div>

          {/* CENTER — Navigation */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
            <NavLink href="/" label="Accueil" />
            <NavLink href="/institutions" label="Institutions" />
            <NavLink href="/consultants" label="Consultants" />
            <NavLink href="/apropos" label="À propos" />
          </nav>

          {/* RIGHT — Identity */}
          <div className="flex items-center gap-3">

            {loading ? (
              <div className="w-32 h-9 rounded-md bg-gray-100 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition group">

                    <Avatar className="w-9 h-9 rounded-lg overflow-hidden">
                      <AvatarImage src={user?.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-gray-100 text-gray-700 text-xs font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="text-left leading-tight">
                      <p className="text-[13.5px] font-medium text-gray-900">
                        {displayName}
                      </p>
                      <p className="text-[12px] text-gray-500 capitalize">
                        {role}
                      </p>
                    </div>

                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Tableau de bord
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => router.push('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => router.push('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-black transition"
              >
                Se connecter
              </Link>
            )}

            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="w-5 h-5 text-gray-700" />
            </button>

          </div>
        </div>
      </div>
    </header>
  )
}
