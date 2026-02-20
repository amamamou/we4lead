import {
  LayoutDashboard,
  Stethoscope,
  Calendar,
  University
} from '@/components/ui/icons'

export const studentMenu = [
  { key: 'overview', label: 'Aperçu', icon: LayoutDashboard },
  { key: 'calendar', label: 'Calendrier', icon: Calendar },
  { key: 'doctors', label: 'Médecins', icon: Stethoscope },
  { key: 'institutions', label: 'Instituts', icon: University }
]

export type StudentMenuItem = typeof studentMenu[number]

export default studentMenu
