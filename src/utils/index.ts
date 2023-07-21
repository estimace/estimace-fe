import { QueryKey } from '@tanstack/react-query'

import { Player, Room, PlayerInStorage, Technique } from 'app/types'
import { apiPath } from 'app/config'

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const fetchRoom = async ({ queryKey }: { queryKey: QueryKey }) => {
  const res = await fetch(`${apiPath}/rooms/${queryKey[1]}`)

  if (!res.ok) throw new Error(`error to get requested room`)

  const result = (await res.json()) as Room
  return result
}

export type CreateRoomParam = {
  name: string
  email: string
  technique: Technique
}

const createRoom = async (item: CreateRoomParam) => {
  const res = await fetch(`${apiPath}/rooms`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(item),
  })
  return (await res.json()) as Room
}

const addPlayerToRoom = async (roomId: string, player: PlayerInStorage) => {
  const res = await fetch(`${apiPath}/rooms/${roomId}/players`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(player),
  })
  return (await res.json()) as Player
}

const submitPlayerEstimation = async (
  playerId: string,
  roomId: string,
  estimate: string,
) => {
  const res = await fetch(`${apiPath}/rooms/${roomId}/player/estimate`, {
    method: 'PUT',
    headers: defaultHeaders,
    body: JSON.stringify({ roomId, playerId, estimate }),
  })
  return res
}

export { fetchRoom, createRoom, addPlayerToRoom, submitPlayerEstimation }
