"use client"

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { t } from '@/lib/i18n'

/**
 * Non-invasive runtime translator.
 * - Finds elements inside the page's main element whose normalized text matches
 *   known original strings and replaces their textContent with translations.
 * - Does not change markup or structure; runs after hydration and on locale change.
 */
export default function InlineTranslate() {
  const { locale } = useLanguage()

  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.querySelector('main') || document.body

    const normalize = (s: string | null) => (s ?? '').replace(/\s+/g, ' ').trim()

    const map: Array<{ original: string; key: string }> = [
      { original: 'Projet Erasmus+ WE4LEAD', key: 'apropos.badge' },
      { original: 'Favoriser une gouvernance universitaire plus équitable et inclusive', key: 'apropos.initiativeHeading' },
      { original: "Cette plateforme s’inscrit dans le cadre du programme WE4LEAD, porté par l’Université de Sousse, visant à promouvoir l’égalité, la transparence et l’excellence dans l’enseignement supérieur.", key: 'apropos.lead' },
      { original: 'Une initiative académique structurante', key: 'apropos.initiativeHeading' },
      { original: "WE4LEAD (Women’s Empowerment For Leadership and Equity in Higher Education Institutions) est un projet Erasmus+ de renforcement des capacités dans l’enseignement supérieur.", key: 'apropos.initiative.p1' },
      { original: 'Il vise à analyser, accompagner et améliorer les pratiques institutionnelles en matière de gouvernance, de recrutement et de leadership.', key: 'apropos.initiative.p2' },
      { original: 'L’Université de Sousse participe activement à cette dynamique en intégrant ces principes dans ses politiques internes.', key: 'apropos.initiative.p3' },

      { original: 'Pays partenaires', key: 'apropos.counters.countries' },
      { original: 'Universités', key: 'apropos.counters.universities' },
      { original: 'Bénéficiaires', key: 'apropos.counters.beneficiaries' },
      { original: 'En cours', key: 'apropos.counters.statusTitle' },
      { original: 'Projet actif', key: 'apropos.counters.statusDesc' },

      { original: 'Un projet au service des étudiants', key: 'apropos.students.heading' },
      { original: "À travers WE4LEAD, les étudiants bénéficient d’un environnement académique plus transparent, plus équitable et plus respectueux des parcours individuels.", key: 'apropos.students.p1' },
      { original: "Le projet favorise l’émergence de politiques institutionnelles garantissant l’égalité des chances dans l’accès aux postes de responsabilité et aux ressources.", key: 'apropos.students.p2' },
      { original: 'Il contribue également à renforcer la confiance, le dialogue et la qualité de la vie universitaire.', key: 'apropos.students.p3' },

      { original: 'Nos Partenaires ', key: 'apropos.partners.heading' },
  // partners list items
  { original: 'Aix-Marseille Université (Coordinateur)', key: 'apropos.partners.aix' },
  { original: 'Université La Sapienza de Rome', key: 'apropos.partners.sapienza' },
  { original: 'Université Autonoma de Madrid', key: 'apropos.partners.madrid' },
  { original: 'Université de Sousse', key: 'apropos.partners.sousse' },
  { original: 'Université Tunis El-Manar', key: 'apropos.partners.tunis' },
  { original: 'Université Libanaise', key: 'apropos.partners.lebanese' },
  { original: 'Université Antonine', key: 'apropos.partners.antonine' },
    ]

    const localeToUse = locale

    // First pass: attach i18n key to matching elements (if not already attached)
    const nodes = Array.from(root.querySelectorAll('*'))
    for (const el of nodes) {
      // skip elements that contain other elements (we only want leaf text nodes)
      if (el.children && el.children.length > 0) continue
      const txt = normalize(el.textContent)
      if (!txt) continue

      // if element already annotated, update it
      const existing = (el as HTMLElement).dataset.i18nKey
      if (existing) {
        el.textContent = t(existing, localeToUse)
        continue
      }

      for (const { original, key } of map) {
        // compare against known translations (both locales) and original
        const fr = normalize(t(key, 'fr'))
        const en = normalize(t(key, 'en'))
        if (txt === normalize(original) || txt === fr || txt === en) {
          // annotate and set current locale text
          try {
            (el as HTMLElement).dataset.i18nKey = key
          } catch {
            // ignore
          }
          el.textContent = t(key, localeToUse)
          break
        }
      }
    }

    // Second pass: ensure any annotated elements are updated on locale change
    const annotated = Array.from(root.querySelectorAll('[data-i18n-key]'))
    annotated.forEach((el) => {
      const key = (el as HTMLElement).dataset.i18nKey
      if (key) el.textContent = t(key, localeToUse)
    })

    // cleanup: none
  }, [locale])

  return null
}
