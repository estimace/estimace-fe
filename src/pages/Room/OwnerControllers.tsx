import { Player, Room } from 'app/types'
import { useSendRoomStateWSMessage } from './hooks/useSendRoomStateWSMessage'

import { Button } from 'app/ui/Button'

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
        <Button onClick={() => sendRoomState('revealed')}>
          Reveal Estimates
        </Button>
      ) : (
        <Button onClick={() => sendRoomState('planning')}>Reset</Button>
      )}
    </>
  )
}
