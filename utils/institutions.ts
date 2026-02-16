// utils/institutions.ts

export interface University {
  id: number
  nom: string
  code: string
  adresse: string | null
  telephone: string | null
  nbEtudiants: number | null
  consultationsAvailable?: number
  horaire: string | null
  specializations?: string[]
  logoPath: string | null
}

/* ---------- BASIC LIST ---------- */
export async function fetchUniversities(): Promise<University[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/users/universites`
    )

    if (!res.ok) throw new Error('Failed to fetch universities')

    return await res.json()
  } catch (err) {
    console.error('fetchUniversities:', err)
    return []
  }
}

/* ---------- WITH DOCTORS ---------- */
export async function fetchUniversitiesWithDoctors(): Promise<University[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/public/users/universites/with-doctors`
    )

    if (!res.ok) throw new Error('Failed to fetch universities with doctors')

    return await res.json()
  } catch (err) {
    console.error('fetchUniversitiesWithDoctors:', err)
    return []
  }
}
