import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Room } from 'app/types'
import { useQuery } from 'app/hooks/useAPI'
import api from 'app/utils/api'

export function useRoom() {
  const { id: roomId } = useParams()
  const [room, setRoom] = useState<Room | null>(null)

  const roomQuery = useQuery(() => api.getRoom(roomId as string))
  useEffect(() => {
    if (roomQuery.result && !roomQuery.result.errorType) {
      setRoom(roomQuery.result?.data as Room)
    }
  }, [roomQuery.result])

  return { roomQuery, room, setRoom }
}
