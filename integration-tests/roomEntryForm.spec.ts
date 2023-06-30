import { test, expect } from '@playwright/test'
import { apiUrl } from '../src/config'

test.describe('new player enters the room via shared url', () => {
  const slug = 'xyzxyz'
  const roomId = '10'

  test('shows a form to enter the room for the new player whose local storage does not contain player info', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173/rooms/xyzxyz')

    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /enter/i })).toBeVisible()
  })

  test('new player enters the active room providing form data and has their info stored in local storage', async ({
    page,
    context,
  }) => {
    await page.route(`${apiUrl}/rooms/${slug}`, (route) => {
      if (route.request().method() !== 'GET') {
        return route.fallback()
      }

      route.fulfill({
        status: 201,
        json: {
          id: roomId,
          slug: 'xyzxyz',
          state: 'planning',
          technique: 'fibonacci',
          players: [
            {
              id: '11',
              roomId: roomId,
              name: 'arash',
              email: 'me@arashmilani.com',
              isOwner: true,
              estimate: null,
            },
            {
              id: '12',
              roomId: roomId,
              name: 'yaghish',
              email: 'me@yaghish.com',
              isOwner: false,
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
          id: '12',
          roomId: roomId,
          name: 'yaghish',
          email: 'me@yaghish.com',
          isOwner: false,
          secretKey: 'xyfde569',
          estimate: null,
        },
      })
    })

    await page.goto('http://localhost:5173/rooms/xyzxyz')

    await page.getByLabel(/name/i).fill('yaghish')
    await page.getByLabel(/email/i).fill('me@yaghish.com')
    await page.getByRole('button', { name: /enter/i }).click()

    const storage = await context.storageState()
    const playerInStorage = storage.origins[0].localStorage.find(
      (item) => item.name === 'player',
    )?.value

    const roomInStorage = storage.origins[0].localStorage.find(
      (item) => item.name === 'planningRooms',
    )?.value

    expect(playerInStorage).toBe(
      '{"id":"12","name":"yaghish","email":"me@yaghish.com"}',
    )
    expect(roomInStorage).toBe('{"xyzxyz":"xyfde569"}')

    await expect(page.getByRole('button')).toHaveCount(12)
    await expect(
      page.getByRole('button', { name: /reveal/i }),
    ).not.toBeVisible()

    //await page.getByRole('button', { name: '8' }).click()
  })
})
