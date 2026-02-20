/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { LayoutDashboard, Stethoscope, University, Users } from '@/components/ui/icons'

export const superAdminMenu = [
  { key: 'overview', label: 'Aperçu', icon: LayoutDashboard },
  { key: 'institutes', label: 'Instituts', icon: University },
  { key: 'doctors', label: 'Médecins', icon: Stethoscope },
  { key: 'students', label: 'Étudiants', icon: Users },
  // 'appointments' (Rendez-vous) intentionally omitted for super-admin sidebar
  // to avoid showing per-university session management here.
  // If needed later, re-add: { key: 'appointments', label: 'Rendez-vous', icon: Clock }
]

export type SuperAdminMenuItem = typeof superAdminMenu[number]

export default superAdminMenu
