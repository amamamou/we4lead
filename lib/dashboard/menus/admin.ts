import { LayoutDashboard, Stethoscope, Clock, Users } from '@/components/ui/icons'

export const adminMenu = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'doctors', label: 'Doctors', icon: Stethoscope },
  { key: 'students', label: 'Students', icon: Users },
  { key: 'appointments', label: 'Sessions', icon: Clock }
]

export type AdminMenuItem = typeof adminMenu[number]

export default adminMenu
