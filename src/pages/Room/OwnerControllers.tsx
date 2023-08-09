import { Player, Room } from 'app/types'
import { useSendRoomStateWSMessage } from './hooks/useSendRoomStateWSMessage'

import { Button } from 'app/ui/Button'
import styles from './ownerController.module.css'

type Props = {
  player: Player
  roomState: Room['state']
}

export const OwnerControllers: React.FC<Props> = (props) => {
  const { player, roomState } = props

  const sendRoomState = useSendRoomStateWSMessage(player)

  return (
    <>
      {roomState === 'planning' ? (
        <Button
          type="button"
          onClick={() => sendRoomState('revealed')}
          label="Reveal"
          className={styles.roomStateReveal}
        />
      ) : (
        <Button
          type="button"
          onClick={() => sendRoomState('planning')}
          label="Reset"
          className={styles.roomStateReset}
        />
      )}
    </>
  )
}
