import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import storage from 'app/utils/storage'
import { Technique } from 'app/types'
import api from 'app/utils/api'

import { RoomCreationForm } from './Form'
import { useMutation } from 'app/hooks/useAPI'

export const RoomCreation: FC = () => {
  const navigate = useNavigate()
  const techniques: Technique[] = ['fibonacci', 'tShirtSizing']
  const storedPlayer = storage.getPlayer()

  const { mutate, isMutating, error } = useMutation(
    api.createRoom,
    (result) => {
      if (!result.errorType && result.data) {
        const room = result.data

        storage.setRoom({
          id: room.id,
          playerId: room.players[0].id,
          playerAuthToken: room.players[0].authToken,
        })
        navigate(`/rooms/${room.id}`)
      }
    },
  )

  return (
    <RoomCreationForm
      isError={!!error}
      isLoading={isMutating}
      onSubmit={(item) => {
        mutate(item)
      }}
      error={error as Error}
      techniques={techniques}
      name={storedPlayer?.name}
      email={storedPlayer?.email}
    />
  )
}
