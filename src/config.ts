import { TechniquesOptions, TechniquesLabels } from './types'

export const apiPath = '/api'

/**
 * we want to be able to change the websocket URL for each test by setting the
 * `window.WS_URL` to have an isolated ws mock server per test. this way we can
 * run tests in parallel without having effects on each other. This feature is
 * disabled in production mode.
 */
export const getWebsocketServerURL = () => {
  const mode = import.meta.env.MODE
  const apiHost = window.location.host // e.g localhost:3500
  return `ws://${
    mode !== 'production' && window.WS_URL
      ? window.WS_URL
      : apiHost + apiPath + '/socket'
  }`
}

export const getBaseURL = () => {
  return window.location.origin
}

export const techniqueLabels: TechniquesLabels = {
  fibonacci: 'Fibonacci',
  tShirtSizing: 'T-Shirt Sizing',
}

export const techniqueOptions: TechniquesOptions = {
  fibonacci: [
    '0',
    '0.5',
    '1',
    '2',
    '3',
    '5',
    '8',
    '13',
    '20',
    '40',
    '100',
    '?',
  ],

  tShirtSizing: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '?'],
}
