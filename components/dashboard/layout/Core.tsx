import React, { ReactNode } from 'react'
import CoreHeader from './CoreHeader'
// Illustration switched from GIF to inline SVG (no external gifs)
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

  // Treat the doctors-related CTA (either labeled 'View available doctors' or targeting 'availability')
  // the same: render it as the bordered/gray CTA rather than the filled primary.
  const primaryIsViewDoctors = cfg.primary?.label === 'View available doctors' || cfg.primary?.target === 'availability'

  return (
  <main className="flex-1 p-6 min-h-screen bg-white">
      <CoreHeader name={name} />

      {showHero ? (
        <div className="mb-6">
          <div className="w-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-sm">
            <div className="p-8">
              <div className="max-w-8xl mx-auto space-y-6 text-center md:text-left">
                <div>
                  <p className="text-sm text-gray-500">{cfg.greeting}</p>
                  <h2 className="text-2xl md:text-lg font-semibold text-gray-900 mt-8 leading-tight">{cfg.title}</h2>

                  {Array.isArray(cfg.subtitle) ? (
                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                      {cfg.subtitle.map((s: string, i: number) => (
                        <p key={i}>{s}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-gray-600">{cfg.subtitle}</p>
                  )}

                  <div className="mt-6 flex items-center justify-center md:justify-start gap-3">
                    <button
                      type="button"
                      onClick={() => cfg.primary?.target && onNavigate?.(cfg.primary.target)}
                      className={`inline-flex items-center ${primaryIsViewDoctors ? 'gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition' : 'gap-3 px-4 py-2 rounded-lg text-sm font-medium shadow-sm bg-[#020E68] text-white hover:bg-[#020E68]/90 transition'}`}
                      aria-label={cfg.primary?.label}
                    >
                      {(() => {
                        const Icon = cfg.primary?.icon ?? Stethoscope
                        return <Icon size={16} />
                      })()}
                      <span>{cfg.primary?.label}</span>
                    </button>

                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition">
                      <span>{cfg.secondary?.label ?? 'Learn more'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  {cfg.tips.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {cfg.tips.map((t, i) => (
                        <div key={i} className="flex items-start gap-3 bg-gray-50 border border-gray-100 rounded-lg p-3">
                          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center text-sm text-gray-700 shadow">✓</div>
                          <div className="text-sm text-gray-600">{t}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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
