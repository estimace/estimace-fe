import { useWebSocket, MessageListener } from 'app/hooks/useWebSocket'
import { Player, Room } from 'app/types'
import { useEffect, useMemo } from 'react'

type Params = {
  player: Player | null
  room: Room | null
  setRoom: React.Dispatch<React.SetStateAction<Room | null>>
}

export function useOnNewPlayerJoinedWSMessage(params: Params) {
  const { player, room, setRoom } = params

  const socket = useWebSocket({
    playerId: player?.id,
    playerAuthToken: player?.authToken,
  })

  const onMessage = useMemo<MessageListener>(
    () => (message) => {
      if (!room || !room.players) {
        return
      }
      const playerIndex = room.players.findIndex(
        (player) => player.id === message.payload.id,
      )
      if (playerIndex >= 0) {
        return
      }
      const nextState = { ...room }
      nextState.players.push(message.payload as Player)
      setRoom(nextState)
    },
    [room, setRoom],
  )

  useEffect(() => {
    if (!room) {
      return
    }

    socket.addMessageListener('newPlayerJoined', onMessage)

    return () => {
      socket.removeMessageListener('newPlayerJoined', onMessage)
    }
  }, [room, onMessage, socket])
}
