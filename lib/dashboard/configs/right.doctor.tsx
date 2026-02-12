import React from 'react'
import Calendar from '@/components/dashboard/layout/Calendar'
import { Bell, Stethoscope, ArrowRight } from '@/components/ui/icons'

export const doctorRightAside = {
  widgets: [
    {
      id: 'calendar',
      title: 'Calendar',
      content: <Calendar />,
      headerAction: { id: 'thisMonth', label: 'This month' },
    },
    {
      id: 'upcoming',
      title: 'Upcoming',
      bare: true,
      content: (
        <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="p-2 bg-gray-50 dark:bg-gray-800 rounded flex items-center gap-2">
            <Bell size={16} />
            <div>
              <div className="font-medium text-sm">Consultation - Group A</div>
              <div className="text-xs text-gray-500">Today, 11:00 — 11:30</div>
            </div>
          </li>
        </ul>
      ),
    },
  ],
  actions: [
    {
      id: 'start-consult',
      label: 'Start consultation',
      icon: <Stethoscope className="w-4 h-4" />,
      primary: true,
      onClick: () => console.log('start consult'),
    },
    {
      id: 'export',
      label: 'Export',
      icon: <ArrowRight className="w-4 h-4" />,
      onClick: () => console.log('export'),
    },
  ],
}

export default doctorRightAside
