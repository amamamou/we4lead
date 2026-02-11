'use client'

import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  const [scrolled, setScrolled] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loadingAuth, setLoadingAuth] = useState(true)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [signupError, setSignupError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  // Listen to auth state changes (fixed version)
  useEffect(() => {
    // Initial check
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoadingAuth(false)
      if (user) syncWithBackend(user)
    })

    // Subscribe to auth changes - FIXED HERE
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await syncWithBackend(session.user)
      } else {
        // Logged out
        localStorage.removeItem('user')
        localStorage.removeItem('userId')
        localStorage.removeItem('userRole')
      }
      setLoadingAuth(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Sync tokens & fetch backend user profile
  const syncWithBackend = async (supabaseUser: any) => {
    const accessToken = (await supabase.auth.getSession())?.data.session?.access_token
    if (!accessToken) return

    localStorage.setItem('supabaseAccessToken', accessToken)

    try {
      const res = await fetch(`${backendUrl}/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      if (!res.ok) throw new Error('Backend /me failed')

      const backendUser = await res.json()
      localStorage.setItem('user', JSON.stringify(backendUser))
      localStorage.setItem('userId', backendUser.id)
      localStorage.setItem('userRole', backendUser.role)
      if (backendUser.universite?.id) {
      localStorage.setItem('universityId', backendUser.universite.id.toString())
    } else {
      // Remove any existing universityId if user doesn't have one
      localStorage.removeItem('universityId')
    }
    } catch (err) {
      console.error('Backend sync error:', err)
    }
  }

  // Auto-refresh token logic (optional but good to have)
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) return

      const { access_token } = data.session
      localStorage.setItem('supabaseAccessToken', access_token)
    }, 30 * 60 * 1000) 

    return () => clearInterval(interval)
  }, [])

  const handleScroll = () => setScrolled(window.scrollY > 50)
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── LOGIN ───────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoginError(null)
    setIsSubmitting(true)

    const form = e.currentTarget
    const email = (form.email as HTMLInputElement).value.trim()
    const password = (form.password as HTMLInputElement).value

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      setLoginOpen(false)
      router.refresh()
    } catch (err: any) {
      setLoginError(err.message || 'Échec de connexion')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── SIGNUP ──────────────────────────────────────────────────────
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSignupError(null)
    setIsSubmitting(true)

    const form = e.currentTarget
    const email = (form.email as HTMLInputElement).value.trim()
    const password = (form.password as HTMLInputElement).value
    const fullName = (form.fullName as HTMLInputElement).value.trim()

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/verify`,
        },
      })

      if (error) throw error

      alert('Email de confirmation envoyé. Vérifiez votre boîte de réception.')
      setSignupOpen(false)
    } catch (err: any) {
      setSignupError(err.message || 'Échec de l’inscription')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── LOGOUT ──────────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.clear()
    setUser(null)
    router.refresh()
  }

  // ── RENDER ──────────────────────────────────────────────────────
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
            <Link href="/" className="text-sm font-medium hover:text-gray-600 transition-colors">Accueil</Link>
            <Link href="/institutions" className="text-sm font-medium hover:text-gray-600 transition-colors">Institutions</Link>
            <Link href="/consultants" className="text-sm font-medium hover:text-gray-600 transition-colors">Consultants</Link>
            <Link href="/apropos" className="text-sm font-medium hover:text-gray-600 transition-colors">À propos</Link>
          </nav>

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-3">
            {loadingAuth ? (
              <span className="text-sm text-gray-500">Chargement...</span>
            ) : user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{user.user_metadata?.full_name || user.email}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setSignupOpen(true)}
                  className="px-4 py-2 rounded-md text-sm font-medium border hover:bg-gray-50 transition"
                >
                  S'inscrire
                </button>
                <button
                  onClick={() => setLoginOpen(true)}
                  className="px-5 py-2 rounded-md text-sm font-medium bg-[#020E68] text-white hover:bg-[#020E68]/90 transition"
                >
                  Se connecter
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 hover:bg-muted rounded-lg">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Signup Modal */}
      <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>S'inscrire</DialogTitle>
            <DialogDescription>Créez votre compte rapidement</DialogDescription>
          </DialogHeader>

          {signupError && (
            <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{signupError}</div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nom complet</label>
              <input name="fullName" required className="w-full border rounded px-3 py-2" placeholder="Amira Ben Salem" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input name="email" type="email" required className="w-full border rounded px-3 py-2" placeholder="votre@email.tn" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mot de passe</label>
              <input name="password" type="password" required minLength={6} className="w-full border rounded px-3 py-2" />
            </div>

            <DialogFooter>
              <button type="button" onClick={() => setSignupOpen(false)} className="px-4 py-2 border rounded" disabled={isSubmitting}>
                Annuler
              </button>
              <button type="submit" className="px-5 py-2 bg-[#020E68] text-white rounded" disabled={isSubmitting}>
                {isSubmitting ? 'Création...' : 'Créer le compte'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Login Modal */}
      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Se connecter</DialogTitle>
            <DialogDescription>Accédez à votre espace</DialogDescription>
          </DialogHeader>

          {loginError && (
            <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{loginError}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input name="email" type="email" required className="w-full border rounded px-3 py-2" placeholder="votre@email.tn" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mot de passe</label>
              <input name="password" type="password" required className="w-full border rounded px-3 py-2" />
            </div>

            <DialogFooter>
              <button type="button" onClick={() => setLoginOpen(false)} className="px-4 py-2 border rounded" disabled={isSubmitting}>
                Annuler
              </button>
              <button type="submit" className="px-5 py-2 bg-[#020E68] text-white rounded" disabled={isSubmitting}>
                {isSubmitting ? 'Connexion...' : 'Se connecter'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </header>
  )
}