import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import storage from './storage'
import { Player, Room, RoomInStorage, RoomState } from './types'
import { RoomEntryForm } from './RoomEntryForm'
import { addPlayerToRoom, fetchRoom } from './utils'
import { PlayersInRoom } from './PlayersInRoom'
import { Estimation, EstimationSubmitHandlerParam } from './Estimation'
import { useWebSocket } from './useWebSocket'

type CreatePlayerParam = Pick<Player, 'name' | 'email'>
type RoomStatePayload = { id: string; state: RoomState; authToken: string }

const RoomPage: FC = () => {
  const { id: roomId } = useParams()
  const [data, setData] = useState<Room | undefined>()
  const [activeRoom, setActiveRoom] = useState(
    storage.getRoom(roomId as string),
  )

  const roomQuery = useQuery<Room, Error>({
    queryKey: ['room', roomId],
    queryFn: fetchRoom,
    enabled: activeRoom ? true : false,
  })
  const [player, setPlayer] = useState(roomQuery.data?.players[0])
  const [roomState, setRoomState] = useState<RoomState>(
    data ? data.state : 'planning',
  )

  const onMessageFromWS = (event: MessageEvent) => {
    console.log('Message from server ', event)
    // const newMessage = JSON.parse(event.data)
    // if (!data) return
    // const updatedPlayer = data?.players.filter(
    //   (player) => player.id === newMessage.payload.id,
    // )

    // {
    //   type: 'estimateUpdated',
    //   payload: {
    //     id: player.id,
    //     roomId: room.id,
    //     email: 'darth@vader.com',
    //     name: 'Darth Vader',
    //     estimate: 4,
    //     isOwner: false,
    //     createdAt: mockedTime.toISOString(),
    //     updatedAt: mockedTime.toISOString(),
    //   },
    // }
    // switch (newMessage.type) {
    //   case 'roomStateUpdated':
    //     break
    //   case 'estimateUpdated':
    //     console.log('roomPlayersChanged', data)
    //     //setData({...data, data?.players[updatedPlayer].estimate =newMessage.payload.estimate})
    //     break
    // }
  }
  const { socket } = useWebSocket({
    playerId: player?.id,
    authToken: player?.authToken,
    onMessage: onMessageFromWS,
  })

  const newPlayerMutationFn = async (newPlayer: CreatePlayerParam) => {
    const newPlayerInRoom = await addPlayerToRoom(roomId as string, newPlayer)
    if (socket && socket.readyState === 1 && data) {
      socket.send(
        JSON.stringify({
          type: 'new-player',
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
      storage.setPlayer({
        name: newPlayer.name,
        email: newPlayer.email,
      })
      const roomInStorage: RoomInStorage = {
        id: newPlayer.roomId,
        playerId: newPlayer.id,
        plyerAuthToken: newPlayer.authToken,
      }
      storage.setRoom(roomInStorage)
      setActiveRoom(roomInStorage)
      setPlayer(newPlayer)
    },
  })

  useEffect(() => {
    roomQuery.refetch()
    newPlayerMutation.data
      ? setPlayer(newPlayerMutation.data)
      : setPlayer(roomQuery.data?.players[0])
  }, [newPlayerMutation.data, roomQuery])

  useEffect(() => {
    setData(roomQuery.data)
  }, [roomQuery.data])

  const onEstimateSubmit = (item: EstimationSubmitHandlerParam) => {
    console.log({ item, socket, data })
    if (!socket) {
      return
    }
    if (socket.readyState !== 1 || !data || data.state !== 'planning') {
      return
    }
    socket.send(
      JSON.stringify({
        type: 'player-estimate',
        payload: {
          id: item.playerId,
          estimate: item.estimate,
          authToken: player?.authToken,
          roomId: item.roomId,
        },
      }),
    )
  }

  const handleRevealButton = () => {
    if (!player?.isOwner || !data || !socket) return
    if (socket.readyState !== 1) return
    if (socket.readyState === 1 && activeRoom) {
      const payload: RoomStatePayload = {
        id: data.id,
        authToken: activeRoom?.id,
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
    if (!player?.isOwner || !data || !socket) return
    if (socket.readyState !== 1) return
    if (socket.readyState === 1 && activeRoom) {
      const payload: RoomStatePayload = {
        id: data.id,
        authToken: activeRoom?.id,
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

  return (
    <>
      {!activeRoom && <RoomEntryForm onSubmit={newPlayerMutation.mutate} />}
      {activeRoom && (
        <div className="planningRoomWrapper">
          {data && data.players.length && (
            <PlayersInRoom players={data.players} state={roomState} />
          )}

          {data && player && roomState === 'planning' && (
            <Estimation
              technique={data.technique}
              roomId={data.id}
              playerId={player.id}
              onEstimateSubmit={onEstimateSubmit}
            />
          )}
          {player?.isOwner && data && roomState === 'planning' && (
            <button
              onClick={(event) => {
                event.preventDefault()
                handleRevealButton()
              }}
            >
              Reveal
            </button>
          )}
          {player?.isOwner && data && roomState === 'revealed' && (
            <button
              onClick={(event) => {
                event.preventDefault()
                handleResetButton()
              }}
            >
              Reset
            </button>
          )}

          {data && (
            <section aria-labelledby="estimace-share-url-title">
              <div id="estimace-share-url-title">
                Share this room URL so your teammates can join:
              </div>
              <div aria-hidden>http://localhost:5173/rooms/{data?.id}</div>
              <button>Copy URL</button>
            </section>
          )}
        </div>
      )}
    </>
  )
}

export default RoomPage
