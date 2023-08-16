import { Player } from 'app/types'

export function sortPlayersByEstimations(players: Player[]): void {
  players.sort(compareAscending)
}

function compareAscending(a: Player, b: Player) {
  if (a.estimate === null && b.estimate === null) return 0
  if (a.estimate === null) return 1
  if (b.estimate === null) return -1
  return a.estimate - b.estimate
}
