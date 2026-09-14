import { useState, useRef, useEffect } from 'react'
import { User, QrCode, Sparkles } from 'lucide-react'

export function BadgeSection() {
  const [nameInput, setNameInput] = useState('')
  const [debouncedName, setDebouncedName] = useState('')
  const [mousePos, setMousePos] = useState({ rotateX: 0, rotateY: 0 })
  const [isDesktop, setIsDesktop] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Check if desktop (>= 1025px) and support touch-detection
  useEffect(() => {
    const checkIsDesktop = () => {
      const matchMedia = window.matchMedia('(min-width: 1025px)')
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsDesktop(matchMedia.matches && !hasTouch)
    }
    checkIsDesktop()
    window.addEventListener('resize', checkIsDesktop)
    return () => window.removeEventListener('resize', checkIsDesktop)
  }, [])

  // Debounce typing ~150ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(nameInput.trim())
    }, 150)
    return () => clearTimeout(timer)
  }, [nameInput])

  // Desktop tilt handler (max ~8 degrees)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((centerY - y) / centerY) * 8
    const rotateY = ((x - centerX) / centerX) * 8

    setMousePos({ rotateX, rotateY })
  }

  const handleMouseLeave = () => {
    if (!isDesktop) return
    setMousePos({ rotateX: 0, rotateY: 0 })
  }

  const displayName = debouncedName || 'SEU NOME AQUI'

  return (
    <section
      id="cracha"
      aria-labelledby="cracha-title"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden"
    >
      {/* Background glow orbs */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0057FF]/15 rounded-full blur-[140px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Side: Input and Copy */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs font-semibold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Exclusividade</span>
          </div>

          <h2
            id="cracha-title"
            className="font-sora font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-[-0.02em] leading-[1.15] mb-5"
          >
            Este lugar já tem o seu nome.
          </h2>

          <p className="text-[#C7D6EA] text-base sm:text-lg leading-relaxed font-normal mb-8">
            Você não será apenas mais um participante. Cada detalhe foi preparado para receber você.
          </p>

          {/* Interactive input */}
          <div className="w-full max-w-md flex flex-col gap-2.5">
            <label
              htmlFor="badge-name-input"
              className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#C7D6EA] flex items-center gap-2"
            >
              <User className="w-4 h-4 text-[#00E5FF]" />
              <span>Digite seu nome para ver seu crachá</span>
            </label>
            <div className="relative">
              <input
                id="badge-name-input"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Digite seu nome"
                maxLength={32}
                className="w-full min-h-[48px] px-4.5 py-3 rounded-2xl bg-[#0D1B33]/80 border border-[#00E5FF]/35 text-white placeholder-[#8FA3BF] text-base focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/40 outline-none transition-all shadow-inner"
              />
              {nameInput && (
                <button
                  type="button"
                  onClick={() => setNameInput('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#8FA3BF] hover:text-white px-2 py-1 rounded"
                >
                  Limpar
                </button>
              )}
            </div>
            <span className="text-xs text-[#8FA3BF]">
              O crachá ao lado atualiza em tempo real enquanto você digita.
            </span>
          </div>
        </div>

        {/* Right Side: Virtual Badge with float + tilt */}
        <div className="lg:col-span-6 flex justify-center items-center">
          {/* Outer floating wrapper */}
          <div className="animate-float">
            {/* Tilt container (desktop mousemove) */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={
                isDesktop
                  ? {
                      transform: `perspective(1000px) rotateX(${mousePos.rotateX}deg) rotateY(${mousePos.rotateY}deg)`,
                      transition: 'transform 120ms ease-out',
                      transformStyle: 'preserve-3d',
                    }
                  : undefined
              }
              className="relative w-[280px] sm:w-[320px] md:w-[340px] rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-[#0D1B33] via-[#0A1428] to-[#050A15] border border-[#00E5FF]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,87,255,0.25)] backdrop-blur-xl flex flex-col justify-between select-none"
            >
              {/* Lanyard Hole Clip */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-14 h-3.5 rounded-full bg-[#050A15] border border-[#00E5FF]/50 flex items-center justify-center">
                <div className="w-8 h-1.5 rounded-full bg-[#00E5FF]/60" />
              </div>

              {/* Holographic accent stripe */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#00E5FF]/20 to-transparent rounded-tr-3xl pointer-events-none" />

              {/* Badge Header: Brand & Summit */}
              <div className="flex flex-col items-center text-center pt-2 pb-4 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="font-sora font-extrabold text-2xl tracking-wider text-white">
                    CONECTA
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                </div>
                <span className="font-sora text-[11px] font-bold text-[#00E5FF] tracking-[0.25em] uppercase mt-0.5">
                  SUMMIT 2026
                </span>
                <span className="text-[10px] text-[#8FA3BF] tracking-widest mt-1">
                  28.11.2026 · ITAITUBA – PA
                </span>
              </div>

              {/* Badge Center: Avatar circle + Participant Name */}
              <div className="py-7 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0057FF] to-[#00E5FF] p-[2px] shadow-[0_0_24px_rgba(0,229,255,0.35)] mb-4">
                  <div className="w-full h-full rounded-full bg-[#0D1B33] flex items-center justify-center overflow-hidden">
                    <User className="w-9 h-9 text-[#00E5FF]" />
                  </div>
                </div>

                <div className="w-full px-2">
                  <p className="font-sora font-bold text-xl sm:text-2xl text-white tracking-tight leading-tight break-words line-clamp-2">
                    {displayName}
                  </p>
                </div>

                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#0057FF]/30 to-[#00E5FF]/20 border border-[#00E5FF]/50 text-[#00E5FF] text-[11px] font-bold tracking-[0.18em] uppercase">
                  PARTICIPANTE
                </div>
              </div>

              {/* Badge Footer: QR Code placeholder & Security stamp */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] uppercase tracking-wider text-[#8FA3BF]">
                    Credencial Oficial
                  </span>
                  <span className="font-mono text-[10px] text-white/90 tracking-widest">
                    #CNCT-2026-{debouncedName ? debouncedName.length * 137 : '0000'}
                  </span>
                  <span className="text-[8px] text-[#00E5FF] tracking-wider mt-0.5">
                    ACESSO COMPLETO
                  </span>
                </div>

                {/* Illustrative QR Code */}
                <div
                  className="w-12 h-12 p-1 rounded-lg bg-white/90 border border-[#00E5FF]/40 flex items-center justify-center shadow"
                  aria-label="QR Code ilustrativo de credenciamento"
                >
                  <QrCode className="w-10 h-10 text-[#0A1428]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
