import { useParams } from 'react-router-dom'

import { convertBase64ToUUID } from 'app/utils/url'

export function useRoomIdInURL() {
  const { id: roomId } = useParams()

  let roomIdInUUID = roomId
  if (roomId && roomId.length !== 36) {
    // it is a base64 encoding ID instead of UUID
    roomIdInUUID = convertBase64ToUUID(roomId)
  }
  return roomIdInUUID
}
