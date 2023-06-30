import { FC } from 'react'
import { Technique } from '@/types'
import { techniqueOptions } from '@/config'

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
  estimate: string
}

export const Estimation: FC<Props> = (props: Props) => {
  const estimationOptions = techniqueOptions[props.technique]

  return (
    <section className="estimationForm">
      <h1>Select your estimation:</h1>
      {estimationOptions.map((option) => {
        return (
          <button
            key={option}
            className="estimationButton"
            data-value={`estimationButton-${option}`}
            onClick={(e) => {
              e.preventDefault()
              props.onEstimateSubmit({
                playerId: props.playerId,
                roomId: props.roomId,
                estimate: option,
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
