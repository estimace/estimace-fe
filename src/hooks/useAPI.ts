import { APIFunction } from 'app/utils/api'
import { useEffect, useState } from 'react'

export function useQuery<
  T,
  F extends APIFunction<T, Parameters<F>>,
  Q extends () => ReturnType<F>,
  R extends Awaited<ReturnType<Q>>,
>({ params }: { params: { query: Q; onResponse?: (result: R) => void } }) {
  const { query, onResponse } = params
  const [isFetching, setIsFetching] = useState(false)
  const [error, setError] = useState<undefined | null | object>(undefined)
  const [data, setData] = useState<R | undefined>(undefined)

  useEffect(() => {
    if (data || isFetching || error) {
      return
    }

    setIsFetching(true)
    query().then((result) => {
      setError(result.errorType ? result.data : null)
      setData(result.data as R)
      setIsFetching(false)
      onResponse?.(result as R)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { isFetching, error, data }
}

export function useMutation<
  T,
  F extends APIFunction<T, Parameters<F>>,
  R extends Awaited<ReturnType<F>>,
>(fn: F, onResponse: (result: R) => void) {
  const [isMutating, setIsMutating] = useState(false)
  const [error, setError] = useState<undefined | null | object>(undefined)
  const [data, setData] = useState<R | undefined>(undefined)

  const mutate = (...params: Parameters<F>) => {
    if (isMutating) {
      return
    }

    setIsMutating(true)
    fn(...params).then((result) => {
      setError(result.errorType ? result.data : null)
      setData(data)
      setIsMutating(false)
      onResponse(result as R)
    })
  }

  return { mutate, isMutating, error, data }
}
