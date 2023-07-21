import { FC } from 'react'
import { PlayerInStorage } from 'app/types'

type Props = {
  onSubmit: (player: PlayerInStorage) => void
}

interface CustomElements extends HTMLFormControlsCollection {
  name: HTMLInputElement
  email: HTMLInputElement
}

interface CustomForm extends HTMLFormElement {
  readonly elements: CustomElements
}

export const JoinForm: FC<Props> = (props: Props) => {
  return (
    <form
      onSubmit={(e: React.FormEvent<CustomForm>) => {
        e.preventDefault()
        const target = e.currentTarget.elements
        if (target.name.value && target.email.value) {
          props.onSubmit({
            name: target.name.value,
            email: target.email.value,
          })
        }
      }}
    >
      <label>
        name:
        <input name="name" type="text" required placeholder="your name"></input>
      </label>

      <label>
        email:
        <input
          name="email"
          type="email"
          required
          placeholder="me@example.com"
        ></input>
      </label>
      <button>Enter</button>
    </form>
  )
}
