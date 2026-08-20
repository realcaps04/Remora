import { useState } from 'react'
import { Header } from '../components/common/Header'
import { DeviceCard, RoomCard } from '../components/devices/DeviceCard'
import { BottomSheet, PageContainer } from '../components/layout/Primitives'
import { categoryLabel } from '../data/catalog'
import { useStore } from '../state/store'

export function RoomsScreen() {
  const { rooms, devicesInRoom, addRoom, push, back } = useStore()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  return (
    <div className="page-scroll">
      <Header title="Rooms" onBack={back} />
      <PageContainer>
        {rooms.length === 0 ? (
          <p className="mb-4 text-[15px] text-[#8e8e93]">No rooms yet. Add one to organize devices.</p>
        ) : null}
        <div className="flex flex-col gap-2.5">
          {rooms.map((room) => {
            const list = devicesInRoom(room.id)
            return (
              <RoomCard
                key={room.id}
                name={room.name}
                summary={list.map((d) => categoryLabel(d.type)).join(' · ') || 'Empty'}
                onClick={() => push({ name: 'room', roomId: room.id })}
              />
            )
          })}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-6 h-12 w-full rounded-full bg-white text-[15px] font-medium text-black"
        >
          + Add Room
        </button>
      </PageContainer>
      <BottomSheet open={open} title="New room" onClose={() => setOpen(false)}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Room name"
          className="mb-4 h-12 w-full rounded-2xl bg-[#1c1c1e] px-4 text-[15px] outline-none"
        />
        <button
          type="button"
          className="h-12 w-full rounded-full bg-white text-[15px] font-medium text-black"
          onClick={() => {
            if (!name.trim()) return
            addRoom(name.trim())
            setName('')
            setOpen(false)
          }}
        >
          Save
        </button>
      </BottomSheet>
    </div>
  )
}

export function RoomDetailScreen({ roomId }: { roomId: string }) {
  const { roomById, devicesInRoom, push, back } = useStore()
  const room = roomById(roomId)
  const list = devicesInRoom(roomId)

  return (
    <div className="page-scroll">
      <Header title={room?.name ?? 'Room'} onBack={back} />
      <PageContainer>
        <div className="flex flex-col gap-2">
          {list.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onClick={() => push({ name: 'category', type: device.type })}
            />
          ))}
        </div>
        {list.length === 0 ? <p className="pt-10 text-center text-[#8e8e93]">No devices in this room.</p> : null}
      </PageContainer>
    </div>
  )
}
