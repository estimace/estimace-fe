import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'

import storage from 'app/utils/storage'
import { Player, Room, RoomInStorage, RoomState } from 'app/types'
import { addPlayerToRoom, fetchRoom } from 'app/utils'
import { useWebSocket } from 'app/hooks/useWebSocket'
import { getBaseURL } from 'app/config'

import { JoinForm } from './JoinForm'
import { PlayersInRoom } from './Players'
import { Estimation, EstimationSubmitHandlerParam } from './Estimation'

type CreatePlayerParam = Pick<Player, 'name' | 'email'>
type RoomStatePayload = { id: string; state: RoomState; authToken: string }

const RoomPage: FC = () => {
  const { id: roomId } = useParams()
  const [roomData, setRoomData] = useState<Room | undefined>()
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
    roomData ? roomData.state : 'planning',
  )

  const onMessageFromWS = (event: MessageEvent) => {
    console.log('Message from server ', event)
    if (!roomData) return
    const newMessage = JSON.parse(event.data)

    switch (newMessage.type) {
      case 'estimateUpdated': {
        const updatedPlayer = roomData.players.find(
          (player) => player.id === newMessage.payload.id,
        )
        if (!updatedPlayer) {
          return
        }
        updatedPlayer.estimate = newMessage.payload.estimate
        setRoomData((prevState) => {
          if (!prevState) {
            return
          }
          const nextState = { ...prevState }
          if (!nextState.players) {
            return prevState
          }
          const updatedPlayer = nextState.players.find(
            (player) => player.id === newMessage.payload.id,
          )
          if (!updatedPlayer) {
            return prevState
          }
          updatedPlayer.estimate = newMessage.payload.estimate
          return nextState
        })
        break
      }
    }
  }
  const { socket } = useWebSocket({
    playerId: player?.id,
    authToken: player?.authToken,
    onMessage: onMessageFromWS,
  })

  const newPlayerMutationFn = async (newPlayer: CreatePlayerParam) => {
    storage.setPlayer({
      name: newPlayer.name,
      email: newPlayer.email,
    })
    const newPlayerInRoom = await addPlayerToRoom(roomId as string, newPlayer)

    return newPlayerInRoom
  }

  const newPlayerMutation = useMutation({
    mutationFn: newPlayerMutationFn,
    onSuccess: async (newPlayer) => {
      const roomInStorage: RoomInStorage = {
        id: newPlayer.roomId,
        playerId: newPlayer.id,
        playerAuthToken: newPlayer.authToken,
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
    setRoomData(roomQuery.data)
  }, [roomQuery.data])

  const onEstimateSubmit = (item: EstimationSubmitHandlerParam) => {
    if (!socket) {
      return
    }
    if (socket.readyState !== 1 || !roomData || roomData.state !== 'planning') {
      return
    }
    socket.send(
      JSON.stringify({
        type: 'updateEstimate',
        payload: {
          estimate: item.estimate,
        },
      }),
    )
  }

  const handleRevealButton = () => {
    if (!player?.isOwner || !roomData || !socket) return
    if (socket.readyState !== 1) return
    if (socket.readyState === 1 && activeRoom) {
      const payload: RoomStatePayload = {
        id: roomData.id,
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
    if (!player?.isOwner || !roomData || !socket) return
    if (socket.readyState !== 1) return
    if (socket.readyState === 1 && activeRoom) {
      const payload: RoomStatePayload = {
        id: roomData.id,
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
      {!activeRoom && <JoinForm onSubmit={newPlayerMutation.mutate} />}
      {activeRoom && (
        <div className="planningRoomWrapper">
          {roomData && roomData.players.length && (
            <PlayersInRoom players={roomData.players} state={roomState} />
          )}

          {roomData && player && roomState === 'planning' && (
            <Estimation
              technique={roomData.technique}
              roomId={roomData.id}
              playerId={player.id}
              onEstimateSubmit={onEstimateSubmit}
            />
          )}
          {player?.isOwner && roomData && roomState === 'planning' && (
            <button
              onClick={(event) => {
                event.preventDefault()
                handleRevealButton()
              }}
            >
              Reveal
            </button>
          )}
          {player?.isOwner && roomData && roomState === 'revealed' && (
            <button
              onClick={(event) => {
                event.preventDefault()
                handleResetButton()
              }}
            >
              Reset
            </button>
          )}

          {roomData && (
            <section aria-labelledby="estimace-share-url-title">
              <div id="estimace-share-url-title">
                Share this room URL so your teammates can join:
              </div>
              <div aria-hidden>
                {getBaseURL()}/rooms/{roomData?.id}
              </div>
              <button>Copy URL</button>
            </section>
          )}
        </div>
      )}
    </>
  )
}

export default RoomPage
