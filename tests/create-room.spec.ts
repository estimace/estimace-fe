import { test, expect, Page } from '@playwright/test'
import { apiUrl, techniqueLabels, techniqueOptions } from '../src/config'
import { Technique } from '../src/types'

test.describe('create new room', () => {
  const roomId = '4b81b9b2-e944-42c2-95ee-44ae216d35f8'
  const playerId = '852a0cd5-9de1-4178-949b-a5cad8cdc2aa'
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

    const $players = await page.getByRole('list', { name: "Players' List" })
    await expect($players).toBeVisible()
    const $player = await $players.getByRole('listitem')
    await expect($player).toHaveCount(1)
    await expect($player).toContainText('Darth Vader')

    await expect($player.getByAltText("Darth Vader's avatar")).toHaveAttribute(
      'src',
      'https://www.gravatar.com/avatar/f6cb5b374808419ff6fc55b73a1983bd&d=retro',
    )

    await expect(page.getByRole('button', { name: /reveal/i })).toBeEnabled()

    const shareRegion = page.getByRole('region', {
      name: /Share this room URL so your teammates can join/gi,
    })
    await expect(
      shareRegion.getByRole('button', { name: /copy URL/gi }),
    ).toBeVisible()
    await expect(shareRegion).toContainText(
      `http://localhost:5173/rooms/${roomId}`,
    )

    const estimateOptions = page.getByRole('region', {
      name: /estimate options/i,
    })
    for (const option of techniqueOptions.fibonacci) {
      expect(
        estimateOptions.getByRole('button', { name: option, exact: true }),
      ).toHaveText(option)
    }
  })

  test('creates a room with tShirtSizing technique and shows a room ready to planning with selected planning technique and the room url to share with players', async ({
    page,
  }) => {
    await createRoom(page, 'tShirtSizing')

    const estimateOptions = page.getByRole('region', {
      name: /estimate options/i,
    })

    for (const option of techniqueOptions.tShirtSizing) {
      await expect(
        estimateOptions.getByRole('button', { name: option, exact: true }),
      ).toHaveText(option)
    }
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
          players: [
            {
              id: playerId,
              roomId: roomId,
              name: 'Darth Vader',
              email: 'darth@vader.com',
              isOwner: true,
              authToken,
              estimate: null,
            },
          ],
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
          players: [
            {
              id: playerId,
              roomId: roomId,
              name: 'Darth Vader',
              email: 'darth@vader.com',
              isOwner: true,
              estimate: null,
            },
          ],
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
