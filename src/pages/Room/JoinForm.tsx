import { useState } from 'react'

import { useMutation } from 'app/hooks/useAPI'
import { Player, PlayerInStorage, Room } from 'app/types'
import api from 'app/utils/api'
import storage from 'app/utils/storage'
import { Form } from 'app/ui/Form'
import { TextInput } from 'app/ui/TextInput'
import { Button } from 'app/ui/Button'
import { Headline } from 'app/ui/Headline'
import { Text } from 'app/ui/Text'
import { FormField } from 'app/ui/FormField'
import { RememberMe } from 'app/ui/RememberMe'

import styles from './JoinForm.module.css'

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
    <div className={styles.wrap}>
      <Headline tag="h1">Let's estimate</Headline>

      <Text tag="p">
        You have been invited to join an Estimace room.
        <br />
        Fill in the form below and let's get started!
      </Text>

      <Form
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

        <FormField label="Name">
          <TextInput
            name="name"
            type="text"
            required={true}
            placeholder="your name"
          />
        </FormField>

        <FormField label="Email">
          <TextInput
            name="email"
            type="email"
            required={true}
            placeholder="me@example.com"
          />
        </FormField>

        <RememberMe rememberMe={rememberMeState} />

        <Button disabled={isMutating}>Enter room</Button>
      </Form>
    </div>
  )
}
