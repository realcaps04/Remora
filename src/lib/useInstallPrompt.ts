import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

const DISMISS_KEY = 'remora:install-dismissed-at'
const DISMISS_MS = 14 * 24 * 60 * 60 * 1000

export type InstallMode = 'native' | 'ios' | 'manual'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type PromptHolder = Window & { __remoraInstallPrompt?: BeforeInstallPromptEvent | null }

function holder() {
  return window as PromptHolder
}

function getPrompt() {
  return holder().__remoraInstallPrompt ?? null
}

function setPrompt(event: BeforeInstallPromptEvent | null) {
  holder().__remoraInstallPrompt = event
}

export function captureInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    setPrompt(event as BeforeInstallPromptEvent)
    window.dispatchEvent(new Event('remora:install-available'))
  })
  window.addEventListener('appinstalled', () => {
    setPrompt(null)
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

type InstallContextValue = {
  open: boolean
  mode: InstallMode
  installed: boolean
  canPrompt: boolean
  request: () => Promise<void>
  install: () => Promise<void>
  later: () => void
}

const InstallContext = createContext<InstallContextValue | null>(null)

export function InstallProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<InstallMode>('manual')
  const [installed, setInstalled] = useState(isStandaloneApp)
  const [canPrompt, setCanPrompt] = useState(() => Boolean(getPrompt()))
  const promptRef = useRef<BeforeInstallPromptEvent | null>(getPrompt())

  const syncPrompt = useCallback(() => {
    const next = getPrompt()
    promptRef.current = next
    setCanPrompt(Boolean(next))
    return next
  }, [])

  const show = useCallback((next: InstallMode, force = false) => {
    if (isStandaloneApp()) {
      setInstalled(true)
      return
    }
    if (!force && wasDismissedRecently()) return
    setMode(next)
    setOpen(true)
  }, [])

  const runNativePrompt = useCallback(async () => {
    const deferred = syncPrompt()
    if (!deferred) return false
    try {
      await deferred.prompt()
      const choice = await deferred.userChoice
      setPrompt(null)
      promptRef.current = null
      setCanPrompt(false)
      setOpen(false)
      if (choice.outcome === 'accepted') setInstalled(true)
      else localStorage.setItem(DISMISS_KEY, String(Date.now()))
      return true
    } catch {
      return false
    }
  }, [syncPrompt])

  const request = useCallback(async () => {
    if (isStandaloneApp()) {
      setInstalled(true)
      return
    }
    const usedNative = await runNativePrompt()
    if (usedNative) return
    if (isIosDevice()) show('ios', true)
    else show('manual', true)
  }, [runNativePrompt, show])

  useEffect(() => {
    if (isStandaloneApp()) {
      setInstalled(true)
      return
    }

    const onPrompt = () => {
      syncPrompt()
      show('native')
    }

    const onInstalled = () => {
      setInstalled(true)
      setOpen(false)
      setPrompt(null)
      promptRef.current = null
      setCanPrompt(false)
    }

    const onAsk = () => {
      void request()
    }

    window.addEventListener('remora:install-available', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    window.addEventListener('remora:ask-install', onAsk)

    const timer = window.setTimeout(() => {
      const deferred = syncPrompt()
      if (deferred) show('native')
      else if (isIosDevice()) show('ios')
      else show('manual')
    }, 4000)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('remora:install-available', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      window.removeEventListener('remora:ask-install', onAsk)
    }
  }, [request, show, syncPrompt])

  const install = useCallback(async () => {
    await runNativePrompt()
  }, [runNativePrompt])

  const later = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
    setOpen(false)
  }, [])

  const value = useMemo(
    () => ({ open, mode, installed, canPrompt, request, install, later }),
    [open, mode, installed, canPrompt, request, install, later],
  )

  return createElement(InstallContext.Provider, { value }, children)
}

export function useInstallPrompt() {
  const ctx = useContext(InstallContext)
  if (!ctx) throw new Error('useInstallPrompt must be used within InstallProvider')
  return ctx
}

export function askToInstall() {
  window.dispatchEvent(new Event('remora:ask-install'))
}
