'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react'

export default function LandingFooter() {
  return (
    <footer id="footer" className="bg-white border-t border-gray-200 text-gray-600">
      {/* Main Footer */}
       {/* ================= MAIN FOOTER ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">

          {/* BRAND */}
          <div className="lg:col-span-2 space-y-4">

            <h3 className="text-xl font-bold text-gray-900">
              WE4LEAD
            </h3>

            <p className="text-sm text-blue-600">
              Université de Sousse
            </p>

            <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
              Women’s Empowerment for Leadership and Equity in Higher Education
              Institutions. An Erasmus+ project promoting gender equality in
              Mediterranean universities.
            </p>

            {/* Languages */}
            <div className="flex gap-4 text-sm text-gray-500 pt-2">
              <span className="cursor-pointer hover:text-blue-600">Fr</span>
              <span>|</span>
              <span className="cursor-pointer hover:text-blue-600">En</span>
              <span>|</span>
              <span className="cursor-pointer hover:text-blue-600">Ar</span>
            </div>

          </div>


          {/* PROJECT */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">
              Project
            </h4>

            <ul className="space-y-2 text-sm text-gray-500">

              <li>
                <Link href="/context" className="group flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span>Context</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

              <li>
                <Link href="/objectives" className="group flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span>Objectives</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

              <li>
                <Link href="/activities" className="group flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span>Activities</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

              <li>
                <Link href="/partners" className="group flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span>Partners</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

            </ul>
          </div>


          {/* NAVIGATION */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">
              Navigation
            </h4>

            <ul className="space-y-2 text-sm text-gray-500">

              <li>
                <Link href="/" className="group flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span>Home</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

              <li>
                <Link href="/context" className="group flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span>Context</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

              <li>
                <Link href="/partners" className="group flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span>Partners</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

              <li>
                <Link href="/contact" className="group flex items-center gap-2 hover:text-blue-600 transition-colors">
                  <span>Contact</span>
                  <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>

            </ul>
          </div>


          {/* CONTACT INFO (TEXT ONLY) */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">
              Contact
            </h4>

            <div className="space-y-2 text-sm text-gray-500">

              <p>Université de Sousse</p>

              <p>Rue Khalifa El Karoui, Sahloul 4 – BP 526</p>

              <p>Email: contact@uss.tn</p>

              <p>Tel: +216 73 366 700</p>

            </div>
          </div>


{/* BIG MAP ONLY */}
<div className="flex items-center">

  <div className="w-full h-44 md:h-52 rounded-md overflow-hidden border border-gray-200 shadow-sm">

    <iframe
      title="Université de Sousse Map"
      className="w-full h-full border-0"
      src="https://maps.google.com/maps?q=Université%20de%20Sousse&t=&z=13&ie=UTF8&iwloc=&output=embed"
      loading="lazy"
    />

  </div>

</div>

        </div>

      </div>


      {/* Bottom Footer */}
      <div className="border-t border-gray-200 bg-gray-50 px-2 sm:px-6 lg:px-4 py-2 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 sm:py-2.5 flex flex-col md:flex-row justify-between items-center gap-1">

    <p className="text-[11px] sm:text-[13px] text-gray-600 tracking-wide text-center md:text-left whitespace-nowrap">
      © {new Date().getFullYear()} WE4LEAD Project — Université de Sousse
    </p>

    <p className="text-[11px] sm:text-[12px] text-gray-600 tracking-wide text-center md:text-right whitespace-nowrap">
      Co-funded by the Erasmus+ Programme of the European Union
    </p>

  </div>
      </div>
    </footer>
  );
}
