import { FC, ReactNode } from 'react'
import { clsx } from 'clsx'

import styles from './FormField.module.css'

type FormFieldProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  label: string
  children: ReactNode
}

export const FormField: FC<FormFieldProps> = (props) => {
  const { label, children, className, ...restProps } = props

  return (
    <label className={clsx(styles.wrap, className)} {...restProps}>
      <span className={styles.label}>{label}:</span>
      {children}
    </label>
  )
}
