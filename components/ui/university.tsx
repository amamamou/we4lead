import * as React from 'react'

// Replace the simple building with a distinct mortarboard (graduation cap)
// icon to better represent "University". This component accepts a `size`
// prop (like lucide-react icons) and forwards other SVG props.
export default function University({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) {
  const s = size || 24

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={s}
      height={s}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {/* Classic institute/building icon */}
      {/* Roof */}
      <path d="M3 8 L12 3 L21 8" />
      <path d="M4 8h16" />

      {/* Columns */}
      <line x1="7" y1="11" x2="7" y2="16" />
      <line x1="10" y1="11" x2="10" y2="16" />
      <line x1="13" y1="11" x2="13" y2="16" />
      <line x1="16" y1="11" x2="16" y2="16" />

      {/* Base steps */}
      <line x1="4" y1="17.5" x2="20" y2="17.5" />
      <line x1="5" y1="19" x2="19" y2="19" />
    </svg>
  )
}
