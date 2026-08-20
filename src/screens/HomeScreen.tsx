import { LayoutGrid, Search, Star } from 'lucide-react'
import { Wordmark } from '../components/common/Wordmark'
import { DeviceIcon } from '../components/devices/DeviceIcon'
import { DeviceStatusBadge } from '../components/devices/DeviceStatus'
import { CategoryTile, RoomCard } from '../components/devices/DeviceCard'
import { PageContainer, SectionHeader } from '../components/layout/Primitives'
import { CATEGORIES, categoryLabel } from '../data/catalog'
import { greeting, relativeTime } from '../lib/format'
import { useStore } from '../state/store'

const HOME_CATEGORIES = CATEGORIES.filter((c) =>
  ['tv', 'fan', 'ac', 'dth', 'light'].includes(c.type),
)

export function HomeScreen() {
  const { devices, rooms, devicesInRoom, devicesOfType, roomById, send, push } = useStore()
  const recent = [...devices].sort((a, b) => b.lastUsedAt - a.lastUsedAt).slice(0, 4)
  const quick = devices.slice(0, 4)

  return (
    <div className="page-scroll">
      <PageContainer className="pt-[max(28px,calc(env(safe-area-inset-top)+12px))]">
        <div className="flex items-start justify-between">
          <div>
            <div className="relative mb-1 w-fit pb-2 pr-0.5">
              <Wordmark className="block text-[18px] leading-none text-white" />
              <p className="absolute right-0 top-[calc(100%-9px)] text-[9px] leading-none tracking-wide text-[#8e8e93]">
                by Caps
              </p>
            </div>
            <h1 className="mt-5 text-[34px] font-medium leading-none tracking-tight">{greeting()}</h1>
            <p className="mt-3 text-[15px] text-[#8e8e93]">
              {devices.length > 0 ? 'Welcome back to Remora.' : 'Add a device to start controlling your home.'}
            </p>
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
          <SectionHeader title={quick.length === 0 ? 'Categories' : 'Quick Controls'} />
          {quick.length === 0 ? (
            <div className="grid grid-cols-2 gap-2.5">
              {HOME_CATEGORIES.map((cat) => (
                <CategoryTile
                  key={cat.type}
                  label={cat.label}
                  hint={cat.hint}
                  count={devicesOfType(cat.type).length}
                  icon={<DeviceIcon type={cat.type} />}
                  onClick={() => push({ name: 'category', type: cat.type })}
                />
              ))}
              <button
                type="button"
                onClick={() => push({ name: 'devices' })}
                className="focus-ring flex flex-col items-start gap-4 rounded-[22px] bg-[#111113] px-4 py-4 text-left active:scale-[0.98]"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full mat-static text-white">
                  <LayoutGrid size={20} strokeWidth={1.6} />
                </span>
                <span>
                  <span className="block text-[16px] font-medium tracking-tight">View all</span>
                  <span className="mt-0.5 block text-[12px] text-[#8e8e93]">All categories</span>
                </span>
              </button>
            </div>
          ) : (
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
          )}
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
          {rooms.length === 0 ? (
            <EmptyCard
              title="No rooms yet"
              body="Create a room, then place devices in it."
              action="Add Room"
              onClick={() => push({ name: 'rooms' })}
            />
          ) : (
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
          )}
        </div>

        <div className="mt-8">
          <SectionHeader title="Recent Devices" />
          {recent.length === 0 ? (
            <p className="text-[14px] text-[#8e8e93]">Nothing used yet.</p>
          ) : (
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
          )}
          <p className="mt-2 text-[12px] text-[#636366]">Choose a category to open a remote.</p>
        </div>
      </PageContainer>
    </div>
  )
}

function EmptyCard({
  title,
  body,
  action,
  onClick,
}: {
  title: string
  body: string
  action: string
  onClick: () => void
}) {
  return (
    <div className="rounded-[22px] bg-[#111113] px-4 py-5">
      <div className="text-[16px] font-medium tracking-tight">{title}</div>
      <p className="mt-1 text-[13px] text-[#8e8e93]">{body}</p>
      <button
        type="button"
        onClick={onClick}
        className="mt-4 h-11 w-full rounded-full bg-white text-[14px] font-medium text-black"
      >
        {action}
      </button>
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
