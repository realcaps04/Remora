import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Header } from '../components/common/Header'
import { Button } from '../components/common/Button'
import { DeviceIcon } from '../components/devices/DeviceIcon'
import { BRANDS, CATEGORIES, CONNECTION_OPTIONS, categoryLabel } from '../data/catalog'
import { PowerButton } from '../components/remote/PowerButton'
import { useStore } from '../state/store'
import type { ConnectionType, DeviceType } from '../types'
import { PageContainer } from '../components/layout/Primitives'

export function AddDeviceScreen({ initialType }: { initialType?: DeviceType }) {
  const { rooms, addDevice, back, replace } = useStore()
  const [step, setStep] = useState(initialType ? 2 : 1)
  const [type, setType] = useState<DeviceType>(initialType ?? 'tv')
  const [connection, setConnection] = useState<ConnectionType>('ir')
  const [brand, setBrand] = useState('Samsung')
  const [query, setQuery] = useState('')
  const [name, setName] = useState('')
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? 'living')
  const [tested, setTested] = useState(false)
  const [powerOn, setPowerOn] = useState(false)

  const brands = useMemo(
    () => BRANDS.filter((b) => b.toLowerCase().includes(query.toLowerCase())),
    [query],
  )

  const suggested = `${rooms.find((r) => r.id === roomId)?.name ?? ''} ${categoryLabel(type)}`.trim()

  return (
    <div className="page-scroll">
      <Header title={stepTitle(step)} onBack={step === 1 || (initialType && step === 2) ? back : () => setStep((s) => s - 1)} />
      <PageContainer>
        {step === 1 && (
          <>
            <p className="mb-5 text-[15px] text-[#8e8e93]">What do you want to control?</p>
            <div className="grid grid-cols-2 gap-2.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.type}
                  type="button"
                  onClick={() => {
                    setType(cat.type)
                    setStep(2)
                  }}
                  className="flex items-center gap-3 rounded-2xl bg-[#111113] px-3 py-4 text-left"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full mat-static">
                    <DeviceIcon type={cat.type} size={18} />
                  </span>
                  <span className="text-[15px] font-medium">{cat.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-2.5">
            {CONNECTION_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setConnection(opt.id)
                  setStep(3)
                }}
                className="rounded-2xl bg-[#111113] px-4 py-4 text-left"
              >
                <div className="text-[17px] font-medium">{opt.title}</div>
                <div className="mt-1 text-[13px] text-[#8e8e93]">{opt.body}</div>
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <>
            <label className="mb-4 flex items-center gap-2 rounded-2xl bg-[#161618] px-4 py-3 text-[#8e8e93]">
              <Search size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search brands"
                className="w-full bg-transparent text-[15px] text-white outline-none"
              />
            </label>
            <div className="flex flex-col gap-1">
              {brands.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setBrand(item)
                    setName(suggested)
                    setStep(4)
                  }}
                  className="rounded-2xl px-3 py-3.5 text-left text-[16px] hover:bg-[#111113]"
                >
                  {item}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center pt-6 text-center">
            <p className="text-[15px] text-[#8e8e93]">Let’s test your device</p>
            <div className="my-10">
              <PowerButton
                on={powerOn}
                onClick={() => {
                  setPowerOn((v) => !v)
                  setTested(true)
                }}
              />
            </div>
            <p className="mb-6 text-[16px] font-medium">Did your device respond?</p>
            <Button onClick={() => setStep(5)} disabled={!tested}>
              Yes, Continue
            </Button>
            <Button variant="quiet" className="mt-2" onClick={() => setTested(false)}>
              Try Again
            </Button>
          </div>
        )}

        {step === 5 && (
          <div className="pt-2">
            <label className="mb-2 block text-[13px] text-[#8e8e93]">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-5 h-12 w-full rounded-2xl bg-[#161618] px-4 text-[16px] outline-none"
            />
            <label className="mb-2 block text-[13px] text-[#8e8e93]">Room</label>
            <div className="mb-8 flex flex-col gap-2">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => setRoomId(room.id)}
                  className="rounded-2xl bg-[#111113] px-4 py-3 text-left text-[15px]"
                  style={{ boxShadow: roomId === room.id ? 'inset 0 0 0 1px rgba(255,255,255,0.28)' : undefined }}
                >
                  {room.name}
                </button>
              ))}
            </div>
            <Button
              onClick={() => {
                const finalName = name.trim() || suggested
                addDevice({ name: finalName, brand, type, roomId, connectionType: connection })
                replace({ name: 'category', type })
              }}
            >
              Save Device
            </Button>
          </div>
        )}
      </PageContainer>
    </div>
  )
}

function stepTitle(step: number) {
  if (step === 1) return 'Add Device'
  if (step === 2) return 'Choose Connection'
  if (step === 3) return 'Choose Brand'
  if (step === 4) return 'Test Device'
  return 'Name Your Device'
}
