import { Header } from '../components/common/Header'
import { DeviceCard } from '../components/devices/DeviceCard'
import { PageContainer } from '../components/layout/Primitives'
import { useStore } from '../state/store'

export function FavoritesScreen() {
  const { devices, quickActions, roomById, push, back, toggleQuickFavorite } = useStore()
  const favDevices = devices.filter((d) => d.favorite)
  const favActions = quickActions.filter((q) => q.favorite)

  return (
    <div className="page-scroll">
      <Header title="Favorites" onBack={back} />
      <PageContainer>
        <div className="flex flex-col gap-2">
          {favDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              room={roomById(device.roomId)?.name}
              onClick={() => push({ name: 'category', type: device.type })}
            />
          ))}
        </div>

        <h2 className="mt-8 mb-3 text-[13px] text-[#8e8e93]">Quick actions</h2>
        <div className="flex flex-col gap-2">
          {favActions.map((action) => {
            const device = devices.find((d) => d.id === action.deviceId)
            return (
              <button
                key={action.id}
                type="button"
                onClick={() => toggleQuickFavorite(action.id)}
                className="flex items-center justify-between rounded-2xl bg-[#111113] px-4 py-3.5 text-left"
              >
                <span>
                  <span className="block text-[15px] font-medium">{device?.name}</span>
                  <span className="text-[12px] text-[#8e8e93]">{action.label}</span>
                </span>
                <span className="text-white">★</span>
              </button>
            )
          })}
        </div>
      </PageContainer>
    </div>
  )
}
