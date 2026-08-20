import { Share, SquarePlus } from 'lucide-react'
import { Button } from './Button'
import { Wordmark } from './Wordmark'

export function InstallPopup({
  open,
  mode,
  onInstall,
  onLater,
}: {
  open: boolean
  mode: 'native' | 'ios' | 'manual'
  onInstall: () => void
  onLater: () => void
}) {
  if (!open) return null

  return (
    <div className="absolute inset-0 z-40 grid place-items-center px-6 fade-in">
      <button type="button" className="absolute inset-0 bg-black/70" aria-label="Dismiss" onClick={onLater} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="install-title"
        aria-describedby="install-copy"
        className="relative w-full rounded-[28px] bg-[#161618] px-5 py-6 shadow-[0_24px_60px_rgba(0,0,0,0.55)]"
      >
        <Wordmark className="text-[16px] text-white" />
        <h2 id="install-title" className="mt-3 text-[22px] font-medium tracking-tight">
          Install Remora
        </h2>
        <p id="install-copy" className="mt-2 text-[15px] leading-relaxed text-[#8e8e93]">
          {mode === 'ios'
            ? 'Add Remora to your Home Screen for a full-screen remote, away from the browser.'
            : mode === 'manual'
              ? 'Use your browser menu to install Remora or add it to your Home Screen.'
              : 'Install Remora as an app for faster access and a cleaner remote experience.'}
        </p>

        {mode === 'ios' ? (
          <ol className="mt-5 space-y-3 text-[14px] text-[#d2d2d7]">
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1c1c1e]">
                <Share size={16} strokeWidth={1.7} />
              </span>
              Tap Share
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#1c1c1e]">
                <SquarePlus size={16} strokeWidth={1.7} />
              </span>
              Tap Add to Home Screen
            </li>
          </ol>
        ) : null}

        <div className="mt-6 flex flex-col gap-2">
          {mode === 'native' ? <Button onClick={onInstall}>Install app</Button> : <Button onClick={onLater}>Got it</Button>}
          {mode === 'native' ? (
            <Button variant="quiet" onClick={onLater}>
              Not now
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
