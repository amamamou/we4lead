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
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from './ui/dialog'
import { Trash2 } from 'lucide-react'

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
  useEffect(() => {
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) {
      setLoading(false)
      return
    }

    setLoading(true)

    const universityId = localStorage.getItem('universityId')

    // Doctors endpoint
    let doctorsUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins`
    if (!isSuperAdmin && universityId) {
      doctorsUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins/universite/${universityId}`
    }

    // Students endpoint
    let etudiantsUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/etudiants`
    if (!isSuperAdmin && universityId) {
      etudiantsUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/etudiants/universite/${universityId}`
    }
    let appointmentsUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/rdvs`;
if (!isSuperAdmin && universityId) {
  appointmentsUrl += `/universite/${universityId}`;
}

const fetchAppointments = fetch(appointmentsUrl, {
  headers: { Authorization: `Bearer ${token}` },
})
  .then(res => res.ok ? res.json() : Promise.reject('Failed appointments'))
  .then(data => {
    console.log('Appointments fetched:', data?.length || 0, 'items');
    setAppointmentsData(Array.isArray(data) ? data : []);
  })
  .catch(err => console.error('Appointments fetch error:', err));

// Add to Promise.allSettled


    const fetchDoctors = fetch(doctorsUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject('Failed doctors'))
      .then(data => {
        console.log('Fetched doctors:', data)
        setDoctorsData(Array.isArray(data) ? data : [])
      })
      .catch(err => console.error('Error fetching doctors:', err))

    const fetchEtudiants = fetch(etudiantsUrl, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject('Failed students'))
      .then(data => {
        console.log('Fetched students:', data)
        setEtudiantsData(Array.isArray(data) ? data : [])
      })
      .catch(err => console.error('Error fetching students:', err))

    const fetchUniversites = isSuperAdmin
      ? fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/universites`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.ok ? res.json() : Promise.reject('Failed universites'))
          .then(data => setUniversitesData(Array.isArray(data) ? data : []))
          .catch(err => console.error('Error fetching universités:', err))
      : Promise.resolve()

    const fetchAdmins = isSuperAdmin
      ? fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/admins`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.ok ? res.json() : Promise.reject('Failed admins'))
          .then(data => setAdminsData(Array.isArray(data) ? data : []))
          .catch(err => console.error('Error fetching admins:', err))
      : Promise.resolve()

Promise.allSettled([fetchDoctors, fetchEtudiants, fetchUniversites, fetchAdmins, fetchAppointments])
  .finally(() => setLoading(false));
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
    code: '',
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
      if (universiteItem.code) form.append('code', universiteItem.code.trim())
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
    { key: 'logoPath', label: 'Logo', render: (row: any) => (
      <img
        src={String(row.logoPath || row.logo || '/placeholder.svg')}
        alt={String(row.nom || '')}
        className="w-8 h-8 rounded object-contain"
      />
    ) },
    { key: 'nom', label: 'Nom' },
    { key: 'ville', label: 'Ville' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'code', label: 'Code' },
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
                    phone="+216 98 765 432"
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
                onImport={() => alert('Importer praticiens')}
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
                            onImport={() => alert('Importer étudiants')}
                            searchPlaceholder="Rechercher un étudiant par nom ou département..."
                          />
                        )}

          {activeNav === 'appointments' && (
            <div className="space-y-6">
              <DataTable
                title="Gestion des rendez‑vous"
                data={appointmentsData.map(apt => ({
        id: apt.id,
        doctor: apt.medecin ? `Dr. ${apt.medecin.prenom} ${apt.medecin.nom}` : '—',
        student: apt.etudiant ? `${apt.etudiant.prenom} ${apt.etudiant.nom}` : '—',
        date: apt.date || '—',
        heure: apt.heure || '—',
        status: apt.status || 'CONFIRMED',
        statusDisplay:
          apt.status === 'CONFIRMED' ? 'Confirmé ✓' :
          apt.status === 'CANCELED'  ? 'Annulé ✗' : 'En attente …',
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
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                row.status === 'CONFIRMED'
                  ? 'bg-green-100 text-green-800'
                  : row.status === 'CANCELED'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {row.statusDisplay}
            </span>
          ),
        },
        { key: 'university', label: 'Université' },
      ]}
      onAdd={() => openAppointmentModal('add')}
      onEdit={item => openAppointmentModal('edit', item)}
      onShow={item => openAppointmentModal('show', item)}
      onDelete={handleDeleteAppointment}
      onExport={() => alert('Exporter rendez‑vous')}
      onImport={() => alert('Importer rendez‑vous')}
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
                onImport={() => alert('Importer institutions')}
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
                onImport={() => alert('Importer administrateurs')}
                searchPlaceholder="Rechercher un administrateur..."
              />
            )}
          </>
        )}
</div>

      {/* Doctors Modal – with university selection when adding */}
      {doctorModalOpen && (
        <Dialog open onOpenChange={setDoctorModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {doctorModalMode === 'add' ? 'Ajouter un praticien' :
                 doctorModalMode === 'edit' ? 'Modifier un praticien' :
                 doctorModalMode === 'show' ? 'Détails du praticien' :
                 'Attention : rendez-vous existants'}
              </DialogTitle>
            </DialogHeader>

            {doctorModalMode === 'delete-warning' ? (
              <div className="py-4">
                <p>
                  Ce praticien a {doctorItem.rdvs?.length ?? 0} rendez-vous planifiés.<br />
                  La suppression forcée supprimera également tous ces rendez-vous.<br />
                  Voulez-vous continuer ?
                </p>
              </div>
            ) : doctorModalMode === 'show' ? (
              <div className="grid gap-4 py-4">
                {['nom', 'prenom', 'email', 'telephone'].map(field => (
                  <div key={field} className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium capitalize">{field}</div>
                    <div className="col-span-3">{doctorItem[field as keyof typeof doctorItem] || '—'}</div>
                  </div>
                ))}
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">Université</div>
                  <div className="col-span-3">{doctorItem.universite?.nom || '—'}</div>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="prenom" className="font-medium">Prénom</label>
                  <input
                    id="prenom"
                    value={doctorItem.prenom || ''}
                    onChange={e => setDoctorItem(prev => ({ ...prev, prenom: e.target.value }))}
                    className="col-span-3 border border-gray-300 px-3 py-2 rounded-md"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="nom" className="font-medium">Nom</label>
                  <input
                    id="nom"
                    value={doctorItem.nom || ''}
                    onChange={e => setDoctorItem(prev => ({ ...prev, nom: e.target.value }))}
                    className="col-span-3 border border-gray-300 px-3 py-2 rounded-md"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="font-medium">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={doctorItem.email || ''}
                    onChange={e => setDoctorItem(prev => ({ ...prev, email: e.target.value }))}
                    className="col-span-3 border border-gray-300 px-3 py-2 rounded-md"
                    disabled={doctorModalMode === 'edit'}
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="telephone" className="font-medium">Téléphone</label>
                  <input
                    id="telephone"
                    value={doctorItem.telephone || ''}
                    onChange={e => setDoctorItem(prev => ({ ...prev, telephone: e.target.value }))}
                    className="col-span-3 border border-gray-300 px-3 py-2 rounded-md"
                    placeholder="+216 12 345 678"
                  />
                </div>

                {/* University selection – shown only when adding a new doctor */}
                {doctorModalMode === 'add' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="doctor-universite" className="font-medium">
                      Université <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="doctor-universite"
                      value={selectedDoctorUniversiteId}
                      onChange={e => setSelectedDoctorUniversiteId(Number(e.target.value) || '')}
                      className="col-span-3 border border-gray-300 px-3 py-2 rounded-md"
                      required
                    >
                      <option value="">Sélectionner une université</option>
                      {universitesData.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.nom} {u.ville ? `(${u.ville})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="gap-3">
              <button
                onClick={() => setDoctorModalOpen(false)}
                className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>

              {(doctorModalMode === 'add' || doctorModalMode === 'edit') && (
                <button
                  onClick={saveDoctor}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              )}

              {doctorModalMode === 'delete-warning' && (
                <button
                  onClick={() => {
                    setDoctorModalOpen(false)
                    openDeleteModal('doctor', doctorItem as Medecin)
                  }}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Supprimer quand même
                </button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
            {/* Students Modal */}
      {studentModalOpen && (
        <Dialog open onOpenChange={closeStudentModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {studentModalMode === 'add' && 'Ajouter un étudiant'}
                {studentModalMode === 'edit' && 'Modifier un étudiant'}
                {studentModalMode === 'show' && 'Détails de l\'étudiant'}
              </DialogTitle>
              {studentModalMode !== 'show' && (
                <DialogDescription>
                  {studentModalMode === 'add'
                    ? 'Remplissez les informations et assignez une université'
                    : 'Modifiez les informations de l\'étudiant'}
                </DialogDescription>
              )}
            </DialogHeader>

            {studentModalMode === 'show' ? (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">Nom complet</div>
                  <div className="col-span-3">
                    {studentItem.prenom} {studentItem.nom}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">Email</div>
                  <div className="col-span-3">{studentItem.email || '—'}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">Téléphone</div>
                  <div className="col-span-3">{studentItem.telephone || '—'}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">Université</div>
                  <div className="col-span-3">
                    {studentItem.universite?.nom || 'Non assignée'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="student-prenom" className="font-medium">Prénom</label>
                  <input
                    id="student-prenom"
                    value={studentItem.prenom || ''}
                    onChange={e => setStudentItem(prev => ({ ...prev, prenom: e.target.value }))}
                    className="col-span-3 border border-gray-300 px-3 py-2 rounded-md"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="student-nom" className="font-medium">Nom</label>
                  <input
                    id="student-nom"
                    value={studentItem.nom || ''}
                    onChange={e => setStudentItem(prev => ({ ...prev, nom: e.target.value }))}
                    className="col-span-3 border border-gray-300 px-3 py-2 rounded-md"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="student-email" className="font-medium">Email</label>
                  <input
                    id="student-email"
                    type="email"
                    value={studentItem.email || ''}
                    onChange={e => setStudentItem(prev => ({ ...prev, email: e.target.value }))}
                    className="col-span-3 border border-gray-300 px-3 py-2 rounded-md"
                    disabled={studentModalMode === 'edit'}
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="student-telephone" className="font-medium">Téléphone</label>
                  <input
                    id="student-telephone"
                    value={studentItem.telephone || ''}
                    onChange={e => setStudentItem(prev => ({ ...prev, telephone: e.target.value }))}
                    className="col-span-3 border border-gray-300 px-3 py-2 rounded-md"
                    placeholder="+216 12 345 678"
                  />
                </div>

                {studentModalMode === 'add' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="student-universite" className="font-medium">
                      Université <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="student-universite"
                      value={selectedStudentUniversiteId}
                      onChange={e => setSelectedStudentUniversiteId(Number(e.target.value) || '')}
                      className="col-span-3 border border-gray-300 px-3 py-2 rounded-md"
                      required
                    >
                      <option value="">Sélectionner une université</option>
                      {universitesData.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.nom} {u.ville ? `(${u.ville})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="gap-3">
              <button
                type="button"
                onClick={closeStudentModal}
                className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>

              {studentModalMode !== 'show' && (
                <button
                  type="button"
                  onClick={saveStudent}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Enregistrer
                </button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {/* Universities Modal */}
      {universiteModalOpen && (
        <Dialog open onOpenChange={() => setUniversiteModalOpen(false)}>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <DialogTitle>
                {universiteModalMode === 'add' && 'Ajouter une université'}
                {universiteModalMode === 'edit' && 'Modifier l’université'}
                {universiteModalMode === 'show' && 'Détails de l’université'}
              </DialogTitle>
              {universiteModalMode !== 'show' && (
                <DialogDescription>Remplissez les informations de l’université</DialogDescription>
              )}
            </DialogHeader>

            {universiteModalMode === 'show' ? (
              <div className="grid gap-4 py-4">
                {['nom', 'ville', 'adresse', 'telephone', 'code', 'nbEtudiants', 'horaire'].map((field) => (
                  <div key={field} className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium capitalize">{field}</div>
                    <div className="col-span-3">
                      {universiteItem[field as keyof Universite] ?? '—'}
                    </div>
                  </div>
                ))}
                {universiteItem.logoPath && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium">Logo</div>
                    <div className="col-span-3">
                      <img
                        src={universiteItem.logoPath}
                        alt="Logo université"
                        className="max-h-24 w-auto object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                {['nom', 'ville', 'adresse', 'telephone', 'code', 'nbEtudiants', 'horaire'].map((field) => (
                  <div key={field} className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor={field} className="font-medium capitalize">
                      {field}
                    </label>
                    <input
                      id={field}
                      type={field === 'nbEtudiants' ? 'number' : 'text'}
                      value={universiteItem[field as keyof Universite] ?? ''}
                      onChange={(e) =>
                        setUniversiteItem((prev) => ({
                          ...prev,
                          [field]: field === 'nbEtudiants' ? Number(e.target.value) || undefined : e.target.value,
                        }))
                      }
                      className="col-span-3 border border-gray-300 px-3 py-2 rounded-md"
                      placeholder={
                        field === 'telephone'
                          ? '+216 12 345 678'
                          : field === 'nbEtudiants'
                          ? 'Nombre d’étudiants'
                          : ''
                      }
                    />
                  </div>
                ))}

                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="font-medium">Logo</label>
                  <div className="col-span-3 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setUniversiteItem((prev) => ({
                            ...prev,
                            logoFile: file,
                            logoPath: URL.createObjectURL(file),
                          }))
                        }
                      }}
                    />
                    {universiteItem.logoPath && (
                      <img
                        src={universiteItem.logoPath}
                        alt="Aperçu logo"
                        className="max-h-20 w-auto object-contain border rounded"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <button
                onClick={() => setUniversiteModalOpen(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Annuler
              </button>

              {universiteModalMode !== 'show' && (
                <button
                  onClick={saveUniversite}
                  className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Admins Modal */}
      {adminModalOpen && (
        <Dialog open onOpenChange={closeAdminModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {adminModalMode === 'add' && 'Ajouter un administrateur'}
                {adminModalMode === 'edit' && 'Modifier l’administrateur'}
                {adminModalMode === 'show' && 'Détails de l’administrateur'}
              </DialogTitle>
              {adminModalMode !== 'show' && (
                <DialogDescription>
                  {adminModalMode === 'add'
                    ? 'Remplissez les informations et assignez une université'
                    : 'Modifiez les informations de l’administrateur'}
                </DialogDescription>
              )}
            </DialogHeader>

            {adminModalMode === 'show' ? (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">Nom complet</div>
                  <div className="col-span-3">
                    {adminItem.prenom} {adminItem.nom}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">Email</div>
                  <div className="col-span-3">{adminItem.email || '—'}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">Téléphone</div>
                  <div className="col-span-3">{adminItem.telephone || '—'}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <div className="font-medium">Université</div>
                  <div className="col-span-3">
                    {adminItem.universite?.nom || 'Non assignée'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-5 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="prenom" className="font-medium">
                    Prénom
                  </label>
                  <input
                    id="prenom"
                    value={adminItem.prenom || ''}
                    onChange={(e) =>
                      setAdminItem((prev) => ({ ...prev, prenom: e.target.value }))
                    }
                    className="col-span-3 border border-gray-300 px-3 py-2 rounded-md"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="nom" className="font-medium">
                    Nom
                  </label>
                  <input
                    id="nom"
                    value={adminItem.nom || ''}
                    onChange={(e) =>
                      setAdminItem((prev) => ({ ...prev, nom: e.target.value }))
                    }
                    className="col-span-3 border border-gray-300 px-3 py-2 rounded-md"
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={adminItem.email || ''}
                    onChange={(e) =>
                      setAdminItem((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="col-span-3 border border-gray-300 px-3 py-2 rounded-md"
                    disabled={adminModalMode === 'edit'}
                    required
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="telephone" className="font-medium">
                    Téléphone
                  </label>
                  <input
                    id="telephone"
                    value={adminItem.telephone || ''}
                    onChange={(e) =>
                      setAdminItem((prev) => ({ ...prev, telephone: e.target.value }))
                    }
                    className="col-span-3 border border-gray-300 px-3 py-2 rounded-md"
                    placeholder="+216 12 345 678"
                  />
                </div>

                {adminModalMode === 'add' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="universite" className="font-medium">
                      Université
                    </label>
                    <select
                      id="universite"
                      value={selectedUniversiteId}
                      onChange={(e) => setSelectedUniversiteId(Number(e.target.value))}
                      className="col-span-3 border border-gray-300 px-3 py-2 rounded-md"
                      required
                    >
                      <option value="">Sélectionner une université</option>
                      {universitesData.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nom} ({u.ville})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="gap-3">
              <button
                type="button"
                onClick={closeAdminModal}
                className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>

              {adminModalMode !== 'show' && (
                <button
                  type="button"
                  onClick={saveAdmin}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Enregistrer
                </button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Shared Delete Confirmation Modal */}
      {deleteModalOpen && (
        <Dialog open onOpenChange={() => setDeleteModalOpen(false)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-5 w-5" />
                Confirmer la suppression
              </DialogTitle>
              <DialogDescription className="pt-2">
                {deleteMessage}
                <br />
                Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {appointmentModalOpen && (
  <Dialog open onOpenChange={setAppointmentModalOpen}>
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>
          {appointmentModalMode === 'add' ? 'Nouveau rendez-vous' :
           appointmentModalMode === 'edit' ? 'Modifier le rendez-vous' :
           'Détails du rendez-vous'}
        </DialogTitle>
      </DialogHeader>

      {appointmentModalMode === 'show' ? (
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="font-medium">Praticien</div>
            <div className="col-span-3">
              {appointmentItem.medecin
                ? `Dr. ${appointmentItem.medecin.prenom} ${appointmentItem.medecin.nom}`
                : '—'}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="font-medium">Étudiant</div>
            <div className="col-span-3">
              {appointmentItem.etudiant
                ? `${appointmentItem.etudiant.prenom} ${appointmentItem.etudiant.nom}`
                : '—'}
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="font-medium">Date</div>
            <div className="col-span-3">{appointmentItem.date || '—'}</div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="font-medium">Heure</div>
            <div className="col-span-3">{appointmentItem.heure || '—'}</div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="font-medium">Statut</div>
            <div className="col-span-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                appointmentItem.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                appointmentItem.status === 'CANCELED' ? 'bg-red-100 text-red-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {appointmentItem.status === 'CONFIRMED' ? 'Confirmé' :
                 appointmentItem.status === 'CANCELED' ? 'Annulé' : 'En attente'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="font-medium">Médecin *</label>
            <select
              value={appointmentItem.medecinId || ''}
              onChange={e => setAppointmentItem(prev => ({ ...prev, medecinId: e.target.value }))}
              className="col-span-3 border rounded px-3 py-2"
              disabled={appointmentModalMode === 'edit'} // optional: prevent changing doctor
              required
            >
              <option value="">Sélectionner un médecin</option>
              {doctorsData.map(doc => (
                <option key={doc.id} value={doc.id}>
                  Dr. {doc.prenom} {doc.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label className="font-medium">Étudiant *</label>
            <select
              value={appointmentItem.etudiantId || ''}
              onChange={e => setAppointmentItem(prev => ({ ...prev, etudiantId: e.target.value }))}
              className="col-span-3 border rounded px-3 py-2"
              required
            >
              <option value="">Sélectionner un étudiant</option>
              {etudiantsData.map(et => (
                <option key={et.id} value={et.id}>
                  {et.prenom} {et.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label className="font-medium">Date *</label>
            <input
              type="date"
              value={appointmentItem.date || ''}
              onChange={e => setAppointmentItem(prev => ({ ...prev, date: e.target.value }))}
              className="col-span-3 border rounded px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <label className="font-medium">Heure *</label>
            <input
              type="time"
              value={appointmentItem.heure || ''}
              onChange={e => setAppointmentItem(prev => ({ ...prev, heure: e.target.value }))}
              className="col-span-3 border rounded px-3 py-2"
              required
            />
          </div>

          {appointmentModalMode === 'edit' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="font-medium">Statut</label>
              <select
                value={appointmentItem.status || 'CONFIRMED'}
                onChange={e => setAppointmentItem(prev => ({ ...prev, status: e.target.value }))}
                className="col-span-3 border rounded px-3 py-2"
              >
                <option value="CONFIRMED">Confirmé</option>
                <option value="CANCELED">Annulé</option>
              </select>
            </div>
          )}
        </div>
      )}

      <DialogFooter className="gap-3">
        <button
          type="button"
          onClick={() => setAppointmentModalOpen(false)}
          className="px-5 py-2 border rounded hover:bg-gray-50"
        >
          Annuler
        </button>

        {appointmentModalMode !== 'show' && (
          <button
            type="button"
            onClick={saveAppointment}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Enregistrer
          </button>
        )}
      </DialogFooter>
    </DialogContent>
  </Dialog>
)}
       

      {activeNav !== 'account' && (
        <div className="hidden sm:block px-4 pb-6">
          <DashboardFooter variant="compact" />
        </div>
      )}
    </div>
  </div>
)
}
