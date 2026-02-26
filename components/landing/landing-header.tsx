"use client"

import Image from "next/image"
import Link from "next/link"

// @component: PortfolioNavbar
export const LandingHeader = () => {

  // @return
  return (
  <header className="w-full bg-transparent pt-6 pb-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-center items-center">
        <Link href="/" aria-label="Home" className="inline-flex items-center">
          <Image src="/universitedesousse.png" alt="Université de Sousse" width={240} height={80} className="h-16 md:h-20 w-auto object-contain" />
        </Link>
      </div>
    </header>
  )
}
