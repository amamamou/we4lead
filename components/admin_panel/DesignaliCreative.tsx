/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Home, Grid, FileText, Users, Stethoscope } from "lucide-react"
import AdminModals from "@/components/admin/admin-modals"
import OverviewTab from "./tabs/OverviewTab"
import ProfesisonelsTab from "./tabs/ProfesisonelsTab"
import UtilisateursTab from "./tabs/UtilisateursTab"
import InstitutesTab from "./tabs/InstitutesTab"
import DemandesTab from "./tabs/DemandesTab"
import Sidebar from "./Sidebar"
import MobileSidebar from "./MobileSidebar"
import Navbar from "./Navbar"

// removed non-admin demo tabs: HomeTab, LearnTab, AppsTab, FilesTab, ProjectsTab
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

export default function DesignaliCreative() {
  const [activeTab, setActiveTab] = useState("overview")
  // Admin tab state is handled inside each tab component
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  // Admin-like modal state (doctors & universites) so tabs can open real modals
  const [doctorModalOpen, setDoctorModalOpen] = useState(false)
  const [doctorModalMode, setDoctorModalMode] = useState<'add' | 'edit' | 'show' | 'delete-warning'>('show')
  const [doctorItem, setDoctorItem] = useState<any>({})
  const [selectedDoctorUniversiteIds, setSelectedDoctorUniversiteIds] = useState<number[]>([])

  const [universiteModalOpen, setUniversiteModalOpen] = useState(false)
  const [universiteModalMode, setUniversiteModalMode] = useState<'add' | 'edit' | 'show'>('show')
  const [universiteItem, setUniversiteItem] = useState<any>({})

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState('')
  const [deleteType, setDeleteType] = useState<'doctor' | 'universite' | null>(null)
  const [deleteItem, setDeleteItem] = useState<any>(null)

  // Data for tabs (provide as external data so tabs use these instead of local fetch)
  const [doctorsData, setDoctorsData] = useState<any[]>([])
  const [institutesData, setInstitutesData] = useState<any[]>([])

  // simple loading flags
  const [loadingDoctors, setLoadingDoctors] = useState(false)
  const [loadingInstitutes, setLoadingInstitutes] = useState(false)

  const sidebarItems = [
    { title: "Overview", icon: <Home />, value: "overview" },
    { title: "Instituts", icon: <Grid />, value: "institutes" },
    { title: "Demandes", icon: <FileText />, value: "demandes" },
    { title: "Intervenants", icon: <Stethoscope />, value: "doctors" },
    { title: "Utilisateurs", icon: <Users />, value: "students" },
  ]

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  // Fetchers
  const loadDoctors = async () => {
    setLoadingDoctors(true)
    try {
      const token = localStorage.getItem('supabaseAccessToken')
      if (!token) return
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) { setDoctorsData([]); return }
      const data = await res.json()
      setDoctorsData(Array.isArray(data) ? data : [])
    } catch (err) { console.error('loadDoctors', err); setDoctorsData([]) }
    finally { setLoadingDoctors(false) }
  }

  const loadInstitutes = async () => {
    setLoadingInstitutes(true)
    try {
      const token = localStorage.getItem('supabaseAccessToken')
      if (!token) return
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/universites`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) { setInstitutesData([]); return }
      const data = await res.json()
      setInstitutesData(Array.isArray(data) ? data : [])
    } catch (err) { console.error('loadInstitutes', err); setInstitutesData([]) }
    finally { setLoadingInstitutes(false) }
  }

  // Hook to load on mount
  useEffect(() => { loadDoctors(); loadInstitutes() }, [])

  // Delete flow
  const openDeleteModal = (type: 'doctor' | 'universite', item: any) => {
    setDeleteType(type)
    setDeleteItem(item)
    let msg = ''
    if (type === 'doctor') msg = `Voulez-vous vraiment supprimer le praticien ${item.prenom || ''} ${item.nom || ''} ?`
    if (type === 'universite') msg = `Voulez-vous vraiment supprimer l'institution ${item.nom || ''} ?`
    setDeleteMessage(msg)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleteType || !deleteItem) return
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) { alert('Token manquant'); setDeleteModalOpen(false); return }
    try {
      let url = ''
      if (deleteType === 'doctor') url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins/${deleteItem.id}?forceCascade=true`
      if (deleteType === 'universite') url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/universites/${deleteItem.id}`
      const res = await fetch(url, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) { const t = await res.text().catch(() => ''); throw new Error(t || 'Erreur suppression') }
      // update local lists
      if (deleteType === 'doctor') setDoctorsData(prev => prev.filter(d => String(d.id) !== String(deleteItem.id)))
      if (deleteType === 'universite') setInstitutesData(prev => prev.filter(i => String(i.id) !== String(deleteItem.id)))
      setDeleteModalOpen(false)
    } catch (err: any) { console.error(err); alert(err.message || 'Erreur lors de la suppression') }
  }

  // Doctor CRUD
  const openDoctorModal = (mode: typeof doctorModalMode, item?: any) => {
    setDoctorModalMode(mode)
    setDoctorItem(mode === 'add' ? { nom: '', prenom: '', email: '', telephone: '' } : (item ?? {}))
    if (mode === 'edit' && item?.universites) setSelectedDoctorUniversiteIds(item.universites.map((u:any)=>u.id))
    else setSelectedDoctorUniversiteIds([])
    setDoctorModalOpen(true)
  }

  const closeDoctorModal = () => {
    setDoctorModalOpen(false)
    setSelectedDoctorUniversiteIds([])
    setTimeout(()=>setDoctorItem({}), 300)
  }

  const saveDoctor = async () => {
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) return alert('Token manquant')
    const url = doctorModalMode === 'add' ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins` : `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins/${doctorItem.id}`
    try {
      const formData = new FormData()
      if (doctorItem.nom) formData.append('nom', doctorItem.nom)
      if (doctorItem.prenom) formData.append('prenom', doctorItem.prenom)
      if (doctorItem.email) formData.append('email', doctorItem.email)
      if (doctorItem.telephone) formData.append('telephone', doctorItem.telephone)
      if ((doctorItem as any).specialite) formData.append('specialite', (doctorItem as any).specialite)
      const universiteIds = selectedDoctorUniversiteIds && selectedDoctorUniversiteIds.length > 0 ? selectedDoctorUniversiteIds : (doctorItem.universites ? doctorItem.universites.map((u:any)=>u.id) : [])
      if (!universiteIds || universiteIds.length === 0) return alert('Veuillez sélectionner au moins une université')
      formData.append('universiteIds', JSON.stringify(universiteIds))
      if (doctorItem.photoFile) formData.append('photo', doctorItem.photoFile)
      const res = await fetch(url, { method: doctorModalMode === 'add' ? 'POST' : 'PUT', headers: { Authorization: `Bearer ${token}` }, body: formData })
      if (!res.ok) { const t = await res.text().catch(()=>''); throw new Error(t || 'Erreur sauvegarde') }
      await loadDoctors()
      closeDoctorModal()
    } catch (err:any) { console.error(err); alert(err.message || 'Erreur lors de la sauvegarde') }
  }

  // Universite CRUD
  const openUniversiteModal = (mode: typeof universiteModalMode, item?: any) => {
    setUniversiteModalMode(mode)
    setUniversiteItem(mode === 'add' ? { nom: '', ville: '', adresse: '', telephone: '' } : (item ?? {}))
    setUniversiteModalOpen(true)
  }

  const saveUniversite = async () => {
    const token = localStorage.getItem('supabaseAccessToken')
    if (!token) return alert('Token manquant')
    try {
      const form = new FormData()
      if (universiteItem.nom) form.append('nom', universiteItem.nom)
      if (universiteItem.ville) form.append('ville', universiteItem.ville)
      if (universiteItem.adresse) form.append('adresse', universiteItem.adresse)
      if (universiteItem.telephone) form.append('telephone', universiteItem.telephone)
      if (universiteItem.logoFile) form.append('logo', universiteItem.logoFile)
      const url = universiteModalMode === 'add' ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/universites` : `${process.env.NEXT_PUBLIC_BACKEND_URL}/superadmin/universites/${universiteItem.id}`
      const res = await fetch(url, { method: universiteModalMode === 'add' ? 'POST' : 'PUT', headers: { Authorization: `Bearer ${token}` }, body: form })
      if (!res.ok) { const t = await res.text().catch(()=>''); throw new Error(t || 'Erreur sauvegarde universite') }
      await loadInstitutes()
      setUniversiteModalOpen(false)
    } catch (err:any) { console.error(err); alert(err.message || 'Erreur lors de la sauvegarde') }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background animation */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(120, 41, 190, 0.5) 0%, rgba(53, 71, 125, 0.5) 50%, transparent 100%)",
            "radial-gradient(circle at 30% 70%, rgba(233, 30, 99, 0.5) 0%, rgba(81, 45, 168, 0.5) 50%, transparent 100%)",
          ],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <MobileSidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        expandedItems={expandedItems}
        toggleExpanded={toggleExpanded}
      />

      <Sidebar
        sidebarItems={sidebarItems}
        sidebarOpen={sidebarOpen}
        expandedItems={expandedItems}
        toggleExpanded={toggleExpanded}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />

      <div className={sidebarOpen ? "md:pl-64 transition-all" : "transition-all"}>
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        <main className="flex-1 p-4 md:p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <TabsList className="grid w-full max-w-[800px] grid-cols-5 rounded-lg p-1 bg-[#F5F5F5]">
                  <TabsTrigger value="overview" className="rounded-md data-[state=active]:rounded-md">Overview</TabsTrigger>
                  <TabsTrigger value="institutes" className="rounded-md data-[state=active]:rounded-md">Instituts</TabsTrigger>
                  <TabsTrigger value="demandes" className="rounded-md data-[state=active]:rounded-md">Demandes</TabsTrigger>
                  <TabsTrigger value="doctors" className="rounded-md data-[state=active]:rounded-md">Intervenants</TabsTrigger>
                  <TabsTrigger value="students" className="rounded-md data-[state=active]:rounded-md">Utilisateurs</TabsTrigger>
                </TabsList>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="overview" className="mt-0">
                    <OverviewTab onNavigate={(tab: string) => setActiveTab(tab)} />
                  </TabsContent>

                  

                  <TabsContent value="institutes" className="mt-0">
                    <InstitutesTab
                      data={institutesData}
                      loading={loadingInstitutes}
                      onRefresh={loadInstitutes}
                      onShow={(item) => openUniversiteModal('show', item)}
                      onEdit={(item) => openUniversiteModal('edit', item)}
                      onDelete={(item) => openDeleteModal('universite', item)}
                      onAdd={() => openUniversiteModal('add')}
                    />
                  </TabsContent>

                  <TabsContent value="demandes" className="mt-0">
                    <DemandesTab />
                  </TabsContent>

                  <TabsContent value="doctors" className="mt-0">
                    <ProfesisonelsTab
                      data={doctorsData}
                      loading={loadingDoctors}
                      onRefresh={loadDoctors}
                      onShow={(item) => openDoctorModal('show', item)}
                      onEdit={(item) => openDoctorModal('edit', item)}
                      onDelete={(item) => openDeleteModal('doctor', item)}
                      onAdd={() => openDoctorModal('add')}
                    />
                  </TabsContent>

                  <TabsContent value="students" className="mt-0">
                    <UtilisateursTab />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </Tabs>
        </main>
        {/* Admin modals wired to this panel so action buttons open real modals */}
        <AdminModals
          // Doctors
          doctorModalOpen={doctorModalOpen}
          setDoctorModalOpen={setDoctorModalOpen}
          doctorModalMode={doctorModalMode}
          doctorItem={doctorItem}
          setDoctorItem={setDoctorItem}
          selectedDoctorUniversiteIds={selectedDoctorUniversiteIds}
          setSelectedDoctorUniversiteIds={setSelectedDoctorUniversiteIds}
          universitesData={institutesData}
          saveDoctor={saveDoctor}
          openDeleteModal={openDeleteModal}

          // Students (no-op placeholders)
          studentModalOpen={false}
          closeStudentModal={() => {}}
          studentModalMode={'show'}
          studentItem={{}}
          setStudentItem={() => {}}
          selectedStudentUniversiteId={''}
          setSelectedStudentUniversiteId={() => {}}
          saveStudent={async () => {}}

          // Universites
          universiteModalOpen={universiteModalOpen}
          setUniversiteModalOpen={setUniversiteModalOpen}
          universiteModalMode={universiteModalMode}
          universiteItem={universiteItem}
          setUniversiteItem={setUniversiteItem}
          saveUniversite={saveUniversite}

          // Admins (placeholders)
          adminModalOpen={false}
          closeAdminModal={() => {}}
          adminModalMode={'show'}
          adminItem={{}}
          setAdminItem={() => {}}
          selectedAdminUniversiteId={''}
          setSelectedAdminUniversiteId={() => {}}
          saveAdmin={async () => {}}

          // Delete
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          deleteMessage={deleteMessage}
          confirmDelete={confirmDelete}

          // Appointments (placeholders)
          appointmentModalOpen={false}
          setAppointmentModalOpen={() => {}}
          appointmentModalMode={'add'}
          appointmentItem={{}}
          setAppointmentItem={() => {}}
          doctorsData={doctorsData}
          etudiantsData={[]}
          saveAppointment={async () => {}}

          // Demandes (optional)
          demandeModalOpen={false}
          setDemandeModalOpen={() => {}}
          demandeItem={null}
          setDemandeItem={() => {}}
        />
      </div>
    </div>
  )
}