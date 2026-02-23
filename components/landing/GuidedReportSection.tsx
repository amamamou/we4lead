"use client"

import { Button } from "@/components/ui/button";
import { t } from '@/lib/i18n'
import { useLanguage } from '@/contexts/LanguageContext'

export default function USDBlooomSection() {
  const { locale } = useLanguage()
  return (
    <div className="w-full bg-white">
      {/* Main Section */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Header and Description */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
          {/* Left Column */}
          <div className="flex flex-col justify-start">
            <h1 className="font-sans text-4xl font-bold text-gray-900 mb-6">
              {t('hero.howItWorks', locale)}
            </h1>
          </div>

          {/* Right Column */}
          <div className="flex items-start">
            <p className="font-sans text-gray-600 text-base leading-relaxed">
              {t('guidedReport.description', locale)}
            </p>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left Card - Light Purple */}
          <div className=" rounded-2xl p-8 flex flex-col">
            <div className="mb-6 h-48 flex items-center justify-center" aria-hidden="true">
              {/* image removed to preserve spacing and placement */}
            </div>
            <h3 className="font-sans text-xl font-bold text-gray-900 mb-4">
              {t('guidedReport.safeProcess.title', locale)}
            </h3>
            <p className="font-sans text-sm text-gray-700 leading-relaxed">
              {t('guidedReport.safeProcess.desc', locale)}
            </p>
          </div>

          {/* Middle Card - Dark Navy */}
          <div className="bg-[#F9FAFB] rounded-2xl p-8 flex flex-col h-full justify-between text-gray-700">
            <h3 className="font-sans text-xl font-bold mb-4">
              {t('guidedReport.step1.title', locale)}
            </h3>
            <p className="font-sans text-sm leading-relaxed">
              {t('guidedReport.step1.description', locale)}
            </p>
          </div>

          {/* Right Card - Dark Navy */}
          <div className="bg-[#F9FAFB] rounded-2xl p-8 flex flex-col h-full justify-between text-gray-700">
            <h3 className="font-sans text-xl font-bold mb-4">
              {t('guidedReport.step2.title', locale)}
            </h3>
            <p className="font-sans text-sm leading-relaxed">
              {t('guidedReport.step2.description', locale)}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
