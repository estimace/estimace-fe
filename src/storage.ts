import { Player, Room } from '@/types'

type StoragePlayer = Pick<Player, 'name' | 'email'>
type OwnedRoom = Pick<Room, 'id' | 'ownerSecret'>

const KEYS = {
  PLAYER: 'player',
  OWNED_ROOMS: 'ownedRooms',
}

export function setPlayer(player: StoragePlayer) {
  localStorage.setItem(
    KEYS.PLAYER,
    JSON.stringify({ name: player.name, email: player.email }),
  )
}

export function getPlayer(): StoragePlayer | null {
  const item = localStorage.getItem(KEYS.PLAYER)
  return item ? JSON.parse(item) : null
}

export function addRoomToOwnedRooms(ownedRoom: OwnedRoom) {
  const rooms = getOwnedRooms()
  rooms[ownedRoom.id] = ownedRoom.ownerSecret
  localStorage.setItem(KEYS.OWNED_ROOMS, JSON.stringify(rooms))
}

export function getOwnedRoomSecret(roomId: string): string | null {
  const rooms = getOwnedRooms()
  return rooms[roomId] ?? null
}

function getOwnedRooms(): Record<OwnedRoom['id'], OwnedRoom['ownerSecret']> {
  const roomsInStorage = localStorage.getItem(KEYS.OWNED_ROOMS)
  return roomsInStorage ? JSON.parse(roomsInStorage) : {}
}
