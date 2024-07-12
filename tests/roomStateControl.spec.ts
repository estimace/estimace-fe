import { test, expect } from '@playwright/test'

import { Player } from 'app/types'
import { sortPlayersByEstimations } from 'app/utils/sortPlayers'
import { techniqueLabels } from 'app/config'

import { assertPlayersEstimations } from './utils/assertions'
import wsMockServer from './utils/wsMockServer'
import {
  mockCreatePlayerInRoomRequest,
  mockCreateRoomRequest,
  mockGetRoomRequest,
} from './utils/requestMocks'

test.describe('room state', () => {
  const roomId = '1Pmkdo2domxTclzX'
  test('room owner changes room state, and as a result rooms state broadcasts to others', async ({
    browser,
  }) => {
    const players: Player[] = [
      {
        id: '5ba855f3-40bf-4a5a-b7ea-c40114d58be5',
        roomId: roomId,
        name: 'Darth Vader',
        pictureURL:
          'https://secure.gravatar.com/avatar/f6cb5b374808419ff6fc55b73a1983bd?d=retro',
        isOwner: true,
        estimate: null,
      },
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

    const contexts = [
      await browser.newContext(),
      await browser.newContext(),
      await browser.newContext(),
    ]
    const pageOwner = await contexts[0].newPage()
    const pageOne = await contexts[1].newPage()
    const pageTwo = await contexts[2].newPage()
    const pages = [pageOne, pageTwo]

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
        if (message.type === 'updateRoomState') {
          const responseMessage = {
            type: 'roomStateUpdated',
            payload: {
              id: roomId,
              state: message.payload.state,
            },
          }
          sendMessage(responseMessage)
          broadcastMessage(responseMessage)
        }
      },
    )
    for (const page of [pageOwner, pageOne, pageTwo]) {
      await page.addInitScript((value) => (window.WS_URL = value), wss.address)
    }

    await mockCreateRoomRequest(
      pageOwner,
      { id: roomId, technique: 'fibonacci' },
      { ...players[0], authToken: 'a-secret-auth-for-room-owner' },
    )
    mockGetRoomRequest(pageOwner, { id: roomId, players })

    await pageOwner.goto('/r')
    await pageOwner.waitForLoadState()
    await pageOwner.getByRole('textbox', { name: 'name' }).fill(players[0].name)
    await pageOwner
      .getByRole('textbox', { name: 'email' })
      .fill('darth@vader.com')
    await pageOwner.getByRole('button', { name: /create room/i }).click()

    //the players[0] who created the room will get the other players via joinedPlayer broadcast
    //the players[1], who is pageOne's player, will get players[0] in room response and players[2] via joinedPlayer broadcast
    //the players[2], who is pageTwo's player, will get both players in the getRoom response as they have already been assigned to room
    for (const page of [pageOne, pageTwo]) {
      const index = pages.indexOf(page)
      await mockGetRoomRequest(page, {
        id: roomId,
        players: index === 1 ? players.slice(0, 2) : [players[0]],
      })

      await mockCreatePlayerInRoomRequest(
        page,
        {
          ...players[index + 1],
          authToken: playersAuthTokens[index],
        },
        wss.broadcastMessage,
      )
    }

    await pageOne.goto(`/r/${roomId}`)
    await pageTwo.goto(`/r/${roomId}`)

    await pageOne.waitForLoadState()
    await pageTwo.waitForLoadState()

    for (const i of [0, 1]) {
      const page = pages[i]
      await page
        .getByRole('textbox', { name: 'name' })
        .fill(players[i + 1].name)
      await page.getByRole('textbox', { name: 'email' }).fill(playersEmails[i])
      await page.getByRole('button', { name: /enter room/i }).click()
    }

    for (const page of [pageOwner, pageOne, pageTwo]) {
      await assertPlayersEstimations(page, players, 'fibonacci', 'planning', [
        null,
        null,
        null,
      ])
    }

    await pageOwner.getByRole('button', { name: '?' }).click()
    await pageOne.getByRole('button', { name: '8' }).click()
    await pageTwo.getByRole('button', { name: '0.5' }).click()

    await pageOwner.getByRole('button', { name: 'reveal' }).click()

    players[0].estimate = 11
    players[1].estimate = 6
    players[2].estimate = 1

    for (const page of [pageOwner, pageOne, pageTwo]) {
      sortPlayersByEstimations(players)
      await assertPlayersEstimations(
        page,
        players,
        'fibonacci',
        'revealed',
        [1, 6, 11],
      )
    }

    const resetButton = pageOwner.getByRole('button', { name: 'reset' })
    await expect(resetButton).toBeEnabled()

    await resetButton.click()

    for (const page of [pageOwner, pageOne, pageTwo]) {
      await assertPlayersEstimations(page, players, 'fibonacci', 'planning', [
        null,
        null,
        null,
      ])
    }
  })

  test('sort players list by their estimation when the state of room is revealed', async ({
    page,
  }) => {
    const players: Player[] = [
      {
        id: '5ba855f3-40bf-4a5a-b7ea-c40114d58be5',
        roomId: roomId,
        name: 'Darth Vader',
        pictureURL:
          'https://secure.gravatar.com/avatar/f6cb5b374808419ff6fc55b73a1983bd?d=retro',
        isOwner: true,
        estimate: null,
      },
      {
        id: '6304dd2c-9760-44d4-8355-77bc0b70a363',
        roomId: roomId,
        name: 'Luke Skywalker',
        pictureURL:
          'https://secure.gravatar.com/avatar/f352bf4fc014b769a4f6ada2a0caed1c?d=retro',
        isOwner: false,
        estimate: 5,
      },
      {
        id: '0a500d4d-bb91-46ab-aa01-36ffc947c02b',
        roomId: roomId,
        name: 'Leia Skywalker',
        pictureURL:
          'https://secure.gravatar.com/avatar/f352bf4fc014b769a4f6ada2a0caed1c?d=retro',
        isOwner: false,
        estimate: 11,
      },
      {
        id: '3d9a1e89-3775-4338-80b2-b2ed7213e993',
        roomId: roomId,
        name: 'Rey Rey',
        pictureURL:
          'https://secure.gravatar.com/avatar/f352bf4fc014b769a4f6ada2a0caed1c?d=retro',
        isOwner: false,
        estimate: null,
      },
      {
        id: 'bb778929-397c-4806-94fd-55ac5b8800cd',
        roomId: roomId,
        name: 'Anakin Skywalker',
        pictureURL:
          'https://secure.gravatar.com/avatar/f352bf4fc014b769a4f6ada2a0caed1c?d=retro',
        isOwner: false,
        estimate: 5,
      },
      {
        id: 'c4640745-2127-4ce1-8cc3-5d03d511b4c0',
        roomId: roomId,
        name: 'Padme Amidala',
        pictureURL:
          'https://secure.gravatar.com/avatar/63836ebe426034fcfd64f83c70630115?d=retro',
        isOwner: false,
        estimate: 0,
      },
    ]
    mockCreateRoomRequest(
      page,
      { id: roomId, technique: 'fibonacci' },
      { ...players[0], authToken: 'a-secret-auth-for-room-owner' },
    )

    const wss = await wsMockServer.create(({ message, sendMessage }) => {
      if (message.type === 'updateRoomState') {
        const responseMessage = {
          type: 'roomStateUpdated',
          payload: {
            id: roomId,
            state: message.payload.state,
          },
        }
        sendMessage(responseMessage)
      }
    })
    await page.addInitScript((value) => (window.WS_URL = value), wss.address)

    await mockGetRoomRequest(page, {
      id: roomId,
      technique: 'fibonacci',
      players,
    })

    await page.goto('/r')
    await page.getByRole('textbox', { name: 'Name' }).fill('Darth Vader')
    await page.getByRole('textbox', { name: 'Email' }).fill('darth@vader.com')
    await page
      .getByLabel(/Technique/gi)
      .selectOption(techniqueLabels['fibonacci'])
    await page.getByRole('button', { name: /create/gi }).click()

    await page.getByRole('button', { name: /reveal/gi }).click()

    sortPlayersByEstimations(players)

    await expect(page.getByRole('button', { name: /reset/gi })).toBeVisible()
    await assertPlayersEstimations(page, players, 'fibonacci', 'revealed', [
      0,
      5,
      5,
      11,
      null,
      null,
    ])
  })
})
