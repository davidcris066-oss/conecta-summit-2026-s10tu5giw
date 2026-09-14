import { useEffect, useState } from 'react'

export function ScrollProgressBar({ hide }: { hide?: boolean }) {
  const [scrollPercentage, setScrollPercentage] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight
      if (scrollHeight > 0) {
        const percent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100))
        setScrollPercentage(percent)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (hide) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[4px] z-50 bg-transparent pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(scrollPercentage)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-[#00E5FF] to-[#0057FF] transition-[width] duration-150 ease-out rounded-r-sm shadow-[0_0_8px_rgba(0,229,255,0.7)]"
        style={{ width: `${scrollPercentage}%` }}
      />
    </div>
  )
}
