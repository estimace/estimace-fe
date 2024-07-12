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
        const listItemAriaLabel =
          state === 'planning'
            ? player.estimate === null
              ? 'is estimating'
              : 'estimated'
            : player.estimate !== null
            ? `estimated ${techniqueOptions[technique][player.estimate]}`
            : 'did not estimate'

        return (
          <li
            key={player.id}
            aria-label={`${player.name} ${listItemAriaLabel}`}
          >
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
                <Dots aria-hidden="true" role="img" />
              </span>
            )}
            {state === 'planning' && player.estimate !== null && (
              <span
                className={cls(
                  styles.estimationStatus,
                  styles.estimationStatusEstimated,
                )}
              >
                <Check aria-hidden="true" role="img" />
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
                <ExclamationMark aria-hidden="true" role="img" />
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
