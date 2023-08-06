import { Checkbox } from 'app/ui/Checkbox.tsx'

type Props = {
  rememberMe: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

export const RememberMe: React.FC<Props> = (props) => {
  const [rememberMe, setRememberMe] = props.rememberMe

  return (
    <label>
      <Checkbox
        checked={rememberMe}
        onChange={() => setRememberMe(!rememberMe)}
      />
      Remember Me
    </label>
  )
}
