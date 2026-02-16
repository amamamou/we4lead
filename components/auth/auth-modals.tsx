"use client";

import { useState, useCallback } from 'react';
import { Eye, EyeOff, X, Mail, Lock, User, Building2, Check } from 'lucide-react';
import Image from 'next/image';
import { t } from '@/lib/i18n'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
}

const UNIVERSITIES = [
  { group: 'Facultés', items: ['Médecine', 'Droit et Sciences Politiques', 'Lettres et Sciences Humaines', 'Sciences Economiques et Gestion'] },
  { group: 'Instituts', items: ['Hautes Etudes Commerciales', 'Finance et Fiscalité', 'Beaux-Arts', 'Supérieur De Gestion', 'Informatique et Communication', 'Musique', 'Sciences Appliquées et Technologie', 'Transport et Logistique', 'Agronomique de Chott-Mariem', 'Sciences Infirmières'] },
  { group: 'Ecoles', items: ['Nationale des ingénieurs', 'Sciences et Technologie de Hammam Sousse', 'Sciences et Techniques de la Santé'] }
];


export function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
  const { locale: ctxLocale } = useLanguage()
  const usedLocale = ctxLocale
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const { login, signup, loading: authLoading, error: authError } = useAuth()

  const isLogin = mode === 'login';
  const isFormValid = isLogin 
    ? Boolean(email && password)
    : Boolean(name && email && university && password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      await login(email, password)
      return
    }

    await signup(email, password, name)
    // Keep behavior identical to the old header: show a browser alert and
    // let the header remain the source of truth for modal state. Do not
    // auto-close based on provider user state inside the modal.
    try {
      alert(t('auth.success.checkInboxPrefix', usedLocale) + ' ' + email)
    } catch {
      // alert may be blocked in some contexts; fall back to a no-op
    }
    onClose()
  };

  const handleCloseModal = useCallback(() => {
    setEmail('');
    setPassword('');
    setName('');
    setUniversity('');
    onClose();
  }, [onClose]);

  // NOTE: Do NOT auto-close the modal when the provider reports a user.
  // The header should control modal visibility (the provider is the auth
  // brain). This mirrors the old behavior and prevents race conditions
  // during signup/verify flows.

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 backdrop-blur-sm" onClick={handleCloseModal} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-5 right-5 z-10 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
        </button>

        {/* Main Content */}
        <div className="p-8 lg:p-9">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">
              {isLogin ? t('auth.welcomeBack', usedLocale) : t('auth.createAccount', usedLocale)}
            </h2>
            <p className="text-sm text-gray-600">
              {isLogin ? t('auth.login.desc', usedLocale) : t('auth.signup.desc', usedLocale)}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-600" />
                  {t('auth.fullName', usedLocale)}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#020E68] focus:border-transparent transition-all"
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-600" />
                {t('auth.emailAddress', usedLocale)}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#020E68] focus:border-transparent transition-all"
              />
            </div>

            {/* University Selector (Signup only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-600" />
                  {t('auth.university', usedLocale)}
                </label>
                <div className="relative">
                    <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-left text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#020E68] focus:border-transparent transition-all flex items-center justify-between"
                  >
                    <span className={university ? 'text-gray-900' : 'text-gray-400'}>
                      {university || t('auth.selectInstitution', usedLocale)}
                    </span>
                    <span className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  
                  {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {UNIVERSITIES.map((group) => (
                        <div key={group.group}>
                          <div className="px-4 py-2 bg-gray-50 font-semibold text-xs text-gray-700 uppercase tracking-wider sticky top-0">
                            {group.group}
                          </div>
                          {group.items.map((item) => (
                            <button
                              key={item}
                              type="button"
                              onClick={() => {
                                setUniversity(item);
                                setShowDropdown(false);
                              }}
                              className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-gray-900 text-sm transition-colors flex items-center gap-2"
                            >
                              {university === item && <Check className="w-4 h-4 text-[#020E68]" />}
                              {item}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Password Field (Login only) */}
            {isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-600" />
                  {t('auth.password', usedLocale)}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#020E68] focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button className="text-xs text-[#020E68] hover:underline mt-1.5 font-medium">
                  {t('auth.forgotPassword', usedLocale)}
                </button>
              </div>
            )}

            {/* Remember Me (Login only) */}
            {isLogin && (
              <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded accent-[#020E68]" />
                  {t('auth.rememberMe', usedLocale)}
                </label>
            )}

            {/* Error Message (provider or local) */}
            {(authError || error) && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3">
                <span className="text-red-600 text-lg">⚠</span>
                <p className="text-sm text-red-600">{authError ?? error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || authLoading}
              className="w-full py-3 bg-[#020E68] hover:bg-blue-900 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8 flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  {isLogin ? t('auth.submit.signing', usedLocale) : t('auth.submit.settingUp', usedLocale)}
                </>
              ) : (
                <>
                  {isLogin ? t('auth.button.signIn', usedLocale) : t('auth.button.continue', usedLocale)}
                </>
              )}
            </button>
          </form>

          {/* Toggle Auth Mode */}
          <p className="text-center text-sm text-gray-600 mt-6">
            {isLogin ? t('auth.noAccount', usedLocale) : t('auth.alreadyAccount', usedLocale)}{' '}
            <button type="button" className="text-[#020E68] font-semibold hover:underline">
              {isLogin ? t('header.getStarted', usedLocale) : t('header.signIn', usedLocale)}
            </button>
          </p>
          

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 mt-4">
            {t('auth.terms.prefix', usedLocale)} {isLogin ? ' ' : ' '}
            <button className="hover:underline text-gray-600 font-medium">{t('auth.terms.termsLabel', usedLocale)}</button>
            {' '}and{' '}
            <button className="hover:underline text-gray-600 font-medium">{t('auth.terms.privacyLabel', usedLocale)}</button>
          </p>
          

          {/* Footer Logos */}
          <div className="flex justify-center items-center gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="relative h-16 w-16">
              <Image src="/we4lead.png" alt="WE4LEAD" fill className="object-contain" />
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <Image src="/universitedesousse.png" alt="University of Sousse" width={80} height={60} className="object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}
