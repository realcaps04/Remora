import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { Header } from '../components/common/Header'
import { Button } from '../components/common/Button'
import { DeviceIcon } from '../components/devices/DeviceIcon'
import { CATEGORIES, CONNECTION_OPTIONS, brandsFor, categoryLabel } from '../data/catalog'
import { learnedProfile, nextProfile, profilesFor, profileById } from '../data/irProfiles'
import { PowerButton } from '../components/remote/PowerButton'
import { useStore } from '../state/store'
import type { ConnectionType, DeviceType } from '../types'
import { BottomSheet, PageContainer } from '../components/layout/Primitives'
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
  const [requestOpen, setRequestOpen] = useState(false)
  const [otherOpen, setOtherOpen] = useState(false)
  const [learnOpen, setLearnOpen] = useState(false)
  const [learning, setLearning] = useState(false)
  const [learned, setLearned] = useState(false)
  const [profileId, setProfileId] = useState<string>()

  const brands = useMemo(
    () => brandsFor(type).filter((b) => b.toLowerCase().includes(query.toLowerCase())),
    [query, type],
  )
  const codes = profilesFor(type, brand)
  const profile = profileById(profileId, type, brand)
  const codeIndex = Math.max(0, codes.findIndex((p) => p.id === profile.id))
  const lastCode = codeIndex === codes.length - 1
  const suggested = `${rooms.find((r) => r.id === roomId)?.name ?? ''} ${brand} ${categoryLabel(type)}`.trim()

  useEffect(() => {
    setProfileId(profilesFor(type, brand)[0]?.id)
    setTested(false)
    setPowerOn(false)
    setLearned(false)
  }, [type, brand])

  const tryNextCode = () => {
    const next = nextProfile(profile.id, type, brand)
    setProfileId(next.id)
    setPowerOn(false)
    setTested(false)
    setLearned(false)
    setOtherOpen(false)
  }

  return (
    <div className="page-scroll">
      <Header
        title={stepTitle(step, learnOpen)}
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
              Point Remora at your {brand} {categoryLabel(type).toLowerCase()} and tap Power.
            </p>
            <p className="mt-2 max-w-[280px] text-[13px] leading-relaxed text-[#636366]">
              If nothing happens, this may not be the right remote. Try another one.
            </p>
            <div className="my-8">
              <PowerButton
                on={powerOn}
                onClick={() => {
                  setPowerOn((v) => !v)
                  setTested(true)
                }}
              />
            </div>
            <div className="mb-5 rounded-full bg-white/8 px-3 py-1 text-[12px] tracking-wide text-[#8e8e93]">
              {learned ? 'Learned remote' : `Remote ${codeIndex + 1} of ${codes.length} · ${profile.name}`}
            </div>
            <p className="mb-5 text-[16px] font-medium">Did it respond?</p>
            <Button onClick={() => setStep(5)} disabled={!tested && !learned}>
              Yes, Continue
            </Button>
            <Button variant="ghost" className="mt-2.5" onClick={tryNextCode}>
              Try another remote
            </Button>
            <Button variant="quiet" className="mt-1" onClick={() => setOtherOpen(true)}>
              Other ways
            </Button>
            {lastCode ? (
              <p className="mt-4 max-w-[280px] text-[12px] leading-relaxed text-[#8e8e93]">
                Last {brand} remote. If this still fails, learn from the original remote.
              </p>
            ) : null}
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
                  irProfileId: learned ? learnedProfile(type, brand).id : profile.id,
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
      <BottomSheet open={otherOpen} title="Other ways" onClose={() => setOtherOpen(false)}>
        <p className="mb-3 text-[13px] leading-relaxed text-[#8e8e93]">
          Universal remotes try several signal maps until the {brand} {categoryLabel(type).toLowerCase()} reacts.
        </p>
        <Way
          title="Try another remote"
          body={`${profile.name} didn’t work? Switch to the next ${brand} layout.`}
          onClick={tryNextCode}
        />
        {codes.map((item, i) => (
          <Way
            key={item.id}
            title={item.name}
            body={`${item.hint} · Set ${i + 1}`}
            onClick={() => {
              setProfileId(item.id)
              setPowerOn(false)
              setTested(false)
              setLearned(false)
              setOtherOpen(false)
            }}
          />
        ))}
        <Way
          title="Learn from original remote"
          body="Capture Power and speeds from the remote that already works."
          onClick={() => {
            setOtherOpen(false)
            setLearnOpen(true)
            setLearning(false)
          }}
        />
        <Way
          title="Request this model"
          body="We’ll add the exact remote map ASAP."
          onClick={() => {
            setOtherOpen(false)
            setRequestOpen(true)
          }}
        />
      </BottomSheet>
      <BottomSheet open={learnOpen} title="Learn remote" onClose={() => setLearnOpen(false)}>
        {learned && !learning ? (
          <div className="pb-4 text-center">
            <p className="text-[16px] font-medium">Buttons captured</p>
            <p className="mt-2 text-[14px] leading-relaxed text-[#8e8e93]">
              Remora saved this {brand} layout, including Off and speeds.
            </p>
            <Button
              className="mt-5"
              onClick={() => {
                setLearnOpen(false)
                setTested(true)
                setStep(5)
              }}
            >
              Continue
            </Button>
          </div>
        ) : (
          <div className="pb-3 text-center">
            <p className="text-[14px] leading-relaxed text-[#8e8e93]">
              Hold the original {brand} remote a few centimeters from the phone, then tap Learn and press Power on it.
            </p>
            <div className="my-6 flex justify-center">
              <PowerButton on={learning || learned} onClick={() => undefined} />
            </div>
            <Button
              disabled={learning}
              onClick={() => {
                setLearning(true)
                window.setTimeout(() => {
                  setLearning(false)
                  setLearned(true)
                  setProfileId(learnedProfile(type, brand).id)
                  setTested(true)
                }, 1400)
              }}
            >
              {learning ? 'Listening…' : 'Learn Power'}
            </Button>
          </div>
        )}
      </BottomSheet>
    </div>
  )
}

function Way({ title, body, onClick }: { title: string; body: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-2 w-full rounded-2xl bg-[#1c1c1e] px-4 py-3.5 text-left active:scale-[0.99]"
    >
      <span className="block text-[15px] font-medium">{title}</span>
      <span className="mt-0.5 block text-[12px] text-[#8e8e93]">{body}</span>
    </button>
  )
}

function stepTitle(step: number, learnOpen?: boolean) {
  if (learnOpen) return 'Learn Remote'
  if (step === 1) return 'Add Device'
  if (step === 2) return 'Choose Connection'
  if (step === 3) return 'Choose Brand'
  if (step === 4) return 'Test Device'
  return 'Name Your Device'
}
