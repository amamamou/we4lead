"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Eye, Command , GitBranch, Clock, ShieldCheck } from "lucide-react"
import i18n from '@/lib/i18n'
import { useLanguage } from '@/contexts/LanguageContext'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

function SystemStatus() {
  const [dots, setDots] = useState([true, true, true, false, true])

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => prev.map(() => Math.random() > 0.2))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2">
      {dots.map((active, i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 rounded-full ${
            active ? "bg-blue-500" : "bg-slate-300"
          }`}
          animate={active ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  )
}

function KeyboardCommand() {
  const [pressed, setPressed] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPressed(true)
      setTimeout(() => setPressed(false), 200)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-1">
      <motion.kbd
        animate={pressed ? { scale: 0.95, y: 2 } : { scale: 1, y: 0 }}
        className="px-2 py-1 text-xs bg-slate-100 border border-slate-200 rounded text-slate-700 font-mono"
      >
        ⌘
      </motion.kbd>
      <motion.kbd
        animate={pressed ? { scale: 0.95, y: 2 } : { scale: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="px-2 py-1 text-xs bg-slate-100 border border-slate-200 rounded text-slate-700 font-mono"
      >
        R
      </motion.kbd>
    </div>
  )
}

function AnimatedChart() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const points = [
    { x: 0, y: 60 },
    { x: 20, y: 50 },
    { x: 40, y: 55 },
    { x: 60, y: 40 },
    { x: 80, y: 30 },
    { x: 100, y: 20 },
  ]

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`
  }, "")

  return (
    <svg ref={ref} viewBox="0 0 100 70" className="w-full h-24">
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(59 130 246)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="rgb(59 130 246)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {isInView && (
        <>
          <path
            d={`${pathD} L 100 70 L 0 70 Z`}
            fill="url(#chartGradient)"
            className="opacity-50"
          />
          <path
            d={pathD}
            fill="none"
            stroke="rgb(37 99 235)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  )
}

export function BentoGrid() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { locale } = useLanguage()

  return (
    <section id="features" className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-bold mb-4 text-slate-900">
            {i18n.t('cellule.sectionTitle', locale)}
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            {i18n.t('cellule.sectionDesc', locale)}
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >

          {/* Large Card */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 group relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:scale-[1.02] hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="p-2 rounded-lg bg-blue-50 w-fit mb-4">
                  <Eye className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">
                  {i18n.t('cellule.features.2.title', locale)}
                </h3>
                <p className="text-slate-600 text-sm">
                  {i18n.t('cellule.features.2.description', locale)}
                </p>
              </div>
              <SystemStatus />
            </div>

         <div className="grid grid-cols-4 gap-4 text-center">
  <div>
    <div className="text-2xl font-bold text-slate-900 mb-1">17</div>
    <div className="text-xs text-slate-500">{i18n.t('cellule.stats.institutes', locale)}</div>
  </div>
  <div>
    <div className="text-2xl font-bold text-slate-900 mb-1">100%</div>
    <div className="text-xs text-slate-500">{i18n.t('cellule.stats.confidentiality', locale)}</div>
  </div>
  <div>
    <div className="text-2xl font-bold text-slate-900 mb-1">1:1</div>
    <div className="text-xs text-slate-500">{i18n.t('cellule.stats.assignedProfessional', locale)}</div>
  </div>
  <div>
    <div className="text-2xl font-bold text-slate-900 mb-1">3</div>
    <div className="text-xs text-slate-500">{i18n.t('cellule.stats.steps', locale)}</div>
  </div>
</div>
          </motion.div>

          {/* Command */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:scale-[1.02] hover:shadow-md transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-blue-50 w-fit mb-4">
              <Command   className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {i18n.t('cellule.quickAccess.title', locale)}
            </h3>
            <p className="text-slate-600 text-sm mb-6">
              {i18n.t('cellule.quickAccess.desc', locale)}
            </p>
            <KeyboardCommand />
          </motion.div>

          {/* Analytics */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:scale-[1.02] hover:shadow-md transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-blue-50 w-fit mb-4">
              <GitBranch className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {i18n.t('cellule.structuredWorkflow.title', locale)}
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              {i18n.t('cellule.structuredWorkflow.desc', locale)}
            </p>
            <AnimatedChart />
          </motion.div>

          {/* Performance */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:scale-[1.02] hover:shadow-md transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-blue-50 w-fit mb-4">
              <Clock className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {i18n.t('cellule.features.3.title', locale)}
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              {i18n.t('cellule.features.3.description', locale)}
            </p>
            <div className="flex items-center gap-2 text-blue-600 text-sm">
              <span className="font-mono">~24h</span>
              <span className="text-slate-500">{i18n.t('cellule.firstContactLabel', locale)}</span>
            </div>
          </motion.div>

          {/* Security */}
          <motion.div
            variants={itemVariants}
            className="group relative p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:scale-[1.02] hover:shadow-md transition-all duration-300"
          >
            <div className="p-2 rounded-lg bg-blue-50 w-fit mb-4">
              <ShieldCheck className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {i18n.t('cellule.security.title', locale)}
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              {i18n.t('cellule.security.desc', locale)}
            </p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs bg-blue-50 rounded text-blue-600">{i18n.t('apropos.partners.heading', locale)}</span>
              <span className="px-2 py-1 text-xs bg-blue-50 rounded text-blue-600">Erasmus+</span>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}