export type Technique = 'fibonacci' | 'tShirtSizing'
export type TechniquesLabels = Record<Technique, string>
export type TechniquesOptions = Record<Technique, string[]>
export type RoomState = 'planning' | 'revealed'

export type Room = {
  id: string
  state: RoomState
  technique: Technique
  players: Player[]
}

export type Player = {
  id: string
  roomId: string
  name: string
  email?: string
  pictureURL: string | null
  isOwner: boolean
  estimate: number | null
  authToken?: string
}

export type PlayerInStorage = Pick<Player, 'name' | 'email'>
export type RoomInStorage = {
  id: Room['id']
  playerId: Player['id']
  playerAuthToken: Player['authToken']
}

declare global {
  interface Window {
    WS_URL: string
  }
}
