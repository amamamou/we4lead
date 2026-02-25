"use client"

import { Button } from "@/components/ui/button";
import { t } from '@/lib/i18n'
import { useLanguage } from '@/contexts/LanguageContext'

export default function USDBlooomSection() {
  const { locale } = useLanguage()
  return (
    <div className="w-full bg-white">
      {/* Main Section */}
  <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
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
  <div className="mx-auto max-w-7xl px-6 pb-12 md:pb-16">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Left Card - Light Purple */}
          <div className="relative rounded-2xl p-8 flex flex-col overflow-hidden">
            {/* faint background photo (decorative) */}
            <div
              aria-hidden="true"
              className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
              
            />

            <div className="relative z-10 mb-6 hidden md:flex md:h-48 items-center justify-center" aria-hidden="true">
              {/* decorative placeholder visible only on md+ to avoid mobile blank space */}
            </div>
            <h3 className="font-sans text-xl font-bold text-gray-900 mb-4 relative z-10">
              {t('guidedReport.safeProcess.title', locale)}
            </h3>
            <p className="font-sans text-sm text-gray-700 leading-relaxed relative z-10">
              {t('guidedReport.safeProcess.desc', locale)}
            </p>
          </div>

          {/* Middle Card - Report a situation (same bg as CTA) */}
          <div className="relative group bg-[#020E68] rounded-2xl p-8 flex flex-col h-full justify-between text-white overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-sans text-xl font-bold mb-4 transition-colors duration-150">
                Report a situation
              </h3>
              <p className="font-sans text-sm leading-relaxed text-blue-100">
                Fill our secure form with the details of your situation in complete confidentiality.
              </p>
            </div>
          </div>

          {/* Right Card - Be contacted (same bg as CTA) */}
          <div className="relative group bg-[#020E68] rounded-2xl p-8 flex flex-col h-full justify-between text-white overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-sans text-xl font-bold mb-4 transition-colors duration-150">
                Be contacted
              </h3>
              <p className="font-sans text-sm leading-relaxed text-blue-100">
                Our team will review your case and reach out within 24-48 hours to confirm an appointment.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
