import { FC } from 'react'
import { Player, Room, RoomState } from 'app/types'
import { techniqueOptions } from 'app/config'

type Props = {
  players: Player[]
  technique: Room['technique']
  state: RoomState
}

export const PlayersInRoom: FC<Props> = (props: Props) => {
  const { technique } = props

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
            {props.state === 'revealed' && (
              <span>
                {player.estimate
                  ? techniqueOptions[technique][player.estimate]
                  : 'did not estimate'}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
