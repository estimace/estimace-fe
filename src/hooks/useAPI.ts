import { APIFunction } from 'app/utils/api'
import { useCallback, useEffect, useState } from 'react'

export function useQuery<
  T,
  F extends APIFunction<T, Parameters<F>>,
  Q extends () => ReturnType<F>,
  R extends Awaited<ReturnType<Q>>,
>(query: Q) {
  const [isFetching, setIsFetching] = useState(false)
  const [result, setResult] = useState<R | undefined>(undefined)

  const refresh = useCallback(() => {
    setIsFetching(false)
    setResult(undefined)
  }, [])

  useEffect(() => {
    if (result || isFetching) {
      return
    }

    setIsFetching(true)
    query().then((result) => {
      setResult(result as R)
      setIsFetching(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetching, result])

  return { isFetching, result, refresh }
}

export function useMutation<
  T,
  F extends APIFunction<T, Parameters<F>>,
  R extends Awaited<ReturnType<F>>,
>(fn: F, onResponse: (result: R) => void) {
  const [isMutating, setIsMutating] = useState(false)
  const [error, setError] = useState<undefined | null | object>(undefined)
  const [data, setData] = useState<R['data'] | undefined>(undefined)

  const mutate = async (...params: Parameters<F>) => {
    if (isMutating) {
      return
    }

    setIsMutating(true)
    const result = await fn(...params)
    setError(result.errorType ? result.data : null)
    setData(result.data)
    setIsMutating(false)
    onResponse(result as R)
  }

  return { mutate, isMutating, error, data }
}
