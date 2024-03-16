import { useEffect, useState } from 'react'

import { Room } from 'app/types'
import { useQuery } from 'app/hooks/useAPI'
import api from 'app/utils/api'

import { useRoomIdInURL } from './useRoomIdInURL'

export function useRoom() {
  const roomId = useRoomIdInURL()
  const [room, setRoom] = useState<Room | null>(null)

  const roomQuery = useQuery(() => api.getRoom(roomId as string))
  useEffect(() => {
    if (roomQuery.result && !roomQuery.result.errorType) {
      setRoom(roomQuery.result?.data as Room)
    }
  }, [roomQuery.result])

  return { roomQuery, room, setRoom }
}
