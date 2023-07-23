import { useWebSocket, MessageListener } from 'app/hooks/useWebSocket'
import { Player, Room } from 'app/types'
import { useEffect, useMemo } from 'react'

type Params = {
  player: Player | null
  room: Room | null
  setRoom: React.Dispatch<React.SetStateAction<Room | null>>
}

export function useOnRoomStateUpdatedWSMessage(params: Params) {
  const { player, room, setRoom } = params

  const socket = useWebSocket({
    playerId: player?.id,
    playerAuthToken: player?.authToken,
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

    socket.addMessageListener('roomStateUpdated', onMessage)

    return () => {
      socket.removeMessageListener('roomStateUpdated', onMessage)
    }
  }, [room, onMessage, socket])
}
