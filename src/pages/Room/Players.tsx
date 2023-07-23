import { FC } from 'react'
import { Player, Room, RoomState } from 'app/types'
import { techniqueOptions } from 'app/config'

type Props = {
  players: Player[]
  technique: Room['technique']
  state: RoomState
}

export const PlayersInRoom: FC<Props> = (props: Props) => {
  const { players, state, technique } = props

  return (
    <ul aria-label="Players' List">
      {players.map((player) => {
        return (
          <li key={player.id}>
            {player.pictureURL && (
              <img src={player.pictureURL} alt={`${player.name}'s avatar`} />
            )}
            <span>{player.name}</span>{' '}
            {state === 'planning' && player.estimate === null && (
              <span>is estimating</span>
            )}
            {state === 'planning' && player.estimate !== null && (
              <span>estimated</span>
            )}
            {state === 'revealed' && (
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
