import { FC } from 'react'
import { Technique } from 'app/types'
import { techniqueOptions } from 'app/config'

type Props = {
  technique: Technique
  roomId: string
  playerId: string
  onEstimateSubmit: EstimationSubmitHandler
}

export type EstimationSubmitHandler = (
  item: EstimationSubmitHandlerParam,
) => void

export type EstimationSubmitHandlerParam = {
  playerId: string
  roomId: string
  estimate: number
}

export const Estimation: FC<Props> = (props: Props) => {
  const estimationOptions = techniqueOptions[props.technique]

  return (
    <section aria-label="estimate options">
      <h1>Select your estimation:</h1>
      {estimationOptions.map((option, index) => {
        return (
          <button
            key={index}
            className="estimationButton"
            data-value={`estimationButton-${option}`}
            onClick={(e) => {
              e.preventDefault()
              props.onEstimateSubmit({
                playerId: props.playerId,
                roomId: props.roomId,
                estimate: index,
              })
            }}
          >
            {option}
          </button>
        )
      })}
    </section>
  )
}
