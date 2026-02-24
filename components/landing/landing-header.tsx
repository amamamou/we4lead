'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation';
import { MoreHorizontal, LogOut, Globe, ChevronDown, User, LayoutDashboard } from 'lucide-react';
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
}: LandingHeaderProps) {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hideOnScroll, setHideOnScroll] = useState(false);

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
    // Track scroll position and direction. We set `scrolled` when
    // window.scrollY > 10 for the header styling, and `hideOnScroll`
    // when the user is actively scrolling down (to hide the header).
    let lastY = typeof window !== 'undefined' ? window.scrollY : 0;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 10);

      const delta = y - lastY;

      // small tolerance to avoid flicker
      if (Math.abs(delta) < 6) {
        lastY = y;
        return;
      }

      // If scrolled past a short threshold and moving down -> hide
      if (y > 80 && delta > 0) {
        setHideOnScroll(true);
      } else if (delta < 0) {
        // moving up -> show
        setHideOnScroll(false);
      } else if (y <= 80) {
        // near the top always show
        setHideOnScroll(false);
      }

      lastY = y;
    };

    // Initialize
    if (typeof window !== 'undefined') onScroll();

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
  const _authObj = authUser as unknown as Record<string, unknown>;
  const displayedUserImage =
    (typeof _authObj?.avatar === 'string'
      ? (_authObj.avatar as string)
      : typeof _authObj?.image === 'string'
      ? (_authObj.image as string)
      : typeof _authObj?.photo === 'string'
      ? (_authObj.photo as string)
      : userImage ?? '') || '';

return (
  <header
    className={`sticky top-0 z-50 transform-gpu transition-transform duration-300 ${
      hideOnScroll ? '-translate-y-full' : 'translate-y-0'
    } ${
      scrolled
        ? 'bg-white/85 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
        : 'bg-white'
    }`}
  >
    <div className="max-w-7xl mx-auto px-6 lg:px-8">

      {/* ───────────── LOGO ROW ───────────── */}
      <div
        className={`flex justify-center items-center transition-all duration-500 ${
          scrolled ? 'pt-4 pb-2' : 'pt-6 pb-3'
        }`}
      >
        <Link href="/" className="group">
          <div
            className={`relative transition-all duration-500 ${
              scrolled
                ? 'h-10 w-40 md:h-12 md:w-48'
                : 'h-12 w-48 md:h-14 md:w-56'
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
        className={`relative flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'pb-2' : 'pb-4'
        }`}
      >
  {/* Left spacer for symmetry */}
  <div className="hidden md:block w-24" />

  {/* CENTER NAVIGATION */}
  <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-8 text-[11px] tracking-[0.18em] font-normal text-neutral-700">

          {['features', 'about', 'contact'].map((item) => {
            const isLink = item === 'about'
            const label = t(`header.${item}`, activeLocale)

            const baseClass =
              "relative hover:text-black transition-colors duration-300 after:absolute after:-bottom-2 after:left-0 after:h-[1px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"

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
  <div className="flex items-center gap-4">

          {/* WE4LEAD refined (always visible) */}
          <div className="flex items-center">
            <div className="relative h-4 w-16 md:h-4 md:w-16">
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
                aria-expanded={profileMenuOpen}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
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

                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                  {displayedUserName || displayedUserEmail || ''}
                </span>

                <ChevronDown
                  size={14}
                  className={`text-gray-600 transition-transform ${
                    profileMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                  <div className="px-4 py-4 flex items-center gap-3 border-b border-gray-100">
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
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {displayedUserName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {displayedUserEmail}
                      </p>
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
          )}

          {/* FR / EN refined */}
          <button
            onClick={() =>
              setLocale(activeLocale === 'en' ? 'fr' : 'en')
            }
            className="hidden md:flex items-center px-3 py-1 text-[10px] tracking-[0.18em] font-medium border border-neutral-300 rounded-full text-neutral-700 hover:border-black hover:text-black transition-all duration-300"
            aria-label={activeLocale === 'en' ? 'Switch to French' : 'Passer en anglais'}
          >
            <Globe size={12} className="mr-2 opacity-70" />
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

  {/* Bottom Hairline Separator removed per request (no border under header) */}

    </div>
  </header>
)
}