import { FC, ReactElement } from 'react'
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
  const {
    name,
    children,
    defaultValue,
    value,
    onChange,
    className,
    ...restOfProps
  } = props

  return (
    <div className={styles.wrap + ' ' + (className ?? '')}>
      <select
        name={name}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        className={styles.select}
        {...restOfProps}
      >
        {Array.isArray(children)
          ? children.map((item) => (item.type === Select.Option ? item : null))
          : children}
      </select>
    </div>
  )
}

Select.Option = Option
