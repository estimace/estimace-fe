import { Room } from 'app/types'
import { useWebSocket } from 'app/hooks/useWebSocket'

type Params = {
  playerId: string | undefined
  playerAuthToken: string | undefined
}

export function useSendRoomStateWSMessage(params: Params) {
  const { playerId, playerAuthToken } = params

  const { sendMessage } = useWebSocket({
    playerId: playerId,
    authToken: playerAuthToken,
  })

  function sendRoomState(state: Room['state']) {
    sendMessage({
      type: 'updateRoomState',
      payload: {
        state,
      },
    })
  }

  return sendRoomState
}
