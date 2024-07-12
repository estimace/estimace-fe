import { FC, useState } from 'react'

import { Technique } from 'app/types'
import { techniqueLabels } from 'app/config'
import storage from 'app/utils/storage'

import { Form } from 'app/ui/Form'
import { FormField } from 'app/ui/FormField'
import { TextInput } from 'app/ui/TextInput'
import { Select } from 'app/ui/Select'
import { RememberMe } from 'app/ui/RememberMe'
import { Button } from 'app/ui/Button'

type Props = {
  onSubmit: SubmitHandler
  isError: boolean
  isLoading: boolean
  error: Error
  techniques: Technique[]
  name?: string
  email?: string
}

export type SubmitHandler = (item: {
  name: string
  email: string | undefined
  technique: Technique
}) => void

export const RoomCreationForm: FC<Props> = (props) => {
  const [name, setName] = useState(props.name ?? '')
  const [email, setEmail] = useState(props.email ?? '')
  const [technique, setTechnique] = useState<Technique>('fibonacci')
  const rememberMeState = useState(true)

  const { onSubmit, isLoading, isError, error } = props

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'name':
        setName(e.target.value)
        break
      case 'email':
        setEmail(e.target.value)
        break
    }
  }

  const handleSelectOptionChange = (ev: React.FormEvent<HTMLSelectElement>) => {
    setTechnique(ev.currentTarget.value as Technique)
  }

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault()
        if (rememberMeState[0]) {
          storage.setPlayer({
            name,
            email,
          })
        }
        onSubmit({ name, email, technique })
      }}
    >
      {isError && <div>Error happened: {JSON.stringify(error)}</div>}

      <FormField label="Name">
        <TextInput
          name="name"
          type="text"
          required={true}
          value={name}
          onChange={handleFormInputChange}
        ></TextInput>
      </FormField>

      <FormField label="Email">
        <TextInput
          name="email"
          type="email"
          required={true}
          value={email}
          onChange={handleFormInputChange}
        ></TextInput>
      </FormField>

      <FormField label="Technique">
        <Select
          aria-hidden={true}
          name="techniqueSelection"
          value={technique}
          onChange={handleSelectOptionChange}
        >
          {props.techniques.map((item) => (
            <Select.Option
              key={item}
              label={techniqueLabels[item]}
              value={item}
            />
          ))}
        </Select>
      </FormField>

      <RememberMe rememberMe={rememberMeState} />

      <Button disabled={isLoading}>Create Room</Button>
    </Form>
  )
}
