import { useState } from 'react'
import type { Device } from '../../types'
import { learnedProfile, nextProfile, profilesFor, profileById } from '../../data/irProfiles'
import { categoryLabel } from '../../data/catalog'
import { useStore } from '../../state/store'
import { BottomSheet } from '../layout/Primitives'
import { RequestProductSheet } from '../common/RequestProductSheet'

export function FixCodesSheet({
  open,
  device,
  onClose,
}: {
  open: boolean
  device: Device
  onClose: () => void
}) {
  const { updateDevice } = useStore()
  const [requestOpen, setRequestOpen] = useState(false)
  const codes = profilesFor(device.type, device.brand)
  const current = profileById(device.irProfileId, device.type, device.brand)

  const apply = (id: string) => {
    updateDevice(device.id, { irProfileId: id })
    onClose()
  }

  return (
    <>
      <BottomSheet open={open && !requestOpen} title="Make it work" onClose={onClose}>
        <p className="mb-3 text-[13px] leading-relaxed text-[#8e8e93]">
          Now using {current.name}. If this {device.brand} {categoryLabel(device.type).toLowerCase()} doesn’t react, try another
          remote or learn from the original.
        </p>
        <button
          type="button"
          className="mb-2 w-full rounded-2xl bg-[#1c1c1e] px-4 py-3.5 text-left"
          onClick={() => apply(nextProfile(device.irProfileId, device.type, device.brand).id)}
        >
          <span className="block text-[15px] font-medium">Try another remote</span>
          <span className="mt-0.5 block text-[12px] text-[#8e8e93]">Switch to the next {device.brand} layout</span>
        </button>
        {codes.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className="mb-2 w-full rounded-2xl bg-[#1c1c1e] px-4 py-3.5 text-left"
            style={item.id === current.id ? { boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.28)' } : undefined}
            onClick={() => apply(item.id)}
          >
            <span className="block text-[15px] font-medium">{item.name}</span>
            <span className="mt-0.5 block text-[12px] text-[#8e8e93]">
              {item.hint} · Set {i + 1}
            </span>
          </button>
        ))}
        <button
          type="button"
          className="mb-2 w-full rounded-2xl bg-[#1c1c1e] px-4 py-3.5 text-left"
          onClick={() => apply(learnedProfile(device.type, device.brand).id)}
        >
          <span className="block text-[15px] font-medium">Use learned layout</span>
          <span className="mt-0.5 block text-[12px] text-[#8e8e93]">Off + numbered speeds from the original remote</span>
        </button>
        <button
          type="button"
          className="mb-3 w-full rounded-2xl bg-[#1c1c1e] px-4 py-3.5 text-left"
          onClick={() => setRequestOpen(true)}
        >
          <span className="block text-[15px] font-medium">Request this model</span>
          <span className="mt-0.5 block text-[12px] text-[#8e8e93]">We’ll add the exact map ASAP</span>
        </button>
      </BottomSheet>
      <RequestProductSheet
        open={requestOpen}
        query={`${device.brand} ${categoryLabel(device.type)}`}
        onClose={() => {
          setRequestOpen(false)
          onClose()
        }}
      />
    </>
  )
}
