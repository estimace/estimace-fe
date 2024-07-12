import { test, expect } from '@playwright/test'
import { Player } from 'app/types'
import {
  assertPlayerEstimationStatus,
  assertStorageValues,
} from './utils/assertions'
import wsMockServer from './utils/wsMockServer'
import {
  mockCreatePlayerInRoomRequest,
  mockGetRoomRequest,
} from './utils/requestMocks'

test.describe('estimate', () => {
  const roomId = '1Pmkdo2domxTclzX'
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

    await pageOne.goto(`/r/${roomId}`)
    await pageTwo.goto(`/r/${roomId}`)

    await pageOne.waitForLoadState()
    await pageTwo.waitForLoadState()

    for (const i of [0, 1]) {
      const page = pages[i]
      await page.getByRole('textbox', { name: 'name' }).fill(players[i].name)
      await page.getByRole('textbox', { name: 'email' }).fill(playersEmails[i])
      await page.getByRole('button', { name: /enter room/i }).click()
    }

    for (const i of [0, 1]) {
      await assertStorageValues(pages[i], roomId, {
        ...players[i],
        email: playersEmails[i],
        authToken: playersAuthTokens[i],
      })
    }

    for (const page of pages) {
      //locator('xpath=following-sibling::span')
      assertPlayerEstimationStatus(page, owner.name, 'is estimating')
      assertPlayerEstimationStatus(page, players[0].name, 'is estimating')
      assertPlayerEstimationStatus(page, players[1].name, 'is estimating')
    }
    //player-one estimates and the status of estimation icon for all pages change accordingly

    await pageOne.getByRole('button', { name: '8' }).click()

    assertPlayerEstimationStatus(pageOne, owner.name, 'is estimating')
    assertPlayerEstimationStatus(pageTwo, owner.name, 'is estimating')

    assertPlayerEstimationStatus(pageOne, players[0].name, 'estimated')
    assertPlayerEstimationStatus(pageTwo, players[0].name, 'estimated')

    assertPlayerEstimationStatus(pageOne, players[1].name, 'is estimating')
    assertPlayerEstimationStatus(pageTwo, players[1].name, 'is estimating')
    await expect(pageOne.getByRole('button', { name: '8' })).toBeFocused()

    //player-two estimates and the status of estimation icon for all pages change accordingly
    //getByRole('button', { name: '3' }) resolves to 2 elements, so we need to add exact:true to the locater

    await pageTwo.getByRole('button', { name: '3', exact: true }).click()

    assertPlayerEstimationStatus(pageOne, owner.name, 'is estimating')
    assertPlayerEstimationStatus(pageTwo, owner.name, 'is estimating')

    assertPlayerEstimationStatus(pageOne, players[0].name, 'estimated')
    assertPlayerEstimationStatus(pageTwo, players[0].name, 'estimated')

    assertPlayerEstimationStatus(pageOne, players[1].name, 'estimated')
    assertPlayerEstimationStatus(pageTwo, players[1].name, 'estimated')

    await expect(
      pageTwo.getByRole('button', { name: '3', exact: true }),
    ).toBeFocused()
  })
})
