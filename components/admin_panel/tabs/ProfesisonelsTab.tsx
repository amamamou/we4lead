"use client"

import React, { useEffect, useState } from 'react'
import { DataTable } from '@/components/admin/data-table'

interface Doctor {
  id?: string
  prenom?: string
  nom?: string
  photoUrl?: string
  photo?: string
  universites?: { nom?: string; ville?: string }[]
  specialite?: string
}
type Props = {
  data?: Doctor[]
  loading?: boolean
  onRefresh?: () => void
  onShow?: (item: Doctor) => void
  onEdit?: (item: Doctor) => void
  onDelete?: (item: Doctor) => void
  onAdd?: () => void
}

export default function ProfessionelsTab(props: Props) {
  const { data, loading: extLoading, onRefresh, onShow, onEdit, onDelete, onAdd } = props

  const [doctorsData, setDoctorsData] = useState<Doctor[]>(() => {
    try { const s = sessionStorage.getItem('tabs:doctors'); return s ? JSON.parse(s) : [] } catch { return [] }
  })
  const [loading, setLoading] = useState(false)

  const loadDoctors = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('supabaseAccessToken')
      if (!token) return
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) {
        setDoctorsData([])
        return
      }
      const data = await res.json()
      const arr = Array.isArray(data) ? data : []
      setDoctorsData(arr)
      try { sessionStorage.setItem('tabs:doctors', JSON.stringify(arr)) } catch { }
    } catch (err) {
      console.error('loadDoctors', err)
      setDoctorsData([])
    } finally { setLoading(false) }
  }

  // If no external data provided, auto-load doctors locally
  useEffect(() => {
    if (data && data.length > 0) return
    const run = async () => { await loadDoctors() }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Simple handlers so the DataTable shows action buttons when parent doesn't provide them.
  const handleShow = (item: Doctor) => { try { const name = `${item.prenom ?? ''} ${item.nom ?? ''}`.trim() || item.id || 'Praticien'; alert(`Afficher: ${name}`) } catch {} }
  const handleEdit = (item: Doctor) => { try { const name = `${item.prenom ?? ''} ${item.nom ?? ''}`.trim() || item.id || 'Praticien'; alert(`Modifier: ${name}`) } catch {} }
  const handleDelete = (item: Doctor) => { try { const name = `${item.prenom ?? ''} ${item.nom ?? ''}`.trim() || item.id || 'Praticien'; if (!confirm(`Supprimer ${name} ?`)) return; setDoctorsData(prev => { const next = prev.filter(d => String(d.id) !== String(item.id)); try { sessionStorage.setItem('tabs:doctors', JSON.stringify(next)) } catch {} return next }) } catch (err) { console.error(err) } }

  const doctorsColumns = [
    { key: 'photoUrl', label: 'Photo', tdClass: 'pl-3 pr-2 sm:pl-4 sm:pr-2', render: (row: Doctor) => {
      const fullName = `${String(row.prenom || '').trim()} ${String(row.nom || '').trim()}`.trim()
      const initials = fullName.split(' ').map((n:string)=>n[0]).slice(0,2).join('')
      const src = String(row.photoUrl || row.photo || '')
      return src
        ? (<img src={src} alt={fullName || 'Avatar'} className="w-10 h-10 rounded-md object-cover" />)
        : (<div className="w-10 h-10 rounded-md bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700">{initials}</div>)
    } },
    { key: 'nom', label: 'Nom', tdClass: 'pl-2 pr-3 sm:pl-2 sm:pr-4' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'specialite', label: 'Spécialité' },
    { key: 'email', label: 'Email' },
    { key: 'telephone', label: 'Téléphone' },
  { key: 'universiteDisplay', label: 'Institution' },
  ]

  return (
    <DataTable
      title="Gestion des intervenants"
      data={(data ?? doctorsData).map(doc => ({
        ...doc,
        universiteDisplay: doc.universites && doc.universites.length > 0 ? doc.universites.map((u) => (u.nom || '') + (u.ville ? ` (${u.ville})` : '')).join(', ') : '—'
      }))}
      columns={doctorsColumns}
      onRefresh={() => { if (onRefresh) return onRefresh(); return loadDoctors() }}
      onShow={(item) => { if (onShow) return onShow(item as Doctor); return handleShow(item as Doctor) }}
      onEdit={(item) => { if (onEdit) return onEdit(item as Doctor); return handleEdit(item as Doctor) }}
      onDelete={(item) => { if (onDelete) return onDelete(item as Doctor); return handleDelete(item as Doctor) }}
      loading={extLoading ?? loading}
      onAdd={onAdd}
      searchPlaceholder="Rechercher un intervenant par nom ou spécialité..."
    />
  )
}
