import { Player, Room } from 'app/types'
import { apiPath } from 'app/config'
import { request, ResponseValue } from './request'

export type APIFunction<T, P extends unknown[]> = (
  ...p: P
) => Promise<ResponseValue<T>>

const getRoom: APIFunction<Room, [Room['id']]> = async (roomId) => {
  return request<Room>('GET', `${apiPath}/rooms/${roomId}`)
}

const createRoom: APIFunction<
  Room,
  [
    {
      name: Player['name']
      email: Player['email']
      technique: Room['technique']
    },
  ]
> = async (param) => {
  return request<Room>('POST', `${apiPath}/rooms`, { body: param })
}

const addPlayerToRoom: APIFunction<
  Player,
  [Room['id'], Pick<Player, 'name' | 'email'>]
> = async (roomId, player) => {
  return request<Player>('POST', `${apiPath}/rooms/${roomId}/players`, {
    body: player,
  })
}

export default { getRoom, createRoom, addPlayerToRoom }
