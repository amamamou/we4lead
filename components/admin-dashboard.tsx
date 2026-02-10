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

interface Medecin {
  id: string
  nom: string
  prenom: string
  email: string
  photoUrl: string | null
  telephone?: string
  creneaux: any[]
  rdvs: Array<{
    id: string
    date: string
    heure: string
    etudiant: string | null
  }>
}

export default function AdminDashboard({ isSuperAdmin = false, userName = 'Admin User' }: AdminDashboardProps) {
  const [activeNav, setActiveNav] = useState<NavType>('overview')
  const [loading, setLoading] = useState(true)
  const [doctorsData, setDoctorsData] = useState<Medecin[]>([])

  // Fetch doctors
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
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch doctors')
        return res.json()
      })
      .then(data => {
        setDoctorsData(Array.isArray(data) ? data : [])
      })
      .catch(err => {
        console.error('Error fetching doctors:', err)
        alert('Erreur lors du chargement des praticiens')
      })
      .finally(() => setLoading(false))
  }, [])

  // Mock data for other tabs (you can replace later)
  const [studentsData] = useState([{ id: 1, name: 'John Doe' }])
  const [appointmentsData] = useState([{ id: 1, doctor: 'Dr. A', student: 'John' }])
  const [institutesData] = useState([{ id: 1, name: 'Faculté de médecine Sousse' }])
  const [adminsData] = useState([{ id: 1, name: 'Dr. Hassan' }])

  // Columns definitions
  const doctorsColumns = [
    { key: 'nom', label: 'Nom' },
    { key: 'prenom', label: 'Prénom' },
    { key: 'email', label: 'Email' },
    { key: 'telephone', label: 'Téléphone' },
  ]

  const studentsColumns = [{ key: 'name', label: 'Nom' }]
  const appointmentsColumns = [{ key: 'doctor', label: 'Praticien' }, { key: 'student', label: 'Étudiant' }]
  const institutesColumns = [{ key: 'name', label: 'Nom' }]
  const adminsColumns = [{ key: 'name', label: 'Nom' }]

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'show' | 'delete-warning'>('show')
  const [modalItem, setModalItem] = useState<Partial<Medecin>>({})

  const openModal = (mode: typeof modalMode, item?: Partial<Medecin>) => {
    setModalMode(mode)
    setModalItem(item ? { ...item } : { nom: '', prenom: '', email: '', telephone: '' })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setTimeout(() => setModalItem({}), 300) // clear after animation
  }

  // Save (add or edit)
  const saveModal = async () => {
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) return alert('Token manquant')

    const payload = {
      nom: modalItem.nom?.trim(),
      prenom: modalItem.prenom?.trim(),
      email: modalItem.email?.trim(),
      telephone: modalItem.telephone?.trim(),
    }

    const url = modalMode === 'add'
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
        setDoctorsData(prev => [...prev, saved])
      } else {
        setDoctorsData(prev => prev.map(d => d.id === saved.id ? saved : d))
      }

      closeModal()
    } catch (err) {
      console.error(err)
      alert('Erreur lors de la sauvegarde du praticien')
    }
  }

  // Delete doctor
  const deleteDoctor = async (item: Medecin, forceDelete = false) => {
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) return alert('Token manquant')

    try {
      const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins/${item.id}?forceCascade=${forceDelete}`

      const res = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || 'Échec de la suppression')
      }

      setDoctorsData(prev => prev.filter(d => d.id !== item.id))
      closeModal()
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Erreur lors de la suppression du praticien')
    }
  }

  // Handle delete button click from table
  const handleDeleteClick = (item: Medecin) => {
    if (item.rdvs?.length > 0) {
      openModal('delete-warning', item)
    } else {
      if (confirm('Voulez-vous vraiment supprimer ce praticien ?')) {
        deleteDoctor(item, false)
      }
    }
  }

  return (
    <div className="min-h-screen flex bg-white">
      <AdminSidebar
        activeNav={activeNav}
        onNavChange={(id: string) => setActiveNav(id as NavType)}
        isSuperAdmin={isSuperAdmin}
        userName={userName}
      />

      <div className="flex-1 p-8 space-y-8 overflow-auto">
        {activeNav === 'overview' && <AdminOverview isSuperAdmin={isSuperAdmin} />}

        {activeNav === 'doctors' && (
          <DataTable
            title="Gestion des praticiens"
            columns={doctorsColumns}
            data={doctorsData}
            loading={loading}
            onAdd={() => openModal('add')}
            onEdit={(item) => openModal('edit', item)}
            onShow={(item) => openModal('show', item)}
            onDelete={handleDeleteClick}
            searchPlaceholder="Rechercher un praticien..."
          />
        )}

        {activeNav === 'students' && <DataTable title="Étudiants (lecture seule)" columns={studentsColumns} data={studentsData} />}
        {activeNav === 'appointments' && <DataTable title="Rendez-vous (lecture seule)" columns={appointmentsColumns} data={appointmentsData} />}
        {isSuperAdmin && activeNav === 'institutes' && <DataTable title="Établissements (lecture seule)" columns={institutesColumns} data={institutesData} />}
        {isSuperAdmin && activeNav === 'admins' && <DataTable title="Administrateurs (lecture seule)" columns={adminsColumns} data={adminsData} />}

        {/* Modal */}
        {modalOpen && (
          <Dialog open={modalOpen} onOpenChange={(open) => !open && closeModal()}>
            <DialogContent showCloseButton={false}>
              <DialogHeader>
                <DialogTitle>
                  {modalMode === 'add' && 'Ajouter un praticien'}
                  {modalMode === 'edit' && 'Modifier un praticien'}
                  {modalMode === 'show' && 'Détails du praticien'}
                  {modalMode === 'delete-warning' && 'Attention : rendez-vous existants'}
                </DialogTitle>
                <DialogDescription>
                  {modalMode === 'show' && 'Informations complètes du praticien'}
                  {(modalMode === 'add' || modalMode === 'edit') && 'Remplissez les informations du praticien'}
                  {modalMode === 'delete-warning' && 
                    `Ce praticien a ${modalItem.rdvs?.length ?? 0} rendez-vous planifiés.`}
                </DialogDescription>
              </DialogHeader>

              {(modalMode === 'add' || modalMode === 'edit') && (
                <div className="space-y-4 mt-6">
                  {['nom', 'prenom', 'email', 'telephone'].map(field => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
                        {field}
                      </label>
                      <input
                        type={field === 'email' ? 'email' : 'text'}
                        value={modalItem[field as keyof typeof modalItem] ?? ''}
                        onChange={(e) => setModalItem(prev => ({ ...prev, [field]: e.target.value }))}
                        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={field === 'telephone' ? '+216 12 345 678' : ''}
                      />
                    </div>
                  ))}
                </div>
              )}

              {modalMode === 'show' && (
                <div className="space-y-4 mt-6">
                  {['nom', 'prenom', 'email', 'telephone'].map(field => (
                    <div key={field} className="flex justify-between">
                      <span className="text-sm text-gray-500 capitalize">{field}</span>
                      <span className="font-medium">{modalItem[field as keyof typeof modalItem] || '—'}</span>
                    </div>
                  ))}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500">Rendez-vous ({modalItem.rdvs?.length ?? 0})</p>
                  </div>
                </div>
              )}

              {modalMode === 'delete-warning' && (
                <div className="mt-6 space-y-3 text-sm text-gray-700">
                  <p>Ce praticien a <strong>{modalItem.rdvs?.length ?? 0}</strong> rendez-vous actifs.</p>
                  <p className="font-medium text-red-600">La suppression forcée supprimera également tous ces rendez-vous.</p>
                  <p>Voulez-vous continuer ?</p>
                </div>
              )}

              <DialogFooter className="mt-8 flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Annuler
                </button>

                {(modalMode === 'add' || modalMode === 'edit') && (
                  <button
                    onClick={saveModal}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 font-medium"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Enregistrer
                  </button>
                )}

                {modalMode === 'delete-warning' && (
                  <button
                    onClick={() => deleteDoctor(modalItem as Medecin, true)}
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium"
                  >
                    Supprimer quand même
                  </button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}