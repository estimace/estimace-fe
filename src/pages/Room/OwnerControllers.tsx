import { Room } from 'app/types'
import { useSendRoomStateWSMessage } from './hooks/useSendRoomStateWSMessage'

type Props = {
  playerId: string | undefined
  playerAuthToken: string | undefined
  roomState: Room['state']
}

export const OwnerControllers: React.FC<Props> = (props) => {
  const { playerId, playerAuthToken, roomState } = props
  const sendRoomState = useSendRoomStateWSMessage({ playerId, playerAuthToken })

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
