/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect } from 'react'

import Sidebar from '@/components/dashboard/layout/Sidebar'
import CoreHeader from '@/components/dashboard/layout/CoreHeader'
import DashboardFooter from '@/components/dashboard/layout/DashboardFooter'
import { LayoutDashboard, UserCog, GraduationCap } from 'lucide-react'
import { Stethoscope, Clock, University } from './ui/icons'
import React from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ProfileTab } from '@/components/dashboard/layout/profile-tab'


const UniversityThin: React.FC<{ size?: number } & React.SVGProps<SVGSVGElement>> = (props) => {
  const { size: _s, ...rest } = props as any
  const size = 28
  return <University width={size} height={size} strokeWidth={1.4} {...rest} />
}

// Using lucide-react's UserCog icon for person+settings

import { AdminOverview } from './admin/admin-overview'
import { DataTable } from './admin/data-table'
import AdminModals from './admin/admin-modals'

type NavType = 'overview' | 'doctors' | 'students' | 'appointments' | 'institutes' | 'admins' | 'account'

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

interface Medecin {
  id: string
  nom: string
  prenom: string
  email: string
  photoUrl: string | null
  telephone?: string
  universites?: Array<{ id: number; nom: string; ville?: string }>
  creneaux: any[]
  rdvs: Array<{ id: string; date: string; heure: string; etudiant: string | null }>
}

interface Etudiant {
  id: string
  nom: string
  prenom: string
  email: string
  telephone?: string
  photoUrl?: string | null
  universite?: {
    id: number
    nom: string
    ville?: string
    code?: string
  }
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
  const [loading, setLoading] = useState(true)

  // Data
  const [doctorsData, setDoctorsData] = useState<Medecin[]>([])
  const [etudiantsData, setEtudiantsData] = useState<Etudiant[]>([])
  const [universitesData, setUniversitesData] = useState<Universite[]>([])
  const [adminsData, setAdminsData] = useState<Admin[]>([])
const [appointmentsData, setAppointmentsData] = useState<any[]>([]);
// Client-only header state to avoid SSR crash when accessing localStorage
const [facultyName, setFacultyName] = useState('Université')
const [mounted, setMounted] = useState(false)
  const [profile, setProfile] = useState<Admin | null>(null)

  // Doctors modal
  const [doctorModalOpen, setDoctorModalOpen] = useState(false)
  const [doctorModalMode, setDoctorModalMode] = useState<'add' | 'edit' | 'show' | 'delete-warning'>('show')
  const [doctorItem, setDoctorItem] = useState<Partial<Medecin>>({})
  const [selectedDoctorUniversiteId, setSelectedDoctorUniversiteId] = useState<number | ''>('')

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
      let etudiantsUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/etudiants`
      if (!isSuperAdmin && universityId) {
        etudiantsUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/etudiants/universite/${universityId}`
      }
      const res = await fetch(etudiantsUrl, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) throw new Error('Failed students')
      const data = await res.json()
      setEtudiantsData(Array.isArray(data) ? data : [])
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
    Promise.allSettled([loadDoctors(), loadEtudiants(), loadUniversites(), loadAdmins(), loadAppointments()])
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
      setSelectedDoctorUniversiteId(item.universites[0].id)
    } else {
      setSelectedDoctorUniversiteId('')
    }
    setDoctorModalOpen(true)
  }

  const closeDoctorModal = () => {
    setDoctorModalOpen(false)
    setSelectedDoctorUniversiteId('')
    setTimeout(() => setDoctorItem({}), 300)
  }

  const saveDoctor = async () => {
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) return alert('Token manquant')

    if (doctorModalMode === 'add' && !selectedDoctorUniversiteId) {
      return alert('Veuillez sélectionner une université pour le médecin')
    }

    if (!doctorItem.nom?.trim() || !doctorItem.prenom?.trim() || !doctorItem.email?.trim()) {
      return alert('Nom, prénom et email sont obligatoires')
    }

    const payload: any = {
      nom: doctorItem.nom.trim(),
      prenom: doctorItem.prenom.trim(),
      email: doctorItem.email.trim(),
      telephone: doctorItem.telephone?.trim() || undefined,
    }

    if (doctorModalMode === 'add') {
      payload.universiteId = selectedDoctorUniversiteId
    }

    const url = doctorModalMode === 'add'
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins`
      : `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins/${doctorItem.id}`

    try {
      const res = await fetch(url, {
        method: doctorModalMode === 'add' ? 'POST' : 'PUT',
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

      if (doctorModalMode === 'add') {
        setDoctorsData(prev => [...prev, saved])
      } else {
        setDoctorsData(prev => prev.map(d => d.id === saved.id ? saved : d))
      }

      closeDoctorModal()
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Erreur lors de la sauvegarde du praticien')
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
    horaire: '',
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
      if (universiteItem.horaire) form.append('horaire', universiteItem.horaire)
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
          <img src={src} alt={fullName || 'Avatar'} className="w-10 h-10 rounded-none object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-none bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700">
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
          <img src={src} alt={fullName || 'Avatar'} className="w-10 h-10 rounded-none object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-none bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700">
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

  const adminsColumns = [
    { key: 'photoUrl', label: '', tdClass: 'pl-3 pr-2 sm:pl-4 sm:pr-2', render: (row: any) => {
      const fullName = `${String(row.prenom || '').trim()} ${String(row.nom || '').trim()}`.trim()
      const initials = fullName.split(' ').map((n:any)=>n[0]).slice(0,2).join('')
      const src = String(row.photoUrl || row.photo || '')
      return src
        ? (
          <img src={src} alt={fullName || 'Avatar'} className="w-10 h-10 rounded-none object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-none bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700">
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
      menu={isSuperAdmin ? [
        { key: 'overview', label: 'Overview', icon: LayoutDashboard },
        { key: 'institutes', label: 'Institutes', icon: UniversityThin },
  { key: 'admins', label: 'Admins', icon: UserCog },
    { key: 'doctors', label: 'Doctors', icon: Stethoscope as any },
    { key: 'students', label: 'Students', icon: GraduationCap },
        { key: 'appointments', label: 'Appointments', icon: Clock as any },
      ] : [
        { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'doctors', label: 'Doctors', icon: Stethoscope as any },
  { key: 'students', label: 'Students', icon: GraduationCap },
        { key: 'appointments', label: 'Appointments', icon: Clock as any },
      ]}
      activeKey={activeNav}
      onChange={(k: string) => setActiveNav(k as NavType)}
    />

    <div className="flex-1 overflow-auto">
      <div className="p-8 space-y-8">
        {mounted && (
          <CoreHeader
            name={userName}
            variant={isSuperAdmin ? 'super-admin' : 'admin'}
            faculty={facultyName}
            logoSrc="/icons/univ-sousse.svg"
            breadcrumbs={[
              { label: 'Dashboard' },
              {
                label:
                  activeNav === 'overview' ? 'Overview' :
                  activeNav === 'doctors' ? 'Doctors' :
                  activeNav === 'students' ? 'Students' :
                  activeNav === 'appointments' ? 'Appointments' :
                  activeNav === 'institutes' ? 'Institutes' :
                  activeNav === 'admins' ? 'Admins' :
                  activeNav === 'account' ? 'Account' :
                  activeNav
              }
            ]}
          />
        )}

        {loading ? (
<div className="flex justify-center items-center h-[60vh]">
            <p className="text-lg text-gray-600">Chargement...</p>
          </div>
        ) : (
          <>
            {activeNav === 'overview' && <AdminOverview />}
                {activeNav === 'account' && (
                  <ProfileTab
                    name="Alice Ben Ali"
                    email="alice.benali@example.tn"
                    phone="98 765 432"
                    enrollment="202400123"
                    major="Médecine Générale"
                    year="3ème année"
                    institution={isSuperAdmin ? 'Universite de sousse' : 'Faculté de Médecine de Sousse'}
                    avatar="/placeholder.svg"
                    showAcademic={false}
                  />
                )}

            {activeNav === 'doctors' && (
              <DataTable
                title="Gestion des praticiens"
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
                            title="Gestion des étudiants"
                            data={etudiantsData.map(etudiant => ({
                              ...etudiant,
                              universiteDisplay: etudiant.universite?.nom || '—'
                            }))}
                            columns={studentsColumns}
                            onAdd={() => openStudentModal('add')}
                            onEdit={item => openStudentModal('edit', item)}
                            onShow={item => openStudentModal('show', item)}
                            onDelete={handleDeleteStudent}
                            onExport={() => alert('Exporter étudiants')}
                            onRefresh={() => loadEtudiants()}
                            searchPlaceholder="Rechercher un étudiant par nom ou département..."
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
        selectedDoctorUniversiteId={selectedDoctorUniversiteId}
        setSelectedDoctorUniversiteId={setSelectedDoctorUniversiteId}
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
