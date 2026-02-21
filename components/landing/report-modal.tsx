"use client";

import React, { useState } from 'react';
import { t } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { createDemandePublic } from '@/services/demandesApi';
import type { CreateDemandePayload } from '@/types/demande';
import { fetchUniversities, University } from '@/utils/institutions';

interface Therapist {
  id: string;
  name: string;
  email: string;
}

interface ReportModalProps {
  therapist: Therapist;
  isOpen: boolean;
  onClose: () => void;
}

// We fetch universities from the backend to get their numeric IDs.
// Keep a small local fallback if the fetch fails.
const INSTITUTIONS_FALLBACK = [
  'Facultés - Médecine',
  'Facultés - Droit et Sciences Politiques',
  'Facultés - Lettres et Sciences Humaines',
  'Facultés - Sciences Economiques et Gestion',
  "Instituts - Hautes Etudes Commerciales",
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

// Situation types: option value = backend enum, label = human text
const SITUATION_TYPE_OPTIONS = [
  { value: 'HARCÈLEMENT', label: 'Harcèlement verbal' },
  { value: 'HARCÈLEMENT', label: 'Harcèlement sexuel' },
  { value: 'HARCÈLEMENT', label: 'Pression psychologique' },
  { value: 'HARCÈLEMENT', label: 'Cyberharcèlement' },
  { value: 'DISCRIMINATION', label: 'Discrimination' },
  { value: 'AUTRE', label: 'Autre' }
];

// Periods: use enum-like keys as values to send to backend
const PERIOD_OPTIONS = [
  { value: 'EN_COURS', label: 'En cours' },
  { value: 'RECENT', label: 'Récent (ce mois)' },
  { value: 'ANCIEN', label: 'Ancien' }
];

const LOCATIONS = ['Salle de cours', 'Administration', 'Stage / hôpital / entreprise', 'En ligne', 'Espaces universitaires', 'Autre'];

export default function ReportModal({ therapist, isOpen, onClose }: ReportModalProps) {
  const { locale: ctxLocale } = useLanguage();
  const usedLocale = ctxLocale;

  const [contactFirstName, setContactFirstName] = useState('');
  const [contactLastName, setContactLastName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [institution, setInstitution] = useState('');
  const [universities, setUniversities] = useState<University[] | null>(null);
  React.useEffect(() => {
    let mounted = true;
    fetchUniversities()
      .then((data) => {
        if (mounted) setUniversities(data || []);
      })
      .catch((err) => {
        console.error('Failed to load universities for report modal', err);
        if (mounted) setUniversities([]);
      });

    return () => {
      mounted = false;
    };
  }, []);
  const [situationType, setSituationType] = useState('');
  const [period, setPeriod] = useState('');
  const [location, setLocation] = useState('');

  const [description, setDescription] = useState('');

  

  // Optional anonymized stats
  const [gender, setGender] = useState('');
  const [studyLevel, setStudyLevel] = useState('');

  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  

  const resetForm = () => {
    setContactFirstName('');
    setContactLastName('');
    setContactEmail('');
    setContactPhone('');
    setInstitution('');
    setSituationType('');
    setPeriod('');
    setLocation('');
    setDescription('');
    setGender('');
    setStudyLevel('');
    setConsent(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!contactFirstName.trim() || !contactLastName.trim() || !contactEmail.trim()) {
      setError(t('psychotherapists.report.error.nameEmailRequired', usedLocale));
      return;
    }
    if (!institution) {
      setError(t('psychotherapists.report.error.institutionRequired', usedLocale));
      return;
    }
    if (!situationType) {
      setError(t('psychotherapists.report.error.situationTypeRequired', usedLocale));
      return;
    }
    if (!period) {
      setError(t('psychotherapists.report.error.periodRequired', usedLocale));
      return;
    }
    if (!description.trim()) {
      setError(t('psychotherapists.report.error.descriptionRequired', usedLocale));
      return;
    }
    if (!gender) {
      setError(t('psychotherapists.report.error.genderRequired', usedLocale));
      return;
    }
    if (!studyLevel) {
      setError(t('psychotherapists.report.error.studyLevelRequired', usedLocale));
      return;
    }
    if (!consent) {
      setError(t('psychotherapists.report.error.consentRequired', usedLocale));
      return;
    }

    setIsSubmitting(true);

    try {
      // Map form fields to the backend demande payload
      const payload: CreateDemandePayload = {
        // situationType now stores backend enum keys directly
        typeSituation: situationType || 'AUTRE',
        description,
        // prefer the selected university name as lieuPrincipal when we have it
        lieuPrincipal: (universities && institution)
          ? (universities.find((u) => String(u.id) === institution)?.nom || location || institution)
          : (institution || location || undefined),
  periode: period || undefined,

  medecinId: therapist.id,

  email: contactEmail,
        prenom: contactFirstName,
        nom: contactLastName,
        telephone: contactPhone || undefined,
        // gender and studyLevel will store backend enum keys directly
        genre: (gender || undefined),
        niveauEtude: studyLevel || undefined
        // add universiteId when available (we store institution as the selected university id)
        // parseInt ensures we send a number, otherwise undefined
        ,
        universiteId: institution ? parseInt(institution, 10) : undefined
      };

      // Use the demandes API helper
      await createDemandePublic(payload);

      resetForm();
      onClose();
      // Optionally trigger a toast here to inform success
    } catch (err) {
      console.error('Report submit error:', err);
      setError("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl animate-in fade-in duration-300 overflow-auto max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{t('psychotherapists.report.modalTitle', usedLocale)}</h3>
            <p className="text-sm text-gray-600 mt-1">{t('psychotherapists.report.to', usedLocale, { name: therapist.name })}</p>
            <p className="text-xs text-gray-500 mt-2">{t('psychotherapists.report.reassurance', usedLocale)}</p>
          </div>
          <div className="flex items-start sm:items-center">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-0 sm:ml-4"
              aria-label="Fermer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 1) Contact */}
          <div>
            <h4 className="text-sm font-medium text-gray-900">{t('psychotherapists.report.contactHeading', usedLocale)}</h4>
            <p className="text-xs text-gray-500 mt-1">{t('psychotherapists.report.contactReassurance', usedLocale)}</p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700">{t('psychotherapists.report.nameLabel', usedLocale)} <span className="text-red-500">*</span></label>
                <input
                  value={contactFirstName}
                  onChange={(e) => setContactFirstName(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder={t('psychotherapists.report.placeholderName', usedLocale)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">{t('psychotherapists.report.nameLabel', usedLocale)} <span className="text-red-500">*</span></label>
                <input
                  value={contactLastName}
                  onChange={(e) => setContactLastName(e.target.value)}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder={t('psychotherapists.report.placeholderName', usedLocale)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">{t('psychotherapists.report.emailLabel', usedLocale)} <span className="text-red-500">*</span></label>
                <input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  type="email"
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder={t('psychotherapists.report.placeholderEmail', usedLocale)}
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700">{t('psychotherapists.report.phoneLabel', usedLocale)} <span className="text-gray-400 text-xs">({t('psychotherapists.report.optional', usedLocale)})</span></label>
                <input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  type="tel"
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder={t('psychotherapists.report.placeholderPhone', usedLocale)}
                />
              </div>

              {/* contact preference removed per design */}
            </div>
          </div>

          {/* 2) Situation */}
          <div>
            <h4 className="text-sm font-medium text-gray-900">{t('psychotherapists.report.situationHeading', usedLocale)}</h4>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700">{t('institutions.institutionLabel', usedLocale)} <span className="text-red-500">*</span></label>
                <select value={institution} onChange={(e) => setInstitution(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="">{t('psychotherapists.report.select', usedLocale)}</option>
                  {universities && universities.length > 0
                    ? universities.map((u) => (
                        <option key={u.id} value={String(u.id)}>{u.nom}</option>
                      ))
                    : INSTITUTIONS_FALLBACK.map((inst) => (
                        <option key={inst} value={inst}>{inst}</option>
                      ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700">{t('psychotherapists.report.typeLabel', usedLocale)} <span className="text-red-500">*</span></label>
                <select value={situationType} onChange={(e) => setSituationType(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="">{t('psychotherapists.report.select', usedLocale)}</option>
                  {SITUATION_TYPE_OPTIONS.map((opt) => (
                    <option key={`${opt.value}-${opt.label}`} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700">{t('psychotherapists.report.periodLabel', usedLocale)} <span className="text-red-500">*</span></label>
                <select value={period} onChange={(e) => setPeriod(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="">{t('psychotherapists.report.select', usedLocale)}</option>
                  {PERIOD_OPTIONS.map((opt) => (
                    <option key={`${opt.value}-${opt.label}`} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700">{t('psychotherapists.report.locationLabel', usedLocale)} <span className="text-gray-400 text-xs">({t('psychotherapists.report.optional', usedLocale)})</span></label>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="">{t('psychotherapists.report.select', usedLocale)}</option>
                  {LOCATIONS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 3) Description */}
          <div>
            <h4 className="text-sm font-medium text-gray-900">{t('psychotherapists.report.descriptionLabel', usedLocale)} <span className="text-red-500">*</span></h4>
            <p className="text-xs text-gray-500 mt-1">{t('psychotherapists.report.descriptionHelper', usedLocale)}</p>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} required className="mt-3 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder={t('psychotherapists.report.descriptionPlaceholder', usedLocale)}></textarea>
          </div>

          {/* expectations section removed per design */}

          {/* 5) Statistical info (optional) */}
          <div>
            <h4 className="text-sm font-medium text-gray-900">{t('psychotherapists.report.statsHeading', usedLocale)}</h4>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700">{t('psychotherapists.report.genderLabel', usedLocale)} <span className="text-red-500">*</span></label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="">{t('psychotherapists.report.select', usedLocale)}</option>
                  <option value="FEMME">{t('psychotherapists.report.gender.female', usedLocale)}</option>
                  <option value="HOMME">{t('psychotherapists.report.gender.male', usedLocale)}</option>
                  <option value="AUTRE">{t('psychotherapists.report.gender.other', usedLocale)}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-700">{t('psychotherapists.report.studyLevelLabel', usedLocale)} <span className="text-red-500">*</span></label>
                <select value={studyLevel} onChange={(e) => setStudyLevel(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="">{t('psychotherapists.report.select', usedLocale)}</option>
                  <option value="LICENCE">{t('psychotherapists.report.studyLevel.licence', usedLocale)}</option>
                  <option value="MASTER">{t('psychotherapists.report.studyLevel.master', usedLocale)}</option>
                  <option value="DOCTORAT">{t('psychotherapists.report.studyLevel.doctorate', usedLocale)}</option>
                  <option value="AUTRE">{t('psychotherapists.report.studyLevel.other', usedLocale)}</option>
                </select>
              </div>
            </div>
          </div>

          {/* 6) Consent */}
          <div>
            <label className="inline-flex items-start">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
              <span className="ml-3 text-sm">{t('psychotherapists.report.consentText', usedLocale)} <span className="text-red-500">*</span></span>
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center justify-between gap-4">
            <button type="button" onClick={() => { resetForm(); onClose(); }} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">{t('psychotherapists.report.cancel', usedLocale)}</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm disabled:opacity-50">{isSubmitting ? t('psychotherapists.report.sending', usedLocale) : t('psychotherapists.report.submit', usedLocale)}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
