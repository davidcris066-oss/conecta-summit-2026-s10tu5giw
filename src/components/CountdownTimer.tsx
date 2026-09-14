import { useEffect, useState } from 'react'

// Target date: November 28, 2026 at 09:00:00 America/Sao_Paulo (UTC-3)
// In UTC ISO: 2026-11-28T12:00:00.000Z
const TARGET_TIMESTAMP = new Date('2026-11-28T09:00:00-03:00').getTime()

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeRemaining(): TimeLeft {
  const now = Date.now()
  const diff = Math.max(0, TARGET_TIMESTAMP - now)

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / 1000 / 60) % 60)
  const seconds = Math.floor((diff / 1000) % 60)

  return { days, hours, minutes, seconds }
}

interface TimeUnitBoxProps {
  value: number
  label: string
}

function TimeUnitBox({ value, label }: TimeUnitBoxProps) {
  const [prevValue, setPrevValue] = useState(value)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (value !== prevValue) {
      setPrevValue(value)
      setAnimating(true)
      const timer = setTimeout(() => setAnimating(false), 300)
      return () => clearTimeout(timer)
    }
  }, [value, prevValue])

  const formatted = String(value).padStart(2, '0')

  return (
    <div className="flex flex-col items-center justify-center min-w-[62px] sm:min-w-[80px] md:min-w-[94px] px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-[#0D1B33]/70 border border-[#00E5FF]/25 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-all">
      <span
        className={`font-sora font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[#00E5FF] tracking-tight tabular-nums transition-transform ${
          animating ? 'animate-number-pop' : ''
        }`}
      >
        {formatted}
      </span>
      <span className="text-[10px] sm:text-xs text-[#8FA3BF] font-medium uppercase tracking-wider mt-0.5">
        {label}
      </span>
    </div>
  )
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeRemaining())

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="inline-flex items-center gap-1.5 sm:gap-3 p-1 sm:p-1.5 rounded-2xl bg-[#0A1428]/80 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-lg"
      aria-label="Contagem regressiva para o Conecta Summit 2026"
      role="timer"
    >
      <TimeUnitBox value={timeLeft.days} label="Dias" />
      <span className="text-[#00E5FF]/40 font-bold text-lg sm:text-2xl select-none">:</span>
      <TimeUnitBox value={timeLeft.hours} label="Horas" />
      <span className="text-[#00E5FF]/40 font-bold text-lg sm:text-2xl select-none">:</span>
      <TimeUnitBox value={timeLeft.minutes} label="Minutos" />
      <span className="text-[#00E5FF]/40 font-bold text-lg sm:text-2xl select-none">:</span>
      <TimeUnitBox value={timeLeft.seconds} label="Segundos" />
    </div>
  )
}
