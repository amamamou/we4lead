import React from 'react'
import Link from 'next/link'

type Doctor = {
  id: string
  name: string
  specialty: string
  nextAvailable: string
  faculty: string
}

const SAMPLE: Doctor[] = [
  { id: 'd1', name: 'Pr. Selma Ben Youssef', specialty: 'Cardiology', nextAvailable: 'Mon, 12 Apr • 10:00', faculty: 'Faculté A' },
  { id: 'd2', name: 'Dr. Houssem K.', specialty: 'Neurology', nextAvailable: 'Tue, 13 Apr • 14:30', faculty: 'Faculté B' },
  { id: 'd3', name: 'Dr. Amina Gharbi', specialty: 'General Medicine', nextAvailable: 'Wed, 14 Apr • 09:00', faculty: 'Faculté A' },
  { id: 'd4', name: 'Dr. Karim S.', specialty: 'Pediatrics', nextAvailable: 'Thu, 15 Apr • 11:00', faculty: 'Faculté C' }
]

export default function FacultyDoctors({ faculty = 'Faculté A', doctors = SAMPLE, onViewAll }: { faculty?: string; doctors?: Doctor[]; onViewAll?: () => void }) {
  const visible = doctors.filter((d) => d.faculty === faculty).slice(0, 2)

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Doctors available in {faculty}</h3>
          <p className="text-sm text-gray-500 mt-1">Doctors from your faculty and their next available slot.</p>
        </div>

      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {visible.map((d) => (
          <div key={d.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-700">{d.name.split(' ').map(n => n[0]).slice(0,2).join('')}</div>
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{d.name}</div>
                <div className="text-xs text-gray-500">{d.specialty}</div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-900 dark:text-gray-100">{d.nextAvailable}</div>
            </div>
          </div>
        ))}
        {visible.length === 0 && <div className="py-4 text-sm text-gray-500">No doctors found for your faculty.</div>}
      </div>

      <div className="mt-3 text-right">
        {onViewAll ? (
          <button
            type="button"
            onClick={onViewAll}
            aria-label={`View all doctors in ${faculty}`}
            className="text-xs text-gray-500 hover:text-gray-700 hover:underline cursor-pointer transition-colors"
          >
            View all
          </button>
        ) : (
          <Link href="/doctors" className="text-xs text-gray-500 hover:text-gray-700 hover:underline">View all</Link>
        )}
      </div>
    </div>
  )
}
