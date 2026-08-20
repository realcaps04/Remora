import { Plus, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DeviceIcon } from '../components/devices/DeviceIcon'
import { CategoryTile } from '../components/devices/DeviceCard'
import { Header } from '../components/common/Header'
import { SearchBar } from '../components/common/SearchBar'
import { RequestProductCard, RequestProductSheet } from '../components/common/RequestProductSheet'
import { CATEGORIES, GROUP_LABEL } from '../data/catalog'
import { useStore } from '../state/store'
import { PageContainer } from '../components/layout/Primitives'
import type { DeviceGroup } from '../types'

const GROUPS: DeviceGroup[] = ['entertainment', 'climate', 'lighting', 'other']

export function DevicesScreen() {
  const { devicesOfType, push, setSearch } = useStore()
  const [query, setQuery] = useState('')
  const [requestOpen, setRequestOpen] = useState(false)
  const q = query.trim().toLowerCase()
  const visible = useMemo(
    () =>
      q
        ? CATEGORIES.filter(
            (c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q),
          )
        : CATEGORIES,
    [q],
  )
  const missing = Boolean(q) && visible.length === 0

  return (
    <div className="page-scroll">
      <Header
        title="Devices"
        trailing={
          <button
            type="button"
            className="text-[#8e8e93]"
            aria-label="Search"
            onClick={() => {
              setSearch('')
              push({ name: 'search' })
            }}
          >
            <Search size={18} />
          </button>
        }
      />
      <PageContainer>
        <p className="mb-4 text-[15px] text-[#8e8e93]">Choose a category, then a device remote.</p>
        <div className="mb-6">
          <SearchBar value={query} onChange={setQuery} placeholder="Search categories" />
        </div>
        {missing ? (
          <RequestProductCard query={query.trim()} onClick={() => setRequestOpen(true)} />
        ) : (
          GROUPS.map((group) => {
            const cats = visible.filter((c) => c.group === group)
            if (cats.length === 0) return null
            return (
              <section key={group} className="mb-7">
                <h2 className="mb-3 text-[13px] tracking-wide text-[#8e8e93]">{GROUP_LABEL[group]}</h2>
                <div className="grid grid-cols-2 gap-2.5">
                  {cats.map((cat) => (
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
            )
          })
        )}
        <button
          type="button"
          onClick={() => push({ name: 'add-device' })}
          className="mb-4 mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-[15px] font-medium text-black"
        >
          <Plus size={16} />
          Add Device
        </button>
      </PageContainer>
      <RequestProductSheet open={requestOpen} query={query.trim()} onClose={() => setRequestOpen(false)} />
    </div>
  )
}
