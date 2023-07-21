import { FC } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import storage from 'app/utils/storage'
import { Technique } from 'app/types'
import { createRoom } from 'app/utils'

import { RoomCreationForm } from './Form'

export const RoomCreation: FC = () => {
  const navigate = useNavigate()
  const techniques: Technique[] = ['fibonacci', 'tShirtSizing']
  const storedPlayer = storage.getPlayer()

  const { mutate, isLoading, isError, error } = useMutation({
    mutationFn: createRoom,
    onSuccess: async (room) => {
      storage.setPlayer({
        name: room.players[0].name,
        email: room.players[0].email,
      })
      storage.setRoom({
        id: room.id,
        playerId: room.players[0].id,
        playerAuthToken: room.players[0].authToken,
      })
      navigate(`/rooms/${room.id}`)
    },
  })

  return (
    <RoomCreationForm
      isError={isError}
      isLoading={isLoading}
      onSubmit={mutate}
      error={error as Error}
      techniques={techniques}
      name={storedPlayer?.name}
      email={storedPlayer?.email}
    />
  )
}