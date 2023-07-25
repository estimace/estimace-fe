import { test, expect } from '@playwright/test'
import { Player, Technique } from 'app/types'
import wsMockServer from './utils/wsMockServer'
import {
  mockCreatePlayerInRoomRequest,
  mockCreateRoomRequest,
  mockGetRoomRequest,
} from './utils/requestMocks'

test.describe('broadcast joining new player', () => {
  const roomId = '4b81b9b2-e944-42c2-95ee-44ae216d35f8'
  test("new player enters the room, and as a result player's joining gets broadcasted to other room players", async ({
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

    const wss = await wsMockServer.create()

    const contexts = [
      await browser.newContext(),
      await browser.newContext(),
      await browser.newContext(),
    ]
    const pageOwner = await contexts[0].newPage()
    const pageOne = await contexts[1].newPage()
    const pageTwo = await contexts[2].newPage()
    const tech: Technique = 'fibonacci'
    await mockCreateRoomRequest(
      pageOwner,
      { id: roomId, technique: tech },
      { ...owner, authToken: 'a-secret-auth-for-room-owner' },
    )
    await mockGetRoomRequest(pageOwner, {
      id: roomId,
      technique: tech,
      players: [owner],
    })
    await pageOwner.addInitScript(
      (value) => (window.WS_URL = value),
      wss.address,
    )

    pageOwner.goto('/rooms')
    await pageOwner.getByRole('textbox', { name: 'name' }).fill(owner.name)
    await pageOwner
      .getByRole('textbox', { name: 'email' })
      .fill('darth@vader.com')
    await pageOwner.getByRole('button', { name: /create/i }).click()

    const pages = [pageOne, pageTwo]
    for (const page of pages) {
      const index = pages.indexOf(page)
      await mockGetRoomRequest(page, {
        id: roomId,
        players: index === 1 ? [owner, players[0]] : [owner],
      })

      await mockCreatePlayerInRoomRequest(
        page,
        {
          ...players[index],
          authToken: playersAuthTokens[index],
        },
        wss.broadcastMessage,
      )
    }

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

    await pageOne.getByRole('textbox', { name: 'name' }).fill(players[0].name)
    await pageOne.getByRole('textbox', { name: 'email' }).fill(playersEmails[0])
    await pageOne.getByRole('button', { name: /enter/i }).click()

    //broadcasts player of pageOne to ownerPage
    await expect(
      pageOwner.getByText(`${players[0].name} is estimating`),
    ).toBeVisible()

    //second player joins the room
    await pageTwo.getByRole('textbox', { name: 'name' }).fill(players[1].name)
    await pageTwo.getByRole('textbox', { name: 'email' }).fill(playersEmails[1])
    await pageTwo.getByRole('button', { name: /enter/i }).click()

    await expect(
      pageTwo.getByText(`${players[0].name} is estimating`),
    ).toBeVisible()
    //broadcasts second player to ownerPage and pageOne
    await expect(
      pageOwner.getByText(`${players[1].name} is estimating`),
    ).toBeVisible()
    await expect(
      pageOne.getByText(`${players[1].name} is estimating`),
    ).toBeVisible()
  })
})
