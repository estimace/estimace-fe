import { getBaseURL } from 'app/config'

export function getRoomURLInBase64(roomId: string) {
  return `${getBaseURL()}${getRelativeRoomURLInBase64(roomId)}`
}

export function getRelativeRoomURLInBase64(roomId: string) {
  return `/r/${roomId}`
}
