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
    image: '/avatars/women1.svg'
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
    image: '/avatars/women2.svg'
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
      <section id="psychotherapists" data-locale={usedLocale} className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16">
            <span className="text-xs font-semibold text-foreground  border-border rounded-full  inline-block uppercase tracking-wide">
              {t('psychotherapists.heading', usedLocale)}
            </span>
            <h2 className="font-sans text-4xl font-bold text-foreground mt-6 mb-6">
              {t('psychotherapists.subtitle', usedLocale)}
            </h2>
          </div>

          {/* Therapists - Alternating Layout */}
          <div className="space-y-20">
            {therapists.map((therapist, index) => (
              <div key={index} className="w-full">
                {/* Therapist 1: Image Right, Content Left */}
                {index === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Content Left */}
                    <div className="order-2 md:order-1">
                      {/* Name and Title */}
                      <div className="mb-8">
                        <h3 className="text-3xl font-bold text-foreground mb-3">
                          {therapist.name}
                        </h3>
                        <p className="text-lg text-primary font-semibold">
                          {usedLocale === 'en' && therapist.title_en ? therapist.title_en : therapist.title}
                        </p>
                      </div>

                      {/* Specialties removed per request */}

                      {/* Availability */}
                      <div className="mb-8">
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                          {t('psychotherapists.availability', usedLocale)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {usedLocale === 'en' && therapist.availability_en ? therapist.availability_en : therapist.availability}
                        </p>
                      </div>

                      {/* Locations */}
                      <div className="mb-8">
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
                          {t('psychotherapists.locations', usedLocale)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(usedLocale === 'en' ? institutions_en.slice(0, 8) : institutions.slice(0, 8)).map((inst, i) => (
                            <span
                              key={i}
                              className="text-xs px-3 py-1 rounded-md bg-muted text-muted-foreground border border-border"
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
                        className="inline-flex items-center justify-center px-4 py-3 bg-white border border-[#020E68] text-[#020E68] rounded-xl font-medium text-sm hover:bg-slate-50 hover:border-[#020E68] transition-colors duration-200"
                        aria-label={t('psychotherapists.report.ariaLabel', usedLocale, { name: therapist.name })}
                      >
                        <span>{t('psychotherapists.report.button', usedLocale)}</span>
                      </button>
                    </div>

                    {/* Image Right */}
                    <div className="order-1 md:order-2 relative rounded-2xl overflow-hidden h-96 md:h-auto bg-muted">
                      {therapist.image ? (
                        <Image
                          src={therapist.image}
                          alt={therapist.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                          <span className="text-5xl font-bold text-primary/30">
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
                    <div className="relative rounded-2xl overflow-hidden h-96 md:h-auto bg-muted">
                      {therapist.image ? (
                        <Image
                          src={therapist.image}
                          alt={therapist.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                          <span className="text-5xl font-bold text-primary/30">
                            {therapist.name.split(' ')[0][0]}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Right */}
                    <div>
                      {/* Name and Title */}
                      <div className="mb-8">
                        <h3 className="text-3xl font-bold text-foreground mb-3">
                          {therapist.name}
                        </h3>
                        <p className="text-lg text-primary font-semibold">
                          {usedLocale === 'en' && therapist.title_en ? therapist.title_en : therapist.title}
                        </p>
                      </div>

                      {/* Specialties removed per request */}

                      {/* Availability */}
                      <div className="mb-8">
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
                          {t('psychotherapists.availability', usedLocale)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {usedLocale === 'en' && therapist.availability_en ? therapist.availability_en : therapist.availability}
                        </p>
                      </div>

                      {/* Locations */}
                      <div className="mb-8">
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
                          {t('psychotherapists.locations', usedLocale)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(usedLocale === 'en' ? institutions_en.slice(8) : institutions.slice(8)).map((inst, i) => (
                            <span
                              key={i}
                              className="text-xs px-3 py-1 rounded-md bg-muted text-muted-foreground border border-border"
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
                        className="inline-flex items-center justify-center px-4 py-3 bg-white border border-[#020E68] text-[#020E68] rounded-xl font-medium text-sm hover:bg-slate-50 hover:border-[#020E68] transition-colors duration-200"
                        aria-label={t('psychotherapists.report.ariaLabel', usedLocale, { name: therapist.name })}
                      >
                        <span>{t('psychotherapists.report.button', usedLocale)}</span>
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
