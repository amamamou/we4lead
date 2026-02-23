'use client';

import React from 'react';
import Image from 'next/image';
import { t } from '../../lib/i18n'
import { useLanguage } from '@/contexts/LanguageContext'

const partnersData = [
  {
    name: 'Aix-Marseille University',
    country: 'France',
    website: 'www.univ-amu.fr',
    logo: '/logos/aix_marseille.png'
  },
  {
    name: 'Lebanese University',
    country: 'Lebanon',
    website: 'www.ul.edu.lb',
    logo: '/logos/universite_libanaise.jpg'
  },
  {
    name: 'Antonine University',
    country: 'Lebanon',
    website: 'www.ua.edu.lb',
    logo: '/logos/R.jpg'

  },
  {
    name: 'Sapienza Università di Roma',
    country: 'Italy',
    website: 'www.uniroma1.it',
    logo: '/logos/sapienza-big.png'
  },
  {
    name: 'University of Constantine 3',
    country: 'Algeria',
    website: 'univ-constantine3.dz',
    logo: '/logos/University of Constantine 3 - Salah Boubnider.png'
  },
  {
    name: 'RESUFF',
    country: 'Network',
    website: 'www.resuff.org',
    logo: '/logos/Réseau francophone des femmes responsables dans l’enseignement supérieur et la recherche.webp'
  },
  {
    name: 'University of Sousse',
    country: 'Tunisia',
    website: 'www.uso.rnu.tn',
    logo: '/logos/universitedesousse.png'

  },
  {
    name: 'University of Tunis El Manar',
    country: 'Tunisia',
    website: 'www.utm.rnu.tn',
    logo: '/logos/utm-header.png'
  },
  {
    name: 'Universidad Autónoma de Madrid',
    country: 'Spain',
    website: 'www.uam.es',
    logo: '/logos/UniversidadAutonomade Madrid.svg'
  },
  {
    name: 'University Frères Mentouri Constantine 1',
    country: 'Algeria',
    website: 'www.umc.edu.dz',
    logo: '/logos/universidad_des_freres_mentouri_constantine_0.jpg'
  }
];

export default function PartnersSection() {
  const { locale: ctxLocale } = useLanguage()
  const usedLocale = ctxLocale
  const getInitials = (name: string) =>
    name
      .split(/\s+/)
      .map((w) => w[0] ?? '')
      .join('')
      .slice(0, 3)
      .toUpperCase();

  return (
    <section id="partners" className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two-column grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Text Content */}
          <div className="flex flex-col justify-start space-y-6 items-center md:items-start">
            {/* Main Header */}
            <div className="space-y-4">
              <h2 className="text-4xl md:text-4xl font-light text-gray-900 leading-tight text-center md:text-left">
                {t('partners.heading', usedLocale)}
              </h2>
            </div>

            {/* Content Sections */}
            <div className="space-y-5">
              {/* Funded By */}
              <div className="space-y-2 flex items-center justify-center gap-3 md:items-start">

                <div className="space-y-2 text-center md:text-left">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {t('partners.fundedBy', usedLocale)}
                  </p>
                  <div className="flex items-center gap-2 justify-center">
                    <Image
                      src="/Flag-European-Union.webp"
                      alt={t('partners.eu.alt', usedLocale)}
                      width={24}
                      height={16}
                      className="rounded-sm shadow-sm object-contain"
                    />
                    <p className="text-sm text-gray-700 font-light">
                      {t('partners.eu.label', usedLocale)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Animated Logo Scroll */}
          <div className="relative bg-white overflow-hidden h-44">
            
            {/* Fade overlays left and right */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent"></div>
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent"></div>
            </div>

            {/* Scrolling container */}
            <div className="absolute inset-0 overflow-hidden">
              <style>{`
                @keyframes scroll-horizontal {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-50%);
                  }
                }
                
                .scroll-track {
                  animation: scroll-horizontal 60s linear infinite;
                  display: flex;
                  /* Let the track size itself to its content so the duplicated
                     set lines up exactly; children use flex-shrink-0 so they
                     don't collapse. */
                  width: max-content;
                }
                
                .scroll-track:hover {
                  animation-play-state: paused;
                }
              `}</style>

              <div className="scroll-track">
                {/* First loop */}
                {partnersData.map((partner, index) => {
                  const isUAM = partner.name === 'Universidad Autónoma de Madrid';
                  return (
                    <a
                      key={`first-${index}`}
                      href={`https://${partner.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-8 flex-shrink-0 group hover:opacity-70 transition-opacity duration-300"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`${isUAM ? 'w-36 h-36' : 'w-28 h-28'} bg-white rounded-lg flex items-center justify-center overflow-hidden transition-colors duration-300`}>
                          {partner.logo ? (
                            <Image
                              src={partner.logo}
                              alt={partner.name}
                              width={isUAM ? 144 : 112}
                              height={isUAM ? 144 : 112}
                              className="object-contain w-full h-full p-3"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gray-50 text-gray-600">
                              <span className="text-sm font-medium">{getInitials(partner.name)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  );
                })}

                {/* Second loop for seamless infinite scroll */}
                {partnersData.map((partner, index) => {
                  const isUAM = partner.name === 'Universidad Autónoma de Madrid';
                  return (
                    <a
                      key={`second-${index}`}
                      href={`https://${partner.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center px-8 flex-shrink-0 group hover:opacity-70 transition-opacity duration-300"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`${isUAM ? 'w-36 h-36' : 'w-28 h-28'} bg-white rounded-lg flex items-center justify-center overflow-hidden transition-colors duration-300`}>
                          {partner.logo ? (
                            <Image
                              src={partner.logo}
                              alt={partner.name}
                              width={isUAM ? 144 : 112}
                              height={isUAM ? 144 : 112}
                              className="object-contain w-full h-full p-3"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gray-50 text-gray-600">
                              <span className="text-sm font-medium">{getInitials(partner.name)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
