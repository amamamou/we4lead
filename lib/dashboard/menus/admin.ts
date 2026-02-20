/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { LayoutDashboard, Stethoscope, Clock, Users, University } from '@/components/ui/icons'

const UniversitySmall: React.ComponentType<Record<string, unknown>> = (props) => {
  const size = (props as any)?.size ?? 28

  // Make the admin institutes icon noticeably bolder than the default university icon
  // so it visually matches the admin sidebar emphasis.
  const strokeWidth = size >= 20 ? 3 : 2.5
  const strokeOpacity = 1

  return React.createElement(
    University as React.ComponentType<Record<string, unknown>>,
    { ...(props as Record<string, unknown>), width: size, height: size, strokeWidth, strokeOpacity },
  )
}

export const adminMenu = [
  { key: 'overview', label: 'Aperçu', icon: LayoutDashboard },
  { key: 'doctors', label: 'Médecins', icon: Stethoscope },
  { key: 'students', label: 'Étudiants', icon: Users },
  { key: 'institutes', label: 'Instituts', icon: UniversitySmall },
  { key: 'appointments', label: 'Rendez-vous', icon: Clock }
]

export type AdminMenuItem = typeof adminMenu[number]

export default adminMenu
