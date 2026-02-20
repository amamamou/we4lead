const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'

export function normalizeLogo(logo?: string | null) {
  // Fallback placeholder in the public folder
  const fallback = '/images/university-placeholder.png'

  if (!logo) return fallback

  // Already absolute
  if (logo.startsWith('http')) return logo

  // Backend returned an absolute path like `/universites/logos/logo.png`
  if (logo.startsWith('/')) return `${BACKEND}${logo}`

  // Bare filename like `logo.png`
  return `${BACKEND}/universites/logos/${logo}`
}

export default normalizeLogo
