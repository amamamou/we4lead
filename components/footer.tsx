import Image from "next/image"
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-gray-200">
      
      {/* Main Footer Section */}
      <div className="bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8 items-start">
            
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="/universitedesousse.png"
                  alt="Université de Sousse"
                  width={64}
                  height={48}
                  className="object-contain"
                />
                <div className="w-px h-10 bg-gray-200" />
                <Image
                  src="/we4lead.png"
                  alt="WE4LEAD"
                  width={84}
                  height={76}
                  className="object-contain"
                />
              </div>

              <div className="space-y-2 max-w-md">
                <p className="text-sm font-semibold text-[#0A1A3A]">WE4LEAD</p>
                <p className="text-sm text-gray-600 leading-relaxed font-light">
                  Women&apos;s Empowerment for Leadership & Equity in Higher Education — un programme Erasmus+ pour l&apos;égalité et l&apos;excellence.
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h4 className="text-sm font-semibold text-[#0A1A3A] mb-3 uppercase tracking-wide">
                Contact
              </h4>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Adresse</p>
                    <p className="text-sm text-gray-600">Cité Riadh, 4023 Sousse, Tunisie</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a 
                      href="mailto:contact@uss.tn" 
                      className="text-sm text-gray-600 hover:text-[#2B61D6] transition-colors"
                    >
                      contact@uss.tn
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Téléphone</p>
                    <a 
                      href="tel:+21673366700" 
                      className="text-sm text-gray-600 hover:text-[#2B61D6] transition-colors"
                    >
                      +216 73 366 700
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="lg:col-span-1">
              <h4 className="text-sm font-semibold text-[#0A1A3A] mb-3 uppercase tracking-wide">
                Navigation
              </h4>
              <div className="space-y-1.5">
                {[
                  { href: '/apropos', label: 'À propos' },
                  { href: '/consultants', label: 'Consultants' },
                  { href: '/institutions', label: 'Institutions' },
                  { href: '/dashboard', label: 'Dashboard' }
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-gray-600 hover:text-[#2B61D6] transition-colors py-0.5"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Bottom Bar - Hero Blue */}
  <div className="bg-hero-gradient text-white py-3 border-t border-white/10 shadow-[0_-6px_16px_rgba(10,26,58,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:justify-between gap-2">
            {/* Left: Year + Brand */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] sm:text-xs text-white/80">© {new Date().getFullYear()}</span>
              <span className="text-[12px] sm:text-sm text-white  tracking-wide">PROJET WE4LEAD</span>
            </div>

            {/* Right: Institution + Rights (consistent casing) */}
            <div className="flex items-center gap-3 text-[11px] sm:text-xs text-white/80">
              <span className="hidden md:inline-block text-white/60">•</span>
              <span className="font-light normal-case">Université de Sousse</span>
              <span className="text-white/60">•</span>
              <span className="font-light normal-case text-white/80">Tous droits réservés</span>
            </div>
          </div>
        </div>
      </div>
      
    </footer>
  )
}
