import { FC } from 'react'
import { Player, RoomState } from '@/types'
import { getGravatarAddress } from './utils'

type Props = {
  players: Player[]
  state: RoomState
}

export const PlayersInRoom: FC<Props> = (props: Props) => {
  return (
    <ul className="playersList">
      {props.players.map((player) => {
        const gravatarUrl = getGravatarAddress(player.email)
        return (
          <li key={player.id}>
            <img src={gravatarUrl} alt={`avatar of ${player.name} `} />
            <span className="playerName">{player.name}</span>
            {props.state === 'planning' && !player.estimate && (
              <span className="playerStatus"> is thinking!</span>
            )}
            {props.state === 'planning' && player.estimate !== null && (
              <span className="playerStatus"> already Planned!</span>
            )}
            {props.state === 'revealed' && (
              <span className="playerEstimate">{player.estimate}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
