import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
  addRoomToStorageRooms,
  getRoomInStorage,
  setPlayer as setPlayerInLocalStorage,
} from './storage'
import { Player, Room, RoomState } from './types'
import { RoomEntryForm } from './RoomEntryForm'
import { addPlayerToRoom, fetchRoom } from './utils'
import { PlayersInRoom } from './PlayersInRoom'
import { Estimation, EstimationSubmitHandlerParam } from './Estimation'
import { useWebSocket } from './useWebSocket'

type NewPlayerParam = Pick<Player, 'id' | 'name' | 'email'>
type RoomStatePayload = { id: string; state: RoomState; secretKey: string }

const RoomPage: FC = () => {
  const { slug } = useParams()
  const [activeRoom, setActiveRoom] = useState(getRoomInStorage(slug as string))

  const socket = useWebSocket().socket

  const roomQuery = useQuery<Room, Error>({
    queryKey: ['room', slug],
    queryFn: fetchRoom,
    enabled: activeRoom ? true : false,
  })

  const [player, setPlayer] = useState(roomQuery?.data?.players[0])
  const [roomState, setRoomState] = useState<RoomState>(
    roomQuery.data ? roomQuery.data?.state : 'planning',
  )

  useEffect(() => {
    roomQuery.refetch()
    newPlayerMutation.data
      ? setPlayer(newPlayerMutation.data)
      : setPlayer(roomQuery?.data?.players[0])
  }, [activeRoom, roomQuery, roomState])

  const onEstimateSubmit = (item: EstimationSubmitHandlerParam) => {
    if (
      socket.readyState !== 1 ||
      !roomQuery.data ||
      roomQuery.data.state !== 'planning'
    ) {
      return
    }
    if (socket.readyState === 1 && roomQuery.data?.state === 'planning')
      socket.send(JSON.stringify({ type: 'player-estimate', payload: item }))
  }

  const handleRevealButton = () => {
    if (!player?.isOwner || !roomQuery.data) return
    if (socket.readyState !== 1) return
    if (socket.readyState === 1 && activeRoom) {
      const payload: RoomStatePayload = {
        id: roomQuery.data.id,
        secretKey: activeRoom?.slug,
        state: 'revealed',
      }
      socket.send(
        JSON.stringify({
          type: 'room-state',
          payload,
        }),
      )
      setRoomState('revealed')
    }
  }

  const handleResetButton = () => {
    if (!player?.isOwner || !roomQuery.data) return
    if (socket.readyState !== 1) return
    if (socket.readyState === 1 && activeRoom) {
      const payload: RoomStatePayload = {
        id: roomQuery.data.id,
        secretKey: activeRoom?.slug,
        state: 'planning',
      }
      socket.send(
        JSON.stringify({
          type: 'room-state',
          payload,
        }),
      )
      setRoomState('revealed')
    }
  }

  const newPlayerMutationFn = async (newPlayer: NewPlayerParam) => {
    const newPlayerInRoom = await addPlayerToRoom(slug as string, newPlayer)
    if (socket.readyState === 1 && roomQuery.data) {
      socket.send(
        JSON.stringify({
          type: 'newPlayer',
          payload: {
            id: newPlayerInRoom.id,
            roomId: newPlayerInRoom.roomId,
            name: newPlayerInRoom.name,
          },
        }),
      )
    }
    return newPlayerInRoom
  }

  const newPlayerMutation = useMutation({
    mutationFn: newPlayerMutationFn,
    onSuccess: async (newPlayer) => {
      setPlayerInLocalStorage({
        id: newPlayer.id,
        name: newPlayer.name,
        email: newPlayer.email,
      })
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
            <PlayersInRoom players={roomQuery.data.players} state={roomState} />
          )}

          {roomQuery.data && player && roomState === 'planning' && (
            <Estimation
              technique={roomQuery.data.technique}
              roomId={roomQuery.data.id}
              playerId={player.id}
              onEstimateSubmit={onEstimateSubmit}
            />
          )}
          {player?.isOwner && roomQuery.data && roomState === 'planning' && (
            <button
              onClick={(event) => {
                event.preventDefault()
                handleRevealButton()
              }}
            >
              Reveal
            </button>
          )}
          {player?.isOwner && roomQuery.data && roomState === 'revealed' && (
            <button
              onClick={(event) => {
                event.preventDefault()
                handleResetButton()
              }}
            >
              Reset
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
