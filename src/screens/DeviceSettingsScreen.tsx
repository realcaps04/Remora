import { useState } from 'react'
import { Header } from '../components/common/Header'
import { Toggle } from '../components/common/Toggle'
import { BottomSheet, PageContainer } from '../components/layout/Primitives'
import { CONNECTION_OPTIONS, brandsFor, categoryLabel } from '../data/catalog'
import { profilesFor, profileById } from '../data/irProfiles'
import { useStore } from '../state/store'
import { FixCodesSheet } from '../components/devices/FixCodesSheet'
import type { ConnectionType } from '../types'

export function DeviceSettingsScreen({ deviceId }: { deviceId: string }) {
  const { deviceById, rooms, renameDevice, updateDevice, moveDevice, toggleFavorite, removeDevice, back, replace } =
    useStore()
  const device = deviceById(deviceId)
  const [renameOpen, setRenameOpen] = useState(false)
  const [name, setName] = useState(device?.name ?? '')
  const [sheet, setSheet] = useState<'brand' | 'connection' | 'room' | 'codes' | null>(null)

  if (!device) return null

  return (
    <div className="page-scroll">
      <Header title="Device settings" onBack={back} />
      <PageContainer>
        <div className="mb-6">
          <div className="text-[22px] font-medium tracking-tight">{device.name}</div>
          <div className="mt-1 text-[13px] text-[#8e8e93]">
            {device.brand} · {categoryLabel(device.type)}
          </div>
        </div>

        <Row label="Rename" value={device.name} onClick={() => setRenameOpen(true)} />
        <Row label="Change Brand" value={device.brand} onClick={() => setSheet('brand')} />
        <Row
          label="Connection"
          value={CONNECTION_OPTIONS.find((c) => c.id === device.connectionType)?.title ?? device.connectionType}
          onClick={() => setSheet('connection')}
        />
        <Row
          label="Remote layout"
          value={profileById(device.irProfileId, device.type, device.brand).name}
          onClick={() => setSheet('codes')}
        />
        <Row
          label="Room"
          value={rooms.find((r) => r.id === device.roomId)?.name}
          onClick={() => setSheet('room')}
        />

        <div className="mt-2 flex items-center justify-between rounded-2xl bg-[#111113] px-4 py-3">
          <span className="text-[15px]">Favorite</span>
          <Toggle checked={device.favorite} onChange={() => toggleFavorite(device.id)} label="Favorite" />
        </div>

        <button
          type="button"
          className="mt-8 w-full text-[15px] text-[#ff453a]"
          onClick={() => {
            removeDevice(device.id)
            replace({ name: 'devices' })
          }}
        >
          Remove Device
        </button>
      </PageContainer>

      <BottomSheet open={renameOpen} title="Rename" onClose={() => setRenameOpen(false)}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 h-12 w-full rounded-2xl bg-[#1c1c1e] px-4 outline-none"
        />
        <button
          type="button"
          className="h-12 w-full rounded-full bg-white font-medium text-black"
          onClick={() => {
            if (name.trim()) renameDevice(device.id, name.trim())
            setRenameOpen(false)
          }}
        >
          Save
        </button>
      </BottomSheet>

      <BottomSheet open={sheet === 'brand'} title="Brand" onClose={() => setSheet(null)}>
        <div className="max-h-72 overflow-y-auto">
          {brandsFor(device.type).map((brand) => (
            <button
              key={brand}
              type="button"
              className="block w-full py-3 text-left text-[15px]"
              onClick={() => {
                updateDevice(device.id, {
                  brand,
                  irProfileId: profilesFor(device.type, brand)[0]?.id,
                })
                setSheet(null)
              }}
            >
              {brand}
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === 'connection'} title="Connection" onClose={() => setSheet(null)}>
        {CONNECTION_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            className="block w-full py-3 text-left"
            onClick={() => {
              updateDevice(device.id, { connectionType: opt.id as ConnectionType })
              setSheet(null)
            }}
          >
            {opt.title}
          </button>
        ))}
      </BottomSheet>

      <BottomSheet open={sheet === 'room'} title="Room" onClose={() => setSheet(null)}>
        {rooms.map((room) => (
          <button
            key={room.id}
            type="button"
            className="block w-full py-3 text-left text-[15px]"
            onClick={() => {
              moveDevice(device.id, room.id)
              setSheet(null)
            }}
          >
            {room.name}
          </button>
        ))}
      </BottomSheet>
      <FixCodesSheet open={sheet === 'codes'} device={device} onClose={() => setSheet(null)} />
    </div>
  )
}

function Row({ label, value, onClick }: { label: string; value?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-2 flex w-full items-center justify-between rounded-2xl bg-[#111113] px-4 py-3.5 text-left"
    >
      <span className="text-[15px]">{label}</span>
      <span className="text-[13px] text-[#8e8e93]">{value}</span>
    </button>
  )
}
