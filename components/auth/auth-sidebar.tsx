import Image from "next/image";
import Link from "next/link";
import { useLanguage } from '@/contexts/LanguageContext'
import { useRouter } from 'next/navigation'

export default function AuthSidebar() {
  const { locale } = useLanguage()
  const lang = locale ?? 'en'
  const router = useRouter()

  return (

    <div
      className="relative  hidden lg:flex flex-1 rounded-r-[60px] overflow-hidden"
      style={{
        background: `radial-gradient(circle at 40% 35%, rgba(19,79,209,0.10), rgba(19,79,209,0.04) 35%, rgba(236,246,255,1) 120%)`
      }}
    >

  {/* decorative right-edge shapes to give a cleaner organic silhouette (toned down) */}
  <div className="pointer-events-none absolute -right-20 top-1/2 -translate-y-1/2 w-56 h-56 md:w-72 md:h-72 rounded-full bg-white/6" style={{filter: 'blur(22px)'}} />
  <div className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 w-36 h-36 rounded-full bg-white/4 mix-blend-overlay" />

  {/* subtle vertical accent (Notion-like clean guide) */}
  <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-24 h-64 w-px bg-neutral-200 opacity-40 rounded" />

      {/* content container: rail / bottom-left brand / footer */}
      <div className="relative flex flex-col w-full p-12">

        {/* A — Navigation rail (hidden on mobile) */}
        <div className="absolute top-6 left-12 hidden lg:block">
          <button
            aria-label="Back to website"
            onClick={() => void router.push('/')}
            className="flex items-center gap-3 text-neutral-500 hover:text-neutral-700 transition"
          >
            <span className="text-lg">←</span>
            <span className="text-sm">{lang === 'fr' ? 'Retour au site' : 'Back to website'}</span>
          </button>
        </div>

        {/* center cleared per user request */}

  {/* B — Emotional / Trust area (bottom-left, slightly raised) */}
  <div className="absolute bottom-28 left-12 max-w-sm space-y-4 text-left text-neutral-900">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-4 hover:opacity-95 transition-opacity">
              <div className="relative h-14 w-14 md:h-16 md:w-16 flex-shrink-0">
                <Image
                  src="/we4lead.png"
                  alt="WE4LEAD"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="h-8 w-px bg-neutral-200" />
              <div className="relative h-8 w-20 md:h-10 md:w-28 flex-shrink-0">
                <Image
                  src="/universitedesousse.png"
                  alt="University of Sousse"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold text-neutral-900">{lang === 'fr' ? 'Favoriser les universités transparentes' : 'Empowering transparent universities'}</h3>
            <p className="text-sm leading-relaxed text-neutral-700">
              {lang === 'fr'
                ? "WE4LEAD soutient l'équité et l'excellence dans l'enseignement supérieur. Co‑financé par Erasmus+."
                : 'WE4LEAD supports fairness and excellence in higher education. Co‑funded by the Erasmus+ Programme.'}
            </p>
          </div>
        </div>

  {/* C — Footer meta (low contrast, slightly raised) */}
  <div className="absolute bottom-12 left-12 right-12 flex justify-start">
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <Link href="/about" className="group hover:text-neutral-700 transition">
              <span className="inline-flex items-center gap-2">
                <span>{lang === 'fr' ? 'À propos' : 'About'}</span>
                <span className="opacity-0 translate-x-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all duration-150 text-neutral-500 text-xs">→</span>
              </span>
            </Link>

            <a href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="group hover:text-neutral-700 transition">
              <span className="inline-flex items-center gap-2">
                <span>FAQ</span>
                <span className="opacity-0 translate-x-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all duration-150 text-neutral-500 text-xs">→</span>
              </span>
            </a>

            <a href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="group hover:text-neutral-700 transition">
              <span className="inline-flex items-center gap-2">
                <span>{lang === 'fr' ? 'Assistance' : 'Support'}</span>
                <span className="opacity-0 translate-x-0 group-hover:translate-x-1 group-hover:opacity-100 transition-all duration-150 text-neutral-500 text-xs">→</span>
              </span>
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}
