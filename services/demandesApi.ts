import type { CreateDemandePayload, Demande } from '../types/demande'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
const BASE = `${BACKEND_URL}/demandes`

async function handleJsonResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed with status ${res.status}`)
  }
  return res.json()
}

/**
 * Create a public demande (POST /demandes/public)
 */
export async function createDemandePublic(
  data: CreateDemandePayload
): Promise<Demande> {
  const res = await fetch(`${BASE}/public`, {
    method: 'POST',
    // Only send Content-Type header as requested. Do not include Authorization.
    headers: { 'Content-Type': 'application/json' },
    // Ensure the request does not send cookies or other credentials.
    credentials: 'omit',
    body: JSON.stringify(data)
  })
  return handleJsonResponse<Demande>(res)
}

export async function getAllDemandes(): Promise<Demande[]> {
  const res = await fetch(`${BASE}/all`)
  return handleJsonResponse<Demande[]>(res)
}

export async function getDemandeById(id: string | number): Promise<Demande> {
  const res = await fetch(`${BASE}/${id}`)
  return handleJsonResponse<Demande>(res)
}

export async function getDemandesByEtudiant(email: string): Promise<Demande[]> {
  const res = await fetch(`${BASE}/etudiant/${encodeURIComponent(email)}`)
  return handleJsonResponse<Demande[]>(res)
}

export async function getDemandesByMedecin(medecinId: string): Promise<Demande[]> {
  const res = await fetch(`${BASE}/medecin/${medecinId}`)
  return handleJsonResponse<Demande[]>(res)
}

export async function getDemandesByMedecinAndUniversite(
  medecinId: string,
  universiteId: string | number
): Promise<Demande[]> {
  const res = await fetch(
    `${BASE}/medecin/${medecinId}/universite/${universiteId}`
  )
  return handleJsonResponse<Demande[]>(res)
}

export async function getDemandesByUniversite(
  universiteId: string | number
): Promise<Demande[]> {
  const res = await fetch(`${BASE}/universite/${universiteId}`)
  return handleJsonResponse<Demande[]>(res)
}

export async function getDemandesByType(typeSituation: string): Promise<Demande[]> {
  const res = await fetch(`${BASE}/type/${encodeURIComponent(typeSituation)}`)
  return handleJsonResponse<Demande[]>(res)
}

export async function getDemandesByPeriode(periode: string): Promise<Demande[]> {
  const res = await fetch(`${BASE}/periode/${encodeURIComponent(periode)}`)
  return handleJsonResponse<Demande[]>(res)
}

export async function deleteDemande(id: string | number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Failed to delete demande ${id}`)
  }
}

/** Example usage:
 *
 * import { createDemandePublic, getAllDemandes } from '@/services/demandesApi'
 *
 * await createDemandePublic({
 *   typeSituation: 'HARCÈLEMENT',
 *   description: 'Description...',
 *   email: 'ksontiniahmed369@gmail.com',
 *   nom: 'Martin',
 *   prenom: 'Sophie',
 *   universiteId: 1
 * })
 */

const demandesApi = {
  createDemandePublic,
  getAllDemandes,
  getDemandeById,
  getDemandesByEtudiant,
  getDemandesByMedecin,
  getDemandesByMedecinAndUniversite,
  getDemandesByUniversite,
  getDemandesByType,
  getDemandesByPeriode,
  deleteDemande
}

export default demandesApi
