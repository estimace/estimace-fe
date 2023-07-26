type Props = {
  rememberMe: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

export const RememberMe: React.FC<Props> = (props) => {
  const [rememberMe, setRememberMe] = props.rememberMe

  return (
    <label htmlFor="rememberMe">
      <input
        type="checkbox"
        id="rememberMe"
        name="rememberMe"
        value={rememberMe ? 'true' : 'false'}
        checked={rememberMe}
        onChange={() => {
          setRememberMe(!rememberMe)
        }}
      />
      Remember Me
    </label>
  )
}
