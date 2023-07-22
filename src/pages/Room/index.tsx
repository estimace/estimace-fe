import { FC, useState } from 'react'
import { useParams } from 'react-router-dom'

import storage from 'app/utils/storage'
import { Room, RoomInStorage } from 'app/types'
import api from 'app/utils/api'
import { useMutation, useQuery } from 'app/hooks/useAPI'

import { JoinForm } from './JoinForm'
import { PlayersInRoom } from './Players'
import { Estimation } from './Estimation'
import { OwnerControllers } from './OwnerControllers'
import { usePlayer } from './hooks/usePlayer'
import { useOnEstimateUpdatedWSMessage } from './hooks/useOnEstimateUpdatedWSMessage'
import { ShareURL } from './ShareURL'

const RoomPage: FC = () => {
  const { id: roomId } = useParams()
  const [roomInStorage, setRoomInStorage] = useState<RoomInStorage | null>(
    storage.getRoom(roomId as string),
  )
  const [room, setRoom] = useState<Room | null>(null)
  const { player, setPlayer } = usePlayer(room, roomInStorage)

  useOnEstimateUpdatedWSMessage({
    playerId: roomInStorage?.playerId,
    playerAuthToken: roomInStorage?.playerAuthToken,
    room,
    setRoom,
  })

  const roomQuery = useQuery({
    query: () => api.getRoom(roomId),
    onResponse: (result) => {
      if (!result.errorType) setRoom(result.data as Room)
    },
  })

  const joinRoomMutation = useMutation(api.addPlayerToRoom, (result) => {
    if (result.errorType) {
      return
    }

    const player = result.data
    const roomInStorage: RoomInStorage = {
      id: player.roomId,
      playerId: player.id,
      playerAuthToken: player.authToken,
    }
    storage.setRoom(roomInStorage)
    setRoomInStorage(roomInStorage)
    setRoom((prev) => {
      console.log({ prev })
      if (!prev) {
        return null
      }
      return { ...prev, players: [...prev.players, player] }
    })
    setPlayer(player)
  })

  const shouldShowJoinRoomForm = roomInStorage === null
  const shouldShowRoom = !shouldShowJoinRoomForm && room && player

  if (!roomId) {
    return null
  }

  if (roomQuery.isFetching) {
    return <div>is fetching...</div>
  }

  return (
    <>
      {roomQuery.error && <div>error: {JSON.stringify(roomQuery.error)}</div>}
      {shouldShowJoinRoomForm && (
        <JoinForm
          onSubmit={(item) => {
            storage.setPlayer(item)
            joinRoomMutation.mutate(roomId, item)
          }}
        />
      )}
      {shouldShowRoom && (
        <>
          <PlayersInRoom players={room.players} state={room.state} />

          {room.state === 'planning' && (
            <Estimation
              technique={room.technique}
              roomId={room.id}
              playerId={player.id}
              playerAuthToken={player.authToken}
            />
          )}

          {player.isOwner && (
            <OwnerControllers
              roomState={room.state}
              playerId={roomInStorage.playerId}
              playerAuthToken={roomInStorage.playerAuthToken}
            />
          )}

          <ShareURL roomId={room.id} />
        </>
      )}
    </>
  )
}

export default RoomPage
