import { Lightbulb, Moon, Power, RefreshCw, Timer, Wind } from 'lucide-react'
import type { Device } from '../../types'
import { isNumberedFan, profileById, type RemoteExtra } from '../../data/irProfiles'
import { Dial, FanSpeedControl, FanSpeedPad } from './SpecialtyControls'
import { RemoteButton } from './RemoteButton'

function recordedMaxSpeed(device: Device, fallback: number) {
  const library = device.irLibrary
  if (!library) return fallback
  const found = [5, 4, 3, 2, 1].find((n) => library[`speed${n}`])
  return found ?? fallback
}

export function FanRemote({
  device,
  send,
}: {
  device: Device
  send: (command: string, value?: number | string | boolean) => void
}) {
  const profile = profileById(device.irProfileId, device.type, device.brand)
  const running = device.state.power
  const recorded = Boolean(device.irLibrary && Object.keys(device.irLibrary).length > 0)
  const numbered = recorded || isNumberedFan(profile.layout)
  const max = recorded ? recordedMaxSpeed(device, profile.maxSpeed) : profile.maxSpeed
  const extras: RemoteExtra[] = recorded
    ? ([
        device.irLibrary?.timer ? 'timer' : null,
        device.irLibrary?.light ? 'light' : null,
        device.irLibrary?.reverse ? 'reverse' : null,
        device.irLibrary?.sleep ? 'sleep' : null,
      ].filter(Boolean) as RemoteExtra[])
    : profile.extras
  const hint = recorded
    ? running
      ? `Recorded remote · Speed ${device.state.speed}`
      : 'Saved in the app — this phone cannot send the fan signal'
    : running
      ? `${profile.name} · Speed ${device.state.speed}`
      : profile.hint

  return (
    <div className="flex flex-col items-center px-6 pt-1 pb-8">
      <Dial label="Fan speed" value={running ? device.state.speed : 'Off'} hint={hint} />

      {numbered ? (
        <div className="mt-8 flex w-full justify-center">
          <FanSpeedPad
            max={max}
            speed={device.state.speed}
            power={running}
            onPick={(n) => (n <= 0 ? send('powerOff') : send('setSpeed', n))}
            onOn={() => send('powerOn')}
          />
        </div>
      ) : null}

      <div className="mt-10 flex items-start gap-14">
        <div className="flex flex-col gap-5">
          <RemoteButton aria-label="Power" onClick={() => send(running ? 'powerOff' : 'powerOn')} active={running}>
            <Power size={22} strokeWidth={1.7} />
          </RemoteButton>
          {extras.includes('oscillation') || extras.includes('reverse') ? (
            <RemoteButton
              aria-label={extras.includes('reverse') ? 'Reverse' : 'Oscillation'}
              onClick={() => send(extras.includes('reverse') ? 'reverse' : 'oscillation')}
              active={device.state.oscillation}
            >
              <RefreshCw size={20} strokeWidth={1.6} />
            </RemoteButton>
          ) : null}
          {extras.includes('timer') ? (
            <RemoteButton aria-label="Timer" onClick={() => send('timer')} active={device.state.timerMinutes > 0}>
              <Timer size={20} strokeWidth={1.6} />
            </RemoteButton>
          ) : null}
        </div>
        <div className="flex flex-col gap-5">
          {extras.includes('light') || profile.layout === 'fan-light' ? (
            <RemoteButton aria-label="Light" onClick={() => send('fanLight')} active={device.state.brightness > 0}>
              <Lightbulb size={20} strokeWidth={1.6} />
            </RemoteButton>
          ) : recorded ? null : (
            <RemoteButton aria-label="Mode" onClick={() => send('fanMode')} active={device.state.fanMode !== 'Normal'}>
              <Wind size={20} strokeWidth={1.6} />
            </RemoteButton>
          )}
          {extras.includes('sleep') ? (
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
