import { FC } from 'react'
import { PlayerInStorage } from './types'

type Props = {
  onSubmit: (player: PlayerInStorage) => void
}

interface CustomElements extends HTMLFormControlsCollection {
  playerName: HTMLInputElement
  playerEmail: HTMLInputElement
}

interface CustomForm extends HTMLFormElement {
  readonly elements: CustomElements
}

export const RoomEntryForm: FC<Props> = (props: Props) => {
  return (
    <form
      onSubmit={(e: React.FormEvent<CustomForm>) => {
        e.preventDefault()
        const target = e.currentTarget.elements
        if (!target.playerName.value || !target.playerEmail.value) return

        props.onSubmit({
          name: target.playerName.value,
          email: target.playerEmail.value,
        })
      }}
    >
      <label>
        name:
        <input
          name="playerName"
          type="text"
          required={true}
          placeholder="your name"
        ></input>
      </label>

      <label>
        email:
        <input
          name="playerEmail"
          type="email"
          required={true}
          placeholder="me@example.com"
        ></input>
      </label>
      <button>Enter</button>
    </form>
  )
}
