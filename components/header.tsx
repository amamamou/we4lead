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
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Header() {
  const router = useRouter()
  const { user, supabaseUser, loading, logout } = useAuth()

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    router.refresh()
  }

  const getDisplayName = () => {
    if (user) {
      return `${user.prenom || ''} ${user.nom || ''}`.trim() || user.email
    }
    return supabaseUser?.user_metadata?.full_name || supabaseUser?.email
  }

  const displayName = getDisplayName() || 'User'

  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/70 backdrop-blur shadow-sm' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Left — Logos */}
          <div className="flex items-center gap-3">
            <Image src="/universitedesousse.png" alt="University of Sousse" width={70} height={52} />
            <div className="w-px h-7 bg-gray-200" />
            <Image src="/we4lead.png" alt="WE4LEAD" width={90} height={70} />
          </div>

          {/* Center — Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600 font-medium">
            <Link href="/" className="hover:text-black transition">Accueil</Link>
            <Link href="/institutions" className="hover:text-black transition">Institutions</Link>
            <Link href="/consultants" className="hover:text-black transition">Consultants</Link>
            <Link href="/apropos" className="hover:text-black transition">À propos</Link>
          </nav>

          {/* Right — Account */}
          <div className="flex items-center gap-2">

            {loading ? (
              <div className="w-8 h-8 rounded-md bg-gray-100 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 rounded-lg p-1.5 hover:bg-gray-100 transition group">

                    <Avatar className="w-8 h-8 rounded-md overflow-hidden">
                      <AvatarImage
                        src={user?.avatar_url || "/placeholder.svg"}
                        alt={displayName}
                        className="object-cover w-full h-full rounded-md"
                      />
                      <AvatarFallback className="bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel className="space-y-1">
                    <p className="font-medium">{displayName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

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
                className="text-sm font-medium text-gray-700 hover:text-black transition"
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
