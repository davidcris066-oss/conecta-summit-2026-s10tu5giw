import { useEffect, useRef, useState, useCallback, useId } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Sparkles,
  Award,
  X,
  ExternalLink,
  BookOpen,
} from 'lucide-react'

export interface Speaker {
  id: string
  name: string
  headline: string
  location?: string
  bio: string
  credentials: string
  talkTopic?: string
  extra?: string
  badgeRole?: string
  initials: string
  accentGradient: string
  photoUrl?: string
}

const SPEAKERS: Speaker[] = [
  {
    id: 'airton-motta',
    name: 'AIRTON MOTTA',
    headline: 'Comunicação • Autoridade • Marca Pessoal',
    location: 'PORTO ALEGRE - RS',
    bio: 'Palestrante profissional, escritor e especialista em comunicação, autoridade e marca pessoal. Fundador da AM7 Educação e da A Caza Millennium, reúne mais de 18 anos de experiência e já impactou milhares de pessoas por meio de palestras, treinamentos e mentorias.',
    credentials: 'Top 100 The Best Speakers Brasil 2025 • Top 200 em 2026',
    talkTopic: 'COMUNICAÇÃO QUE GERA OPORTUNIDADES',
    initials: 'AM',
    accentGradient: 'from-[#0057FF] to-[#00E5FF]',
    photoUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=41',
  },
  {
    id: 'ana-paula-guimaraes',
    name: 'ANA PAULA GUIMARÃES',
    headline: 'Psicóloga • Mentora • Palestrante',
    location: 'SÃO PAULO - SP',
    bio: 'Psicóloga clínica, mentora e palestrante, com mais de 13 anos de atuação em desenvolvimento humano. Trabalha com TCC e Logoterapia, conectando saúde emocional, liderança, comunicação e presença estratégica. É fundadora da Lumina.',
    credentials: 'Saúde mental • Liderança • Desenvolvimento humano',
    talkTopic: 'SAÚDE MENTAL COM PROPÓSITO',
    initials: 'AG',
    accentGradient: 'from-[#00E5FF] to-[#00A3FF]',
    photoUrl: 'https://img.usecurling.com/ppl/medium?gender=female&seed=28',
  },
  {
    id: 'gabriel-rezende',
    name: 'GABRIEL REZENDE',
    headline: 'Head Comercial do Grupo Studio',
    location: 'PORTO ALEGRE - RS',
    bio: "Executivo com mais de 15 anos de experiência em gestão, vendas, expansão e negócios. Formado em Comércio Exterior e Relações Internacionais pela FGV e pós-graduado em Gestão de Negócios pela FAAP. Construiu trajetória em empresas como McDonald's, RTE Rodonaves, Dell Anno e Giraffas.",
    credentials: 'Grupo Studio • Estratégia • Expansão • Negócios',
    talkTopic: 'REFORMA TRIBUTÁRIA – DO IMPACTO À OPORTUNIDADE',
    initials: 'GR',
    accentGradient: 'from-[#0057FF] to-[#00E5FF]',
    photoUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=15',
  },
  {
    id: 'luciano-castro',
    name: 'LUCIANO CASTRO',
    headline: 'Consultor • Mentor • Professor',
    location: 'PORTO ALEGRE - RS',
    bio: 'Especialista em comportamento financeiro e gestão estratégica. À frente da Legátum, desenvolve soluções que conectam comportamento, números e estratégia para transformar decisões em resultados sustentáveis. É criador do Método CEP – Consciência, Estrutura e Patrimônio.',
    credentials: 'Comportamento • Estratégia • Patrimônio',
    talkTopic: 'GESTÃO FINANCEIRA PARA RESULTADOS REAIS',
    initials: 'LC',
    accentGradient: 'from-[#0057FF] to-[#00C2FF]',
    photoUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=53',
  },
  {
    id: 'marcos-arthur',
    name: 'MARCOS ARTHUR',
    headline: 'Empresário • Construção Patrimonial • Investimentos',
    location: 'SÃO PAULO - SP',
    bio: 'Empresário e especialista em construção patrimonial e financeira. Formado em Administração de Empresas, certificado PCA-10 pela ABAC e com 7 anos de experiência no mercado de consórcios. É sócio-fundador da Lufema Consórcios & Investimentos.',
    credentials:
      'R$ 1 bilhão em créditos comercializados • +800 clientes • Top 1 em SP pela HS Consórcios (2025)',
    talkTopic: 'PATRIMÔNIO EM MOVIMENTO',
    initials: 'MA',
    accentGradient: 'from-[#0060FF] to-[#00E5FF]',
    photoUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=33',
  },
  {
    id: 'magnum-nascimento',
    name: 'MAGNUM NASCIMENTO',
    headline: 'Contador • Empreendedor • Especialista em Licitações e Negócios',
    badgeRole: 'Concepção e Produção Executiva',
    bio: 'Contador e empreendedor com mais de 25 anos de experiência, construiu uma trajetória marcada por superação, reinvenção e visão estratégica. Especialista em licitações e contratos públicos, atua na criação e expansão de negócios e é sócio do Grupo Studio, conectando soluções empresariais à gestão estratégica.',
    credentials: '25+ ANOS • GRUPO STUDIO • M2B • LICITAÇÕES E NEGÓCIOS',
    extra:
      'À frente da construção da M2B – Método Magnum Business –, dedica-se a apoiar empresários e empreendedores na estruturação de negócios sólidos, lucrativos e com propósito, usando conhecimento, comunicação, CNPJ e conexões como ferramentas de crescimento e geração de oportunidades.',
    initials: 'MN',
    accentGradient: 'from-[#0040E0] to-[#00E5FF]',
    photoUrl: 'https://img.usecurling.com/ppl/medium?gender=male&seed=77',
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
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  const titleId = useId()
  const descId = useId()

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

      // Do not auto-scroll if modal is open or user is interacting
      if (selectedSpeaker) {
        animationFrameRef.current = requestAnimationFrame(step)
        return
      }

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

  // Handle speaker selection / modal opening
  const handleOpenSpeaker = (speaker: Speaker) => {
    isInteractingRef.current = true
    setIsPaused(true)
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current)
    }
    setSelectedSpeaker(speaker)
  }

  const handleCloseModal = useCallback(() => {
    setSelectedSpeaker(null)
    // Retoma carrossel após pequeno intervalo
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current)
    }
    resumeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false
      setIsPaused(false)
    }, 1500)
  }, [])

  // Keyboard navigation (Escape key to close modal)
  useEffect(() => {
    if (!selectedSpeaker) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedSpeaker, handleCloseModal])

  const handleImageError = (speakerId: string) => {
    setImgErrors((prev) => ({ ...prev, [speakerId]: true }))
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
        {DISPLAY_SPEAKERS.map((speaker, idx) => {
          const hasPhoto = Boolean(speaker.photoUrl && !imgErrors[speaker.id])

          return (
            <div
              key={`${speaker.name}-${idx}`}
              className="flex-shrink-0 w-[300px] sm:w-[340px] md:w-[360px] p-6 rounded-3xl bg-[#0D1B33]/85 border border-[#00E5FF]/20 hover:border-[#00E5FF]/60 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col text-left group relative"
            >
              {/* Top row: Interactive Photo/Avatar Button + Role badge / Tag */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => handleOpenSpeaker(speaker)}
                  aria-label={`Ver mais sobre ${speaker.name} - abrir descrição completa`}
                  className={`group/avatar relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr ${speaker.accentGradient} p-[2px] shadow-[0_0_24px_rgba(0,229,255,0.25)] hover:shadow-[0_0_36px_rgba(0,229,255,0.7)] transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:ring-offset-2 focus:ring-offset-[#050A15] cursor-pointer flex-shrink-0 text-left`}
                >
                  <div className="w-full h-full rounded-[14px] bg-[#0A1428] overflow-hidden flex items-center justify-center relative">
                    {hasPhoto ? (
                      <img
                        src={speaker.photoUrl}
                        alt={`Foto de ${speaker.name}`}
                        onError={() => handleImageError(speaker.id)}
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover/avatar:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <span className="font-sora font-extrabold text-xl sm:text-2xl text-white tracking-wider">
                        {speaker.initials}
                      </span>
                    )}

                    {/* Subtle hover overlay badge showing it's interactive */}
                    <div className="absolute inset-0 bg-[#0057FF]/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                      <ExternalLink className="w-4 h-4 text-white drop-shadow" />
                    </div>
                  </div>

                  {/* Little click hint indicator dot */}
                  <span
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#00E5FF] text-[#050A15] flex items-center justify-center text-[9px] font-bold shadow-[0_0_8px_rgba(0,229,255,0.8)] border border-[#050A15]"
                    title="Clique para ver a descrição completa"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                <div className="flex flex-col items-end gap-1.5 flex-1 min-w-0">
                  {speaker.badgeRole ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] text-[10px] sm:text-[11px] font-semibold text-right leading-tight shadow-sm">
                      <Sparkles className="w-3 h-3 text-[#00E5FF] shrink-0" />
                      {speaker.badgeRole}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#8FA3BF] text-[10px] font-medium tracking-wide uppercase">
                      Palestrante Confirmado
                    </span>
                  )}
                  {speaker.location && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#8FA3BF] font-medium">
                      <MapPin className="w-3 h-3 text-[#00E5FF] shrink-0" />
                      {speaker.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Speaker Name (Verbatim) - Clickable to open description too */}
              <button
                type="button"
                onClick={() => handleOpenSpeaker(speaker)}
                className="text-left font-sora font-extrabold text-lg sm:text-xl text-white hover:text-[#00E5FF] tracking-tight mb-1.5 leading-snug transition-colors group-hover:underline underline-offset-4 decoration-[#00E5FF]/40"
              >
                {speaker.name}
              </button>

              {/* Headline / Especialidades */}
              <p className="text-[#00E5FF] text-xs sm:text-[13px] font-medium leading-relaxed mb-3">
                {speaker.headline}
              </p>

              {/* Talk Topic (se houver tema oficial de palestra) */}
              {speaker.talkTopic && (
                <div className="mb-3.5 p-3 rounded-xl bg-[#050A15]/70 border border-[#00E5FF]/25">
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-[#8FA3BF] block mb-1">
                    Tema da Palestra
                  </span>
                  <p className="font-sora font-bold text-xs sm:text-[13px] text-white tracking-tight leading-snug">
                    {speaker.talkTopic}
                  </p>
                </div>
              )}

              {/* Bio summary */}
              <p className="text-[#C7D6EA] text-xs sm:text-[13px] leading-relaxed font-normal mb-3.5 line-clamp-3">
                {speaker.bio}
              </p>

              {/* Action hint button to open full description */}
              <div className="mb-3">
                <button
                  type="button"
                  onClick={() => handleOpenSpeaker(speaker)}
                  className="inline-flex items-center gap-1.5 text-xs text-[#00E5FF] hover:text-white font-medium transition-colors hover:underline"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Ver perfil e descrição completa</span>
                </button>
              </div>

              {/* Credentials / Destaques */}
              <div className="mt-auto pt-3 border-t border-white/10 flex items-start gap-2">
                <Award className="w-3.5 h-3.5 text-[#00E5FF] shrink-0 mt-0.5" />
                <p className="text-[11px] sm:text-xs text-[#8FA3BF] leading-snug font-medium">
                  {speaker.credentials}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Speaker Details Modal / Dialog Overlay */}
      {selectedSpeaker && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fade-in"
        >
          {/* Backdrop with dark translucent glassmorphism */}
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0A1428]/95 border border-[#00E5FF]/40 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(0,229,255,0.2)] p-6 sm:p-8 text-left z-10 scrollbar-thin scrollbar-thumb-[#00E5FF]/20">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleCloseModal}
              aria-label="Fechar descrição do palestrante"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-[#0D1B33] border border-white/15 hover:border-[#00E5FF] text-white hover:text-[#00E5FF] flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#00E5FF]"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header: Photo + Main info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 mb-6 pb-6 border-b border-white/10">
              {/* Large Photo */}
              <div
                className={`w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr ${selectedSpeaker.accentGradient} p-[3px] shadow-[0_0_32px_rgba(0,229,255,0.4)] flex-shrink-0`}
              >
                <div className="w-full h-full rounded-[21px] bg-[#050A15] overflow-hidden flex items-center justify-center">
                  {selectedSpeaker.photoUrl && !imgErrors[selectedSpeaker.id] ? (
                    <img
                      src={selectedSpeaker.photoUrl}
                      alt={`Foto de ${selectedSpeaker.name}`}
                      onError={() => handleImageError(selectedSpeaker.id)}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <span className="font-sora font-extrabold text-3xl sm:text-4xl text-white tracking-wider">
                      {selectedSpeaker.initials}
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Tag Info */}
              <div className="flex-1 text-center sm:text-left min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2.5">
                  {selectedSpeaker.badgeRole ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-semibold shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                      {selectedSpeaker.badgeRole}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#8FA3BF] text-xs font-medium uppercase tracking-wider">
                      Palestrante Conecta Summit
                    </span>
                  )}
                  {selectedSpeaker.location && (
                    <span className="inline-flex items-center gap-1 text-xs text-[#8FA3BF] font-medium bg-[#0D1B33] px-2.5 py-0.5 rounded-full border border-white/10">
                      <MapPin className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                      {selectedSpeaker.location}
                    </span>
                  )}
                </div>

                <h3
                  id={titleId}
                  className="font-sora font-extrabold text-2xl sm:text-3xl text-white tracking-tight leading-tight mb-2"
                >
                  {selectedSpeaker.name}
                </h3>

                <p className="text-[#00E5FF] text-sm sm:text-base font-medium leading-relaxed">
                  {selectedSpeaker.headline}
                </p>
              </div>
            </div>

            {/* Talk Topic Banner */}
            {selectedSpeaker.talkTopic && (
              <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#0057FF]/20 to-[#00E5FF]/15 border border-[#00E5FF]/40 shadow-inner">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#00E5FF] block mb-1">
                  Tema da Palestra no Conecta Summit 2026
                </span>
                <p className="font-sora font-extrabold text-base sm:text-lg text-white tracking-tight leading-snug">
                  {selectedSpeaker.talkTopic}
                </p>
              </div>
            )}

            {/* Full Bio */}
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8FA3BF] mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#00E5FF]" />
                  Sobre o Especialista
                </h4>
                <p
                  id={descId}
                  className="text-[#C7D6EA] text-sm sm:text-base leading-relaxed font-normal whitespace-pre-line"
                >
                  {selectedSpeaker.bio}
                </p>
              </div>

              {selectedSpeaker.extra && (
                <div className="p-3.5 rounded-xl bg-[#0D1B33]/80 border border-white/10">
                  <p className="text-[#C7D6EA] text-xs sm:text-sm leading-relaxed italic">
                    {selectedSpeaker.extra}
                  </p>
                </div>
              )}
            </div>

            {/* Credentials / Destaques Footer */}
            <div className="pt-4 border-t border-white/10 flex items-start gap-2.5 bg-[#050A15]/40 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8 rounded-b-3xl">
              <Award className="w-5 h-5 text-[#00E5FF] shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8FA3BF] block mb-1">
                  Credenciais & Reconhecimento
                </span>
                <p className="text-xs sm:text-sm text-white font-medium leading-snug">
                  {selectedSpeaker.credentials}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
