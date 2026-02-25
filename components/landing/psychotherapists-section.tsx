"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Locale, t } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
// Flag icon removed per request
import ReportModal from '@/components/landing/report-modal';

interface Therapist {
  id: string;
  name: string;
  title: string;
  title_en?: string;
  specialties: string[];
  specialties_en?: string[];
  availability: string;
  availability_en?: string;
  email: string;
  phone: string;
  image?: string;
}

const therapists: Therapist[] = [
  {
    id: "ea1c7f8d-32ae-4884-9d23-8ec73696220c", 
    name: 'Mme Imen BELGACEM',
    title: 'Psychologue clinicienne',
    title_en: 'Clinical Psychologist',
    specialties: ['Harcèlement moral', 'Stress et anxiété', 'Soutien psychologique'],
    specialties_en: ['Workplace harassment', 'Stress & anxiety', 'Psychological support'],
    availability: 'Lundi - Mercredi - Vendredi',
    availability_en: 'Monday - Wednesday - Friday',
    email: 'ksontiniahmed369@gmail.com',
    phone: '+216 XX XXX XXX',
    image: '/hii.jpg'
  },
  {
    id: "8ae31fc6-30d0-4a2a-bded-bb4d8038e01d",
    name: 'Mme Nadia BOUSSAFA',
    title: 'Psychologue clinicienne',
    title_en: 'Clinical Psychologist',
    specialties: ['Harcèlement sexuel', 'Traumatismes', 'Accompagnement thérapeutique'],
    specialties_en: ['Sexual harassment', 'Trauma', 'Therapeutic support'],
    availability: 'Mardi - Jeudi - Samedi',
    availability_en: 'Tuesday - Thursday - Saturday',
    email: 'nadia.boussafa@uss.tn',
    phone: '+216 XX XXX XXX',
    image: '/hi2.jpg'
  }
];

const institutions = [
  'Facultés - Médecine',
  'Facultés - Droit et Sciences Politiques',
  'Facultés - Lettres et Sciences Humaines',
  'Facultés - Sciences Economiques et Gestion',
  'Instituts - Hautes Etudes Commerciales',
  'Instituts - Finance et Fiscalité',
  'Instituts - Beaux-Arts',
  'Instituts - Supérieur De Gestion',
  'Instituts - Informatique et Communication',
  'Instituts - Musique',
  'Instituts - Sciences Appliquées et Technologie',
  'Instituts - Transport et Logistique',
  'Instituts - Agronomique de Chott-Mariem',
  'Instituts - Sciences Infirmières',
  'Ecoles - Nationale des ingénieurs',
  'Ecoles - Sciences et Technologie de Hammam Sousse',
  'Ecoles - Sciences et Techniques de la Santé'
];

const institutions_en = [
  'Faculties - Medicine',
  'Faculties - Law & Political Science',
  'Faculties - Arts & Humanities',
  'Faculties - Economics & Management',
  'Institutes - Higher Commercial Studies',
  'Institutes - Finance & Taxation',
  'Institutes - Fine Arts',
  'Institutes - Higher School of Management',
  'Institutes - Computer Science & Communication',
  'Institutes - Music',
  'Institutes - Applied Sciences & Technology',
  'Institutes - Transport & Logistics',
  'Institutes - Agronomy of Chott-Mariem',
  'Institutes - Nursing Sciences',
  "Schools - National School of Engineers",
  'Schools - Sciences & Technology of Hammam Sousse',
  'Schools - Health Sciences & Techniques'
];

export default function TherapistsSection({ locale }: { locale?: Locale }) {
  const { locale: ctxLocale } = useLanguage();
  const usedLocale = locale ?? ctxLocale;
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setIsModalOpen(true);
  };

  return (
    <>
      <section id="psychotherapists" data-locale={usedLocale} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-12">
            <span className="text-xs font-medium uppercase tracking-wide block mb-3">
              {t('psychotherapists.heading', usedLocale)}
            </span>
            <h2 className="text-4xl md:text-4xl font-light leading-tight mb-6">
              {t('psychotherapists.subtitle', usedLocale)}
            </h2>
          </div>

          {/* Therapists - Alternating Layout */}
          <div className="space-y-16">
            {therapists.map((therapist, index) => (
              <div key={index} className="w-full">
                {/* Therapist 1: Image Right, Content Left */}
                {index === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
                    {/* Content Left */}
                    <div className="order-2 md:order-1 p-4 sm:p-6">
                      {/* Name and Title */}
                      <div className="mb-4">
                        <h3 className="text-xl md:text-2xl font-medium mb-1">
                          {therapist.name}
                        </h3>
                        <p className="text-sm font-normal">
                          {usedLocale === 'en' && therapist.title_en ? therapist.title_en : therapist.title}
                        </p>
                      </div>

                      {/* Specialties removed per request */}

                      {/* Availability */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold uppercase tracking-wide mb-2">
                          {t('psychotherapists.availability', usedLocale)}
                        </p>
                        <p className="text-sm">
                          {usedLocale === 'en' && therapist.availability_en ? therapist.availability_en : therapist.availability}
                        </p>
                      </div>

                      {/* Locations */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold uppercase tracking-wide mb-2">
                          {t('psychotherapists.locations', usedLocale)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(usedLocale === 'en' ? institutions_en.slice(0, 8) : institutions.slice(0, 8)).map((inst, i) => (
                            <span
                              key={i}
                              className="text-xs px-3 py-1 rounded-md border"
                              title={inst}
                            >
                              {inst}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Report Button */}
                      <button
                        onClick={() => openModal(therapist)}
                        className="inline-flex items-center gap-2 h-9 px-3 rounded-md text-sm border"
                        aria-label={usedLocale === 'en' ? `Report a case to ${therapist.name}` : `Signaler un cas à ${therapist.name}`}
                      >
                        {/* Exclamation-in-circle icon (inherits currentColor) */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                          <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                          <path d="M12 8v4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12 16h.01" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="leading-none">{usedLocale === 'en' ? `Report a case to ${therapist.name}` : `Signaler un cas à ${therapist.name}`}</span>
                      </button>
                    </div>

                    {/* Image Right */}
                    <div className="order-1 md:order-2 relative rounded-2xl overflow-hidden h-64 md:h-96">
                      {therapist.image ? (
                        <Image
                          src={therapist.image}
                          alt={therapist.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl font-bold">
                            {therapist.name.split(' ')[0][0]}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Therapist 2: Image Left, Content Right */}
                {index === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Image Left */}
                    <div className="relative rounded-2xl overflow-hidden h-64 md:h-96">
                      {therapist.image ? (
                        <Image
                          src={therapist.image}
                          alt={therapist.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl font-bold">
                            {therapist.name.split(' ')[0][0]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Right */}
                    <div className="p-4 sm:p-6">
                      {/* Name and Title */}
                      <div className="mb-4">
                        <h3 className="text-xl md:text-2xl font-medium mb-1">
                          {therapist.name}
                        </h3>
                        <p className="text-sm font-normal">
                          {usedLocale === 'en' && therapist.title_en ? therapist.title_en : therapist.title}
                        </p>
                      </div>

                      {/* Specialties removed per request */}

                      {/* Availability */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold uppercase tracking-wide mb-2">
                          {t('psychotherapists.availability', usedLocale)}
                        </p>
                        <p className="text-sm">
                          {usedLocale === 'en' && therapist.availability_en ? therapist.availability_en : therapist.availability}
                        </p>
                      </div>

                      {/* Locations */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold uppercase tracking-wide mb-2">
                          {t('psychotherapists.locations', usedLocale)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(usedLocale === 'en' ? institutions_en.slice(8) : institutions.slice(8)).map((inst, i) => (
                            <span
                              key={i}
                              className="text-xs px-3 py-1 rounded-md border"
                              title={inst}
                            >
                              {inst}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Report Button */}
                      <button
                        onClick={() => openModal(therapist)}
                        className="inline-flex items-center gap-2 h-9 px-3 rounded-md text-sm border"
                        aria-label={usedLocale === 'en' ? `Report a case to ${therapist.name}` : `Signaler un cas à ${therapist.name}`}
                      >
                        {/* Exclamation-in-circle icon (inherits currentColor) */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4" aria-hidden="true">
                          <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
                          <path d="M12 8v4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12 16h.01" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="leading-none">{usedLocale === 'en' ? `Report a case to ${therapist.name}` : `Signaler un cas à ${therapist.name}`}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Modal */}
      {selectedTherapist && (
        <ReportModal
          therapist={selectedTherapist}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
