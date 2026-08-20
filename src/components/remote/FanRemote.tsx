import { Lightbulb, Moon, Power, RefreshCw, Timer, Wind } from 'lucide-react'
import type { Device } from '../../types'
import { isNumberedFan, profileById } from '../../data/irProfiles'
import { Dial, FanSpeedControl, FanSpeedPad } from './SpecialtyControls'
import { RemoteButton } from './RemoteButton'

export function FanRemote({
  device,
  send,
}: {
  device: Device
  send: (command: string, value?: number | string | boolean) => void
}) {
  const profile = profileById(device.irProfileId, device.type, device.brand)
  const running = device.state.power
  const numbered = isNumberedFan(profile.layout)
  const hint = running
    ? `${profile.name} · Speed ${device.state.speed}`
    : profile.hint

  return (
    <div className="flex flex-col items-center px-6 pt-1 pb-8">
      <Dial label="Fan speed" value={running ? device.state.speed : 'Off'} hint={hint} />

      {numbered ? (
        <div className="mt-8 flex w-full justify-center">
          <FanSpeedPad
            max={profile.maxSpeed}
            speed={device.state.speed}
            power={running}
            onPick={(n) => send('setSpeed', n)}
          />
        </div>
      ) : null}

      <div className="mt-10 flex items-start gap-14">
        <div className="flex flex-col gap-5">
          <RemoteButton aria-label="Power" onClick={() => send('power')} active={running}>
            <Power size={22} strokeWidth={1.7} />
          </RemoteButton>
          {profile.extras.includes('oscillation') || profile.extras.includes('reverse') ? (
            <RemoteButton
              aria-label={profile.extras.includes('reverse') ? 'Reverse' : 'Oscillation'}
              onClick={() => send(profile.extras.includes('reverse') ? 'reverse' : 'oscillation')}
              active={device.state.oscillation}
            >
              <RefreshCw size={20} strokeWidth={1.6} />
            </RemoteButton>
          ) : null}
          {profile.extras.includes('timer') ? (
            <RemoteButton aria-label="Timer" onClick={() => send('timer')} active={device.state.timerMinutes > 0}>
              <Timer size={20} strokeWidth={1.6} />
            </RemoteButton>
          ) : null}
        </div>
        <div className="flex flex-col gap-5">
          {profile.extras.includes('light') || profile.layout === 'fan-light' ? (
            <RemoteButton aria-label="Light" onClick={() => send('fanLight')} active={device.state.brightness > 0}>
              <Lightbulb size={20} strokeWidth={1.6} />
            </RemoteButton>
          ) : (
            <RemoteButton aria-label="Mode" onClick={() => send('fanMode')} active={device.state.fanMode !== 'Normal'}>
              <Wind size={20} strokeWidth={1.6} />
            </RemoteButton>
          )}
          {profile.extras.includes('sleep') ? (
            <RemoteButton aria-label="Sleep" onClick={() => send('sleep')} active={device.state.sleep}>
              <Moon size={20} strokeWidth={1.6} />
            </RemoteButton>
          ) : null}
          {numbered ? null : <FanSpeedControl onUp={() => send('speedUp')} onDown={() => send('speedDown')} />}
        </div>
      </div>
    </div>
  )
}
