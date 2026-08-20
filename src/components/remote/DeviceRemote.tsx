import type { Device } from '../../types'
import { ACRemote } from './ACRemote'
import { DTHRemote } from './DTHRemote'
import { FanRemote } from './FanRemote'
import { SoundbarRemote } from './SoundbarRemote'
import { TVRemote } from './TVRemote'
import { GenericRemote, LightRemote, PlugRemote } from './UtilityRemotes'

export function DeviceRemote({
  device,
  send,
}: {
  device: Device
  send: (command: string, value?: number | string | boolean) => void
}) {
  const fire = (command: string) => send(command)

  if (device.type === 'tv' || device.type === 'projector') return <TVRemote device={device} send={fire} />
  if (device.type === 'dth') return <DTHRemote device={device} send={fire} />
  if (device.type === 'fan' || device.type === 'cooler') return <FanRemote device={device} send={send} />
  if (device.type === 'ac') return <ACRemote device={device} send={fire} />
  if (device.type === 'soundbar' || device.type === 'speaker' || device.type === 'hometheatre') {
    return <SoundbarRemote device={device} send={fire} />
  }
  if (device.type === 'light' || device.type === 'lamp') return <LightRemote device={device} send={fire} />
  if (device.type === 'plug') return <PlugRemote device={device} send={fire} />
  return <GenericRemote device={device} send={fire} />
}
