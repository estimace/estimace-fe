import { Player, Room } from 'app/types'
import { useWebSocket } from 'app/hooks/useWebSocket'

export function useSendRoomStateWSMessage(player: Player) {
  const socket = useWebSocket({
    playerId: player.id,
    playerAuthToken: player.authToken,
  })

  function sendRoomState(state: Room['state']) {
    socket.sendMessage({
      type: 'updateRoomState',
      payload: {
        state,
      },
    })
  }

  return sendRoomState
}
