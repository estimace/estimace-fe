import { Page } from '@playwright/test'
import { apiUrl } from 'app/config'
import { Player, Room } from 'app/types'

export async function mockGetRoomRequest(page: Page, payload: Partial<Room>) {
  await page.route(`${apiUrl}/rooms/${payload.id}`, async (route) => {
    if (route.request().method() !== 'GET') {
      return route.fallback()
    }

    await route.fulfill({
      status: 200,
      json: {
        ...payload,
        state: payload.state ?? 'planning',
        technique: payload.technique ?? 'fibonacci',
      },
    })
  })
}

export async function mockCreatePlayerInRoomRequest(
  page: Page,
  payload: Player & { authToken: string },
) {
  await page.route(
    `${apiUrl}/rooms/${payload.roomId}/players`,
    async (route) => {
      if (route.request().method() !== 'POST') {
        return route.fallback()
      }

      route.fulfill({
        status: 201,
        json: {
          ...payload,
        },
      })
    },
  )
}
