
"use client";

import { useRouter } from 'next/navigation';
import AuthForm from '@/components/auth/auth-form';
import AuthSidebar from '@/components/auth/auth-sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { locale: ctxLocale, setLocale } = useLanguage();
  const activeLocale = ctxLocale;

  return (
    <div className="min-h-screen text-white ">
      <div className="flex min-h-screen">

        {/* LEFT SIDE */}
        <AuthSidebar />

        {/* RIGHT SIDE */}
        <div className="relative w-full max-w-[720px] xl:max-w-[780px] 2xl:max-w-[860px]  xl:px-16 flex items-center justify-center">

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
          <div className="w-full rounded-2xl relative px-12 py-14 xl:px-16 xl:py-16  border-neutral-200">
            <AuthForm mode="signup" onSuccess={() => void router.push('/')} />
          </div>

        </div>

      </div>
    </div>
  );
}
