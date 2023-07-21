import { WebSocketServer, WebSocket } from 'ws'
import type { AddressInfo } from 'ws'

type OnMessage = (
  message: Message | null,
  sendMessage: SendMessage,
  broadcastMessage: BroadcastMessage,
) => void
type SendMessage = (message: Message) => void
type BroadcastMessage = SendMessage
type Message = { type: string; payload: Record<string, unknown> }

const host = '127.0.0.1'

function create(
  onMessage: OnMessage,
): Promise<{ port: number; address: string }> {
  return new Promise((resolve) => {
    const wss = new WebSocketServer({ port: 0, host }, () => {
      const address = wss.address() as AddressInfo
      resolve({ port: address.port, address: `${host}:${address.port}` })
    })

    wss.on('connection', function connection(ws) {
      console.log('on connection')
      ws.on('error', console.error)

      const sendMessage: SendMessage = (message) => {
        console.log('sendMessage', message)
        ws.send(JSON.stringify(message))
      }

      const broadcastMessage: BroadcastMessage = (message) => {
        console.log('broadcastMessage', message)
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message))
          }
        })
      }

      ws.on('message', function message(data) {
        const message = parseJSON(data.toString())
        console.log('onMessage', message)
        onMessage(message, sendMessage, broadcastMessage)
      })
    })
  })
}

function parseJSON(value: string): Message | null {
  try {
    const parsedValue = JSON.parse(value)
    if (typeof parsedValue.type === 'string' && 'payload' in parsedValue) {
      return parsedValue
    } else {
      return null
    }
  } catch (_) {
    return null
  }
}

export default {
  create,
}
