/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from 'react';
import { Locale, t } from '@/lib/i18n';
// use standard <img> for backend-hosted images to avoid Next/Image domain config during dev
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
import { Skeleton } from '@/components/ui/skeleton';
import normalizeLogo from '@/lib/normalize-logo';

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
  universities?: string[];
}

// Note: this component uses only the real API data (no hardcoded therapists)

// Types matching the API
interface University {
  id: number;
  nom: string;
  ville?: string;
  adresse?: string;
  telephone?: string;
  nbEtudiants?: number;
  logoUrl?: string | null;
  code?: string | null;
}

interface Medecin {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  photoUrl?: string | null;
  telephone?: string;
  specialite?: string | null;
  universites: University[];
}


export default function TherapistsSection({ locale }: { locale?: Locale }) {
  const { locale: ctxLocale } = useLanguage();
  const usedLocale = locale ?? ctxLocale;
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // fetched medecins from API
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const openModal = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setIsModalOpen(true);
  };

  

  // Use only the fetched medecins as the data source (no hardcoded fallback)
  const dataSource: Therapist[] = medecins.map((m) => ({
    id: m.id,
    name: `${m.prenom} ${m.nom}`,
    title: m.specialite ?? '',
    specialties: [],
    availability: '',
    email: m.email,
    phone: m.telephone ?? '',
    image: m.photoUrl ? normalizeLogo(m.photoUrl) : undefined,
    universities: m.universites?.map((u) => u.nom) ?? [],
  }));

  // keep index within bounds of the current data source
  useEffect(() => {
    // reset index to 0 if current index is out of bounds of the new data source
    setCurrentIndex((ci) => (ci >= dataSource.length ? 0 : ci));
  }, [dataSource.length]);

  const slide = dataSource[currentIndex];

  const next = () => setCurrentIndex((p) => (dataSource.length ? (p + 1) % dataSource.length : 0));
  const prev = () => setCurrentIndex((p) => (dataSource.length ? (p - 1 + dataSource.length) % dataSource.length : 0));

  // no longer using the static institutions list; displayedInstitutions is derived from the slide's universities
  // show all institutions for the selected medecin (no artificial limit)
  const displayedInstitutions = slide?.universities ?? [];

  // Fetch medecins from the real API
  useEffect(() => {
    const controller = new AbortController();
    async function fetchMedecins() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:8080/public/users/medecins', {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Failed to fetch medecins: ${res.status}`);
        const data: Medecin[] = await res.json();
        setMedecins(data ?? []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.name !== 'AbortError') setError(err.message ?? 'Unknown error');
        } else {
          setError(String(err ?? 'Unknown error'));
        }
      } finally {
        setLoading(false);
      }
    }

    fetchMedecins();
    return () => controller.abort();
  }, []);

  // Prepare medecin-specific universities in the shape expected by the modal (utils/University)
  const medecinUniversitiesForModal = medecins
    .find((m) => m.id === selectedTherapist?.id)
    ?.universites?.map((u) => ({
      id: u.id,
      nom: u.nom,
      code: u.code ?? '',
      adresse: u.adresse ?? null,
      telephone: u.telephone ?? null,
      nbEtudiants: u.nbEtudiants ?? null,
      horaire: (u as any).horaire ?? null,
      logoPath: (u as any).logoUrl ?? null,
    }));

  return (
    <>
      <section id="psychotherapists" data-locale={usedLocale} className="py-20 border-t">
        <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-balance max-w-2xl">
                {t('psychotherapists.heading', usedLocale)}
              </h2>

              <p className="text-slate-600 text-sm mt-2">
                {t('psychotherapists.subtitle', usedLocale)}
              </p>
            </div>

            <div className="flex gap-2 items-center">
              {loading ? (
                <>
                  <Skeleton className="rounded-full h-12 w-12" />
                  <Skeleton className="rounded-full h-12 w-12" />
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={dataSource.length > 1 ? prev : undefined}
                    disabled={dataSource.length <= 1}
                    className="rounded-full h-12 w-12 bg-muted hover:bg-muted/80"
                    aria-label="Previous therapist"
                    aria-disabled={dataSource.length <= 1}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={dataSource.length > 1 ? next : undefined}
                    disabled={dataSource.length <= 1}
                    className="rounded-full h-12 w-12 bg-muted hover:bg-muted/80"
                    aria-label="Next therapist"
                    aria-disabled={dataSource.length <= 1}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="relative overflow-hidden">
            {loading ? (
              <div className="space-y-6">
                {/* Single polished skeleton card to match normal layout */}
                {[0].map((k) => (
                  <div key={k} className="group flex flex-col md:flex-row items-stretch gap-6">
                    <div className="md:w-1/2 h-60 md:h-[400px]">
                      <Skeleton className="w-full h-60 md:h-[400px] rounded-2xl" />
                    </div>

                    <div className="md:w-1/2 h-60 md:h-[400px]">
                      <div className="space-y-4 h-full flex flex-col justify-between">
                        <div>
                          <Skeleton className="h-8 w-3/4" />
                          <Skeleton className="h-4 w-1/2 mt-2" />

                          <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2">
                            <Skeleton className="h-3 w-full sm:w-28 rounded-full" />
                            <Skeleton className="h-3 w-full sm:w-20 rounded-full" />
                            <Skeleton className="h-3 w-full sm:w-24 rounded-full" />
                          </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                          <Skeleton className="h-10 w-40 rounded-md" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* small pagination skeleton */}
                <div className="flex justify-center gap-2 mt-4">
                  <Skeleton className="h-2 w-8 rounded-full" />
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-2 w-2 rounded-full" />
                </div>
              </div>
            ) : error ? (
              // Show the same polished skeleton on error to keep UI consistent
              <div className="space-y-6">
                <div className="group flex flex-col md:flex-row items-stretch gap-6 animate-pulse">
                  <div className="md:w-1/2 h-60 md:h-[400px]">
                    <Skeleton className="w-full h-60 md:h-[400px] rounded-2xl" />
                  </div>

                  <div className="md:w-1/2 h-60 md:h-[400px]">
                    <div className="space-y-4 h-full flex flex-col justify-between">
                      <div>
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2 mt-2" />

                        <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2">
                          <Skeleton className="h-3 w-full sm:w-28 rounded-full" />
                          <Skeleton className="h-3 w-full sm:w-20 rounded-full" />
                          <Skeleton className="h-3 w-full sm:w-24 rounded-full" />
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end">
                        <Skeleton className="h-10 w-40 rounded-md" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-2 mt-4">
                  <Skeleton className="h-2 w-8 rounded-full" />
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-2 w-2 rounded-full" />
                </div>
              </div>
            ) : dataSource.length === 0 ? (
              // Intentionally render nothing when the backend returns an empty list.
              // Previously this showed a message that flashed during initial load; hide it to avoid UX flicker.
              <div />
            ) : (
              <div className="space-y-6">
                <div className="group flex flex-col md:flex-row items-stretch gap-6">
                  <div className="md:w-1/2 h-60 md:h-[400px]">
                    <div className="rounded-2xl overflow-hidden bg-muted/50 h-60 md:h-[400px]">
                      {slide?.image ? (
                        <img
                          src={slide.image}
                          alt={slide.name}
                          className="w-full h-60 md:h-[400px] object-cover"
                        />
                      ) : (
                        <div className="w-full h-60 md:h-[400px] flex items-center justify-center bg-muted">
                          <span className="text-5xl font-bold">{slide?.name?.split(' ')[0]?.[0] ?? 'M'}</span>
                        </div>
                      )}
                    </div>

                  </div>

                  <Card className="md:w-1/2 flex flex-col">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-display font-bold mt-2">{slide?.name}</h3>

                        {/* Report button visible only on desktop (md+) */}
                        <div className="hidden md:flex md:items-center md:ml-4">
                          <Button
                            variant="default"
                            onClick={() => openModal(slide)}
                            className="shadow-sm"
                          >
                            {usedLocale === 'en' ? `Report a case to ${slide?.name}` : `Signaler un cas à ${slide?.name}`}
                          </Button>
                        </div>
                      </div>

                      <CardDescription className="mb-1">
                        {slide?.title}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-visible md:overflow-auto">

                      {/* Locations / Institutions */}
                      <div className="mb-1 mt-2">
                        <p className="text-xs font-semibold uppercase tracking-wide mb-1">
                          {t('psychotherapists.locations', usedLocale)}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                          {displayedInstitutions.length ? (
                            displayedInstitutions.map((inst, i) => (
                              <span
                                key={i}
                                className="text-xs px-3 py-1 rounded-md border block w-full sm:inline-block sm:w-auto"
                                title={inst}
                              >
                                {inst}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">No institutions available</span>
                          )}
                        </div>
                      </div>
                    </CardContent>

                    {/* Footer is hidden on md+ to avoid leaving an empty space on desktop */}
                    <CardFooter className="border-t-0 px-6 py-4 md:hidden">
                      <div className="w-full flex items-center justify-end">
                        <Button variant="default" onClick={() => openModal(slide)} className="shadow-sm">
                          {usedLocale === 'en' ? `Report a case to ${slide?.name}` : `Signaler un cas à ${slide?.name}`}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {dataSource.length > 0 && (
            <div className="flex justify-center gap-2 mt-8">
              {dataSource.map((_, idx) => (
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
          )}
        </div>
      </section>

      {selectedTherapist && (
        <ReportModal
          therapist={selectedTherapist}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          medecinUniversities={medecinUniversitiesForModal ?? null}
        />
      )}
    </>
  );
}
