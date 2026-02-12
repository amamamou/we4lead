import { LayoutDashboard, Clock, GraduationCap, Calendar } from '@/components/ui/icons'

// Doctor sidebar: only Overview, Calendar, Institution (as requested)
export const doctorMenu = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'calendar', label: 'Calendar', icon: Calendar },
  // Availability: placed under Calendar in the sidebar
  { key: 'availability', label: 'Availability', icon: Clock },
  { key: 'institutions', label: 'Institution', icon: GraduationCap }
]

export type DoctorMenuItem = typeof doctorMenu[number]

export default doctorMenu
