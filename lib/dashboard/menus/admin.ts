import { LayoutDashboard, Stethoscope, Clock, Users, University } from '@/components/ui/icons'

export const adminMenu = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'doctors', label: 'Doctors', icon: Stethoscope },
  { key: 'students', label: 'Students', icon: Users },
  { key: 'institutes', label: 'Institutes', icon: University },
  { key: 'appointments', label: 'Sessions', icon: Clock }
]

export type AdminMenuItem = typeof adminMenu[number]

export default adminMenu
