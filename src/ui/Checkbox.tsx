import { FC } from 'react'

import styles from './Checkbox.module.css'

type CheckBoxProps = React.SelectHTMLAttributes<HTMLInputElement> & {
  label: string
  value?: string
  defaultChecked?: boolean
  checked?: boolean
}

export const Checkbox: FC<CheckBoxProps> = (props: CheckBoxProps) => {
  const { label, value, checked, ...restProps } = props

  return (
    <label className={styles.wrap}>
      <input {...restProps} type="checkbox" value={value} checked={checked} />
      {label}
    </label>
  )
}
