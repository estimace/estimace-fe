import { parse as parseUUID, stringify as stringifyUUID } from 'uuid'
import { getBaseURL } from 'app/config'

export function convertUUIDToBase64(uuid: string): string {
  // Convert UUID to bytes
  const uuidBytes = parseUUID(uuid)

  // Convert bytes to URL-safe Base64
  return btoa(String.fromCharCode.apply(null, Array.from(uuidBytes)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export function convertBase64ToUUID(base64Encoded: string) {
  // Convert URL-safe Base64 to regular Base64
  const base64 = base64Encoded.replace(/-/g, '+').replace(/_/g, '/')

  // Decode Base64 to bytes
  const bytes = atob(base64)

  const byteNumbers = new Array<number>(bytes.length)
  for (let i = 0; i < bytes.length; i++) {
    byteNumbers[i] = bytes.charCodeAt(i)
  }

  // Convert bytes to UUID
  try {
    return stringifyUUID(byteNumbers)
  } catch {
    return undefined
  }
}

export function getRoomURLInBase64(roomIdInUUID: string) {
  return `${getBaseURL()}/r/${convertUUIDToBase64(roomIdInUUID)}`
}

export function getRelativeRoomURLInBase64(roomIdInUUID: string) {
  return `/r/${convertUUIDToBase64(roomIdInUUID)}`
}
