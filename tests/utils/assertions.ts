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

export async function assertShareURLSection(page: Page) {
  const shareRegion = page.getByRole('region', {
    name: 'Copy Room URL To Share',
  })
  const shareButton = shareRegion.getByRole('button', {
    name: /Copy invite link/gi,
  })

  await expect(shareButton).toBeVisible()
  //when the button is clicked we should check that a notification appears and disappears again.
  await expect(
    shareRegion.getByLabel('Copied Room URL Notification'),
  ).toBeHidden()
  await shareButton.click()

  await expect(shareRegion).toContainText('Copied')
  await expect(shareRegion.locator('svg')).toBeVisible()
  await expect(shareRegion.locator('svg')).toHaveAttribute(
    'aria-hidden',
    'true',
  )

  await expect(shareRegion.locator('svg')).toBeHidden()
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

    // We don't show player's avatar
    //await expect(
    //   $listItem.getByAltText(`${player.name}'s avatar`),
    // ).toHaveAttribute('src', player.pictureURL)
  }
}

export async function assertPlayerEstimationStatus(
  page: Page,
  playerName: Player['name'],
  status: 'is estimating' | 'estimated',
) {
  await expect(
    page.getByRole('listitem', { name: `${playerName} ${status}` }),
  ).toBeVisible()
}

export async function assertPlayersEstimations(
  page: Page,
  players: Player[],
  technique: Technique = 'fibonacci',
  roomState: RoomState,
  expectedEstimations: Player['estimate'][],
) {
  //This assertion checks players estimates when roomOwner changes rooomState (Revealed/Planning)

  const $list = page.getByRole('list', { name: "Players' List" })
  await expect($list).toBeVisible()
  const $listItems = $list.getByRole('listitem')

  for (const player of players) {
    const index = players.indexOf(player)

    const playerEstimate =
      expectedEstimations[index] !== null
        ? `estimated ${techniqueOptions[technique][expectedEstimations[index]]}`
        : 'did not estimate'

    const $listItem = page.getByRole('listitem', {
      name: `${player.name} ${
        roomState === 'revealed' ? playerEstimate : 'is estimating'
      }`,
    })
    await expect($listItem).toBeVisible()
  }
}

export async function assertStorageValues(
  page: Page,
  roomId: Room['id'],
  player: Pick<Player, 'id' | 'name' | 'email' | 'authToken'>,
  rememberPlayer = true,
) {
  const playerInStorage = await page.evaluate(() =>
    window.localStorage.getItem('player'),
  )
  if (!rememberPlayer) {
    expect(playerInStorage).toBeNull()
    expect(playerInStorage).toBeFalsy()
  } else {
    expect(playerInStorage).toBeDefined()
    expect(JSON.parse(playerInStorage as string)).toStrictEqual({
      name: player.name,
      email: player.email,
    })
  }

  const roomsInStorage = await page.evaluate(() =>
    window.localStorage.getItem('rooms'),
  )
  expect(roomsInStorage).toBeDefined()
  expect(JSON.parse(roomsInStorage as string)).toStrictEqual({
    [roomId]: {
      id: roomId,
      playerId: player.id,
      playerAuthToken: player.authToken,
    },
  })
}
