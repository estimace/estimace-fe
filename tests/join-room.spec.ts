import { test, expect } from '@playwright/test'
import { apiUrl } from 'app/config'
import { assertEstimateOptions } from './utils'

test.describe('new player enters the room via shared url', () => {
  const roomId = '4b81b9b2-e944-42c2-95ee-44ae216d35f8'
  const playerId = '852a0cd5-9de1-4178-949b-a5cad8cdc2aa'
  const authToken = 'a-secret-auth-token'

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
          id: playerId,
          roomId: roomId,
          name: 'Darth Vader',
          email: 'darth@vader.com',
          isOwner: false,
          authToken,
          estimate: null,
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
          players: [
            {
              id: 'a7e2e105-b694-486d-abdd-23b174dfae9a',
              roomId: roomId,
              name: 'Luke Skywalker',
              email: 'luke@skywalker.com',
              isOwner: true,
              estimate: null,
            },
            {
              id: playerId,
              roomId: roomId,
              name: 'Darth Vader',
              email: 'darth@vader.com',
              isOwner: false,
              estimate: null,
            },
          ],
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
    expect(JSON.parse(playerInStorage as string)).toBe({
      name: 'Darth Vader',
      email: 'darth@vader.com',
    })

    expect(roomsInStorage).toBeDefined()
    expect(JSON.parse(roomsInStorage as string)).toBe({
      [roomId]: {
        id: roomId,
        playerId,
        playerAuthTone: authToken,
      },
    })

    await assertEstimateOptions(page, 'fibonacci')

    await expect(
      page.getByRole('button', { name: /reveal/i }),
    ).not.toBeVisible()
  })
})
