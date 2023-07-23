const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
type RequestHeaders = Record<string, string>

export type ResponseValue<T> = SuccessfulResponse<T> | FailedResponse
export type SuccessfulResponse<T> = {
  errorType: null
  status: number
  data: T
}
export type FailedResponse = {
  errorType: 'network-error' | 'response-error' | 'parse-error'
  status: number
  data: {
    type: string
    title: string
  }
}

export async function request<T>(
  method: RequestMethod,
  url: string,
  options?: { headers?: RequestHeaders; body?: Record<string, unknown> },
): Promise<ResponseValue<T>> {
  let res: Response
  try {
    res = await fetch(url, {
      method,
      headers: { ...defaultHeaders, ...(options?.headers ?? {}) },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    })
  } catch (_) {
    return {
      errorType: 'network-error',
      status: -1,
      data: {
        type: 'request/network-error',
        title: 'could not send the request due to network error',
      },
    }
  }

  try {
    if (res.status < 200 || res.status > 299) {
      return {
        errorType: 'response-error',
        status: res.status,
        data: await res.json(),
      }
    }

    return {
      errorType: null,
      status: res.status,
      data: (await res.json()) as T,
    }
  } catch (_) {
    return {
      errorType: 'parse-error',
      status: res.status,
      data: {
        type: 'request/invalid-json',
        title: 'the body of the response is not a valid JSON',
      },
    }
  }
}
