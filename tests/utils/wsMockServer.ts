import { WebSocketServer, WebSocket } from 'ws'
import type { AddressInfo } from 'ws'

type OnMessage = (params: {
  message: Message | null
  sendMessage: SendMessage
  broadcastMessage: BroadcastMessage
  url: URL
}) => void
type SendMessage = (message: Message) => void
export type BroadcastMessage = (message: Message) => void
type Message = { type: string; payload: Record<string, unknown> }

const host = '127.0.0.1'

function create(onMessage?: OnMessage): Promise<{
  port: number
  address: string
  broadcastMessage: BroadcastMessage
}> {
  return new Promise((resolve) => {
    const broadcastMessage: BroadcastMessage = (message) => {
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(message))
        }
      })
    }

    const wss = new WebSocketServer({ port: 0, host }, () => {
      const address = wss.address() as AddressInfo
      resolve({
        port: address.port,
        address: `${host}:${address.port}`,
        broadcastMessage,
      })
    })

    wss.on('connection', function connection(ws, req) {
      ws.on('error', console.error)

      const sendMessage: SendMessage = (message) => {
        ws.send(JSON.stringify(message))
      }

      const _broadcastMessage: BroadcastMessage = (message) => {
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message))
          }
        })
      }

      ws.on('message', function message(data) {
        const message = parseJSON(data.toString())

        onMessage?.({
          message,
          sendMessage,
          broadcastMessage: _broadcastMessage,
          url: new URL(`http://localhost${req.url}`),
        })
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
