import { getWebsocketServerURL } from 'app/config'

let socket: WebSocket | null = null
const wssURL = getWebsocketServerURL()

type Param = {
  playerId: string | undefined
  playerAuthToken: string | undefined
}

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

  if (!socket && playerId && playerAuthToken) {
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
