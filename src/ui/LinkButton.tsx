import { FC } from 'react'
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom'
import cls from 'clsx'

import styles from './LinkButton.module.css'

type LinkProps = RouterLinkProps & {
  variant?: 'primary' | 'secondary'
}

export const LinkButton: FC<LinkProps> = (props: LinkProps) => {
  const { children, variant = 'primary', className, ...restProps } = props

  return (
    <RouterLink
      className={cls(
        styles.link,
        variant === 'primary' ? styles.primaryLink : styles.secondaryLink,
        className,
      )}
      {...restProps}
    >
      {children}
    </RouterLink>
  )
}
