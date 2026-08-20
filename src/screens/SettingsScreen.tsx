import type { ReactNode } from 'react'
import { Header } from '../components/common/Header'
import { Toggle } from '../components/common/Toggle'
import { PageContainer } from '../components/layout/Primitives'
import { Wordmark } from '../components/common/Wordmark'
import { askToInstall, isStandaloneApp } from '../lib/useInstallPrompt'
import { useStore } from '../state/store'

export function SettingsScreen() {
  const { settings, patchSettings, devices, push } = useStore()
  const defaultName = devices.find((d) => d.id === settings.defaultRemote)?.name ?? 'None'

  return (
    <div className="page-scroll">
      <Header title="Settings" />
      <PageContainer>
        <Wordmark className="mb-6 text-[20px] text-white" />

        <Group title="Account">
          <Row label="Account" value="Coming soon" />
        </Group>

        <Group title="Appearance">
          <div className="flex items-center justify-between px-4 py-3.5">
            <span>Dark mode</span>
            <Toggle
              checked={settings.theme === 'dark'}
              onChange={(on) => patchSettings({ theme: on ? 'dark' : 'light' })}
              label="Dark mode"
            />
          </div>
        </Group>

        <Group title="Alerts">
          <div className="flex items-center justify-between px-4 py-3.5">
            <span>Notifications</span>
            <Toggle
              checked={settings.notifications}
              onChange={(on) => patchSettings({ notifications: on })}
              label="Notifications"
            />
          </div>
        </Group>

        <Group title="Home">
          <Row label="Connected Devices" value={`${devices.length}`} onClick={() => push({ name: 'devices' })} />
          <Row label="Rooms" onClick={() => push({ name: 'rooms' })} />
          <Row label="Scenes" onClick={() => push({ name: 'scenes' })} />
          <Row label="Favorites" onClick={() => push({ name: 'favorites' })} />
          <Row label="Default Remote" value={defaultName} />
        </Group>

        <Group title="Feedback">
          <div className="flex items-center justify-between px-4 py-3.5">
            <span>Haptic Feedback</span>
            <Toggle checked={settings.haptics} onChange={(on) => patchSettings({ haptics: on })} label="Haptics" />
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <span>Sound Feedback</span>
            <Toggle checked={settings.sound} onChange={(on) => patchSettings({ sound: on })} label="Sound" />
          </div>
        </Group>

        <Group title="App">
          {isStandaloneApp() ? (
            <Row label="Install Remora" value="Installed" />
          ) : (
            <Row label="Install Remora" value="Add as app" onClick={() => askToInstall()} />
          )}
        </Group>

        <Group title="Ask Remora">
          <Row label="Ask Remora" value="Preview" onClick={() => push({ name: 'ask' })} />
        </Group>

        <Group title="About">
          <Row label="About Remora" value="1.0.0" />
          <Row label="Privacy" />
          <Row label="Terms" />
        </Group>
      </PageContainer>
    </div>
  )
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="mb-2 px-1 text-[12px] tracking-wide text-[#8e8e93]">{title}</h2>
      <div className="overflow-hidden rounded-2xl bg-[#111113]">{children}</div>
    </section>
  )
}

function Row({
  label,
  value,
  onClick,
}: {
  label: string
  value?: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between px-4 py-3.5 text-left"
    >
      <span className="text-[15px]">{label}</span>
      {value ? <span className="text-[13px] text-[#8e8e93]">{value}</span> : null}
    </button>
  )
}
