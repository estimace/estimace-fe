import { FC, useState } from 'react'

import { Technique } from 'app/types'
import { techniqueLabels } from 'app/config'
import { RememberMe } from '../Room/RememberMe'
import storage from 'app/utils/storage'

import styles from './Form.module.css'
import { Select } from './Select'

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

export const RoomCreationForm: FC<Props> = (props: Props) => {
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
    <form
      className={styles.estimaceForm}
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
      {isError && (
        <div className="errorMessageWrapper">
          Error happened: {JSON.stringify(error)}
        </div>
      )}

      <label>
        <span>Name:</span>
        <input
          name="name"
          type="text"
          required={true}
          value={name}
          placeholder="your name"
          onChange={handleFormInputChange}
        ></input>
      </label>

      <label>
        <span>Email:</span>
        <input
          name="email"
          type="email"
          required={true}
          value={email}
          placeholder="me@example.com"
          onChange={handleFormInputChange}
        ></input>
      </label>

      <label>
        <span> Technique:</span>

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
      </label>
      <button name="createRoomButton" className="button" disabled={isLoading}>
        Create
      </button>
      <RememberMe rememberMe={rememberMeState} />
    </form>
  )
}
