 'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation';
import { MoreHorizontal, X, LogOut, User, Globe, LayoutDashboard, ChevronDown } from 'lucide-react';
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
  // no modal state anymore — header will navigate to dedicated auth pages
  
  

  const router = useRouter();
  const pathname = usePathname();
  
  const [scrolled, setScrolled] = useState(false);
  const { locale: ctxLocale, setLocale } = useLanguage()
  const activeLocale = locale ?? ctxLocale

  // helper functions to navigate to auth pages
  const openLogin = () => void router.push('/login');
  const openSignup = () => void router.push('/signup');

  const scrollToSection = (sectionId: string) => {
    // Special-case: if the user clicked "Contact" (footer) prefer to scroll
    // within the current page if the footer element exists. If it doesn't
    // exist here and we're not on '/', fall back to navigating to '/' and
    // scrolling there (no URL hash used).
    if (typeof window === 'undefined') return;

    if (sectionId === 'footer') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        setMobileMenuOpen(false);
        return;
      }
      // Footer not present on this page — fall through to navigate to home
    }

    // Map 'features' -> 'landing-hero' when already on the homepage so the
    // Features button scrolls to the hero section. Use the mapped id when
    // storing for cross-page navigation as well.
    let targetId = sectionId;
    if (sectionId === 'features' && pathname === '/') {
      targetId = 'landing-hero';
    }

    // If we're not on the homepage, navigate there first and store the
    // requested section in sessionStorage so the homepage can scroll to it
    // after navigation. This avoids using URL hashes (no "#section").
    if (pathname !== '/') {
      try {
        sessionStorage.setItem('scrollToSection', targetId);
      } catch {
        // ignore storage errors
      }
      void router.push('/');
      setMobileMenuOpen(false);
      return;
    }

    const element = document.getElementById(targetId);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  // If another page asked to scroll to a section (we stored it in
  // sessionStorage before navigating to '/'), perform the scroll once the
  // pathname is '/'. Retry briefly until the element exists (DOM may not be
  // ready immediately after navigation).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pathname !== '/') return;

    const target = sessionStorage.getItem('scrollToSection');
    if (!target) return;

    let tries = 0;
    const maxTries = 20; // ~2 seconds (20 * 100ms)

    const attempt = () => {
      const el = document.getElementById(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        sessionStorage.removeItem('scrollToSection');
        return;
      }
      tries += 1;
      if (tries <= maxTries) {
        setTimeout(attempt, 100);
      } else {
        // give up and clear
        sessionStorage.removeItem('scrollToSection');
      }
    };

    // Start attempts on next tick so the homepage has a chance to render
    setTimeout(attempt, 50);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // No global modal events — header now navigates to dedicated auth pages

  // Use central AuthProvider for auth operations and state
  const { user: authUser, isAuthenticated: authIsAuthenticated, logout, loading: authLoading } = useAuth()


  // ── LOGOUT ──────────────────────────────────────────────────────
  const handleLogout = async () => {
    await logout()
    // AuthProvider handles state & refresh
    router.refresh()
  };

  // derive displayed user fields (prefer provider user)
  // If provider user exists, prefer first+last name; if name missing, fall
  // back to email. Do NOT show the literal string "User" for authenticated
  // users — prefer an empty fallback for non-authenticated state.
  const displayedUserName = authUser
    ? (`${authUser.prenom ?? ''} ${authUser.nom ?? ''}`.trim() || authUser.email || userName || '')
    : (userName ?? '')
  const displayedUserEmail = authUser?.email ?? userEmail ?? ''
  const displayedUserImage = authUser?.photoPath ?? userImage

  // Use provider user if available
  const shownUser = authUser ?? undefined
  void shownUser;
  void authLoading;

return (
  <header
    className={`sticky top-0 z-50 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.05)]'
        : 'bg-white'
    } border-b border-gray-100`}
  >
    <div className="relative max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">

      {/* LEFT — Navigation */}
      <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600 font-normal">
        <button
          onClick={() => scrollToSection('features')}
          className="hover:text-gray-900 transition-colors"
        >
          {t('header.features', activeLocale)}
        </button>

        <button
          onClick={() => scrollToSection('institutions')}
          className="hover:text-gray-900 transition-colors"
        >
          {t('header.institutions', activeLocale)}
        </button>

        <Link
          href="/about"
          className="hover:text-gray-900 transition-colors"
        >
          {t('header.about', activeLocale)}
        </Link>

        <button
          onClick={() => scrollToSection('footer')}
          className="hover:text-gray-900 transition-colors"
        >
          {t('header.contact', activeLocale)}
        </button>
      </nav>

      {/* CENTER — UNIVERSITY LOGO */}
      <Link
        href="/"
        className="absolute left-1/2 -translate-x-1/2"
      >
        <div className="relative h-14 w-56 md:h-16 md:w-64">
          <Image
            src="/universitedesousse.png"
            alt="University of Sousse"
            fill
            className="object-contain"
            priority
          />
        </div>
      </Link>

      {/* RIGHT — WE4LEAD + Auth */}
      <div className="flex items-center gap-6">

        {/* Subtle WE4LEAD */}
        <div className="hidden md:flex opacity-70 hover:opacity-100 transition-opacity">
          <div className="relative h-5 w-16">
            <Image
              src="/we4lead.png"
              alt="WE4LEAD"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {authIsAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="hidden sm:flex relative h-8 w-8 rounded-md overflow-hidden bg-gray-200 items-center justify-center">
                  {displayedUserImage ? (
                    <Image
                      src={displayedUserImage}
                      alt={displayedUserName || ''}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User size={16} className="text-gray-600" />
                  )}
                </div>

                <span className="hidden sm:inline text-sm text-gray-700">
                  {displayedUserName || displayedUserEmail || ''}
                </span>

                <ChevronDown
                  size={14}
                  className={`hidden md:inline transition-transform ${
                    profileMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
                    <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                      {displayedUserImage ? (
                        <Image
                          src={displayedUserImage}
                          alt={displayedUserName || ''}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <User size={20} className="text-gray-600" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {displayedUserName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {displayedUserEmail}
                      </p>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      <span>{t('header.dashboard', activeLocale)}</span>
                    </Link>

                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        void handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100"
                    >
                      <LogOut size={16} />
                      <span>{t('header.profile.logout', activeLocale)}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Language Toggle */}
          <button
            onClick={() =>
              setLocale(activeLocale === 'en' ? 'fr' : 'en')
            }
            className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-50 text-sm text-gray-700"
          >
            {!hideLanguageIconOnMobile && <Globe size={14} />}
            <span className="hidden sm:inline">
              {activeLocale === 'en' ? 'EN' : 'FR'}
            </span>
          </button>

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <MoreHorizontal size={24} />
          </button>
        </div>
      </div>
    </div>

    {/* Keep your existing mobile menu below unchanged */}
  </header>
)
}
