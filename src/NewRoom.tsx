import { FC } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { Technique } from '@/types'
import {
  setPlayer as setPlayerInLocalStorage,
  addRoomToStorageRooms,
  getPlayer,
} from '@/storage'
import { NewRoomForm } from '@/NewRoomForm'
import { createRoom } from './utils'

const CreateRoom: FC = () => {
  const navigate = useNavigate()
  const techniques: Technique[] = ['fibonacci', 'tShirtSizing']
  const storedPlayer = getPlayer()

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: createRoom,
    onSuccess: async (room) => {
      setPlayerInLocalStorage({
        name: room.players[0].name,
        email: room.players[0].email,
      })
      addRoomToStorageRooms(room.slug, room.players[0].secretKey)
      navigate(`/rooms/${room.slug}`)
    },
  })

  return (
    <NewRoomForm
      isError={isError}
      isLoading={isLoading}
      onSubmit={mutate}
      error={error as Error}
      techniques={techniques}
      ownerName={storedPlayer?.name}
      ownerEmail={storedPlayer?.email}
    />
  )
}

export default CreateRoom
