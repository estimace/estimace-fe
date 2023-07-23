import { Player, Room } from 'app/types'
import { useSendRoomStateWSMessage } from './hooks/useSendRoomStateWSMessage'

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
        <button onClick={() => sendRoomState('revealed')}>Reveal</button>
      ) : (
        <button onClick={() => sendRoomState('planning')}>Reset</button>
      )}
    </>
  )
}
