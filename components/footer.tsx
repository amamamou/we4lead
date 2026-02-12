import Link from "next/link"
import { ArrowUpRight } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-white text-gray-700">

      {/* ================= SUBSCRIBE BAR ================= */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

          <div className="text-sm text-gray-600">
            Subscribe
            <span className="ml-3 text-xs text-gray-400">
              Receive WE4LEAD news & updates
            </span>
          </div>

          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="border border-gray-300 px-4 py-2 text-sm w-full md:w-64 focus:outline-none"
            />

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 text-sm">
              ▶
            </button>
          </div>

        </div>
      </div>


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


{/* ================= BOTTOM BAR ================= */}
<div className="bg-[#09245E] text-white">

  <div className="max-w-7xl mx-auto px-6 py-2.5 flex flex-col md:flex-row justify-between items-center gap-1">

    <p className="text-[13px] text-white/85 tracking-wide text-center md:text-left">

      © {new Date().getFullYear()} WE4LEAD Project — Université de Sousse

    </p>

    <p className="text-[12px] text-white/70 tracking-wide text-center md:text-right">

      Co-funded by the Erasmus+ Programme of the European Union

    </p>

  </div>

</div>

    </footer>
  )
}
