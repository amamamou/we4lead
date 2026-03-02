/* eslint-disable react/no-unescaped-entities */
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
  Loader,
} from 'lucide-react'

interface Props {
  // Doctors
  doctorModalOpen: boolean
  setDoctorModalOpen: (v: boolean) => void
  doctorModalMode: string
  doctorItem: any
  setDoctorItem: (v: any) => void
  selectedDoctorUniversiteIds: number[]
  setSelectedDoctorUniversiteIds: (v: number[]) => void
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

  // Institutions
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
  // Demandes (read-only detail modal)
  demandeModalOpen?: boolean
  setDemandeModalOpen?: (v: boolean) => void
  demandeItem?: any
  setDemandeItem?: (v: any) => void
}

export default function AdminModals(props: Props) {
  const p = props

  // Local validation error state for each modal
  const [doctorErrors, setDoctorErrors] = React.useState<Record<string, string>>({})
  const [studentErrors, setStudentErrors] = React.useState<Record<string, string>>({})
  const [adminErrors, setAdminErrors] = React.useState<Record<string, string>>({})
  const [universiteErrors, setUniversiteErrors] = React.useState<Record<string, string>>({})
  const [appointmentErrors, setAppointmentErrors] = React.useState<Record<string, string>>({})

  // Loading states for save operations
  const [isDoctorLoading, setIsDoctorLoading] = React.useState(false)
  const [isStudentLoading, setIsStudentLoading] = React.useState(false)
  const [isAdminLoading, setIsAdminLoading] = React.useState(false)
  const [isUniversiteLoading, setIsUniversiteLoading] = React.useState(false)
  const [isAppointmentLoading, setIsAppointmentLoading] = React.useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = React.useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^\d{8}$/

  // Validators return true if valid, false otherwise and set error messages
  const validateDoctor = () => {
  const errs: Record<string, string> = {};
  const d = p.doctorItem || {};

  // Champs obligatoires de base
  if (!d.prenom?.trim()) {
    errs.prenom = "Le prénom est requis.";
  }

  if (!d.nom?.trim()) {
    errs.nom = "Le nom est requis.";
  }

  // Email
  if (!d.email?.trim()) {
    errs.email = "L'email est requis.";
  } else if (!emailRegex.test(d.email.trim())) {
    errs.email = "Format d'email invalide.";
  }

  // Téléphone (8 chiffres exactement, Tunisie)
  if (!d.telephone?.trim()) {
    errs.telephone = "Le numéro de téléphone est requis.";
  } else {
    const cleaned = String(d.telephone).replace(/\s+/g, "");
    if (!phoneRegex.test(cleaned)) {
      errs.telephone = "Le téléphone doit contenir exactement 8 chiffres (ex: 98 123 456).";
    }
  }

  // Spécialité (très important pour un médecin)
  if (!d.specialite?.trim()) {
    errs.specialite = "La spécialité est requise.";
  }

  // Institutions (seulement en mode création)
  if (p.doctorModalMode === "add") {
    if (
      !Array.isArray(p.selectedDoctorUniversiteIds) ||
      p.selectedDoctorUniversiteIds.length === 0
    ) {
      errs.universite = "Au moins une institution doit être sélectionnée.";
    }
  }
  setDoctorErrors(errs);
  return Object.keys(errs).length === 0;
};

  const validateStudent = () => {
    const errs: Record<string, string> = {}
    const s = p.studentItem || {}
    if (!s.prenom || String(s.prenom).trim() === '') errs.prenom = 'Le prénom est requis.'
    if (!s.nom || String(s.nom).trim() === '') errs.nom = 'Le nom est requis.'
    if (!s.email || String(s.email).trim() === '') errs.email = 'L\'email est requis.'
    else if (!emailRegex.test(String(s.email))) errs.email = 'Email invalide.'
    if (!s.telephone || String(s.telephone).trim() === '') errs.telephone = 'Le téléphone est requis.'
    else if (!phoneRegex.test(String(s.telephone).replace(/\s+/g, ''))) errs.telephone = 'Le téléphone doit contenir exactement 8 chiffres.'
  if (p.studentModalMode === 'add' && (p.selectedStudentUniversiteId === '' || p.selectedStudentUniversiteId === undefined)) errs.universite = 'L\'institution est requise.'

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
  if (p.adminModalMode === 'add' && (p.selectedAdminUniversiteId === '' || p.selectedAdminUniversiteId === undefined)) errs.universite = 'L\'institution est requise.'

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
    // 'code' is no longer required or collected on the frontend

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
    setIsDoctorLoading(true)
    try {
      await p.saveDoctor()
    } finally {
      setIsDoctorLoading(false)
    }
  }

  const handleSaveStudent = async () => {
    if (!validateStudent()) return
    setIsStudentLoading(true)
    try {
      await p.saveStudent()
    } finally {
      setIsStudentLoading(false)
    }
  }

  const handleSaveAdmin = async () => {
    if (!validateAdmin()) return
    setIsAdminLoading(true)
    try {
      await p.saveAdmin()
    } finally {
      setIsAdminLoading(false)
    }
  }

  const handleSaveUniversite = async () => {
    if (!validateUniversite()) return
    setIsUniversiteLoading(true)
    try {
      await p.saveUniversite()
    } finally {
      setIsUniversiteLoading(false)
    }
  }

  const handleSaveAppointment = async () => {
    if (!validateAppointment()) return
    setIsAppointmentLoading(true)
    try {
      await p.saveAppointment()
    } finally {
      setIsAppointmentLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    setIsDeleteLoading(true)
    try {
      await p.confirmDelete()
    } finally {
      setIsDeleteLoading(false)
    }
  }
  return (
    <>
      {/* Doctors Modal */}
{/* Doctors Modal */}
{p.doctorModalOpen && (
  <Dialog open onOpenChange={p.setDoctorModalOpen}>
    <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-gray-200">
      <DialogHeader className="border-b border-gray-100 pb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
            {p.doctorModalMode === 'add' ? <UserPlus className="w-6 h-6" style={{ color: '#666' }} /> : p.doctorModalMode === 'edit' ? <Edit className="w-6 h-6" style={{ color: '#666' }} /> : p.doctorModalMode === 'show' ? <Eye className="w-6 h-6" style={{ color: '#666' }} /> : <AlertTriangle className="w-6 h-6" style={{ color: '#666' }} />}
          </div>
          <div className="flex-1">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {p.doctorModalMode === 'add' ? 'Ajouter un intervenant' : p.doctorModalMode === 'edit' ? 'Modifier un intervenant' : p.doctorModalMode === 'show' ? 'Détails' : 'Attention : rendez-vous existants'}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-0.5">
              {p.doctorModalMode === 'show' ? 'Consultez les informations de l\'intervenant' : p.doctorModalMode === 'delete-warning' ? 'Veuillez confirmer cette action irréversible' : 'Complétez les informations obligatoires'}
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      {p.doctorModalMode === 'delete-warning' ? (
        <div className="py-6 px-2">
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              Ce praticien a <strong className="text-red-600">{p.doctorItem.rdvs?.length ?? 0}</strong> rendez-vous planifiés. La suppression forcée supprimera également tous ces rendez-vous.
            </p>
            <p className="text-xs text-gray-600 mt-2">Veuillez confirmer cette action irréversible.</p>
          </div>
        </div>
      ) : p.doctorModalMode === 'show' ? (
        <div className="space-y-3 py-4">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              {['nom', 'prenom', 'email', 'telephone', 'specialite'].map((field) => (
                <div key={field} className="flex items-start gap-4">
                  <div className="w-28 text-sm text-gray-600 capitalize">
                    {field === 'specialite' ? 'Spécialité' : field}
                  </div>
                  <div className="text-sm text-gray-800">{p.doctorItem[field] || '—'}</div>
                </div>
              ))}

              <div className="flex items-start gap-4">
                <div className="w-28 text-sm text-gray-600">Institutions</div>
                <div className="text-sm text-gray-800">
                  {Array.isArray(p.doctorItem.universites) && p.doctorItem.universites.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {p.doctorItem.universites.map((u: any, idx: number) => {
                        const name = typeof u === 'string' ? u : u?.nom || '—'
                        const key = (u && (u.id ?? u.nom)) ?? `${name}-${idx}`
                        return (
                          <span key={key} className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-xs text-gray-800 border border-gray-200">
                            {name}
                          </span>
                        )
                      })}
                    </div>
                  ) : (
                    '—'
                  )}
                </div>
              </div>
            </div>

            {(p.doctorItem.photoUrl || p.doctorItem.photo) ? (
              <div className="flex-shrink-0">
                <img 
                  src={p.doctorItem.photoUrl || p.doctorItem.photo} 
                  alt={`Photo ${p.doctorItem.prenom || ''} ${p.doctorItem.nom || ''}`} 
                  className="w-24 h-24 rounded-md object-cover border" 
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="space-y-5 py-6 px-2">
          {/* Prénom et Nom */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 mb-2">Prénom <span className="text-red-500">*</span></span>
              <input 
                id="prenom" 
                value={p.doctorItem.prenom || ''} 
                onChange={(e) => { 
                  p.setDoctorItem((prev:any) => ({ ...prev, prenom: e.target.value })); 
                  if (doctorErrors.prenom) setDoctorErrors(prev => { const copy = { ...prev }; delete copy.prenom; return copy })
                }} 
                className="border border-gray-200 px-4 py-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition" 
                placeholder="Entrez le prénom"
                required 
              />
              {doctorErrors.prenom && <div className="text-xs text-red-600 mt-1.5">{doctorErrors.prenom}</div>}
            </label>
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 mb-2">Nom <span className="text-red-500">*</span></span>
              <input 
                id="nom" 
                value={p.doctorItem.nom || ''} 
                onChange={(e) => { 
                  p.setDoctorItem((prev:any) => ({ ...prev, nom: e.target.value })); 
                  if (doctorErrors.nom) setDoctorErrors(prev => { const copy = { ...prev }; delete copy.nom; return copy })
                }} 
                className="border border-gray-200 px-4 py-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition" 
                placeholder="Entrez le nom"
                required 
              />
              {doctorErrors.nom && <div className="text-xs text-red-600 mt-1.5">{doctorErrors.nom}</div>}
            </label>
          </div>

          {/* Email et Téléphone */}
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 mb-2">Email <span className="text-red-500">*</span></span>
              <input 
                id="email" 
                type="email" 
                value={p.doctorItem.email || ''} 
                onChange={(e) => { 
                  p.setDoctorItem((prev:any) => ({ ...prev, email: e.target.value })); 
                  if (doctorErrors.email) setDoctorErrors(prev => { const copy = { ...prev }; delete copy.email; return copy })
                }} 
                className="border border-gray-200 px-4 py-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition" 
                placeholder="email@exemple.com"
                required 
              />
              {doctorErrors.email && <div className="text-xs text-red-600 mt-1.5">{doctorErrors.email}</div>}
            </label>
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 mb-2">Téléphone <span className="text-red-500">*</span></span>
              <input 
                id="telephone" 
                value={p.doctorItem.telephone || ''} 
                onChange={(e) => { 
                  p.setDoctorItem((prev:any) => ({ ...prev, telephone: e.target.value })); 
                  if (doctorErrors.telephone) setDoctorErrors(prev => { const copy = { ...prev }; delete copy.telephone; return copy })
                }} 
                className="border border-gray-200 px-4 py-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition" 
                placeholder="12 345 678" 
              />
              {doctorErrors.telephone && <div className="text-xs text-red-600 mt-1.5">{doctorErrors.telephone}</div>}
            </label>
          </div>

          {/* Spécialité */}
          <div className="grid grid-cols-1 gap-4">
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 mb-2">Spécialité <span className="text-red-500">*</span></span>
              <input 
                id="specialite" 
                value={(p.doctorItem as any).specialite || (p.doctorItem as any).specialty || ''} 
                onChange={(e) => { 
                  p.setDoctorItem((prev:any) => ({ ...prev, specialite: e.target.value })); 
                  if (doctorErrors.specialite) setDoctorErrors(prev => { const copy = { ...prev }; delete copy.specialite; return copy })
                }} 
                className="border border-gray-200 px-4 py-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition" 
                placeholder="Ex: Cardiologie" 
              />
              {doctorErrors.specialite && <div className="text-xs text-red-600 mt-1.5">{doctorErrors.specialite}</div>}
            </label>
          </div>

          {/* Photo upload for medecin */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900 mb-3">Photo</span>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <input 
                  id="doctor-photo-input" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => { 
                    const file = e.target.files?.[0]; 
                    if (file) { 
                      const previewUrl = URL.createObjectURL(file);
                      p.setDoctorItem((prev:any) => ({ 
                        ...prev, 
                        photoFile: file,
                        photoPreview: previewUrl
                      })); 
                    } 
                  }} 
                />
                <label htmlFor="doctor-photo-input" className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition p-6 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#F5F5F5' }}>
                      <span className="text-xl">📸</span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">Cliquez pour importer</div>
                    <div className="text-xs text-gray-500 mt-1">ou glissez-déposez l'image</div>
                    <div className="text-xs text-gray-400 mt-2">PNG, JPG (max 5MB, 400×400 recommandé)</div>
                  </div>
                </label>
              </div>

              <div className="flex flex-col items-center justify-center">
                {p.doctorItem.photoPreview || p.doctorItem.photoUrl ? (
                  <div className="w-full">
                    <div className="flex items-center justify-center mb-3">
                      <img 
                        src={p.doctorItem.photoPreview || p.doctorItem.photoUrl} 
                        alt="Aperçu photo" 
                        className="h-32 w-32 object-cover border border-gray-200 rounded-lg" 
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => p.setDoctorItem((prev:any) => ({ 
                        ...prev, 
                        photoFile: undefined, 
                        photoPreview: undefined,
                        photoUrl: undefined 
                      }))}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-sm text-gray-500">Aucune photo importée</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Universities selection */}
          {(p.doctorModalMode === 'add' || p.doctorModalMode === 'edit') && (
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 mb-2">Institutions <span className="text-red-500">*</span></span>
              <select 
                id="doctor-universite" 
                multiple 
                value={p.selectedDoctorUniversiteIds.map(String)} 
                onChange={(e) => {
                    const opts = Array.from((e.target as HTMLSelectElement).selectedOptions).map(o => Number(o.value)).filter(n => !Number.isNaN(n))
                    p.setSelectedDoctorUniversiteIds(opts)
                    if (doctorErrors.universite) setDoctorErrors(prev => { const copy = { ...prev }; delete copy.universite; return copy })
                  }} 
                className="border border-gray-200 px-4 py-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent" 
                required
                size={4}
              >
                {p.universitesData.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.nom} {u.ville ? `(${u.ville})` : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">Maintenez Ctrl (Cmd sur Mac) pour sélectionner plusieurs institutions</p>
              {doctorErrors.universite && <div className="text-xs text-red-600 mt-1.5">{doctorErrors.universite}</div>}
            </label>
          )}
        </div>
      )}

      {p.doctorModalMode !== 'show' && (
        <DialogFooter className="border-t border-gray-100 mt-6 pt-6 flex items-center justify-end gap-3">
          <button 
            onClick={() => p.setDoctorModalOpen(false)} 
            disabled={isDoctorLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <X className="w-4 h-4"/>
            Annuler
          </button>

          {(p.doctorModalMode === 'add' || p.doctorModalMode === 'edit') && (
            <button 
              onClick={handleSaveDoctor} 
              disabled={isDoctorLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {isDoctorLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4"/>}
              {isDoctorLoading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          )}

          {p.doctorModalMode === 'delete-warning' && (
            <button 
              onClick={() => { p.setDoctorModalOpen(false); p.openDeleteModal('doctor', p.doctorItem) }} 
              disabled={isDoctorLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Trash2 className="w-4 h-4"/>
              Supprimer
            </button>
          )}
        </DialogFooter>
      )}
    </DialogContent>
  </Dialog>
)}
      {/* Students Modal */}
      {p.studentModalOpen && (
        <Dialog open onOpenChange={p.closeStudentModal}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-gray-200">
            <DialogHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
                  <UserPlus className="w-6 h-6" style={{ color: '#666' }}/>
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-lg font-semibold text-gray-900">{p.studentModalMode === 'add' ? 'Ajouter un étudiant' : p.studentModalMode === 'edit' ? 'Modifier un étudiant' : 'Détails de l\'étudiant'}</DialogTitle>
                  <DialogDescription className="text-sm text-gray-500 mt-0.5">{p.studentModalMode === 'show' ? 'Consultez les informations de l\'étudiant' : 'Complétez les informations requises'}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {p.studentModalMode === 'show' ? (
              <div className="space-y-3 py-4">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    {['nom', 'prenom', 'email', 'telephone'].map((field) => (
                      <div key={field} className="flex items-start gap-4">
                        <div className="w-28 text-sm text-gray-600 capitalize">{field}</div>
                        <div className="text-sm text-gray-800">{p.studentItem[field] || '—'}</div>
                      </div>
                    ))}

                    <div className="flex items-start gap-4">
                      <div className="w-28 text-sm text-gray-600">Institution</div>
                      <div className="text-sm text-gray-800">{p.studentItem.universite?.nom || '—'}</div>
                    </div>
                  </div>

                  {(p.studentItem.photoUrl || p.studentItem.photo) ? (
                    <div className="flex-shrink-0">
                      <img src={p.studentItem.photoUrl || p.studentItem.photo} alt={`Photo ${p.studentItem.prenom || ''} ${p.studentItem.nom || ''}`} className="w-24 h-24 rounded-md object-cover border" />
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="space-y-5 py-6 px-2">
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 mb-2">Prénom</span>
                    <input id="student-prenom" value={p.studentItem.prenom || ''} onChange={(e) => { p.setStudentItem((prev:any) => ({ ...prev, prenom: e.target.value })); if (studentErrors.prenom) setStudentErrors(prev => { const copy = { ...prev }; delete copy.prenom; return copy }) }} className="border border-gray-200 px-4 py-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition" placeholder="Entrez le prénom" required/>
                    {studentErrors.prenom && <div className="text-xs text-red-600 mt-1.5">{studentErrors.prenom}</div>}
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 mb-2">Nom</span>
                    <input id="student-nom" value={p.studentItem.nom || ''} onChange={(e) => { p.setStudentItem((prev:any) => ({ ...prev, nom: e.target.value })); if (studentErrors.nom) setStudentErrors(prev => { const copy = { ...prev }; delete copy.nom; return copy }) }} className="border border-gray-200 px-4 py-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition" placeholder="Entrez le nom" required/>
                    {studentErrors.nom && <div className="text-xs text-red-600 mt-1.5">{studentErrors.nom}</div>}
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 mb-2">Email</span>
                    <input id="student-email" type="email" value={p.studentItem.email || ''} onChange={(e) => { p.setStudentItem((prev:any) => ({ ...prev, email: e.target.value })); if (studentErrors.email) setStudentErrors(prev => { const copy = { ...prev }; delete copy.email; return copy }) }} className="border border-gray-200 px-4 py-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition disabled:bg-gray-50 disabled:text-gray-500" placeholder="email@exemple.com" disabled={p.studentModalMode === 'edit'} required/>
                    {studentErrors.email && <div className="text-xs text-red-600 mt-1.5">{studentErrors.email}</div>}
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 mb-2">Téléphone</span>
                    <input id="student-telephone" value={p.studentItem.telephone || ''} onChange={(e) => { p.setStudentItem((prev:any) => ({ ...prev, telephone: e.target.value })); if (studentErrors.telephone) setStudentErrors(prev => { const copy = { ...prev }; delete copy.telephone; return copy }) }} className="border border-gray-200 px-4 py-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition" placeholder="12 345 678"/>
                    {studentErrors.telephone && <div className="text-xs text-red-600 mt-1.5">{studentErrors.telephone}</div>}
                  </label>
                </div>
                {p.studentModalMode === 'add' && (
                  <label className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 mb-2">Institution <span className="text-red-500">*</span></span>
                    <select id="student-universite" value={p.selectedStudentUniversiteId} onChange={(e) => { p.setSelectedStudentUniversiteId(Number(e.target.value) || ''); if (studentErrors.universite) setStudentErrors(prev => { const copy = { ...prev }; delete copy.universite; return copy }) }} className="border border-gray-200 px-4 py-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition" required>
                      <option value="">Sélectionner une institution</option>
                      {p.universitesData.map(u => (<option key={u.id} value={u.id}>{u.nom} {u.ville ? `(${u.ville})` : ''}</option>))}
                    </select>
                    {studentErrors.universite && <div className="text-xs text-red-600 mt-1.5">{studentErrors.universite}</div>}
                  </label>
                )}
              </div>
            )}

            {p.studentModalMode !== 'show' && (
              <DialogFooter className="border-t border-gray-100 mt-6 pt-6 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={p.closeStudentModal} 
                  disabled={isStudentLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <X className="w-4 h-4"/>
                  Annuler
                </button>
                <button 
                  type="button" 
                  onClick={handleSaveStudent} 
                  disabled={isStudentLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isStudentLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4"/>}
                  {isStudentLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}

  {/* Institutions Modal */}
      {p.universiteModalOpen && (
        <Dialog open onOpenChange={() => p.setUniversiteModalOpen(false)}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-gray-200">
            <DialogHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
                  <Edit className="w-6 h-6" style={{ color: '#666' }}/>
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-lg font-semibold text-gray-900">{p.universiteModalMode === 'add' ? "Ajouter une institution" : p.universiteModalMode === 'edit' ? "Modifier l'institution" : "Détails de l'institution"}</DialogTitle>
                  <DialogDescription className="text-sm text-gray-500 mt-0.5">{p.universiteModalMode !== 'show' ? 'Complétez les informations requises' : 'Consultez les informations de l\'institution'}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

              {p.universiteModalMode === 'show' ? (
              <div className="space-y-3 py-4">
                {['nom','ville','adresse','telephone','nbEtudiants'].map((field) => (
                  <div key={field} className="flex items-start gap-4">
                    <div className="w-36 text-sm text-gray-600 capitalize">{field}</div>
                    <div className="text-sm text-gray-800">{p.universiteItem[field] ?? '—'}</div>
                  </div>
                ))}
                {(p.universiteItem.logoPath || p.universiteItem.logo || p.universiteItem.logoUrl || p.universiteItem.logo_url) && (
                  <div className="flex items-start gap-4">
                    <div className="w-36 text-sm text-gray-600">Logo</div>
                    <div className="text-sm">
                      <img
                        src={String(p.universiteItem.logoPath || p.universiteItem.logo || p.universiteItem.logoUrl || p.universiteItem.logo_url)}
                        alt={`Logo ${p.universiteItem.nom || ''}`}
                        className="max-h-24 w-auto object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5 py-6 px-2">
                <div className="grid grid-cols-2 gap-4">
                  {['nom','ville','adresse','telephone'].map((field) => (
                    <label key={field} className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 mb-2 capitalize">{field === 'nom' ? 'Nom de l\'institution' : field === 'ville' ? 'Ville' : field === 'adresse' ? 'Adresse' : 'Téléphone'}</span>
                      <input id={field} type={field === 'nbEtudiants' ? 'number' : 'text'} value={p.universiteItem[field] ?? ''} onChange={(e) => { p.setUniversiteItem((prev:any) => ({ ...prev, [field]: e.target.value })); if (universiteErrors[field]) setUniversiteErrors(prev => { const copy = { ...prev }; delete copy[field]; return copy }) }} className="border border-gray-200 px-4 py-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition" placeholder={field === 'telephone' ? '12 345 678' : ''} />
                      {universiteErrors[field] && <div className="text-xs text-red-600 mt-1.5">{universiteErrors[field]}</div>}
                    </label>
                  ))}
                </div>

                <label className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 mb-2">Nombre d'étudiants</span>
                  <input id="nbEtudiants" type="number" value={p.universiteItem.nbEtudiants ?? ''} onChange={(e) => p.setUniversiteItem((prev:any) => ({ ...prev, nbEtudiants: Number(e.target.value) || undefined }))} className="border border-gray-200 px-4 py-2.5 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition" placeholder="Nombre d'étudiants"/>
                </label>

                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 mb-3">Logo</span>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <input id="uni-logo-input" type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) { p.setUniversiteItem((prev:any) => ({ ...prev, logoFile: file, logoPath: URL.createObjectURL(file) })) } }} />
                      <label htmlFor="uni-logo-input" className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition p-6 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: '#F5F5F5' }}>
                            <span className="text-xl">🏫</span>
                          </div>
                          <div className="text-sm font-medium text-gray-900">Cliquez pour importer</div>
                          <div className="text-xs text-gray-500 mt-1">ou glissez-déposez le logo</div>
                          <div className="text-xs text-gray-400 mt-2">PNG, JPG (max 5MB, 300×300 recommandé)</div>
                        </div>
                      </label>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      {p.universiteItem.logoPath ? (
                        <div className="w-full">
                          <div className="flex items-center justify-center mb-3">
                            <img src={p.universiteItem.logoPath} alt="Aperçu logo" className="h-32 w-32 object-contain border border-gray-200 rounded-lg" />
                          </div>
                          <button
                            type="button"
                            onClick={() => p.setUniversiteItem((prev:any) => ({ ...prev, logoFile: undefined, logoPath: '' }))}
                            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-sm text-gray-500">Aucun logo importé</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 'horaire' removed for institutions per request */}

                {/* Duplicate logo block removed — keep only the primary "Logo de l'institution" upload/preview above */}
              </div>
            )}

            {p.universiteModalMode !== 'show' && (
              <DialogFooter className="border-t border-gray-100 mt-6 pt-6 flex items-center justify-end gap-3">
                <button 
                  onClick={() => p.setUniversiteModalOpen(false)} 
                  disabled={isUniversiteLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <X className="w-4 h-4"/>
                  Annuler
                </button>
                <button 
                  onClick={handleSaveUniversite} 
                  disabled={isUniversiteLoading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {isUniversiteLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4"/>}
                  {isUniversiteLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Demande detail Modal (read-only) */}
      {p.demandeModalOpen && (
        <Dialog open onOpenChange={(open) => p.setDemandeModalOpen?.(open)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-700"><Eye className="w-5 h-5"/></div>
                <div>
                  <DialogTitle className="text-base font-semibold">Détails de la demande</DialogTitle>
                  <DialogDescription className="text-sm text-gray-500">Informations soumises par l'utilisateur</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-3 py-4">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  {/* Render fields with friendly labels and formatting */}
                  {(
                    [
                      { key: 'typeSituation', label: 'Type' },
                        { key: 'lieuPrincipal', label: 'Lieu' },
                        { key: 'periode', label: 'Période' },
                        { key: 'dateCreation', label: 'Date' },
                        { key: 'medecin', label: 'Praticien' },
                        { key: 'etudiant', label: 'Étudiant' },
                        { key: 'universite', label: 'Institution' },
                    ]
                  ).map(({ key, label }) => {
                    let raw = p.demandeItem?.[key]
                    // If medecin/etudiant/universite are objects, try to display a reasonable string
                    if (raw && typeof raw === 'object') {
                      if (raw.nom || raw.name) raw = `${raw.prenom ? raw.prenom + ' ' : ''}${raw.nom ?? raw.name}`.trim()
                      else raw = JSON.stringify(raw)
                    }

                    // Format dates
                    if (key === 'dateCreation' && raw) {
                      try {
                        const d = new Date(String(raw))
                        if (!isNaN(d.getTime())) raw = d.toLocaleString()
                      } catch { /* ignore */ }
                    }

                    return (
                      <div key={key} className="flex items-start gap-4">
                        <div className="w-28 text-sm text-gray-600">{label}</div>
                        <div className="text-sm text-gray-800">{String(raw ?? '—')}</div>
                      </div>
                    )
                  })}

                  {/* Description: sanitize common boilerplate prefixes and preserve line breaks */}
                  {/* Description intentionally hidden in the detail modal to avoid exposing user-submitted PII. */}
                </div>
              </div>
            </div>

            <DialogFooter className="flex items-center justify-end gap-3">
              <button onClick={() => p.setDemandeModalOpen?.(false)} className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"><X className="w-4 h-4"/>Fermer</button>
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
                  <DialogDescription className="text-sm text-gray-500">{p.adminModalMode !== 'show' ? 'Remplissez les informations et assignez une institution' : 'Informations de l’administrateur'}</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {p.adminModalMode === 'show' ? (
              <div className="space-y-3 py-4">
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    {['nom', 'prenom', 'email', 'telephone'].map((field) => (
                      <div key={field} className="flex items-start gap-4">
                        <div className="w-28 text-sm text-gray-600 capitalize">{field}</div>
                        <div className="text-sm text-gray-800">{p.adminItem[field] || '—'}</div>
                      </div>
                    ))}

                      <div className="flex items-start gap-4">
                        <div className="w-28 text-sm text-gray-600">Institution</div>
                        <div className="text-sm text-gray-800">{p.adminItem.universite?.nom || '—'}</div>
                      </div>
                  </div>

                  {(p.adminItem.photoUrl || p.adminItem.photo) ? (
                    <div className="flex-shrink-0">
                      <img src={p.adminItem.photoUrl || p.adminItem.photo} alt={`Photo ${p.adminItem.prenom || ''} ${p.adminItem.nom || ''}`} className="w-24 h-24 rounded-md object-cover border" />
                    </div>
                  ) : null}
                </div>
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
                {p.adminModalMode === 'add' && (<label className="flex flex-col text-sm"><span className="text-gray-600 mb-1">Institution</span><select id="universite" value={p.selectedAdminUniversiteId ?? ''} onChange={(e) => p.setSelectedAdminUniversiteId && p.setSelectedAdminUniversiteId(Number(e.target.value))} className="border border-gray-300 px-3 py-2 rounded-md" required><option value="">Sélectionner une institution</option>{p.universitesData.map((u) => (<option key={u.id} value={u.id}>{u.nom} ({u.ville})</option>))}</select></label>)}
              </div>
            )}

            {p.adminModalMode !== 'show' && (
              <DialogFooter className="flex items-center justify-end gap-3">
                <button type="button" onClick={p.closeAdminModal} className="inline-flex items-center gap-2 px-4 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"><X className="w-4 h-4"/>Annuler</button>
                <button type="button" onClick={handleSaveAdmin} className="inline-flex items-center gap-2 px-4 py-2 bg-[#020E68] text-white rounded-md text-sm hover:bg-[#020E68]/90"><Save className="w-4 h-4"/>Enregistrer</button>
              </DialogFooter>
            )}
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
                <div className="flex items-start gap-4">
                  <div className="w-28 text-sm text-gray-600">Statut</div>
                  <div className="text-sm">
                    <div className={`inline-flex items-center gap-2 px-2 py-0.5 text-sm font-normal rounded-sm border ${
                        p.appointmentItem.status === 'CONFIRMED' ? 'bg-green-50 text-green-700 border-green-100' :
                        p.appointmentItem.status === 'CANCELED' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                      <span className="text-sm text-gray-800">{p.appointmentItem.status === 'CONFIRMED' ? 'Confirmé' : p.appointmentItem.status === 'CANCELED' ? 'Annulé' : 'En attente'}</span>
                    </div>
                  </div>
                </div>
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

            {p.appointmentModalMode !== 'show' && (
              <DialogFooter className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => p.setAppointmentModalOpen(false)} className="inline-flex items-center gap-2 px-4 py-2 border rounded text-sm text-gray-700 hover:bg-gray-50"><X className="w-4 h-4"/>Annuler</button>
                <button type="button" onClick={handleSaveAppointment} className="inline-flex items-center gap-2 px-4 py-2 bg-[#020E68] text-white rounded text-sm hover:bg-[#020E68]/90"><Save className="w-4 h-4"/>Enregistrer</button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
