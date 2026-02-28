'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Shield, Users, Smartphone, ArrowRight } from 'lucide-react'
import { t, Locale } from '../../lib/i18n'
import { useLanguage } from '@/contexts/LanguageContext'

export default function HeroSection({ locale }: { locale?: Locale }) {
  const { locale: ctxLocale } = useLanguage()
  const usedLocale = locale ?? ctxLocale
  return (
  <section id="landing-hero" className="relative bg-hero-gradient text-white py-24 md:py-36 min-h-[70vh] md:min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* (Removed centered logo — small logo moved into badge below) */}

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 px-3 py-2 rounded-full border-white/30">
            {/* small logo left of the badge text */}
            {/* subtle off-white background to avoid a stark white block; dark-mode uses transparent/darker tone */}
            <div className="bg-slate-50 rounded-sm p-1 inline-flex items-center dark:bg-transparent">
              <Image
                src="/we4lead.png"
                alt="We4Lead"
                width={64}
                height={20}
                className="object-contain"
              />
            </div>
            {/* small status dot */}
            <div
              className="w-2 h-2 bg-white rounded-full blink-dot"
              aria-hidden="true"
            />
            <span className="text-sm font-medium text-white">{t('hero.badge', usedLocale)}</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl font-serif  md:text-5xl lg:text-6xl font-bold text-center mb-4 leading-tight">
          {t('hero.title', usedLocale)}
        </h1>

        {/* Subtitle */}
        <p className="text-center text-white/90 mb-4 max-w-2xl mx-auto text-base md:text-lg font-medium">
          {t('hero.subtitle', usedLocale)}
        </p>

        {/* Description */}
        <p className="text-center text-white/90 mb-10 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          {t('hero.description', usedLocale)}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button
            onClick={() => {
              const el = document.getElementById('psychotherapists')
              if (el) el.scrollIntoView({ behavior: 'smooth' })
            }}
            className="bg-white text-primary w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 rounded-md font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-3 group"
            aria-label={t('hero.report', usedLocale)}
          >
            <span>{t('hero.report', usedLocale)}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          <Link href="/about" className="border-2 border-white text-white w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 rounded-md font-semibold hover:bg-white/10 transition text-center">
            {t('hero.howItWorks', usedLocale)}
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('hero.card.confidential', usedLocale)}</h3>
            <p className="text-white/80 text-sm">
              {t('features.secure.description', usedLocale)}
            </p>
          </div>

          {/* Card 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('hero.card.experts', usedLocale)}</h3>
            <p className="text-white/80 text-sm">
              {t('features.verified.description', usedLocale)}
            </p>
          </div>

          {/* Card 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t('hero.card.accessible', usedLocale)}</h3>
            <p className="text-white/80 text-sm">
        {t('features.easyScheduling.description', usedLocale)}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
