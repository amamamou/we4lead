import { LayoutDashboard, Clock, University, Calendar } from '@/components/ui/icons'

// Doctor sidebar: only Overview, Calendar, Institution (as requested)
export const doctorMenu = [
  { key: 'overview', label: 'Aperçu', icon: LayoutDashboard },
  { key: 'calendar', label: 'Calendrier', icon: Calendar },
  // Availability: placed under Calendar in the sidebar
  { key: 'availability', label: 'Disponibilité', icon: Clock },
  { key: 'institutions', label: 'Instituts', icon: University }
]

export type DoctorMenuItem = typeof doctorMenu[number]

export default doctorMenu
