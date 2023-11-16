import { FC } from 'react'
import styles from './TextInput.module.css'

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement>

type TextInputComponent = FC<TextInputProps>

export const TextInput: TextInputComponent = (props) => {
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
