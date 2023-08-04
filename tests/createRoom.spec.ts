import { test, expect, Page } from '@playwright/test'
import { techniqueLabels } from 'app/config'
import { Player, Technique } from 'app/types'
import {
  assertEstimateOptions,
  assertPlayersList,
  assertShareURLSection,
  assertStorageValues,
} from './utils/assertions'
import { mockCreateRoomRequest, mockGetRoomRequest } from './utils/requestMocks'

test.describe('create new room', () => {
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

  test('shows empty form if there is no previous player info in localStorage', async ({
    page,
  }) => {
    await page.goto(`/rooms`)
    await expect(page.getByRole('textbox', { name: 'name' })).toHaveValue('')
    await expect(page.getByRole('textbox', { name: 'email' })).toHaveValue('')
    const rememberMeBox = page.getByLabel(/remember me/i)
    await expect(rememberMeBox).toBeChecked()
    await rememberMeBox.uncheck()
    await expect(rememberMeBox).not.toBeChecked()
  })

  test('shows prefilled form based on previous player info in localStorage', async ({
    page,
  }) => {
    await page.goto(`/`)
    await page.evaluate(() =>
      window.localStorage.setItem(
        'player',
        JSON.stringify({ name: 'Darth Vader', email: 'darth@vader.com' }),
      ),
    )
    await page.goto(`/rooms`)

    await expect(page.getByRole('textbox', { name: 'name' })).toHaveValue(
      'Darth Vader',
    )
    await expect(page.getByRole('textbox', { name: 'email' })).toHaveValue(
      'darth@vader.com',
    )
    await expect(
      page.getByRole('checkbox', { name: /remember me/gi }),
    ).toBeChecked()
  })

  // eslint-disable-next-line playwright/expect-expect
  test(`creates a room and does not store owner's info in the localStorage if the user has unchecked remember me`, async ({
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

    await page.getByRole('checkbox', { name: /remember me/i }).uncheck()

    await page.getByRole('button', { name: /create/i }).click()

    await assertStorageValues(page, roomId, { ...player, authToken }, false)
  })

  test(`creates a room with fibonacci technique and shows a room ready to planning with selected planning technique and the room url to share with players`, async ({
    page,
  }) => {
    await createRoom(page, 'fibonacci')

    await assertPlayersList(page, [player])
    await assertEstimateOptions(page, 'fibonacci')
    await assertShareURLSection(page, roomId)
    await expect(page.getByRole('button', { name: /reveal/i })).toBeEnabled()
  })

  test('creates a room with tShirtSizing technique and shows a room ready to planning with selected planning technique and the room url to share with players', async ({
    page,
  }) => {
    await createRoom(page, 'tShirtSizing')

    await assertPlayersList(page, [player])
    await assertEstimateOptions(page, 'tShirtSizing')
    await assertShareURLSection(page, roomId)
    await expect(page.getByRole('button', { name: /reveal/i })).toBeEnabled()
  })

  async function createRoom(page: Page, technique: Technique) {
    await mockCreateRoomRequest(
      page,
      { id: roomId, technique: technique },
      { ...player, authToken },
    )

    await mockGetRoomRequest(page, {
      id: roomId,
      technique: technique,
      players: [player],
    })

    await page.goto(`/rooms`)
    await page.getByRole('textbox', { name: 'Name' }).fill('Darth Vader')
    await page.getByRole('textbox', { name: 'Email' }).fill('darth@vader.com')
    await expect(page.getByLabel(/Technique/gi)).toBeVisible()

    await page
      .getByLabel(/Technique/gi)
      .selectOption(techniqueLabels[technique])
    await page.getByRole('button').click()
  }
})
