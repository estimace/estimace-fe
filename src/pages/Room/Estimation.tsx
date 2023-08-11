import { FC } from 'react'
import { Player, Technique } from 'app/types'
import { techniqueOptions } from 'app/config'
import { useSendEstimateWSMessage } from './hooks/useSendEstimateWSMessage'

import { Button } from 'app/ui/Button'
import { Swiper } from 'app/ui/Swiper'
import styles from './estimation.module.css'

type Props = {
  player: Player
  technique: Technique
  roomId: string
}

export const Estimation: FC<Props> = (props: Props) => {
  return (
    <section aria-label="estimate options" className={styles.estimationDeck}>
      <h1>Select your estimation:</h1>

      <Swiper
        direction="horizontal"
        className={styles.smallScreenEstimationOptionsWrap}
      >
        <EstimationContent {...props} />
      </Swiper>

      <div className={styles.largeScreenEstimationOptionsWrap}>
        <EstimationContent {...props} />
      </div>
    </section>
  )
}

function EstimationContent(props: Props): JSX.Element {
  const { player, technique } = props
  const estimationOptions = techniqueOptions[technique]

  const sendEstimate = useSendEstimateWSMessage(player)

  return (
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
  )
}
