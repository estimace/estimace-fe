import { test, expect } from '@playwright/test'
import { apiUrl, techniqueOptions } from '../src/config'

test.describe('create new room', () => {
  const slug = 'xyzxyz'
  const roomId = '10'
  test('shows a room ready to planning with selected planning technique and the room url to share with players', async ({
    page,
    context,
  }) => {
    await page.route(`${apiUrl}/rooms`, (route) => {
      if (route.request().method() !== 'POST') {
        return route.fallback()
      }
      route.fulfill({
        status: 201,
        json: {
          id: roomId,
          slug,
          state: 'planning',
          technique: 'fibonacci',
          players: [
            {
              id: 14,
              roomId: roomId,
              name: 'eli',
              email: 'me@eli.com',
              isOwner: true,
              secretKey: 'elown34gf',
              estimate: null,
            },
          ],
        },
      })
    })

    await page.route(`${apiUrl}/rooms/${slug}`, (route) => {
      if (route.request().method() !== 'GET') {
        return route.fallback()
      }

      route.fulfill({
        status: 201,
        json: {
          id: 1,
          slug,
          state: 'planning',
          technique: 'fibonacci',
          players: [
            {
              id: 14,
              roomId: roomId,
              name: 'eli',
              email: 'me@eli.com',
              isOwner: true,
              secretKey: '',
              estimate: null,
            },
          ],
        },
      })
    })

    await page.route(`${apiUrl}/rooms/${slug}/players`, (route) => {
      if (route.request().method() !== 'POST') {
        return route.fallback()
      }
      route.fulfill({
        status: 201,
        json: {
          id: 14,
          roomId: roomId,
          name: 'eli',
          email: 'me@eli.com',
          isOwner: true,
          secretKey: 'elown34gf',
          estimate: null,
        },
      })
    })

    await page.goto(`http://localhost:5173/rooms`)
    await page.getByLabel('name').fill('eli')
    await page.getByLabel('email').fill('me@eli.com')
    await page.getByRole('button').click()

    await expect(page.getByText('eli')).toBeVisible()

    await expect(page.getByAltText('avatar of eli')).toBeVisible()

    const storage = await context.storageState()
    const playerInStorage = storage.origins[0].localStorage.find(
      (item) => item.name === 'planningRooms',
    )?.value

    expect(playerInStorage).toBe('{"xyzxyz":"elown34gf"}')

    for (let option of techniqueOptions.fibonacci) {
      expect(
        page.getByRole('button', { name: option, exact: true }),
      ).toHaveText(option)
    }
    const revealButton = page.getByRole('button', { name: /reveal/i })
    await expect(revealButton).toBeEnabled()

    await expect(page.getByText('Room URL to share: ')).toBeVisible()
    await expect(
      page.getByText(`http://localhost:5173/rooms/${slug}`),
    ).toBeVisible()
  })
})
