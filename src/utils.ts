import { QueryKey } from '@tanstack/react-query'
import { Player, Room, PlayerInStorage } from './types'
import { apiUrl } from './config'
import { SubmitHandlerParam } from './NewRoomForm'
import md5 from 'md5'

const fetchRoom = async ({ queryKey }: { queryKey: QueryKey }) => {
  //slug =  queryKey[1]
  const res = await fetch(`${apiUrl}/rooms/${queryKey[1]}`)

  if (!res.ok) throw new Error(`error to get requested room`)

  const result = (await res.json()) as Room
  return result
}

const createRoom = async (item: SubmitHandlerParam) => {
  const res = await fetch(`${apiUrl}/rooms`, {
    method: 'POST',
    body: JSON.stringify(item),
  })
  return (await res.json()) as Room
}

const addPlayerToRoom = async (slug: string, player: PlayerInStorage) => {
  const res = await fetch(`${apiUrl}/rooms/${slug}/players`, {
    method: 'POST',
    body: JSON.stringify(player),
  })
  return (await res.json()) as Player
}

const getGravatarAddress = (email: string) => {
  const address = email.trim().toLowerCase()
  const hash = md5(address)

  // Grab the actual image URL
  return `https://www.gravatar.com/avatar/${hash}`
}

const submitPlayerEstimation = async (
  playerId: string,
  roomId: string,
  estimate: string,
) => {
  const res = await fetch(`${apiUrl}/rooms/${roomId}/estimates`, {
    method: 'POST',
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
