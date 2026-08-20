import { Button } from './Button'
import { Wordmark } from './Wordmark'

export function UpdatePopup({
  open,
  onUpdate,
  onLater,
}: {
  open: boolean
  onUpdate: () => void
  onLater: () => void
}) {
  if (!open) return null

  return (
    <div className="absolute inset-0 z-50 grid place-items-center px-6 fade-in">
      <div className="absolute inset-0 bg-black/70" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-title"
        aria-describedby="update-copy"
        className="relative w-full rounded-[28px] bg-[#161618] px-5 py-6 text-center shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
      >
        <Wordmark className="text-[16px] text-white" />
        <h2 id="update-title" className="mt-3 text-[22px] font-medium tracking-tight">
          Update ready
        </h2>
        <p id="update-copy" className="mt-2 text-[15px] leading-relaxed text-[#8e8e93]">
          A new version is live. Update now so remotes, devices, and controls stay in sync.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={onUpdate}>Update now</Button>
          <Button variant="quiet" onClick={onLater}>
            Later
          </Button>
        </div>
      </div>
    </div>
  )
}
