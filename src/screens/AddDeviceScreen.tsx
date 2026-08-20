import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Header } from '../components/common/Header'
import { Button } from '../components/common/Button'
import { DeviceIcon } from '../components/devices/DeviceIcon'
import { RecordRemoteSheet } from '../components/devices/RecordRemoteSheet'
import { CATEGORIES, CONNECTION_OPTIONS, brandsFor, categoryLabel } from '../data/catalog'
import { learnedProfile, nextProfile, profilesFor, profileById, isNumberedFan } from '../data/irProfiles'
import { recordedCount } from '../services/irLearner'
import { PowerButton } from '../components/remote/PowerButton'
import { FanSpeedPad } from '../components/remote/SpecialtyControls'
import { useStore } from '../state/store'
import type { ConnectionType, DeviceType, IrLibrary } from '../types'
import { PageContainer } from '../components/layout/Primitives'
import { RequestProductCard, RequestProductSheet } from '../components/common/RequestProductSheet'

export function AddDeviceScreen({ initialType }: { initialType?: DeviceType }) {
  const { rooms, addDevice, addRoom, back, replace } = useStore()
  const [step, setStep] = useState(initialType ? 2 : 1)
  const [type, setType] = useState<DeviceType>(initialType ?? 'tv')
  const [connection, setConnection] = useState<ConnectionType>('ir')
  const [brand, setBrand] = useState(() => brandsFor(initialType ?? 'tv')[0] ?? 'Samsung')
  const [query, setQuery] = useState('')
  const [name, setName] = useState('')
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? '')
  const [newRoomName, setNewRoomName] = useState('Home')
  const [tested, setTested] = useState(false)
  const [powerOn, setPowerOn] = useState(false)
  const [testSpeed, setTestSpeed] = useState(0)
  const [requestOpen, setRequestOpen] = useState(false)
  const [recordOpen, setRecordOpen] = useState(false)
  const [library, setLibrary] = useState<IrLibrary>({})
  const [profileId, setProfileId] = useState<string>()

  const brands = useMemo(
    () => brandsFor(type).filter((b) => b.toLowerCase().includes(query.toLowerCase())),
    [query, type],
  )
  const codes = profilesFor(type, brand)
  const profile = profileById(profileId, type, brand)
  const recorded = recordedCount(library)
  const suggested = `${rooms.find((r) => r.id === roomId)?.name ?? ''} ${brand} ${categoryLabel(type)}`.trim()

  useEffect(() => {
    setProfileId(profilesFor(type, brand)[0]?.id)
    setTested(false)
    setPowerOn(false)
    setTestSpeed(0)
    setLibrary({})
  }, [type, brand])

  const tryNextRemote = () => {
    const next = nextProfile(profile.id, type, brand)
    setProfileId(next.id)
    setPowerOn(false)
    setTestSpeed(0)
    setTested(false)
  }

  return (
    <div className="page-scroll">
      <Header
        title={stepTitle(step)}
        onBack={step === 1 || (initialType && step === 2) ? back : () => setStep((s) => s - 1)}
      />
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
                    setBrand(brandsFor(cat.type)[0] ?? 'Other Brand')
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
                    setName(`${item} ${categoryLabel(type)}`)
                    setStep(4)
                  }}
                  className="rounded-2xl px-3 py-3.5 text-left text-[16px] hover:bg-[#111113]"
                >
                  {item}
                </button>
              ))}
            </div>
            {query.trim() && brands.length === 0 ? (
              <RequestProductCard query={query.trim()} onClick={() => setRequestOpen(true)} />
            ) : null}
          </>
        )}

        {step === 4 && (
          <div className="flex flex-col items-center pt-4 text-center">
            <p className="text-[15px] text-[#8e8e93]">
              {isNumberedFan(profile.layout)
                ? `Point Remora at your ${brand} fan and tap On, Off, or a speed.`
                : `Point Remora at your ${brand} ${categoryLabel(type).toLowerCase()} and tap Power.`}
            </p>
            <p className="mt-2 max-w-[280px] text-[13px] leading-relaxed text-[#636366]">
              If this layout doesn’t move the device, record buttons from the original remote.
            </p>
            <div className="my-8 flex w-full justify-center">
              {isNumberedFan(profile.layout) ? (
                <FanSpeedPad
                  max={profile.maxSpeed}
                  speed={testSpeed}
                  power={powerOn}
                  onPick={(n) => {
                    setTestSpeed(n)
                    setPowerOn(n > 0)
                    setTested(true)
                  }}
                />
              ) : (
                <PowerButton
                  on={powerOn}
                  onClick={() => {
                    setPowerOn((v) => !v)
                    setTested(true)
                  }}
                />
              )}
            </div>
            <div className="mb-5 rounded-full bg-white/8 px-3 py-1 text-[12px] tracking-wide text-[#8e8e93]">
              {recorded > 0
                ? `Recorded remote · ${recorded} buttons`
                : `${profile.name} · ${codes.findIndex((c) => c.id === profile.id) + 1} of ${codes.length}`}
            </div>
            <p className="mb-5 text-[16px] font-medium">Did it respond?</p>
            <Button onClick={() => setStep(5)} disabled={!tested && recorded === 0}>
              Yes, Continue
            </Button>
            <Button variant="ghost" className="mt-2.5" onClick={() => setRecordOpen(true)}>
              Record from original remote
            </Button>
            <Button variant="quiet" className="mt-1" onClick={tryNextRemote}>
              Try another remote
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
            {rooms.length === 0 ? (
              <input
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Room name"
                className="mb-8 h-12 w-full rounded-2xl bg-[#161618] px-4 text-[16px] outline-none"
              />
            ) : (
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
            )}
            <Button
              onClick={() => {
                const targetRoom = roomId || addRoom(newRoomName.trim() || 'Home')
                const roomName = rooms.find((r) => r.id === targetRoom)?.name || newRoomName.trim() || 'Home'
                const finalName = name.trim() || suggested || `${roomName} ${categoryLabel(type)}`.trim()
                addDevice({
                  name: finalName,
                  brand,
                  type,
                  roomId: targetRoom,
                  connectionType: connection,
                  irProfileId: recorded > 0 ? learnedProfile(type, brand).id : profile.id,
                  irLibrary: recorded > 0 ? library : undefined,
                })
                replace({ name: 'category', type })
              }}
            >
              Save Device
            </Button>
          </div>
        )}
      </PageContainer>
      <RequestProductSheet
        open={requestOpen}
        query={`${brand} ${categoryLabel(type)}`.trim()}
        onClose={() => setRequestOpen(false)}
      />
      <RecordRemoteSheet
        open={recordOpen}
        type={type}
        brand={brand}
        initial={library}
        onClose={() => setRecordOpen(false)}
        onSave={(next) => {
          setLibrary(next)
          setProfileId(learnedProfile(type, brand).id)
          setTested(true)
          setRecordOpen(false)
        }}
      />
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
