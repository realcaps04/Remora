import { Plus, Search } from 'lucide-react'
import { DeviceIcon } from '../components/devices/DeviceIcon'
import { CategoryTile } from '../components/devices/DeviceCard'
import { Header } from '../components/common/Header'
import { CATEGORIES, GROUP_LABEL } from '../data/catalog'
import { useStore } from '../state/store'
import { PageContainer } from '../components/layout/Primitives'
import type { DeviceGroup } from '../types'

const GROUPS: DeviceGroup[] = ['entertainment', 'climate', 'lighting', 'other']

export function DevicesScreen() {
  const { devicesOfType, push } = useStore()

  return (
    <div className="page-scroll">
      <Header
        title="Devices"
        trailing={
          <button
            type="button"
            className="text-[#8e8e93]"
            aria-label="Search"
            onClick={() => push({ name: 'search' })}
          >
            <Search size={18} />
          </button>
        }
      />
      <PageContainer>
        <p className="mb-6 text-[15px] text-[#8e8e93]">Choose a category, then a device remote.</p>
        {GROUPS.map((group) => (
          <section key={group} className="mb-7">
            <h2 className="mb-3 text-[13px] tracking-wide text-[#8e8e93]">{GROUP_LABEL[group]}</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {CATEGORIES.filter((c) => c.group === group).map((cat) => (
                <CategoryTile
                  key={cat.type}
                  label={cat.label}
                  hint={cat.hint}
                  count={devicesOfType(cat.type).length}
                  icon={<DeviceIcon type={cat.type} />}
                  onClick={() => push({ name: 'category', type: cat.type })}
                />
              ))}
            </div>
          </section>
        ))}
        <button
          type="button"
          onClick={() => push({ name: 'add-device' })}
          className="mb-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-[15px] font-medium text-black"
        >
          <Plus size={16} />
          Add Device
        </button>
      </PageContainer>
    </div>
  )
}
