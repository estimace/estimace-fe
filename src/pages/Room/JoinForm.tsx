import { useMutation } from 'app/hooks/useAPI'
import { Player, PlayerInStorage, Room } from 'app/types'
import api from 'app/utils/api'
import storage from 'app/utils/storage'

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
      onSubmit={(e: React.FormEvent<CustomForm>) => {
        e.preventDefault()
        const target = e.currentTarget.elements
        const param: PlayerInStorage = {
          name: target.name.value,
          email: target.email.value,
        }

        if (param.name && param.email) {
          storage.setPlayer(param)
          mutate(roomId, param)
        }
      }}
    >
      {error && <div>An error occurred while joining the room.</div>}

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
      <button disabled={isMutating}>Enter</button>
    </form>
  )
}
