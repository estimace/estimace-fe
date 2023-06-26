import { FC } from 'react'
import { Technique } from '@/types'
import { techniqueOptions } from '@/config'
import { submitPlayerEstimation } from '@/utils'

type Props = {
  technique: Technique
  roomId: string
  playerId: string
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
              submitPlayerEstimation(props.playerId, props.roomId, option)
            }}
          >
            {option}
          </button>
        )
      })}
    </section>
  )
}
