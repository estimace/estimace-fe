import { FC } from 'react'
import cls from 'clsx'

import { Player, Room, RoomState } from 'app/types'
import { techniqueOptions } from 'app/config'

import styles from './players.module.css'
import Dots from 'app/ui/icons/Dots'
import Check from 'app/ui/icons/Check'
import ExclamationMark from 'app/ui/icons/ExclamationMark'

type Props = {
  players: Player[]
  technique: Room['technique']
  state: RoomState
  showPlayerPicture?: boolean
}

export const PlayersInRoom: FC<Props> = (props: Props) => {
  const { players, state, technique, showPlayerPicture = false } = props

  return (
    <ul aria-label="Players' List" className={styles.playersList}>
      {players.map((player) => {
        return (
          <li key={player.id}>
            {showPlayerPicture && player.pictureURL && (
              <img
                src={player.pictureURL}
                alt={`${player.name}'s avatar`}
                className={styles.playerAvatar}
              />
            )}
            <span className={styles.playerName}>{player.name}</span>{' '}
            {state === 'planning' && player.estimate === null && (
              <span
                className={cls(
                  styles.estimationStatus,
                  styles.estimationStatusEstimating,
                )}
              >
                <Dots />
              </span>
            )}
            {state === 'planning' && player.estimate !== null && (
              <span
                className={cls(
                  styles.estimationStatus,
                  styles.estimationStatusEstimated,
                )}
              >
                <Check />
              </span>
            )}
            {state === 'revealed' && player.estimate !== null && (
              <span
                aria-label={`estimated ${
                  techniqueOptions[technique][player.estimate]
                }`}
                className={cls(
                  styles.estimationStatus,
                  styles.estimationStatusRevealedWithValue,
                )}
              >
                {techniqueOptions[technique][player.estimate]}
              </span>
            )}
            {state === 'revealed' && player.estimate === null && (
              <span
                className={cls(
                  styles.estimationStatus,
                  styles.estimationStatusRevealedWithoutValue,
                )}
              >
                <ExclamationMark />
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
