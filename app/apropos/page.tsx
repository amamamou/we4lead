'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

import Header from '@/components/header'
import Footer from '@/components/footer'

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { 
  end: number
  duration?: number
  suffix?: string
}) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.3
      }
    )

    const currentRef = counterRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Ease out animation
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * end))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <div ref={counterRef}>
      <p className="text-3xl font-semibold text-[#0A1A3A] mb-2">
        {count}{suffix}
      </p>
    </div>
  )
}

export default function AboutPage() {
  return (
    <main className="bg-white">

      <Header />

      {/* ================= HERO ================= */}

      <section className="pt-28 pb-24">

        <div className="max-w-5xl mx-auto px-6">

          <p className="text-sm tracking-widest text-gray-400 mb-6 uppercase">
            Projet Erasmus+ WE4LEAD
          </p>

          <h1 className="text-4xl md:text-5xl font-semibold text-[#0A1A3A] leading-tight mb-8">
            Favoriser une gouvernance universitaire
            plus équitable et inclusive
          </h1>

          <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
            Cette plateforme s’inscrit dans le cadre du programme WE4LEAD,
            porté par l’Université de Sousse, visant à promouvoir l’égalité,
            la transparence et l’excellence dans l’enseignement supérieur.
          </p>

        </div>

      </section>

      {/* ================= IMAGE + TEXT ================= */}

      <section className="pb-28">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">

          {/* Image */}

          <div className="relative h-[420px] rounded-2xl overflow-hidden bg-gray-100">

            <Image
              src="/groupphoto.jpg"
              alt="Université de Sousse"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />

          </div>

          {/* Text */}

          <div>

            <h2 className="text-2xl font-medium text-[#0A1A3A] mb-6">
              Une initiative académique structurante
            </h2>

            <p className="text-gray-600 leading-relaxed mb-5">
              WE4LEAD (Women’s Empowerment For Leadership and Equity in Higher
              Education Institutions) est un projet Erasmus+ de renforcement
              des capacités dans l’enseignement supérieur.
            </p>

            <p className="text-gray-600 leading-relaxed mb-5">
              Il vise à analyser, accompagner et améliorer les pratiques
              institutionnelles en matière de gouvernance, de recrutement
              et de leadership.
            </p>

            <p className="text-gray-600 leading-relaxed">
              L’Université de Sousse participe activement à cette dynamique
              en intégrant ces principes dans ses politiques internes.
            </p>

          </div>

        </div>

      </section>

      {/* ================= DIVIDER ================= */}

      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gray-200" />
      </div>

      {/* ================= KEY FACTS ================= */}

      <section className="py-24">

        <div className="max-w-6xl mx-auto px-6">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">

            <div>
              <AnimatedCounter end={21} suffix="+" />
              <p className="text-sm text-gray-500">
                Pays partenaires
              </p>
            </div>

            <div>
              <AnimatedCounter end={85} suffix="+" />
              <p className="text-sm text-gray-500">
                Universités
              </p>
            </div>

            <div>
              <AnimatedCounter end={2000} suffix="+" />
              <p className="text-sm text-gray-500">
                Bénéficiaires
              </p>
            </div>

            <div>
              <p className="text-3xl font-semibold text-[#0A1A3A] mb-2">
                En cours
              </p>
              <p className="text-sm text-gray-500">
                Projet actif
              </p>
            </div>

          </div>

        </div>

      </section>

      {/* ================= SECOND IMAGE ================= */}

      <section className="pb-28">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">

          {/* Text */}

          <div>

            <h2 className="text-2xl font-medium text-[#0A1A3A] mb-6">
              Un projet au service des étudiants
            </h2>

            <p className="text-gray-600 leading-relaxed mb-5">
              À travers WE4LEAD, les étudiants bénéficient d’un environnement
              académique plus transparent, plus équitable et plus respectueux
              des parcours individuels.
            </p>

            <p className="text-gray-600 leading-relaxed mb-5">
              Le projet favorise l’émergence de politiques institutionnelles
              garantissant l’égalité des chances dans l’accès aux postes
              de responsabilité et aux ressources.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Il contribue également à renforcer la confiance, le dialogue
              et la qualité de la vie universitaire.
            </p>

          </div>

          {/* Image */}

          <div className="relative h-[420px] rounded-2xl overflow-hidden bg-gray-100">

            <Image
              src="/group.jpg"
              alt="Projet WE4LEAD"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />

          </div>

        </div>

      </section>

      {/* ================= PARTNERS ================= */}

      <section className="pb-28">

        <div className="max-w-5xl mx-auto px-6">

          <h2 className="text-2xl font-medium text-[#0A1A3A] mb-10">
            Partenaires académiques
          </h2>

          <div className="grid md:grid-cols-2 gap-10 text-gray-600 text-sm leading-relaxed">

            <ul className="space-y-2">
              <li>Aix-Marseille Université (Coordinateur)</li>
              <li>Université La Sapienza de Rome</li>
              <li>Université Autonoma de Madrid</li>
            </ul>

            <ul className="space-y-2">
              <li>Université de Sousse</li>
              <li>Université Tunis El-Manar</li>
              <li>Université Libanaise</li>
              <li>Université Antonine</li>
            </ul>

          </div>

        </div>

      </section>

      <Footer />

    </main>
  )
}
