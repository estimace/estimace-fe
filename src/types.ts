export type Technique = 'fibonacci' | 'tShirtSizing'
export type TechniquesOptions = Record<Technique, string[]>

export type Room = {
  id: string
  slug: string
  ownerSecret: string
  state: 'planning' | 'revealed' | 'reset'
  technique: 'fibonacci' | 'TShirtSizing'
  players?: Player[]
}

export type Player = {
  id: string
  roomId: string
  ownerSecret?: string | null
  name: string
  email: string
  estimate: number | null
}
