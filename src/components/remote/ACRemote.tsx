import { Moon, Power, Snowflake, Wind } from 'lucide-react'
import type { Device } from '../../types'
import { Dial, TemperatureControl } from './SpecialtyControls'
import { RemoteButton } from './RemoteButton'

export function ACRemote({
  device,
  send,
}: {
  device: Device
  send: (command: string) => void
}) {
  const on = device.state.power
  const modeLabel =
    device.state.acMode === 'cool'
      ? 'Cooling'
      : device.state.acMode === 'heat'
        ? 'Heating'
        : capitalize(device.state.acMode)
  const hint = on ? `${modeLabel} · Fan ${capitalize(device.state.acFan)}` : 'Standby'

  return (
    <div className="flex flex-col items-center px-6 pt-1 pb-8">
      <Dial
        label="Temperature"
        value={on ? `${device.state.temperature}°` : 'Off'}
        hint={hint}
      />

      <div className="mt-10 flex items-start gap-14">
        <div className="flex flex-col gap-5">
          <RemoteButton aria-label="Power" onClick={() => send('power')} active={on}>
            <Power size={22} strokeWidth={1.7} />
          </RemoteButton>
          <RemoteButton aria-label="Mode" onClick={() => send('acMode')}>
            <Snowflake size={20} strokeWidth={1.6} />
          </RemoteButton>
          <RemoteButton aria-label="Sleep" onClick={() => send('sleep')} active={device.state.sleep}>
            <Moon size={20} strokeWidth={1.6} />
          </RemoteButton>
        </div>
        <div className="flex flex-col gap-5">
          <RemoteButton aria-label="Fan speed" onClick={() => send('acFan')}>
            <Wind size={20} strokeWidth={1.6} />
          </RemoteButton>
          <TemperatureControl onUp={() => send('tempUp')} onDown={() => send('tempDown')} />
        </div>
      </div>
    </div>
  )
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
