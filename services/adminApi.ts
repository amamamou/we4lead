export interface Medecin {
  id?: string
  nom: string
  prenom: string
  email: string
  telephone: string
}

const BASE_URL = '/admin/medecins'

export async function fetchMedecins(): Promise<Medecin[]> {
  const res = await fetch(BASE_URL)
  if (!res.ok) throw new Error('Failed to fetch medecins')
  return res.json()
}

export async function createMedecin(data: Medecin): Promise<Medecin> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed to create medecin')
  return res.json()
}

export async function updateMedecin(id: string, data: Medecin): Promise<Medecin> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) throw new Error('Failed to update medecin')
  return res.json()
}

export async function deleteMedecin(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Failed to delete medecin')
}
