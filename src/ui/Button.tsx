import { FC } from 'react'
import styles from './Button.module.css'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  name?: string
  type?: string
  isDisabled?: boolean
  label: string
}

type ButtonComponent = FC<ButtonProps>

export const Button: ButtonComponent = (props: ButtonProps) => {
  const { name, type, isDisabled, label, ...restOfProps } = props

  return (
    <button
      name={name}
      type={type}
      className={styles.button}
      disabled={isDisabled === undefined ? false : isDisabled}
    >
      {label}
    </button>
  )
}
