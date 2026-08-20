import { Moon, Power, RefreshCw, Snowflake, Wind, Zap } from 'lucide-react'
import type { Device } from '../../types'
import { profileById } from '../../data/irProfiles'
import { Dial, TemperatureControl } from './SpecialtyControls'
import { RemoteButton } from './RemoteButton'

export function ACRemote({
  device,
  send,
}: {
  device: Device
  send: (command: string) => void
}) {
  const profile = profileById(device.irProfileId, device.type, device.brand)
  const on = device.state.power
  const windowUnit = profile.layout === 'ac-window'
  const modeLabel =
    device.state.acMode === 'cool'
      ? 'Cooling'
      : device.state.acMode === 'heat'
        ? 'Heating'
        : capitalize(device.state.acMode)
  const hint = on ? `${profile.name} · ${modeLabel}` : profile.hint

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
          {windowUnit || !profile.extras.includes('sleep') ? null : (
            <RemoteButton aria-label="Sleep" onClick={() => send('sleep')} active={device.state.sleep}>
              <Moon size={20} strokeWidth={1.6} />
            </RemoteButton>
          )}
        </div>
        <div className="flex flex-col gap-5">
          {windowUnit ? null : (
            <RemoteButton aria-label="Fan speed" onClick={() => send('acFan')}>
              <Wind size={20} strokeWidth={1.6} />
            </RemoteButton>
          )}
          {profile.extras.includes('turbo') ? (
            <RemoteButton aria-label="Turbo" onClick={() => send('turbo')} active={device.state.turbo}>
              <Zap size={20} strokeWidth={1.6} />
            </RemoteButton>
          ) : null}
          {profile.extras.includes('swing') ? (
            <RemoteButton aria-label="Swing" onClick={() => send('swing')} active={device.state.swing}>
              <RefreshCw size={20} strokeWidth={1.6} />
            </RemoteButton>
          ) : null}
          <TemperatureControl onUp={() => send('tempUp')} onDown={() => send('tempDown')} />
        </div>
      </div>
    </div>
  )
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}
