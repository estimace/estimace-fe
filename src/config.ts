import { TechniquesOptions, TechniquesLabels } from './types'

export const apiUrl = '/api'

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
