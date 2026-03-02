"use client"

import React, { createContext, useContext,useState } from 'react'
import { Locale, defaultLocale, supportedLocales } from '@/lib/i18n'

type LanguageContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return defaultLocale

    try {
      const saved = localStorage.getItem('locale') as Locale | null
      if (saved && supportedLocales.includes(saved)) {
        return saved
      }

      const nav = navigator.language?.slice(0, 2) as Locale | undefined
      if (nav && supportedLocales.includes(nav)) {
        return nav
      }
    } catch {
      // ignore
    }

    return defaultLocale
  })

  const setLocale = (l: Locale) => {
    if (!supportedLocales.includes(l)) return
    setLocaleState(l)
    try {
      localStorage.setItem('locale', l)
    } catch {}
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}

export default LanguageContext
