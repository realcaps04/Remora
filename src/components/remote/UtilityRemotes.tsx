import { Lightbulb, Power } from 'lucide-react'
import type { Device } from '../../types'
import { profileById } from '../../data/irProfiles'
import { Dial } from './SpecialtyControls'
import { RemoteButton } from './RemoteButton'
import { VolumeRocker } from './VolumeControl'

export function LightRemote({
  device,
  send,
}: {
  device: Device
  send: (command: string) => void
}) {
  const profile = profileById(device.irProfileId, device.type, device.brand)
  const toggle = profile.layout === 'light-toggle'
  const value = device.state.power ? `${device.state.brightness}%` : 'Off'
  return (
    <div className="flex flex-col items-center gap-10 px-7 pt-2 pb-6">
      <Dial label="Brightness" value={toggle ? (device.state.power ? 'On' : 'Off') : value} hint={profile.hint} />
      <div className="grid w-full max-w-[280px] grid-cols-[72px_1fr_72px] items-start gap-x-8">
        <RemoteButton aria-label="Power" onClick={() => send('power')} active={device.state.power}>
          <Power size={22} strokeWidth={1.7} />
        </RemoteButton>
        <div />
        {toggle ? (
          <div />
        ) : (
          <div className="flex flex-col items-end gap-5">
            <RemoteButton aria-label="Dim preset" onClick={() => send('setBrightness')}>
              <Lightbulb size={20} strokeWidth={1.6} />
            </RemoteButton>
            <VolumeRocker
              onUp={() => send('brightnessUp')}
              onDown={() => send('brightnessDown')}
              upLabel="Brighter"
              downLabel="Dimmer"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export function PlugRemote({
  device,
  send,
}: {
  device: Device
  send: (command: string) => void
}) {
  const profile = profileById(device.irProfileId, device.type, device.brand)
  return (
    <div className="flex flex-col items-center gap-10 px-7 pt-8 pb-6">
      <Dial label="Plug" value={device.state.power ? 'On' : 'Off'} hint={profile.name} />
      <RemoteButton size="lg" aria-label="Power" onClick={() => send('power')} active={device.state.power}>
        <Power size={26} strokeWidth={1.7} />
      </RemoteButton>
    </div>
  )
}

export function GenericRemote({
  device,
  send,
}: {
  device: Device
  send: (command: string) => void
}) {
  const profile = profileById(device.irProfileId, device.type, device.brand)
  return (
    <div className="flex flex-col items-center gap-10 px-7 pt-2 pb-6">
      <Dial label={device.name} value={device.state.power ? 'On' : 'Off'} hint={profile.hint} />
      <div className="grid w-full max-w-[280px] grid-cols-[72px_1fr_72px] items-start gap-x-8">
        <RemoteButton aria-label="Power" onClick={() => send('power')} active={device.state.power}>
          <Power size={22} strokeWidth={1.7} />
        </RemoteButton>
        <div />
        <VolumeRocker onUp={() => send('volumeUp')} onDown={() => send('volumeDown')} />
      </div>
    </div>
  )
}
