import Image from "next/image";
import Link from "next/link";
import { useLanguage } from '@/contexts/LanguageContext'
import { useRouter } from 'next/navigation'

export default function AuthSidebar() {
  const { locale } = useLanguage()
  const lang = locale ?? 'en'
  const router = useRouter()
  return (
<div className="relative border hidden lg:flex flex-1 rounded-r-[32px] overflow-hidden bg-white">

{/* ultra soft brand atmosphere */}
<div
  className="pointer-events-none absolute inset-0"
  style={{
    background: `
      linear-gradient(145deg,
        rgba(9,36,94,0.06) 0%,
        rgba(19,79,209,0.05) 38%,
        rgba(255,255,255,0.98) 70%
      )
    `
  }}
/>
{/* neon warmth accent */}
<div
  className="pointer-events-none absolute inset-0"
  style={{
    background: `radial-gradient(600px 320px at 45% 55%, rgba(168,139,250,0.10), transparent 65%)`
  }}
/>

{/* subtle floor light */}
<div
  className="pointer-events-none absolute inset-0"
  style={{
    background: `
      radial-gradient(1000px 500px at 50% 100%, rgba(19,79,209,0.10), transparent 72%)
    `
  }}
/>





      <div className="relative flex flex-col w-full p-12">

  {/* header rail */}
  <div className="h-10 flex items-center">
    <button
      aria-label="Go back"
      onClick={() => void router.push('/')}
      className="text-neutral-400 hover:text-neutral-600 transition cursor-pointer"
    >
      ←
    </button>
  </div>


        {/* TOP AREA (spacer) */}
        {/* Arrow is absolutely positioned above; this area remains for layout flow */}

        {/* PUSH CONTENT DOWN */}
        <div className="mt-auto space-y-10">

          {/* BRAND BLOCK (bottom anchored) */}
          <div className="space-y-5 max-w-md">
            <div className="flex items-center gap-3">
       <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <div className="relative h-16 w-16 md:h-20 md:w-20">
            <Image
              src="/we4lead.png"
              alt="WE4LEAD"
              fill
              className="object-contain"
              priority
            />
          </div>
            <div className="h-8 w-px bg-gray-200"></div>
          <div className="relative h-10 w-24 md:h-12 md:w-32">
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
            </div>

            <div className="text-sm leading-relaxed text-neutral-500 space-y-3">
              {/* Localized student-focused marketing about WE4LEAD */}
              <p>
                {lang === 'fr'
                  ? "Cette plateforme fait partie du programme WE4LEAD, piloté par l'Université de Sousse, visant à promouvoir l'égalité, la transparence et l'excellence dans l'enseignement supérieur. Co‑financé par le programme Erasmus+ de l'Union européenne."
                  : 'This platform is part of the WE4LEAD programme, led by the University of Sousse, promoting equality, transparency and excellence in higher education. Co‑funded by the Erasmus+ Programme of the European Union.'}
              </p>
            </div>
          </div>

          {/* FOOTER LINKS */}
          <div className="flex items-center gap-6 text-sm text-neutral-400">
            <Link href="/about" className="hover:text-neutral-600 transition">{lang === 'fr' ? 'À propos' : 'About'}</Link>
            <a href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-600 transition">FAQ</a>
            <a href="http://we4lead.ul.edu.lb/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-600 transition">{lang === 'fr' ? 'Assistance' : 'Support'}</a>
          </div>

        </div>
      </div>
    </div>
  );
}
