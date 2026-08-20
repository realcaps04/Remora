import { useMemo, useState } from 'react'
import { Header } from '../components/common/Header'
import { SearchBar } from '../components/common/SearchBar'
import { RequestProductCard, RequestProductSheet } from '../components/common/RequestProductSheet'
import { DeviceCard } from '../components/devices/DeviceCard'
import { DeviceIcon } from '../components/devices/DeviceIcon'
import { BRANDS, CATEGORIES, categoryLabel } from '../data/catalog'
import { PageContainer } from '../components/layout/Primitives'
import { useStore } from '../state/store'

export function SearchScreen() {
  const { searchQuery, setSearch, devices, rooms, roomById, back, push } = useStore()
  const [requestOpen, setRequestOpen] = useState(false)
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

  const roomHits = q ? rooms.filter((r) => r.name.toLowerCase().includes(q)) : []
  const categoryHits = q
    ? CATEGORIES.filter(
        (c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q) || c.type.includes(q),
      )
    : []
  const brandHits = q ? BRANDS.filter((b) => b.toLowerCase().includes(q) && b !== 'Other Brand') : []
  const missing = Boolean(q) && results.length === 0 && roomHits.length === 0 && categoryHits.length === 0 && brandHits.length === 0

  return (
    <div className="page-scroll">
      <Header title="Search" onBack={back} />
      <PageContainer>
        <SearchBar value={searchQuery} onChange={setSearch} />
        {categoryHits.length > 0 ? (
          <div className="mt-5">
            <h2 className="mb-2 text-[12px] text-[#8e8e93]">Categories</h2>
            {categoryHits.map((cat) => (
              <button
                key={cat.type}
                type="button"
                className="mb-2 flex w-full items-center gap-3 rounded-2xl bg-[#111113] px-4 py-3 text-left"
                onClick={() => push({ name: 'category', type: cat.type })}
              >
                <DeviceIcon type={cat.type} size={18} />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        ) : null}
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
        {brandHits.length > 0 && results.length === 0 ? (
          <p className="mt-5 text-[13px] text-[#8e8e93]">Brand match: {brandHits.join(', ')}</p>
        ) : null}
        <div className="mt-5 flex flex-col gap-2">
          {q && results.length === 0 && !missing ? (
            <p className="text-[15px] text-[#8e8e93]">No devices with that name yet.</p>
          ) : null}
          {results.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              room={roomById(device.roomId)?.name}
              onClick={() => push({ name: 'category', type: device.type })}
            />
          ))}
        </div>
        {missing ? (
          <RequestProductCard query={searchQuery.trim()} onClick={() => setRequestOpen(true)} />
        ) : null}
      </PageContainer>
      <RequestProductSheet
        open={requestOpen}
        query={searchQuery.trim()}
        onClose={() => setRequestOpen(false)}
      />
    </div>
  )
}
