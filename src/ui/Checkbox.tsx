import { FC } from 'react'

import styles from './Checkbox.module.css'

type CheckBoxProps = React.SelectHTMLAttributes<HTMLInputElement> & {
  value?: string
  defaultChecked?: boolean
  checked?: boolean
}

export const Checkbox: FC<CheckBoxProps> = (props: CheckBoxProps) => {
  const { value, checked, ...restProps } = props

  return (
    <input
      {...restProps}
      type="checkbox"
      value={value}
      checked={checked}
      className={styles.checkbox}
    />
  )
}
