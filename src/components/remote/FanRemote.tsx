import { Power, RefreshCw, Timer, Wind } from 'lucide-react'
import type { Device } from '../../types'
import { Dial, FanSpeedControl } from './SpecialtyControls'
import { RemoteButton } from './RemoteButton'

export function FanRemote({
  device,
  send,
}: {
  device: Device
  send: (command: string) => void
}) {
  const running = device.state.power
  const hint = running
    ? `Running · Oscillation ${device.state.oscillation ? 'On' : 'Off'}`
    : 'Standby'

  return (
    <div className="flex flex-col items-center px-6 pt-1 pb-8">
      <Dial label="Fan speed" value={running ? device.state.speed : 'Off'} hint={hint} />

      <div className="mt-10 flex items-start gap-14">
        <div className="flex flex-col gap-5">
          <RemoteButton aria-label="Power" onClick={() => send('power')} active={running}>
            <Power size={22} strokeWidth={1.7} />
          </RemoteButton>
          <RemoteButton aria-label="Oscillation" onClick={() => send('oscillation')} active={device.state.oscillation}>
            <RefreshCw size={20} strokeWidth={1.6} />
          </RemoteButton>
          <RemoteButton aria-label="Timer" onClick={() => send('timer')}>
            <Timer size={20} strokeWidth={1.6} />
          </RemoteButton>
        </div>
        <div className="flex flex-col gap-5">
          <RemoteButton aria-label="Mode" onClick={() => send('fanMode')} active={device.state.fanMode !== 'Normal'}>
            <Wind size={20} strokeWidth={1.6} />
          </RemoteButton>
          <FanSpeedControl onUp={() => send('speedUp')} onDown={() => send('speedDown')} />
        </div>
      </div>
    </div>
  )
}
