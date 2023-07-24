import { Page } from '@playwright/test'
import { apiPath } from 'app/config'
import { Player, Room } from 'app/types'
import { FailedResponse } from 'app/utils/request'
import { BroadcastMessage } from './ws-mock-server'

export async function mockCreateRoomRequest(
  page: Page,
  room: Partial<Omit<Room, 'players'>>,
  player: Player & { authToken: string },
) {
  await page.route(`${apiPath}/rooms`, async (route) => {
    if (route.request().method() !== 'POST') {
      return route.fallback()
    }
    await route.fulfill({
      status: 201,
      json: {
        ...room,
        state: 'planning',
        players: [player],
      },
    })
  })
}

export async function mockGetRoomRequest(page: Page, payload: Partial<Room>) {
  await page.route(`${apiPath}/rooms/${payload.id}`, async (route) => {
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

export async function mockGetRoomRequestError(
  page: Page,
  roomId: Room['id'],
  statusCode: number,
  payload: FailedResponse['data'],
) {
  await page.route(`${apiPath}/rooms/${roomId}`, async (route) => {
    if (route.request().method() !== 'GET') {
      return route.fallback()
    }

    await route.fulfill({
      status: statusCode,
      json: {
        ...payload,
      },
    })
  })
}

export async function mockCreatePlayerInRoomRequest(
  page: Page,
  payload: Player & { authToken: string },
  broadcastMessage?: BroadcastMessage,
) {
  await page.route(
    `${apiPath}/rooms/${payload.roomId}/players`,
    async (route) => {
      if (route.request().method() !== 'POST') {
        return route.fallback()
      }

      broadcastMessage?.({
        type: 'newPlayerJoined',
        payload,
      })

      route.fulfill({
        status: 201,
        json: {
          ...payload,
        },
      })
    },
  )
}
