import type { Device } from '../../types'
import { categoryLabel } from '../../data/catalog'
import { recordedCount } from '../../services/irLearner'
import { useStore } from '../../state/store'
import { RecordRemoteSheet } from './RecordRemoteSheet'

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

  return (
    <RecordRemoteSheet
      open={open}
      type={device.type}
      brand={device.brand}
      initial={device.irLibrary}
      onClose={onClose}
      onSave={(library) => {
        updateDevice(device.id, {
          irLibrary: library,
          irProfileId: `learned:${device.type}:${device.brand.toLowerCase()}`,
        })
        onClose()
      }}
    />
  )
}

export function recordedLabel(device: Device) {
  const count = recordedCount(device.irLibrary)
  if (count > 0) return `Recorded · ${count} buttons`
  return categoryLabel(device.type)
}
