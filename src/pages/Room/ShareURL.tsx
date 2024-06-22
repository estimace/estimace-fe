import { useEffect, useRef, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import cls from 'clsx'

import { Room } from 'app/types'
import { getRoomURLInBase64 } from 'app/utils/url'
import CopyCheck from 'app/ui/icons/CopyCheck'

import { Button } from 'app/ui/Button'
import styles from './shareURL.module.css'

type Props = {
  roomId: Room['id']
}

export const ShareURL: React.FC<Props> = (props) => {
  const roomURL = getRoomURLInBase64(props.roomId)
  const [shouldShowURLCopiedNotification, setShouldShowURLCopiedNotification] =
    useState(false)
  const copyURLTimeoutId = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (shouldShowURLCopiedNotification) {
      clearTimeout(copyURLTimeoutId.current)
      copyURLTimeoutId.current = setTimeout(() => {
        setShouldShowURLCopiedNotification(false)
      }, 1500)
    }
    return () => {
      clearTimeout(copyURLTimeoutId.current)
    }
  }, [shouldShowURLCopiedNotification])

  return (
    <section className={styles.shareRoomURLWrap}>
      <CopyToClipboard
        text={roomURL}
        onCopy={() => setShouldShowURLCopiedNotification(true)}
      >
        <Button variant="secondary">Copy invite link</Button>
      </CopyToClipboard>

      <span
        className={cls(styles.roomURLCopiedNotification, {
          [styles.roomURLCopiedVisibleNotification]:
            shouldShowURLCopiedNotification,
        })}
        role={shouldShowURLCopiedNotification ? 'status' : undefined}
        aria-hidden={shouldShowURLCopiedNotification ? undefined : true}
      >
        <CopyCheck aria-hidden={true} />
        <span className={styles.roomURLCopiedNotificationLabel}>Copied</span>
      </span>
    </section>
  )
}
