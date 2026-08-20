import { Share, SquarePlus } from 'lucide-react'
import { Button } from './Button'
import { Wordmark } from './Wordmark'

function installHint() {
  const ua = navigator.userAgent
  if (/Edg\//.test(ua)) return 'In Edge, open the menu and choose Apps, then Install this site as an app.'
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) {
    return 'In Chrome, tap Install in the address bar, or open the menu and choose Install Remora.'
  }
  if (/SamsungBrowser/i.test(ua)) return 'In Samsung Internet, open the menu and choose Add page to → Home screen.'
  if (/Firefox\//.test(ua)) return 'In Firefox, open the menu and choose Install. If you don’t see it, use Chrome or Edge to install Remora.'
  return 'Use your browser menu to install Remora or add it to your Home Screen.'
}

export function InstallPopup({
  open,
  mode,
  canPrompt,
  onInstall,
  onLater,
}: {
  open: boolean
  mode: 'native' | 'ios' | 'manual'
  canPrompt?: boolean
  onInstall: () => void
  onLater: () => void
}) {
  if (!open) return null
  const showInstall = mode === 'native' || Boolean(canPrompt)

  return (
    <div className="absolute inset-0 z-[60] grid place-items-center px-6 fade-in">
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
            : showInstall
              ? 'Install Remora as an app for faster access and a cleaner remote experience.'
              : installHint()}
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

        {mode === 'manual' && !showInstall ? (
          <ol className="mt-5 space-y-3 text-[14px] text-[#d2d2d7]">
            <li className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#1c1c1e] text-[12px]">1</span>
              Open the browser menu
            </li>
            <li className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#1c1c1e] text-[12px]">2</span>
              Choose Install app or Add to Home Screen
            </li>
            <li className="flex gap-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#1c1c1e] text-[12px]">3</span>
              Confirm Install
            </li>
          </ol>
        ) : null}

        <div className="mt-6 flex flex-col gap-2">
          {showInstall ? <Button onClick={onInstall}>Install app</Button> : <Button onClick={onLater}>Got it</Button>}
          {showInstall ? (
            <Button variant="quiet" onClick={onLater}>
              Not now
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
