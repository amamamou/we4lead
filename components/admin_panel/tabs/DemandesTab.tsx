"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react'

import demandesApi from '@/services/demandesApi'
import { DataTable } from '@/components/admin/data-table'

interface Demande {
  id: string
  typeSituation?: string
  description?: string
  lieuPrincipal?: string
  periode?: string
  dateCreation?: string
  date?: string
  medecin?: string
  userPrenom?: string
  userNom?: string
  userRole?: string
  universite?: string
}

export default function DemandesTab() {
  const [demandesData, setDemandesData] = useState<Demande[]>(() => {
    try {
      const cached = sessionStorage.getItem('tabs:demandes')
      return cached ? JSON.parse(cached) : []
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(false)



  const loadDemandes = async () => {
    setLoading(true)
    const token = localStorage.getItem('supabaseAccessToken')

    // Try superadmin endpoint first (requires a token). If it fails, fall back
    // to the public /demandes/all endpoint or the `demandesApi` helper.
    if (token) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/demandes`, { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          const list = Array.isArray(data) ? data.map((d: any) => ({
            ...d,
            dateCreation: d.dateCreation || d.date || d.createdAt || '',
            medecin: `${d.medecinPrenom ?? d.medecin?.prenom ?? ''} ${d.medecinNom ?? d.medecin?.nom ?? ''}`.trim(),
            userPrenom: d.etudiantPrenom ?? d.userPrenom ?? d.prenom ?? '',
            userNom: d.etudiantNom ?? d.userNom ?? d.nom ?? '',
            userRole: d.userRole ?? d.role ?? '',
            universite: d.universiteNom ?? d.universite?.nom ?? ''
          })) : []
          setDemandesData(list)
          try { sessionStorage.setItem('tabs:demandes', JSON.stringify(list)) } catch { }
          return
        }

        const text = await res.text().catch(() => '')
        console.warn(`superadmin/demandes responded ${res.status}: ${text}`)
      } catch (err) {
        console.warn('Error calling superadmin/demandes:', err)
      }
    }

    // Public fallback
    try {
      let publicList: any[] = []

      if (token) {
        try {
          const res2 = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/demandes/all`, { headers: { Authorization: `Bearer ${token}` } })
          if (res2.ok) {
            publicList = await res2.json()
          } else {
            const text = await res2.text().catch(() => '')
            console.warn(`/demandes/all responded ${res2.status}: ${text}`)
            publicList = await demandesApi.getAllDemandes()
          }
        } catch (err) {
          console.warn('Error calling /demandes/all with token, falling back to public helper:', err)
          publicList = await demandesApi.getAllDemandes()
        }
      } else {
        publicList = await demandesApi.getAllDemandes()
      }

      const list = Array.isArray(publicList) ? publicList.map((d: any) => ({
        ...d,
        dateCreation: d.dateCreation || d.date || d.createdAt || '',
        medecin: `${d.medecinPrenom ?? d.medecin?.prenom ?? ''} ${d.medecinNom ?? d.medecin?.nom ?? ''}`.trim(),
        userPrenom: d.etudiantPrenom ?? d.userPrenom ?? d.prenom ?? '',
        userNom: d.etudiantNom ?? d.userNom ?? d.nom ?? '',
        userRole: d.userRole ?? d.role ?? '',
        universite: d.universiteNom ?? d.universite?.nom ?? ''
      })) : []
  setDemandesData(list)
  try { sessionStorage.setItem('tabs:demandes', JSON.stringify(list)) } catch { }
    } catch (err) {
      console.error('loadDemandes', err)
      setDemandesData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // run async loader inside effect to avoid calling setState directly in the top-level effect body
    const run = async () => { await loadDemandes() }
    run()
  }, [])

  const demandesColumns = [
    { key: 'typeSituation', label: 'Type', render: (row: Demande) => {
      const LABELS_FR: Record<string, string> = {
        'HARCÈLEMENT': 'Harcèlement',
        'DISCRIMINATION': 'Discrimination',
        'VIOLENCE': 'Violence',
        'DIFFICULTÉS_ACADÉMIQUES': 'Difficultés académiques',
        'PROBLÈMES_ADMINISTRATIFS': 'Problèmes administratifs',
        'AUTRE': 'Autre'
      }

      const raw = String(row.typeSituation || '')
      return (<span>{LABELS_FR[raw] ?? row.typeSituation ?? '—'}</span>)
    } },
    { key: 'lieuPrincipal', label: 'Lieu' },
    { key: 'periode', label: 'Période' },
    
    { key: 'medecin', label: 'Intervenant' },
  { key: 'userNom', label: 'Utilisateur', render: (row: Demande) => (<span>{row.userPrenom} {row.userNom}</span>) },
    { key: 'userRole', label: "Rôle", render: (row: Demande) => {
      const r = String(row.userRole || row.userRole || '').toUpperCase()
      if (r === 'SUPER_ADMIN' || r === 'ADMIN' || r === 'SUPER-ADMIN' || r === 'SUPER_ADMIN') return 'ADMINISTRATIF'
      // Keep other roles as-is (preserve backend casing)
      return r || '—'
    } },
  { key: 'universite', label: 'Institution' },
    {
      key: 'dateCreation',
      label: 'Date',
      sortable: true,
      render: (row: Demande) => {
        const raw = row.dateCreation || row.date || ''
        if (!raw) return (<span className="text-muted">—</span>)

        const d = new Date(raw)
        if (isNaN(d.getTime())) return (<span>{raw}</span>)

        const now = Date.now()
        const diffSec = Math.floor((now - d.getTime()) / 1000)

        // Recent: relative (French)
        if (diffSec < 60) return (<span title={d.toISOString()}>il y a {diffSec} seconde{diffSec > 1 ? 's' : ''}</span>)
        if (diffSec < 3600) {
          const m = Math.floor(diffSec / 60)
          return (<span title={d.toISOString()}>il y a {m} minute{m > 1 ? 's' : ''}</span>)
        }
        if (diffSec < 86400) {
          const h = Math.floor(diffSec / 3600)
          return (<span title={d.toISOString()}>il y a {h} heure{h > 1 ? 's' : ''}</span>)
        }
        if (diffSec < 7 * 86400) {
          const days = Math.floor(diffSec / 86400)
          return (<span title={d.toISOString()}>il y a {days} jour{days > 1 ? 's' : ''}</span>)
        }

        // Older: localized date + time (French)
        const formatted = d.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' })
        return (<span title={d.toISOString()}>{formatted}</span>)
      }
    },
  ]

  return (
    <DataTable
      title="Gestion des demandes"
      data={demandesData.map((d) => ({ ...d, dateCreation: d.dateCreation || d.date || '' }))}
      columns={demandesColumns}
      onRefresh={() => loadDemandes()}
      loading={loading}
      hideActions={true}
      searchPlaceholder="Rechercher une demande..."
    />
  )
}
