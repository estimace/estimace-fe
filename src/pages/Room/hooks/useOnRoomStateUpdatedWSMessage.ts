import { useWebSocket, MessageListener } from 'app/hooks/useWebSocket'
import { Room } from 'app/types'
import { useEffect, useMemo } from 'react'

type Params = {
  playerId: string | undefined
  playerAuthToken: string | undefined
  room: Room | null
  setRoom: React.Dispatch<React.SetStateAction<Room | null>>
}

export function useOnRoomStateUpdatedWSMessage(params: Params) {
  const { playerId, playerAuthToken, room, setRoom } = params

  const { addMessageListener, removeMessageListener } = useWebSocket({
    playerId: playerId,
    authToken: playerAuthToken,
  })

  const onMessage = useMemo<MessageListener>(
    () => (message) => {
      if (room) {
        setRoom({ ...room, state: message.payload.state as Room['state'] })
      }
    },
    [room, setRoom],
  )

  useEffect(() => {
    if (!room) {
      return
    }

    addMessageListener('roomStateUpdated', onMessage)

    return () => {
      removeMessageListener('roomStateUpdated', onMessage)
    }
  }, [room, onMessage, addMessageListener, removeMessageListener])
}
