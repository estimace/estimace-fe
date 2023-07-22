import { useWebSocket } from 'app/hooks/useWebSocket'

type Params = {
  playerId: string | undefined
  playerAuthToken: string | undefined
}

export function useSendEstimateWSMessage(params: Params) {
  const { playerId, playerAuthToken } = params

  const { sendMessage } = useWebSocket({
    playerId: playerId,
    authToken: playerAuthToken,
  })

  function sendEstimate(estimate: number) {
    sendMessage({
      type: 'updateEstimate',
      payload: {
        estimate,
      },
    })
  }

  return sendEstimate
}
