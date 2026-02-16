
"use client";

import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/auth-form';
import AuthSidebar from '@/components/auth/auth-sidebar';
import LandingHeader from '@/components/landing/landing-header';
import LandingFooter from '@/components/landing/landing-footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { locale: ctxLocale, setLocale } = useLanguage();
  const activeLocale = ctxLocale;

  return (
    <div className="min-h-screen text-white ">
      {/* Mobile-only landing header */}
      <div className="lg:hidden">
        <LandingHeader />
      </div>
      <div className="flex min-h-screen">

        {/* LEFT SIDE */}
        <AuthSidebar />

        {/* RIGHT SIDE */}
  <div className="relative w-full max-w-[720px] xl:max-w-[780px] 2xl:max-w-[860px] px-4 sm:px-6 xl:px-16 flex items-center justify-center">

          {/* LANGUAGE SWITCHER — PUT IT HERE */}
          <div className="hidden sm:block absolute top-8 right-10 xl:right-16">
            <button
              onClick={() => setLocale(activeLocale === 'en' ? 'fr' : 'en')}
              className="inline-flex items-center justify-center h-8 w-8 sm:h-auto sm:w-auto gap-1 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
              title="Toggle language"
            >
              <Globe size={14} />
              <span className="hidden sm:inline">{activeLocale === 'en' ? 'EN' : 'FR'}</span>
            </button>
          </div>

          {/* CARD */}
          <div className="w-full rounded-2xl relative px-6 py-10 sm:px-8 sm:py-12 xl:px-16 xl:py-16  border-neutral-200  lg:border-0 lg:shadow-none">
            <AuthForm mode="login" onSuccess={() => void router.push('/')} />
          </div>

        </div>
      </div>

      {/* Mobile-only landing footer (moved outside horizontal flex so it stacks under the card) */}
      <div className="lg:hidden mt-6 w-full">
        <LandingFooter />
      </div>
    </div>
  );
}
