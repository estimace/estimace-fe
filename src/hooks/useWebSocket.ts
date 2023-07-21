import { getWebsocketServerURL } from 'app/config'

let socket: WebSocket | null = null
const wssURL = getWebsocketServerURL()

type Param = {
  playerId: string | undefined
  authToken: string | undefined
  onMessage: (event: MessageEvent<unknown>) => void
}

export const useWebSocket = (param: Param) => {
  const { playerId, authToken, onMessage } = param

  if (!socket && playerId && authToken) {
    socket = new WebSocket(
      `${wssURL}?playerId=${playerId}&authToken=${authToken}`,
    )

    socket.onmessage = (event) => {
      onMessage(event)
    }
  }

  return { socket }
}
