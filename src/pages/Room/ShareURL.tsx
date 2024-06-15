import { useEffect, useRef, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

import { Room } from 'app/types'
import { getRoomURLInBase64 } from 'app/utils/url'

import { Button } from 'app/ui/Button'
import styles from './shareURL.module.css'

type Props = {
  roomId: Room['id']
}

export const ShareURL: React.FC<Props> = (props) => {
  const roomURL = getRoomURLInBase64(props.roomId)
  const [urlCopied, setUrlCopied] = useState(false)
  const copyURLTimeoutId = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (urlCopied) {
      clearTimeout(copyURLTimeoutId.current)
      copyURLTimeoutId.current = setTimeout(() => {
        setUrlCopied(false)
      }, 3000)
    }
    return () => {
      clearTimeout(copyURLTimeoutId.current)
    }
  }, [urlCopied])

  return (
    <section className={styles.shareRoomURLWrap}>
      <div>
        <CopyToClipboard text={roomURL} onCopy={() => setUrlCopied(true)}>
          <Button variant="secondary">Copy invite link</Button>
        </CopyToClipboard>
      </div>

      {urlCopied && (
        <div role="status" className={styles.copiedRoomURLNotify}>
          Invite link has been copied to the clipboard.
        </div>
      )}
    </section>
  )
}
