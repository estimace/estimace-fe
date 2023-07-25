import { Page, expect } from '@playwright/test'
import { techniqueOptions } from 'app/config'
import { Player, Room, RoomState, Technique } from 'app/types'

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
  await expect(shareRegion).toBeVisible()
  await expect(
    shareRegion.getByRole('button', { name: /copy URL/gi }),
  ).toBeVisible()
  await expect(shareRegion).toContainText(`/rooms/${roomId}`)
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

export async function assertPlayersEstimations(
  page: Page,
  players: Player[],
  technique: Technique = 'fibonacci',
  roomState: RoomState,
  expectedEstimations: Player['estimate'][],
) {
  const $list = page.getByRole('list', { name: "Players' List" })
  await expect($list).toBeVisible()
  const $listItems = $list.getByRole('listitem')

  for (const player of players) {
    const index = players.indexOf(player)
    const $listItem = $listItems.nth(index)
    const playerEstimate = expectedEstimations[index]
      ? techniqueOptions[technique][expectedEstimations[index]]
      : 'did not estimate'

    await expect($listItem).toContainText(
      `${player.name} ${
        roomState === 'revealed' ? playerEstimate : ' is estimating'
      }`,
    )
  }
}

export async function assertStorageValues(
  page: Page,
  roomId: Room['id'],
  player: Pick<Player, 'id' | 'name' | 'email' | 'authToken'>,
) {
  const playerInStorage = await page.evaluate(() =>
    window.localStorage.getItem('player'),
  )
  const roomsInStorage = await page.evaluate(() =>
    window.localStorage.getItem('rooms'),
  )

  expect(playerInStorage).toBeDefined()
  expect(JSON.parse(playerInStorage as string)).toStrictEqual({
    name: player.name,
    email: player.email,
  })

  expect(roomsInStorage).toBeDefined()
  expect(JSON.parse(roomsInStorage as string)).toStrictEqual({
    [roomId]: {
      id: roomId,
      playerId: player.id,
      playerAuthToken: player.authToken,
    },
  })
}
