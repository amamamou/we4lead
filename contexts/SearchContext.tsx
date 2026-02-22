"use client"

import React, { createContext, useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/navigation'

type FocusTarget = { kind: 'nav'; value: string } | null

type SearchContextType = {
  runSearch: (q: string) => void
  lastQuery: string | null
  focusTarget: FocusTarget
  clearFocus: () => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [lastQuery, setLastQuery] = useState<string | null>(null)
  const [focusTarget, setFocusTarget] = useState<FocusTarget>(null)

  const mapQueryToTarget = (q: string): FocusTarget => {
    const s = q.trim().toLowerCase()
    if (!s) return null

    // Students (French/English common variants)
    if (s.includes('etud') || s.includes('etudiant') || s.includes('etudant') || s.includes('student')) {
      return { kind: 'nav', value: 'students' }
    }

    // Doctors / medecins
    if (s.includes('medec') || s.includes('doctor') || s.includes('praticien')) {
      return { kind: 'nav', value: 'doctors' }
    }

    // Demandes / tickets
    if (s.includes('demande') || s.includes('demands') || s.includes('demand')) {
      return { kind: 'nav', value: 'demandes' }
    }

    // Admins
    if (s.includes('admin') || s.includes('admins')) {
      return { kind: 'nav', value: 'admins' }
    }

    // Appointments / rdv
    if (s.includes('rdv') || s.includes('rendez') || s.includes('appointment')) {
      return { kind: 'nav', value: 'appointments' }
    }

    // fallback: overview
    return { kind: 'nav', value: 'overview' }
  }

  const runSearch = useCallback(
    (q: string) => {
      const normalized = q.trim()
      if (!normalized) return
      setLastQuery(normalized)
      const target = mapQueryToTarget(normalized)
      setFocusTarget(target)
      // Navigate to dashboard where different dashboards/sections live
      try {
        router.push('/dashboard')
      } catch (e) {
        // ignore for safety during SSR or tests
        console.warn('Navigation failed', e)
      }
    },
    [router]
  )

  const clearFocus = useCallback(() => setFocusTarget(null), [])

  return (
    <SearchContext.Provider value={{ runSearch, lastQuery, focusTarget, clearFocus }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used within SearchProvider')
  return ctx
}

export default SearchContext
