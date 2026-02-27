"use client";

import React, { useState } from 'react';
import { Locale, t } from '@/lib/i18n';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
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
    image: '/nadia.png'
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


export default function TherapistsSection({ locale }: { locale?: Locale }) {
  const { locale: ctxLocale } = useLanguage();
  const usedLocale = locale ?? ctxLocale;
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setIsModalOpen(true);
  };

  const next = () => setCurrentIndex((p) => (p + 1) % therapists.length);
  const prev = () => setCurrentIndex((p) => (p - 1 + therapists.length) % therapists.length);

  const slide = therapists[currentIndex];

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

  const instList = usedLocale === 'en' ? institutions_en : institutions;
  const start = currentIndex === 0 ? 0 : 8;
  const displayedInstitutions = instList.slice(start, start + 8);

  return (
    <>
      <section id="psychotherapists" data-locale={usedLocale} className="py-20 border-t">
        <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-balance max-w-2xl">
              Our therapists
            </h2>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="rounded-full h-12 w-12 bg-muted hover:bg-muted/80"
                aria-label="Previous therapist"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="rounded-full h-12 w-12 bg-muted hover:bg-muted/80"
                aria-label="Next therapist"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div className="space-y-6">
              <div className="group flex flex-col md:flex-row items-start gap-6">
                <div className="md:w-1/2">
                  <div className="rounded-2xl overflow-hidden bg-muted/50">
                    {slide.image ? (
                      <Image
                        src={slide.image}
                        alt={slide.name}
                        width={1200}
                        height={400}
                        className="w-full h-[400px] object-cover"
                      />
                    ) : (
                      <div className="w-full h-[400px] flex items-center justify-center bg-muted">
                        <span className="text-5xl font-bold">{slide.name.split(' ')[0][0]}</span>
                      </div>
                    )}
                  </div>

                </div>

                <Card className="md:w-1/2">
                  <CardHeader>
                                      <h3 className="text-2xl font-display font-bold mt-4">{slide.name}</h3>

                    <CardDescription className="mb-2">
                      {usedLocale === 'en' && slide.title_en ? slide.title_en : slide.title}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                 

                    {/* Locations / Institutions */}
                    <div className="mb-4 mt-4">
                      
                      <p className="text-xs font-semibold uppercase tracking-wide mb-2">
                        {t('psychotherapists.locations', usedLocale)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {displayedInstitutions.map((inst, i) => (
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

                    <div className="mt-6 flex items-center justify-end">
                      <Button variant="default" onClick={() => openModal(slide)} className="shadow-sm">
                        {usedLocale === 'en' ? `Report a case to ${slide.name}` : `Signaler un cas à ${slide.name}`}
                      </Button>
                    </div>
                  </CardContent>

                  <CardFooter />
                </Card>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {therapists.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to therapist ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

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
