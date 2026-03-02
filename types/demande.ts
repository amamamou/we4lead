export type Genre = 'FEMME' | 'HOMME' | 'AUTRE'

export type Situation = 'CELIBATAIRE' | 'MARIE' | 'DIVORCE' | 'AUTRE'

export type TypeSituation =
  | 'HARCÈLEMENT'
  | 'VIOLENCE'
  | 'DISCRIMINATION'
  | 'DIFFICULTÉS_ACADÉMIQUES'
  | 'PROBLÈMES_ADMINISTRATIFS'
  | 'AUTRE'

export interface CreateDemandePayload {
  typeSituation: TypeSituation | string
  description: string
  lieuPrincipal?: string
  periode?: string
  medecinId?: string
  email: string
  nom?: string
  prenom?: string
  telephone?: string
  genre?: Genre | string
  situation?: Situation | string
  niveauEtude?: string
  universiteId?: number
}

export interface Demande extends CreateDemandePayload {
  id?: string | number
  createdAt?: string
}

export default Demande
