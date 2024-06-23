import { FC, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Page } from 'app/ui/layout/Page'
import { Player, RoomInStorage } from 'app/types'
import { Swiper } from 'app/ui/Swiper'
import storage from 'app/utils/storage'

import { JoinForm } from './JoinForm'
import { PlayersInRoom } from './Players'
import { Estimation } from './Estimation'
import { OwnerControllers } from './OwnerControllers'
import { usePlayer } from './hooks/usePlayer'
import { ShareURL } from './ShareURL'
import { useRoom } from './hooks/useRoom'
import { useOnTabFocus } from './hooks/useOnTabFocus'
import { useOnNewPlayerJoinedWSMessage } from './hooks/useOnNewPlayerJoinedWSMessage'
import { useOnEstimateUpdatedWSMessage } from './hooks/useOnEstimateUpdatedWSMessage'
import { useOnRoomStateUpdatedWSMessage } from './hooks/useOnRoomStateUpdatedWSMessage'

import styles from './index.module.css'

const RoomPage: FC = () => {
  const { id: roomId } = useParams()
  const [roomInStorage, setRoomInStorage] = useState<RoomInStorage | null>(
    storage.getRoom(roomId as string),
  )
  const { roomQuery, room, setRoom } = useRoom()

  /** This hook serves to update room data when the user focuses on the tab.
   * It's essential for fetching the most recent room state after the tab is
   * switched on desktop devices or if the user sends their browser app to the
   * background in their mobile device. In both scenarios, the websocket
   * connection is terminated, leading to outdated data upon the user's return
   * to the page.*/
  useOnTabFocus(roomQuery.refresh)

  const { player, setPlayer } = usePlayer(room, roomInStorage)

  useOnNewPlayerJoinedWSMessage({ player, room, setRoom })
  useOnEstimateUpdatedWSMessage({ player, room, setRoom })
  useOnRoomStateUpdatedWSMessage({ player, room, setRoom })

  const handleJoinFormSubmit = (joinedPlayer: Player) => {
    const roomInStorage: RoomInStorage = {
      id: joinedPlayer.roomId,
      playerId: joinedPlayer.id,
      playerAuthToken: joinedPlayer.authToken,
    }
    storage.setRoom(roomInStorage)
    setRoomInStorage(roomInStorage)
    setRoom((prev) =>
      prev ? { ...prev, players: [...prev.players, joinedPlayer] } : null,
    )
    setPlayer(joinedPlayer)
  }

  const shouldShowJoinRoomForm = room && roomInStorage === null
  const shouldShowRoom = !shouldShowJoinRoomForm && room && player

  if (!roomId) {
    return (
      <div className={styles.errorMessage}>
        The room does not exist or has been deleted.
      </div>
    )
  }

  return (
    <Page shouldShowLoadingIndicator={roomQuery.isFetching}>
      {roomQuery.result?.errorType && (
        <div className={styles.errorMessage}>
          The room does not exist or has been deleted.
        </div>
      )}

      {shouldShowJoinRoomForm && (
        <JoinForm roomId={room.id} onSubmit={handleJoinFormSubmit} />
      )}

      {shouldShowRoom && (
        <section className={styles.roomWrap}>
          <aside className={styles.roomControllers}>
            <ShareURL roomId={room.id} />
            {player.isOwner && (
              <OwnerControllers player={player} roomState={room.state} />
            )}
          </aside>
          <div className={styles.room}>
            <Swiper direction="vertical">
              <div className={styles.playersWrap}>
                <PlayersInRoom
                  players={room.players}
                  technique={room.technique}
                  state={room.state}
                />
              </div>
            </Swiper>
            <div className={styles.playerControllers}>
              {room.state === 'planning' && (
                <Estimation
                  player={player}
                  technique={room.technique}
                  roomId={room.id}
                />
              )}
            </div>
          </div>
        </section>
      )}
    </Page>
  )
}

export default RoomPage
