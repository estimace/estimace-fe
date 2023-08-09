import { useState } from 'react'

import { useMutation } from 'app/hooks/useAPI'
import { Player, PlayerInStorage, Room } from 'app/types'
import api from 'app/utils/api'
import storage from 'app/utils/storage'
import { RememberMe } from './RememberMe'

import styles from 'app/pages/form.module.css'
import { TextInput } from 'app/ui/TextInput'
import { Button } from 'app/ui/Button'

type Props = {
  roomId: Room['id']
  onSubmit: (player: Player) => void
}

interface CustomElements extends HTMLFormControlsCollection {
  name: HTMLInputElement
  email: HTMLInputElement
}

interface CustomForm extends HTMLFormElement {
  readonly elements: CustomElements
}

export const JoinForm: React.FC<Props> = (props: Props) => {
  const { roomId, onSubmit } = props
  const rememberMeState = useState(true)

  const { mutate, isMutating, error } = useMutation(
    api.addPlayerToRoom,
    (result) => {
      if (!result.errorType) {
        onSubmit(result.data)
      }
    },
  )

  return (
    <form
      className={styles.form}
      onSubmit={(e: React.FormEvent<CustomForm>) => {
        e.preventDefault()
        const target = e.currentTarget.elements
        const param: PlayerInStorage = {
          name: target.name.value,
          email: target.email.value,
        }

        if (param.name && param.email) {
          if (rememberMeState[0]) {
            storage.setPlayer(param)
          }
          mutate(roomId, param)
        }
      }}
    >
      {error && <div>An error occurred while joining the room.</div>}

      <label>
        <span>Name:</span>
        <TextInput
          name="name"
          type="text"
          required={true}
          placeholder="your name"
        />
      </label>

      <label>
        <span>Email:</span>
        <TextInput
          name="email"
          type="email"
          required={true}
          placeholder="me@example.com"
        />
      </label>

      <Button label={'Enter'} isDisabled={isMutating} />
      <RememberMe rememberMe={rememberMeState} />
    </form>
  )
}
