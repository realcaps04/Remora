import { useCallback, useEffect, useState } from 'react'

const SKIP_KEY = 'remora:skip-update'
const CHECK_MS = 45_000

type VersionFile = {
  version: string
}

export function useAppUpdate() {
  const [available, setAvailable] = useState<string | null>(null)

  const check = useCallback(async () => {
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`, {
        cache: 'no-store',
      })
      if (!res.ok) return
      const data = (await res.json()) as VersionFile
      if (!data.version || data.version === __REMORA_VERSION__) return
      if (sessionStorage.getItem(SKIP_KEY) === data.version) return
      setAvailable(data.version)
    } catch {
      /* Offline or first load — ignore */
    }
  }, [])

  useEffect(() => {
    const start = window.setTimeout(() => {
      void check()
    }, 2500)

    const timer = window.setInterval(() => {
      void check()
    }, CHECK_MS)

    const onVisible = () => {
      if (document.visibilityState === 'visible') void check()
    }
    const onFocus = () => {
      void check()
    }

    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onFocus)

    return () => {
      window.clearTimeout(start)
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onFocus)
    }
  }, [check])

  const reload = useCallback(async () => {
    try {
      if ('caches' in window) {
        const keys = await caches.keys()
        await Promise.all(keys.map((key) => caches.delete(key)))
      }
    } finally {
      window.location.reload()
    }
  }, [])

  const later = useCallback(() => {
    if (available) sessionStorage.setItem(SKIP_KEY, available)
    setAvailable(null)
  }, [available])

  return {
    updateReady: Boolean(available),
    reload,
    later,
  }
}
