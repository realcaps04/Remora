import { ChevronLeft, CirclePlay, Radio, VolumeX } from 'lucide-react'
import type { Device } from '../../types'
import { ChannelControl } from './SpecialtyControls'
import { RemoteButton } from './RemoteButton'
import { RemotePad } from './RemotePad'

export function DTHRemote({
  device,
  send,
}: {
  device: Device
  send: (command: string) => void
}) {
  return (
    <div className="flex flex-col items-center px-6 pt-1 pb-8">
      <RemotePad onDir={(dir) => send(dir)} onOk={() => send('ok')} />

      <div className="mt-10 flex items-start gap-14">
        <div className="flex flex-col gap-5">
          <RemoteButton aria-label="Back" onClick={() => send('back')}>
            <ChevronLeft size={26} strokeWidth={1.7} />
          </RemoteButton>
          <RemoteButton aria-label={device.state.playing ? 'Pause' : 'Play'} onClick={() => send('playPause')}>
            <CirclePlay size={26} strokeWidth={1.5} />
          </RemoteButton>
          <RemoteButton aria-label="Mute" onClick={() => send('mute')} active={device.state.muted}>
            <VolumeX size={22} strokeWidth={1.6} />
          </RemoteButton>
        </div>
        <div className="flex flex-col gap-5">
          <RemoteButton aria-label="Guide" onClick={() => send('guide')}>
            <Radio size={22} strokeWidth={1.6} />
          </RemoteButton>
          <ChannelControl onUp={() => send('channelUp')} onDown={() => send('channelDown')} />
        </div>
      </div>
    </div>
  )
}
