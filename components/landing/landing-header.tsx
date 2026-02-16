/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter, usePathname } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog';
import { Menu, X, LogOut, Settings, User, Moon, Sun, Globe } from 'lucide-react';
import { t, Locale, defaultLocale } from '../../lib/i18n'
import { useLanguage } from '@/contexts/LanguageContext'

interface LandingHeaderProps {
  isAuthenticated?: boolean;
  userEmail?: string;
  userImage?: string;
  userName?: string;
  locale?: Locale;
}

export default function LandingHeader({
  isAuthenticated = false,
  userEmail,
  userImage,
  userName,
  locale,
}: LandingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { locale: ctxLocale, setLocale } = useLanguage()
  const activeLocale = locale ?? ctxLocale

  // helper functions to open/close auth dialogs — header remains the source of truth
  const openLogin = () => setLoginOpen(true);
  const openSignup = () => setSignupOpen(true);
  const closeLogin = () => setLoginOpen(false);
  const closeSignup = () => setSignupOpen(false);

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

  // Listen to global events so other components can trigger the header's auth modals
  useEffect(() => {
    const handleOpenLogin = () => setLoginOpen(true);
    const handleOpenSignup = () => setSignupOpen(true);

    window.addEventListener('open-login', handleOpenLogin);
    window.addEventListener('open-signup', handleOpenSignup);

    return () => {
      window.removeEventListener('open-login', handleOpenLogin);
      window.removeEventListener('open-signup', handleOpenSignup);
    };
  }, []);

  // Sync tokens & fetch backend user profile
  const syncWithBackend = async (supabaseUser: any) => {
    const accessToken = (await supabase.auth.getSession())?.data.session?.access_token;
    if (!accessToken) return;

    localStorage.setItem('supabaseAccessToken', accessToken);

    try {
      const res = await fetch(`${backendUrl}/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) throw new Error('Backend /me failed');

      const backendUser = await res.json();
      localStorage.setItem('user', JSON.stringify(backendUser));
      localStorage.setItem('userId', backendUser.id);
      localStorage.setItem('userRole', backendUser.role);
      if (backendUser.universite?.id) {
        localStorage.setItem('universityId', backendUser.universite.id.toString());
      } else {
        localStorage.removeItem('universityId');
      }
    } catch (err) {
      console.error('Backend sync error:', err);
    }
  };

  // Listen to auth state changes and sync with backend (keeps logic same as example)
  useEffect(() => {
    // Initial check
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoadingAuth(false);
      if (user) syncWithBackend(user);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await syncWithBackend(session.user);
      } else {
        // Logged out
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
      }
      setLoadingAuth(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Auto-refresh token logic
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) return;

      const { access_token } = data.session;
      localStorage.setItem('supabaseAccessToken', access_token);
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // ── LOGIN ───────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    const form = e.currentTarget as HTMLFormElement & { email: HTMLInputElement; password: HTMLInputElement };
    const email = form.email.value.trim();
    const password = form.password.value;

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      setLoginOpen(false);
      router.refresh();
    } catch (err: any) {
      setLoginError(err.message || 'Échec de connexion');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── SIGNUP ──────────────────────────────────────────────────────
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignupError(null);
    setIsSubmitting(true);

    const form = e.currentTarget as HTMLFormElement & { email: HTMLInputElement; password: HTMLInputElement; fullName: HTMLInputElement };
    const email = form.email.value.trim();
    const password = form.password.value;
    const fullName = form.fullName.value.trim();

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/verify`,
        },
      });

      if (error) throw error;

      alert('Email de confirmation envoyé. Vérifiez votre boîte de réception.');
      setSignupOpen(false);
    } catch (err: any) {
      setSignupError(err.message || 'Échec de l\u2019inscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── LOGOUT ──────────────────────────────────────────────────────
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    setUser(null);
    router.refresh();
  };

  // prevent linter "assigned but never used" for auth debug state (we keep for future use)
  void user;
  void loadingAuth;

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
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {userImage ? (
                      <Image
                        src={userImage}
                        alt={userName || 'User'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User size={16} className="text-gray-600" />
                    )}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium text-gray-700">
                    {userName || 'User'}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">{userName || 'User'}</p>
                      <p className="text-xs text-gray-600 truncate">{userEmail}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <User size={16} />
                      {t('header.profile.profile', activeLocale)}
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <Settings size={16} />
                      {t('header.profile.settings', activeLocale)}
                    </Link>
                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        // Add logout logic here
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      <LogOut size={16} />
                      {t('header.profile.logout', activeLocale)}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={openLogin}
                  className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  {t('header.signIn', activeLocale)}
                </button>
                <button
                  onClick={openSignup}
                  className="px-4 py-2 bg-[#020E68] text-white rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors"
                >
                  {t('header.getStarted', activeLocale)}
                </button>
              </div>
            )}

            {/* Compact Theme & Language Controls (moved into auth area) */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setLocale(activeLocale === 'en' ? 'fr' : 'en')}
                className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
                title="Toggle language"
              >
                <Globe size={14} />
                <span className="hidden sm:inline">{activeLocale === 'en' ? 'EN' : 'FR'}</span>
              </button>

              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors text-gray-700"
                title="Toggle theme"
              >
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-gray-900" />
              ) : (
                <Menu size={24} className="text-gray-900" />
              )}
            </button>
          </div>
        </div>

        {/* Signup Modal */}
        <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
          <DialogContent className="max-w-md">
                <DialogHeader>
              <DialogTitle>{t('header.signup.title', activeLocale)}</DialogTitle>
              <DialogDescription>{t('header.signup.desc', activeLocale)}</DialogDescription>
            </DialogHeader>

            {signupError && (
              <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{signupError}</div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-600 mb-1">{t('header.signup.fullName', activeLocale)}</label>
                <input name="fullName" required className="w-full border rounded px-3 py-2" placeholder="Amira Ben Salem" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">{t('header.signup.email', activeLocale)}</label>
                <input name="email" type="email" required className="w-full border rounded px-3 py-2" placeholder="votre@email.tn" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">{t('header.signup.password', activeLocale)}</label>
                <input name="password" type="password" required minLength={6} className="w-full border rounded px-3 py-2" />
              </div>

              <DialogFooter>
                <button type="button" onClick={closeSignup} className="px-4 py-2 border rounded" disabled={isSubmitting}>
                  {t('header.signup.cancel', activeLocale)}
                </button>
                <button type="submit" className="px-5 py-2 bg-[#020E68] text-white rounded" disabled={isSubmitting}>
                  {isSubmitting ? t('header.signup.submitting', activeLocale) : t('header.signup.submit', activeLocale)}
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Login Modal */}
        <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
          <DialogContent className="max-w-md">
                <DialogHeader>
              <DialogTitle>{t('header.login.title', activeLocale)}</DialogTitle>
              <DialogDescription>{t('header.login.desc', activeLocale)}</DialogDescription>
            </DialogHeader>

            {loginError && (
              <div className="bg-red-50 text-red-700 p-3 rounded text-sm">{loginError}</div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-600 mb-1">{t('header.login.email', activeLocale) ?? 'Email'}</label>
                <input name="email" type="email" required className="w-full border rounded px-3 py-2" placeholder="votre@email.tn" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">{t('header.login.password', activeLocale)}</label>
                <input name="password" type="password" required className="w-full border rounded px-3 py-2" />
              </div>

              <DialogFooter>
                <button type="button" onClick={closeLogin} className="px-4 py-2 border rounded" disabled={isSubmitting}>
                  {t('header.login.cancel', activeLocale)}
                </button>
                <button type="submit" className="px-5 py-2 bg-[#020E68] text-white rounded" disabled={isSubmitting}>
                  {isSubmitting ? t('header.login.submitting', activeLocale) : t('header.login.submit', activeLocale)}
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-200">
            {/* Mobile Theme & Language Controls */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
              <button
                onClick={() => setLocale(activeLocale === 'en' ? 'fr' : 'en')}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
              >
                <Globe size={16} />
                <span>{activeLocale === 'en' ? 'EN' : 'FR'}</span>
              </button>

              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="flex-1 flex items-center justify-center p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
              >
                {theme === 'light' ? (
                  <>
                    <Moon size={16} />
                    <span className="text-xs ml-1">Dark</span>
                  </>
                ) : (
                  <>
                    <Sun size={16} />
                    <span className="text-xs ml-1">Light</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => scrollToSection('features')}
              className="w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium hover:bg-gray-50"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('institutions')}
              className="w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium hover:bg-gray-50"
            >
              Institutions
            </button>

            <Link
              href="/about"
              className="w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium hover:bg-gray-50"
            >
              Apropos
            </Link>

            <button
              onClick={() => scrollToSection('footer')}
              className="w-full text-left px-4 py-2 text-gray-600 hover:text-gray-900 text-sm font-medium hover:bg-gray-50"
            >
              Contact
            </button>
            {!isAuthenticated && (
              <div className="flex flex-col gap-2 px-4 pt-4 border-t border-gray-200">
                <button
                  onClick={openLogin}
                  className="text-center py-2 text-gray-600 hover:text-gray-900 text-sm font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={openSignup}
                  className="text-center py-2 bg-[#020E68] text-white rounded-lg text-sm font-medium hover:bg-blue-900"
                >
                  Get Started
                </button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
