import { FC, useState } from 'react'
import { useParams } from 'react-router-dom'

import storage from 'app/utils/storage'
import { Player, RoomInStorage } from 'app/types'

import { JoinForm } from './JoinForm'
import { PlayersInRoom } from './Players'
import { Estimation } from './Estimation'
import { OwnerControllers } from './OwnerControllers'
import { usePlayer } from './hooks/usePlayer'
import { useOnEstimateUpdatedWSMessage } from './hooks/useOnEstimateUpdatedWSMessage'
import { ShareURL } from './ShareURL'
import { useOnRoomStateUpdatedWSMessage } from './hooks/useOnRoomStateUpdatedWSMessage'
import { useRoom } from './hooks/useRoom'
import { useOnNewPlayerJoinedWSMessage } from './hooks/useOnNewPlayerJoinedWSMessage'

const RoomPage: FC = () => {
  const { id: roomId } = useParams()
  const [roomInStorage, setRoomInStorage] = useState<RoomInStorage | null>(
    storage.getRoom(roomId as string),
  )
  const { roomQuery, room, setRoom } = useRoom()
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
    return null
  }

  if (roomQuery.isFetching) {
    return <div>is fetching...</div>
  }

  return (
    <>
      {roomQuery.result?.errorType && (
        <div>The room does not exists or has been deleted</div>
      )}

      {shouldShowJoinRoomForm && (
        <JoinForm roomId={room.id} onSubmit={handleJoinFormSubmit} />
      )}

      {shouldShowRoom && (
        <>
          <PlayersInRoom
            players={room.players}
            technique={room.technique}
            state={room.state}
          />

          {room.state === 'planning' && (
            <Estimation
              player={player}
              technique={room.technique}
              roomId={room.id}
            />
          )}

          {player.isOwner && (
            <OwnerControllers player={player} roomState={room.state} />
          )}

          <ShareURL roomId={room.id} />
        </>
      )}
    </>
  )
}

export default RoomPage
