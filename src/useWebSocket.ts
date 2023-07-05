let socket: WebSocket | null = null

export const useWebSocket = () => {
  if (socket) return { socket }
  // Create WebSocket connection.
  socket = new WebSocket('ws://localhost:4000')
  console.log(socket)
  // Connection opened

  socket.onopen = (event) => {
    console.log(socket)
    if (socket) {
      socket.send(`{"message": "new client is connected"}`)
    }
  }

  //receiving message from server
  socket.onmessage = (event) => {
    console.log('Message from server ', event)
    const newMessage = JSON.parse(event.data)

    switch (newMessage.type) {
      case 'message':
        console.log(newMessage)
        break
    }
  }

  socket.onclose = () => {
    console.log(socket)
    console.log('Web Socket connection properly closed.')
  }

  return { socket }
}
