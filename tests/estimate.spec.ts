import { test, expect } from '@playwright/test'
import { Player } from 'app/types'
import { assertStorageValues } from './utils/assertions'
import wsMockServer from './utils/ws-mock-server'
import {
  mockCreatePlayerInRoomRequest,
  mockGetRoomRequest,
} from './utils/request-mocks'

test.describe('estimate', () => {
  const roomId = '4b81b9b2-e944-42c2-95ee-44ae216d35f8'
  test("clicking an estimate option sends player's estimation, and as a result player's status broadcasts to others", async ({
    browser,
  }) => {
    const owner: Player = {
      id: '5ba855f3-40bf-4a5a-b7ea-c40114d58be5',
      roomId: roomId,
      name: 'Darth Vader',
      pictureURL:
        'https://secure.gravatar.com/avatar/f6cb5b374808419ff6fc55b73a1983bd?d=retro',
      isOwner: true,
      estimate: null,
    }

    const players: Player[] = [
      {
        id: '6304dd2c-9760-44d4-8355-77bc0b70a363',
        roomId: roomId,
        name: 'Luke Skywalker',
        pictureURL:
          'https://secure.gravatar.com/avatar/f352bf4fc014b769a4f6ada2a0caed1c?d=retro',
        isOwner: false,
        estimate: null,
      },
      {
        id: 'c4640745-2127-4ce1-8cc3-5d03d511b4c0',
        roomId: roomId,
        name: 'Padme Amidala',
        pictureURL:
          'https://secure.gravatar.com/avatar/63836ebe426034fcfd64f83c70630115?d=retro',
        isOwner: false,
        estimate: null,
      },
    ]

    const playersEmails: Player['email'][] = [
      'luke@skywalker.com',
      'padme@amidala.com',
    ]

    const playersAuthTokens: Player['authToken'][] = [
      'secret-auth-token-for-luke-skywalker',
      'secret-auth-token-for-padme-amidala',
    ]

    const contexts = [await browser.newContext(), await browser.newContext()]
    const pageOne = await contexts[0].newPage()
    const pageTwo = await contexts[1].newPage()
    const pages = [pageOne, pageTwo]

    for (const page of pages) {
      const index = pages.indexOf(page)
      await mockGetRoomRequest(page, {
        id: roomId,
        players: [owner, players[index === 0 ? 1 : 0]],
      })

      await mockCreatePlayerInRoomRequest(page, {
        ...players[index],
        authToken: playersAuthTokens[index],
      })
    }

    const wss = await wsMockServer.create(
      ({ message, sendMessage, broadcastMessage, url }) => {
        const playerId = url.searchParams.get('playerId')

        if (message.type === 'updateEstimate') {
          const responseMessage = {
            type: 'estimateUpdated',
            payload: {
              ...players.find((item) => item.id === playerId),
              estimate: message.payload.estimate,
            },
          }
          sendMessage(responseMessage)
          broadcastMessage(responseMessage)
        }
      },
    )

    for (const i of [0, 1]) {
      await pages[i].addInitScript(
        (value) => (window.WS_URL = value),
        wss.address,
      )
    }

    await pageOne.goto(`/rooms/${roomId}`)
    await pageTwo.goto(`/rooms/${roomId}`)

    await pageOne.waitForLoadState()
    await pageTwo.waitForLoadState()

    for (const i of [0, 1]) {
      const page = pages[i]
      await page.getByRole('textbox', { name: 'name' }).fill(players[i].name)
      await page.getByRole('textbox', { name: 'email' }).fill(playersEmails[i])
      await page.getByRole('button', { name: /enter/i }).click()
    }

    for (const i of [0, 1]) {
      await assertStorageValues(pages[i], roomId, {
        ...players[i],
        email: playersEmails[i],
        authToken: playersAuthTokens[i],
      })
    }

    for (const page of pages) {
      await expect(page.getByText(`${owner.name} is estimating`)).toBeVisible()
      await expect(
        page.getByText(`${players[0].name} is estimating`),
      ).toBeVisible()
      await expect(
        page.getByText(`${players[1].name} is estimating`),
      ).toBeVisible()
    }

    await pageOne.getByRole('button', { name: '8' }).click()

    await expect(pageOne.getByText(`${owner.name} is estimating`)).toBeVisible()
    await expect(pageTwo.getByText(`${owner.name} is estimating`)).toBeVisible()
    await expect(
      pageOne.getByText(`${players[0].name} estimated`),
    ).toBeVisible()
    await expect(
      pageTwo.getByText(`${players[0].name} estimated`),
    ).toBeVisible()
    await expect(
      pageOne.getByText(`${players[1].name} is estimating`),
    ).toBeVisible()
    await expect(
      pageTwo.getByText(`${players[1].name} is estimating`),
    ).toBeVisible()

    await pageTwo.getByRole('button', { name: '0.5' }).click()
    await expect(pageOne.getByText(`${owner.name} is estimating`)).toBeVisible()
    await expect(pageTwo.getByText(`${owner.name} is estimating`)).toBeVisible()
    await expect(
      pageOne.getByText(`${players[0].name} estimated`),
    ).toBeVisible()
    await expect(
      pageTwo.getByText(`${players[0].name} estimated`),
    ).toBeVisible()
    await expect(
      pageOne.getByText(`${players[1].name} estimated`),
    ).toBeVisible()
    await expect(
      pageTwo.getByText(`${players[1].name} estimated`),
    ).toBeVisible()
  })
})
