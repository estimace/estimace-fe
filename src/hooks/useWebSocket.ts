import { getWebsocketServerURL } from 'app/config'

type Param = {
  playerId: string | undefined
  playerAuthToken: string | undefined
}

let socket: WebSocket | null = null
let currentPlayerId: string | null = null
let currentPlayerAuthToken: string | null = null

const wssURL = getWebsocketServerURL()

export type Message = {
  type: string
  payload: Record<string, unknown>
}

export type MessageListener = (message: Message) => void
const listeners: Record<Message['type'], MessageListener[]> = {}

async function sendMessage(message: Message) {
  await reconnectIfNeeded()
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(message))
  }
}

function addMessageListener(
  messageType: Message['type'],
  listener: MessageListener,
) {
  if (!listeners[messageType]) {
    listeners[messageType] = []
  }
  listeners[messageType].push(listener)
}

function removeMessageListener(
  messageType: Message['type'],
  listener: MessageListener,
) {
  const index = listeners[messageType].findIndex((item) => item === listener)
  listeners[messageType].splice(index, 1)
}

export const useWebSocket = (param: Param) => {
  const { playerId, playerAuthToken } = param

  if (isSocketOpen(socket) && playerId !== currentPlayerId) {
    socket?.close()
  }

  if (
    !isSocketOpen(socket) &&
    !isSocketConnecting(socket) &&
    playerId &&
    playerAuthToken
  ) {
    currentPlayerId = playerId
    currentPlayerAuthToken = playerAuthToken

    createWebSocket()
  }

  return { sendMessage, addMessageListener, removeMessageListener }
}

function createWebSocket() {
  socket = new WebSocket(
    `${wssURL}?playerId=${currentPlayerId}&authToken=${currentPlayerAuthToken}`,
  )

  socket.addEventListener('message', (event) => {
    try {
      const message = JSON.parse(event.data)
      if (typeof message.type === 'string' && 'payload' in message) {
        for (const listener of listeners[message.type] ?? []) {
          listener(message as Message)
        }
      } else {
        console.error(
          'format of the message from ws server is not supported',
          message,
        )
      }
    } catch (error) {
      console.error('could not parse the message from ws server', {
        error,
        data: event.data,
      })
    }
  })

  return new Promise<void>((resolve) => {
    socket?.addEventListener('open', () => {
      resolve()
    })
  })
}

async function reconnectIfNeeded() {
  console.log({
    socket,
    currentPlayerId,
    currentPlayerAuthToken,
    readyState: socket?.readyState,
  })
  if (!isSocketOpen(socket) && currentPlayerId && currentPlayerAuthToken) {
    await createWebSocket()
  }
}

function isSocketOpen(socket: WebSocket | null) {
  return socket && socket.readyState === socket.OPEN
}

function isSocketConnecting(socket: WebSocket | null) {
  return socket && socket.readyState === socket.CONNECTING
}
