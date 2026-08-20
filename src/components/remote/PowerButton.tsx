import { Power } from 'lucide-react'
import { RemoteButton } from './RemoteButton'

export function PowerButton({
  on,
  onClick,
}: {
  on: boolean
  onClick: () => void
}) {
  return (
    <RemoteButton aria-label={on ? 'Power off' : 'Power on'} onClick={onClick} active={on}>
      <Power size={22} strokeWidth={1.7} className={on ? 'text-white' : 'text-[#8e8e93]'} />
    </RemoteButton>
  )
}
