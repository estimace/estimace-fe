import { Player, Room } from 'app/types'
import { apiPath } from 'app/config'
import { request } from './request'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type APIFunction = (...p: any[]) => ReturnType<typeof request>

const getRoom: APIFunction = async (roomId: Room['id']) => {
  return request<Room>('GET', `${apiPath}/rooms/${roomId}`)
}

const createRoom = async (param: {
  name: Player['name']
  email: Player['email']
  technique: Room['technique']
}) => {
  return request<Room>('POST', `${apiPath}/rooms`, { body: param })
}

const addPlayerToRoom = async (
  roomId: Room['id'],
  player: Pick<Player, 'name' | 'email'>,
) => {
  return request<Player>('POST', `${apiPath}/rooms/${roomId}/players`, {
    body: player,
  })
}

export default { getRoom, createRoom, addPlayerToRoom }
