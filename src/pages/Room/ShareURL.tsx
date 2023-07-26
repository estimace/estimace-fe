import { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { getBaseURL } from 'app/config'
import { Room } from 'app/types'

type Props = {
  roomId: Room['id']
}

export const ShareURL: React.FC<Props> = (props) => {
  const roomURL = `${getBaseURL()}/rooms/${props.roomId}`
  const [urlCopied, setUrlCopied] = useState(false)

  return (
    <section aria-labelledby="estimace-share-url-title">
      <div id="estimace-share-url-title">
        Share this room URL so your teammates can join:
      </div>

      <CopyToClipboard text={roomURL} onCopy={() => setUrlCopied(true)}>
        <button>Copy URL</button>
      </CopyToClipboard>

      <span aria-hidden={urlCopied}>{roomURL}</span>

      {urlCopied && <div>Room URL copied to the clipboard</div>}
    </section>
  )
}
