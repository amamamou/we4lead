'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MapPin, Calendar, ChevronDown } from 'lucide-react'

type TabType = 'dashboard' | 'profile' | 'institution' | 'consultants'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [openSpecializations, setOpenSpecializations] = useState<{[key: number]: boolean}>({})

  const toggleSpecializations = (consultantId: number) => {
    setOpenSpecializations(prev => ({
      ...prev,
      [consultantId]: !prev[consultantId]
    }))
  }

  return (
    <main className="bg-white">
      <Header />

      {/* ================= HERO ================= */}
      <section className="pt-20 pb-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Bienvenue, John Doe
              </h1>
              <div className="text-gray-600">
                <span>Université de Sousse • Master 2 Informatique</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Dernière connexion</p>
                <p className="font-medium text-gray-900">3 Février 2026</p>
              </div>
             
            </div>
          </div>
        </div>
      </section>

      {/* ================= TAB NAVIGATION ================= */}
      <section className="border-b border-gray-100 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-4 rounded-t-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'dashboard'
                  ? 'bg-white text-[#0A1A3A] shadow-sm border-t-2 border-[#0A1A3A]'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-4 rounded-t-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'profile'
                  ? 'bg-white text-[#0A1A3A] shadow-sm border-t-2 border-[#0A1A3A]'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Profil
            </button>
            <button
              onClick={() => setActiveTab('institution')}
              className={`px-6 py-4 rounded-t-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'institution'
                  ? 'bg-white text-[#0A1A3A] shadow-sm border-t-2 border-[#0A1A3A]'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Institution
            </button>
            <button
              onClick={() => setActiveTab('consultants')}
              className={`px-6 py-4 rounded-t-xl font-medium text-sm transition-all duration-300 ${
                activeTab === 'consultants'
                  ? 'bg-white text-[#0A1A3A] shadow-sm border-t-2 border-[#0A1A3A]'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Consultants
            </button>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* Tab Content */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">+12%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">3</h3>
                  <p className="text-sm text-gray-500 font-medium">Consultations</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 7v8a3 3 0 01-3 3H6a3 3 0 01-3-3v-1M2 17h20" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">2 cette semaine</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">2</h3>
                  <p className="text-sm text-gray-500 font-medium">RDV à venir</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Actif</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">5</h3>
                  <p className="text-sm text-gray-500 font-medium">Consultants</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-full">US</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">1</h3>
                  <p className="text-sm text-gray-500 font-medium">Institution</p>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Left Column - Activity */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Upcoming Appointments */}
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Prochains rendez-vous</h2>
                        <p className="text-gray-500">Vos consultations à venir</p>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        Voir tout
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-700 text-sm font-bold">SM</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">Dr. Sarah Martin</h4>
                          <p className="text-sm text-gray-600">5 Février à 10:00</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            <span className="w-2 h-2 bg-gray-600 rounded-full mr-2"></span>
                            Confirmé
                          </span>
                          <p className="text-xs text-gray-500 mt-1">Dans 2 jours</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-700 text-sm font-bold">AB</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">Prof. Ahmed Bennani</h4>
                          <p className="text-sm text-gray-600">7 Février à 14:30</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                            <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                            En attente
                          </span>
                          <p className="text-xs text-gray-500 mt-1">Dans 4 jours</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Timeline */}
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-8">Activité récente</h2>
                    
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Consultation terminée</h4>
                          <p className="text-sm text-gray-600">avec Dr. Marie Dubois</p>
                          <p className="text-xs text-gray-500 mt-1">30 janvier • Il y a 4 jours</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">RDV confirmé</h4>
                          <p className="text-sm text-gray-600">avec Dr. Sarah Martin</p>
                          <p className="text-xs text-gray-500 mt-1">29 janvier • Il y a 5 jours</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Profil mis à jour</h4>
                          <p className="text-sm text-gray-600">Informations académiques</p>
                          <p className="text-xs text-gray-500 mt-1">25 janvier • Il y a 9 jours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Quick Actions & Progress */}
                <div className="space-y-8">
                  
                  {/* Quick Actions */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Actions rapides</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Nouveau RDV</p>
                          <p className="text-xs text-gray-500">Réserver une consultation</p>
                        </div>
                      </button>

                      <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Trouver un consultant</p>
                          <p className="text-xs text-gray-500">Parcourir les profils</p>
                        </div>
                      </button>

                      <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">Mon profil</p>
                          <p className="text-xs text-gray-500">Mettre à jour mes infos</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Progress Card */}
                  <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">Progression</h3>
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2 text-gray-600">
                          <span>Consultations ce mois</span>
                          <span>3/5</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-gray-600 h-2 rounded-full" style={{width: '60%'}}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2 text-gray-600">
                          <span>Objectifs atteints</span>
                          <span>2/3</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-gray-600 h-2 rounded-full" style={{width: '67%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Satisfaction Score */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6">Satisfaction</h3>
                    <div className="text-center">
                      <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-gray-600" style={{clipPath: 'polygon(0 0, 90% 0, 90% 90%, 0 90%)'}}></div>
                        <span className="text-2xl font-bold text-gray-900">4.8</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Note moyenne</p>
                      <p className="text-xs text-gray-500">Basé sur 3 consultations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-16">
              
              <div>
                <h2 className="text-2xl font-medium text-[#0A1A3A] mb-10">Informations personnelles</h2>
                <div className="grid lg:grid-cols-3 gap-12">
                  
                  <div className="lg:col-span-1">
                    <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                      <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-6">
                        <span className="text-gray-700 text-2xl font-semibold">JD</span>
                      </div>
                      <h4 className="text-xl font-semibold text-[#0A1A3A] mb-2">John Doe</h4>
                      <p className="text-gray-600 text-sm mb-1">Master 2 - Informatique</p>
                      <p className="text-gray-500 text-sm mb-4">Université de Sousse</p>
                      <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200">
                        Compte actif
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white border border-gray-200 rounded-xl p-8">
                      <h5 className="font-semibold text-[#0A1A3A] mb-6">Informations de base</h5>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label>Prénom</Label>
                          <Input defaultValue="John" className="mt-2" readOnly />
                        </div>
                        <div>
                          <Label>Nom</Label>
                          <Input defaultValue="Doe" className="mt-2" readOnly />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input defaultValue="john.doe@student.us.tn" className="mt-2" readOnly />
                        </div>
                        <div>
                          <Label>Téléphone</Label>
                          <Input defaultValue="+216 23 456 789" className="mt-2" readOnly />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-8">
                      <h5 className="font-semibold text-[#0A1A3A] mb-6">À propos</h5>
                      <Textarea 
                        defaultValue="Étudiant en Master 2 Informatique de Gestion à l'Université de Sousse. Passionné par le développement web et les nouvelles technologies."
                        rows={4}
                        className="resize-none"
                        readOnly
                      />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}

          {activeTab === 'institution' && (
            <div className="space-y-16">
              
              <div>
                <h2 className="text-2xl font-medium text-[#0A1A3A] mb-10">Mon institution</h2>
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                  <div className="flex items-center gap-8">
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-700 text-2xl font-bold">US</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-[#0A1A3A] mb-2">Université de Sousse</h4>
                      <p className="text-gray-600 mb-1">Faculté des Sciences Économiques</p>
                      <p className="text-sm text-gray-500">Sousse, Tunisie</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-[#0A1A3A] mb-10">Statistiques de l&apos;institution</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-.5a2.121 2.121 0 11-3 3 2.121 2.121 0 013-3z" />
                      </svg>
                    </div>
                    <p className="text-2xl font-semibold text-[#0A1A3A] mb-2">12,000+</p>
                    <p className="text-sm text-gray-500">Étudiants</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-2xl font-semibold text-[#0A1A3A] mb-2">750+</p>
                    <p className="text-sm text-gray-500">Professeurs</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <p className="text-2xl font-semibold text-[#0A1A3A] mb-2">12</p>
                    <p className="text-sm text-gray-500">Facultés</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-medium text-[#0A1A3A] mb-10">Facultés et Départements</h2>
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                  <div className="grid md:grid-cols-2 gap-8 text-gray-600 leading-relaxed">
                    <div className="space-y-3">
                      <p className="font-medium text-[#0A1A3A]">Sciences Économiques et de Gestion</p>
                      <p className="font-medium text-[#0A1A3A]">Sciences et Techniques</p>
                      <p className="font-medium text-[#0A1A3A]">Médecine</p>
                      <p className="font-medium text-[#0A1A3A]">Lettres et Sciences Humaines</p>
                      <p className="font-medium text-[#0A1A3A]">Droit</p>
                      <p className="font-medium text-[#0A1A3A]">Sciences Agronomiques</p>
                    </div>
                    <div className="space-y-3">
                      <p className="font-medium text-[#0A1A3A]">Pharmacie</p>
                      <p className="font-medium text-[#0A1A3A]">Médecine Dentaire</p>
                      <p className="font-medium text-[#0A1A3A]">Sciences Infirmières</p>
                      <p className="font-medium text-[#0A1A3A]">Architecture</p>
                      <p className="font-medium text-[#0A1A3A]">Arts et Métiers</p>
                      <p className="font-medium text-[#0A1A3A]">Sciences du Sport</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'consultants' && (
            <div className="space-y-16">
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-medium text-[#0A1A3A] mb-2">Consultants de l&apos;institution</h2>
                  <p className="text-gray-600">5 consultants disponibles pour vous accompagner</p>
                </div>
                <button className="text-gray-700 font-medium underline hover:text-gray-900 transition-colors">
                  Voir tous les consultants
                </button>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[
                  {
                    id: 1,
                    name: 'Dr. Amira Ben Salem',
                    title: 'Psychologue Clinicienne',
                    institution: 'Faculté de Médecine de Sousse',
                    institutionCode: 'FMS',
                    specializations: ['Psychologie Clinique', 'Thérapie Cognitive', 'Anxiété'],
                    availability: 'Disponible',
                    availableDays: ['Lundi', 'Mardi', 'Jeudi'],
                    nextSlot: '15 Février 2026',
                    rating: 4.9,
                    reviewsCount: 156,
                    experience: '8 ans',
                    consultationsCount: 450,
                    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&face'
                  },
                  {
                    id: 2,
                    name: 'M. Sami Mansour',
                    title: 'Thérapeute Cognitif',
                    institution: 'Faculté de Médecine de Sousse',
                    institutionCode: 'FMS',
                    specializations: ['Thérapie Cognitive', 'Dépression', 'Stress Académique'],
                    availability: 'Occupé',
                    availableDays: ['Mercredi', 'Vendredi'],
                    nextSlot: '20 Février 2026',
                    rating: 4.7,
                    reviewsCount: 89,
                    experience: '6 ans',
                    consultationsCount: 320,
                    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&face'
                  },
                  {
                    id: 3,
                    name: 'Dr. Leila Trabelsi',
                    title: 'Psychologue du Travail',
                    institution: 'Faculté des Sciences Économiques et de Gestion',
                    institutionCode: 'FSEG',
                    specializations: ['Psychologie du Travail', 'Orientation Professionnelle', 'Burn-out'],
                    availability: 'Disponible',
                    availableDays: ['Lundi', 'Mercredi', 'Vendredi'],
                    nextSlot: '14 Février 2026',
                    rating: 4.8,
                    reviewsCount: 203,
                    experience: '10 ans',
                    consultationsCount: 680,
                    image: 'https://images.unsplash.com/photo-1594824919066-63ffc0e8324a?w=300&h=300&fit=crop&face'
                  },
                  {
                    id: 4,
                    name: 'M. Ahmed Kraiem',
                    title: 'Psychologue Social',
                    institution: 'Faculté de Droit et des Sciences Politiques',
                    institutionCode: 'FDSP',
                    specializations: ['Psychologie Sociale', 'Médiation', 'Communication'],
                    availability: 'Disponible',
                    availableDays: ['Mardi', 'Jeudi', 'Samedi'],
                    nextSlot: '16 Février 2026',
                    rating: 4.6,
                    reviewsCount: 142,
                    experience: '7 ans',
                    consultationsCount: 380,
                    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop&face'
                  },
                  {
                    id: 5,
                    name: 'Dr. Nadia Khemiri',
                    title: 'Spécialiste Addiction Numérique',
                    institution: 'Institut Supérieur d\'Informatique et de Multimédia',
                    institutionCode: 'ISIMS',
                    specializations: ['Addiction aux Écrans', 'Psychologie Numérique', 'Détox Digitale'],
                    availability: 'Disponible',
                    availableDays: ['Lundi', 'Mardi', 'Mercredi', 'Vendredi'],
                    nextSlot: '13 Février 2026',
                    rating: 4.9,
                    reviewsCount: 178,
                    experience: '5 ans',
                    consultationsCount: 290,
                    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300&h=300&fit=crop&face'
                  }
                ].map((consultant) => (
                  <div key={consultant.id} className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-700 group h-[520px] flex flex-col">
                    
                    {/* Background Image on Hover */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transform scale-105 opacity-0 group-hover:opacity-25 group-hover:scale-100 transition-all duration-700 ease-out z-0"
                      style={{ backgroundImage: `url(${consultant.image})` }}
                    ></div>
                    
                    {/* Card Content */}
                    <div className="relative z-10 p-6 group-hover:bg-white/90 transition-all duration-700 ease-in-out flex flex-col h-full">
                      <div className="flex items-start gap-4 mb-4">
                        {/* Avatar */}
                        <Avatar className="w-20 h-20 border-2 border-gray-100 group-hover:border-gray-200 transition-colors duration-300">
                          <AvatarImage src={consultant.image} alt={consultant.name} />
                          <AvatarFallback className="bg-gray-100 text-gray-600 text-xl font-semibold">
                            {consultant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        {/* Basic Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-lg mb-1">
                            {consultant.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">{consultant.title}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                              {consultant.institutionCode}
                            </span>
                          </div>
                        </div>
                        
                        {/* Availability Badge */}
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          consultant.availability === 'Disponible' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {consultant.availability}
                        </div>
                      </div>

                      {/* Institution */}
                      <div className="flex items-center text-gray-600 text-sm mb-4">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{consultant.institution}</span>
                      </div>

                      {/* Specializations */}
                      <div className="mb-4">
                        <div className="relative">
                          {/* Show first specialization + dropdown */}
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                              {consultant.specializations[0]}
                            </span>
                            {consultant.specializations.length > 1 && (
                              <div className="relative">
                                <button 
                                  onClick={() => toggleSpecializations(consultant.id)}
                                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1 hover:bg-gray-200 transition-colors duration-200"
                                >
                                  +{consultant.specializations.length - 1}
                                  <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${openSpecializations[consultant.id] ? 'rotate-180' : ''}`} />
                                </button>
                                
                                {/* Dropdown */}
                                {openSpecializations[consultant.id] && (
                                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                                    <div className="p-2 space-y-1">
                                      {consultant.specializations.slice(1).map((spec, index) => (
                                        <div key={index} className="px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 rounded">
                                          {spec}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick Info */}
                      <div className="grid grid-cols-2 gap-4 mb-4 py-3 px-4 bg-gray-50 rounded-xl">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">{consultant.availableDays.length}</div>
                          <div className="text-xs text-gray-500">Jours/semaine</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-gray-900">
                            {consultant.availability === 'Disponible' ? 'Ouvert' : 'Complet'}
                          </div>
                          <div className="text-xs text-gray-500">Statut</div>
                        </div>
                      </div>

                      {/* Next Available */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Prochain créneau:</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{consultant.nextSlot}</span>
                      </div>

                      {/* Available Days */}
                      <div className="mb-6">
                        <div className="text-sm text-gray-600 mb-2">Jours disponibles:</div>
                        <div className="flex flex-wrap gap-1">
                          {consultant.availableDays.map((day, index) => (
                            <span key={index} className="px-2 py-1 bg-[#2B61D6]/10 text-[#2B61D6] text-xs rounded-full">
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Spacer to push button to bottom */}
                      <div className="flex-grow"></div>

                      {/* Action Button */}
                      <button 
                        onClick={() => window.location.href = `/consultants/${consultant.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`}
                        className="w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200 flex items-center justify-center group mt-auto"
                      >
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        Voir Profil & Réserver
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  )
}