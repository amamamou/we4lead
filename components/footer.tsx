import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    // use the same hero background utility to keep visuals consistent
    <footer className="bg-hero-gradient text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logos Section */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="flex items-center gap-6">
              {/* wrap images in a small white rounded box so logos keep correct contrast */}
              <div className="bg-white rounded p-1">
                <Image
                  src="/universitedesousse.png"
                  alt="Université de Sousse"
                  width={160}
                  height={68}
                  className="object-contain h-12 md:h-14 w-auto"
                />
              </div>

              <div className="bg-white rounded p-1">
                <Image
                  src="/we4lead.png"
                  alt="WE4LEAD"
                  width={160}
                  height={68}
                  className="object-contain h-12 md:h-14 w-auto"
                />
              </div>
            </div>

            <p className="text-sm text-white/80 text-center md:text-left mt-2">
              Projet WE4LEAD - Women Empowerment for Leadership
            </p>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-center md:justify-start gap-2 text-sm text-white/80">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>Université de Sousse, Sousse, Tunisie</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-sm text-white/80">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+216 73 XXX XXX</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2 text-sm text-white/80">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>contact@uss.tn</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4">Liens Utiles</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                  À propos du projet WE4LEAD
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                  Université de Sousse
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                  Services aux étudiants
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-white/80 hover:text-white transition-colors">
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Projet WE4LEAD - Université de Sousse. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
