import { useEffect } from 'react'
import { Wordmark } from '../components/common/Wordmark'
import { useStore } from '../state/store'

export function SplashScreen() {
  const { replace } = useStore()

  useEffect(() => {
    const id = window.setTimeout(() => replace({ name: 'home' }), 1600)
    return () => window.clearTimeout(id)
  }, [replace])

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center px-8">
      <Wordmark className="text-[14px] text-[#8e8e93]" />
      <Wordmark as="h1" className="mt-6 text-[52px] text-white" />
      <p className="mt-3 text-[15px] text-[#8e8e93]">One app. Every remote.</p>
    </div>
  )
}
