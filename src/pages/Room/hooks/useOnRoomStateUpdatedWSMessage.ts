import { useWebSocket, MessageListener } from 'app/hooks/useWebSocket'
import { Player, Room, RoomState } from 'app/types'
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
      const roomState: RoomState = message.payload.state as RoomState
      if (!room) {
        return
      }
      const nextState = { ...room }
      nextState.state = message.payload.state as Room['state']
      if (roomState === 'planning') {
        nextState.players = room.players.map((item) => ({
          ...item,
          estimate: null,
        }))
      }
      setRoom(nextState)
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
