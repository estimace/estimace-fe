import { APIFunction } from 'app/utils/api'
import { useEffect, useState } from 'react'

export function useQuery<F extends APIFunction>(params: {
  query: () => ReturnType<F>
  onResponse?: (result: Awaited<ReturnType<F>>) => void
}) {
  const { query, onResponse } = params
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<undefined | null | object>(undefined)
  const [data, setData] = useState<Awaited<ReturnType<F>> | undefined>(
    undefined,
  )

  useEffect(() => {
    if (data || isFetching || error) {
      return
    }

    setIsFetching(true)
    query().then((result) => {
      setError(result.errorType ? result.data : null)
      setData(result.data as Awaited<ReturnType<F>>)
      setIsFetching(false)
      onResponse?.(result as Awaited<ReturnType<F>>)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { isFetching, error, data }
}

export function useMutation<F extends APIFunction>(
  fn: F,
  onResponse: (result: Awaited<ReturnType<F>>) => void,
) {
  const [isMutating, setIsMutating] = useState(false)
  const [error, setError] = useState<undefined | null | object>(undefined)
  const [data, setData] = useState<Awaited<ReturnType<F>> | undefined>(
    undefined,
  )

  function mutate(...params: Parameters<F>) {
    if (isMutating) {
      return
    }

    fn(...params).then((result) => {
      setError(result.errorType ? result.data : null)
      setData(data)
      setIsMutating(false)
      onResponse(result as Awaited<ReturnType<F>>)
    })
  }

  return { mutate, isMutating, error, data }
}
