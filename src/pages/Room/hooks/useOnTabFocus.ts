import { useEffect } from 'react'

export function useOnTabFocus(callback: () => void) {
  useEffect(() => {
    window.addEventListener('focus', callback)
    return () => {
      window.removeEventListener('focus', callback)
    }

    // we only need to run the hook once the component has been mounted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
