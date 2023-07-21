import { getWebsocketServerURL } from './config'

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

    socket.onopen = () => {
      if (socket) {
        socket.send(`{"message": "new client is connected"}`)
      }
    }

    socket.onmessage = (event) => {
      onMessage(event)
    }

    socket.onclose = () => {
      console.log('Web Socket connection properly closed.')
    }
  }

  return { socket }
}
