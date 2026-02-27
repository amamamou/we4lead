"use client"

import { Card } from "@/components/ui/card"
import {
  ShieldCheck,
  Lock,
  Users,
  Mail,
  Building2,
  Scale,
} from "lucide-react"
import { motion } from "framer-motion"
import { t } from '@/lib/i18n'
import { useLanguage } from '@/contexts/LanguageContext'

export function CaseStudiesCarousel() {
  const { locale } = useLanguage()

  const features = [
    {
      icon: ShieldCheck,
      title: t('cellule.features.1.title', locale),
      description: t('cellule.features.1.description', locale),
    },
    {
      icon: Users,
      title: t('cellule.features.2.title', locale),
      description: t('cellule.features.2.description', locale),
    },
    {
      icon: Mail,
      title: t('cellule.features.3.title', locale),
      description: t('cellule.features.3.description', locale),
    },
    {
      icon: Building2,
      title: t('cellule.features.4.title', locale),
      description: t('cellule.features.4.description', locale),
    },
    {
      icon: Lock,
      title: t('cellule.features.5.title', locale),
      description: t('cellule.features.5.description', locale),
    },
    {
      icon: Scale,
      title: t('cellule.features.6.title', locale),
      description: t('cellule.features.6.description', locale),
    },
  ]

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32" id="features">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-balance font-display">
          {t('cellule.sectionTitle', locale)}
        </h2>

        <p className="text-lg text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
          {t('cellule.sectionDesc', locale)}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors h-full">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-display">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
