"use client"

import React, { useEffect, useState } from 'react'
import { Stethoscope, CheckCircle } from '@/components/ui/icons'
import { Users, Grid, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import CommunityHighlights from '../sections/CommunityHighlights'
import { Button } from '@/components/ui/button'
import { fetchMedecins, Medecin } from '@/services/adminApi'
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  // CardTitle and CardDescription were not needed for StatCard; removed to avoid unused imports
} from '@/components/ui/card'


interface StatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
  loading?: boolean
}

function StatCard({ label, value, icon, loading = false }: StatCardProps) {
  return (
    <motion.div whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
      <Card className="overflow-hidden rounded-3xl border-2  transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            {loading ? (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                {icon}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pb-2">
          {loading ? (
            <div className="space-y-2">
              <div className="h-6 w-20 bg-gray-100 rounded" />
              <div className="h-3 w-28 bg-gray-100 rounded" />
            </div>
          ) : (
            <>
              <CardTitle className="text-lg">{value}</CardTitle>
              <CardDescription>{label}</CardDescription>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// DotLoader removed — skeleton placeholders are used instead for demandes loading
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

interface DashboardStats {
  nombreDemandes?: number
  nombreUniversites?: number
  nombreMedecins?: number
  nombreEtudiants?: number
  dernieresDemandes?: Demande[]
}

interface OverviewTabProps {
  onNavigate?: (tab: string) => void
}

export default function OverviewTab({ onNavigate }: OverviewTabProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
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
    if (onNavigate) onNavigate(tab)
  }

  // community highlights: prefer real medecins list from the admin API, fallback to sample posts
  const [medecins, setMedecins] = useState<Medecin[]>([])

  useEffect(() => {
    let mounted = true

    const loadMedecins = async () => {
      try {
        // try sessionStorage cache first to avoid refetching on every mount
        const cacheKey = 'medecinsCache'
        const raw = sessionStorage.getItem(cacheKey)
        const now = Date.now()
        const ttl = 5 * 60 * 1000 // 5 minutes

        if (raw) {
          try {
            const parsed = JSON.parse(raw)
            if (parsed?.ts && (now - parsed.ts) < ttl && Array.isArray(parsed.data)) {
              if (mounted) setMedecins(parsed.data)
              return
            }
          } catch {
            // ignore JSON parse errors and refetch
          }
        }

        const data = await fetchMedecins()
        if (mounted && Array.isArray(data)) {
          setMedecins(data)
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify({ ts: now, data }))
          } catch {
            // ignore storage errors
          }
        }
      } catch (err) {
        console.error('Failed to load medecins for community highlights:', err)
      }
    }

    loadMedecins()

    return () => { mounted = false }
  }, [])

  const communityPosts = medecins && medecins.length > 0
    ? medecins.map((m) => ({
        title: `${m.prenom} ${m.nom}`,
        author: m.specialite || 'Médecin',
        likes: Math.floor(Math.random() * 60) + 1, // lightweight visual metric
        comments: Math.floor(Math.random() * 8),
        // backend may return a photo URL under different keys; try `photoUrl` then fallback
        image: (m as Medecin & { photoUrl?: string }).photoUrl || '/placeholder.svg',
        id: m.id || `${m.prenom}-${m.nom}`,
        time: '—',
      }))
    : []

  const defaultStats = {
    demandes: stats?.nombreDemandes || 0,
    universites: stats?.nombreUniversites || 0,
    medecins: stats?.nombreMedecins || 0,
    etudiants: stats?.nombreEtudiants || 0
  }

  const displayStats = stats ? {
    universites: stats.nombreUniversites,
    medecins: stats.nombreMedecins,
    etudiants: stats.nombreEtudiants,
    demandes: stats.nombreDemandes
  } : defaultStats

  const labelsMap: Record<string, string> = {
    universites: 'Institutions',
    etudiants: 'Utilisateurs',
    medecins: 'Médecins',
    Users: 'Utilisateurs',
    demandes: 'Demandes',
    completed: 'Terminés'
  }

  // Note: do not return early while loading — render the full layout so
  // stat cards, community highlights and other sections keep their place
  // and get populated when data arrives. The UI will use default/empty
  // values until `stats` / `medecins` are loaded.

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
        <h1 className="text-2xl font-semibold text-gray-800">
Overview
        </h1>
        <p className="text-black/60 text-sm mt-2">Gérer toutes les institutions, médecins, utilisateurs et demandes</p>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(displayStats).map(([key, value]) => {
          const label = labelsMap[key] ?? (key.charAt(0).toUpperCase() + key.slice(1))

          const icon = (() => {
            switch (key) {
              case 'medecins':
                return <Stethoscope className="w-5 h-5 text-emerald-500" />
              case 'etudiants':
                return <Users className="w-5 h-5 text-sky-500" />
              case 'demandes':
                return <FileText className="w-5 h-5 text-rose-500" />
              case 'universites':
                return <Grid className="w-5 h-5 text-violet-500" />
              case 'completed':
                return <CheckCircle className="w-5 h-5 text-green-500" />
              default:
                return <CheckCircle className="w-5 h-5 text-gray-500" />
            }
          })()

          return (
            <StatCard key={key} label={label} value={value ?? 0} icon={icon} loading={loading} />
          )
        })}
      </div>

   
        {/* Community highlights section */}
  <CommunityHighlights communityPosts={communityPosts} onViewAll={() => handleNavigate('doctors')} />
<div className="mt-8 space-y-4">

  {/* Section Header (outside card) */}
  <div className="flex items-center justify-between">
    <h2 className="text-xl font-semibold text-gray-800">
      Demandes récentes
    </h2>

    {(
      <Button size="sm" variant="ghost" className="text-sm" onClick={() => handleNavigate('demandes')}>
        Voir tout
      </Button>
    )}
  </div>

  {/* Card */}
  <div className="rounded-3xl border-2 border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">

    <div className="space-y-2">
      {dernieresDemandes && dernieresDemandes.length > 0 ? (
        dernieresDemandes.slice(0, 5).map((demande) => (
          <div
            key={demande.id}
            className="group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-200 hover:bg-gray-50 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#F9FAFB]">
                <FileText className="w-4 h-4 text-rose-500" />
              </div>

              <div className="flex flex-col">
                <p className="text-sm font-medium text-black">
                  {demande.typeSituation}
                </p>
                <p className="text-sm text-black/70">
                  {demande.etudiantPrenom} {demande.etudiantNom}
                </p>
                <p className="text-xs text-black/40">
                  {demande.universiteNom}
                </p>
              </div>
            </div>

            <p className="text-xs text-black/40 whitespace-nowrap">
              {getRelativeTime(demande.dateCreation)}
            </p>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          {loading ? (
            <div className="space-y-2 w-full" aria-busy="true">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-200 bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gray-100" />

                    <div className="flex flex-col">
                      <div className="h-4 bg-gray-100 rounded w-40 mb-2 animate-pulse" />
                      <div className="h-3 bg-gray-100 rounded w-32 mb-2 animate-pulse" />
                      <div className="h-3 bg-gray-100 rounded w-24 animate-pulse" />
                    </div>
                  </div>

                  <div className="h-3 bg-gray-100 rounded w-12 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <p className="text-sm text-black/50">Aucune demande récente</p>
              <p className="text-xs text-black/30 mt-1">Les nouvelles demandes apparaîtront ici.</p>
            </div>
          )}
        </div>
      )}
    </div>

  </div>
</div>
    </div>
  )
}
