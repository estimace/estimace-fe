import { test, expect } from '@playwright/test'
import {
  assertEstimateOptions,
  assertPlayersList,
  assertShareURLSection,
  assertStorageValues,
} from './utils/assertions'
import { Player } from 'app/types'
import {
  mockCreatePlayerInRoomRequest,
  mockGetRoomRequest,
  mockGetRoomRequestError,
} from './utils/request-mocks'

test.describe('new player enters the room via shared url', () => {
  const roomId = '4b81b9b2-e944-42c2-95ee-44ae216d35f8'
  const owner: Player = {
    id: 'a7e2e105-b694-486d-abdd-23b174dfae9a',
    roomId: roomId,
    name: 'Luke Skywalker',
    pictureURL:
      'https://secure.gravatar.com/avatar/f352bf4fc014b769a4f6ada2a0caed1c?d=retro',
    isOwner: true,
    estimate: null,
  }
  const player: Player = {
    id: '4ed040c2-0cb0-438f-b59d-8eaf873c4fdf',
    roomId: roomId,
    name: 'Darth Vader',
    pictureURL:
      'https://secure.gravatar.com/avatar/f6cb5b374808419ff6fc55b73a1983bd?d=retro',
    isOwner: false,
    estimate: null,
  }
  const playerEmail: Player['email'] = 'darth@vader.com'
  const playerAuthToken: Player['authToken'] = 'a-secret-auth-token'

  test('shows error when room id is not a valid UUID', async ({ page }) => {
    await mockGetRoomRequestError(page, roomId, 404, {
      type: '/rooms/get/id/invalid',
      title: '"id" field is not a valid UUID',
    })
    await page.goto(`/rooms/invalid-uuid-value`)

    await expect(
      page.getByText(/The room does not exists or has been deleted/i),
    ).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'name' })).toBeHidden()
    await expect(page.getByRole('textbox', { name: 'email' })).toBeHidden()
    await expect(page.getByRole('button', { name: /enter/i })).toBeHidden()
  })

  test('shows error when room is not found', async ({ page }) => {
    await mockGetRoomRequestError(page, roomId, 404, {
      type: '/rooms/get/not-found',
      title: 'could not found the room with specified id',
    })
    await page.goto(`/rooms/${roomId}`)

    await expect(
      page.getByText(/The room does not exists or has been deleted/i),
    ).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'name' })).toBeHidden()
    await expect(page.getByRole('textbox', { name: 'email' })).toBeHidden()
    await expect(page.getByRole('button', { name: /enter/i })).toBeHidden()
  })

  test('shows the room entry form for the new player whose local storage does not contain room info', async ({
    page,
  }) => {
    await mockGetRoomRequest(page, {
      id: roomId,
      players: [owner],
    })
    await page.goto(`/rooms/${roomId}`)

    await expect(page.getByRole('textbox', { name: 'name' })).toHaveValue('')
    await expect(page.getByRole('textbox', { name: 'email' })).toHaveValue('')
    await expect(page.getByRole('button', { name: /enter/i })).toBeVisible()
  })

  test('new player enters the room providing form data and has their info stored in local storage', async ({
    page,
  }) => {
    await mockGetRoomRequest(page, {
      id: roomId,
      players: [owner],
    })

    await mockCreatePlayerInRoomRequest(page, {
      ...player,
      authToken: playerAuthToken,
    })

    await page.goto(`/rooms/${roomId}`)

    await page.getByRole('textbox', { name: 'name' }).fill(player.name)
    await page.getByRole('textbox', { name: 'email' }).fill(playerEmail)
    await page.getByRole('button', { name: /enter/i }).click()

    await assertPlayersList(page, [owner, player])
    await assertEstimateOptions(page, 'fibonacci')
    await assertShareURLSection(page, roomId)
    await expect(page.getByRole('button', { name: /reveal/i })).toBeHidden()
    await assertStorageValues(page, roomId, {
      ...player,
      authToken: playerAuthToken,
      email: playerEmail,
    })
  })
})
