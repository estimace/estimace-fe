import { FC } from 'react'
import { Player, Technique } from 'app/types'
import { techniqueOptions } from 'app/config'
import { useSendEstimateWSMessage } from './hooks/useSendEstimateWSMessage'

import { Button } from 'app/ui/Button'
import styles from './estimation.module.css'

type Props = {
  player: Player
  technique: Technique
  roomId: string
}

export const Estimation: FC<Props> = (props: Props) => {
  const { player, technique } = props
  const estimationOptions = techniqueOptions[technique]

  const sendEstimate = useSendEstimateWSMessage(player)

  return (
    <section aria-label="estimate options" className={styles.estimationDeck}>
      <h1>Select your estimation:</h1>
      <div className={styles.estimationOptionsWrap}>
        {estimationOptions.map((option, index) => {
          return (
            <Button
              key={index}
              data-value={`estimationButton-${option}`}
              onClick={() => sendEstimate(index)}
              label={option}
              className={styles.estimationOptionsButton}
            />
          )
        })}
      </div>
    </section>
  )
}
