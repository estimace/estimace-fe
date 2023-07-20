import { test, expect } from '@playwright/test'
import { apiUrl } from 'app/config'
import {
  assertEstimateOptions,
  assertPlayersList,
  assertShareURLSection,
} from './utils'
import { Player } from 'app/types'

test.describe('new player enters the room via shared url', () => {
  const roomId = '4b81b9b2-e944-42c2-95ee-44ae216d35f8'
  const owner: Player = {
    id: 'a7e2e105-b694-486d-abdd-23b174dfae9a',
    roomId: roomId,
    name: 'Luke Skywalker',
    email: 'luke@skywalker.com',
    isOwner: true,
    estimate: null,
  }
  const player: Player = {
    id: '4ed040c2-0cb0-438f-b59d-8eaf873c4fdf',
    roomId: roomId,
    name: 'Darth Vader',
    email: 'darth@vader.com',
    isOwner: false,
    estimate: null,
  }
  const playerAuthToken: Player['authToken'] = 'a-secret-auth-token'

  test('shows the room entry form for the new player whose local storage does not contain room info', async ({
    page,
  }) => {
    await page.goto(`/rooms/${roomId}`)

    await expect(page.getByRole('textbox', { name: 'name' })).toHaveValue('')
    await expect(page.getByRole('textbox', { name: 'email' })).toHaveValue('')
    await expect(page.getByRole('button', { name: /enter/i })).toBeVisible()
  })

  test('new player enters the room providing form data and has their info stored in local storage', async ({
    page,
    context,
  }) => {
    await page.route(`${apiUrl}/rooms/${roomId}/players`, (route) => {
      if (route.request().method() !== 'POST') {
        return route.fallback()
      }

      route.fulfill({
        status: 201,
        json: {
          ...player,
          authToken: playerAuthToken,
        },
      })
    })

    await page.route(`${apiUrl}/rooms/${roomId}`, (route) => {
      if (route.request().method() !== 'GET') {
        return route.fallback()
      }

      route.fulfill({
        status: 201,
        json: {
          id: roomId,
          state: 'planning',
          technique: 'fibonacci',
          players: [owner, player],
        },
      })
    })

    await page.goto(`/rooms/${roomId}`)

    await page.getByRole('textbox', { name: 'name' }).fill('Darth Vader')
    await page.getByRole('textbox', { name: 'email' }).fill('darth@vader.com')
    await page.getByRole('button', { name: /enter/i }).click()

    const storage = await context.storageState()
    const playerInStorage = storage.origins[0].localStorage.find(
      (item) => item.name === 'player',
    )?.value

    const roomsInStorage = storage.origins[0].localStorage.find(
      (item) => item.name === 'rooms',
    )?.value

    expect(playerInStorage).toBeDefined()
    expect(JSON.parse(playerInStorage as string)).toStrictEqual({
      name: 'Darth Vader',
      email: 'darth@vader.com',
    })

    expect(roomsInStorage).toBeDefined()
    expect(JSON.parse(roomsInStorage as string)).toStrictEqual({
      [roomId]: {
        id: roomId,
        playerId: player.id,
        playerAuthToken: playerAuthToken,
      },
    })

    await assertPlayersList(page, [owner, player])
    await assertEstimateOptions(page, 'fibonacci')
    await assertShareURLSection(page, roomId)
    await expect(page.getByRole('button', { name: /reveal/i })).toBeHidden()
  })
})
