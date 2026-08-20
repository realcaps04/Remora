import { useEffect } from 'react'
import { useStore } from '../state/store'

export function SplashScreen() {
  const { replace } = useStore()

  useEffect(() => {
    const id = window.setTimeout(() => replace({ name: 'home' }), 1600)
    return () => window.clearTimeout(id)
  }, [replace])

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-8">
      <div className="splash-mark text-[13px] font-medium uppercase text-[#8e8e93]">Remora</div>
      <h1 className="mt-5 text-[42px] font-medium tracking-[-0.04em]">Remora</h1>
      <p className="mt-3 text-[15px] text-[#8e8e93]">One app. Every remote.</p>
    </div>
  )
}
