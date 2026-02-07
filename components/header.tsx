'use client'

import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  // modal state for login/signup
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


    // dropdown state removed because header currently shows Sign up / Login

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

          {/* Sign up / Login (desktop) - replace authenticated profile when not signed in */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setSignupOpen(true)}
              className="px-3 py-2 rounded-md text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              S&apos;inscrire
            </button>

            <button
              onClick={() => setLoginOpen(true)}
              className="px-3 py-2 rounded-md text-sm font-medium bg-[#020E68] text-white hover:bg-[#020E68]/90 transition-colors"
            >
              Se connecter
            </button>
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

              <form onSubmit={(e) => { e.preventDefault(); setSignupOpen(false) }} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-600">Nom complet</label>
                  <input placeholder="Ex. Amira Ben Salem" className="w-full border border-gray-100 rounded px-3 py-2 mt-1" />
                </div>

                <div>
                  <label className="text-xs text-gray-600">Adresse email</label>
                  <input placeholder="votre@email.tn" type="email" className="w-full border border-gray-100 rounded px-3 py-2 mt-1" />
                  <p className="text-[12px] text-gray-500 mt-1">Utilisez votre email institutionnel.</p>
                </div>

                <div>
                  <label className="text-xs text-gray-600">Mot de passe</label>
                  <input placeholder="8 caractères minimum" type="password" className="w-full border border-gray-100 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#020E68]/20 transition" />
                </div>

                <div className="flex items-center gap-2">
                  <input id="terms" type="checkbox" className="w-4 h-4" />
                  <label htmlFor="terms" className="text-sm text-gray-600">J&apos;accepte les conditions d&apos;utilisation</label>
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

              <form onSubmit={(e) => { e.preventDefault(); setLoginOpen(false) }} className="space-y-4">
                <div>
                  <label className="text-xs text-gray-600">Email</label>
                  <input placeholder="votre@email.tn" type="email" className="w-full border border-gray-100 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#020E68]/20 transition" />
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label className="text-xs text-gray-600">Mot de passe</label>
                      <a className="text-xs text-gray-500 mb-2 inline-block" href="#">Mot de passe oublié ?</a>
                  </div>
                  <input placeholder="Mot de passe" type="password" className="w-full border border-gray-100 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-[#020E68]/20 transition" />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" className="w-4 h-4" /> Se souvenir de moi</label>
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
