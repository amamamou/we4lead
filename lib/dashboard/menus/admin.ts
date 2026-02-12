import { LayoutDashboard, Stethoscope, Building2, Clock } from '@/components/ui/icons'

export const adminMenu = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'doctors', label: 'Doctors', icon: Stethoscope },
  { key: 'students', label: 'Students', icon: Building2 },
  { key: 'appointments', label: 'Sessions', icon: Clock }
]

export type AdminMenuItem = typeof adminMenu[number]

export default adminMenu
