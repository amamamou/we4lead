/* eslint-disable react/no-unescaped-entities */
'use client'

import { Shield, Users, Smartphone, ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
  <section className="bg-hero-gradient text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full border border-white/30">
            {/* small status dot — now animated with .blink-dot for a professional infinite blink */}
            <div
              className="w-2 h-2 bg-white rounded-full blink-dot"
              aria-hidden="true"
            />
            <span className="text-sm font-medium text-white">Portal de Consultation Universitaire</span>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6 leading-tight">
          Votre Bien-être, Notre Priorité
        </h1>

        {/* Description */}
        <p className="text-center text-white/90 mb-10 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          Accédez facilement à des consultations psychologiques gratuites et confidentielles. Le projet WEALEAD soutient la santé mentale des
          étudiants de l'Université de Sousse.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button
            className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition flex items-center gap-3 group"
            aria-label="Trouver un Consultant"
          >
            <span>Trouver un Consultant</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition">
            En Savoir Plus
          </button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">100% Confidentiel</h3>
            <p className="text-white/80 text-sm">
              Vos échanges avec les psychologues sont strictement confidentiels et protégés.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Experts Qualifiés</h3>
            <p className="text-white/80 text-sm">
              Une équipe de psychologues professionnels dotés à votre écoute et bien-être.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Accessible Partout</h3>
            <p className="text-white/80 text-sm">
              Prenez rendez-vous en ligne à tout moment, depuis votre smartphone ou ordinateur.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
