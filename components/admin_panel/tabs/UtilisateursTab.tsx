"use client"

import React, { useEffect, useState } from 'react'
import { DataTable } from '@/components/admin/data-table'

interface User {
  id?: string
  prenom?: string
  nom?: string
  photoUrl?: string
  photo?: string
  role?: string
  genre?: string
  sexe?: string
  gender?: string
  universite?: { nom?: string }
}

export default function UtilisateursTab() {
  const [studentsData, setStudentsData] = useState<User[]>(() => {
    try { const s = sessionStorage.getItem('tabs:users'); return s ? JSON.parse(s) : [] } catch { return [] }
  })
  const [loading, setLoading] = useState(false)

  const loadStudents = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('supabaseAccessToken')
      if (!token) return
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/users`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) {
        setStudentsData([])
        return
      }
      const data = await res.json()
      const arr = Array.isArray(data) ? (data as User[]) : []
      const filtered = arr.filter((u) => u.role !== 'MEDECIN')
      setStudentsData(filtered)
      try { sessionStorage.setItem('tabs:users', JSON.stringify(filtered)) } catch { }
    } catch (err) {
      console.error('loadStudents', err)
      setStudentsData([])
    } finally { setLoading(false) }
  }

  useEffect(() => { const run = async () => { await loadStudents() }; run() }, [])

  const studentsColumns = [
    { key: 'photoUrl', label: '', tdClass: 'pl-3 pr-2 sm:pl-4 sm:pr-2', render: (row: User) => {
      const fullName = `${String(row.prenom || '').trim()} ${String(row.nom || '').trim()}`.trim()
      const initials = fullName.split(' ').map((n:string)=>n[0]).slice(0,2).join('')
      const src = String(row.photoUrl || row.photo || '')
      return src
        ? (<img src={src} alt={fullName || 'Avatar'} className="w-10 h-10 rounded-md object-cover" />)
        : (<div className="w-10 h-10 rounded-md bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700">{initials}</div>)
    } },
    { key: 'nom', label: 'Nom', tdClass: 'pl-2 pr-3 sm:pl-2 sm:pr-4' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'email', label: 'Email' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'genre', label: 'Genre', render: (row: User) => {
      const g = String(row.genre || row.sexe || row.gender || '')
      if (!g) return '—'
      const map: Record<string,string> = { 'HOMME': 'Homme', 'FEMME': 'Femme', 'MALE': 'Homme', 'FEMALE': 'Femme' }
      return map[g.toUpperCase()] ?? (g.charAt(0).toUpperCase() + g.slice(1).toLowerCase())
    } },
    { key: 'role', label: "Rôle", render: (row: User) => {
      const role = String(row.role || '').toUpperCase()
      if (role === 'SUPER_ADMIN' || role === 'ADMIN') return 'Administratif'
      if (role === 'PROFESSEUR' || role === 'ETUDIANT') return 'Utilisateur'
      return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    } },
    { key: 'nombreDemandes', label: 'Demandes', sortable: true },
    { key: 'universiteDisplay', label: 'Université' },
  ]

  return (
    <DataTable
      title="Gestion des utilisateurs"
      data={studentsData.map((s) => ({ ...s, universiteDisplay: s.universite?.nom || '—' }))}
      columns={studentsColumns}
      onRefresh={() => loadStudents()}
      loading={loading}
      searchPlaceholder="Rechercher un utilisateur ..."
      hideActions={true}
    />
  )
}
