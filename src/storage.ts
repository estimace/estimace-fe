import { PlayerInStorage, RoomInStorage } from '@/types'

const KEYS = {
  PLAYER: 'player',
  PLANNING_ROOMS: 'planningRooms',
}

export function setPlayer(player: PlayerInStorage) {
  localStorage.setItem(KEYS.PLAYER, JSON.stringify(player))
}

export function getPlayer(): PlayerInStorage | null {
  const item = localStorage.getItem(KEYS.PLAYER)
  return item ? JSON.parse(item) : null
}

export function getRoomInStorage(slug: string): RoomInStorage | null {
  const rooms = getStoredRooms()
  return rooms[slug] ? { slug: rooms[slug] } : null
}

export function addRoomToStorageRooms(slug: string, secretKey: string) {
  localStorage.setItem(
    KEYS.PLANNING_ROOMS,
    JSON.stringify({ ...getStoredRooms(), [slug]: secretKey }),
  )
}

function getStoredRooms(): Record<string, string> {
  const roomsInStorage = localStorage.getItem(KEYS.PLANNING_ROOMS)
  return roomsInStorage ? JSON.parse(roomsInStorage) : {}
}
