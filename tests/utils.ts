import { Page, expect } from '@playwright/test'
import { techniqueOptions } from 'app/config'
import { Player, Room, Technique } from 'app/types'

export async function assertEstimateOptions(page: Page, technique: Technique) {
  const estimateOptions = page.getByRole('region', {
    name: /estimate options/i,
  })
  for (const option of techniqueOptions[technique]) {
    await expect(
      estimateOptions.getByRole('button', { name: option, exact: true }),
    ).toHaveText(option)
  }
}

export async function assertShareURLSection(page: Page, roomId: Room['id']) {
  const shareRegion = page.getByRole('region', {
    name: /Share this room URL so your teammates can join/gi,
  })
  await expect(
    shareRegion.getByRole('button', { name: /copy URL/gi }),
  ).toBeVisible()
  await expect(shareRegion).toContainText(
    `http://localhost:5173/rooms/${roomId}`,
  )
}

export async function assertPlayersList(page: Page, players: Player[]) {
  const $list = page.getByRole('list', { name: "Players' List" })
  await expect($list).toBeVisible()
  const $listItems = $list.getByRole('listitem')
  await expect($listItems).toHaveCount(players.length)

  await expect($listItems).toHaveText(
    players.map((item) => new RegExp(item.name, 'gi')),
  )

  for (const player of players) {
    const index = players.indexOf(player)
    const $listItem = $listItems.nth(index)
    await expect($listItem).toContainText(player.name)

    await expect(
      $listItem.getByAltText(`${player.name}'s avatar`),
    ).toHaveAttribute('src', player.pictureURL)
  }
}
