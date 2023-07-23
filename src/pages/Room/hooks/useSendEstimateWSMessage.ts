import { useWebSocket } from 'app/hooks/useWebSocket'
import { Player } from 'app/types'

export function useSendEstimateWSMessage(player: Player) {
  const socket = useWebSocket({
    playerId: player.id,
    playerAuthToken: player.authToken,
  })

  function sendEstimate(estimate: number) {
    socket.sendMessage({
      type: 'updateEstimate',
      payload: {
        estimate,
      },
    })
  }

  return sendEstimate
}
