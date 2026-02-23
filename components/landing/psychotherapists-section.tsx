'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Locale, t } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { Flag } from '@/components/ui/icons';
import ReportModal from '@/components/landing/report-modal';

interface Therapist {
  id: string; // DB identity
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
    image: '/avatars/women1.svg'
  },
  {
    id: "8ae31fc6-30d0-4a2a-bded-bb4d8038e01d", // DB → BOUSSAFA
    name: 'Mme Nadia BOUSSAFA',
    title: 'Psychologue clinicienne',
    title_en: 'Clinical Psychologist',
    specialties: ['Harcèlement sexuel', 'Traumatismes', 'Accompagnement thérapeutique'],
    specialties_en: ['Sexual harassment', 'Trauma', 'Therapeutic support'],
    availability: 'Mardi - Jeudi - Samedi',
    availability_en: 'Tuesday - Thursday - Saturday',
    email: 'nadia.boussafa@uss.tn',
    phone: '+216 XX XXX XXX',
    image: '/avatars/women2.svg'
  }
];

// List of institutions where doctors are partially (≈50%) available.
// We'll split this list 8 / 9 between the two therapists (first 8 -> therapist 0, rest -> therapist 1)
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

// English versions of the same institutions list
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




export default function PsychotherapistsSection({ locale }: { locale?: Locale }) {
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
      <section id="psychotherapists" data-locale={usedLocale} className="pt-4 pb-8 md:pt-6 md:pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header: similar purpose to other sections' "How is it done?" */}
          <div className="mb-8">
            <h2 className="font-sans text-3xl font-bold text-gray-900 mb-2">{t('psychotherapists.heading', usedLocale)}</h2>
            <p className="text-sm text-gray-600">{t('psychotherapists.subtitle', usedLocale)}</p>
          </div>
      
          {/* Therapists Grid - two cards side-by-side on md+ screens; auto-rows-fr makes cards equal height */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 auto-rows-fr">
            {therapists.map((therapist, index) => (
              <div
                key={index}
                className="relative group rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-lg transform-gpu hover:-translate-y-0.5 transition-all duration-300 h-full flex flex-col"
              >
                {/* subtle accent line at top for a clean template-like look */}
                <div className="h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent" />
                {/* Card Header with centered Avatar */}
                <div className="px-6 py-6 relative">
                  <div className="flex flex-col items-start text-left gap-3">
                    {/* Avatar (slightly smaller for a cleaner look) */}
                    <div className="w-28 h-28 rounded-lg bg-gradient-to-br from-purple-50 to-white overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      {therapist.image ? (
                        <Image
                          src={therapist.image}
                          alt={therapist.name}
                          width={112}
                          height={112}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-normal text-gray-400">
                          {therapist.name.split(' ')[0][0]}
                        </span>
                      )}
                    </div>

                    {/* Name and Title (left-aligned) */}
                    <div className="self-start text-left">
                      <h3 className="text-lg font-medium text-gray-900">
                        {therapist.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-normal mt-1">
                        {therapist.title}
                      </p>
                    </div>
                  </div>

                  {/* Top-right report button (moved from footer) */}
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => openModal(therapist)}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
                      aria-label={t('psychotherapists.report.ariaLabel', usedLocale, { name: therapist.name })}
                    >
                      <Flag className="w-4 h-4 text-gray-600" aria-hidden="true" />
                      <span className="text-sm">{t('psychotherapists.report.button', usedLocale)}</span>
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-6 py-6 space-y-5 flex-1">
                  {/* Specialties */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">
                      {t('psychotherapists.specialties', usedLocale)}
                    </p>
                    <ul className="space-y-2">
                      {(usedLocale === 'en' && therapist.specialties_en ? therapist.specialties_en : therapist.specialties).map((specialty, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-2 h-2 rounded-full bg-gray-200 mt-2 flex-shrink-0"></span>
                          <span className="text-sm text-gray-700 font-normal">
                            {specialty}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Availability */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">{t('psychotherapists.availability', usedLocale)}</p>
                    <p className="text-sm text-gray-700 font-normal">{usedLocale === 'en' && therapist.availability_en ? therapist.availability_en : therapist.availability}</p>
                  </div>

                  {/* Institutions where the doctor is partially available (displayed as compact pills) */}
                  {/* Locations / Institutions where the doctor is partially available (displayed as compact pills) */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">{t('psychotherapists.locations', usedLocale)}</p>
                    <div className="flex flex-wrap gap-2">
                      {( 
                        (usedLocale === 'en' ? (index === 0 ? institutions_en.slice(0, 8) : institutions_en.slice(8)) : (index === 0 ? institutions.slice(0, 8) : institutions.slice(8)))
                      ).map((inst, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1 rounded-md bg-gray-100 text-gray-700 border border-gray-50 shadow-sm transform transition-transform duration-200 hover:scale-105"
                          title={inst}
                        >
                          {inst}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer removed: button moved to top-right */}
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
