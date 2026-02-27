"use client"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
type ProductTeaserCardProps = {
  dailyVolume?: string
  dailyVolumeLabel?: string
  headline?: string
  subheadline?: string
  description?: string
  videoSrc?: string
  posterSrc?: string
  primaryButtonText?: string
  primaryButtonHref?: string
  secondaryButtonText?: string
  secondaryButtonHref?: string
}

// @component: ProductTeaserCard
export const ProductTeaserCard = (props: ProductTeaserCardProps) => {
  const {
    dailyVolume = "1,430,992,688",
    dailyVolumeLabel = "DAILY ANALYZED MESSAGES",
    headline = "The Intelligence Layer for Modern Communication",
    subheadline = "Auralink connects every call, chat, and meeting into a unified AI layer — delivering real-time insights, tone analysis, and team alignment across your favorite tools.",
  description = "Trusted by fast-growing teams and enterprises, Auralink powers smarter communication across 1,000+ organizations — with enterprise-grade security, multilingual analysis, and instant emotional detection.",
    primaryButtonText = "Start analyzing",
    primaryButtonHref = "",
    secondaryButtonText = "View API Docs",
    secondaryButtonHref = "",
  } = props

  // @return
  return (
    <section className="w-full px-8 pt-20 pb-16">
      <div className="max-w-7xl mx-auto">
  <div className="grid grid-cols-12 gap-2 items-stretch">
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.8,
              ease: [0.645, 0.045, 0.355, 1],
            }}
            className="col-span-12 bg-hero-gradient text-white rounded-[40px] p-16 lg:p-24 flex flex-col justify-start h-[650px] overflow-hidden"
          >
            {/* Layout: left column = content, right column = action buttons (desktop). On small screens they stack vertically. */}
            <div className="flex flex-col lg:flex-row h-full">
              <div className="lg:flex-1 lg:pr-8 flex flex-col">
                <a
                  href={primaryButtonHref}
                  onClick={(e) => e.preventDefault()}
                  className="flex flex-col gap-2 text-white"
                >
                  {/* We4lead logo (keep file where your project expects it; current src is /we4lead.png) */}
                  <div className="mb-6">
                    <img
                      src="/we4lead.png"
                      alt="we4lead logo"
                      width={160}
                      height={40}
                      style={{ objectFit: "contain" }}
                      className="block"
                    />
                  </div>
                  <motion.span
                    initial={{
                      transform: "translateY(20px)",
                      opacity: 0,
                    }}
                    animate={{
                      transform: "translateY(0px)",
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.4,
                      ease: [0.645, 0.045, 0.355, 1],
                      delay: 0.6,
                    }}
                    className="text-sm uppercase tracking-tight font-mono flex items-center gap-1"
                    style={{
                      fontFamily: "var(--font-geist-mono), 'Geist Mono', ui-monospace, monospace",
                    }}
                  >
                    {dailyVolumeLabel}
                    <ArrowUpRight className="w-[0.71em] h-[0.71em]" />
                  </motion.span>
                  <span
                    className="text-[32px] leading-[160px] tracking-tight bg-gradient-to-r from-[#202020] via-[#00517f] via-[#52aee3] to-[#9ed2fc] bg-clip-text text-transparent"
                    style={{
                      fontFeatureSettings: '"clig" 0, "liga" 0',
                      height: "98px",
                      marginBottom: "0px",
                      paddingTop: "",
                      display: "none",
                    }}
                  >
                    {dailyVolume}
                  </span>
                </a>

                <h1
                  className="text-[56px] leading-[72px] tracking-normal text-white max-w-[520px] mb-8"
                  style={{
                    fontWeight: "500",
                    fontFamily: "var(--font-figtree), Figtree",
                  }}
                >
                  {headline}
                </h1>

                <p
                  className="text-lg leading-8 text-white max-w-[520px] mb-8"
                  style={{
                    fontFamily: "var(--font-figtree), Figtree",
                  }}
                >
                  {subheadline}
                </p>

                <div className="max-w-[520px] mb-0">
                  <p
                    className="text-base leading-5"
                    style={{
                      display: "none",
                    }}
                  >
                    {description}
                  </p>
                </div>
              </div>

              {/* Right column: action buttons. On small screens this will appear below (mt-8). */}
              <div className="mt-8 lg:mt-80 lg:w-1/3 flex lg:items-center lg:justify-end">
                <ul className="flex gap-2 flex-wrap mt-0 lg:flex-col lg:gap-4 lg:items-end">
                  <li>
                    <a
                      href={primaryButtonHref}
                      onClick={(e) => e.preventDefault()}
                      className="block cursor-pointer text-white bg-[#0988f0] rounded-full px-[18px] py-[15px] text-base leading-4 whitespace-nowrap transition-all duration-150 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] hover:rounded-2xl"
                      style={{
                        background: "#156d95",
                      }}
                    >
                      {primaryButtonText}
                    </a>
                  </li>
                  <li>
                    <a
                      href={secondaryButtonHref}
                      onClick={(e) => e.preventDefault()}
                      className="block cursor-pointer text-white border border-white/30 rounded-full px-[18px] py-[15px] text-base leading-4 whitespace-nowrap transition-all duration-150 ease-[cubic-bezier(0.455,0.03,0.515,0.955)] hover:rounded-2xl"
                    >
                      {secondaryButtonText}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Right card removed — left card now spans full width */}
        </div>
      </div>
    </section>
  )
}
