"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react'
import { t, Locale } from '../../lib/i18n'
import { useLanguage } from '@/contexts/LanguageContext'

export default function Footer({ locale }: { locale?: Locale }) {
  const { locale: ctxLocale, setLocale } = useLanguage()
  const usedLocale = locale ?? ctxLocale
  return (
    <footer id="footer" className="bg-background border-t border-border text-foreground/60">
      {/* Main Footer */}
       {/* ================= MAIN FOOTER ================= */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16 md:py-20">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">

          {/* BRAND */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-semibold text-foreground">{t('footer.brand', usedLocale)}</h3>

            <p className="text-sm text-primary">{t('footer.university', usedLocale)}</p>

            <p className="text-sm text-foreground/60 leading-relaxed max-w-sm font-light">{t('footer.projectDesc', usedLocale)}</p>

            {/* Languages */}
            <div className="flex gap-4 text-sm font-light pt-2">
              <button onClick={() => setLocale('fr')} className="cursor-pointer hover:text-foreground transition-colors">Fr</button>
              <span className="text-foreground/30">|</span>
              <button onClick={() => setLocale('en')} className="cursor-pointer hover:text-foreground transition-colors">En</button>
            </div>
          </div>


          {/* PROJECT */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5">
              <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer">{t('footer.projectTitle', usedLocale)}</Link>
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-light">
                  <span>{t('footer.context', usedLocale)}</span>
                  <ArrowUpRight className="w-3 h-3 text-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

              <li>
                <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-light">
                  <span>{t('footer.objectives', usedLocale)}</span>
                  <ArrowUpRight className="w-3 h-3 text-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

              <li>
                <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-light">
                  <span>{t('footer.activities', usedLocale)}</span>
                  <ArrowUpRight className="w-3 h-3 text-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

              <li>
                <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-light">
                  <span>{t('footer.partners', usedLocale)}</span>
                  <ArrowUpRight className="w-3 h-3 text-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>


          {/* NAVIGATION */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5">
              <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer">{t('footer.navigation', usedLocale)}</Link>
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-light">
                  <span>{t('footer.home', usedLocale)}</span>
                  <ArrowUpRight className="w-3 h-3 text-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

              <li>
                <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-light">
                  <span>{t('footer.context', usedLocale)}</span>
                  <ArrowUpRight className="w-3 h-3 text-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

              <li>
                <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-light">
                  <span>{t('footer.partners', usedLocale)}</span>
                  <ArrowUpRight className="w-3 h-3 text-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

              <li>
                <Link href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-light">
                  <span>{t('footer.contact', usedLocale)}</span>
                  <ArrowUpRight className="w-3 h-3 text-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>


          {/* CONTACT INFO (TEXT ONLY) */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-5">{t('footer.contact', usedLocale)}</h4>

            <div className="space-y-2.5 text-sm text-foreground/60 font-light">
              <p>{t('footer.university', usedLocale)}</p>
              <p>{t('footer.addressLine1', usedLocale)}</p>
              <p>{t('footer.email', usedLocale)}</p>
              <p>{t('footer.phone', usedLocale)}</p>
            </div>
          </div>


{/* BIG MAP ONLY */}
<div className="flex items-center">
  <div className="w-full h-48 md:h-56 rounded-lg overflow-hidden border border-border shadow-sm hover-lift transition-all">
    <iframe
      title="Université de Sousse Map"
      className="w-full h-full border-0"
      src="https://maps.google.com/maps?q=Université%20de%20Sousse&t=&z=10&ie=UTF8&iwloc=&output=embed"
      loading="lazy"
    />
  </div>
</div>

        </div>

      </div>


      {/* Bottom Footer */}
      <div className="border-t border-border bg-secondary/20 px-6 md:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:justify-between gap-4 text-center">
          <p className="text-xs text-foreground/60 tracking-wide leading-tight font-light md:text-left">
            {t('footer.copyright', usedLocale, { year: new Date().getFullYear() })}
          </p>

          <div className="text-xs text-foreground/60 tracking-wide leading-tight font-light flex items-center justify-center md:justify-end gap-2">
            <span>{t('footer.coFunding', usedLocale)}</span>
            <Image
              src="/Flag-European-Union.webp"
              alt={t('partners.eu.alt', usedLocale)}
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
