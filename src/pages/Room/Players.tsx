import { FC } from 'react'
import { Player, RoomState } from 'app/types'

type Props = {
  players: Player[]
  state: RoomState
}

export const PlayersInRoom: FC<Props> = (props: Props) => {
  return (
    <ul aria-label="Players' List">
      {props.players.map((player) => {
        return (
          <li key={player.id}>
            {player.pictureURL && (
              <img src={player.pictureURL} alt={`${player.name}'s avatar`} />
            )}
            <span>{player.name}</span>{' '}
            {props.state === 'planning' && player.estimate === null && (
              <span>is estimating</span>
            )}
            {props.state === 'planning' && player.estimate !== null && (
              <span>estimated</span>
            )}
            {props.state === 'revealed' && <span>{player.estimate}</span>}
          </li>
        )
      })}
    </ul>
  )
}
