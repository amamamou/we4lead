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
  medecinUniversities?: University[] | null;
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

// NOTE: we build situation type options inside the component so we can
// return translated labels (FR/EN) while keeping the option `value`
// equal to the backend enum string the server expects.

// (period options removed) We now let users pick a start and end month so the
// frontend sends a human-friendly free-text period to the backend.

const LOCATIONS = ['Salle de cours', 'Administration', 'Stage / hôpital / entreprise', 'En ligne', 'Espaces universitaires', 'Autre'];

// TYPE_MAP was removed: we now send the selected option value directly
// (it already matches the backend enum strings including accents).

// Convert month inputs (YYYY-MM) to a human-friendly French period string
const formatPeriode = (start: string, end: string) => {
  if (!start || !end) return 'Non précisée'

  const format = (value: string) => {
    const [year, month] = value.split('-')
    const date = new Date(Number(year), Number(month) - 1)
    return date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })
  }

  return `${format(start)} - ${format(end)}`
}

export default function ReportModal({ therapist, isOpen, onClose, medecinUniversities }: ReportModalProps) {
  const { locale: ctxLocale } = useLanguage();
  const usedLocale = ctxLocale;

  // Situation type options (labels are translated; values are backend enum strings)
  const SITUATION_TYPE_OPTIONS = usedLocale && usedLocale.startsWith('fr') ? [
    { value: 'HARCÈLEMENT', label: 'Harcèlement' },
    { value: 'VIOLENCE', label: 'Violence' },
    { value: 'DISCRIMINATION', label: 'Discrimination' },
    { value: 'DIFFICULTÉS_ACADÉMIQUES', label: "Difficultés académiques" },
    { value: 'PROBLÈMES_ADMINISTRATIFS', label: 'Problèmes administratifs' },
    { value: 'AUTRE', label: 'Autre' }
  ] : [
    { value: 'HARCÈLEMENT', label: 'Harassment' },
    { value: 'VIOLENCE', label: 'Violence' },
    { value: 'DISCRIMINATION', label: 'Discrimination' },
    { value: 'DIFFICULTÉS_ACADÉMIQUES', label: 'Academic difficulties' },
    { value: 'PROBLÈMES_ADMINISTRATIFS', label: 'Administrative issues' },
    { value: 'AUTRE', label: 'Other' }
  ];

  const [contactFirstName, setContactFirstName] = useState('');
  const [contactLastName, setContactLastName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [institution, setInstitution] = useState('');
  const [universities, setUniversities] = useState<University[] | null>(null);

  // Use the medecin-specific universities when provided by the parent component.
  // Otherwise fetch the full list as a fallback (keeping the previous behavior).
  React.useEffect(() => {
    let mounted = true;

    if (medecinUniversities && medecinUniversities.length > 0) {
      if (mounted) setUniversities(medecinUniversities);
      return () => {
        mounted = false;
      };
    }

    // fallback: fetch all universities
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
  }, [medecinUniversities]);
  // Ensure the modal starts with a fresh form each time it's opened.
  // Without this, the component can remain mounted and keep previous `success` state,
  // causing the success screen to show immediately when reopening the modal.
  React.useEffect(() => {
    if (isOpen) {
      setSuccess(false);
    }
  }, [isOpen]);
  const [situationType, setSituationType] = useState('');
  const [startMonth, setStartMonth] = useState('');
  const [endMonth, setEndMonth] = useState('');
  const [location, setLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');

  const [description, setDescription] = useState('');

  

  // Optional anonymized stats
  const [gender, setGender] = useState('');
  // role: STUDENT | PROFESSOR | ADMIN
  const [role, setRole] = useState('');

  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  

  const resetForm = () => {
    setContactFirstName('');
    setContactLastName('');
    setContactEmail('');
    setContactPhone('');
    setInstitution('');
  setSituationType('');
  setStartMonth('');
  setEndMonth('');
  setLocation('');
  setCustomLocation('');
    setDescription('');
    setGender('');
    setRole('');
    setConsent(false);
    setError(null);
  };

  // Note: success dialog is kept until the user closes it manually.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // hard guard to avoid double-submit race conditions
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
    if (!startMonth || !endMonth) {
      setError(t('psychotherapists.report.error.periodRequired', usedLocale));
      return;
    }
    // Ensure the end month is not before the start month
    if (new Date(endMonth) < new Date(startMonth)) {
      setError(t('psychotherapists.report.error.endBeforeStart', usedLocale));
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
    if (!role) {
      setError(t('psychotherapists.report.error.roleRequired', usedLocale) || (usedLocale.startsWith('fr') ? 'Rôle requis' : 'Role required'));
      return;
    }
    if (!consent) {
      setError(t('psychotherapists.report.error.consentRequired', usedLocale));
      return;
    }

    setIsSubmitting(true);

    try {
      // Map form fields to the backend demande payload
      // Compute lieuPrincipal: it should represent WHERE inside the university.
      // Do NOT substitute the university name here. If user selects 'Autre',
      // allow a custom text input.
      const finalLieu = location === 'Autre' ? (customLocation || undefined) : (location || undefined);
      const payload: CreateDemandePayload = {
        // map UI key to backend value (keep accents as backend expects)
  // send the selected enum string directly (backend expects these exact values)
  typeSituation: situationType || 'AUTRE',
        description,

  // never send empty string; send undefined when not present
  lieuPrincipal: finalLieu,

  // period formatted from month inputs (human-friendly free text)
  periode: formatPeriode(startMonth, endMonth),

        medecinId: therapist.id,

        email: contactEmail,
        prenom: contactFirstName,
        nom: contactLastName,
        telephone: contactPhone || undefined,
  // gender will store backend enum keys directly
  genre: gender || undefined,
  // map role to backend userType when appropriate. For students we do not send userType.
  ...(role && role !== 'STUDENT' ? { userType: role === 'PROFESSOR' ? 'PROFESSEUR' : role === 'ADMIN' ? 'ADMIN' : undefined } : {}),
        // add universiteId when available (we store institution as the selected university id)
        // parseInt ensures we send a number, otherwise undefined
        universiteId: institution ? parseInt(institution, 10) : undefined
      };

  // Use the demandes API helper
  await createDemandePublic(payload);

  // Reset and show confirmation (keep modal open briefly so user sees success)
  resetForm();
  setSuccess(true);
  // Optionally trigger a toast here to inform success
    } catch (err) {
      console.error('Report submit error:', err);
      setError(t('psychotherapists.report.error.sendFailed', usedLocale));
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

        {success ? (
          <div className="p-6 space-y-4 text-center">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-green-100">
              <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">{t('psychotherapists.report.successTitle', usedLocale)}</h3>
            <p className="text-sm text-gray-600">{t('psychotherapists.report.successMessage', usedLocale)}</p>
            {/* success banner: user closes modal using the modal close control */}
          </div>
        ) : (
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
            {/* Move optional stats here under contact details as requested */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="block text-sm text-gray-700">{usedLocale.startsWith('fr') ? 'Rôle' : 'Role'} <span className="text-red-500">*</span></label>
                <select value={role} onChange={(e) => setRole(e.target.value)} required className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="">{t('psychotherapists.report.select', usedLocale)}</option>
                  <option value="STUDENT">{usedLocale.startsWith('fr') ? 'Étudiant(e)' : 'Student'}</option>
                  <option value="PROFESSOR">{usedLocale.startsWith('fr') ? 'Professeur' : 'Professor'}</option>
                  <option value="ADMIN">{usedLocale.startsWith('fr') ? 'Administratif' : 'Administrative'}</option>
                </select>
              </div>
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

                <div className="grid grid-cols-2 gap-2 mt-1">
                  <input type="month" value={startMonth} onChange={(e) => setStartMonth(e.target.value)} required className="border rounded px-2 py-1" />
                  <input type="month" value={endMonth} onChange={(e) => setEndMonth(e.target.value)} required className="border rounded px-2 py-1" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700">{t('psychotherapists.report.locationLabel', usedLocale)} <span className="text-gray-400 text-xs">({t('psychotherapists.report.optional', usedLocale)})</span></label>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="">{t('psychotherapists.report.select', usedLocale)}</option>
                  {LOCATIONS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                {location === 'Autre' && (
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder={t('psychotherapists.report.customLocationPlaceholder', usedLocale) || 'Précisez le lieu'}
                    className="mt-2 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                )}
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

          {/* statistical info moved into contact section */}

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
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>{t('psychotherapists.report.sending', usedLocale)}</span>
                </>
              ) : (
                t('psychotherapists.report.submit', usedLocale)
              )}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
