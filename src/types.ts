export type Technique = 'fibonacci' | 'tShirtSizing'
export type TechniquesOptions = Record<Technique, string[]>
export type RoomState = 'planning' | 'revealed'

export type Room = {
  id: string
  slug: string
  state: RoomState
  technique: Technique
  players: Player[]
}

export type Player = {
  id: string
  roomId: string
  name: string
  email: string
  secretKey: string
  isOwner: boolean
  estimate: number | null
}

export type PlayerInStorage = Pick<Player, 'id' | 'name' | 'email'>
export type RoomInStorage = Record<'slug', string>
