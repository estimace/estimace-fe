import { FC, useState } from 'react'

import { Technique } from './types'

type Props = {
  onSubmit: SubmitHandler
  isError: boolean
  isLoading: boolean
  error: Error
  techniques: Technique[]
  ownerName?: string
  ownerEmail?: string
}

export type SubmitHandler = (item: SubmitHandlerParam) => void

export type SubmitHandlerParam = {
  ownerName: string
  ownerEmail: string
  technique: Technique
}

export const NewRoomForm: FC<Props> = (props: Props) => {
  const [ownerName, setOwnerName] = useState(props.ownerName ?? '')
  const [ownerEmail, setOwnerEmail] = useState(props.ownerEmail ?? '')
  const [technique, setTechnique] = useState<Technique>('fibonacci')

  const { onSubmit, isLoading, isError, error } = props

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'ownerName':
        setOwnerName(e.target.value)
        break
      case 'ownerEmail':
        setOwnerEmail(e.target.value)
        break
    }
  }

  const handleSelectOptionChange = (e: React.FormEvent<HTMLSelectElement>) => {
    setTechnique(e.currentTarget.value as Technique)
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit({ ownerName, ownerEmail, technique })
      }}
    >
      {isError && <div>Error happened: {(error as Error).toString()}</div>}

      <label>
        name:
        <input
          name="ownerName"
          type="text"
          required={true}
          value={ownerName}
          placeholder="your name"
          onChange={handleFormInputChange}
        ></input>
      </label>

      <label>
        email:
        <input
          name="ownerEmail"
          type="email"
          required={true}
          value={ownerEmail}
          placeholder="me@example.com"
          onChange={handleFormInputChange}
        ></input>
      </label>

      <label>
        technique:
        <select
          name="techniqueSelection"
          value={technique}
          onChange={handleSelectOptionChange}
        >
          {props.techniques.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <button name="createRoomButton" className="button" disabled={isLoading}>
        Create
      </button>
    </form>
  )
}
