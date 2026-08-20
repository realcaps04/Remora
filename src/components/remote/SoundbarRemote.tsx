import { AudioLines, CirclePlay, Power, VolumeX } from 'lucide-react'
import type { Device } from '../../types'
import { RemoteButton } from './RemoteButton'
import { VolumeRocker } from './VolumeControl'

export function SoundbarRemote({
  device,
  send,
}: {
  device: Device
  send: (command: string) => void
}) {
  return (
    <div className="flex flex-col items-center px-6 pt-3 pb-8">
      <div className="dial mx-auto">
        <div className="dial-face">
          <div>
            <div className="text-[36px] font-medium leading-none tracking-tight">
              {device.state.muted ? 'Mute' : device.state.volume}
            </div>
            <div className="mt-2 text-[12px] text-[#8e8e93]">
              {device.state.power ? device.state.input : 'Standby'}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-start gap-14">
        <div className="flex flex-col gap-5">
          <RemoteButton aria-label="Power" onClick={() => send('power')} active={device.state.power}>
            <Power size={22} strokeWidth={1.7} />
          </RemoteButton>
          <RemoteButton aria-label={device.state.playing ? 'Pause' : 'Play'} onClick={() => send('playPause')}>
            <CirclePlay size={26} strokeWidth={1.5} />
          </RemoteButton>
          <RemoteButton aria-label="Mute" onClick={() => send('mute')} active={device.state.muted}>
            <VolumeX size={22} strokeWidth={1.6} />
          </RemoteButton>
        </div>
        <div className="flex flex-col gap-5">
          <RemoteButton aria-label="Input" onClick={() => send('input')}>
            <AudioLines size={20} strokeWidth={1.6} />
          </RemoteButton>
          <VolumeRocker onUp={() => send('volumeUp')} onDown={() => send('volumeDown')} />
        </div>
      </div>
    </div>
  )
}
