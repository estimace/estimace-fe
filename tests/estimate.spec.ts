import { test, expect } from '@playwright/test'
import { apiUrl } from '../src/config'

test.describe('estimate', () => {
  const roomId = '4b81b9b2-e944-42c2-95ee-44ae216d35f8'
  test("clicking an estimate option sends player's estimation, and as a result player's status broadcasts to others", async ({
    context,
  }) => {
    // Get all new pages (including popups) in the context
    context.on('page', async (page) => {
      await page.waitForLoadState()
    })
    // Create two pages
    const pageOne = await context.newPage()
    const pageTwo = await context.newPage()

    // Get pages of a browser context
    const allPages = [pageOne, pageTwo]
    for (const page of allPages) {
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
              {
                id: '14',
                roomId: roomId,
                name: 'sami',
                email: 'me@sami.com',
                isOwner: false,
                estimate: null,
              },
            ],
          },
        })
      })
    }

    await pageOne.route(`${apiUrl}/rooms/${roomId}/players`, (route) => {
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
          authToken: 'xyfde569',
          estimate: null,
        },
      })
    })
    await pageTwo.route(`${apiUrl}/rooms/${roomId}/players`, (route) => {
      if (route.request().method() !== 'POST') {
        return route.fallback()
      }
      route.fulfill({
        status: 201,
        json: {
          id: '14',
          roomId: roomId,
          name: 'sami',
          email: 'me@sami.com',
          isOwner: false,
          authToken: 'xsfde941',
          estimate: null,
        },
      })
    })

    await pageOne.goto('http://localhost:5173/rooms/xyzxyz')
    await pageTwo.goto('http://localhost:5173/rooms/xyzxyz')

    await pageOne.getByLabel(/name/i).fill('yaghish')
    await pageOne.getByLabel(/email/i).fill('me@yaghish.com')
    await pageOne.getByRole('button', { name: /enter/i }).click()
    const storageOne = await context.storageState()
    const playerOneInStorage = storageOne.origins[0].localStorage.find(
      (item) => item.name === 'player',
    )?.value

    const roomOneInStorage = storageOne.origins[0].localStorage.find(
      (item) => item.name === 'planningRooms',
    )?.value

    expect(playerOneInStorage).toBe(
      '{"id":"12","name":"yaghish","email":"me@yaghish.com"}',
    )
    expect(roomOneInStorage).toBe('{"xyzxyz":"xyfde569"}')

    await pageTwo.getByLabel(/name/i).fill('sami')
    await pageTwo.getByLabel(/email/i).fill('me@sami.com')
    await pageTwo.getByRole('button', { name: /enter/i }).click()

    const storageTwo = await context.storageState()
    const playerTwoInStorage = storageTwo.origins[0].localStorage.find(
      (item) => item.name === 'player',
    )?.value

    const roomTwoInStorage = storageTwo.origins[0].localStorage.find(
      (item) => item.name === 'planningRooms',
    )?.value

    expect(playerTwoInStorage).toBe(
      '{"id":"14","name":"sami","email":"me@sami.com"}',
    )
    expect(roomTwoInStorage).toBe('{"xyzxyz":"xsfde941"}')

    for (const page of allPages) {
      await expect(page.getByText('arash is thinking!')).toBeVisible()
      await expect(page.getByText('yaghish is thinking!')).toBeVisible()
      await expect(page.getByText('sami is thinking!')).toBeVisible()
    }

    await pageOne.getByRole('button', { name: '8' }).click()
    await pageTwo.getByRole('button', { name: '0.5' }).click()

    for (const page of allPages) {
      await expect(page.getByText('arash is thinking!')).toBeVisible()
      await expect(page.getByText('yaghish has already Planned!')).toBeVisible()
      await expect(page.getByText('sami has already Planned!')).toBeVisible()
    }
  })
})
