import { useEffect, useState } from 'react'

import { Room, Player, RoomInStorage } from 'app/types'

export function usePlayer(
  room: Room | null,
  roomInStorage: RoomInStorage | null,
) {
  const [player, setPlayer] = useState<Player | null>(null)
  useEffect(() => {
    if (!room || !roomInStorage) return
    const playerInRoom = room.players.find(
      (item) => item.id === roomInStorage.playerId,
    )
    if (playerInRoom) {
      playerInRoom.authToken = roomInStorage.playerAuthToken
      setPlayer(playerInRoom)
    }
  }, [room, roomInStorage])

  return { player, setPlayer }
}
