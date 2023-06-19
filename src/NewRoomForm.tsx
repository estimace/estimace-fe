import { FC } from 'react'
import { UseMutationResult } from '@tanstack/react-query'

import { Room, Technique } from './types'

type Props = {
  useCreateRoomMutation: UseMutationResult<
    Room,
    unknown,
    React.FormEvent<HTMLFormElement>,
    unknown
  >
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSelect: (e: React.FormEvent<HTMLSelectElement>) => void
  techniques: Technique[]
  ownerName: string
  ownerEmail: string
  technique: string
}

export const NewRoomForm: FC<Props> = (props: Props) => {
  const { mutate, isLoading, isError, error } = props.useCreateRoomMutation

  return (
    <form onSubmit={mutate}>
      {isError && <div>Error happened: {(error as Error).toString()}</div>}

      <label>
        name:
        <input
          name="ownerName"
          type="text"
          required={true}
          value={props.ownerName}
          placeholder="your name"
          onChange={props.handleChange}
        ></input>
      </label>

      <label>
        email:
        <input
          name="ownerEmail"
          type="email"
          required={true}
          value={props.ownerEmail}
          placeholder="me@example.com"
          onChange={props.handleChange}
        ></input>
      </label>

      <label>
        technique:
        <select
          name="techniqueSelection"
          value={props.technique}
          onChange={props.handleSelect}
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
