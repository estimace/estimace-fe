import { FC } from 'react'
import cls from 'clsx'

import Sync from 'app/ui/icons/Sync'

import styles from './LoadingIndicator.module.css'

type Props = {
  className?: string
}

export const LoadingIndicator: FC<Props> = (props) => {
  const { className } = props

  return (
    <div className={cls(styles.wrap, className)}>
      <Sync aria-hidden={true} title="Loading…" />
    </div>
  )
}
