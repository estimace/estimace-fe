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
  const { name, type, isDisabled, label, className, ...restOfProps } = props

  return (
    <button
      {...restOfProps}
      name={name}
      type={type}
      className={[styles.button, className].join(' ')}
      disabled={isDisabled === undefined ? false : isDisabled}
    >
      {label}
    </button>
  )
}
