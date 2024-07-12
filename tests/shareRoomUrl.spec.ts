import { test, expect } from '@playwright/test'
import { Player } from 'app/types'
import { assertShareURLSection } from './utils/assertions'
import { mockCreateRoomRequest, mockGetRoomRequest } from './utils/requestMocks'

test.describe('Share URL', () => {
  const roomId = '1Pmkdo2domxTclzX'
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

    await page.goto(`/r`)
    await page.getByRole('textbox', { name: 'Name' }).fill('Darth Vader')
    await page.getByRole('textbox', { name: 'Email' }).fill('darth@vader.com')
    await page.getByRole('button').click()
    await assertShareURLSection(page, roomId)

    await page.getByRole('button', { name: /copy invite link/i }).click()
    const status = page.getByRole('status')
    await expect(status).toBeVisible()
    await expect(status).toHaveText(/copied/i)

    const copiedURL = await page.evaluate(() => {
      return navigator.clipboard.readText()
    })

    expect(copiedURL).toBe(page.url())
  })

  test('hides the status message for copied URL after 3 seconds', async ({
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

    await page.goto(`/r`)
    await page.getByRole('textbox', { name: 'Name' }).fill('Darth Vader')
    await page.getByRole('textbox', { name: 'Email' }).fill('darth@vader.com')
    await page.getByRole('button').click()

    await page.getByRole('button', { name: /copy invite link/i }).click()

    const status = page.getByRole('status')
    await expect(status).toBeVisible()
    await expect(status).toHaveAttribute(
      'aria-label',
      'Copied Room URL Notification',
    )
    await expect(status).toHaveText(/copied/i)
    await expect(status).toBeHidden()
  })
})
