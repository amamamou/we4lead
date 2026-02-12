import React from 'react'
import Image from 'next/image'

export default function DashboardFooter() {
  return (
  <div className="mt-8 sm:mt-0 flex flex-col items-center w-full">
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          <div className="opacity-90 dark:opacity-70">
            <Image src="/we4lead.png" alt="WE4LEAD" width={96} height={28} className="object-contain h-6 md:h-8" />
          </div>
        </div>

        <span aria-hidden="true" className="hidden sm:inline-block w-px h-6 bg-gray-200 dark:bg-gray-600 mx-3" />

        <div className="flex items-center">
          <div className="opacity-90 dark:opacity-70">
            <Image src="/universitedesousse.png" alt="Université de Sousse" width={96} height={28} className="object-contain h-6 md:h-8" />
          </div>
        </div>
      </div>

      <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center mt-1">© 2026 — Co-funded by Erasmus+ (EU)</p>
    </div>
  )
}
