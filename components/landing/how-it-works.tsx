"use client"

import { motion } from "framer-motion"

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Connect Your Tools",
      description:
        "Integrate with your existing workflow in minutes. Our platform seamlessly connects with the tools you already use every day.",
    },
    {
      number: "02",
      title: "AI-Powered Automation",
      description:
        "Let our intelligent system handle the heavy lifting. Automate repetitive tasks and focus on what matters most to your business.",
    },
    {
      number: "03",
      title: "Scale With Confidence",
      description:
        "Close high-velocity transactions in minutes, not weeks. Our platform is built to handle your growth without compromising on speed or reliability.",
    },
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps and transform your workflow
          </p>
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
              <div className="mb-6 flex items-center gap-6">
                {/* Step Number */}
                <div>
                  <span className="text-5xl font-bold text-gray-500 opacity-40">{step.number}</span>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-3">{step.title}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
