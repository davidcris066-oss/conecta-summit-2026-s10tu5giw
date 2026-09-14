import { useEffect, useRef, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Speaker {
  name: string
  specialty: string
  initials: string
  accentGradient: string
}

const SPEAKERS: Speaker[] = [
  {
    name: 'Airton Mota',
    specialty: 'Oratória, Posicionamento e Performance Empresarial',
    initials: 'AM',
    accentGradient: 'from-[#0057FF] to-[#00E5FF]',
  },
  {
    name: 'Ana Paula',
    specialty: 'Saúde Mental',
    initials: 'AP',
    accentGradient: 'from-[#00E5FF] to-[#00A3FF]',
  },
  {
    name: 'Luciano Oliveira',
    specialty: 'Comportamento Financeiro',
    initials: 'LO',
    accentGradient: 'from-[#0057FF] to-[#00C2FF]',
  },
  {
    name: 'Magnum Nascimento',
    specialty: 'Contabilidade e Negócios',
    initials: 'MN',
    accentGradient: 'from-[#0040E0] to-[#00E5FF]',
  },
  {
    name: 'Michele',
    specialty: 'Tributário',
    initials: 'MI',
    accentGradient: 'from-[#00E5FF] to-[#0070FF]',
  },
  {
    name: 'Gabriel Resende',
    specialty: 'Tributário e Negócios',
    initials: 'GR',
    accentGradient: 'from-[#0057FF] to-[#00E5FF]',
  },
  {
    name: 'Marcus Artur',
    specialty: 'Alavancagem Patrimonial por meio de Consórcios',
    initials: 'MA',
    accentGradient: 'from-[#0060FF] to-[#00E5FF]',
  },
]

// Triplicamos a lista para criar o loop contínuo e perfeito
const DISPLAY_SPEAKERS = [...SPEAKERS, ...SPEAKERS, ...SPEAKERS]

export function SpeakersSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isInteractingRef = useRef(false)
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Drag state
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollStartRef = useRef(0)

  const [isPaused, setIsPaused] = useState(false)

  const pauseInteraction = useCallback(() => {
    isInteractingRef.current = true
    setIsPaused(true)

    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current)
    }

    // Retoma a rotação automática após ~4.5s
    resumeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false
      setIsPaused(false)
    }, 4500)
  }, [])

  // Continuous smooth auto-rotation
  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let lastTimestamp = performance.now()
    const speed = 0.65 // pixels per frame (~40px/sec at 60fps)

    const step = (currentTimestamp: number) => {
      const delta = (currentTimestamp - lastTimestamp) / 16.666
      lastTimestamp = currentTimestamp

      const container = scrollRef.current
      if (container && !isInteractingRef.current) {
        container.scrollLeft += speed * Math.min(delta, 2)

        // Loop contínuo: quando passar de 1/3 do total de scrollWidth, volta para 0 suavemente
        const singleSetWidth = container.scrollWidth / 3
        if (container.scrollLeft >= singleSetWidth * 2) {
          container.scrollLeft -= singleSetWidth
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += singleSetWidth
        }
      }

      animationFrameRef.current = requestAnimationFrame(step)
    }

    animationFrameRef.current = requestAnimationFrame(step)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (resumeTimerRef.current) {
        clearTimeout(resumeTimerRef.current)
      }
    }
  }, [])

  // Mouse & Touch Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    pauseInteraction()
    isDraggingRef.current = true
    startXRef.current = e.pageX - (scrollRef.current?.offsetLeft || 0)
    scrollStartRef.current = scrollRef.current?.scrollLeft || 0
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - (scrollRef.current.offsetLeft || 0)
    const walk = (x - startXRef.current) * 1.5
    scrollRef.current.scrollLeft = scrollStartRef.current - walk
  }

  const handlePointerUpOrLeave = () => {
    isDraggingRef.current = false
  }

  const scrollByAmount = (direction: 'left' | 'right') => {
    pauseInteraction()
    if (!scrollRef.current) return
    const offset = direction === 'left' ? -320 : 320
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return (
    <section
      id="palestrantes"
      aria-labelledby="palestrantes-title"
      role="region"
      aria-roledescription="carousel"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
        <span className="text-[#00E5FF] text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase mb-3 inline-block">
          Especialistas & Líderes
        </span>
        <h2
          id="palestrantes-title"
          className="font-sora font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-[-0.02em] leading-[1.15] mb-5"
        >
          Encontros com quem transforma conhecimento em ação.
        </h2>
        <p className="text-[#C7D6EA] text-base sm:text-lg leading-relaxed font-normal">
          Diferentes trajetórias, uma mesma missão: provocar novas decisões, conexões e resultados.
        </p>

        {/* Manual controls buttons */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            onClick={() => scrollByAmount('left')}
            aria-label="Palestrante anterior"
            className="w-10 h-10 rounded-full bg-[#0D1B33]/80 border border-[#00E5FF]/30 hover:border-[#00E5FF] text-white flex items-center justify-center transition-all hover:bg-[#00E5FF]/10 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5 text-[#00E5FF]" />
          </button>
          <span className="text-xs text-[#8FA3BF] px-2 font-medium">
            {isPaused ? 'Pausado (retoma em instantes)' : 'Deslize ou arraste'}
          </span>
          <button
            type="button"
            onClick={() => scrollByAmount('right')}
            aria-label="Próximo palestrante"
            className="w-10 h-10 rounded-full bg-[#0D1B33]/80 border border-[#00E5FF]/30 hover:border-[#00E5FF] text-white flex items-center justify-center transition-all hover:bg-[#00E5FF]/10 active:scale-95"
          >
            <ChevronRight className="w-5 h-5 text-[#00E5FF]" />
          </button>
        </div>
      </div>

      {/* Edge gradient masks */}
      <div
        className="absolute left-0 top-1/2 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#050A15] to-transparent pointer-events-none z-10"
        aria-hidden="true"
      />
      <div
        className="absolute right-0 top-1/2 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#050A15] to-transparent pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Carousel Track with continuous smooth drag/scroll */}
      <div
        ref={scrollRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUpOrLeave}
        onPointerCancel={handlePointerUpOrLeave}
        onMouseEnter={pauseInteraction}
        onTouchStart={pauseInteraction}
        className="flex items-stretch gap-5 sm:gap-6 overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing select-none py-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {DISPLAY_SPEAKERS.map((speaker, idx) => (
          <div
            key={`${speaker.name}-${idx}`}
            className="flex-shrink-0 w-[260px] sm:w-[280px] md:w-[300px] p-6 rounded-3xl bg-[#0D1B33]/70 border border-[#00E5FF]/20 hover:border-[#00E5FF]/60 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center text-center group"
          >
            {/* Initial-based avatar with subtle gradient */}
            <div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr ${speaker.accentGradient} p-[2.5px] shadow-[0_0_24px_rgba(0,229,255,0.25)] mb-5 group-hover:shadow-[0_0_32px_rgba(0,229,255,0.45)] transition-shadow`}
            >
              <div className="w-full h-full rounded-full bg-[#0A1428] flex items-center justify-center">
                <span className="font-sora font-extrabold text-xl sm:text-2xl text-white tracking-wider">
                  {speaker.initials}
                </span>
              </div>
            </div>

            {/* Speaker Name (Verbatim) */}
            <h3 className="font-sora font-bold text-lg sm:text-xl text-white tracking-tight mb-2">
              {speaker.name}
            </h3>

            {/* Specialty (Verbatim) */}
            <p className="text-[#C7D6EA] text-sm leading-relaxed font-normal min-h-[44px]">
              {speaker.specialty}
            </p>

            {/* Bottom tag */}
            <div className="mt-5 pt-4 border-t border-white/10 w-full flex items-center justify-center">
              <span className="text-[11px] font-semibold text-[#00E5FF] tracking-wider uppercase">
                Conecta Summit 2026
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
