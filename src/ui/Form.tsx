import { FC } from 'react'
import { clsx } from 'clsx'

import styles from './Form.module.css'

type FormFieldProps = React.FormHTMLAttributes<HTMLFormElement>

export const Form: FC<FormFieldProps> = (props) => {
  const { children, className, ...restProps } = props

  return (
    <form className={clsx(styles.wrap, className)} {...restProps}>
      {children}
    </form>
  )
}
