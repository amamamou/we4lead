"use client"

import { motion } from "framer-motion"
import { useLanguage } from '@/contexts/LanguageContext'

export function SocialProof() {
  const { locale } = useLanguage()

  const companies =
    locale === 'fr'
      ? [
          { name: 'Université de Sousse' },
          { name: 'WE4LEAD' },
          { name: 'Erasmus+' },
        ]
      : [
          { name: 'University of Sousse' },
          { name: 'WE4LEAD' },
          { name: "Erasmus+" },
        ]

const heading =
  locale === 'fr'
    ? 'Dédiée aux 17 instituts\nau service de la communauté de l’Université de Sousse.'
    : 'Active across 17 institutes\nsupporting the University of Sousse community.'
  return (
    <section className="border-y border-border bg-secondary/30 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          {/* Left side: Trust text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            {/* Render only the heading (locale-aware) */}
            <p className="text-lg text-muted-foreground whitespace-pre-line">{heading}</p>
          </motion.div>

          {/* Right side: Company logos in a horizontal row */}
          <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center lg:justify-end ml-auto">
            {companies.map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 0.5, y: 0 }}
                whileHover={{ opacity: 0.8, scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="text-muted-foreground font-semibold text-sm tracking-wide px-2 whitespace-nowrap"
              >
                {company.name}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
