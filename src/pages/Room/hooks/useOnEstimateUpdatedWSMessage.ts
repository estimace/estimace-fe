import { useWebSocket, MessageListener } from 'app/hooks/useWebSocket'
import { Player, Room } from 'app/types'
import { useEffect, useMemo } from 'react'

type Params = {
  player: Player | null
  room: Room | null
  setRoom: React.Dispatch<React.SetStateAction<Room | null>>
}

export function useOnEstimateUpdatedWSMessage(params: Params) {
  const { player, room, setRoom } = params

  const socket = useWebSocket({
    playerId: player?.id,
    playerAuthToken: player?.authToken,
  })

  const onMessage = useMemo<MessageListener>(
    () => (message) => {
      const playerIndex = room?.players.findIndex(
        (player) => player.id === message.payload.id,
      )
      if (!room?.players || playerIndex === undefined || playerIndex === -1) {
        return
      }
      const nextState = { ...room }
      nextState.players[playerIndex] = {
        ...nextState.players[playerIndex],
        estimate: message.payload.estimate as number,
      }
      setRoom(nextState)
    },
    [room, setRoom],
  )

  useEffect(() => {
    if (!room) {
      return
    }

    socket.addMessageListener('estimateUpdated', onMessage)

    return () => {
      socket.removeMessageListener('estimateUpdated', onMessage)
    }
  }, [room, onMessage, socket])
}
