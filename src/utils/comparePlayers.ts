import { Player } from 'app/types'

export function playersCompare(orderBy: 'name' | 'estimate') {
  if (orderBy === 'name') {
    return compareByName
  } else {
    return compareByEstimate
  }
}

function compareByEstimate(a: Player, b: Player) {
  if (a.estimate === null && b.estimate === null) return 0
  if (a.estimate === null) return 1
  if (b.estimate === null) return -1
  return a.estimate - b.estimate
}

function compareByName(a: Player, b: Player) {
  if (a.name < b.name) {
    return -1
  }
  if (a.name > b.name) {
    return 1
  }
  return 0
}
