import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { Page } from 'app/ui/layout/Page'
import storage from 'app/utils/storage'
import { Technique } from 'app/types'
import api from 'app/utils/api'
import { useMutation } from 'app/hooks/useAPI'
import { getRelativeRoomURLInBase64 } from 'app/utils/url'
import { Headline } from 'app/ui/Headline'

import styles from './styles.module.css'
import { RoomCreationForm } from './Form'

const RoomCreation: FC = () => {
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
        const roomURL = getRelativeRoomURLInBase64(room.id)
        navigate(roomURL)
      }
    },
  )

  return (
    <Page>
      <div className={styles.wrap}>
        <Headline tag="h1">Create an Estimace room</Headline>

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
      </div>
    </Page>
  )
}

export default RoomCreation
