/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Trash2,
  UserPlus,
  Edit,
  Eye,
  X,
  Save,
  AlertTriangle,
  Calendar,
} from 'lucide-react'

interface Props {
  // Doctors
  doctorModalOpen: boolean
  setDoctorModalOpen: (v: boolean) => void
  doctorModalMode: string
  doctorItem: any
  setDoctorItem: (v: any) => void
  selectedDoctorUniversiteId: number | ''
  setSelectedDoctorUniversiteId: (v: number | '') => void
  universitesData: any[]
  saveDoctor: () => Promise<void>
  openDeleteModal: (type: any, item: any) => void

  // Students
  studentModalOpen: boolean
  closeStudentModal: () => void
  studentModalMode: string
  studentItem: any
  setStudentItem: (v: any) => void
  selectedStudentUniversiteId: number | ''
  setSelectedStudentUniversiteId: (v: number | '') => void
  saveStudent: () => Promise<void>

  // Universites
  universiteModalOpen: boolean
  setUniversiteModalOpen: (v: boolean) => void
  universiteModalMode: string
  universiteItem: any
  setUniversiteItem: (v: any) => void
  saveUniversite: () => Promise<void>

  // Admins
  adminModalOpen: boolean
  closeAdminModal: () => void
  adminModalMode: string
  adminItem: any
  setAdminItem: (v: any) => void
  selectedAdminUniversiteId?: number | ''
  setSelectedAdminUniversiteId?: (v: number | '') => void
  saveAdmin: () => Promise<void>

  // Delete
  deleteModalOpen: boolean
  setDeleteModalOpen: (v: boolean) => void
  deleteMessage: string
  confirmDelete: () => Promise<void>

  // Appointments
  appointmentModalOpen: boolean
  setAppointmentModalOpen: (v: boolean) => void
  appointmentModalMode: string
  appointmentItem: any
  setAppointmentItem: (v: any) => void
  doctorsData: any[]
  etudiantsData: any[]
  saveAppointment: () => Promise<void>
}

export default function AdminModals(props: Props) {
  const p = props

  // Local validation error state for each modal
  const [doctorErrors, setDoctorErrors] = React.useState<Record<string, string>>({})
  const [studentErrors, setStudentErrors] = React.useState<Record<string, string>>({})
  const [adminErrors, setAdminErrors] = React.useState<Record<string, string>>({})
  const [universiteErrors, setUniversiteErrors] = React.useState<Record<string, string>>({})
  const [appointmentErrors, setAppointmentErrors] = React.useState<Record<string, string>>({})

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^\d{8}$/

  // Validators return true if valid, false otherwise and set error messages
  const validateDoctor = () => {
    const errs: Record<string, string> = {}
    const d = p.doctorItem || {}
    if (!d.prenom || String(d.prenom).trim() === '') errs.prenom = 'Le prénom est requis.'
    if (!d.nom || String(d.nom).trim() === '') errs.nom = 'Le nom est requis.'
    if (!d.email || String(d.email).trim() === '') errs.email = 'L\'email est requis.'
    else if (!emailRegex.test(String(d.email))) errs.email = 'Email invalide.'
    if (!d.telephone || String(d.telephone).trim() === '') errs.telephone = 'Le téléphone est requis.'
    else if (!phoneRegex.test(String(d.telephone).replace(/\s+/g, ''))) errs.telephone = 'Le téléphone doit contenir exactement 8 chiffres.'
    // when adding, require university selection
    if (p.doctorModalMode === 'add' && (p.selectedDoctorUniversiteId === '' || p.selectedDoctorUniversiteId === undefined)) errs.universite = 'L\'université est requise.'

    setDoctorErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateStudent = () => {
    const errs: Record<string, string> = {}
    const s = p.studentItem || {}
    if (!s.prenom || String(s.prenom).trim() === '') errs.prenom = 'Le prénom est requis.'
    if (!s.nom || String(s.nom).trim() === '') errs.nom = 'Le nom est requis.'
    if (!s.email || String(s.email).trim() === '') errs.email = 'L\'email est requis.'
    else if (!emailRegex.test(String(s.email))) errs.email = 'Email invalide.'
    if (!s.telephone || String(s.telephone).trim() === '') errs.telephone = 'Le téléphone est requis.'
    else if (!phoneRegex.test(String(s.telephone).replace(/\s+/g, ''))) errs.telephone = 'Le téléphone doit contenir exactement 8 chiffres.'
    if (p.studentModalMode === 'add' && (p.selectedStudentUniversiteId === '' || p.selectedStudentUniversiteId === undefined)) errs.universite = 'L\'université est requise.'

    setStudentErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateAdmin = () => {
    const errs: Record<string, string> = {}
    const a = p.adminItem || {}
    if (!a.prenom || String(a.prenom).trim() === '') errs.prenom = 'Le prénom est requis.'
    if (!a.nom || String(a.nom).trim() === '') errs.nom = 'Le nom est requis.'
    if (!a.email || String(a.email).trim() === '') errs.email = 'L\'email est requis.'
    else if (!emailRegex.test(String(a.email))) errs.email = 'Email invalide.'
    if (!a.telephone || String(a.telephone).trim() === '') errs.telephone = 'Le téléphone est requis.'
    else if (!phoneRegex.test(String(a.telephone).replace(/\s+/g, ''))) errs.telephone = 'Le téléphone doit contenir exactement 8 chiffres.'
    if (p.adminModalMode === 'add' && (p.selectedAdminUniversiteId === '' || p.selectedAdminUniversiteId === undefined)) errs.universite = 'L\'université est requise.'

    setAdminErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateUniversite = () => {
    const errs: Record<string, string> = {}
    const u = p.universiteItem || {}
    if (!u.nom || String(u.nom).trim() === '') errs.nom = 'Le nom est requis.'
    if (!u.ville || String(u.ville).trim() === '') errs.ville = 'La ville est requise.'
    if (!u.adresse || String(u.adresse).trim() === '') errs.adresse = 'L\'adresse est requise.'
    if (!u.telephone || String(u.telephone).trim() === '') errs.telephone = 'Le téléphone est requis.'
    else if (!phoneRegex.test(String(u.telephone).replace(/\s+/g, ''))) errs.telephone = 'Le téléphone doit contenir exactement 8 chiffres.'
    if (!u.code || String(u.code).trim() === '') errs.code = 'Le code est requis.'

    setUniversiteErrors(errs)
    return Object.keys(errs).length === 0
  }

  const validateAppointment = () => {
    const errs: Record<string, string> = {}
    const a = p.appointmentItem || {}
    if (!a.medecinId) errs.medecinId = 'Le praticien est requis.'
    if (!a.etudiantId) errs.etudiantId = 'L\'étudiant est requis.'
    if (!a.date || String(a.date).trim() === '') errs.date = 'La date est requise.'
    if (!a.heure || String(a.heure).trim() === '') errs.heure = 'L\'heure est requise.'

    setAppointmentErrors(errs)
    return Object.keys(errs).length === 0
  }

  // Wrapped save handlers that validate then call parent save
  const handleSaveDoctor = async () => {
    if (!validateDoctor()) return
    await p.saveDoctor()
  }

  const handleSaveStudent = async () => {
    if (!validateStudent()) return
    await p.saveStudent()
  }

  const handleSaveAdmin = async () => {
    if (!validateAdmin()) return
    await p.saveAdmin()
  }

  const handleSaveUniversite = async () => {
    if (!validateUniversite()) return
    await p.saveUniversite()
  }

  const handleSaveAppointment = async () => {
    if (!validateAppointment()) return
    await p.saveAppointment()
  }
  return (
    <>
      {/* Doctors Modal */}
      {p.doctorModalOpen && (
        <Dialog open onOpenChange={p.setDoctorModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-700">
                  {p.doctorModalMode === 'add' ? <UserPlus className="w-5 h-5" /> : p.doctorModalMode === 'edit' ? <Edit className="w-5 h-5" /> : p.doctorModalMode === 'show' ? <Eye className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <DialogTitle className="text-base font-semibold">
                    {p.doctorModalMode === 'add' ? 'Ajouter un praticien' : p.doctorModalMode === 'edit' ? 'Modifier un praticien' : p.doctorModalMode === 'show' ? 'Détails du praticien' : 'Attention : rendez-vous existants'}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-500">
                    {p.doctorModalMode === 'show' ? 'Informations du praticien' : p.doctorModalMode === 'delete-warning' ? 'Suppression dangereuse' : 'Remplissez les informations du praticien'}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {p.doctorModalMode === 'delete-warning' ? (
              <div className="py-4 text-sm text-gray-700">
                Ce praticien a <strong>{p.doctorItem.rdvs?.length ?? 0}</strong> rendez-vous planifiés. La suppression forcée supprimera également tous ces rendez-vous. Voulez-vous continuer ?
              </div>
            ) : p.doctorModalMode === 'show' ? (
              <div className="space-y-3 py-4">
                {['nom', 'prenom', 'email', 'telephone'].map((field) => (
                  <div key={field} className="flex items-start gap-4">
                    <div className="w-28 text-sm text-gray-600 capitalize">{field}</div>
                    <div className="text-sm text-gray-800">{p.doctorItem[field] || '—'}</div>
                  </div>
                ))}
                <div className="flex items-start gap-4">
                  <div className="w-28 text-sm text-gray-600">Université</div>
                  <div className="text-sm text-gray-800">{p.doctorItem.universite?.nom || '—'}</div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Prénom</span>
                    <input id="prenom" value={p.doctorItem.prenom || ''} onChange={(e) => { p.setDoctorItem((prev:any) => ({ ...prev, prenom: e.target.value })); if (doctorErrors.prenom) setDoctorErrors(prev => { const copy = { ...prev }; delete copy.prenom; return copy }) }} className="border border-gray-300 px-3 py-2 rounded-md" required />
                    {doctorErrors.prenom && <div className="text-xs text-red-600 mt-1">{doctorErrors.prenom}</div>}
                  </label>
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Nom</span>
                    <input id="nom" value={p.doctorItem.nom || ''} onChange={(e) => { p.setDoctorItem((prev:any) => ({ ...prev, nom: e.target.value })); if (doctorErrors.nom) setDoctorErrors(prev => { const copy = { ...prev }; delete copy.nom; return copy }) }} className="border border-gray-300 px-3 py-2 rounded-md" required />
                    {doctorErrors.nom && <div className="text-xs text-red-600 mt-1">{doctorErrors.nom}</div>}
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Email</span>
                    <input id="email" type="email" value={p.doctorItem.email || ''} onChange={(e) => { p.setDoctorItem((prev:any) => ({ ...prev, email: e.target.value })); if (doctorErrors.email) setDoctorErrors(prev => { const copy = { ...prev }; delete copy.email; return copy }) }} className="border border-gray-300 px-3 py-2 rounded-md" disabled={p.doctorModalMode === 'edit'} required />
                    {doctorErrors.email && <div className="text-xs text-red-600 mt-1">{doctorErrors.email}</div>}
                  </label>
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Téléphone</span>
                    <input id="telephone" value={p.doctorItem.telephone || ''} onChange={(e) => { p.setDoctorItem((prev:any) => ({ ...prev, telephone: e.target.value })); if (doctorErrors.telephone) setDoctorErrors(prev => { const copy = { ...prev }; delete copy.telephone; return copy }) }} className="border border-gray-300 px-3 py-2 rounded-md" placeholder="12 345 678" />
                    {doctorErrors.telephone && <div className="text-xs text-red-600 mt-1">{doctorErrors.telephone}</div>}
                  </label>
                </div>

                  {p.doctorModalMode === 'add' && (
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Université <span className="text-red-500">*</span></span>
                    <select id="doctor-universite" value={p.selectedDoctorUniversiteId} onChange={(e) => { p.setSelectedDoctorUniversiteId(Number(e.target.value) || ''); if (doctorErrors.universite) setDoctorErrors(prev => { const copy = { ...prev }; delete copy.universite; return copy }) }} className="border border-gray-300 px-3 py-2 rounded-md" required>
                      <option value="">Sélectionner une université</option>
                      {p.universitesData.map(u => (<option key={u.id} value={u.id}>{u.nom} {u.ville ? `(${u.ville})` : ''}</option>))}
                    </select>
                    {doctorErrors.universite && <div className="text-xs text-red-600 mt-1">{doctorErrors.universite}</div>}
                  </label>
                )}
              </div>
            )}

            <DialogFooter className="flex items-center justify-end gap-3">
              <button onClick={() => p.setDoctorModalOpen(false)} className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"><X className="w-4 h-4"/>Annuler</button>

              {(p.doctorModalMode === 'add' || p.doctorModalMode === 'edit') && (
                <button onClick={handleSaveDoctor} className="inline-flex items-center gap-2 px-4 py-2 bg-[#020E68] text-white rounded-md text-sm hover:bg-[#020E68]/90"><Save className="w-4 h-4"/>Enregistrer</button>
              )}

              {p.doctorModalMode === 'delete-warning' && (
                <button onClick={() => { p.setDoctorModalOpen(false); p.openDeleteModal('doctor', p.doctorItem) }} className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"><Trash2 className="w-4 h-4"/>Supprimer</button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Students Modal */}
      {p.studentModalOpen && (
        <Dialog open onOpenChange={p.closeStudentModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-700"><UserPlus className="w-5 h-5"/></div>
                <div>
                  <DialogTitle className="text-base font-semibold">{p.studentModalMode === 'add' ? 'Ajouter un étudiant' : p.studentModalMode === 'edit' ? 'Modifier un étudiant' : 'Détails de l\'étudiant'}</DialogTitle>
                  <DialogDescription className="text-sm text-gray-500">{p.studentModalMode === 'show' ? 'Informations de l\'étudiant' : 'Remplissez ou modifiez les informations'}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {p.studentModalMode === 'show' ? (
              <div className="space-y-3 py-4">
                <div className="flex items-start gap-4"><div className="w-28 text-sm text-gray-600">Nom complet</div><div className="text-sm text-gray-800">{p.studentItem.prenom} {p.studentItem.nom}</div></div>
                <div className="flex items-start gap-4"><div className="w-28 text-sm text-gray-600">Email</div><div className="text-sm text-gray-800">{p.studentItem.email || '—'}</div></div>
                <div className="flex items-start gap-4"><div className="w-28 text-sm text-gray-600">Téléphone</div><div className="text-sm text-gray-800">{p.studentItem.telephone || '—'}</div></div>
                <div className="flex items-start gap-4"><div className="w-28 text-sm text-gray-600">Université</div><div className="text-sm text-gray-800">{p.studentItem.universite?.nom || 'Non assignée'}</div></div>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Prénom</span>
                    <input id="student-prenom" value={p.studentItem.prenom || ''} onChange={(e) => { p.setStudentItem((prev:any) => ({ ...prev, prenom: e.target.value })); if (studentErrors.prenom) setStudentErrors(prev => { const copy = { ...prev }; delete copy.prenom; return copy }) }} className="border border-gray-300 px-3 py-2 rounded-md" required/>
                    {studentErrors.prenom && <div className="text-xs text-red-600 mt-1">{studentErrors.prenom}</div>}
                  </label>
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Nom</span>
                    <input id="student-nom" value={p.studentItem.nom || ''} onChange={(e) => { p.setStudentItem((prev:any) => ({ ...prev, nom: e.target.value })); if (studentErrors.nom) setStudentErrors(prev => { const copy = { ...prev }; delete copy.nom; return copy }) }} className="border border-gray-300 px-3 py-2 rounded-md" required/>
                    {studentErrors.nom && <div className="text-xs text-red-600 mt-1">{studentErrors.nom}</div>}
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Email</span>
                    <input id="student-email" type="email" value={p.studentItem.email || ''} onChange={(e) => { p.setStudentItem((prev:any) => ({ ...prev, email: e.target.value })); if (studentErrors.email) setStudentErrors(prev => { const copy = { ...prev }; delete copy.email; return copy }) }} className="border border-gray-300 px-3 py-2 rounded-md" disabled={p.studentModalMode === 'edit'} required/>
                    {studentErrors.email && <div className="text-xs text-red-600 mt-1">{studentErrors.email}</div>}
                  </label>
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Téléphone</span>
                    <input id="student-telephone" value={p.studentItem.telephone || ''} onChange={(e) => { p.setStudentItem((prev:any) => ({ ...prev, telephone: e.target.value })); if (studentErrors.telephone) setStudentErrors(prev => { const copy = { ...prev }; delete copy.telephone; return copy }) }} className="border border-gray-300 px-3 py-2 rounded-md" placeholder="12 345 678"/>
                    {studentErrors.telephone && <div className="text-xs text-red-600 mt-1">{studentErrors.telephone}</div>}
                  </label>
                </div>
                {p.studentModalMode === 'add' && (
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Université <span className="text-red-500">*</span></span>
                    <select id="student-universite" value={p.selectedStudentUniversiteId} onChange={(e) => { p.setSelectedStudentUniversiteId(Number(e.target.value) || ''); if (studentErrors.universite) setStudentErrors(prev => { const copy = { ...prev }; delete copy.universite; return copy }) }} className="border border-gray-300 px-3 py-2 rounded-md" required>
                      <option value="">Sélectionner une université</option>
                      {p.universitesData.map(u => (<option key={u.id} value={u.id}>{u.nom} {u.ville ? `(${u.ville})` : ''}</option>))}
                    </select>
                    {studentErrors.universite && <div className="text-xs text-red-600 mt-1">{studentErrors.universite}</div>}
                  </label>
                )}
              </div>
            )}

            <DialogFooter className="flex items-center justify-end gap-3"><button type="button" onClick={p.closeStudentModal} className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"><X className="w-4 h-4"/>Annuler</button>{p.studentModalMode !== 'show' && (<button type="button" onClick={handleSaveStudent} className="inline-flex items-center gap-2 px-4 py-2 bg-[#020E68] text-white rounded-md text-sm hover:bg-[#020E68]/90"><Save className="w-4 h-4"/>Enregistrer</button>)}</DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Universites Modal */}
      {p.universiteModalOpen && (
        <Dialog open onOpenChange={() => p.setUniversiteModalOpen(false)}>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-700"><Edit className="w-5 h-5"/></div>
                <div>
                  <DialogTitle className="text-base font-semibold">{p.universiteModalMode === 'add' ? 'Ajouter une université' : p.universiteModalMode === 'edit' ? 'Modifier l’université' : 'Détails de l’université'}</DialogTitle>
                  <DialogDescription className="text-sm text-gray-500">{p.universiteModalMode !== 'show' ? 'Remplissez les informations de l’université' : 'Informations de l’université'}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {p.universiteModalMode === 'show' ? (
              <div className="space-y-3 py-4">
                {['nom','ville','adresse','telephone','code','nbEtudiants','horaire'].map((field) => (
                  <div key={field} className="flex items-start gap-4">
                    <div className="w-36 text-sm text-gray-600 capitalize">{field}</div>
                    <div className="text-sm text-gray-800">{p.universiteItem[field] ?? '—'}</div>
                  </div>
                ))}
                {p.universiteItem.logoPath && (<div className="flex items-start gap-4"><div className="w-36 text-sm text-gray-600">Logo</div><div className="text-sm"><img src={p.universiteItem.logoPath} alt="Logo université" className="max-h-24 w-auto object-contain"/></div></div>)}
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['nom','ville','adresse','telephone'].map((field) => (
                    <label key={field} className="flex flex-col text-sm">
                      <span className="text-gray-600 mb-1 capitalize">{field}</span>
                      <input id={field} type={field === 'nbEtudiants' ? 'number' : 'text'} value={p.universiteItem[field] ?? ''} onChange={(e) => { p.setUniversiteItem((prev:any) => ({ ...prev, [field]: e.target.value })); if (universiteErrors[field]) setUniversiteErrors(prev => { const copy = { ...prev }; delete copy[field]; return copy }) }} className="border border-gray-300 px-3 py-2 rounded-md" placeholder={field === 'telephone' ? '12 345 678' : ''} />
                      {universiteErrors[field] && <div className="text-xs text-red-600 mt-1">{universiteErrors[field]}</div>}
                    </label>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Code</span>
                    <input id="code" value={p.universiteItem.code ?? ''} onChange={(e) => { p.setUniversiteItem((prev:any) => ({ ...prev, code: e.target.value })); if (universiteErrors.code) setUniversiteErrors(prev => { const copy = { ...prev }; delete copy.code; return copy }) }} className="border border-gray-300 px-3 py-2 rounded-md"/>
                    {universiteErrors.code && <div className="text-xs text-red-600 mt-1">{universiteErrors.code}</div>}
                  </label>
                  <label className="flex flex-col text-sm"><span className="text-gray-600 mb-1">Nombre d’étudiants</span><input id="nbEtudiants" type="number" value={p.universiteItem.nbEtudiants ?? ''} onChange={(e) => p.setUniversiteItem((prev:any) => ({ ...prev, nbEtudiants: Number(e.target.value) || undefined }))} className="border border-gray-300 px-3 py-2 rounded-md" placeholder="Nombre d’étudiants"/></label>
                </div>

                <div className="flex flex-col text-sm">
                  <span className="text-gray-600 mb-1">Horaires</span>
                  <input id="horaire" value={p.universiteItem.horaire ?? ''} onChange={(e) => p.setUniversiteItem((prev:any) => ({ ...prev, horaire: e.target.value }))} className="border border-gray-300 px-3 py-2 rounded-md" />
                </div>

                <div className="flex flex-col text-sm">
                  <span className="text-gray-600 mb-2">Logo</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    <div className="sm:col-span-2">
                      <input id="uni-logo-input" type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { p.setUniversiteItem((prev:any) => ({ ...prev, logoFile: file, logoPath: URL.createObjectURL(file) })) } }} />
                      <label htmlFor="uni-logo-input" className="block cursor-pointer rounded-md border-2 border-dashed border-gray-200 hover:border-gray-300 p-4 text-center">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-gray-50 flex items-center justify-center text-gray-500">📁</div>
                          <div className="text-sm text-gray-700">
                            Cliquez ou déposez le logo ici<br />
                            <span className="text-xs text-gray-500">PNG, JPG — recommandé 300×300 px</span>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center gap-3 sm:col-span-1">
                      {p.universiteItem.logoPath ? (
                        <div className="w-full">
                          <div className="flex items-center justify-center">
                            <img src={p.universiteItem.logoPath} alt="Aperçu logo" className="max-h-20 w-auto object-contain border rounded" />
                          </div>

                          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:gap-2">
                            <button
                              type="button"
                              onClick={() => p.setUniversiteItem((prev:any) => ({ ...prev, logoFile: undefined, logoPath: '' }))}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-2 border rounded-md text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              Supprimer
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Aucun logo</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex items-center justify-end gap-3">
              <button onClick={() => p.setUniversiteModalOpen(false)} className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"><X className="w-4 h-4"/>Annuler</button>
              {p.universiteModalMode !== 'show' && (<button onClick={handleSaveUniversite} className="inline-flex items-center gap-2 px-4 py-2 bg-[#020E68] text-white rounded-md text-sm hover:bg-[#020E68]/90"><Save className="w-4 h-4"/>Enregistrer</button>)}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Admins Modal */}
      {p.adminModalOpen && (
        <Dialog open onOpenChange={p.closeAdminModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-700"><UserPlus className="w-5 h-5"/></div>
                <div>
                  <DialogTitle className="text-base font-semibold">{p.adminModalMode === 'add' ? 'Ajouter un administrateur' : p.adminModalMode === 'edit' ? 'Modifier l’administrateur' : 'Détails de l’administrateur'}</DialogTitle>
                  <DialogDescription className="text-sm text-gray-500">{p.adminModalMode !== 'show' ? 'Remplissez les informations et assignez une université' : 'Informations de l’administrateur'}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {p.adminModalMode === 'show' ? (
              <div className="space-y-3 py-4">
                <div className="flex items-start gap-4"><div className="w-28 text-sm text-gray-600">Nom complet</div><div className="text-sm text-gray-800">{p.adminItem.prenom} {p.adminItem.nom}</div></div>
                <div className="flex items-start gap-4"><div className="w-28 text-sm text-gray-600">Email</div><div className="text-sm text-gray-800">{p.adminItem.email || '—'}</div></div>
                <div className="flex items-start gap-4"><div className="w-28 text-sm text-gray-600">Téléphone</div><div className="text-sm text-gray-800">{p.adminItem.telephone || '—'}</div></div>
                <div className="flex items-start gap-4"><div className="w-28 text-sm text-gray-600">Université</div><div className="text-sm text-gray-800">{p.adminItem.universite?.nom || 'Non assignée'}</div></div>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Prénom</span>
                    <input id="prenom" value={p.adminItem.prenom || ''} onChange={(e) => { p.setAdminItem((prev:any) => ({ ...prev, prenom: e.target.value })); if (adminErrors.prenom) setAdminErrors(prev => { const copy = { ...prev }; delete copy.prenom; return copy }) }} className="border border-gray-300 px-3 py-2 rounded-md" required/>
                    {adminErrors.prenom && <div className="text-xs text-red-600 mt-1">{adminErrors.prenom}</div>}
                  </label>
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Nom</span>
                    <input id="nom" value={p.adminItem.nom || ''} onChange={(e) => { p.setAdminItem((prev:any) => ({ ...prev, nom: e.target.value })); if (adminErrors.nom) setAdminErrors(prev => { const copy = { ...prev }; delete copy.nom; return copy }) }} className="border border-gray-300 px-3 py-2 rounded-md" required/>
                    {adminErrors.nom && <div className="text-xs text-red-600 mt-1">{adminErrors.nom}</div>}
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Email</span>
                    <input id="email" type="email" value={p.adminItem.email || ''} onChange={(e) => { p.setAdminItem((prev:any) => ({ ...prev, email: e.target.value })); if (adminErrors.email) setAdminErrors(prev => { const copy = { ...prev }; delete copy.email; return copy }) }} className="border border-gray-300 px-3 py-2 rounded-md" disabled={p.adminModalMode === 'edit'} required/>
                    {adminErrors.email && <div className="text-xs text-red-600 mt-1">{adminErrors.email}</div>}
                  </label>
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Téléphone</span>
                    <input id="telephone" value={p.adminItem.telephone || ''} onChange={(e) => { p.setAdminItem((prev:any) => ({ ...prev, telephone: e.target.value })); if (adminErrors.telephone) setAdminErrors(prev => { const copy = { ...prev }; delete copy.telephone; return copy }) }} className="border border-gray-300 px-3 py-2 rounded-md" placeholder="12 345 678"/>
                    {adminErrors.telephone && <div className="text-xs text-red-600 mt-1">{adminErrors.telephone}</div>}
                  </label>
                </div>
                {p.adminModalMode === 'add' && (<label className="flex flex-col text-sm"><span className="text-gray-600 mb-1">Université</span><select id="universite" value={p.selectedAdminUniversiteId ?? ''} onChange={(e) => p.setSelectedAdminUniversiteId && p.setSelectedAdminUniversiteId(Number(e.target.value))} className="border border-gray-300 px-3 py-2 rounded-md" required><option value="">Sélectionner une université</option>{p.universitesData.map((u) => (<option key={u.id} value={u.id}>{u.nom} ({u.ville})</option>))}</select></label>)}
              </div>
            )}

            <DialogFooter className="flex items-center justify-end gap-3">
              <button type="button" onClick={p.closeAdminModal} className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"><X className="w-4 h-4"/>Annuler</button>
              {p.adminModalMode !== 'show' && (<button type="button" onClick={handleSaveAdmin} className="inline-flex items-center gap-2 px-4 py-2 bg-[#020E68] text-white rounded-md text-sm hover:bg-[#020E68]/90"><Save className="w-4 h-4"/>Enregistrer</button>)}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Shared Delete Confirmation Modal */}
      {p.deleteModalOpen && (
        <Dialog open onOpenChange={() => p.setDeleteModalOpen(false)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-md bg-red-50 flex items-center justify-center text-red-600 mt-1"><Trash2 className="w-4 h-4"/></div>
                <div>
                  <DialogTitle className="text-base font-medium text-gray-900">Confirmer la suppression</DialogTitle>
                  <DialogDescription className="text-sm text-gray-600">Veuillez confirmer que vous souhaitez supprimer cet élément.</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="mt-4">
              <div className="rounded-md border border-gray-100 bg-gray-50 p-3 text-sm text-gray-800">
                {p.deleteMessage}
              </div>
              <div className="mt-2 text-xs text-gray-500">Cette action est irréversible et supprimera les données associées.</div>
            </div>

            <DialogFooter className="mt-6">
              <div className="flex flex-col-reverse sm:flex-row-reverse gap-3">
                <button type="button" onClick={p.confirmDelete} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"><Trash2 className="w-4 h-4"/>Supprimer</button>
                <button type="button" onClick={() => p.setDeleteModalOpen(false)} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"><X className="w-4 h-4"/>Annuler</button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Appointment Modal */}
      {p.appointmentModalOpen && (
        <Dialog open onOpenChange={p.setAppointmentModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-700"><Calendar className="w-5 h-5"/></div>
                <div>
                  <DialogTitle className="text-base font-semibold">{p.appointmentModalMode === 'add' ? 'Nouveau rendez-vous' : p.appointmentModalMode === 'edit' ? 'Modifier le rendez-vous' : 'Détails du rendez-vous'}</DialogTitle>
                  <DialogDescription className="text-sm text-gray-500">{p.appointmentModalMode === 'show' ? 'Détails' : 'Planifiez ou modifiez un rendez-vous'}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {p.appointmentModalMode === 'show' ? (
              <div className="space-y-3 py-4">
                <div className="flex items-start gap-4"><div className="w-28 text-sm text-gray-600">Praticien</div><div className="text-sm text-gray-800">{p.appointmentItem.medecin ? `Dr. ${p.appointmentItem.medecin.prenom} ${p.appointmentItem.medecin.nom}` : '—'}</div></div>
                <div className="flex items-start gap-4"><div className="w-28 text-sm text-gray-600">Étudiant</div><div className="text-sm text-gray-800">{p.appointmentItem.etudiant ? `${p.appointmentItem.etudiant.prenom} ${p.appointmentItem.etudiant.nom}` : '—'}</div></div>
                <div className="flex items-start gap-4"><div className="w-28 text-sm text-gray-600">Date</div><div className="text-sm text-gray-800">{p.appointmentItem.date || '—'}</div></div>
                <div className="flex items-start gap-4"><div className="w-28 text-sm text-gray-600">Heure</div><div className="text-sm text-gray-800">{p.appointmentItem.heure || '—'}</div></div>
                <div className="flex items-start gap-4"><div className="w-28 text-sm text-gray-600">Statut</div><div className="text-sm"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.appointmentItem.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : p.appointmentItem.status === 'CANCELED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.appointmentItem.status === 'CONFIRMED' ? 'Confirmé' : p.appointmentItem.status === 'CANCELED' ? 'Annulé' : 'En attente'}</span></div></div>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Médecin *</span>
                    <select value={p.appointmentItem.medecinId || ''} onChange={(e) => { p.setAppointmentItem((prev:any) => ({ ...prev, medecinId: e.target.value })); if (appointmentErrors.medecinId) setAppointmentErrors(prev => { const copy = { ...prev }; delete copy.medecinId; return copy }) }} className="border rounded px-3 py-2" disabled={p.appointmentModalMode === 'edit'} required>
                      <option value="">Sélectionner un médecin</option>
                      {p.doctorsData.map(doc => (<option key={doc.id} value={doc.id}>Dr. {doc.prenom} {doc.nom}</option>))}
                    </select>
                    {appointmentErrors.medecinId && <div className="text-xs text-red-600 mt-1">{appointmentErrors.medecinId}</div>}
                  </label>
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Étudiant *</span>
                    <select value={p.appointmentItem.etudiantId || ''} onChange={(e) => { p.setAppointmentItem((prev:any) => ({ ...prev, etudiantId: e.target.value })); if (appointmentErrors.etudiantId) setAppointmentErrors(prev => { const copy = { ...prev }; delete copy.etudiantId; return copy }) }} className="border rounded px-3 py-2" required>
                      <option value="">Sélectionner un étudiant</option>
                      {p.etudiantsData.map(et => (<option key={et.id} value={et.id}>{et.prenom} {et.nom}</option>))}
                    </select>
                    {appointmentErrors.etudiantId && <div className="text-xs text-red-600 mt-1">{appointmentErrors.etudiantId}</div>}
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Date *</span>
                    <input type="date" value={p.appointmentItem.date || ''} onChange={(e) => { p.setAppointmentItem((prev:any) => ({ ...prev, date: e.target.value })); if (appointmentErrors.date) setAppointmentErrors(prev => { const copy = { ...prev }; delete copy.date; return copy }) }} className="border rounded px-3 py-2" required/>
                    {appointmentErrors.date && <div className="text-xs text-red-600 mt-1">{appointmentErrors.date}</div>}
                  </label>
                  <label className="flex flex-col text-sm">
                    <span className="text-gray-600 mb-1">Heure *</span>
                    <input type="time" value={p.appointmentItem.heure || ''} onChange={(e) => { p.setAppointmentItem((prev:any) => ({ ...prev, heure: e.target.value })); if (appointmentErrors.heure) setAppointmentErrors(prev => { const copy = { ...prev }; delete copy.heure; return copy }) }} className="border rounded px-3 py-2" required/>
                    {appointmentErrors.heure && <div className="text-xs text-red-600 mt-1">{appointmentErrors.heure}</div>}
                  </label>
                </div>
                {p.appointmentModalMode === 'edit' && (<label className="flex flex-col text-sm"><span className="text-gray-600 mb-1">Statut</span><select value={p.appointmentItem.status || 'CONFIRMED'} onChange={(e) => p.setAppointmentItem((prev:any) => ({ ...prev, status: e.target.value }))} className="border rounded px-3 py-2"><option value="CONFIRMED">Confirmé</option><option value="CANCELED">Annulé</option></select></label>)}
              </div>
            )}

            <DialogFooter className="flex items-center justify-end gap-3"><button type="button" onClick={() => p.setAppointmentModalOpen(false)} className="inline-flex items-center gap-2 px-4 py-2 border rounded text-sm text-gray-700 hover:bg-gray-50"><X className="w-4 h-4"/>Annuler</button>{p.appointmentModalMode !== 'show' && (<button type="button" onClick={handleSaveAppointment} className="inline-flex items-center gap-2 px-4 py-2 bg-[#020E68] text-white rounded text-sm hover:bg-[#020E68]/90"><Save className="w-4 h-4"/>Enregistrer</button>)}</DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
