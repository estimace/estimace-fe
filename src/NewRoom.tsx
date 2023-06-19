import { FC, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { apiUrl } from '@/config'
import { Technique, Room } from '@/types'
import { setPlayer, addRoomToOwnedRooms, getPlayer } from '@/storage'
import { NewRoomForm } from '@/NewRoomForm'

const CreateRoom: FC = () => {
  const storedPlayer = getPlayer()
  const techniques: Technique[] = ['fibonacci', 'tShirtSizing']
  const [ownerName, setOwnerName] = useState(storedPlayer?.name ?? '')
  const [ownerEmail, setOwnerEmail] = useState(storedPlayer?.email ?? '')
  const [technique, setTechnique] = useState<Technique>('fibonacci')

  const navigate = useNavigate()

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'ownerName':
        setOwnerName(e.target.value)
        break
      case 'ownerEmail':
        setOwnerEmail(e.target.value)
        break
    }
  }

  const handleSelectOptionChange = (e: React.FormEvent<HTMLSelectElement>) => {
    setTechnique(e.currentTarget.value as Technique)
  }

  const createRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const res = await fetch(`${apiUrl}/rooms`, {
      method: 'POST',
      body: JSON.stringify({ ownerName, technique, ownerEmail }),
    })

    return (await res.json()) as Room

    // return {
    //   id: 1,
    //   slug: 'xyzxyz',
    //   ownerSecret: 'abcde456',
    //   state: 'planning',
    //   technique: 'fibonacci',
    //   players: [
    //     {
    //       id: 1,
    //       roomId: 1,
    //       ownerSecret: 'abcde456',
    //       name: ownerName,
    //       email: ownerEmail,
    //       estimate: null,
    //     },
    //   ],
    // }
  }

  const useCreateRoomMutation = useMutation({
    mutationFn: createRoom,

    onSuccess: async (room) => {
      setPlayer({ name: ownerName, email: ownerEmail })
      addRoomToOwnedRooms({ id: room.id, ownerSecret: room.ownerSecret })
      navigate(`/rooms/${room.slug}`)
    },
  })

  return (
    <NewRoomForm
      useCreateRoomMutation={useCreateRoomMutation}
      handleChange={handleFormInputChange}
      handleSelect={handleSelectOptionChange}
      techniques={techniques}
      ownerName={ownerName}
      ownerEmail={ownerEmail}
      technique={technique}
    />
  )
}

export default CreateRoom
