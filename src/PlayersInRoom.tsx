import { FC } from 'react'
import { Player, RoomState } from 'app/types'
import { getGravatarAddress } from './utils'

type Props = {
  players: Player[]
  state: RoomState
}

export const PlayersInRoom: FC<Props> = (props: Props) => {
  return (
    <ul aria-label="Players' List">
      {props.players.map((player) => {
        const gravatarUrl = getGravatarAddress(player.email)
        return (
          <li key={player.id}>
            <img src={gravatarUrl} alt={`${player.name}'s avatar`} />
            <span>{player.name}</span>
            {props.state === 'planning' && player.estimate === null && (
              <span> is thinking!</span>
            )}
            {props.state === 'planning' && player.estimate !== null && (
              <span> has already Planned!</span>
            )}
            {props.state === 'revealed' && <span>{player.estimate}</span>}
          </li>
        )
      })}
    </ul>
  )
}
