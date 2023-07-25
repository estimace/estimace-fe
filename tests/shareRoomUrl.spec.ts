import { test, expect } from '@playwright/test'
import { Player } from 'app/types'
import { assertShareURLSection } from './utils/assertions'
import { mockCreateRoomRequest, mockGetRoomRequest } from './utils/requestMocks'

test.describe('Share URL', () => {
  const roomId = '4b81b9b2-e944-42c2-95ee-44ae216d35f8'
  const player: Player = {
    id: '852a0cd5-9de1-4178-949b-a5cad8cdc2aa',
    name: 'Darth Vader',
    pictureURL:
      'https://secure.gravatar.com/avatar/f6cb5b374808419ff6fc55b73a1983bd?d=retro',
    isOwner: true,
    roomId,
    estimate: null,
  }
  const authToken = 'a-secret-auth-token'

  test('copies roomURL to the clipboard when clicking copy URL button', async ({
    page,
  }) => {
    await mockCreateRoomRequest(
      page,
      { id: roomId, technique: 'fibonacci' },
      { ...player, authToken },
    )

    await mockGetRoomRequest(page, {
      id: roomId,
      technique: 'fibonacci',
      players: [player],
    })

    await page.goto(`/rooms`)
    await page.getByRole('textbox', { name: 'Name' }).fill('Darth Vader')
    await page.getByRole('textbox', { name: 'Email' }).fill('darth@vader.com')
    await page.getByRole('button').click()
    await assertShareURLSection(page, roomId)

    page.getByRole('button', { name: /copy url/i }).click()
    await expect(
      page.getByText(/Room URL copied to the clipboard/gi),
    ).toBeVisible()

    const copiedURL = await page.evaluate(() => {
      return navigator.clipboard.readText()
    })
    await expect(copiedURL).toContain(`/rooms/${roomId}`)
  })
})
