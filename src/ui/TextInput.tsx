import { FC } from 'react'
import styles from './TextInput.module.css'
import clsx from 'clsx'

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>

type TextInputComponent = FC<TextInputProps>

export const TextInput: TextInputComponent = (props) => {
  const { className, ...restOfProps } = props
  return (
    <input className={clsx(styles.textInput, className)} {...restOfProps} />
  )
}
