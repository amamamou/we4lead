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
          ? 'bg-white/80 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.05)]'
          : 'bg-white'
      } border-b border-gray-200`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <div className="relative h-14 w-14 md:h-16 md:w-16">
                <Image
                  src="/we4lead.png"
                  alt="WE4LEAD"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="relative h-10 w-24 md:h-12 md:w-32">
                <Image
                  src="/universitedesousse.png"
                  alt="University of Sousse"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              {t('header.features', activeLocale)}
            </button>
            <button
              onClick={() => scrollToSection('institutions')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              {t('header.institutions', activeLocale)}
            </button>

            <button
              onClick={() => scrollToSection('footer')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              {t('header.contact', activeLocale)}
            </button>
             <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              {t('header.about', activeLocale)}
            </Link>
          </nav>

          {/* Note: moved theme & language controls into the auth area for better placement */}

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {authIsAuthenticated ? (
              <div className="relative">
                    <button
                      onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                      aria-expanded={profileMenuOpen}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                          {/* Hide the actual profile image on mobile; show a generic user icon instead */}
                          <div className="hidden sm:flex relative h-8 w-8 rounded-md overflow-hidden bg-gray-200 items-center justify-center">
                            {displayedUserImage ? (
                              <Image
                                src={displayedUserImage}
                                alt={displayedUserName || 'User'}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <User size={16} className="text-gray-600" />
                            )}
                          </div>
                          {/* On mobile we don't show the photo/icon in the header; profile actions live inside the mobile menu */}
                          <span className="hidden sm:inline text-sm font-medium text-gray-700">
                            {displayedUserName || displayedUserEmail || ''}
                          </span>
                          {/* Dropdown affordance on desktop: chevron that rotates when open */}
                          <ChevronDown size={14} className={`text-gray-600 transition-transform hidden md:inline ${profileMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                {/* Profile Dropdown (enhanced desktop view) */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 transition-opacity duration-150">
                    {/* small pointer arrow */}
                    <div className="absolute -top-2 right-6 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-200" aria-hidden />
                    <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100 bg-white">
                      <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                        {displayedUserImage ? (
                          <Image
                            src={displayedUserImage}
                            alt={displayedUserName || 'User'}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <User size={20} className="text-gray-600" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{displayedUserName || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{displayedUserEmail}</p>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>{t('header.profile.logout', activeLocale)}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                
              </div>
            )}

            {/* Compact Theme & Language Controls (moved into auth area) */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setLocale(activeLocale === 'en' ? 'fr' : 'en')}
                className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
                title="Toggle language"
              >
                {!hideLanguageIconOnMobile && <Globe size={14} />}
                <span className="hidden sm:inline">{activeLocale === 'en' ? 'EN' : 'FR'}</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Open menu"
            >
              <MoreHorizontal size={24} className="text-gray-900" />
            </button>
          </div>
        </div>

  {/* Auth now uses dedicated pages (/login, /signup) instead of header modals */}
        {/* Mobile Navigation (enhanced design) */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-200">
            <div className="mx-3 my-3 bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="flex items-center justify-between px-4 py-3">
                {/* Profile header (show only when authenticated) */}
                {authIsAuthenticated ? (
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      <User size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{displayedUserName || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{displayedUserEmail}</p>
                    </div>
                  </div>
                ) : (
                  <div />
                )}

                {/* Close button */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-md text-gray-500 hover:bg-gray-50"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="px-2 py-2">
                {/* Auth actions (when authenticated) */}
                {authIsAuthenticated && (
                  <div className="flex flex-col divide-y divide-gray-100 rounded-md overflow-hidden">
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:bg-gray-50"
                    >
                      <LayoutDashboard size={18} />
                      <span>{t('header.dashboard', activeLocale)}</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        void handleLogout();
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-base text-red-600 hover:bg-red-50 text-left"
                    >
                      <LogOut size={18} />
                      <span>{t('header.profile.logout', activeLocale)}</span>
                    </button>
                  </div>
                )}

                {/* Main navigation links */}
                <div className="mt-2 rounded-md bg-white">
                  <button
                    onClick={() => scrollToSection('features')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:bg-gray-50"
                  >
                    <span>{t('header.features', activeLocale)}</span>
                  </button>
                  <button
                    onClick={() => scrollToSection('institutions')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:bg-gray-50"
                  >
                    <span>{t('header.institutions', activeLocale)}</span>
                  </button>
                  <Link
                    href="/about"
                    className="w-full flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:bg-gray-50"
                  >
                    <span>{t('header.about', activeLocale)}</span>
                  </Link>
                  <button
                    onClick={() => scrollToSection('footer')}
                    className="w-full flex items-center gap-3 px-4 py-3 text-base text-gray-700 hover:bg-gray-50"
                  >
                    <span>{t('header.contact', activeLocale)}</span>
                  </button>
                </div>
              </div>

              {/* Bottom area: language toggle and auth CTAs for unauthenticated users */}
              <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setLocale(activeLocale === 'en' ? 'fr' : 'en')}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                  >
                    {!hideLanguageIconOnMobile && <Globe size={14} />}
                    <span className="font-medium">{activeLocale === 'en' ? 'EN' : 'FR'}</span>
                  </button>
                </div>

                {!authIsAuthenticated && (
                  <div className="mt-3 flex flex-col gap-2">
                    <button
                      onClick={openLogin}
                      className="w-full text-center py-2 text-gray-700 hover:text-gray-900 text-sm font-medium"
                    >
                      {t('header.signIn', activeLocale)}
                    </button>
                    <button
                      onClick={openSignup}
                      className="w-full text-center py-2 bg-[#020E68] text-white rounded-lg text-sm font-medium hover:bg-blue-900"
                    >
                      {t('header.getStarted', activeLocale)}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
