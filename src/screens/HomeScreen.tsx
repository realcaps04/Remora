import { Search, Star } from 'lucide-react'
import { Wordmark } from '../components/common/Wordmark'
import { DeviceIcon } from '../components/devices/DeviceIcon'
import { DeviceStatusBadge } from '../components/devices/DeviceStatus'
import { RoomCard } from '../components/devices/DeviceCard'
import { categoryLabel } from '../data/catalog'
import { greeting, relativeTime } from '../lib/format'
import { useStore } from '../state/store'
import { PageContainer, SectionHeader } from '../components/layout/Primitives'

export function HomeScreen() {
  const { devices, rooms, devicesInRoom, roomById, send, push } = useStore()
  const recent = [...devices].sort((a, b) => b.lastUsedAt - a.lastUsedAt).slice(0, 4)
  const quick = devices.filter((d) =>
    ['living-tv', 'living-fan', 'bed-ac', 'kit-light'].includes(d.id),
  )

  return (
    <div className="page-scroll">
      <PageContainer className="pt-[max(28px,calc(env(safe-area-inset-top)+12px))]">
        <div className="flex items-start justify-between">
          <div>
            <Wordmark className="text-[18px] text-white" />
            <h1 className="mt-5 text-[34px] font-medium leading-none tracking-tight">{greeting()}</h1>
            <p className="mt-3 text-[15px] text-[#8e8e93]">Welcome back to Remora.</p>
          </div>
          <button
            type="button"
            className="remote-btn mat focus-ring !h-11 !w-11"
            aria-label="Search"
            onClick={() => push({ name: 'search' })}
          >
            <Search size={18} />
          </button>
        </div>

        <div className="mt-8">
          <SectionHeader title="Quick Controls" />
          <div className="grid grid-cols-2 gap-2.5">
            {quick.map((device) => (
              <button
                key={device.id}
                type="button"
                onClick={() => {
                  if (device.type === 'tv') send(device.id, 'power')
                  else if (device.type === 'fan') send(device.id, 'speedUp')
                  else if (device.type === 'ac') send(device.id, 'tempUp')
                  else send(device.id, 'power')
                }}
                className="rounded-[22px] bg-[#111113] px-4 py-4 text-left active:scale-[0.98]"
              >
                <div className="flex items-center justify-between text-[#8e8e93]">
                  <DeviceIcon type={device.type} size={18} />
                  {device.favorite ? <Star size={12} className="fill-white text-white" /> : null}
                </div>
                <div className="mt-4 text-[15px] font-medium tracking-tight">{categoryLabel(device.type)}</div>
                <div className="mt-1 text-[13px] text-[#8e8e93]">{quickCopy(device)}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <SectionHeader
            title="Your Rooms"
            action={
              <button type="button" className="text-[13px] text-[#8e8e93]" onClick={() => push({ name: 'rooms' })}>
                See all
              </button>
            }
          />
          <div className="flex flex-col gap-2.5">
            {rooms.map((room) => {
              const list = devicesInRoom(room.id)
              return (
                <RoomCard
                  key={room.id}
                  name={room.name}
                  summary={list.map((d) => categoryLabel(d.type)).join(' · ') || 'No devices'}
                  onClick={() => push({ name: 'room', roomId: room.id })}
                />
              )
            })}
          </div>
        </div>

        <div className="mt-8">
          <SectionHeader title="Recent Devices" />
          <div className="flex flex-col gap-2">
            {recent.map((device) => (
              <button
                key={device.id}
                type="button"
                onClick={() => push({ name: 'devices' })}
                className="flex items-center gap-3 rounded-2xl px-1 py-2 text-left"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#1c1c1e]">
                  <DeviceIcon type={device.type} size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-medium">{device.name}</span>
                  <span className="text-[12px] text-[#8e8e93]">{relativeTime(device.lastUsedAt)}</span>
                </span>
                <DeviceStatusBadge status={device.status} className="!text-[11px]" />
                <span className="sr-only">{roomById(device.roomId)?.name}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-[#636366]">Choose a category to open a remote.</p>
        </div>
      </PageContainer>
    </div>
  )
}

function quickCopy(device: { type: string; state: { power: boolean; speed: number; temperature: number; brightness: number } }) {
  if (device.type === 'tv') return device.state.power ? 'On' : 'Off'
  if (device.type === 'fan') return device.state.power ? `Speed ${device.state.speed}` : 'Off'
  if (device.type === 'ac') return device.state.power ? `${device.state.temperature}°C` : 'Off'
  if (device.type === 'light') return device.state.power ? `${device.state.brightness}%` : 'Off'
  return device.state.power ? 'On' : 'Off'
}
