'use client'

import { useState } from 'react'
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
import { CheckCircle } from './ui/icons'

type NavType = 'overview' | 'institute' | 'doctors' | 'students' | 'appointments' | 'institutes' | 'admins'

interface AdminDashboardProps {
  isSuperAdmin?: boolean
  userName?: string
}

export default function AdminDashboard({ isSuperAdmin = false, userName = 'Admin User' }: AdminDashboardProps) {
  const [activeNav, setActiveNav] = useState<NavType>('overview')

  // Mock data (stateful so Add/Edit/Delete work)
  const [doctorsData, setDoctorsData] = useState([
    { id: 1, name: 'Dr. Amira Ben Salem', specialty: 'Psychology', email: 'amira@univ-sousse.tn', status: 'Actif' },
    { id: 2, name: 'M. Sami Mansour', specialty: 'Cognitive Therapy', email: 'sami@univ-sousse.tn', status: 'Actif' },
    { id: 3, name: 'Dr. Leila Trabelsi', specialty: 'Career Counseling', email: 'leila@univ-sousse.tn', status: 'Inactif' }
  ])

  const [studentsData, setStudentsData] = useState([
    { id: 1, name: 'John Doe', email: 'john@student.us.tn', department: 'Psychology', year: 'Master 1' },
    { id: 2, name: 'Fatima Ali', email: 'fatima@student.us.tn', department: 'Psychology', year: 'Master 2' },
    { id: 3, name: 'Ahmed Ben', email: 'ahmed@student.us.tn', department: 'Law', year: 'Licence 3' }
  ])

  const [appointmentsData, setAppointmentsData] = useState([
    { id: 1, doctor: 'Dr. Amira Ben Salem', student: 'John Doe', date: '2026-02-15', time: '14:30', status: 'Programmé' },
    { id: 2, doctor: 'M. Sami Mansour', student: 'Fatima Ali', date: '2026-02-22', time: '10:00', status: 'Terminé' },
    { id: 3, doctor: 'Dr. Leila Trabelsi', student: 'Ahmed Ben', date: '2026-02-08', time: '15:00', status: 'Terminé' }
  ])

  const [institutesData, setInstitutesData] = useState([
    { id: 1, name: 'École Supérieure des Sciences et de la Technologie de Hammam Sousse', admin: 'Dr. Hassan', doctors: 8, students: 145, appointments: 342 },
    { id: 2, name: 'Faculty of Law', admin: 'Prof. Karim', doctors: 5, students: 98, appointments: 201 },
    { id: 3, name: 'Faculty of Economics', admin: 'Dr. Fatima', doctors: 6, students: 127, appointments: 289 }
  ])

  const [adminsData, setAdminsData] = useState([
    { id: 1, name: 'Dr. Hassan', email: 'hassan@univ-sousse.tn', institute: 'Faculty of Medicine', role: 'Admin' },
    { id: 2, name: 'Prof. Karim', email: 'karim@univ-sousse.tn', institute: 'Faculty of Law', role: 'Admin' },
    { id: 3, name: 'Dr. Fatima', email: 'fatima@univ-sousse.tn', institute: 'Faculty of Economics', role: 'Admin' }
  ])

  // columns for tables (reused for modal fields)
  const doctorsColumns = [
    { key: 'name', label: 'Nom' },
    { key: 'specialty', label: 'Spécialité' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Statut' }
  ]

  const studentsColumns = [
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'department', label: 'Département' },
    { key: 'year', label: 'Année' }
  ]

  const appointmentsColumns = [
    { key: 'doctor', label: 'Praticien' },
    { key: 'student', label: 'Étudiant' },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Heure' },
    { key: 'status', label: 'Statut' }
  ]

  const institutesColumns = [
    { key: 'name', label: 'Nom' },
    { key: 'admin', label: 'Admin' },
    { key: 'doctors', label: 'Praticiens' },
    { key: 'students', label: 'Étudiants' },
    { key: 'appointments', label: 'Rendez-vous' }
  ]

  const adminsColumns = [
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'institute', label: 'Établissement' },
    { key: 'role', label: 'Rôle' }
  ]

  // Modal state for Ajouter / Modifier / Afficher
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add'|'edit'|'show'>('show')
  const [modalEntity, setModalEntity] = useState<string | null>(null)
  const [modalItem, setModalItem] = useState<Record<string, unknown> | null>(null)
  const [modalColumns, setModalColumns] = useState<Array<{ key: string; label: string }> | null>(null)

  const openModal = (mode: 'add'|'edit'|'show', entity: string, columns: Array<{ key: string; label: string }>, item?: Record<string, unknown>) => {
    setModalMode(mode)
    setModalEntity(entity)
    setModalColumns(columns)
    setModalItem(item ? { ...item } : {})
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setModalItem(null)
    setModalColumns(null)
    setModalEntity(null)
  }

  const saveModal = () => {
    if (!modalEntity || !modalColumns || !modalItem) return
    const data: Record<string, unknown> = { ...(modalItem as Record<string, unknown>) }
    // ensure id
    if (!data['id']) data['id'] = Date.now()
    // generic upsert with typed setter
    const upsertTyped = <T extends { id: number }>(setter: React.Dispatch<React.SetStateAction<T[]>>) => {
      const payload = data as unknown as T
      setter(prev => modalMode === 'add' ? [...prev, payload] : prev.map(a => (a.id === payload.id ? payload : a)))
    }

    if (modalEntity === 'doctors') upsertTyped<typeof doctorsData[number]>(setDoctorsData)
    if (modalEntity === 'students') upsertTyped<typeof studentsData[number]>(setStudentsData)
    if (modalEntity === 'appointments') upsertTyped<typeof appointmentsData[number]>(setAppointmentsData)
    if (modalEntity === 'institutes') upsertTyped<typeof institutesData[number]>(setInstitutesData)
    if (modalEntity === 'admins') upsertTyped<typeof adminsData[number]>(setAdminsData)

    closeModal()
  }

  const entityLabels: Record<string, string> = {
    doctors: 'praticien',
    students: 'étudiant',
    appointments: 'rendez-vous',
    institutes: 'établissement',
    admins: 'administrateur'
  }

  

  // Determine institute for the current admin (mock logic)
  const currentInstitute = institutesData.find(i => i.admin === userName)

  return (
    <div className="min-h-screen bg-white flex">
      <AdminSidebar
        activeNav={activeNav}
        onNavChange={(id: string) => setActiveNav(id as NavType)}
        isSuperAdmin={isSuperAdmin}
        userName={userName}
        instituteName={currentInstitute?.name}
        // For demo use a static logo in /public; replace with real per-institute URLs as needed
        instituteLogo={currentInstitute ? '/universitedesousse.png' : undefined}
      />

      <div className="flex-1 overflow-auto">
        <div className="p-8 space-y-8">
          {activeNav === 'overview' && (
            <AdminOverview isSuperAdmin={isSuperAdmin} />
          )}

          {activeNav === 'doctors' && (
            <DataTable
              title="Gestion des praticiens"
              columns={doctorsColumns}
              data={doctorsData}
              onAdd={() => openModal('add', 'doctors', doctorsColumns)}
              onEdit={(item) => openModal('edit', 'doctors', doctorsColumns, item)}
              onShow={(item) => openModal('show', 'doctors', doctorsColumns, item)}
              onDelete={(item) => { if (confirm(`Supprimer ${String(item['name'])}?`)) { setDoctorsData(doctorsData.filter(d => d.id !== item.id)) } }}
              onExport={() => alert('Exporter praticiens')}
              onImport={() => alert('Importer praticiens')}
              searchPlaceholder="Rechercher un praticien par nom ou spécialité..."
            />
          )}

          {activeNav === 'students' && (
            <DataTable
              title="Gestion des étudiants"
              columns={studentsColumns}
              data={studentsData}
              onAdd={() => openModal('add', 'students', studentsColumns)}
              onEdit={(item) => openModal('edit', 'students', studentsColumns, item)}
              onShow={(item) => openModal('show', 'students', studentsColumns, item)}
              onDelete={(item) => { if (confirm(`Supprimer ${String(item['name'])}?`)) { setStudentsData(studentsData.filter(s => s.id !== item.id)) } }}
              onExport={() => alert('Exporter étudiants')}
              onImport={() => alert('Importer étudiants')}
              searchPlaceholder="Rechercher un étudiant par nom ou département..."
            />
          )}

          {activeNav === 'appointments' && (
            <DataTable
              title="Gestion des rendez-vous"
              columns={appointmentsColumns}
              data={appointmentsData}
              onAdd={() => openModal('add', 'appointments', appointmentsColumns)}
              onEdit={(item) => openModal('edit', 'appointments', appointmentsColumns, item)}
              onShow={(item) => openModal('show', 'appointments', appointmentsColumns, item)}
              onDelete={(item) => { if (confirm(`Supprimer le rendez-vous ${String(item['id'])}?`)) { setAppointmentsData(appointmentsData.filter(a => a.id !== item.id)) } }}
              onExport={() => alert('Exporter rendez-vous')}
              searchPlaceholder="Rechercher des rendez-vous..."
            />
          )}

          {isSuperAdmin && activeNav === 'institutes' && (
            <DataTable
              title="Gestion des établissements"
              columns={institutesColumns}
              data={institutesData}
              onAdd={() => openModal('add', 'institutes', institutesColumns)}
              onEdit={(item) => openModal('edit', 'institutes', institutesColumns, item)}
              onShow={(item) => openModal('show', 'institutes', institutesColumns, item)}
              onDelete={(item) => { if (confirm(`Supprimer ${String(item['name'])}?`)) { setInstitutesData(institutesData.filter(i => i.id !== item.id)) } }}
              onExport={() => alert('Exporter établissements')}
              searchPlaceholder="Rechercher des établissements..."
            />
          )}

          {isSuperAdmin && activeNav === 'admins' && (
            <DataTable
              title="Gestion des administrateurs"
              columns={adminsColumns}
              data={adminsData}
              onAdd={() => openModal('add', 'admins', adminsColumns)}
              onEdit={(item) => openModal('edit', 'admins', adminsColumns, item)}
              onShow={(item) => openModal('show', 'admins', adminsColumns, item)}
              onDelete={(item) => { if (confirm(`Supprimer ${String(item['name'])}?`)) { setAdminsData(adminsData.filter(a => a.id !== item.id)) } }}
              onExport={() => alert('Exporter administrateurs')}
              searchPlaceholder="Rechercher des administrateurs..."
            />
          )}

          {!isSuperAdmin && activeNav === 'institute' && (
            <div className="bg-white border border-gray-100 rounded-lg p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Informations de l&apos;établissement</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Nom de l&apos;établissement</p>
                    <p className="text-lg font-semibold text-gray-800 mt-1">Faculty of Medicine - Sousse</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Université</p>
                    <p className="text-lg font-semibold text-gray-800 mt-1">Université de Sousse</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nombre de praticiens</p>
                    <p className="text-lg font-semibold text-gray-800 mt-1">8</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nombre d&apos;étudiants</p>
                    <p className="text-lg font-semibold text-gray-800 mt-1">145</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6">
                <button className="px-6 py-2.5 border border-gray-300 text-gray-800 rounded font-medium hover:bg-gray-100 transition-colors">
                  Modifier les informations
                </button>
              </div>
            </div>
          )}
          {/* Modal for Ajouter/Modifier/Afficher */}
          {modalOpen && (
            <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) closeModal(); setModalOpen(open) }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {modalMode === 'add' ? `Ajouter ${entityLabels[modalEntity ?? ''] ?? modalEntity}` : modalMode === 'edit' ? `Modifier ${entityLabels[modalEntity ?? ''] ?? modalEntity}` : `Afficher ${entityLabels[modalEntity ?? ''] ?? modalEntity}`}
                  </DialogTitle>
                  <DialogDescription>
                    {modalMode === 'show' ? 'Détails' : 'Remplissez les champs ci-dessous'}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {modalColumns?.map(col => (
                    modalMode === 'show' ? (
                      <div key={col.key}>
                        <p className="text-sm text-gray-500">{col.label}</p>
                        <p className="font-medium">{String(modalItem?.[col.key] ?? '')}</p>
                      </div>
                    ) : (
                      <div key={col.key}>
                        <label className="text-sm text-gray-600">{col.label}</label>
                        <input
                          value={String(modalItem?.[col.key] ?? '')}
                          onChange={(e) => setModalItem({ ...(modalItem ?? {}), [col.key]: e.target.value })}
                          className="w-full border px-3 py-2 rounded mt-1"
                        />
                      </div>
                    )
                  ))}
                </div>

                <DialogFooter>
                  <button onClick={closeModal} className="px-4 py-2 border rounded text-sm mr-2">Annuler</button>
                  {modalMode !== 'show' ? (
                    <button onClick={saveModal} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Enregistrer
                    </button>
                  ) : (
                    <button onClick={closeModal} className="px-4 py-2 bg-gray-200 text-gray-800 rounded text-sm">Fermer</button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  )
}
