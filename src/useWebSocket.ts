let socket: WebSocket | null = null

type Param = {
  playerId: string | undefined
  authToken: string | undefined
  onMessage: (event: MessageEvent<unknown>) => void
}

export const useWebSocket = (param: Param) => {
  const { playerId, authToken, onMessage } = param

  console.log({ param })

  if (!socket && playerId && authToken) {
    socket = new WebSocket(
      `ws://localhost:5173/api/socket?playerId=${playerId}&authToken=${authToken}`,
    )

    socket.onopen = () => {
      if (socket) {
        socket.send(`{"message": "new client is connected"}`)
      }
    }

    //receiving message from server
    socket.onmessage = (event) => {
      onMessage(event)
    }

    socket.onclose = () => {
      console.log('Web Socket connection properly closed.')
    }
  }

  return { socket }
}
