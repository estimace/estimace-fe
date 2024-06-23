import { FC, ReactElement } from 'react'
import clsx from 'clsx'

import styles from './Select.module.css'

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactElement<OptionProps> | ReactElement<OptionProps>[]
  name?: string
  defaultValue?: string
  value?: string
}

type OptionProps = {
  value: string
  label: string
}

type SelectComponent = FC<SelectProps> & { Option: OptionComponent }
type OptionComponent = FC<OptionProps>

const Option: OptionComponent = (props: OptionProps) => {
  return <option value={props.value}>{props.label}</option>
}

export const Select: SelectComponent = (props: SelectProps) => {
  const { children, className, ...restOfProps } = props

  return (
    <div className={clsx(styles.wrap, className)}>
      <select className={styles.select} {...restOfProps}>
        {Array.isArray(children)
          ? children.map((item) => (item.type === Select.Option ? item : null))
          : children}
      </select>
    </div>
  )
}

Select.Option = Option
