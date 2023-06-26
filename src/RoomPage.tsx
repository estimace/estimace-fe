import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  addRoomToStorageRooms,
  getRoomInStorage,
  setPlayer as setPlayerInLocalStorage,
} from './storage'
import { Player, Room } from './types'
import { RoomEntryForm } from './RoomEntryForm'
import { addPlayerToRoom, fetchRoom } from './utils'
import { PlayersInRoom } from './PlayersInRoom'
import { Estimation } from './Estimation'

type NewPlayerParam = Pick<Player, 'name' | 'email'>

const RoomPage: FC = () => {
  const { slug } = useParams()
  const [activeRoom, setActiveRoom] = useState(getRoomInStorage(slug as string))

  const roomQuery = useQuery<Room, Error>({
    queryKey: ['room', slug],
    queryFn: fetchRoom,
    enabled: activeRoom ? true : false,
  })

  const [player, setPlayer] = useState(roomQuery?.data?.players[0])

  useEffect(() => {
    roomQuery.refetch()
    newPlayerMutation.data
      ? setPlayer(newPlayerMutation.data)
      : setPlayer(roomQuery?.data?.players[0])
  }, [activeRoom, roomQuery])

  const newPlayerMutationFn = (newPlayer: NewPlayerParam) => {
    return addPlayerToRoom(slug as string, newPlayer)
  }

  const newPlayerMutation = useMutation({
    mutationFn: newPlayerMutationFn,
    onSuccess: async (newPlayer) => {
      setPlayerInLocalStorage({ name: newPlayer.name, email: newPlayer.email })
      addRoomToStorageRooms(slug as string, newPlayer.secretKey)
      setActiveRoom({ slug: newPlayer.secretKey })
      setPlayer(newPlayer)
    },
  })

  return (
    <>
      {!activeRoom && <RoomEntryForm onSubmit={newPlayerMutation.mutate} />}
      {activeRoom && (
        <div className="planningRoomWrapper">
          {roomQuery && roomQuery.data?.players.length && (
            <PlayersInRoom
              players={roomQuery.data.players}
              state={roomQuery.data.state}
            />
          )}

          {roomQuery.data && player && (
            <Estimation
              technique={roomQuery.data.technique}
              roomId={roomQuery.data.id}
              playerId={player.id}
            />
          )}
          {player?.isOwner &&
            roomQuery.data &&
            roomQuery.data.state === 'planning' && (
              <button disabled={roomQuery.data?.state === 'planning'}>
                Reveal
              </button>
            )}
          {player?.isOwner && roomQuery.data && (
            <div className="roomAddress">
              <span>Room URL to share: </span>
              <span> http://localhost:5173/rooms/xyzxyz </span>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default RoomPage
