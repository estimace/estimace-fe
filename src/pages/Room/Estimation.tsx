import { FC } from 'react'
import { Technique } from 'app/types'
import { techniqueOptions } from 'app/config'
import { useSendEstimateWSMessage } from './hooks/useSendEstimateWSMessage'

type Props = {
  technique: Technique
  roomId: string
  playerId: string
  playerAuthToken: string | undefined
}

export const Estimation: FC<Props> = (props: Props) => {
  const { playerId, playerAuthToken, technique } = props
  const estimationOptions = techniqueOptions[technique]
  const sendEstimate = useSendEstimateWSMessage({ playerId, playerAuthToken })

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
