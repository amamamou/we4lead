import React from 'react'
import Image from 'next/image'

type Props = {
  // when true, render the compact, one-line professional footer for desktop (mobile fallback preserved)
  variant?: 'default' | 'compact'
}

export default function DashboardFooter({ variant = 'default' }: Props) {
  // Default multi-line design (used by students/doctors/mobile)
  const defaultFooter = (
    <div className="mt-8 sm:mt-0 flex flex-col items-center w-full">
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          <div className="opacity-90 dark:opacity-70">
            <Image src="/we4lead.png" alt="WE4LEAD" width={120} height={36} className="object-contain h-8 md:h-10" />
          </div>
        </div>

        <span aria-hidden="true" className="hidden sm:inline-block w-px h-6 bg-gray-200 dark:bg-gray-600 mx-3" />

        <div className="flex items-center">
          <div className="opacity-90 dark:opacity-70">
            <Image src="/universitedesousse.png" alt="Université de Sousse" width={120} height={36} className="object-contain h-8 md:h-10" />
          </div>
        </div>
      </div>

      <p className="text-[10px] text-gray-500 dark:text-gray-400 text-center mt-1">© 2026 — Co-funded by Erasmus+ (EU)</p>
    </div>
  )

  // Compact one-line professional design for desktop. Mobile will fall back to the defaultFooter.
  const compactFooter = (
    <>
      {/* Desktop: one-line professional footer (leaner) */}
      <div className="hidden sm:flex items-center justify-between w-full border-gray-100 dark:border-gray-700 py-2 px-4">
        <div className="text-xs text-gray-500 dark:text-gray-400">© 2026 — Co-funded by Erasmus+ (EU)</div>
        <div className="flex items-center gap-3">
          <div className="opacity-90 dark:opacity-70">
            <Image src="/we4lead.png" alt="WE4LEAD" width={140} height={42} className="object-contain h-6 md:h-7" />
          </div>
          <span aria-hidden className="w-px h-6 bg-gray-200 dark:bg-gray-600" />
          <div className="opacity-90 dark:opacity-70">
            <Image src="/universitedesousse.png" alt="Université de Sousse" width={140} height={42} className="object-contain h-6 md:h-7" />
          </div>
        </div>
      </div>

      {/* Mobile fallback: keep original compacted for small screens */}
      <div className="block sm:hidden">{defaultFooter}</div>
    </>
  )

  return variant === 'compact' ? compactFooter : defaultFooter
}
