import { Calendar, Clock, MapPin, ArrowRight, Sparkles } from 'lucide-react'
import { CountdownTimer } from './CountdownTimer'

// Visual oficial do evento: elegante padrão tecnológico em gradiente azul-marinho profundo com orbes e malha geométrica.
// Pode ser substituído futuramente atribuindo uma URL ou arquivo em src/assets.
export const HERO_BACKGROUND_IMAGE: string | null = null

interface HeroSectionProps {
  onRegisterClick: () => void
  onExploreClick: () => void
}

export function HeroSection({ onRegisterClick, onExploreClick }: HeroSectionProps) {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative min-h-screen flex flex-col justify-between items-center text-center px-4 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-20 sm:pb-16 overflow-hidden"
    >
      {/* Background Layer: Official Visual representation */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        {HERO_BACKGROUND_IMAGE ? (
          <img
            src={HERO_BACKGROUND_IMAGE}
            alt="Visual oficial do Conecta Summit 2026"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        ) : (
          <div className="relative w-full h-full bg-[#050A15]">
            {/* Deep navy & royal blue gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A1428] via-[#050A15] to-[#050A15]" />
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#0057FF]/30 to-[#00E5FF]/20 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
            <div className="absolute top-1/3 -left-32 w-[420px] h-[420px] bg-[#0057FF]/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 -right-32 w-[460px] h-[460px] bg-[#00E5FF]/15 rounded-full blur-[130px] pointer-events-none" />

            {/* Subtle tech connection grid pattern */}
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.14]"
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
            >
              <defs>
                <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path
                    d="M 60 0 L 0 0 0 60"
                    fill="none"
                    stroke="#00E5FF"
                    strokeWidth="0.8"
                    strokeOpacity="0.4"
                  />
                  <circle cx="60" cy="0" r="1.5" fill="#00E5FF" fillOpacity="0.6" />
                </pattern>
                <linearGradient id="grid-fade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.8" />
                  <stop offset="60%" stopColor="#fff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
                <mask id="hero-mask">
                  <rect width="100%" height="100%" fill="url(#grid-fade)" />
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-grid)" mask="url(#hero-mask)" />
            </svg>
          </div>
        )}
        {/* Dark translucent overlay to guarantee text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050A15] via-[#050A15]/60 to-black/30" />
      </div>

      {/* Top element: Countdown */}
      <div className="w-full flex justify-center mb-6 sm:mb-8 animate-fade-in">
        <CountdownTimer />
      </div>

      {/* Center content: Kicker, Headline, Description, CTAs */}
      <div className="max-w-4xl mx-auto flex flex-col items-center my-auto py-4">
        {/* Kicker */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase mb-5 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Itaituba recebe uma nova experiência</span>
        </div>

        {/* Main Title (Verbatim) */}
        <h1
          id="hero-title"
          className="font-sora font-extrabold uppercase text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight sm:tracking-[-0.01em] leading-[1.08] max-w-3xl mb-5"
        >
          O futuro também se conecta aqui.
        </h1>

        {/* Description (Verbatim) */}
        <p className="text-[#C7D6EA] text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl font-normal mb-8 sm:mb-10 text-balance">
          Uma imersão de ideias para quem acredita que grandes negócios começam com as conexões
          certas.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={onRegisterClick}
            className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0057FF] to-[#00E5FF] hover:from-[#004AD6] hover:to-[#00D0E8] text-white font-semibold uppercase text-sm sm:text-base tracking-wider shadow-[0_8px_28px_rgba(0,87,255,0.45)] hover:shadow-[0_12px_36px_rgba(0,229,255,0.5)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <span>Garantir meu lugar</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onExploreClick}
            className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 rounded-full bg-transparent border border-[#00E5FF]/70 hover:border-[#00E5FF] hover:bg-[#00E5FF]/10 text-white font-semibold uppercase text-sm sm:text-base tracking-wider transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>Descobrir a experiência</span>
          </button>
        </div>
      </div>

      {/* Bottom element: Event quick facts */}
      <div className="w-full max-w-2xl mx-auto pt-6 border-t border-white/10 mt-6 sm:mt-8">
        <div className="flex items-center justify-around sm:justify-center sm:gap-10 text-xs sm:text-sm text-[#C7D6EA] font-medium">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#00E5FF] shrink-0" />
            <span className="font-semibold text-white tracking-wide">28 NOV</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[#00E5FF]/50" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00E5FF] shrink-0" />
            <span className="text-white">09h às 18h</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-[#00E5FF]/50" aria-hidden="true" />
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#00E5FF] shrink-0" />
            <span className="text-white">Itaituba – PA</span>
          </div>
        </div>
      </div>
    </section>
  )
}
