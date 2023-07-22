import { getBaseURL } from 'app/config'
import { Room } from 'app/types'

type Props = {
  roomId: Room['id']
}

export const ShareURL: React.FC<Props> = (props) => {
  return (
    <section aria-labelledby="estimace-share-url-title">
      <div id="estimace-share-url-title">
        Share this room URL so your teammates can join:
      </div>
      <div aria-hidden>
        {getBaseURL()}/rooms/{props.roomId}
      </div>
      <button>Copy URL</button>
    </section>
  )
}
