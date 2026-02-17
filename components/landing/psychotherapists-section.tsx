'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Locale } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { Flag } from '@/components/ui/icons';

interface Therapist {
  name: string;
  title: string;
  specialties: string[];
  availability: string;
  email: string;
  phone: string;
  image?: string;
}

const therapists: Therapist[] = [
  {
    name: 'Mme Imen BELGACEM',
    title: 'Psychologue clinicienne',
    specialties: ['Harcèlement moral', 'Stress et anxiété', 'Soutien psychologique'],
    availability: 'Lundi - Mercredi - Vendredi',
    email: 'imen.belgacem@uss.tn',
    phone: '+216 XX XXX XXX',
    image: '/avatars/women1.svg'
  },
  {
    name: 'Mme Nadia BOUSSAFA',
    title: 'Psychologue clinicienne',
    specialties: ['Harcèlement sexuel', 'Traumatismes', 'Accompagnement thérapeutique'],
    availability: 'Mardi - Jeudi - Samedi',
    email: 'nadia.boussafa@uss.tn',
    phone: '+216 XX XXX XXX',
    image: '/avatars/women2.svg'
  }
];


interface ReportModalProps {
  therapist: Therapist;
  isOpen: boolean;
  onClose: () => void;
}

function ReportModal({ therapist, isOpen, onClose }: ReportModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send email via your backend
      const response = await fetch('/api/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          therapist: therapist.name,
          recipientEmail: therapist.email
        })
      });

      if (response.ok) {
        setFormData({ name: '', email: '', phone: '', description: '' });
        onClose();
        // Show success message
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in duration-300">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-light text-gray-900">
              Signaler un cas
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              à {therapist.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">
              Votre nom
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-sm font-light"
              placeholder="Nom complet"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-sm font-light"
              placeholder="votre.email@example.com"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-sm font-light"
              placeholder="+216 XX XXX XXX"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-light text-gray-700 mb-2">
              Description du cas
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all text-sm font-light resize-none"
              placeholder="Décrivez brièvement la situation..."
              rows={4}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-light hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer le rapport'}
          </button>
        </form>
      </div>
    </div>
  );
}

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
      <section id="psychotherapists" className="pt-4 pb-8 md:pt-6 md:pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
          {/* Therapists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {therapists.map((therapist, index) => (
              <div
                key={index}
                className="group rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-lg transform-gpu hover:-translate-y-0.5 transition-all duration-300"
              >
                {/* Card Header with centered Avatar */}
                <div className="px-6 py-6">
                  <div className="flex flex-col items-center text-center gap-3">
                    {/* Avatar (slightly smaller for a cleaner look) */}
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-50 to-white overflow-hidden flex items-center justify-center">
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

                    {/* Name and Title (centered) */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {therapist.name}
                      </h3>
                      <p className="text-sm text-gray-500 font-normal mt-1">
                        {therapist.title}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-6 py-6 space-y-5">
                  {/* Specialties */}
                  <div>
                    <p className="text-xs text-gray-500 mb-2">
                      Spécialités
                    </p>
                    <ul className="space-y-2">
                      {therapist.specialties.map((specialty, idx) => (
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
                    <p className="text-xs text-gray-500 mb-2">Disponibilité</p>
                    <p className="text-sm text-gray-700 font-normal">{therapist.availability}</p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <p className="text-xs text-gray-500">Contact</p>
                    <div className="space-y-2">
                      <a
                        href={`mailto:${therapist.email}`}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 font-light transition-colors"
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {therapist.email}
                      </a>
                      <p className="flex items-center gap-2 text-sm text-gray-700 font-normal">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {therapist.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Footer - Button */}
                <div className="px-8 py-6 transition-colors duration-300 bg-transparent">
                  <button
                    onClick={() => openModal(therapist)}
                    className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                    aria-label={`Signaler un cas à ${therapist.name}`}
                  >
                    {/* modern report icon */}
                    <Flag className="w-4 h-4 text-red-500 transition-colors" aria-hidden="true" />
                    <span>Signaler un cas</span>
                  </button>
                </div>
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
