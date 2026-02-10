'use client'

import { useState, useEffect } from 'react'
import { AdminSidebar } from './admin/admin-sidebar'
import { AdminOverview } from './admin/admin-overview'
import { DataTable } from './admin/data-table'
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from './ui/dialog'
import { CheckCircle } from './ui/icons'
import { X } from 'lucide-react'

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
  // only used client-side during create/edit
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

export default function AdminDashboard({
  isSuperAdmin = true,
  userName = 'Admin User',
}: AdminDashboardProps) {
  const [activeNav, setActiveNav] = useState<NavType>('overview')
  const [loading, setLoading] = useState(true)

  // Doctors
  const [doctorsData, setDoctorsData] = useState<Medecin[]>([])

  // Universities (superadmin only)
  const [universitesData, setUniversitesData] = useState<Universite[]>([])

  // Mock data for other tabs (replace with real fetches later)
  const [studentsData] = useState([{ id: 1, name: 'John Doe' }])
  const [appointmentsData] = useState([{ id: 1, doctor: 'Dr. A', student: 'John' }])
  const [adminsData] = useState([{ id: 1, name: 'Dr. Hassan' }])

  // Doctors modal
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'show' | 'delete-warning'>('show')
  const [modalItem, setModalItem] = useState<Partial<Medecin>>({})

  // University modal
  const [universiteModalOpen, setUniversiteModalOpen] = useState(false)
  const [universiteModalMode, setUniversiteModalMode] = useState<'add' | 'edit' | 'show'>('show')
  const [universiteItem, setUniversiteItem] = useState<Partial<Universite>>({})

  // ────────────────────────────────────────────────
  // Fetch Doctors
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

  // ────────────────────────────────────────────────
  // Fetch Universities (superadmin only)
  // ────────────────────────────────────────────────
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

  // ────────────────────────────────────────────────
  // Doctors CRUD helpers
  // ────────────────────────────────────────────────
  const openModal = (mode: typeof modalMode, item?: Partial<Medecin>) => {
    setModalMode(mode)
    setModalItem(item ?? { nom: '', prenom: '', email: '', telephone: '' })
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

  const deleteDoctor = async (item: Medecin, forceCascade = false) => {
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) return alert('Token manquant')

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins/${
        item.id
      }?forceCascade=${forceCascade}`

      const res = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || 'Échec de la suppression')
      }

      setDoctorsData((prev) => prev.filter((d) => d.id !== item.id))
      closeModal()
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Erreur lors de la suppression du praticien')
    }
  }

  const handleDeleteClick = (item: Medecin) => {
    if (item.rdvs?.length > 0) {
      openModal('delete-warning', item)
    } else {
      if (confirm('Voulez-vous vraiment supprimer ce praticien ?')) {
        deleteDoctor(item, false)
      }
    }
  }

  // ────────────────────────────────────────────────
  // Universities CRUD helpers
  // ────────────────────────────────────────────────
  const openUniversiteModal = (mode: typeof universiteModalMode, item?: Partial<Universite>) => {
    setUniversiteModalMode(mode)
    setUniversiteItem(item ?? {})
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
          // IMPORTANT: do NOT set Content-Type when using FormData
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
    if (!confirm(`Voulez-vous vraiment supprimer ${item.nom} ?`)) return

    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) {
      alert('Token manquant')
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/universites/${item.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Échec de la suppression')
        setUniversitesData((prev) => prev.filter((u) => u.id !== item.id))
      })
      .catch((err) => {
        console.error(err)
        alert('Erreur lors de la suppression de l’université')
      })
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

  const adminsColumns = [{ key: 'name', label: 'Nom' }]

  return (
    <div className="flex min-h-screen">
      <AdminSidebar
        activeNav={activeNav}
        onNavChange={(id) => setActiveNav(id as NavType)}
        isSuperAdmin={isSuperAdmin}
        userName={userName}
      />

      <main className="flex-1 p-6">
        {loading ? (
          <div>Chargement...</div>
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
                onDelete={handleDeleteClick}
                searchPlaceholder="Rechercher un praticien..."
              />
            )}

            {activeNav === 'students' && (
              <DataTable data={studentsData} columns={studentsColumns} searchPlaceholder="Rechercher un étudiant..." />
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
                onDelete={handleDeleteUniversite}
                searchPlaceholder="Rechercher une université..."
              />
            )}

            {isSuperAdmin && activeNav === 'admins' && (
              <DataTable data={adminsData} columns={adminsColumns} searchPlaceholder="Rechercher un admin..." />
            )}
          </>
        )}
      </main>

      {/* ─── Doctors Modal ──────────────────────────────────────── */}
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
                  onClick={() => deleteDoctor(modalItem as Medecin, true)}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Supprimer quand même
                </button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ─── Universities Modal ─────────────────────────────────── */}
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

                {/* Logo upload */}
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
                            logoPath: URL.createObjectURL(file), // preview
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
    </div>
  )
}