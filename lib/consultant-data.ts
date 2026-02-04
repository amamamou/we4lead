// Shared consultant data
import { Consultant } from '@/types/consultant'

export const consultants: Consultant[] = [
  {
    id: 1,
    name: 'Dr. Amira Ben Salem',
    slug: 'dr-amira-ben-salem',
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
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&face',
    description: 'Spécialisée dans la thérapie cognitive et comportementale, j&apos;aide les étudiants à surmonter l&apos;anxiété, la dépression et les troubles de l&apos;adaptation. Mon approche combine techniques traditionnelles et innovations numériques.',
    languages: ['Français', 'Arabe', 'Anglais'],
    sessionTypes: [
      { type: 'Consultation en personne', duration: '45 min' }
    ],
    qualifications: [
      'Doctorat en Psychologie Clinique - Université de Tunis',
      'Master en Thérapie Cognitive - Université Paris Descartes',
      'Certification en Thérapie EMDR',
      'Formation en Psychotrauma - Institut Français'
    ],
    workingHours: {
      'Lundi': ['09:00', '12:00', '14:00', '17:00'],
      'Mardi': ['08:30', '12:30', '13:30', '16:30'],
      'Mercredi': [],
      'Jeudi': ['09:00', '13:00', '14:00', '18:00'],
      'Vendredi': [],
      'Samedi': [],
      'Dimanche': []
    },
    reviews: [
      {
        id: 1,
        author: 'Sarah M.',
        rating: 5,
        date: '28 Janvier 2026',
        comment: 'Dr. Ben Salem m&apos;a énormément aidée avec mon anxiété. Ses techniques sont très efficaces et elle est très à l&apos;écoute.'
      },
      {
        id: 2,
        author: 'Ahmed K.',
        rating: 5,
        date: '20 Janvier 2026',
        comment: 'Excellente psychologue ! J&apos;ai pu surmonter mes difficultés d&apos;adaptation à l&apos;université grâce à son aide.'
      },
      {
        id: 3,
        author: 'Lina T.',
        rating: 4,
        date: '15 Janvier 2026',
        comment: 'Très professionnelle et empathique. Les séances en ligne sont très pratiques.'
      }
    ]
  },
  {
    id: 2,
    name: 'M. Sami Mansour',
    slug: 'm-sami-mansour',
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
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&face',
    description: 'Spécialisé dans la thérapie cognitive comportementale, j&apos;accompagne les étudiants dans la gestion du stress académique et des épisodes dépressifs. Mon approche est personnalisée selon les besoins de chaque individu.',
    languages: ['Français', 'Arabe'],
    sessionTypes: [
      { type: 'Consultation en personne', duration: '45 min'}
    ],
    qualifications: [
      'Master en Psychologie Clinique - Université de Sousse',
      'Certification en Thérapie Cognitive Comportementale',
      'Formation en Gestion du Stress - Centre Français de Formation',
      'Spécialisation en Psychologie de l&apos;Adolescent'
    ],
    workingHours: {
      'Lundi': [],
      'Mardi': [],
      'Mercredi': ['10:00', '13:00', '15:00', '18:00'],
      'Jeudi': [],
      'Vendredi': ['09:00', '12:00', '14:00', '17:00'],
      'Samedi': [],
      'Dimanche': []
    },
    reviews: [
      {
        id: 1,
        author: 'Mohamed S.',
        rating: 5,
        date: '25 Janvier 2026',
        comment: 'M. Mansour m&apos;a beaucoup aidé pendant ma période de dépression. Très professionnel et bienveillant.'
      },
      {
        id: 2,
        author: 'Fatma B.',
        rating: 4,
        date: '18 Janvier 2026',
        comment: 'Bon thérapeute, les techniques de relaxation qu&apos;il enseigne sont très efficaces.'
      }
    ]
  },
  {
    id: 3,
    name: 'Dr. Leila Trabelsi',
    slug: 'dr-leila-trabelsi',
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
    image: 'https://images.unsplash.com/photo-1594824919066-63ffc0e8324a?w=300&h=300&fit=crop&face',
    description: 'Experte en psychologie du travail et orientation professionnelle. J&apos;aide les étudiants et jeunes diplômés à définir leur projet professionnel et à prévenir le burn-out. Mon approche intègre les enjeux actuels du marché du travail.',
    languages: ['Français', 'Arabe', 'Anglais', 'Allemand'],
    sessionTypes: [
      { type: 'Consultation carrière', duration: '60 min'}
    ],
    qualifications: [
      'Doctorat en Psychologie du Travail - Université Paris 8',
      'Master en Gestion des Ressources Humaines - FSEG Sousse',
      'Certification en Coaching Professionnel - ICF',
      'Formation en Prévention du Burn-out - Institut Européen'
    ],
    workingHours: {
      'Lundi': ['08:00', '12:00', '13:00', '17:00'],
      'Mardi': [],
      'Mercredi': ['09:00', '13:00', '14:00', '18:00'],
      'Jeudi': [],
      'Vendredi': ['08:30', '12:30', '14:00', '16:30'],
      'Samedi': [],
      'Dimanche': []
    },
    reviews: [
      {
        id: 1,
        author: 'Karim L.',
        rating: 5,
        date: '30 Janvier 2026',
        comment: 'Dr. Trabelsi m&apos;a aidé à clarifier mon projet professionnel. Très compétente et à l&apos;écoute.'
      },
      {
        id: 2,
        author: 'Amina K.',
        rating: 5,
        date: '22 Janvier 2026',
        comment: 'Excellent bilan de compétences ! J&apos;ai découvert des aspects de ma personnalité que je ne connaissais pas.'
      },
      {
        id: 3,
        author: 'Yassine M.',
        rating: 4,
        date: '16 Janvier 2026',
        comment: 'Très bon coaching. Les conseils sont pratiques et applicables immédiatement.'
      }
    ]
  },
  {
    id: 5,
    name: 'Dr. Nadia Khemiri',
    slug: 'dr-nadia-khemiri',
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
    image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=300&h=300&fit=crop&face',
    description: 'Pionnière dans le domaine de la psychologie numérique en Tunisie. Je traite les addictions aux écrans, réseaux sociaux et jeux vidéo. Mon approche moderne combine thérapie comportementale et techniques de détox digitale.',
    languages: ['Français', 'Arabe', 'Anglais'],
    sessionTypes: [
      { type: 'Consultation spécialisée', duration: '55 min' }
    ],
    qualifications: [
      'Doctorat en Psychologie Cognitive - Université de Lille',
      'Master en Sciences Cognitives - École Normale Supérieure',
      'Certification en Thérapies Numériques - Stanford University',
      'Formation en Addiction Comportementale - Institut Fédératif'
    ],
    workingHours: {
      'Lundi': ['09:00', '12:00', '15:00', '18:00'],
      'Mardi': ['08:30', '12:30', '13:30', '17:30'],
      'Mercredi': ['10:00', '13:00', '14:00', '17:00'],
      'Jeudi': [],
      'Vendredi': ['09:00', '12:00', '14:30', '17:30'],
      'Samedi': [],
      'Dimanche': []
    },
    reviews: [
      {
        id: 1,
        author: 'Salim R.',
        rating: 5,
        date: '29 Janvier 2026',
        comment: 'Dr. Khemiri m&apos;a aidé à reprendre le contrôle sur mon utilisation des réseaux sociaux. Approche très moderne et efficace.'
      },
      {
        id: 2,
        author: 'Ines H.',
        rating: 5,
        date: '24 Janvier 2026',
        comment: 'Programme de détox digital excellent ! J&apos;ai retrouvé un équilibre dans ma vie numérique.'
      },
      {
        id: 3,
        author: 'Omar T.',
        rating: 4,
        date: '19 Janvier 2026',
        comment: 'Très bonne spécialiste. Les techniques pour gérer l&apos;addiction aux jeux vidéo sont très pratiques.'
      }
    ]
  }
]

// Function to convert name to slug
export function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}