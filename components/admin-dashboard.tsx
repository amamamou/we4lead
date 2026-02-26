/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'

import Sidebar from '@/components/dashboard/layout/Sidebar'
import CoreHeader from '@/components/dashboard/layout/CoreHeader'
import DashboardFooter from '@/components/dashboard/layout/DashboardFooter'
import { LayoutDashboard } from 'lucide-react'
import { Stethoscope, Clock, University, Users, AlertTriangle } from './ui/icons'
import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ProfileTab } from '@/components/dashboard/layout/profile-tab'


// Use the default University icon without applying any custom stroke/opacity.
// This keeps the icon consistent with the app-wide `University` component.
const UniversitySmall: React.FC<{ size?: number } & React.SVGProps<SVGSVGElement>> = (props) => {
  const size = (props as any)?.size ?? 28
  return React.createElement(
    University as React.ComponentType<Record<string, unknown>>,
    { ...(props as Record<string, unknown>), width: size, height: size },
  )
}

// Using lucide-react's UserCog icon for person+settings

import { AdminOverview } from './admin/admin-overview'
import { DataTable } from './admin/data-table'
import AdminModals from './admin/admin-modals'
import demandesApi from '@/services/demandesApi'
import { useSearch } from '@/contexts/SearchContext'

type NavType = 'overview' | 'doctors' | 'students' | 'appointments' | 'institutes' | 'admins' | 'demandes' | 'account'

interface AdminDashboardProps {
  isSuperAdmin?: boolean
  userName?: string
}

interface Universite {
  id: number
  nom: string
  ville: string
  adresse: string
  telephone: string
  nbEtudiants?: number
  horaire?: string
  logoPath?: string
  code?: string
  logoFile?: File
}

interface Admin {
  id: string
  nom: string
  prenom: string
  email: string
  telephone?: string
  universite?: { 
    id: number
    nom: string
    ville?: string
    code?: string
  } 
  photoUrl?: string | null
}

export default function AdminDashboard({
  isSuperAdmin = false,
  userName = 'Admin User',
}: AdminDashboardProps) {
  const [activeNav, setActiveNav] = useState<NavType>('overview')
  const { focusTarget, clearFocus } = useSearch()
  const [loading, setLoading] = useState(true)

  // Listen to global search focus events and open the matching admin nav.
  useEffect(() => {
    if (!focusTarget) return
    if (focusTarget.kind === 'nav') {
      const v = focusTarget.value as NavType
      const allowed: NavType[] = ['overview', 'doctors', 'students', 'appointments', 'institutes', 'admins', 'demandes', 'account']
      if (allowed.includes(v)) {
        setActiveNav(v)
      }
    }
    // Clear to avoid repeated handling
    clearFocus()
  }, [focusTarget, clearFocus])

  // Data
  const [doctorsData, setDoctorsData] = useState<Medecin[]>([])
  const [etudiantsData, setEtudiantsData] = useState<Etudiant[]>([])
  const [universitesData, setUniversitesData] = useState<Universite[]>([])
  const [adminsData, setAdminsData] = useState<Admin[]>([])
  const [demandesData, setDemandesData] = useState<any[]>([])
const [appointmentsData, setAppointmentsData] = useState<any[]>([]);
// Client-only header state to avoid SSR crash when accessing localStorage
const [facultyName, setFacultyName] = useState('Université')
const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<Admin | null>(null)

  // Doctors modal
  const [doctorModalOpen, setDoctorModalOpen] = useState(false)
  const [doctorModalMode, setDoctorModalMode] = useState<'add' | 'edit' | 'show' | 'delete-warning'>('show')
  const [doctorItem, setDoctorItem] = useState<Partial<Medecin>>({})
  const [selectedDoctorUniversiteIds, setSelectedDoctorUniversiteIds] = useState<number[]>([])

  // Student modal
  const [studentModalOpen, setStudentModalOpen] = useState(false)
  const [studentModalMode, setStudentModalMode] = useState<'add' | 'edit' | 'show'>('show')
  const [studentItem, setStudentItem] = useState<Partial<Etudiant>>({})
  const [selectedStudentUniversiteId, setSelectedStudentUniversiteId] = useState<number | ''>('')

  // University modal
  const [universiteModalOpen, setUniversiteModalOpen] = useState(false)
  const [universiteModalMode, setUniversiteModalMode] = useState<'add' | 'edit' | 'show'>('show')
  const [universiteItem, setUniversiteItem] = useState<Partial<Universite>>({})

  // Admin modal
  const [adminModalOpen, setAdminModalOpen] = useState(false)
  const [adminModalMode, setAdminModalMode] = useState<'add' | 'edit' | 'show'>('show')
  const [adminItem, setAdminItem] = useState<Partial<Admin>>({})
  const [selectedAdminUniversiteId, setSelectedAdminUniversiteId] = useState<number | ''>('')

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deleteItem, setDeleteItem] = useState<any>(null)
    const [deleteType, setDeleteType] = useState<'doctor' | 'etudiant' | 'universite' | 'admin' | 'rdv' | null>(null)
    const [deleteMessage, setDeleteMessage] = useState('')
// Appointments modal states
const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
const [appointmentModalMode, setAppointmentModalMode] = useState<'add' | 'edit' | 'show'>('add');
const [appointmentItem, setAppointmentItem] = useState<any>({});

  // Demande detail modal
  const [demandeModalOpen, setDemandeModalOpen] = useState(false)
  const [demandeItem, setDemandeItem] = useState<any>(null)

  // ────────────────────────────────────────────────
  // Fetching logic
  // ────────────────────────────────────────────────
  // Loader functions so each DataTable can refresh only its own dataset.
  const loadDoctors = async () => {
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) return
    try {
      const universityId = localStorage.getItem('universityId')
      let doctorsUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins`
      if (!isSuperAdmin && universityId) {
        doctorsUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins/universite/${universityId}`
      }
      const res = await fetch(doctorsUrl, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed doctors')
      const data = await res.json()
      setDoctorsData(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching doctors:', err)
    }
  }

  const loadEtudiants = async () => {
  const token = localStorage.getItem('supabaseAccessToken')
  if (!token) return
  try {
    const universityId = localStorage.getItem('universityId')
    let etudiantsUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/users`
    if (!isSuperAdmin && universityId) {
      etudiantsUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/users`
    }
    const res = await fetch(etudiantsUrl, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) throw new Error('Failed students')
    const data = await res.json()
    // ✅ Filtrer pour exclure les médecins
    const filteredData = Array.isArray(data) 
      ? data.filter((user: any) => user.role !== 'MEDECIN')
      : []
    setEtudiantsData(filteredData)
  } catch (err) {
    console.error('Error fetching students:', err)
  }
}

  const loadUniversites = async () => {
    if (!isSuperAdmin) return
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/universites`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed universites')
      const data = await res.json()
      setUniversitesData(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching universités:', err)
    }
  }

  const loadAdmins = async () => {
    if (!isSuperAdmin) return
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) return
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/admins`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed admins')
      const data = await res.json()
      setAdminsData(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching admins:', err)
    }
  }

  const loadDemandes = async () => {
    if (!isSuperAdmin) return

    const token = localStorage.getItem('supabaseAccessToken')

    // First try the superadmin-only endpoint (requires Authorization).
    if (token) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/demandes`, { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          const list = Array.isArray(data) ? data.map((d: any) => ({
            ...d,
            medecin: `${d.medecinPrenom ?? ''} ${d.medecinNom ?? ''}`.trim(),
            etudiant: `${d.etudiantPrenom ?? ''} ${d.etudiantNom ?? ''}`.trim(),
            universite: d.universiteNom ?? d.universite?.nom ?? ''
          })) : []
          setDemandesData(list)
          return
        }

        // If the superadmin endpoint failed, capture details then fallthrough to public API.
        const text = await res.text().catch(() => '')
        console.warn(`superadmin/demandes responded ${res.status}: ${text}`)
      } catch (err) {
        console.warn('Error calling superadmin/demandes:', err)
      }
    }

    // Fallback: try the public '/demandes/all' endpoint. If we have a token,
    // send it (some backends require auth even for this route); otherwise use the
    // client service which attempts an unauthenticated fetch.
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
            // last-resort: try the public service helper (may still 401)
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
        medecin: `${d.medecinPrenom ?? ''} ${d.medecinNom ?? ''}`.trim(),
        etudiant: `${d.etudiantPrenom ?? ''} ${d.etudiantNom ?? ''}`.trim(),
        universite: d.universiteNom ?? d.universite?.nom ?? ''

      })) : []
      setDemandesData(list)
    } catch (err) {
      // Ensure we do not throw here: log for debugging and show empty list.
      console.error('Error fetching demandes (public fallback):', err)
      setDemandesData([])
    }
  }

  const loadAppointments = async () => {
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) return
    try {
      const universityId = localStorage.getItem('universityId')
      let appointmentsUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/rdvs`
      if (!isSuperAdmin && universityId) appointmentsUrl += `/universite/${universityId}`
      const res = await fetch(appointmentsUrl, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed appointments')
      const data = await res.json()
      setAppointmentsData(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Appointments fetch error:', err)
    }
  }

  useEffect(() => {
    setLoading(true)
    Promise.allSettled([loadDoctors(), loadEtudiants(), loadUniversites(), loadAdmins(), loadAppointments(), loadDemandes()])
      .finally(() => setLoading(false))
  }, [isSuperAdmin])

  // Hydration-safe read of university name from localStorage
  useEffect(() => {
    setMounted(true)

    try {
      const name = localStorage.getItem('universityName')
      if (name) setFacultyName(name)
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try { setProfile(JSON.parse(storedUser)) } catch (_) { setProfile(null) }
      }
    } catch (e) {
      // ignore if localStorage is not available
    }
  }, [])

  // ────────────────────────────────────────────────
  // Shared Delete Confirmation
  // ────────────────────────────────────────────────
  const openDeleteModal = (
    type: 'doctor' | 'etudiant' | 'universite' | 'admin' | 'rdv',
    item: any
  ) => {
    setDeleteType(type);
    setDeleteItem(item);

    let msg = '';
    if (type === 'doctor') {
      msg = `Voulez-vous vraiment supprimer le praticien ${item.prenom} ${item.nom} ?`;
    } else if (type === 'etudiant') {
      msg = `Voulez-vous vraiment supprimer l'étudiant ${item.prenom} ${item.nom} ?`;
    } else if (type === 'universite') {
      msg = `Voulez-vous vraiment supprimer l'université ${item.nom} ?`;
    } else if (type === 'admin') {
      msg = `Voulez-vous vraiment supprimer l'administrateur ${item.prenom} ${item.nom} ?`;
    } else if (type === 'rdv') {
      msg = `Voulez-vous vraiment supprimer le rendez-vous du ${item.date || '?'} à ${item.heure || '?'} ?`;
    }

    setDeleteMessage(msg);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
  if (!deleteItem || !deleteType) return;

  const token = localStorage.getItem('supabaseAccessToken');
  if (!token) {
    alert('Token manquant');
    setDeleteModalOpen(false);
    return;
  }

  let url = '';
  let onSuccess: () => void = () => {};

  if (deleteType === 'doctor') {
    url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins/${deleteItem.id}?forceCascade=true`;
    onSuccess = () => setDoctorsData(prev => prev.filter(d => d.id !== deleteItem.id));
  } else if (deleteType === 'etudiant') {
    url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/etudiants/${deleteItem.id}`;
    onSuccess = () => setEtudiantsData(prev => prev.filter(e => e.id !== deleteItem.id));
  } else if (deleteType === 'universite') {
    url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/universites/${deleteItem.id}`;
    onSuccess = () => setUniversitesData(prev => prev.filter(u => u.id !== deleteItem.id));
  } else if (deleteType === 'admin') {
    url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/admins/${deleteItem.id}`;
    onSuccess = () => setAdminsData(prev => prev.filter(a => a.id !== deleteItem.id));
  } else if (deleteType === 'rdv') {
    url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/rdvs/${deleteItem.id}`;
    onSuccess = () => 
      setAppointmentsData(prev => prev.filter(r => r.id !== deleteItem.id));
  }

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'Échec de la suppression');
    }

    onSuccess();
    setDeleteModalOpen(false);
  } catch (err: any) {
    console.error(err);
    alert(err.message || 'Erreur lors de la suppression');
  }
};
  // ────────────────────────────────────────────────
  // Doctors CRUD
  // ────────────────────────────────────────────────
  const openDoctorModal = (mode: typeof doctorModalMode, item?: Partial<Medecin>) => {
    setDoctorModalMode(mode)
    setDoctorItem(
      mode === 'add'
        ? { nom: '', prenom: '', email: '', telephone: '' }
        : (item ?? {})
    )
    if (mode === 'edit' && item?.universites && item.universites.length > 0) {
      setSelectedDoctorUniversiteIds(item.universites.map(u => u.id))
    } else {
      setSelectedDoctorUniversiteIds([])
    }
    setDoctorModalOpen(true)
  }

  const closeDoctorModal = () => {
    setDoctorModalOpen(false)
    setSelectedDoctorUniversiteIds([])
    setTimeout(() => setDoctorItem({}), 300)
  }

  const saveDoctor = async () => {
  const token = localStorage.getItem('supabaseAccessToken')
  if (!token) return alert('Token manquant')

  // Déterminer l'URL selon le mode
  const url = doctorModalMode === 'add'
    ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins`
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins/${doctorItem.id}`

  try {
    const formData = new FormData()
    
    // Champs texte (toujours envoyés, même en édition)
    if (doctorItem.nom?.trim()) {
      formData.append('nom', doctorItem.nom.trim())
    }
    if (doctorItem.prenom?.trim()) {
      formData.append('prenom', doctorItem.prenom.trim())
    }
    if (doctorItem.email?.trim()) {
      formData.append('email', doctorItem.email.trim())
    }
    if (doctorItem.telephone?.trim()) {
      formData.append('telephone', doctorItem.telephone.trim())
    }
    
    // Spécialité
    const specialite = String((doctorItem as any).specialite || (doctorItem as any).specialty || '').trim()
    if (specialite) {
      formData.append('specialite', specialite)
    }
    
    // Genre et situation
    if (doctorItem.genre) {
      formData.append('genre', doctorItem.genre)
    }
    if (doctorItem.situation) {
      formData.append('situation', doctorItem.situation)
    }
    
    // ✅ Gestion des universiteIds - PRIORISER selectedDoctorUniversiteIds
    let universiteIds: number[] = []
    
    if (selectedDoctorUniversiteIds && selectedDoctorUniversiteIds.length > 0) {
      // Si l'utilisateur a sélectionné des universités dans le modal, les utiliser
      universiteIds = selectedDoctorUniversiteIds
    } else if (doctorItem.universites) {
      // Sinon, utiliser les universités existantes
      universiteIds = (doctorItem.universites as any[]).map(u => u.id)
    }
    
    // Envoyer les universiteIds (toujours requis)
    if (universiteIds.length > 0) {
      // ✅ ENVOYER EN JSON STRING (attendu par le backend)
      formData.append('universiteIds', JSON.stringify(universiteIds))
    } else {
      return alert('Veuillez sélectionner au moins une université')
    }
    
    // Photo (optionnelle) - seulement si une nouvelle photo a été sélectionnée
    if (doctorItem.photoFile) {
      formData.append('photo', doctorItem.photoFile)
    }

    // Log pour debug
    console.log('=== ENVOI ÉDITION ===')
    console.log('URL:', url)
    console.log('Méthode:', doctorModalMode === 'add' ? 'POST' : 'PUT')
    console.log('ID:', doctorItem.id)
    console.log('Nom:', doctorItem.nom)
    console.log('Prénom:', doctorItem.prenom)
    console.log('Email:', doctorItem.email)
    console.log('Téléphone:', doctorItem.telephone)
    console.log('Spécialité:', specialite)
    console.log('Genre:', doctorItem.genre)
    console.log('Situation:', doctorItem.situation)
    console.log('Université IDs (JSON):', JSON.stringify(universiteIds))
    console.log('Photo présente:', !!doctorItem.photoFile)

    const res = await fetch(url, {
      method: doctorModalMode === 'add' ? 'POST' : 'PUT',
      headers: { 
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('❌ Erreur réponse:', errText)
      
      try {
        const errJson = JSON.parse(errText)
        throw new Error(errJson.error || errJson.message || 'Erreur lors de la sauvegarde')
      } catch {
        throw new Error(errText || 'Erreur lors de la sauvegarde')
      }
    }

    const saved = await res.json()
    console.log('✅ Sauvegarde réussie:', saved)

    // Rafraîchir la liste
    await loadDoctors()
    closeDoctorModal()
    
  } catch (err: any) {
    console.error('❌ Erreur complète:', err)
    alert(err.message || 'Erreur lors de la sauvegarde')
  }
}
  const handleDeleteDoctor = (item: Medecin) => {
    if (item.rdvs?.length > 0) {
      setDoctorItem(item)
      setDoctorModalMode('delete-warning')
      setDoctorModalOpen(true)
    } else {
      openDeleteModal('doctor', item)
    }
  }

  // ────────────────────────────────────────────────
  // Students CRUD
  // ────────────────────────────────────────────────
  const openStudentModal = (mode: typeof studentModalMode, item?: Partial<Etudiant>) => {
    setStudentModalMode(mode)
    setStudentItem(
      mode === 'add'
        ? { nom: '', prenom: '', email: '', telephone: '' }
        : (item ?? {})
    )
    setSelectedStudentUniversiteId(
      mode === 'add' 
        ? '' 
        : (item?.universite?.id || '')
    )
    setStudentModalOpen(true)
  }

  const closeStudentModal = () => {
    setStudentModalOpen(false)
    setSelectedStudentUniversiteId('')
    setTimeout(() => setStudentItem({}), 300)
  }

  const saveStudent = async () => {
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) return alert('Token manquant')

    if (!studentItem.nom?.trim() || !studentItem.prenom?.trim() || !studentItem.email?.trim()) {
      return alert('Nom, prénom et email sont obligatoires')
    }

    if (studentModalMode === 'add' && !selectedStudentUniversiteId) {
      return alert('Veuillez sélectionner une université pour l\'étudiant')
    }

    const payload: any = {
      nom: studentItem.nom.trim(),
      prenom: studentItem.prenom.trim(),
      email: studentItem.email.trim(),
      telephone: studentItem.telephone?.trim() || undefined,
    }

    if (studentModalMode === 'add') {
      payload.universiteId = selectedStudentUniversiteId
    }

    const url = studentModalMode === 'add'
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/etudiants`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/etudiants/${studentItem.id}`

    try {
      const res = await fetch(url, {
        method: studentModalMode === 'add' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || 'Échec de la sauvegarde')
      }

      const saved = await res.json()

      if (studentModalMode === 'add') {
        setEtudiantsData(prev => [...prev, saved])
      } else {
        setEtudiantsData(prev => prev.map(e => e.id === saved.id ? saved : e))
      }

      closeStudentModal()
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Erreur lors de la sauvegarde de l\'étudiant')
    }
  }

  const handleDeleteStudent = (item: Etudiant) => {
    openDeleteModal('etudiant', item)
  }

  // ────────────────────────────────────────────────
  // Universities CRUD
  // ────────────────────────────────────────────────
  const defaultUniversite: Partial<Universite> = {
    nom: '',
    ville: '',
    adresse: '',
    telephone: '',
    nbEtudiants: undefined,
    logoPath: '',
  }

  const openUniversiteModal = (mode: typeof universiteModalMode, item?: Partial<Universite>) => {
    setUniversiteModalMode(mode)
    setUniversiteItem(mode === 'add' ? { ...defaultUniversite } : (item ?? {}))
    setUniversiteModalOpen(true)
  }

  const saveUniversite = async () => {
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) return alert('Token manquant')

    try {
      const form = new FormData()
      if (universiteItem.nom) form.append('nom', universiteItem.nom.trim())
      if (universiteItem.ville) form.append('ville', universiteItem.ville.trim())
      if (universiteItem.adresse) form.append('adresse', universiteItem.adresse.trim())
      if (universiteItem.telephone) form.append('telephone', universiteItem.telephone.trim())
  // 'code' is no longer collected from the frontend
      if (universiteItem.nbEtudiants !== undefined) {
        form.append('nbEtudiants', String(universiteItem.nbEtudiants))
      }
  // 'horaire' is intentionally not sent/collected for institutions per product decision
      if (universiteItem.logoFile) {
        form.append('logo', universiteItem.logoFile)
      }

      const url = universiteModalMode === 'add'
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/universites`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/universites/${universiteItem.id}`

      const res = await fetch(url, {
        method: universiteModalMode === 'add' ? 'POST' : 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || 'Échec de la sauvegarde')
      }

      const saved = await res.json()

      if (universiteModalMode === 'add') {
        setUniversitesData(prev => [...prev, saved])
      } else {
        setUniversitesData(prev => prev.map(u => u.id === saved.id ? saved : u))
      }

      setUniversiteModalOpen(false)
      setUniversiteItem({})
    } catch (err: any) {
      console.error('Save université error:', err)
      alert(err.message || 'Erreur lors de la sauvegarde de l\'université')
    }
  }

  // ────────────────────────────────────────────────
  // Admins CRUD
  // ────────────────────────────────────────────────
  const openAdminModal = (mode: typeof adminModalMode, item?: Partial<Admin>) => {
    setAdminModalMode(mode)
    setAdminItem(
      mode === 'add'
        ? { nom: '', prenom: '', email: '', telephone: '' }
        : (item ?? {})
    )
    setSelectedAdminUniversiteId(
      mode === 'add' 
        ? '' 
        : (item?.universite?.id || '')
    )
    setAdminModalOpen(true)
  }

  const closeAdminModal = () => {
    setAdminModalOpen(false)
    setSelectedAdminUniversiteId('')
    setAdminItem({})
  }

  const saveAdmin = async () => {
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) return alert('Token manquant')

    if (!adminItem.nom?.trim() || !adminItem.prenom?.trim() || !adminItem.email?.trim()) {
      return alert('Nom, prénom et email sont obligatoires')
    }

    if (adminModalMode === 'add' && !selectedAdminUniversiteId) {
      return alert('Veuillez sélectionner une université')
    }

    const payload: any = {
      nom: adminItem.nom.trim(),
      prenom: adminItem.prenom.trim(),
      email: adminItem.email.trim(),
      telephone: adminItem.telephone?.trim() || undefined,
    }

    if (adminModalMode === 'add') {
      payload.universiteId = selectedAdminUniversiteId
    }

    const url = adminModalMode === 'add'
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/admins`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/admins/${adminItem.id}`

    try {
      const res = await fetch(url, {
        method: adminModalMode === 'add' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || 'Échec de la sauvegarde')
      }

      const saved = await res.json()

      if (adminModalMode === 'add') {
        setAdminsData(prev => [...prev, saved])
      } else {
        setAdminsData(prev => prev.map(a => a.id === saved.id ? saved : a))
      }

      closeAdminModal()
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Erreur lors de la sauvegarde de l\'admin')
    }
  }

  // ────────────────────────────────────────────────
  // Column definitions
  // ────────────────────────────────────────────────
  const doctorsColumns = [
    { key: 'photoUrl', label: '', tdClass: 'pl-3 pr-2 sm:pl-4 sm:pr-2', render: (row: any) => {
      const fullName = `${String(row.prenom || '').trim()} ${String(row.nom || '').trim()}`.trim()
      const initials = fullName.split(' ').map((n:any)=>n[0]).slice(0,2).join('')
      const src = String(row.photoUrl || row.photo || '')
      return src
        ? (
          <img src={src} alt={fullName || 'Avatar'} className="w-10 h-10 rounded-md object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-md bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700">
            {initials}
          </div>
        )
    } },
    { key: 'nom', label: 'Nom', tdClass: 'pl-2 pr-3 sm:pl-2 sm:pr-4' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'email', label: 'Email' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'universiteDisplay', label: 'Université' },
  ]

  const studentsColumns = [
  { key: 'photoUrl', label: '', tdClass: 'pl-3 pr-2 sm:pl-4 sm:pr-2', render: (row: any) => {
    const fullName = `${String(row.prenom || '').trim()} ${String(row.nom || '').trim()}`.trim()
    const initials = fullName.split(' ').map((n:any)=>n[0]).slice(0,2).join('')
    const src = String(row.photoUrl || row.photo || '')
    return src
      ? (
        <img src={src} alt={fullName || 'Avatar'} className="w-10 h-10 rounded-md object-cover" />
      ) : (
        <div className="w-10 h-10 rounded-md bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700">
          {initials}
        </div>
      )
  } },
  { key: 'nom', label: 'Nom', tdClass: 'pl-2 pr-3 sm:pl-2 sm:pr-4' },
  { key: 'prenom', label: 'Prénom' },
  { key: 'email', label: 'Email' },
  { key: 'telephone', label: 'Téléphone' },
  { key: 'genre', label: 'Genre', render: (row: any) => {
    const g = String(row.genre || row.sexe || row.gender || '')
    if (!g) return '—'
    const map: Record<string,string> = { 'HOMME': 'Homme', 'FEMME': 'Femme', 'MALE': 'Homme', 'FEMALE': 'Femme' }
    return map[g.toUpperCase()] ?? (g.charAt(0).toUpperCase() + g.slice(1).toLowerCase())
  } },
  { 
    key: 'role', 
    label: "Rôle de l'utilisateur",
    render: (row: any) => {
      const role = String(row.role || '').toUpperCase()
      
      // Transformation des rôles selon les règles métier
      if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
        return 'Administratif'
      }
      if (role === 'PROFESSEUR' || role === 'ETUDIANT') {
        return 'Utilisateur'
      }
      return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
    }
  },
  { key: 'nombreDemandes', label: 'Nbr de demandes', sortable: true },
  { key: 'universiteDisplay', label: 'Université' },
]

  const adminsColumns = [
    { key: 'photoUrl', label: '', tdClass: 'pl-3 pr-2 sm:pl-4 sm:pr-2', render: (row: any) => {
      const fullName = `${String(row.prenom || '').trim()} ${String(row.nom || '').trim()}`.trim()
      const initials = fullName.split(' ').map((n:any)=>n[0]).slice(0,2).join('')
      const src = String(row.photoUrl || row.photo || '')
      return src
        ? (
          <img src={src} alt={fullName || 'Avatar'} className="w-10 h-10 rounded-md object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-md bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700">
            {initials}
          </div>
        )
    } },
    { key: 'nom', label: 'Nom', tdClass: 'pl-2 pr-3 sm:pl-2 sm:pr-4' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'email', label: 'Email' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'universiteDisplay', label: 'Université' },
  ]

  const institutesColumns = [
    { key: 'logoPath', label: 'Logo', render: (row: any) => {
      const src = String(row.logoPath || row.logo || row.logoUrl || row.logo_url || '/placeholder.svg')
      return (
        <img
          src={src}
          alt={String(row.nom || '')}
          className="w-8 h-8 rounded object-contain"
        />
      )
    } },
    { key: 'nom', label: 'Nom' },
    { key: 'ville', label: 'Ville' },
    { key: 'telephone', label: 'Téléphone' },
  ]

  const demandesColumns = [
    { key: 'typeSituation', label: 'Type' },
    { key: 'lieuPrincipal', label: 'Lieu' },
    { key: 'periode', label: 'Période' },
    { key: 'dateCreation', label: 'Date', sortable: true },
    { key: 'medecin', label: 'Praticien' },
   { 
    key: 'userNom', 
    label: 'Étudiant', 
    render: (row: any) => (
      <span>{row.userPrenom} {row.userNom}</span>
    )
  },
    { key: 'userRole', label: 'Rôle de l\'utilisateur' },
    { key: 'universite', label: 'Université' },
  ]

  const appointmentsColumns = [
    { key: 'doctor', label: 'Praticien' },
    { key: 'student', label: 'Étudiant' },
    { key: 'date', label: 'Date' },
    { key: 'heure', label: 'Heure' },
  ]
  const accountColumns = [
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'email', label: 'Email' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'universite', label: 'Université' },
  ]
  const openAppointmentModal = (mode: 'add' | 'edit' | 'show', item?: any) => {
  setAppointmentModalMode(mode);
  
  if (mode === 'add') {
    setAppointmentItem({
      medecinId: '',
      etudiantId: '',
      date: '',
      heure: '',
    });
  } else {
    setAppointmentItem({
      ...item,
      medecinId: item?.medecin?.id || '',
      etudiantId: item?.etudiant?.id || '',
      date: item?.date || '',
      heure: item?.heure || '',
    });
  }
  
  setAppointmentModalOpen(true);
};
const saveAppointment = async () => {
  const token = localStorage.getItem('supabaseAccessToken');
  if (!token) {
    alert('Token manquant');
    return;
  }

  // Basic validation
  if (!appointmentItem.medecinId) return alert('Médecin requis');
  if (!appointmentItem.etudiantId) return alert('Étudiant requis');
  if (!appointmentItem.date) return alert('Date requise');
  if (!appointmentItem.heure) return alert('Heure requise');

  const payload = {
    medecinId: appointmentItem.medecinId,
    etudiantId: appointmentItem.etudiantId,
    date: appointmentItem.date,
    heure: appointmentItem.heure,
    ...(appointmentModalMode === 'edit' && appointmentItem.status && {
      status: appointmentItem.status,
    }),
  };

  const url =
    appointmentModalMode === 'add'
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/rdvs`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/rdvs/${appointmentItem.id}`;

  try {
    const res = await fetch(url, {
      method: appointmentModalMode === 'add' ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || 'Échec de la sauvegarde');
    }

    const saved = await res.json();

    // Update local state (optimistic style)
    if (appointmentModalMode === 'add') {
      setAppointmentsData(prev => [...prev, saved]);
    } else {
      setAppointmentsData(prev =>
        prev.map(r => (r.id === saved.id ? saved : r))
      );
    }

    setAppointmentModalOpen(false);
  } catch (err: any) {
    console.error('Save RDV error:', err);
    alert(err.message || 'Erreur lors de la sauvegarde du rendez-vous');
  }
};
const handleDeleteAppointment = (item: any) => {
  setDeleteType('rdv');
  setDeleteItem(item);
  setDeleteMessage(
    `Voulez-vous vraiment supprimer le rendez-vous du ${item.date || '?'} à ${item.heure || '?'} ?`
  );
  setDeleteModalOpen(true);
};
 return (
  <div className="min-h-screen bg-white flex">
    <Sidebar
      fixed
      compact
      largeIcons={isSuperAdmin}
      menu={isSuperAdmin ? [
        // For super-admins we intentionally hide per-university 'Admins' and 'Sessions'
        // from the sidebar to keep the top-level view focused on institutions and users.
        { key: 'overview', label: 'Aperçu', icon: LayoutDashboard },
        { key: 'institutes', label: 'Instituts', icon: University },
        { key: 'demandes', label: 'Demandes', icon: AlertTriangle },
        { key: 'doctors', label: 'Médecins', icon: Stethoscope as any },
        { key: 'students', label: 'Utilisateurs', icon: Users },
      ] : [
        { key: 'overview', label: 'Aperçu', icon: LayoutDashboard },
        { key: 'institutes', label: 'Instituts', icon: UniversitySmall },
        { key: 'doctors', label: 'Médecins', icon: Stethoscope as any },
        { key: 'students', label: 'Utilisateurs', icon: Users },
        { key: 'appointments', label: 'Rendez-vous', icon: Clock as any },
      ]}
      activeKey={activeNav}
      onChange={(k: string) => setActiveNav(k as NavType)}
    />

    <div className={`flex-1 overflow-auto ${isSuperAdmin ? 'md:pl-[72px]' : 'md:pl-20'}`}>
      <div className="p-8 space-y-8">
        {mounted && (
          <CoreHeader
            name={userName}
            variant={isSuperAdmin ? 'super-admin' : 'admin'}
            faculty={facultyName}
            logoSrc="/icons/univ-sousse.svg"
            breadcrumbs={[
              { label: 'Tableau de bord' },
              {
                label:
                  activeNav === 'overview' ? 'Aperçu' :
                  activeNav === 'doctors' ? 'Médecins' :
                  activeNav === 'students' ? 'Utilisateurs' :
                  activeNav === 'appointments' ? 'Rendez-vous' :
                  activeNav === 'institutes' ? 'Instituts' :
                  activeNav === 'demandes' ? 'Demandes' :
                  activeNav === 'admins' ? 'Administrateurs' :
                  activeNav === 'account' ? 'Compte' :
                  activeNav
              }
            ]}
          />
        )}

        {loading ? (
          <div className="animate-pulse space-y-6">
            {/* top header skeleton */}
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main column (cards + list) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cards skeleton row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-4 bg-white dark:bg-gray-800 border rounded-md shadow-sm">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
                      <div className="h-28 bg-gray-100 dark:bg-gray-700 rounded" />
                    </div>
                  ))}
                </div>

                {/* Controls + table skeleton */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/6" />
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
                    <div className="space-y-3">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <div key={j} className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right sidebar: 'Demandes récentes' + 'Actions rapides' skeletons */}
              <aside className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4" />
                  <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, k) => (
                      <div key={k} className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded" />
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                          <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-2/3 text-sm" />
                        </div>
                        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-12" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, b) => (
                      <div key={b} className="h-10 bg-gray-100 dark:bg-gray-700 rounded w-full" />
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        ) : (
          <>
           {activeNav === 'overview' && (
  <AdminOverview 
    isSuperAdmin={isSuperAdmin} 
    onNavigate={(tab) => setActiveNav(tab as NavType)}
  />
)}
                

            {activeNav === 'doctors' && (
              <DataTable
                title="Gestion des médecins"
                data={doctorsData.map(doc => ({
                  ...doc,
                  universiteDisplay:
                    doc.universites?.length > 0
                      ? doc.universites.map(u => u.nom + (u.ville ? ` (${u.ville})` : '')).join(', ')
                      : '—'
                }))}
                columns={doctorsColumns}
                onAdd={() => openDoctorModal('add')}
                onEdit={item => openDoctorModal('edit', item)}
                onShow={item => openDoctorModal('show', item)}
                onDelete={handleDeleteDoctor}
                onExport={() => alert('Exporter praticiens')}
                onRefresh={() => loadDoctors()}
                searchPlaceholder="Rechercher un praticien par nom ou spécialité..."
              />
            )}

            {activeNav === 'students' && (
                          <DataTable
                            title="Gestion des utilisateurs"
                            data={etudiantsData.map(etudiant => ({
                              ...etudiant,
                              universiteDisplay: etudiant.universite?.nom || '—'
                            }))}
                            columns={studentsColumns}
                            onAdd={() => openStudentModal('add')}
                            onEdit={item => openStudentModal('edit', item)}
                            onShow={item => openStudentModal('show', item)}
                            onDelete={handleDeleteStudent}
                            onExport={() => alert('Exporter utilisateurs')}
                            onRefresh={() => loadEtudiants()}
                            searchPlaceholder="Rechercher un utilisateur ..."
                            hideActions={true}
                          />
                        )}

          {activeNav === 'appointments' && (
            <div className="space-y-6">
              <DataTable
                title="Gestion des consultations"
                data={appointmentsData.map(apt => ({
        id: apt.id,
        doctor: apt.medecin ? `Dr. ${apt.medecin.prenom} ${apt.medecin.nom}` : '—',
        student: apt.etudiant ? `${apt.etudiant.prenom} ${apt.etudiant.nom}` : '—',
        date: apt.date || '—',
        heure: apt.heure || '—',
        status: apt.status || 'CONFIRMED',
        statusDisplay:
          apt.status === 'CONFIRMED' ? 'Confirmé' :
          apt.status === 'CANCELED'  ? 'Annulé' : 'En attente',
        university:
          apt.medecin?.universites?.[0]?.nom ||
          apt.etudiant?.universite?.nom ||
          '—',
      }))}
      columns={[
        { key: 'doctor', label: 'Praticien', searchable: true },
        { key: 'student', label: 'Étudiant', searchable: true },
        { key: 'date', label: 'Date', sortable: true },
        { key: 'heure', label: 'Heure' },
        {
          key: 'statusDisplay',
          label: 'Statut',
          render: (row: any) => (
            <span className="text-sm text-gray-800">{row.statusDisplay}</span>
          ),
        },
        { key: 'university', label: 'Université' },
      ]}
      onAdd={() => openAppointmentModal('add')}
      onEdit={item => openAppointmentModal('edit', item)}
      onShow={item => openAppointmentModal('show', item)}
      onDelete={handleDeleteAppointment}
  onExport={() => alert('Exporter rendez‑vous')}
      onRefresh={() => loadAppointments()}
      searchPlaceholder="Rechercher par nom, date..."
      emptyMessage="Aucun rendez-vous trouvé"
    />
  </div>
)}
            {isSuperAdmin && activeNav === 'institutes' && (
              <DataTable
                title="Gestion des institutions"
                data={universitesData}
                columns={institutesColumns}
                onAdd={() => openUniversiteModal('add')}
                onEdit={i => openUniversiteModal('edit', i)}
                onShow={i => openUniversiteModal('show', i)}
                onDelete={item => openDeleteModal('universite', item)}
                onExport={() => alert('Exporter institutions')}
                onRefresh={() => loadUniversites()}
                searchPlaceholder="Rechercher une université..."
              />
            )}

            {isSuperAdmin && activeNav === 'demandes' && (
              <DataTable
                title="Gestion des demandes"
                data={demandesData.map(d => ({
                  ...d,
                  dateCreation: d.dateCreation || d.date || '',
                }))}
                columns={demandesColumns}
                onShow={(item) => { setDemandeItem(item); setDemandeModalOpen(true) }}
                onExport={() => alert('Exporter demandes')}
                onRefresh={() => loadDemandes()}
                searchPlaceholder="Rechercher une demande..."
              />
            )}

            {isSuperAdmin && activeNav === 'admins' && (
              <DataTable
                title="Gestion des administrateurs"
                data={adminsData.map(admin => ({
                  ...admin,
                  universiteDisplay: admin.universite?.nom || '—'
                }))}
                columns={adminsColumns}
                onAdd={() => openAdminModal('add')}
                onEdit={item => openAdminModal('edit', item)}
                onShow={item => openAdminModal('show', item)}
                onDelete={item => openDeleteModal('admin', item)}
                onExport={() => alert('Exporter administrateurs')}
                onRefresh={() => loadAdmins()}
                searchPlaceholder="Rechercher un administrateur..."
              />
            )}
          </>
        )}
</div>

      <AdminModals
        doctorModalOpen={doctorModalOpen}
        setDoctorModalOpen={setDoctorModalOpen}
        doctorModalMode={doctorModalMode}
        doctorItem={doctorItem}
        setDoctorItem={setDoctorItem}
    selectedDoctorUniversiteIds={selectedDoctorUniversiteIds}
    setSelectedDoctorUniversiteIds={setSelectedDoctorUniversiteIds}
        universitesData={universitesData}
        saveDoctor={saveDoctor}
        openDeleteModal={openDeleteModal}

        studentModalOpen={studentModalOpen}
        closeStudentModal={closeStudentModal}
        studentModalMode={studentModalMode}
        studentItem={studentItem}
        setStudentItem={setStudentItem}
        selectedStudentUniversiteId={selectedStudentUniversiteId}
        setSelectedStudentUniversiteId={setSelectedStudentUniversiteId}
        saveStudent={saveStudent}

        universiteModalOpen={universiteModalOpen}
        setUniversiteModalOpen={setUniversiteModalOpen}
        universiteModalMode={universiteModalMode}
        universiteItem={universiteItem}
        setUniversiteItem={setUniversiteItem}
        saveUniversite={saveUniversite}

        adminModalOpen={adminModalOpen}
        closeAdminModal={closeAdminModal}
        adminModalMode={adminModalMode}
        adminItem={adminItem}
        setAdminItem={setAdminItem}
        selectedAdminUniversiteId={selectedAdminUniversiteId}
        setSelectedAdminUniversiteId={setSelectedAdminUniversiteId}
        saveAdmin={saveAdmin}

        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        deleteMessage={deleteMessage}
        confirmDelete={confirmDelete}

        appointmentModalOpen={appointmentModalOpen}
        setAppointmentModalOpen={setAppointmentModalOpen}
        appointmentModalMode={appointmentModalMode}
        appointmentItem={appointmentItem}
        setAppointmentItem={setAppointmentItem}
        doctorsData={doctorsData}
        etudiantsData={etudiantsData}
        saveAppointment={saveAppointment}
        // Demandes detail modal props
        demandeModalOpen={demandeModalOpen}
        setDemandeModalOpen={setDemandeModalOpen}
        demandeItem={demandeItem}
        setDemandeItem={setDemandeItem}
      />

      {/* Appointment modal is rendered inside AdminModals; inline duplicate removed. */}
       

      {activeNav !== 'account' && (
        <div className="hidden sm:block px-4 pb-6">
          <DashboardFooter variant="compact" />
        </div>
      )}
    </div>
  </div>
)
}
