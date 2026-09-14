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
import airtonMottaPhoto from '../assets/airton-motta-fb30a.jpg'
import anaPaulaPhoto from '../assets/ana-paula-guimaraes-1a8a3.jpg'
import gabrielRezendePhoto from '../assets/gabriel-rezende-c8151.jpg'
import lucianoCastroPhoto from '../assets/luciano-castro-0e113.jpg'
import marcosArthurPhoto from '../assets/marcos-arthur-ab89a.jpg'

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
  initials?: string
  accentGradient?: string
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
    photoUrl: airtonMottaPhoto,
  },
  {
    id: 'ana-paula-guimaraes',
    name: 'ANA PAULA GUIMARÃES',
    headline: 'Psicóloga • Mentora • Palestrante',
    location: 'SÃO PAULO - SP',
    bio: 'Psicóloga clínica, mentora e palestrante, com mais de 13 anos de atuação em desenvolvimento humano. Trabalha com TCC e Logoterapia, conectando saúde emocional, liderança, comunicação e presença estratégica. É fundadora da Lumina.',
    credentials: 'Saúde mental • Liderança • Desenvolvimento humano',
    talkTopic: 'SAÚDE MENTAL COM PROPÓSITO',
    photoUrl: anaPaulaPhoto,
  },
  {
    id: 'gabriel-rezende',
    name: 'GABRIEL REZENDE',
    headline: 'Head Comercial do Grupo Studio',
    location: 'PORTO ALEGRE - RS',
    bio: "Executivo com mais de 15 anos de experiência em gestão, vendas, expansão e negócios. Formado em Comércio Exterior e Relações Internacionais pela FGV e pós-graduado em Gestão de Negócios pela FAAP. Construiu trajetória em empresas como McDonald's, RTE Rodonaves, Dell Anno e Giraffas.",
    credentials: 'Grupo Studio • Estratégia • Expansão • Negócios',
    talkTopic: 'REFORMA TRIBUTÁRIA – DO IMPACTO À OPORTUNIDADE',
    photoUrl: gabrielRezendePhoto,
  },
  {
    id: 'luciano-castro',
    name: 'LUCIANO CASTRO',
    headline: 'Consultor • Mentor • Professor',
    location: 'PORTO ALEGRE - RS',
    bio: 'Especialista em comportamento financeiro e gestão estratégica. À frente da Legátum, desenvolve soluções que conectam comportamento, números e estratégia para transformar decisões em resultados sustentáveis. É criador do Método CEP – Consciência, Estrutura e Patrimônio.',
    credentials: 'Comportamento • Estratégia • Patrimônio',
    talkTopic: 'GESTÃO FINANCEIRA PARA RESULTADOS REAIS',
    photoUrl: lucianoCastroPhoto,
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
    photoUrl: marcosArthurPhoto,
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
          return (
            <div
              key={`${speaker.name}-${idx}`}
              onClick={() => handleOpenSpeaker(speaker)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleOpenSpeaker(speaker)
                }
              }}
              aria-label={`Ver perfil de ${speaker.name}`}
              className="group relative flex-shrink-0 w-[300px] sm:w-[340px] md:w-[360px] p-6 rounded-3xl bg-[#0D1B33]/85 border border-[#00E5FF]/20 hover:border-[#00E5FF]/60 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_44px_rgba(0,229,255,0.15)] transition-all duration-300 hover:-translate-y-1.5 flex flex-col text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:ring-offset-2 focus:ring-offset-[#050A15]"
            >
              {/* Subtle abstract cyan glow accent in the top corner (no photo / no avatar) */}
              <div
                className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00E5FF]/10 to-transparent rounded-tr-3xl pointer-events-none blur-xl opacity-60 group-hover:opacity-100 transition-opacity"
                aria-hidden="true"
              />

              {/* Top row: Badges / Tags (Role and Location) */}
              <div className="relative flex items-center justify-between gap-2 mb-4 pb-3 border-b border-white/10">
                {speaker.badgeRole ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] text-[11px] sm:text-xs font-semibold leading-tight shadow-sm">
                    <Sparkles className="w-3 h-3 text-[#00E5FF] shrink-0" />
                    {speaker.badgeRole}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#8FA3BF] text-[10px] sm:text-[11px] font-medium tracking-wide uppercase">
                    Palestrante Confirmado
                  </span>
                )}

                {speaker.location && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#8FA3BF] font-medium shrink-0">
                    <MapPin className="w-3 h-3 text-[#00E5FF] shrink-0" />
                    {speaker.location}
                  </span>
                )}
              </div>

              {/* Optional Speaker Photo (Rendered only when official photo is provided) */}
              {speaker.photoUrl && (
                <div className="relative mb-4 group/photo">
                  {/* Subtle navy/cyan gradient border frame */}
                  <div className="relative overflow-hidden rounded-2xl p-[1.5px] bg-gradient-to-b from-[#00E5FF]/60 via-[#0057FF]/40 to-[#00E5FF]/20 shadow-[0_8px_24px_rgba(0,0,0,0.4)] group-hover:shadow-[0_12px_28px_rgba(0,229,255,0.25)] transition-all duration-300">
                    <div className="relative aspect-[4/5] sm:aspect-[4/5] w-full overflow-hidden rounded-[14px] bg-[#050A15]">
                      <img
                        src={speaker.photoUrl}
                        alt={`Foto de ${speaker.name}`}
                        className="w-full h-full object-cover object-[center_top] filter brightness-[1.02] contrast-[1.02] transition-transform duration-500 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                      {/* Subtle ambient gradient overlay at base of image for visual harmony */}
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-[#0D1B33]/70 via-transparent to-transparent pointer-events-none"
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* Speaker Name (Verbatim) */}
              <h3 className="font-sora font-extrabold text-xl sm:text-2xl text-white group-hover:text-[#00E5FF] tracking-tight mb-2 leading-snug transition-colors">
                {speaker.name}
              </h3>

              {/* Headline / Especialidades */}
              <p className="text-[#00E5FF] text-xs sm:text-[13px] font-medium leading-relaxed mb-3.5">
                {speaker.headline}
              </p>

              {/* Talk Topic (se houver tema oficial de palestra) */}
              {speaker.talkTopic && (
                <div className="mb-3.5 p-3 rounded-xl bg-[#050A15]/70 border border-[#00E5FF]/25 group-hover:border-[#00E5FF]/50 transition-colors">
                  <span className="text-[10px] font-semibold tracking-wider uppercase text-[#8FA3BF] block mb-1">
                    Tema da Palestra
                  </span>
                  <p className="font-sora font-bold text-xs sm:text-[13px] text-white tracking-tight leading-snug">
                    {speaker.talkTopic}
                  </p>
                </div>
              )}

              {/* Bio summary */}
              <p className="text-[#C7D6EA] text-xs sm:text-[13px] leading-relaxed font-normal mb-4 line-clamp-3">
                {speaker.bio}
              </p>

              {/* Action hint button to open full description */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs text-[#00E5FF] group-hover:text-white font-medium transition-colors group-hover:underline">
                  <BookOpen className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span>Ver perfil e descrição completa</span>
                  <ExternalLink className="w-3 h-3 text-[#00E5FF] opacity-60 group-hover:opacity-100 transition-opacity ml-0.5" />
                </span>
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

            {/* Header: Photo (when provided) + Clean typography + tags */}
            <div className="relative mb-6 pb-6 border-b border-white/10 pr-10">
              {/* Subtle decorative glow line in navy/cyan */}
              <div
                className="absolute top-0 right-12 w-28 h-28 bg-[#00E5FF]/10 rounded-full blur-2xl pointer-events-none"
                aria-hidden="true"
              />

              <div
                className={
                  selectedSpeaker.photoUrl ? 'flex flex-col sm:flex-row gap-5 items-start' : ''
                }
              >
                {selectedSpeaker.photoUrl && (
                  <div className="flex-shrink-0 w-32 sm:w-36 md:w-44">
                    <div className="overflow-hidden rounded-2xl p-[1.5px] bg-gradient-to-b from-[#00E5FF] via-[#0057FF]/60 to-[#00E5FF]/40 shadow-[0_8px_24px_rgba(0,0,0,0.5),0_0_20px_rgba(0,229,255,0.2)]">
                      <div className="aspect-[4/5] w-full overflow-hidden rounded-[14px] bg-[#050A15]">
                        <img
                          src={selectedSpeaker.photoUrl}
                          alt={`Foto de ${selectedSpeaker.name}`}
                          className="w-full h-full object-cover object-[center_top]"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {/* Tags: Role & Location */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {selectedSpeaker.badgeRole ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-[#00E5FF] text-xs font-semibold shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                        {selectedSpeaker.badgeRole}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[#8FA3BF] text-xs font-medium uppercase tracking-wider">
                        Palestrante Conecta Summit
                      </span>
                    )}
                    {selectedSpeaker.location && (
                      <span className="inline-flex items-center gap-1 text-xs text-[#8FA3BF] font-medium bg-[#0D1B33] px-3 py-0.5 rounded-full border border-white/10">
                        <MapPin className="w-3.5 h-3.5 text-[#00E5FF] shrink-0" />
                        {selectedSpeaker.location}
                      </span>
                    )}
                  </div>

                  {/* Speaker Name */}
                  <h3
                    id={titleId}
                    className="font-sora font-extrabold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-tight mb-2"
                  >
                    {selectedSpeaker.name}
                  </h3>

                  {/* Headline */}
                  <p className="text-[#00E5FF] text-sm sm:text-base font-medium leading-relaxed">
                    {selectedSpeaker.headline}
                  </p>
                </div>
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
