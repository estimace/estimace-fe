import { FC } from 'react'
import styles from './TextInput.module.css'

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string
  type: 'text' | 'email'
  value?: string
  placeholder?: string
  required?: boolean
}

type TextInputComponent = FC<TextInputProps>

export const TextInput: TextInputComponent = (props: TextInputProps) => {
  const {
    name,
    type,
    required,
    value,
    onChange,
    placeholder,
    className,
    ...restOfProps
  } = props
  return (
    <input
      className={
        className ? [className, styles.textInput].join(' ') : styles.textInput
      }
      name={name}
      type={type}
      required={required === undefined ? false : required}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      {...restOfProps}
    />
  )
}
