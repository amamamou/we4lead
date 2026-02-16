'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function LandingCTA() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#020E68] rounded-lg p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-light leading-tight">
                Looking for support?
              </h2>
              <p className="text-sm text-blue-100">
Your institute’s doctors are just a few clicks away.              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <button
                onClick={() => {
                  const el = document.getElementById('institutions')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="group inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white text-[#020E68] rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                aria-label="Get Started - find a doctor"
              >
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
              <Link
                href="/apropos"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white/10 text-white border border-white/20 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
