import React from 'react'
import Calendar from '@/components/dashboard/layout/Calendar'
import { Bell, Stethoscope, ArrowRight } from '@/components/ui/icons'

export const studentRightAside = {
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
              <div className="font-medium text-sm">Meeting with Dr. Ben</div>
              <div className="text-xs text-gray-500">Tomorrow, 10:00 — 10:30</div>
            </div>
          </li>
        </ul>
      ),
    },
  ],
  actions: [
    {
      id: 'new-appointment',
      label: 'New session',
      icon: <Stethoscope className="w-4 h-4" />,
      primary: true,
      onClick: () => {
        // placeholder: UI handlers should be passed from the page when needed
        console.log('New session action clicked')
      },
    },
    {
      id: 'export',
      label: 'Export',
      icon: <ArrowRight className="w-4 h-4" />,
      onClick: () => console.log('export'),
    },
  ],
}

export default studentRightAside
