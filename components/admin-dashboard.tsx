'use client'

import { useState, useEffect } from 'react'
import { AdminSidebar } from './admin/admin-sidebar'
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
import { X, Trash2 } from 'lucide-react' // added Trash2 icon

type NavType = 'overview' | 'doctors' | 'students' | 'appointments' | 'institutes' | 'admins'

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
  creneaux: any[]
  rdvs: Array<{ id: string; date: string; heure: string; etudiant: string | null }>
}

interface Admin {
  id: string
  nom: string
  prenom: string
  email: string
  telephone?: string
  universites?: { id: number; nom: string }[]
}

export default function AdminDashboard({
  isSuperAdmin = true,
  userName = 'Admin User',
}: AdminDashboardProps) {
  const [activeNav, setActiveNav] = useState<NavType>('overview')
  const [loading, setLoading] = useState(true)

  // Data
  const [doctorsData, setDoctorsData] = useState<Medecin[]>([])
  const [universitesData, setUniversitesData] = useState<Universite[]>([])
  const [adminsData, setAdminsData] = useState<Admin[]>([])

  // Mock data
  const [studentsData] = useState([{ id: 1, name: 'John Doe' }])
  const [appointmentsData] = useState([{ id: 1, doctor: 'Dr. A', student: 'John' }])

  // Doctors modal
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'show' | 'delete-warning'>('show')
  const [modalItem, setModalItem] = useState<Partial<Medecin>>({})

  // University modal
  const [universiteModalOpen, setUniversiteModalOpen] = useState(false)
  const [universiteModalMode, setUniversiteModalMode] = useState<'add' | 'edit' | 'show'>('show')
  const [universiteItem, setUniversiteItem] = useState<Partial<Universite>>({})

  // Admin modal
  const [adminModalOpen, setAdminModalOpen] = useState(false)
  const [adminModalMode, setAdminModalMode] = useState<'add' | 'edit' | 'show'>('show')
  const [adminItem, setAdminItem] = useState<Partial<Admin>>({})
  const [selectedUniversiteId, setSelectedUniversiteId] = useState<number | ''>('')

  // Shared Delete Confirmation Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<any>(null)
  const [deleteType, setDeleteType] = useState<'doctor' | 'universite' | 'admin' | null>(null)
  const [deleteMessage, setDeleteMessage] = useState('')

  // ────────────────────────────────────────────────
  // Fetching logic (unchanged)
  // ────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) {
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch doctors')
        return res.json()
      })
      .then((data) => setDoctorsData(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error('Error fetching doctors:', err)
        alert('Erreur lors du chargement des praticiens')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!isSuperAdmin) return

    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) return

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/universites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch universities')
        return res.json()
      })
      .then((data) => setUniversitesData(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Error fetching universités:', err))
  }, [isSuperAdmin])

  useEffect(() => {
    if (!isSuperAdmin) return

    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) return

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/admins`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch admins')
        return res.json()
      })
      .then((data) => {
        const adapted = Array.isArray(data) ? data : []
        setAdminsData(adapted)
      })
      .catch((err) => {
        console.error('Error fetching admins:', err)
        alert('Erreur lors du chargement des admins')
      })
  }, [isSuperAdmin])

  // ────────────────────────────────────────────────
  // Shared Delete Confirmation
  // ────────────────────────────────────────────────
  const openDeleteModal = (type: 'doctor' | 'universite' | 'admin', item: any) => {
    setDeleteType(type)
    setDeleteItem(item)

    let msg = ''
    if (type === 'doctor') {
      msg = `Voulez-vous vraiment supprimer le praticien ${item.prenom} ${item.nom} ?`
    } else if (type === 'universite') {
      msg = `Voulez-vous vraiment supprimer l’université ${item.nom} ?`
    } else if (type === 'admin') {
      msg = `Voulez-vous vraiment supprimer l’administrateur ${item.prenom} ${item.nom} ?`
    }

    setDeleteMessage(msg)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteItem || !deleteType) return

    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) {
      alert('Token manquant')
      setDeleteModalOpen(false)
      return
    }

    let url = ''
    let onSuccess: () => void

    if (deleteType === 'doctor') {
      url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins/${deleteItem.id}`
      onSuccess = () => setDoctorsData((prev) => prev.filter((d) => d.id !== deleteItem.id))
    } else if (deleteType === 'universite') {
      url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/universites/${deleteItem.id}`
      onSuccess = () => setUniversitesData((prev) => prev.filter((u) => u.id !== deleteItem.id))
    } else if (deleteType === 'admin') {
      url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/admins/${deleteItem.id}`
      onSuccess = () => setAdminsData((prev) => prev.filter((a) => a.id !== deleteItem.id))
    }

    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || 'Échec de la suppression')
      }

      onSuccess()
      setDeleteModalOpen(false)
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Erreur lors de la suppression')
    }
  }

  // ────────────────────────────────────────────────
  // Doctors CRUD
  // ────────────────────────────────────────────────
  const openModal = (mode: typeof modalMode, item?: Partial<Medecin>) => {
    setModalMode(mode)
    setModalItem(
      mode === 'add'
        ? { nom: '', prenom: '', email: '', telephone: '' }
        : (item ?? {})
    )
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setTimeout(() => setModalItem({}), 300)
  }

  const saveModal = async () => {
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) return alert('Token manquant')

    const payload = {
      nom: modalItem.nom?.trim(),
      prenom: modalItem.prenom?.trim(),
      email: modalItem.email?.trim(),
      telephone: modalItem.telephone?.trim(),
    }

    const url =
      modalMode === 'add'
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins/${modalItem.id}`

    try {
      const res = await fetch(url, {
        method: modalMode === 'add' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Échec de la sauvegarde')

      const saved = await res.json()

      if (modalMode === 'add') {
        setDoctorsData((prev) => [...prev, saved])
      } else {
        setDoctorsData((prev) => prev.map((d) => (d.id === saved.id ? saved : d)))
      }

      closeModal()
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la sauvegarde du praticien')
    }
  }

  const handleDeleteDoctor = (item: Medecin) => {
    if (item.rdvs?.length > 0) {
      // Special case: keep your force delete warning
      openModal('delete-warning', item)
    } else {
      openDeleteModal('doctor', item)
    }
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
    if (!token) {
      alert('Token manquant')
      return
    }

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

      const url =
        universiteModalMode === 'add'
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/universites`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/universites/${universiteItem.id}`

      const res = await fetch(url, {
        method: universiteModalMode === 'add' ? 'POST' : 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || 'Échec de la sauvegarde')
      }

      const saved = await res.json()

      if (universiteModalMode === 'add') {
        setUniversitesData((prev) => [...prev, saved])
      } else {
        setUniversitesData((prev) => prev.map((u) => (u.id === saved.id ? saved : u)))
      }

      setUniversiteModalOpen(false)
      setUniversiteItem({})
    } catch (err: any) {
      console.error('Save université error:', err)
      alert(err.message || 'Erreur lors de la sauvegarde de l’université')
    }
  }

  const handleDeleteUniversite = (item: Universite) => {
    openDeleteModal('universite', item)
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
    setSelectedUniversiteId(mode === 'add' ? '' : (item?.universites?.[0]?.id || ''))
    setAdminModalOpen(true)
  }

  const closeAdminModal = () => {
    setAdminModalOpen(false)
    setSelectedUniversiteId('')
  }

  const saveAdmin = async () => {
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) return alert('Token manquant')

    if (!adminItem.nom?.trim() || !adminItem.prenom?.trim() || !adminItem.email?.trim()) {
      return alert('Nom, prénom et email sont obligatoires')
    }

    if (adminModalMode === 'add' && !selectedUniversiteId) {
      return alert('Veuillez sélectionner une université')
    }

    const payload: any = {
      nom: adminItem.nom.trim(),
      prenom: adminItem.prenom.trim(),
      email: adminItem.email.trim(),
      telephone: adminItem.telephone?.trim() || undefined,
    }

    if (adminModalMode === 'add') {
      payload.universiteId = selectedUniversiteId
    }

    const url =
      adminModalMode === 'add'
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
        setAdminsData((prev) => [...prev, saved])
      } else {
        setAdminsData((prev) => prev.map((a) => (a.id === saved.id ? saved : a)))
      }

      closeAdminModal()
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Erreur lors de la sauvegarde de l’admin')
    }
  }

  const handleDeleteAdmin = (item: Admin) => {
    openDeleteModal('admin', item)
  }

  // ────────────────────────────────────────────────
  // Column definitions
  // ────────────────────────────────────────────────
  const doctorsColumns = [
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'email', label: 'Email' },
    { key: 'telephone', label: 'Téléphone' },
  ]

  const studentsColumns = [{ key: 'name', label: 'Nom' }]

  const appointmentsColumns = [
    { key: 'doctor', label: 'Praticien' },
    { key: 'student', label: 'Étudiant' },
  ]

  const institutesColumns = [
    { key: 'nom', label: 'Nom' },
    { key: 'ville', label: 'Ville' },
    { key: 'telephone', label: 'Téléphone' },
    { key: 'code', label: 'Code' },
  ]

  const adminsColumns = [
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'email', label: 'Email' },
    { key: 'telephone', label: 'Téléphone' },
    {
      key: 'universite',
      label: 'Université',
      render: (row: Admin) => row.universites?.[0]?.nom || '—',
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        activeNav={activeNav}
        onNavChange={(id) => setActiveNav(id as NavType)}
        isSuperAdmin={isSuperAdmin}
        userName={userName}
      />

      <main className="flex-1 p-6 overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-600">Chargement...</p>
          </div>
        ) : (
          <>
            {activeNav === 'overview' && <AdminOverview />}

            {activeNav === 'doctors' && (
              <DataTable
                data={doctorsData}
                columns={doctorsColumns}
                onAdd={() => openModal('add')}
                onEdit={(item) => openModal('edit', item)}
                onShow={(item) => openModal('show', item)}
                onDelete={(item) => handleDeleteDoctor(item)}
                searchPlaceholder="Rechercher un praticien..."
              />
            )}

            {activeNav === 'students' && (
              <DataTable
                data={studentsData}
                columns={studentsColumns}
                searchPlaceholder="Rechercher un étudiant..."
              />
            )}

            {activeNav === 'appointments' && (
              <DataTable
                data={appointmentsData}
                columns={appointmentsColumns}
                searchPlaceholder="Rechercher un rendez-vous..."
              />
            )}

            {isSuperAdmin && activeNav === 'institutes' && (
              <DataTable
                data={universitesData}
                columns={institutesColumns}
                onAdd={() => openUniversiteModal('add')}
                onEdit={(i) => openUniversiteModal('edit', i)}
                onShow={(i) => openUniversiteModal('show', i)}
                onDelete={(item) => openDeleteModal('universite', item)}
                searchPlaceholder="Rechercher une université..."
              />
            )}

            {isSuperAdmin && activeNav === 'admins' && (
              <DataTable
                data={adminsData}
                columns={adminsColumns}
                onAdd={() => openAdminModal('add')}
                onEdit={(item) => openAdminModal('edit', item)}
                onShow={(item) => openAdminModal('show', item)}
                onDelete={(item) => openDeleteModal('admin', item)}
                searchPlaceholder="Rechercher un administrateur..."
              />
            )}
          </>
        )}
      </main>

      {/* Doctors Modal */}
      {modalOpen && (
        <Dialog open onOpenChange={closeModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {modalMode === 'add' && 'Ajouter un praticien'}
                {modalMode === 'edit' && 'Modifier un praticien'}
                {modalMode === 'show' && 'Détails du praticien'}
                {modalMode === 'delete-warning' && 'Attention : rendez-vous existants'}
              </DialogTitle>
            </DialogHeader>

            {modalMode === 'delete-warning' ? (
              <div className="py-4">
                <p>
                  Ce praticien a {modalItem.rdvs?.length ?? 0} rendez-vous planifiés.
                  <br />
                  La suppression forcée supprimera également tous ces rendez-vous.
                  <br />
                  Voulez-vous continuer ?
                </p>
              </div>
            ) : modalMode === 'show' ? (
              <div className="grid gap-4 py-4">
                {['nom', 'prenom', 'email', 'telephone'].map((field) => (
                  <div key={field} className="grid grid-cols-4 items-center gap-4">
                    <div className="font-medium capitalize">{field}</div>
                    <div className="col-span-3">{modalItem[field as keyof typeof modalItem] || '—'}</div>
                  </div>
                ))}
                <div>Rendez-vous ({modalItem.rdvs?.length ?? 0})</div>
              </div>
            ) : (
              <div className="grid gap-4 py-4">
                {['nom', 'prenom', 'email', 'telephone'].map((field) => (
                  <div key={field} className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor={field} className="font-medium capitalize">
                      {field}
                    </label>
                    <input
                      id={field}
                      value={modalItem[field as keyof typeof modalItem] || ''}
                      onChange={(e) =>
                        setModalItem((prev) => ({ ...prev, [field]: e.target.value }))
                      }
                      className="col-span-3 border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={field === 'telephone' ? '+216 12 345 678' : ''}
                    />
                  </div>
                ))}
              </div>
            )}

            <DialogFooter>
              <button onClick={closeModal} className="px-4 py-2 border rounded-md">
                Annuler
              </button>

              {(modalMode === 'add' || modalMode === 'edit') && (
                <button
                  onClick={saveModal}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                  Enregistrer
                </button>
              )}

              {modalMode === 'delete-warning' && (
                <button
                  onClick={() => {
                    closeModal()
                    openDeleteModal('doctor', modalItem as Medecin)
                  }}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Supprimer quand même
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
                    {adminItem.universites?.[0]?.nom || 'Non assignée'}
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
    </div>
  )
}