import { TechniquesOptions, TechniquesLabels } from './types'

export const mode = import.meta.env.MODE
export const apiPath = '/api'
export const apiHost = window.location.host // e.g localhost:3500

/**
 * we want to be able to change the websocket URL for each test by setting the
 * `window.WS_URL` to have an isolated ws mock server per test. this way we can
 * run tests in parallel without having effects on each other. This feature is
 * disabled in production mode.
 */
export const wsURL = `ws://${
  mode !== 'production' && window.WS_URL
    ? window.WS_URL
    : apiHost + apiPath + '/socket'
}`

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
