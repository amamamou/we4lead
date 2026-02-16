/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { LayoutDashboard, FileCheck, Stethoscope, University, Clock, Users } from '@/components/ui/icons'

const UniversitySmall: React.ComponentType<Record<string, unknown>> = (props) => {
  const size = (props as any)?.size ?? 28
  // Reduce stroke width for larger (desktop) sizes so the icon doesn't look too bold.
  // Keep a slightly heavier stroke for very small sizes so it remains legible on mobile.
  // Slightly increase stroke width for desktop so icon isn't too thin,
  // but keep a heavier stroke for very small sizes for legibility on mobile.
  const strokeWidth = size >= 20 ? 1.1 : 1.2
  // Keep stroke opacity near-opaque on desktop.
  const strokeOpacity = size >= 20 ? 0.98 : 1

  return React.createElement(
    University as React.ComponentType<Record<string, unknown>>,
    { ...(props as Record<string, unknown>), width: size, height: size, strokeWidth, strokeOpacity },
  )
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
