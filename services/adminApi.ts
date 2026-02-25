export interface Medecin {
  id?: string
  nom: string
  prenom: string
  email: string
  telephone?: string
  universiteIds?: number[]
  specialite?: string
  genre?: 'HOMME' | 'FEMME' | string
  situation?: string
  photoFile?: File // Ajout pour l'upload
}

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/medecins`

export async function fetchMedecins(): Promise<Medecin[]> {
  const token = localStorage.getItem('supabaseAccessToken')
  const res = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if (!res.ok) throw new Error('Failed to fetch medecins')
  return res.json()
}

export async function createMedecin(data: Medecin, photoFile?: File): Promise<Medecin> {
  const token = localStorage.getItem('supabaseAccessToken')
  const formData = new FormData()
  
  // Ajouter tous les champs texte
  formData.append('nom', data.nom)
  formData.append('prenom', data.prenom)
  formData.append('email', data.email)
  if (data.telephone) formData.append('telephone', data.telephone)
  if (data.specialite) formData.append('specialite', data.specialite)
  if (data.genre) formData.append('genre', data.genre)
  if (data.situation) formData.append('situation', data.situation)
  
  // Ajouter les universités (en JSON)
  if (data.universiteIds && data.universiteIds.length > 0) {
    formData.append('universiteIds', JSON.stringify(data.universiteIds))
  }
  
  // Ajouter la photo si présente
  if (photoFile) {
    formData.append('photo', photoFile)
  }

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
      // Ne PAS mettre Content-Type, le navigateur le définira automatiquement
    },
    body: formData
  })
  
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || 'Failed to create medecin')
  }
  return res.json()
}

export async function updateMedecin(id: string, data: Medecin, photoFile?: File): Promise<Medecin> {
  const token = localStorage.getItem('supabaseAccessToken')
  const formData = new FormData()
  
  // Ajouter tous les champs texte
  if (data.nom) formData.append('nom', data.nom)
  if (data.prenom) formData.append('prenom', data.prenom)
  if (data.email) formData.append('email', data.email)
  if (data.telephone) formData.append('telephone', data.telephone)
  if (data.specialite) formData.append('specialite', data.specialite)
  if (data.genre) formData.append('genre', data.genre)
  if (data.situation) formData.append('situation', data.situation)
  
  // Ajouter les universités (en JSON)
  if (data.universiteIds && data.universiteIds.length > 0) {
    formData.append('universiteIds', JSON.stringify(data.universiteIds))
  }
  
  // Ajouter la photo si présente
  if (photoFile) {
    formData.append('photo', photoFile)
  }

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  })
  
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || 'Failed to update medecin')
  }
  return res.json()
}

export async function deleteMedecin(id: string): Promise<void> {
  const token = localStorage.getItem('supabaseAccessToken')
  const res = await fetch(`${BASE_URL}/${id}`, { 
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if (!res.ok) throw new Error('Failed to delete medecin')
}