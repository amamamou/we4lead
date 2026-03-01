/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from "react"
import Image from 'next/image'
import { Stethoscope, Clock, CheckCircle, University, AlertTriangle } from '../ui/icons'
import { Users } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-black/60 font-medium">{label}</p>
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-[#F9FAFB]">
          <div className="text-gray-600">{icon}</div>
        </div>
      </div>
      <p className="text-3xl font-extrabold text-black">{value}</p>
    </div>
  )
}

interface InstituteInfo {
  id: number
  name: string
  admin?: string
  doctors?: number
  students?: number
  appointments?: number
  logo?: string
}

interface Demande {
  id: string
  typeSituation: string
  description: string
  lieuPrincipal?: string
  periode: string
  dateCreation: string
  medecinId?: string
  medecinNom?: string
  medecinPrenom?: string
  etudiantId: string
  etudiantNom: string
  etudiantPrenom: string
  universiteId: number
  universiteNom: string
}

interface AdminOverviewProps {
  isSuperAdmin?: boolean
  institute?: InstituteInfo | undefined
  onNavigate?: (tab: string) => void
}

export function AdminOverview({ isSuperAdmin = false, institute, onNavigate }: AdminOverviewProps) {
  const [stats, setStats] = useState<any>(null)
  const [dernieresDemandes, setDernieresDemandes] = useState<Demande[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('supabaseAccessToken')
        
        if (!token) {
          setError('Token manquant')
          return
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/stats/dashboard`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!res.ok) {
          throw new Error('Erreur lors du chargement des statistiques')
        }

        const data = await res.json()
        setStats(data)
        setDernieresDemandes(data.dernieresDemandes || [])
      } catch (err) {
        console.error('Erreur:', err)
        setError('Impossible de charger les statistiques')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "à l'instant"
    if (diffMins < 60) return `il y a ${diffMins} min`
    if (diffHours < 24) return `il y a ${diffHours} h`
    return `il y a ${diffDays} j`
  }

  const handleNavigate = (tab: string) => {
    if (onNavigate) {
      onNavigate(tab)
    }
  }

  // Stats par défaut pendant le chargement
  const defaultStats = isSuperAdmin
    ? {
        demandes: stats?.nombreDemandes || 0,
        universites: stats?.nombreUniversites || 0,
        medecins: stats?.nombreMedecins || 0,
        etudiants: stats?.nombreEtudiants || 0
      }
    : {
        demandes: stats?.nombreDemandes || 0,
        medecins: stats?.nombreMedecins || 0,
        etudiants: stats?.nombreEtudiants || 0,
        completed: 0
      }

  const displayStats = stats ? {
    ...(isSuperAdmin ? {
      universites: stats.nombreUniversites,
      medecins: stats.nombreMedecins,
      etudiants: stats.nombreEtudiants,
      demandes: stats.nombreDemandes
    } : {
      medecins: stats.nombreMedecins,
      etudiants: stats.nombreEtudiants,
      demandes: stats.nombreDemandes,
      completed: 0
    })
  } : defaultStats

  // Labels en français
  const labelsMap: Record<string, string> = {
    universites: 'Institutions',
    medecins: 'Médecins',
    Users: 'Utilisateurs',
    demandes: 'Demandes',
    completed: 'Terminés'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>
          <p className="text-black/60 text-sm mt-2">Chargement des données...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-lg p-5 space-y-3 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>
          <p className="text-red-500 text-sm mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Overview</h1>
        <p className="text-black/60 text-sm mt-2">
          {isSuperAdmin ? 'Gérer toutes les institutions, médecins, étudiants et demandes' : 'Gérer votre établissement, les médecins, les étudiants et les demandes'}
        </p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(displayStats).map(([key, value]) => {
          const label = labelsMap[key] ?? (key.charAt(0).toUpperCase() + key.slice(1))

          const icon = (() => {
            switch (key) {
              case 'medecins':
                return <Stethoscope className="w-5 h-5" />
              case 'etudiants':
                return <Users className="w-5 h-5" />
              case 'demandes':
                return <AlertTriangle className="w-5 h-5" />
              case 'universites':
                return <University className="w-5 h-5" />
              case 'completed':
                return <CheckCircle className="w-5 h-5" />
              default:
                return <CheckCircle className="w-5 h-5" />
            }
          })()

          return (
            <StatCard key={key} label={label} value={value} icon={icon} />
          )
        })}
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Demandes récentes */}
        <div className="bg-white border border-gray-100 rounded-lg p-6">
          <h2 className="font-semibold text-black mb-4">Demandes récentes</h2>
          <div className="space-y-3">
            {dernieresDemandes && dernieresDemandes.length > 0 ? (
              dernieresDemandes.slice(0, 5).map((demande) => (
                <div key={demande.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div>
                    <p className="text-sm text-black/70">
                      {demande.typeSituation} - {demande.etudiantPrenom} {demande.etudiantNom}
                    </p>
                    <p className="text-xs text-black/40">{demande.universiteNom}</p>
                  </div>
                  <p className="text-xs text-black/40">{getRelativeTime(demande.dateCreation)}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Aucune demande récente</p>
            )}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="bg-white border border-gray-100 rounded-lg p-6">
          <h2 className="font-semibold text-black mb-4">Actions rapides</h2>
          <div className="space-y-2">
            <button 
              className="w-full px-4 py-2 text-left text-sm rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1" 
              style={{backgroundColor: '#020E68', color: '#FFFFFF', borderColor: '#020E68'}}
              onClick={() => handleNavigate('doctors')}
            >
              Ajouter un médecin
            </button>
            <button 
              className="w-full px-4 py-2 text-left text-sm border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
              onClick={() => handleNavigate('students')}
            >
              Gestion des utilisateurs
            </button>
            <button 
              className="w-full px-4 py-2 text-left text-sm border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
              onClick={() => handleNavigate('demandes')}
            >
              Voir les demandes
            </button>
            <button 
              className="w-full px-4 py-2 text-left text-sm border border-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors"
              onClick={() => handleNavigate('institutes')}
            >
              Consulter les instituts
            </button>
          </div>
        </div>
      </div>

      {/* Institute info for non-super admins */}
      {!isSuperAdmin && institute && (
        <div className="bg-white border border-gray-100 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-black mb-4">Informations sur l&apos;établissement</h2>

          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gray-50 rounded-md overflow-hidden flex items-center justify-center">
              <Image src={institute.logo ?? '/universitedesousse.png'} alt={institute.name} width={80} height={80} className="object-contain" />
            </div>

            <div className="flex-1">
              <p className="text-sm text-gray-500">Nom de l&apos;établissement</p>
              <p className="text-lg font-semibold text-black mt-1">{institute.name}</p>

              <div className="mt-3">
                <p className="text-sm text-gray-500">Université</p>
                <p className="text-sm text-black mt-1">Université de Sousse</p>
              </div>

              {stats?.nombreDemandes !== undefined && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500">Demandes en cours</p>
                  <p className="text-sm text-black mt-1">{stats.nombreDemandes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}