"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { useLanguage } from '@/contexts/LanguageContext'
type FAQItem = {
  question: string
  answer: string
}
type FAQSectionProps = {
  title?: string
  faqs?: FAQItem[]
}

const defaultFAQsEN: FAQItem[] = [
  {
    question: "I’m not a student — can I still report?",
    answer:
      "Yes. The platform is available to all members of the University of Sousse community, including students, professors and administrative staff.",
  },
  {
    question: "What happens after I submit a report?",
    answer:
      "Your report is received confidentially by the WE4LEAD Cellule and the psychotherapist assigned to your institute. This designated professional will contact you directly by email to provide guidance and, if appropriate, arrange a confidential meeting on campus.",
  },
  {
    question: "Is this platform only for women?",
    answer:
      "No. While the WE4LEAD initiative promotes gender equality, the reporting platform is open to any member of the university community experiencing harassment, discrimination, or misconduct.",
  },
  {
    question: "Is my report really confidential?",
    answer:
      "Yes. All reports are handled with strict confidentiality in accordance with university ethical standards.",
  },
  {
    question: "What if I’m not sure whether what happened is harassment?",
    answer:
      "You can still submit a report. The assigned professional will help you assess the situation, clarify your concerns, and guide you on possible next steps.",
  },
]

const defaultFAQsFR: FAQItem[] = [
  {
    question: "Je ne suis pas étudiant(e) — puis-je quand même signaler ?",
    answer:
      "Oui. La plateforme est accessible à tous les membres de la communauté de l’Université de Sousse, y compris les étudiants, enseignants et personnels administratifs.",
  },
  {
    question: "Que se passe-t-il après l’envoi d’un signalement ?",
    answer:
      "Votre signalement est reçu de manière confidentielle par la Cellule WE4LEAD et le psychothérapeute rattaché à votre institut. Ce professionnel agréé vous contactera directement par email afin de vous orienter et, si nécessaire, organiser un rendez-vous confidentiel sur le campus.",
  },
  {
    question: "La plateforme est-elle réservée aux femmes ?",
    answer:
      "Non. Bien que le projet WE4LEAD promeuve l’égalité de genre, la plateforme est ouverte à toute personne de la communauté universitaire confrontée à une situation de harcèlement, de discrimination ou d’inconduite.",
  },
  {
    question: "Mon signalement est-il vraiment confidentiel ?",
    answer:
      "Oui. Chaque signalement est traité avec la plus stricte confidentialité, conformément aux normes éthiques et institutionnelles de l’université.",
  },
  {
    question: "Et si je ne suis pas sûr(e) qu’il s’agisse de harcèlement ?",
    answer:
      "Vous pouvez tout de même effectuer un signalement. Le professionnel référent vous aidera à analyser la situation, clarifier vos préoccupations et envisager les démarches possibles.",
  },
]

export const FAQSection = ({ title, faqs }: FAQSectionProps) => {
  const { locale } = useLanguage()
  const selectedFaqs = faqs ?? (locale === 'fr' ? defaultFAQsFR : defaultFAQsEN)
  const computedTitle = title ?? (locale === 'fr' ? 'Foire aux questions' : 'Frequently asked questions')
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }
  return (
    <section className="w-full py-24 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Left Column - Title */}
          <div className="lg:col-span-4">
              <h2
              className="text-[40px] leading-tight font-normal text-[#202020] tracking-tight sticky top-24"
              style={{
                fontFamily: "var(--font-figtree), Figtree",
                fontWeight: "400",
                fontSize: "40px",
              }}
            >
              {computedTitle}
            </h2>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="lg:col-span-8">
            <div className="space-y-0">
              {selectedFaqs.map((faq, index) => (
                <div key={index} className="border-b border-[#e5e5e5] last:border-b-0">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between py-6 text-left group hover:opacity-70 transition-opacity duration-150"
                    aria-expanded={openIndex === index}
                  >
                    <span
                      className="text-lg leading-7 text-[#202020] pr-8"
                      style={{
                        fontFamily: "var(--font-figtree), Figtree",
                        fontWeight: "400",
                      }}
                    >
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{
                        rotate: openIndex === index ? 45 : 0,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="flex-shrink-0"
                    >
                      <Plus className="w-6 h-6 text-[#202020]" strokeWidth={1.5} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pr-12">
                          <p
                            className="text-lg leading-6 text-[#666666]"
                            style={{
                              fontFamily: "var(--font-figtree), Figtree",
                            }}
                          >
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
