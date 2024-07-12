import { FC } from 'react'
import styles from './Button.module.css'
import cls from 'clsx'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: string
  variant?: 'primary' | 'secondary'
}

export const Button: FC<ButtonProps> = (props) => {
  const {
    variant = 'primary',
    name,
    children,
    className,
    ...restOfProps
  } = props

  return (
    <button
      {...restOfProps}
      name={name}
      className={cls(
        styles.button,
        variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
        className,
      )}
    >
      {children}
    </button>
  )
}
