"use client";

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { t, Locale } from '../../lib/i18n'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LandingCTA({ locale }: { locale?: Locale }) {
  const { locale: ctxLocale } = useLanguage()
  const usedLocale = locale ?? ctxLocale
  return (
    <section className="py-16  ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-hero-gradient rounded-lg p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-light leading-tight">
                {t('cta.title', usedLocale)}
              </h2>
              <p className="text-sm text-blue-100">
                {t('cta.description', usedLocale)}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <button
                onClick={() => {
                  const el = document.getElementById('psychotherapists')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="group inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-[#020E68] rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                aria-label={t('cta.getStarted', usedLocale)}
              >
                {t('cta.getStarted', usedLocale)}
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white/10 text-white border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
              >
                {t('cta.learnMore', usedLocale)}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
