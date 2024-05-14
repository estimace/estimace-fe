import { getWebsocketServerURL } from 'app/config'

type Param = {
  playerId: string | undefined
  playerAuthToken: string | undefined
}

let socket: WebSocket | null = null
let currentPlayerId: Param['playerId']

const wssURL = getWebsocketServerURL()

export type Message = {
  type: string
  payload: Record<string, unknown>
}

export type MessageListener = (message: Message) => void
const listeners: Record<Message['type'], MessageListener[]> = {}

function sendMessage(message: Message) {
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

  if (socket && playerId !== currentPlayerId) {
    socket.close()
    socket = null
  }

  if (!socket && playerId && playerAuthToken) {
    currentPlayerId = playerId

    socket = new WebSocket(
      `${wssURL}?playerId=${playerId}&authToken=${playerAuthToken}`,
    )

    socket.onmessage = (event) => {
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
    }
  }

  return { sendMessage, addMessageListener, removeMessageListener }
}
