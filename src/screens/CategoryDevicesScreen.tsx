import { Plus } from 'lucide-react'
import { DeviceCard } from '../components/devices/DeviceCard'
import { Header } from '../components/common/Header'
import { categoryLabel } from '../data/catalog'
import { useStore } from '../state/store'
import { PageContainer } from '../components/layout/Primitives'
import type { DeviceType } from '../types'

export function CategoryDevicesScreen({ type }: { type: DeviceType }) {
  const { devicesOfType, roomById, push, back } = useStore()
  const list = devicesOfType(type)

  return (
    <div className="page-scroll">
      <Header title={categoryLabel(type)} onBack={back} />
      <PageContainer>
        {list.length === 0 ? (
          <div className="pt-16 text-center">
            <p className="text-[16px] font-medium">No {categoryLabel(type)} yet</p>
            <p className="mt-2 text-[14px] text-[#8e8e93]">Add one to open its remote.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {list.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                room={roomById(device.roomId)?.name}
                onClick={() => push({ name: 'remote', deviceId: device.id })}
              />
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => push({ name: 'add-device', type })}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-[15px] font-medium text-black"
        >
          <Plus size={16} />
          Add {categoryLabel(type)}
        </button>
      </PageContainer>
    </div>
  )
}
