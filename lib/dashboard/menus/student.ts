import {
  LayoutDashboard,
  Stethoscope,
  Calendar,
  GraduationCap
} from '@/components/ui/icons'

export const studentMenu = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'calendar', label: 'Calendar', icon: Calendar },
  { key: 'doctors', label: 'Doctors', icon: Stethoscope },
  { key: 'institutions', label: 'Institution', icon: GraduationCap }
]

export type StudentMenuItem = typeof studentMenu[number]

export default studentMenu
