"use client";

import { Search, Calendar, Shield, Award } from 'lucide-react';
import { t, Locale } from '../../lib/i18n'
import { useLanguage } from '@/contexts/LanguageContext'

const featureKeys = [
  { icon: Search, titleKey: 'features.smartDiscovery.title', descKey: 'features.smartDiscovery.description' },
  { icon: Calendar, titleKey: 'features.easyScheduling.title', descKey: 'features.easyScheduling.description' },
  { icon: Shield, titleKey: 'features.secure.title', descKey: 'features.secure.description' },
  { icon: Award, titleKey: 'features.verified.title', descKey: 'features.verified.description' },
]

export default function LandingFeatures({ locale }: { locale?: Locale }) {
  const { locale: ctxLocale } = useLanguage()
  const usedLocale = locale ?? ctxLocale
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-light text-gray-900 mb-2">{t('features.title', usedLocale)}</h2>
          <p className="text-sm text-gray-600">{t('features.description', usedLocale)}</p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureKeys.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group p-5 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 transition"
              >
                <div className="mb-3 w-8 h-8 text-gray-700 group-hover:text-gray-900">
                  <Icon size={20} />
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  {t(feature.titleKey, usedLocale)}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {t(feature.descKey, usedLocale)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
