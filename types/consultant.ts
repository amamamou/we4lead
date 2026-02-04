// Shared types for consultants

interface SessionType {
  type: string
  duration: string
}

interface Review {
  id: number
  author: string
  rating: number
  date: string
  comment: string
}

export interface Consultant {
  id: number
  name: string
  title: string
  institution: string
  institutionCode: string
  specializations: string[]
  availability: 'Disponible' | 'Occupé'
  availableDays: string[]
  nextSlot: string
  rating: number
  reviewsCount: number
  experience: string
  consultationsCount: number
  image: string
  slug?: string
  description?: string
  languages?: string[]
  sessionTypes?: SessionType[]
  qualifications?: string[]
  workingHours?: Record<string, string[]>
  reviews?: Review[]
}