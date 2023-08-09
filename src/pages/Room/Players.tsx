import { FC } from 'react'
import { Player, Room, RoomState } from 'app/types'
import { techniqueOptions } from 'app/config'

import styles from './players.module.css'

type Props = {
  players: Player[]
  technique: Room['technique']
  state: RoomState
}

export const PlayersInRoom: FC<Props> = (props: Props) => {
  const { players, state, technique } = props

  return (
    <ul aria-label="Players' List" className={styles.playersList}>
      {players.map((player) => {
        return (
          <li key={player.id}>
            {player.pictureURL && (
              <img src={player.pictureURL} alt={`${player.name}'s avatar`} />
            )}
            <span>{player.name}</span>{' '}
            {state === 'planning' && player.estimate === null && (
              <span className={styles.isEstimating}>is estimating</span>
            )}
            {state === 'planning' && player.estimate !== null && (
              <span className={styles.estimated}>estimated</span>
            )}
            {state === 'revealed' && player.estimate !== null && (
              <span className={styles.revealedEstimation}>
                {techniqueOptions[technique][player.estimate]}
              </span>
            )}
            {state === 'revealed' && player.estimate === null && (
              <span className={styles.notEstimated}>did not estimate</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
