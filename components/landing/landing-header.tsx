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
    className={`sticky top-0 z-50 ${
      scrolled
        ? 'bg-background/95 backdrop-blur-sm border-b border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
        : 'bg-background border-b border-transparent'
    }`}
  >
    <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-8">

      {/* ───────────── LOGO ROW ───────────── */}
      <div
        className={`flex justify-center items-center overflow-hidden transition-all duration-500 ${
          hideOnScroll
            ? 'max-h-0 opacity-0'
            : scrolled
            ? 'max-h-28 pt-3 pb-2 opacity-100'
            : 'max-h-40 pt-6 pb-3 opacity-100'
        }`}
      >
        <Link href="/" className="group">
          <div
            className={`relative transition-all duration-500 ${
              scrolled
                ? 'h-12 w-56 md:h-14 md:w-64'
                : 'h-20 w-72 md:h-24 md:w-80'
            }`}
            aria-label="Université de Sousse"
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

      {/* Subtle Separator Between Logo & Nav */}

      {/* ───────────── NAV ROW ───────────── */}
      <div
        className={`relative flex items-center justify-between transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
  {/* Left spacer for symmetry */}
  <div className="hidden md:block w-24" />

  {/* CENTER NAVIGATION */}
  <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center gap-12 text-sm tracking-normal font-medium text-foreground/80">

          {['features', 'about', 'contact'].map((item) => {
            const isLink = item === 'about'
            const label = t(`header.${item}`, activeLocale)

            const baseClass =
              "relative hover:text-foreground transition-colors duration-300 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"

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
  <div className="flex items-center gap-4 ml-auto">

         
          {/* AUTH */}
          {authIsAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                aria-expanded={profileMenuOpen}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="hidden sm:flex relative h-8 w-8 rounded-md overflow-hidden bg-secondary items-center justify-center">
                  {displayedUserImage ? (
                    <Image
                      src={displayedUserImage}
                      alt={displayedUserName || 'User'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User size={16} className="text-foreground/50" />
                  )}
                </div>

                <span className="hidden sm:inline text-sm font-light text-foreground/70">
                  {displayedUserName || displayedUserEmail || ''}
                </span>

                <ChevronDown
                  size={14}
                  className={`text-foreground/50 transition-transform ${
                    profileMenuOpen ? 'rotate-180' : ''
                  } hidden md:inline`}
                />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-background rounded-lg shadow-lg border border-border overflow-hidden z-50">
                  <div className="px-4 py-4 flex items-center gap-3 border-b border-border/50">
                    <div className="h-10 w-10 rounded-full bg-secondary overflow-hidden flex items-center justify-center">
                      {displayedUserImage ? (
                        <Image
                          src={displayedUserImage}
                          alt={displayedUserName || 'User'}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <User size={20} className="text-foreground/50" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {displayedUserName || 'User'}
                      </p>
                      <p className="text-xs text-foreground/60 truncate font-light">
                        {displayedUserEmail}
                      </p>
                    </div>
                  </div>

                  <div className="py-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/70 hover:bg-secondary transition-colors font-light"
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
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 border-t border-border/50 transition-colors font-light"
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
            className="hidden md:flex items-center px-3 py-1.5 text-sm tracking-normal font-medium border-border rounded-full text-foreground/80 hover:border-primary hover:text-foreground transition-all duration-300"
            aria-label={activeLocale === 'en' ? 'Switch to French' : 'Passer en anglais'}
          >
            <Globe size={12} className="mr-2 text-foreground/80" />
            {activeLocale === 'en' ? 'EN' : 'FR'}
          </button>

          {/* MOBILE */}
          <div className="relative md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
              aria-expanded={mobileMenuOpen}
              aria-label="Open mobile menu"
            >
              <MoreHorizontal size={22} />
            </button>

            {mobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-background rounded-lg shadow-lg border border-border overflow-hidden z-50">
                <div className="py-2">
                  {/* Navigation links */}
                  {['features', 'about', 'contact'].map((item) => {
                    const isLink = item === 'about'
                    const label = t(`header.${item}`, activeLocale)

                    if (isLink) {
                      return (
                        <Link
                          key={item}
                          href="/about"
                          className="block px-4 py-3 text-sm text-foreground/80 hover:bg-secondary"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {label}
                        </Link>
                      )
                    }

                    return (
                      <button
                        key={item}
                        onClick={() => {
                          scrollToSection(item === 'contact' ? 'footer' : item)
                          setMobileMenuOpen(false)
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-foreground/80 hover:bg-secondary"
                      >
                        {label}
                      </button>
                    )
                  })}

                  <div className="border-t border-border/50 mt-1" />

                  {/* Language toggle */}
                  <button
                    onClick={() => {
                      setLocale(activeLocale === 'en' ? 'fr' : 'en')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-foreground/80 hover:bg-secondary flex items-center"
                  >
                    <Globe size={14} className="mr-2 text-foreground/80" />
                    <span>{activeLocale === 'en' ? 'FR' : 'EN'}</span>
                  </button>

                  {/* Auth actions */}
                  {authIsAuthenticated && (
                    <>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-3 text-sm text-foreground/80 hover:bg-secondary"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {t('header.dashboard', activeLocale)}
                      </Link>

                      <button
                        onClick={() => {
                          setMobileMenuOpen(false)
                          void handleLogout()
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-destructive hover:bg-destructive/10"
                      >
                        {t('header.profile.logout', activeLocale)}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

  {/* Bottom Hairline Separator removed per request (no border under header) */}

    </div>
  </header>
)
}