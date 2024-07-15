import { FC } from 'react'
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom'
import cls from 'clsx'

import styles from './Link.module.css'

type LinkProps = RouterLinkProps

export const Link: FC<LinkProps> = (props: LinkProps) => {
  const { children, className, ...restProps } = props

  return (
    <RouterLink className={cls(styles.link, className)} {...restProps}>
      {children}
    </RouterLink>
  )
}
