"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Locale, defaultLocale, supportedLocales } from '@/lib/i18n'

type LanguageContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('locale') as Locale | null
      if (saved && supportedLocales.includes(saved)) {
        setLocaleState(saved)
        return
      }
      // try infer from browser
      const nav = navigator.language?.slice(0, 2)
      if (nav && supportedLocales.includes(nav as Locale)) setLocaleState(nav as Locale)
    } catch (e) {
      // ignore (SSR safety)
    }
  }, [])

  const setLocale = (l: Locale) => {
    if (!supportedLocales.includes(l)) return
    setLocaleState(l)
    try {
      localStorage.setItem('locale', l)
    } catch (e) {}
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
