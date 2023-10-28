import { FC } from 'react'
import styles from './Button.module.css'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: string
}

export const Button: FC<ButtonProps> = (props) => {
  const { name, children, className, ...restOfProps } = props

  return (
    <button
      {...restOfProps}
      name={name}
      className={[styles.button, className].join(' ')}
    >
      {children}
    </button>
  )
}
