import { useWebSocket, MessageListener } from 'app/hooks/useWebSocket'
import { Room } from 'app/types'
import { useEffect, useMemo } from 'react'

type Params = {
  playerId: string | undefined
  playerAuthToken: string | undefined
  room: Room | null
  setRoom: React.Dispatch<React.SetStateAction<Room | null>>
}

export function useOnEstimateUpdatedWSMessage(params: Params) {
  const { playerId, playerAuthToken, room, setRoom } = params

  const { addMessageListener, removeMessageListener } = useWebSocket({
    playerId: playerId,
    authToken: playerAuthToken,
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

    addMessageListener('estimateUpdated', onMessage)

    return () => {
      removeMessageListener('estimateUpdated', onMessage)
    }
  }, [room, onMessage, addMessageListener, removeMessageListener])
}
