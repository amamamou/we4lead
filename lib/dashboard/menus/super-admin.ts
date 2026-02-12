import { LayoutDashboard, GraduationCap, FileCheck, Stethoscope, Building2, Clock } from '@/components/ui/icons'

export const superAdminMenu = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'institutes', label: 'Institutes', icon: GraduationCap },
  { key: 'admins', label: 'Admins', icon: FileCheck },
  { key: 'doctors', label: 'Doctors', icon: Stethoscope },
  { key: 'students', label: 'Students', icon: Building2 },
  { key: 'appointments', label: 'Sessions', icon: Clock }
]

export type SuperAdminMenuItem = typeof superAdminMenu[number]

export default superAdminMenu
