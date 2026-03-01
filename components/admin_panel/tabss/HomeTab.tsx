"use client"

import { motion } from "framer-motion"
import HeroSection from "../sections/HeroSection"
import RecentApps from "../sections/RecentApps"
import RecentFiles from "../sections/RecentFiles"
import ActiveProjects from "../sections/ActiveProjects"
import CommunityHighlights from "../sections/CommunityHighlights"


export default function HomeTab() {
  return (
    <motion.div
      key="home-tab"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-8"
    >
      {/* Hero */}
      <HeroSection />

      {/* Recent Apps */}
      <RecentApps />

      {/* Files + Projects Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <RecentFiles />
        <ActiveProjects />
      </div>

      {/* Community */}
      <CommunityHighlights />
    </motion.div>
  )
}