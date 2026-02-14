/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { LayoutDashboard, FileCheck, Stethoscope, University, Clock, Users } from '@/components/ui/icons'

const UniversitySmall: React.ComponentType<Record<string, unknown>> = (props) => {
  const size = (props as any)?.size ?? 28
  return React.createElement(University as React.ComponentType<Record<string, unknown>>, { ...(props as Record<string, unknown>), width: size, height: size, strokeWidth: 1.2 })
}

export const superAdminMenu = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'institutes', label: 'Institutes', icon: UniversitySmall },
  { key: 'admins', label: 'Admins', icon: FileCheck },
  { key: 'doctors', label: 'Doctors', icon: Stethoscope },
  { key: 'students', label: 'Students', icon: Users },
  { key: 'appointments', label: 'Sessions', icon: Clock }
]

export type SuperAdminMenuItem = typeof superAdminMenu[number]

export default superAdminMenu
