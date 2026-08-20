import { useMemo } from 'react'
import { Header } from '../components/common/Header'
import { SearchBar } from '../components/common/SearchBar'
import { DeviceCard } from '../components/devices/DeviceCard'
import { categoryLabel } from '../data/catalog'
import { PageContainer } from '../components/layout/Primitives'
import { useStore } from '../state/store'

export function SearchScreen() {
  const { searchQuery, setSearch, devices, rooms, roomById, back, push } = useStore()
  const q = searchQuery.trim().toLowerCase()

  const results = useMemo(() => {
    if (!q) return devices
    return devices.filter((d) => {
      const room = roomById(d.roomId)?.name ?? ''
      return (
        d.name.toLowerCase().includes(q) ||
        d.brand.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        categoryLabel(d.type).toLowerCase().includes(q) ||
        room.toLowerCase().includes(q)
      )
    })
  }, [devices, q, roomById])

  const roomHits = rooms.filter((r) => r.name.toLowerCase().includes(q))

  return (
    <div className="page-scroll">
      <Header title="Search" onBack={back} />
      <PageContainer>
        <SearchBar value={searchQuery} onChange={setSearch} />
        {q && roomHits.length > 0 ? (
          <div className="mt-5">
            <h2 className="mb-2 text-[12px] text-[#8e8e93]">Rooms</h2>
            {roomHits.map((room) => (
              <button
                key={room.id}
                type="button"
                className="mb-2 block w-full rounded-2xl bg-[#111113] px-4 py-3 text-left"
                onClick={() => push({ name: 'room', roomId: room.id })}
              >
                {room.name}
              </button>
            ))}
          </div>
        ) : null}
        <div className="mt-5 flex flex-col gap-2">
          {results.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              room={roomById(device.roomId)?.name}
              onClick={() => push({ name: 'category', type: device.type })}
            />
          ))}
        </div>
      </PageContainer>
    </div>
  )
}
