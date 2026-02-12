import React, { ReactNode } from 'react'
import CoreHeader from './CoreHeader'
import Image from 'next/image'
import { ArrowRight, Stethoscope, Clock } from '@/components/ui/icons'

type Props = {
  children?: ReactNode
  name?: string
  showHero?: boolean
  role?: 'student' | 'doctor' | 'admin' | string
  onNavigate?: (key: string) => void
}

const DEFAULT_GREETING = 'Good to see you'
const DEFAULT_TITLE = 'Take a moment for your well-being'
const DEFAULT_SUBTITLE = 'Quick tips and resources to help you stay balanced while managing your schedule.'
const DEFAULT_TIPS = [
  'Take a 2‑minute breathing break (inhale 4s, hold 4s, exhale 4s).'
]

type IconComp = React.ComponentType<{ size?: number }>

type Cfg = {
  greeting: string
  title: string
  subtitle?: string | string[]
  tips: string[]
  primary?: { label: string; icon?: IconComp; target?: string }
  secondary?: { label: string }
}

export default function Core({ children, name, showHero = true, role, onNavigate }: Props) {
  // Role-specific hero content (students get a different message and CTA)
  // Role-specific hero content
  let cfg: Cfg
  if (role === 'student') {
    cfg = {
      greeting: DEFAULT_GREETING,
      title: DEFAULT_TITLE,
      // Multi-line subtitle as requested for students (rendered as separate paragraphs)
      subtitle: [
        'We provide confidential consultations through dedicated university professionals.',
        'We support you in navigating academic and personal challenges.',
        'We are here to ensure you feel supported throughout your journey.'
      ],
      tips: [],
  primary: { label: 'View available doctors', icon: Stethoscope, target: 'doctors' },
      secondary: { label: 'Learn more' }
    }
  } else if (role === 'doctor') {
    cfg = {
      greeting: DEFAULT_GREETING,
      title: 'Student support starts with you',
      subtitle: [
        'We support you in providing structured and confidential consultations to students.',
        'Your availability ensures students can access guidance when they need it.',
        'Manage your availability and upcoming sessions below.'
      ],
      tips: [],
  primary: { label: 'Update availability', icon: Clock, target: 'availability' },
      secondary: { label: 'Learn more' }
    }
  } else {
    cfg = {
      greeting: DEFAULT_GREETING,
      title: DEFAULT_TITLE,
      subtitle: DEFAULT_SUBTITLE,
      tips: DEFAULT_TIPS,
      primary: { label: 'Explore resources' }
    }
  }

  return (
    <main className="flex-1 p-6 min-h-screen">
      <CoreHeader name={name} />

      {showHero ? (
        <div className="mb-6">
          <div className="w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm">
            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
              <div className="flex-1 p-8 space-y-6">
                <div>
                  <p className="text-sm text-gray-500">{cfg.greeting}</p>
                  <h2 className="text-2xl md:text-3xl font-semibold mt-1 leading-tight">{cfg.title}</h2>
                  {Array.isArray(cfg.subtitle) ? (
                    <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {cfg.subtitle.map((s: string, i: number) => (
                        <p key={i}>{s}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">{cfg.subtitle}</p>
                  )}

                  <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {cfg.tips.map((t: string, i: number) => (
                      <p key={i}>{t}</p>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => cfg.primary?.target && onNavigate?.(cfg.primary.target)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    {(() => {
                      const Icon = cfg.primary?.icon ?? Stethoscope
                      return <Icon size={16} />
                    })()}
                    <span>{cfg.primary?.label}</span>
                  </button>

                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <span>{cfg.secondary?.label ?? 'Learn more'}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div className="w-72 md:w-96 h-56 md:h-72 flex-shrink-0 overflow-hidden">
                {/* show role-specific hero illustration */}
                <Image
                  src={role === 'student' ? '/medical.gif' : '/doctor.gif'}
                  alt={role === 'student' ? 'Student illustration' : 'Doctor illustration'}
                  width={480}
                  height={480}
                  className="object-contain w-full h-full"
                  style={role === 'doctor' ? { transform: 'scaleX(-1)' } : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <section className="space-y-6">
        {children ?? (
          <div className="p-6 bg-white rounded shadow-sm dark:bg-gray-900">
            <p className="text-gray-600">This is your dashboard core area. Add widgets here.</p>
          </div>
        )}
      </section>
    </main>
  )
}
