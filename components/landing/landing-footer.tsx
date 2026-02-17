"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react'
import { t, Locale } from '../../lib/i18n'
import { useLanguage } from '@/contexts/LanguageContext'

export default function LandingFooter({ locale }: { locale?: Locale }) {
  const { locale: ctxLocale, setLocale } = useLanguage()
  const usedLocale = locale ?? ctxLocale
  return (
    <footer id="footer" className="bg-white border-t border-gray-200 text-gray-600">
      {/* Main Footer */}
       {/* ================= MAIN FOOTER ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">

          {/* BRAND */}
          <div className="lg:col-span-2 space-y-4">

            <h3 className="text-xl font-bold text-gray-900">{t('footer.brand', usedLocale)}</h3>

            <p className="text-sm text-blue-600">{t('footer.university', usedLocale)}</p>

            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">{t('footer.projectDesc', usedLocale)}</p>

            {/* Languages */}
            <div className="flex gap-4 text-sm text-gray-500 pt-2">
              <button onClick={() => setLocale('fr')} className="cursor-pointer hover:text-blue-600">Fr</button>
              <span>|</span>
              <button onClick={() => setLocale('en')} className="cursor-pointer hover:text-blue-600">En</button>

            </div>

          </div>


          {/* PROJECT */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">
              <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer">{t('footer.projectTitle', usedLocale)}</Link>
            </h4>

            <ul className="space-y-2 text-sm text-gray-500">

              <li>
                <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span>{t('footer.context', usedLocale)}</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

              <li>
                <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span>{t('footer.objectives', usedLocale)}</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

              <li>
                <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span>{t('footer.activities', usedLocale)}</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

              <li>
                <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span>{t('footer.partners', usedLocale)}</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

            </ul>
          </div>


          {/* NAVIGATION */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">
              <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer">{t('footer.navigation', usedLocale)}</Link>
            </h4>

            <ul className="space-y-2 text-sm text-gray-500">

              <li>
                <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span>{t('footer.home', usedLocale)}</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

              <li>
                <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span>{t('footer.context', usedLocale)}</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

              <li>
                <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span>{t('footer.partners', usedLocale)}</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

              <li>
                <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span>{t('footer.contact', usedLocale)}</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

            </ul>
          </div>


          {/* CONTACT INFO (TEXT ONLY) */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">{t('footer.contact', usedLocale)}</h4>

            <div className="space-y-2 text-sm text-gray-500">

              <p>{t('footer.university', usedLocale)}</p>

              <p>{t('footer.addressLine1', usedLocale)}</p>

              <p>{t('footer.email', usedLocale)}</p>

              <p>{t('footer.phone', usedLocale)}</p>

            </div>
          </div>


{/* BIG MAP ONLY */}
<div className="flex items-center">

  <div className="w-full h-44 md:h-52 rounded-md overflow-hidden border border-gray-200 shadow-sm">

    <iframe
      title="Université de Sousse Map"
      className="w-full h-full border-0"
      src="https://maps.google.com/maps?q=Université%20de%20Sousse&t=&z=13&ie=UTF8&iwloc=&output=embed"
      loading="lazy"
    />

  </div>

</div>

        </div>

      </div>


      {/* Bottom Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-2 sm:px-6 lg:px-4 py-2 sm:py-4">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 sm:py-2.5 flex flex-col md:flex-row items-center md:justify-between gap-1 text-center">

    <p className="text-xs sm:text-sm text-gray-600 tracking-normal leading-tight break-words md:text-left">
      {t('footer.copyright', usedLocale, { year: new Date().getFullYear() })}
    </p>

    <div className="text-xs sm:text-sm text-gray-600 tracking-normal leading-tight mt-1 md:mt-0 break-words md:text-right flex items-center justify-center md:justify-end gap-2">
      <span>{t('footer.coFunding', usedLocale)}</span>
      <Image
        src="/Flag-European-Union.webp"
        alt="European Union flag"
        width={24}
        height={16}
        className="rounded-sm shadow-sm object-contain"
      />
    </div>

  </div>
      </div>
    </footer>
  );
}
