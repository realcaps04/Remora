import { useMemo, useState, type ReactNode } from 'react'
import {
  Heart,
  LayoutGrid,
  Lightbulb,
  MessageCircle,
  MessageSquarePlus,
  Package,
  Plus,
  SearchX,
  Settings,
  Sofa,
  Sparkles,
  TriangleAlert,
} from 'lucide-react'
import { Header } from '../components/common/Header'
import { SearchBar } from '../components/common/SearchBar'
import { RequestHubSheet } from '../components/common/RequestHubSheet'
import { RequestProductCard, RequestProductSheet } from '../components/common/RequestProductSheet'
import { DeviceCard } from '../components/devices/DeviceCard'
import { DeviceIcon } from '../components/devices/DeviceIcon'
import { BRANDS, CATEGORIES, categoryLabel } from '../data/catalog'
import { PageContainer } from '../components/layout/Primitives'
import { useStore } from '../state/store'
import type { FeedbackKind, Route } from '../types'

function hit(q: string, ...parts: string[]) {
  return parts.some((part) => part.toLowerCase().includes(q))
}

export function SearchScreen() {
  const { searchQuery, setSearch, devices, rooms, scenes, roomById, back, push } = useStore()
  const [requestOpen, setRequestOpen] = useState(false)
  const [hubOpen, setHubOpen] = useState(false)
  const [hubKind, setHubKind] = useState<FeedbackKind | null>(null)
  const q = searchQuery.trim().toLowerCase()

  const openRequest = (kind: FeedbackKind | null = null) => {
    setHubKind(kind)
    setHubOpen(true)
  }

  const go = (route: Route) => push(route)

  const pages = [
    {
      id: 'add-device',
      title: 'Add device',
      hint: 'Set up a new remote',
      keywords: ['add', 'new', 'pair', 'setup', 'connect'],
      pin: true,
      icon: <Plus size={18} />,
      onClick: () => go({ name: 'add-device' }),
    },
    {
      id: 'devices',
      title: 'Devices',
      hint: 'All categories',
      keywords: ['device', 'category', 'remote', 'catalog'],
      pin: true,
      icon: <LayoutGrid size={18} />,
      onClick: () => go({ name: 'devices' }),
    },
    {
      id: 'rooms',
      title: 'Rooms',
      hint: 'Organize devices',
      keywords: ['room', 'home', 'space'],
      pin: true,
      icon: <Sofa size={18} />,
      onClick: () => go({ name: 'rooms' }),
    },
    {
      id: 'scenes',
      title: 'Scenes',
      hint: 'Run several devices at once',
      keywords: ['scene', 'routine', 'automation'],
      pin: true,
      icon: <Sparkles size={18} />,
      onClick: () => go({ name: 'scenes' }),
    },
    {
      id: 'favorites',
      title: 'Favorites',
      hint: 'Starred devices',
      keywords: ['favorite', 'star', 'saved'],
      pin: true,
      icon: <Heart size={18} />,
      onClick: () => go({ name: 'favorites' }),
    },
    {
      id: 'settings',
      title: 'Settings',
      hint: 'App preferences',
      keywords: ['settings', 'theme', 'haptic', 'install', 'account'],
      pin: true,
      icon: <Settings size={18} />,
      onClick: () => go({ name: 'settings' }),
    },
    {
      id: 'ask',
      title: 'Ask Remora',
      hint: 'Help and questions',
      keywords: ['ask', 'help', 'chat', 'assistant'],
      pin: true,
      icon: <MessageCircle size={18} />,
      onClick: () => go({ name: 'ask' }),
    },
    {
      id: 'request',
      title: 'Request',
      hint: 'Feature, product, missing, not working',
      keywords: ['request', 'report', 'feedback', 'support'],
      pin: true,
      icon: <MessageSquarePlus size={18} />,
      onClick: () => openRequest(null),
    },
    {
      id: 'feature',
      title: 'New feature',
      hint: 'Suggest something to add',
      keywords: ['feature', 'idea', 'suggest'],
      pin: false,
      icon: <Lightbulb size={18} />,
      onClick: () => openRequest('feature'),
    },
    {
      id: 'product',
      title: 'Request a product',
      hint: 'Device type, brand, or model',
      keywords: ['product', 'asap'],
      pin: false,
      icon: <Package size={18} />,
      onClick: () => openRequest('product'),
    },
    {
      id: 'missing',
      title: 'Something’s missing',
      hint: 'Category, brand, or button gap',
      keywords: ['missing', 'absent', 'gap'],
      pin: false,
      icon: <SearchX size={18} />,
      onClick: () => openRequest('missing'),
    },
    {
      id: 'issue',
      title: 'Not working',
      hint: 'Report a broken remote or control',
      keywords: ['issue', 'bug', 'broken', 'fail', 'not working', 'error'],
      pin: false,
      icon: <TriangleAlert size={18} />,
      onClick: () => openRequest('issue'),
    },
  ].filter((item) => (q ? hit(q, item.title, item.hint, ...item.keywords) : item.pin))

  const deviceHits = useMemo(() => {
    const list = q
      ? devices.filter((d) => {
          const room = roomById(d.roomId)?.name ?? ''
          return hit(q, d.name, d.brand, d.type, categoryLabel(d.type), room, d.connectionType)
        })
      : devices
    return list
  }, [devices, q, roomById])

  const roomHits = q ? rooms.filter((r) => hit(q, r.name)) : rooms
  const sceneHits = q ? scenes.filter((s) => hit(q, s.name, s.description)) : scenes
  const categoryHits = q
    ? CATEGORIES.filter((c) => hit(q, c.label, c.hint, c.type, c.group))
    : CATEGORIES
  const brandHits = q ? BRANDS.filter((b) => b !== 'Other Brand' && hit(q, b)) : []

  const missing =
    Boolean(q) &&
    deviceHits.length === 0 &&
    roomHits.length === 0 &&
    sceneHits.length === 0 &&
    categoryHits.length === 0 &&
    brandHits.length === 0 &&
    pages.length === 0

  return (
    <div className="page-scroll">
      <Header title="Search" onBack={back} />
      <PageContainer>
        <SearchBar
          autoFocus
          value={searchQuery}
          onChange={setSearch}
          placeholder="Search anything in Remora"
        />

        {missing ? (
          <RequestProductCard query={searchQuery.trim()} onClick={() => setRequestOpen(true)} />
        ) : (
          <>
            <Section title={q ? 'Pages' : 'Jump to'} hidden={pages.length === 0}>
              {pages.map((item) => (
                <ResultRow key={item.id} icon={item.icon} title={item.title} hint={item.hint} onClick={item.onClick} />
              ))}
            </Section>

            <Section title="Categories" hidden={categoryHits.length === 0}>
              {categoryHits.map((cat) => (
                <ResultRow
                  key={cat.type}
                  icon={<DeviceIcon type={cat.type} size={18} />}
                  title={cat.label}
                  hint={cat.hint}
                  onClick={() => go({ name: 'category', type: cat.type })}
                />
              ))}
            </Section>

            <Section title="Devices" hidden={deviceHits.length === 0}>
              {deviceHits.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  room={roomById(device.roomId)?.name}
                  onClick={() => go({ name: 'remote', deviceId: device.id })}
                />
              ))}
            </Section>

            <Section title="Rooms" hidden={roomHits.length === 0}>
              {roomHits.map((room) => (
                <ResultRow
                  key={room.id}
                  title={room.name}
                  hint="Open room"
                  onClick={() => go({ name: 'room', roomId: room.id })}
                />
              ))}
            </Section>

            <Section title="Scenes" hidden={sceneHits.length === 0}>
              {sceneHits.map((scene) => (
                <ResultRow
                  key={scene.id}
                  icon={<Sparkles size={18} />}
                  title={scene.name}
                  hint={scene.description || 'Open scenes'}
                  onClick={() => go({ name: 'scenes' })}
                />
              ))}
            </Section>

            <Section title="Brands" hidden={brandHits.length === 0}>
              {brandHits.map((brand) => (
                <ResultRow
                  key={brand}
                  title={brand}
                  hint="Add a device with this brand"
                  onClick={() => go({ name: 'add-device' })}
                />
              ))}
            </Section>
          </>
        )}
      </PageContainer>
      <RequestProductSheet
        open={requestOpen}
        query={searchQuery.trim()}
        onClose={() => setRequestOpen(false)}
      />
      <RequestHubSheet
        open={hubOpen}
        initialKind={hubKind}
        initialSubject={q ? searchQuery.trim() : ''}
        onClose={() => {
          setHubOpen(false)
          setHubKind(null)
        }}
      />
    </div>
  )
}

function Section({
  title,
  hidden,
  children,
}: {
  title: string
  hidden?: boolean
  children: ReactNode
}) {
  if (hidden) return null
  return (
    <div className="mt-6">
      <h2 className="mb-2 text-[12px] tracking-wide text-[#8e8e93]">{title}</h2>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

function ResultRow({
  icon,
  title,
  hint,
  onClick,
}: {
  icon?: ReactNode
  title: string
  hint?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl bg-[#111113] px-4 py-3 text-left active:scale-[0.99]"
    >
      {icon ? (
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1c1c1e] text-white">{icon}</span>
      ) : null}
      <span className="min-w-0">
        <span className="block truncate text-[15px] font-medium">{title}</span>
        {hint ? <span className="mt-0.5 block text-[12px] text-[#8e8e93]">{hint}</span> : null}
      </span>
    </button>
  )
}
