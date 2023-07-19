import { QueryKey } from '@tanstack/react-query'
import md5 from 'md5'

import { Player, Room, PlayerInStorage } from './types'
import { apiUrl } from './config'
import { SubmitHandlerParam } from './RoomCreationForm'

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

const fetchRoom = async ({ queryKey }: { queryKey: QueryKey }) => {
  const res = await fetch(`${apiUrl}/rooms/${queryKey[1]}`)

  if (!res.ok) throw new Error(`error to get requested room`)

  const result = (await res.json()) as Room
  return result
}

const createRoom = async (item: SubmitHandlerParam) => {
  const res = await fetch(`${apiUrl}/rooms`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(item),
  })
  return (await res.json()) as Room
}

const addPlayerToRoom = async (roomId: string, player: PlayerInStorage) => {
  const res = await fetch(`${apiUrl}/rooms/${roomId}/players`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(player),
  })
  return (await res.json()) as Player
}

const getGravatarAddress = (email: string) => {
  const address = email.trim().toLowerCase()
  const hash = md5(address)
  return `https://www.gravatar.com/avatar/${hash}&d=retro`
}

const submitPlayerEstimation = async (
  playerId: string,
  roomId: string,
  estimate: string,
) => {
  const res = await fetch(`${apiUrl}/rooms/${roomId}/player/estimate`, {
    method: 'PUT',
    headers: defaultHeaders,
    body: JSON.stringify({ roomId, playerId, estimate }),
  })
  return res
}

export {
  fetchRoom,
  createRoom,
  addPlayerToRoom,
  getGravatarAddress,
  submitPlayerEstimation,
}
