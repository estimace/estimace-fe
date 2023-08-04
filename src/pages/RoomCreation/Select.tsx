import { FC } from 'react'
import styles from './Select.module.css'

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  children: JSX.Element[]
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

const Option: OptionComponent = (props) => {
  return <option value={props.value}>{props.label}</option>
}

export const Select: SelectComponent = (props: SelectProps) => {
  const { name, children, defaultValue, value, onChange, ...restOfProps } =
    props

  return (
    <div className={styles.wrap}>
      <select
        name={name}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        className={styles.select}
        {...restOfProps}
      >
        {children.map((item) => (item.type === Select.Option ? item : null))}
      </select>
    </div>
  )
}

Select.Option = Option
