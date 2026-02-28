"use client"

import { motion } from "framer-motion"
import { useLanguage } from '@/contexts/LanguageContext'

export function HowItWorksSection() {
  const { locale } = useLanguage()

  const steps =
    locale === "fr"
      ? [
          {
            number: "01",
            title: "Trouvez votre institut",
            description:
              "Sélectionnez votre institut et consultez le psychothérapeute référent de votre faculté. Chaque institut est rattaché à un professionnel dédié.",
          },
          {
            number: "02",
            title: "Signalez en toute confidentialité",
            description:
              "Remplissez le formulaire de signalement sécurisé. Votre message est transmis directement et en toute confidentialité au psychothérapeute concerné.",
          },
          {
            number: "03",
            title: "Suivi professionnel",
            description:
              "Le psychothérapeute référent vous contactera par email afin de vous orienter et d’organiser un rendez-vous confidentiel au sein de l’Université de Sousse.",
          },
        ]
      : [
          {
            number: "01",
            title: "Find Your Institute",
            description:
              "Select your institute and view the assigned psychotherapist responsible for your faculty. Each institute is linked to a dedicated professional.",
          },
          {
            number: "02",
            title: "Submit Your Report Confidentially",
            description:
              "Fill in the secure reporting form. Your message is sent directly and confidentially to the assigned psychotherapist.",
          },
          {
            number: "03",
            title: "Receive Professional Support",
            description:
              "The assigned psychotherapist will contact you by email to provide guidance and arrange a confidential meeting at the University of Sousse.",
          },
        ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/** Localized header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {(() => {
            const headerTitle = locale === 'fr' ? "Comment ça fonctionne" : 'How It Works'
            const headerSubtitle =
              locale === 'fr'
                ? 'Signalez en toute sécurité. Recevez des conseils. Obtenez du soutien.'
                : 'Report safely. Receive guidance. Get support.'

            return (
              <>
                <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">{headerTitle}</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{headerSubtitle}</p>
              </>
            )
          })()}
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col"
            >
              <div className="mb-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 text-left md:text-center">
                {/* Step Number */}
                <div>
                  <span className="text-4xl md:text-5xl font-bold text-gray-500 opacity-40">{step.number}</span>
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-0">{step.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
