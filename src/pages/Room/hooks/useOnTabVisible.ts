import { useCallback, useEffect } from 'react'

export function useOnTabVisible(callback: () => void) {
  const onVisibilitychange = useCallback(() => {
    if (document.visibilityState === 'visible') {
      callback()
    }
  }, [callback])

  useEffect(() => {
    window.addEventListener('focus', callback)
    window.addEventListener('pageshow', callback)
    document.addEventListener('visibilitychange', onVisibilitychange)
    return () => {
      window.removeEventListener('focus', callback)
      window.removeEventListener('pageshow', callback)
      document.removeEventListener('visibilitychange', onVisibilitychange)
    }

    // we only need to run the hook once the component has been mounted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
