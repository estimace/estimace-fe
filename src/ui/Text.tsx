import { FC } from 'react'
import { clsx } from 'clsx'

import styles from './Text.module.css'

type TextProps = React.HTMLAttributes<HTMLDivElement> &
  React.HTMLAttributes<HTMLParagraphElement> &
  React.HTMLAttributes<HTMLSpanElement> & {
    tag?: 'span' | 'p' | 'div'
    size?: 100 | 200 | 300 | 400 | 500
  }

export const Text: FC<TextProps> = (props) => {
  const { tag = 'span', size = 300, className, children, ...restProps } = props

  const Component = tag

  return (
    <Component
      className={clsx(
        className,
        { [styles.size100]: size === 100 },
        { [styles.size200]: size === 200 },
        { [styles.size300]: size === 300 },
        { [styles.size400]: size === 400 },
        { [styles.size500]: size === 500 },
      )}
      {...restProps}
    >
      {children}
    </Component>
  )
}
