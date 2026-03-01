"use client"

import React, { useEffect, useState } from 'react'
import { DataTable } from '@/components/admin/data-table'

interface Institute {
  id?: string
  nom?: string
  ville?: string
  telephone?: string
  logo?: string
  logoPath?: string
}
export default function InstitutesTab(props: { data?: Institute[], loading?: boolean, onRefresh?: () => void, onShow?: (i: Institute) => void, onEdit?: (i: Institute) => void, onDelete?: (i: Institute) => void, onAdd?: () => void }) {
  const { data, loading: extLoading, onRefresh, onShow, onEdit, onDelete, onAdd } = props

  const [institutesData, setInstitutesData] = useState<Institute[]>(() => {
    try { const s = sessionStorage.getItem('tabs:institutes'); return s ? JSON.parse(s) : [] } catch { return [] }
  })
  const [loading, setLoading] = useState(false)

  const loadInstitutes = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('supabaseAccessToken')
      if (!token) return
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/universites`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) {
        setInstitutesData([])
        return
      }
      const data = await res.json()
      const arr = Array.isArray(data) ? data : []
      setInstitutesData(arr)
      try { sessionStorage.setItem('tabs:institutes', JSON.stringify(arr)) } catch { }
    } catch (err) {
      console.error('loadInstitutes', err)
      setInstitutesData([])
    } finally { setLoading(false) }
  }

  useEffect(() => {
    if (data && data.length > 0) return
    const run = async () => { await loadInstitutes() }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Provide basic action handlers so the DataTable shows action buttons when parent doesn't supply them
  const handleShow = (item: Institute) => { try { const name = String(item.nom || item.id || 'Institution'); alert(`Afficher: ${name}`) } catch {} }
  const handleEdit = (item: Institute) => { try { const name = String(item.nom || item.id || 'Institution'); alert(`Modifier: ${name}`) } catch {} }
  const handleDelete = (item: Institute) => { try { const name = String(item.nom || item.id || 'Institution'); if (!confirm(`Supprimer ${name} ?`)) return; setInstitutesData(prev => { const next = prev.filter(i => String(i.id) !== String(item.id)); try { sessionStorage.setItem('tabs:institutes', JSON.stringify(next)) } catch {} return next }) } catch (err) { console.error(err) } }

  const institutesColumns = [
    { key: 'logoPath', label: 'Logo', render: (row: Institute) => {
      const r = row as unknown as Record<string, unknown>
      const src = String(r['logoPath'] || r['logo'] || r['logoUrl'] || r['logo_url'] || '/placeholder.svg')
      return (<img src={src} alt={String(row.nom || '')} className="w-8 h-8 rounded object-contain" />)
    } },
    { key: 'nom', label: 'Nom' },
    { key: 'ville', label: 'Ville' },
    { key: 'telephone', label: 'Téléphone' },
  ]

  return (
    <DataTable
      title="Gestion des institutions"
  data={(data ?? institutesData) as unknown as Record<string, unknown>[]}
      columns={institutesColumns}
      onRefresh={() => { if (onRefresh) return onRefresh(); return loadInstitutes() }}
      onShow={(item) => { if (onShow) return onShow(item as Institute); return handleShow(item as Institute) }}
      onEdit={(item) => { if (onEdit) return onEdit(item as Institute); return handleEdit(item as Institute) }}
      onDelete={(item) => { if (onDelete) return onDelete(item as Institute); return handleDelete(item as Institute) }}
      onAdd={onAdd}
      loading={extLoading ?? loading}
      searchPlaceholder="Rechercher une université..."
    />
  )
}
