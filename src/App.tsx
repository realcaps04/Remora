import { useState } from 'react'
import { BottomNavigation } from './components/common/BottomNavigation'
import { InstallPopup } from './components/common/InstallPopup'
import { RequestHubSheet } from './components/common/RequestHubSheet'
import { UpdatePopup } from './components/common/UpdatePopup'
import { useAppUpdate } from './lib/useAppUpdate'
import { useInstallPrompt } from './lib/useInstallPrompt'
import { useStore } from './state/store'
import { SplashScreen } from './screens/SplashScreen'
import { HomeScreen } from './screens/HomeScreen'
import { DevicesScreen } from './screens/DevicesScreen'
import { CategoryDevicesScreen } from './screens/CategoryDevicesScreen'
import { RoomsScreen, RoomDetailScreen } from './screens/RoomsScreen'
import { AddDeviceScreen } from './screens/AddDeviceScreen'
import { DeviceRemoteScreen } from './screens/DeviceRemoteScreen'
import { DeviceSettingsScreen } from './screens/DeviceSettingsScreen'
import { ScenesScreen } from './screens/ScenesScreen'
import { ActivityScreen } from './screens/ActivityScreen'
import { FavoritesScreen } from './screens/FavoritesScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { AskRemoraScreen } from './screens/AskRemoraScreen'
import { SearchScreen } from './screens/SearchScreen'

function Screen() {
  const { route } = useStore()

  switch (route.name) {
    case 'splash':
      return <SplashScreen />
    case 'home':
      return <HomeScreen />
    case 'devices':
      return <DevicesScreen />
    case 'category':
      return <CategoryDevicesScreen type={route.type} />
    case 'rooms':
      return <RoomsScreen />
    case 'room':
      return <RoomDetailScreen roomId={route.roomId} />
    case 'add-device':
      return <AddDeviceScreen initialType={route.type} />
    case 'remote':
      return <DeviceRemoteScreen deviceId={route.deviceId} />
    case 'device-settings':
      return <DeviceSettingsScreen deviceId={route.deviceId} />
    case 'scenes':
      return <ScenesScreen />
    case 'activity':
      return <ActivityScreen />
    case 'favorites':
      return <FavoritesScreen />
    case 'settings':
      return <SettingsScreen />
    case 'ask':
      return <AskRemoraScreen />
    case 'search':
      return <SearchScreen />
    default:
      return <HomeScreen />
  }
}

export default function App() {
  const { route, tab, goTab } = useStore()
  const { updateReady, reload, later } = useAppUpdate()
  const install = useInstallPrompt()
  const [requestOpen, setRequestOpen] = useState(false)
  const hideNav = route.name === 'splash' || route.name === 'remote'

  return (
    <div className="app-frame">
      <div key={tab} className="page-switch flex min-h-0 flex-1 flex-col overflow-hidden">
        <Screen />
      </div>
      {hideNav ? null : (
        <BottomNavigation
          tab={tab}
          requestOpen={requestOpen}
          onChange={(next) => {
            setRequestOpen(false)
            goTab(next)
          }}
          onRequest={() => setRequestOpen((open) => !open)}
        />
      )}
      <RequestHubSheet open={requestOpen} onClose={() => setRequestOpen(false)} />
      <UpdatePopup open={updateReady} onUpdate={() => void reload()} onLater={later} />
      <InstallPopup
        open={!updateReady && install.open}
        mode={install.mode}
        canPrompt={install.canPrompt}
        onInstall={() => void install.install()}
        onLater={install.later}
      />
    </div>
  )
}
