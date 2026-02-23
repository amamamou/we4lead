'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation';
import { MoreHorizontal, LogOut, Globe, ChevronDown } from 'lucide-react';
import { t, Locale } from '../../lib/i18n'
import { useLanguage } from '@/contexts/LanguageContext'

interface LandingHeaderProps {
  userEmail?: string;
  userImage?: string;
  userName?: string;
  locale?: Locale;
  hideLanguageIconOnMobile?: boolean;
}

export default function LandingHeader({
  userEmail,
  userImage,
  userName,
  locale,
  hideLanguageIconOnMobile,
}: LandingHeaderProps) {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const { locale: ctxLocale, setLocale } = useLanguage()
  const activeLocale = locale ?? ctxLocale

  const scrollToSection = (sectionId: string) => {
    if (typeof window === 'undefined') return;

    if (sectionId === 'footer') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
        return;
      }
    }

    let targetId = sectionId;
    if (sectionId === 'features' && pathname === '/') {
      targetId = 'landing-hero';
    }

    if (pathname !== '/') {
      sessionStorage.setItem('scrollToSection', targetId);
      void router.push('/');
      setMobileMenuOpen(false);
      return;
    }

    const element = document.getElementById(targetId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { user: authUser, isAuthenticated: authIsAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.refresh()
  };

  const displayedUserName = authUser
    ? (`${authUser.prenom ?? ''} ${authUser.nom ?? ''}`.trim() || authUser.email || userName || '')
    : (userName ?? '')

  const displayedUserEmail = authUser?.email ?? userEmail ?? ''

return (
  <header
    className={`sticky top-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
        : 'bg-white'
    }`}
  >
    <div className="max-w-7xl mx-auto px-6 lg:px-8">

      {/* ───────────── LOGO ROW ───────────── */}
      <div
        className={`flex justify-center items-center transition-all duration-500 ${
          scrolled ? 'pt-5 pb-3' : 'pt-8 pb-4'
        }`}
      >
        <Link href="/" className="group">
          <div
            className={`relative transition-all duration-500 ${
              scrolled
                ? 'h-12 w-48 md:h-14 md:w-56'
                : 'h-14 w-56 md:h-16 md:w-64'
            }`}
          >
            <Image
              src="/universitedesousse.png"
              alt="University of Sousse"
              fill
              className="object-contain transition-all duration-300 group-hover:opacity-80"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Elegant Separator Between Logo & Nav */}
      <div className="relative mb-4">
        <div className="h-px w-full bg-neutral-200/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-300/40 to-transparent" />
      </div>

      {/* ───────────── NAV ROW ───────────── */}
      <div
        className={`flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'pb-3' : 'pb-6'
        }`}
      >
        {/* Left spacer for symmetry */}
        <div className="hidden md:block w-28" />

        {/* CENTER NAVIGATION */}
        <nav className="hidden md:flex items-center gap-14 text-[12px] tracking-[0.28em] uppercase font-normal text-neutral-700">

          {['features', 'institutions', 'about', 'contact'].map((item) => {
            const isLink = item === 'about'
            const label = t(`header.${item}`, activeLocale)

            const baseClass =
              "relative hover:text-black transition-colors duration-300 after:absolute after:-bottom-3 after:left-0 after:h-[1px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"

            if (isLink) {
              return (
                <Link key={item} href="/about" className={baseClass}>
                  {label}
                </Link>
              )
            }

            return (
              <button
                key={item}
                onClick={() =>
                  scrollToSection(item === 'contact' ? 'footer' : item)
                }
                className={baseClass}
              >
                {label}
              </button>
            )
          })}
        </nav>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-8">

          {/* WE4LEAD refined (always visible) */}
          <div className="flex items-center">
            <div className="relative h-5 w-20">
              <Image
                src="/we4lead.png"
                alt="WE4LEAD"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* AUTH */}
          {authIsAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 text-sm text-neutral-800 font-medium hover:opacity-80 transition-opacity"
              >
                <span className="hidden sm:inline">
                  {displayedUserName || displayedUserEmail || ''}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 ${
                    profileMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-4 w-56 bg-white shadow-2xl rounded-2xl border border-neutral-100 overflow-hidden">
                  <Link
                    href="/dashboard"
                    className="block px-5 py-3 text-sm text-neutral-700 hover:bg-neutral-50"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    {t('header.dashboard', activeLocale)}
                  </Link>

                  <button
                    onClick={() => {
                      setProfileMenuOpen(false)
                      void handleLogout()
                    }}
                    className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50"
                  >
                    {t('header.profile.logout', activeLocale)}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* FR / EN refined */}
          <button
            onClick={() =>
              setLocale(activeLocale === 'en' ? 'fr' : 'en')
            }
            className="hidden md:flex items-center px-4 py-1.5 text-[11px] tracking-[0.32em] uppercase font-medium  border-neutral-300 rounded-full text-neutral-700 hover:border-black hover:text-black transition-all duration-300"
            aria-label={activeLocale === 'en' ? 'Switch to French' : 'Passer en anglais'}
          >
            <Globe size={13} className="mr-2 opacity-70" />
            {activeLocale === 'en' ? 'EN' : 'FR'}
          </button>

          {/* MOBILE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            <MoreHorizontal size={22} />
          </button>

        </div>
      </div>

      {/* Bottom Hairline Separator */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent opacity-80" />

    </div>
  </header>
)
}