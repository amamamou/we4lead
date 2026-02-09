'use client'

import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'
import { supabase } from '@/lib/supabaseClient'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  // --- FETCH USER FROM BACKEND ---
  const fetchBackendUser = async (accessToken: string) => {
    try {
      const res = await fetch(`${backendUrl}/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (!res.ok) throw new Error('Failed to fetch user from backend')
      const backendUser = await res.json()
      localStorage.setItem('user', JSON.stringify(backendUser))
      localStorage.setItem('userId', backendUser.id)
      localStorage.setItem('userRole', backendUser.role)
      setUser(backendUser)
    } catch (err) {
      console.error('Backend fetch error:', err)
    }
  }

  // --- REFRESH TOKEN ---
  const refreshToken = async () => {
    const refresh_token = localStorage.getItem('supabaseRefreshToken')
    if (!refresh_token) return

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token }),
      })
      const data = await res.json()
      if (data.access_token && data.refresh_token) {
        localStorage.setItem('supabaseAccessToken', data.access_token)
        localStorage.setItem('supabaseRefreshToken', data.refresh_token)
        await fetchBackendUser(data.access_token)
      }
    } catch (err) {
      console.error('Failed to refresh token', err)
    }
  }

  // --- INITIAL LOAD ---
  useEffect(() => {
    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) return console.error('Supabase getSession error:', error)

      const session = data.session
      if (!session) return

      const accessToken = session.access_token
      const refreshToken = session.refresh_token

      // store tokens first
      localStorage.setItem('supabaseAccessToken', accessToken)
      localStorage.setItem('supabaseRefreshToken', refreshToken)

      // fetch backend user
      await fetchBackendUser(accessToken)
    }

    loadSession()

    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // --- AUTO REFRESH TOKEN EVERY 55 MINUTES ---
  useEffect(() => {
    const interval = setInterval(() => refreshToken(), 55 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // --- LOGIN ---
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = (e.currentTarget.email as HTMLInputElement).value
    const password = (e.currentTarget.password as HTMLInputElement).value

    const response = await supabase.auth.signInWithPassword({ email, password })
    if (response.error) return alert(response.error.message)

    const accessToken = response.data.session?.access_token
    const refreshToken = response.data.session?.refresh_token
    if (!accessToken || !refreshToken) return alert('No token received')

    localStorage.setItem('supabaseAccessToken', accessToken)
    localStorage.setItem('supabaseRefreshToken', refreshToken)

    await fetchBackendUser(accessToken)
    setLoginOpen(false)
  }

  // --- SIGNUP ---
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = (e.currentTarget.email as HTMLInputElement).value
    const password = (e.currentTarget.password as HTMLInputElement).value
    const fullName = (e.currentTarget.fullName as HTMLInputElement).value

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/verify` },
    })
    if (error) return alert(error.message)
    alert('Email de confirmation envoyé')
    setSignupOpen(false)
  }

  // --- LOGOUT ---
  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('supabaseAccessToken')
    localStorage.removeItem('supabaseRefreshToken')
    localStorage.removeItem('user')
    localStorage.removeItem('userId')
    localStorage.removeItem('userRole')
    setUser(null)
  }

  // --- RENDER ---
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
            <Image src="/universitedesousse.png" alt="University of Sousse" width={82} height={62} className="object-contain" />
            <div className="w-px h-8 bg-gray-300" />
            <Image src="/we4lead.png" alt="WE4LEAD" width={100} height={92} className="object-contain" />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-gray-600 transition-colors">Accueil</Link>
            <Link href="/institutions" className="text-sm font-medium text-foreground hover:text-gray-600 transition-colors">Institutions</Link>
            <Link href="/consultants" className="text-sm font-medium text-foreground hover:text-gray-600 transition-colors">Consultants</Link>
            <Link href="/apropos" className="text-sm font-medium text-foreground hover:text-gray-600 transition-colors">À propos</Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <button onClick={handleLogout} className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">
                Se déconnecter
              </button>
            ) : (
              <>
                <button onClick={() => setSignupOpen(true)} className="px-3 py-2 rounded-md text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                  S&apos;inscrire
                </button>
                <button onClick={() => setLoginOpen(true)} className="px-3 py-2 rounded-md text-sm font-medium bg-[#020E68] text-white hover:bg-[#020E68]/90 transition-colors">
                  Se connecter
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <button className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Signup Modal */}
          <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>S&apos;inscrire</DialogTitle>
                <DialogDescription>Créez un compte en quelques secondes pour accéder aux services.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-600">Nom complet</label>
                  <input name="fullName" placeholder="Ex. Amira Ben Salem" className="w-full border border-gray-100 rounded px-3 py-2 mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Adresse email</label>
                  <input name="email" placeholder="votre@email.tn" type="email" className="w-full border border-gray-100 rounded px-3 py-2 mt-1" />
                  <p className="text-[12px] text-gray-500 mt-1">Utilisez votre email institutionnel.</p>
                </div>
                <div>
                  <label className="text-xs text-gray-600">Mot de passe</label>
                  <input name="password" placeholder="8 caractères minimum" type="password" className="w-full border border-gray-100 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#020E68]/20 transition" />
                </div>
                <DialogFooter className="flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setSignupOpen(false)} className="px-4 py-2 rounded-md text-sm border border-gray-200">Annuler</button>
                  <button type="submit" className="px-5 py-2 rounded-md text-sm bg-[#020E68] text-white shadow">Créer un compte</button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Login Modal */}
          <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Se connecter</DialogTitle>
                <DialogDescription>Connectez-vous pour accéder à votre espace</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-600">Email</label>
                  <input name="email" placeholder="votre@email.tn" type="email" className="w-full border border-gray-100 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#020E68]/20 transition" />
                </div>
                <div>
                  <label className="text-xs text-gray-600">Mot de passe</label>
                  <input name="password" placeholder="Mot de passe" type="password" className="w-full border border-gray-100 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#020E68]/20 transition" />
                </div>
                <DialogFooter className="flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setLoginOpen(false)} className="px-4 py-2 rounded-md text-sm border border-gray-200">Annuler</button>
                  <button type="submit" className="px-5 py-2 rounded-md text-sm bg-[#020E68] text-white shadow">Se connecter</button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  )
}
