import { useState } from 'react'
import { FastForward, Info, Menu, Rewind, Settings, Star } from 'lucide-react'
import { Header } from '../components/common/Header'
import { DeviceStatusBadge } from '../components/devices/DeviceStatus'
import { BottomSheet } from '../components/layout/Primitives'
import { DeviceRemote } from '../components/remote/DeviceRemote'
import { NumericPad } from '../components/remote/NumericPad'
import { RemoteButton } from '../components/remote/RemoteButton'
import { PowerButton } from '../components/remote/PowerButton'
import { useStore } from '../state/store'

export function DeviceRemoteScreen({ deviceId }: { deviceId: string }) {
  const { deviceById, send, back, push, toggleFavorite } = useStore()
  const [more, setMore] = useState(false)
  const device = deviceById(deviceId)

  if (!device) {
    return (
      <div className="page-scroll">
        <Header title="Device" onBack={back} />
      </div>
    )
  }

  const showExtras = ['tv', 'dth', 'projector'].includes(device.type)

  return (
    <div className="page-scroll no-nav">
      <Header
        title={device.name}
        subtitle={device.brand}
        onBack={back}
        trailing={
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Favorite"
              onClick={() => toggleFavorite(device.id)}
              className="p-1 text-white"
            >
              <Star size={18} strokeWidth={1.6} className={device.favorite ? 'fill-white' : ''} />
            </button>
            <button
              type="button"
              aria-label="Device settings"
              onClick={() => push({ name: 'device-settings', deviceId: device.id })}
              className="p-1 text-white"
            >
              <Settings size={18} strokeWidth={1.6} />
            </button>
          </div>
        }
      />

      <div className="flex items-center justify-center gap-2 pb-2">
        <DeviceStatusBadge status={device.status} />
      </div>

      <DeviceRemote
        device={device}
        send={(command, value) => send(device.id, command, value !== undefined ? { value } : undefined)}
      />

      {showExtras ? (
        <div className="px-8 pb-8">
          <button
            type="button"
            onClick={() => setMore(true)}
            className="w-full text-center text-[13px] text-[#8e8e93]"
          >
            More controls
          </button>
        </div>
      ) : null}

      <BottomSheet open={more} title="More" onClose={() => setMore(false)}>
        <div className="mb-5 flex justify-center">
          <PowerButton on={device.state.power} onClick={() => send(device.id, 'power')} />
        </div>
        <div className="mb-6 flex justify-center gap-5">
          <RemoteButton size="sm" aria-label="Menu" onClick={() => send(device.id, 'menu')}>
            <Menu size={18} />
          </RemoteButton>
          <RemoteButton size="sm" aria-label="Info" onClick={() => send(device.id, 'info')}>
            <Info size={18} />
          </RemoteButton>
          <RemoteButton size="sm" aria-label="Rewind" onClick={() => send(device.id, 'rewind')}>
            <Rewind size={18} />
          </RemoteButton>
          <RemoteButton size="sm" aria-label="Fast forward" onClick={() => send(device.id, 'fastForward')}>
            <FastForward size={18} />
          </RemoteButton>
        </div>
        <NumericPad onDigit={(n) => send(device.id, 'number', { value: n })} />
      </BottomSheet>
    </div>
  )
}
