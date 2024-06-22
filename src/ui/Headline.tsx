import { FC } from 'react'
import { clsx } from 'clsx'

import styles from './Headline.module.css'

type HeadlineProps = React.HTMLAttributes<HTMLHeadingElement> &
  React.HTMLAttributes<HTMLSpanElement> & {
    tag: 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
    size?: 100 | 200 | 300 | 400 | 500 | 600
  }

export const Headline: FC<HeadlineProps> = (props) => {
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
