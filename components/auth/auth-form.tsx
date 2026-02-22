'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, Building2, Check } from 'lucide-react';
import { t } from '@/lib/i18n'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSuccess?: () => void;
}

const UNIVERSITIES = [
  { group: 'Facultés', items: ['Médecine', 'Droit et Sciences Politiques', 'Lettres et Sciences Humaines', 'Sciences Economiques et Gestion'] },
  { group: 'Instituts', items: ['Hautes Etudes Commerciales', 'Finance et Fiscalité', 'Beaux-Arts', 'Supérieur De Gestion', 'Informatique et Communication', 'Musique', 'Sciences Appliquées et Technologie', 'Transport et Logistique', 'Agronomique de Chott-Mariem', 'Sciences Infirmières'] },
  { group: 'Ecoles', items: ['Nationale des ingénieurs', 'Sciences et Technologie de Hammam Sousse', 'Sciences et Techniques de la Santé'] }
];

export function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const router = useRouter();
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

  // Clear error when switching modes
  useEffect(() => {
    const id = setTimeout(() => setError(''), 0);
    return () => clearTimeout(id);
  }, [mode]);

  // remove any arrow glyphs from translation strings so we only show our single animated arrow
  const sanitizeLabel = (s: string) => s.replace(/[→➡➜]/g, '').trim()
  const submitLabel = sanitizeLabel(isLogin ? t('auth.button.signIn', usedLocale) : t('auth.button.continue', usedLocale))
  const loadingLabel = sanitizeLabel(isLogin ? t('auth.submit.signing', usedLocale) : t('auth.submit.settingUp', usedLocale))
  const termsLabel = sanitizeLabel(t('auth.terms.termsLabel', usedLocale))
  const privacyLabel = sanitizeLabel(t('auth.terms.privacyLabel', usedLocale))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Login - attendre le résultat
        await login(email, password);
        
        // Si on arrive ici, le login a réussi
        // Rediriger vers le dashboard
        router.push('/dashboard');
        
        // Appeler onSuccess si fourni (pour fermer le modal par exemple)
        if (onSuccess) {
          onSuccess();
        }
      } else {
        // Signup
        await signup(email, password, name);
        
        // Après signup réussi
        alert(t('auth.success.checkInboxPrefix', usedLocale) + ' ' + email);
        
        // Rediriger vers le dashboard ou page de confirmation
        router.push('/dashboard');
        
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch (err) {
      // L'erreur est déjà gérée par le contexte
      // On ne redirige PAS
      console.error('Auth error:', err);
    }
  };

  return (
    <div>
      <div className="pt-6 mb-6">
        <h2 className="text-lg lg:text-2xl font-semibold text-gray-900 mb-1">
          {isLogin ? t('auth.welcomeBack', usedLocale) : t('auth.createAccount', usedLocale)}
        </h2>
        <p className="text-sm lg:text-sm text-gray-600">
          {isLogin ? t('auth.login.desc', usedLocale) : t('auth.signup.desc', usedLocale)}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-xs font-medium text-gray-900 mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-gray-600" />
              {t('auth.fullName', usedLocale)}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 sm:py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 text-xs lg:text-sm focus:outline-none focus:ring-2 focus:ring-[#020E68] focus:border-transparent transition-all"
              required={!isLogin}
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-600" />
            {t('auth.emailAddress', usedLocale)}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 sm:py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-[#020E68] focus:border-transparent transition-all"
            required
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-xs font-medium text-gray-900 mb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-600" />
              {t('auth.university', usedLocale)}
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full px-4 py-3 sm:py-2.5 rounded-lg bg-white text-left text-gray-900 text-xs lg:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#020E68] transition-all flex items-center justify-between shadow-md hover:shadow-lg hover:bg-gray-50 cursor-pointer"
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
                      <div className="px-4 py-2 bg-gray-50 font-semibold text-[10px] lg:text-xs text-gray-700 uppercase tracking-wider sticky top-0">
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
                          className="w-full px-4 py-3 hover:bg-blue-50 text-gray-900 text-sm lg:text-base transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span className="truncate">{item}</span>
                          {university === item && <Check className="w-4 h-4 text-[#020E68] ml-2" />}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-600" />
            {t('auth.password', usedLocale)}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 sm:py-2.5 pr-10 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-[#020E68] focus:border-transparent transition-all"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isLogin && (
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input type="checkbox" className="w-4 h-4 border border-gray-300 rounded accent-[#020E68]" />
            {t('auth.rememberMe', usedLocale)}
          </label>
        )}

        {(authError || error) && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3">
            <span className="text-red-600 text-base">⚠</span>
            <p className="text-sm text-red-600">{authError || error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!isFormValid || authLoading}
          className="group w-full py-3 lg:py-4 sm:py-3 bg-white text-gray-900 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8 flex items-center justify-center gap-3 shadow-md hover:shadow-lg hover:bg-gray-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#020E68]"
        >
          {authLoading ? (
            <>
              <span className="mr-2">{loadingLabel}</span>
              <span className="ml-2 animate-spin">⏳</span>
            </>
          ) : (
            <>
              <span>{submitLabel}</span>
              <span className="ml-2 inline-flex items-center h-4 text-sm lg:text-base leading-none transition-transform transform group-hover:translate-x-1">→</span>
            </>
          )}
        </button>
      </form>

      <p className="text-center text-[11px] lg:text-xs text-gray-500 mt-4">
        {t('auth.terms.prefix', usedLocale)} {isLogin ? ' ' : ' '}
        <button className="hover:underline text-gray-600 font-medium bg-white p-0 inline-flex items-center gap-1 cursor-pointer">{termsLabel}</button>
        {' '}and{' '}
        <button className="hover:underline text-gray-600 font-medium bg-white p-0 inline-flex items-center gap-1 cursor-pointer">{privacyLabel}</button>
      </p>
    </div>
  )
}

export default AuthForm;