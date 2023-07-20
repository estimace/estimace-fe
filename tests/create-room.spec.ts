import { test, expect, Page } from '@playwright/test'
import { apiUrl, techniqueLabels } from 'app/config'
import { Technique } from 'app/types'
import {
  assertEstimateOptions,
  assertPlayersList,
  assertShareURLSection,
} from './utils'

test.describe('create new room', () => {
  const roomId = '4b81b9b2-e944-42c2-95ee-44ae216d35f8'
  const player = {
    id: '852a0cd5-9de1-4178-949b-a5cad8cdc2aa',
    name: 'Darth Vader',
    email: 'darth@vader.com',
    isOwner: true,
    roomId,
    estimate: null,
  }
  const authToken = 'a-secret-auth-token'

  test('shows empty form based if there is no previous player info in localStorage', async ({
    page,
  }) => {
    await page.goto(`/rooms`)
    await expect(page.getByRole('textbox', { name: 'name' })).toHaveValue('')
    await expect(page.getByRole('textbox', { name: 'email' })).toHaveValue('')
  })

  test('shows prefilled form based on previous player info in localStorage', async ({
    page,
  }) => {
    await page.goto(`/`)
    await page.evaluate(() =>
      window.localStorage.setItem(
        'player',
        JSON.stringify({ name: 'Darth Vader', email: 'darth@vader.com' }),
      ),
    )
    await page.goto(`/rooms`)

    await expect(page.getByRole('textbox', { name: 'name' })).toHaveValue(
      'Darth Vader',
    )
    await expect(page.getByRole('textbox', { name: 'email' })).toHaveValue(
      'darth@vader.com',
    )
  })

  test('creates a room with fibonacci technique and shows a room ready to planning with selected planning technique and the room url to share with players', async ({
    page,
  }) => {
    await createRoom(page, 'fibonacci')

    await assertPlayersList(page, [player])
    await assertEstimateOptions(page, 'fibonacci')
    await assertShareURLSection(page, roomId)
    await expect(page.getByRole('button', { name: /reveal/i })).toBeEnabled()
  })

  // eslint-disable-next-line playwright/expect-expect
  test('creates a room with tShirtSizing technique and shows a room ready to planning with selected planning technique and the room url to share with players', async ({
    page,
  }) => {
    await createRoom(page, 'tShirtSizing')

    await assertPlayersList(page, [player])
    await assertEstimateOptions(page, 'tShirtSizing')
    await assertShareURLSection(page, roomId)
    await expect(page.getByRole('button', { name: /reveal/i })).toBeEnabled()
  })

  async function createRoom(page: Page, technique: Technique) {
    await page.route(`${apiUrl}/rooms`, async (route) => {
      if (route.request().method() !== 'POST') {
        return route.fallback()
      }
      await route.fulfill({
        status: 201,
        json: {
          id: roomId,
          state: 'planning',
          technique: technique,
          players: [{ ...player, authToken }],
        },
      })
    })

    await page.route(`${apiUrl}/rooms/${roomId}`, async (route) => {
      if (route.request().method() !== 'GET') {
        return route.fallback()
      }

      await route.fulfill({
        status: 201,
        json: {
          id: roomId,
          state: 'planning',
          technique: technique,
          players: [player],
        },
      })
    })

    await page.goto(`/rooms`)
    await page.getByRole('textbox', { name: 'Name' }).fill('Darth Vader')
    await page.getByRole('textbox', { name: 'Email' }).fill('darth@vader.com')
    await expect(page.getByLabel(/Technique/gi)).toBeVisible()

    await page
      .getByLabel(/Technique/gi)
      .selectOption(techniqueLabels[technique])
    await page.getByRole('button').click()
  }
})
