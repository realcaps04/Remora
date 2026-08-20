import { useCallback, useEffect, useRef, useState } from 'react'

const DISMISS_KEY = 'remora:install-dismissed-at'
const DISMISS_MS = 14 * 24 * 60 * 60 * 1000
const ASK_EVENT = 'remora:ask-install'

type InstallMode = 'native' | 'ios' | 'manual'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

let capturedPrompt: BeforeInstallPromptEvent | null = null

export function captureInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    capturedPrompt = event as BeforeInstallPromptEvent
    window.dispatchEvent(new Event('remora:install-available'))
  })
  window.addEventListener('appinstalled', () => {
    capturedPrompt = null
  })
}

export function isStandaloneApp() {
  if (typeof window === 'undefined') return false
  const media = window.matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches
  const ios = 'standalone' in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  return media || ios
}

function isIosDevice() {
  const ua = navigator.userAgent
  const iPhone = /iPhone|iPad|iPod/i.test(ua)
  const iPadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
  return iPhone || iPadOs
}

function wasDismissedRecently() {
  const raw = localStorage.getItem(DISMISS_KEY)
  if (!raw) return false
  const at = Number(raw)
  return Number.isFinite(at) && Date.now() - at < DISMISS_MS
}

export function askToInstall() {
  window.dispatchEvent(new Event(ASK_EVENT))
}

export function useInstallPrompt() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<InstallMode>('manual')
  const [installed, setInstalled] = useState(isStandaloneApp)
  const promptRef = useRef<BeforeInstallPromptEvent | null>(capturedPrompt)

  const show = useCallback((next: InstallMode, force = false) => {
    if (isStandaloneApp()) return
    if (!force && wasDismissedRecently()) return
    setMode(next)
    setOpen(true)
  }, [])

  useEffect(() => {
    if (isStandaloneApp()) {
      setInstalled(true)
      return
    }

    const onPrompt = () => {
      promptRef.current = capturedPrompt
      show('native')
    }

    const onInstalled = () => {
      setInstalled(true)
      setOpen(false)
      promptRef.current = null
    }

    const onAsk = () => {
      promptRef.current = capturedPrompt ?? promptRef.current
      if (promptRef.current) show('native', true)
      else if (isIosDevice()) show('ios', true)
      else show('manual', true)
    }

    window.addEventListener('remora:install-available', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    window.addEventListener(ASK_EVENT, onAsk)

      const timer = window.setTimeout(() => {
        promptRef.current = capturedPrompt ?? promptRef.current
        if (promptRef.current) show('native')
        else if (isIosDevice()) show('ios')
        else show('manual')
      }, 4000)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('remora:install-available', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      window.removeEventListener(ASK_EVENT, onAsk)
    }
  }, [show])

  const install = useCallback(async () => {
    const deferred = promptRef.current ?? capturedPrompt
    if (!deferred) return
    await deferred.prompt()
    const choice = await deferred.userChoice
    promptRef.current = null
    setOpen(false)
    if (choice.outcome === 'accepted') setInstalled(true)
    else localStorage.setItem(DISMISS_KEY, String(Date.now()))
  }, [])

  const later = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
    setOpen(false)
  }, [])

  return { open, mode, installed, install, later }
}
