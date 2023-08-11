// The use of any is intentional and is needed in this case
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function debounce<F extends (...args: any[]) => void>(
  fn: F,
  ms?: number,
) {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: never, ...args: Parameters<F>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.call(this, ...args), ms ?? 10)
  }
}
