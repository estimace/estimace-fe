import { FC } from 'react'
import { Player, Technique } from 'app/types'
import { techniqueOptions } from 'app/config'
import { useSendEstimateWSMessage } from './hooks/useSendEstimateWSMessage'

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
    <section aria-label="estimate options">
      <h1>Select your estimation:</h1>
      {estimationOptions.map((option, index) => {
        return (
          <button
            key={index}
            className="estimationButton"
            data-value={`estimationButton-${option}`}
            onClick={() => sendEstimate(index)}
          >
            {option}
          </button>
        )
      })}
    </section>
  )
}
