import { PlayerInStorage, RoomInStorage } from 'app/types'

const KEYS = {
  PLAYER: 'player',
  ROOMS: 'rooms',
}

function setPlayer(value: PlayerInStorage) {
  localStorage.setItem(KEYS.PLAYER, JSON.stringify(value))
}

function getPlayer(): PlayerInStorage | null {
  const item = localStorage.getItem(KEYS.PLAYER)
  if (!item) return null
  return JSON.parse(item)
}

function getRoom(id: string): RoomInStorage | null {
  const rooms = getStoredRooms()
  return rooms[id] ?? null
}

function setRoom(value: RoomInStorage) {
  localStorage.setItem(
    KEYS.ROOMS,
    JSON.stringify({ ...getStoredRooms(), [value.id]: value }),
  )
}

function getStoredRooms(): Record<string, RoomInStorage> {
  const roomsInStorage = localStorage.getItem(KEYS.ROOMS)
  if (!roomsInStorage) return {}
  return JSON.parse(roomsInStorage)
}

export default {
  setPlayer,
  getPlayer,
  setRoom,
  getRoom,
}
