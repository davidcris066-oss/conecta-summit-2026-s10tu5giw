import { BookOpen, Users, Compass, ChevronRight } from 'lucide-react'

interface JourneyStep {
  number: string
  title: string
  text: string
  icon: typeof BookOpen
}

const STEPS: JourneyStep[] = [
  {
    number: '01',
    title: 'Conteúdo que desperta',
    text: 'Palestras e conversas para ampliar sua visão e provocar novas decisões.',
    icon: BookOpen,
  },
  {
    number: '02',
    title: 'Conexões que aproximam',
    text: 'Um ambiente pensado para encontros relevantes e relacionamentos duradouros.',
    icon: Users,
  },
  {
    number: '03',
    title: 'Experiência que permanece',
    text: 'Cuidado em cada ponto de contato, do primeiro acesso à lembrança que você leva.',
    icon: Compass,
  },
]

export function JourneySection() {
  return (
    <section
      id="jornada"
      aria-labelledby="jornada-title"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden border-t border-white/5"
    >
      {/* Header */}
      <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
        <span className="text-[#00E5FF] text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase mb-3 inline-block">
          Sua Trajetória
        </span>
        <h2
          id="jornada-title"
          className="font-sora font-extrabold uppercase text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight sm:tracking-[-0.01em] leading-[1.15]"
        >
          A Jornada do Participante
        </h2>
        <p className="text-[#C7D6EA] text-base sm:text-lg leading-relaxed mt-4">
          Três pilares construídos para transformar a sua visão e acelerar resultados.
        </p>
      </div>

      {/* Mobile Swipe hint */}
      <div className="sm:hidden flex items-center justify-center gap-1.5 text-xs text-[#8FA3BF] mb-4">
        <span>Deslize para ver os passos</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#00E5FF]" />
      </div>

      {/* Cards: Desktop 3-column row, Mobile horizontal scroll-snap (~80% width) */}
      <div className="flex sm:grid sm:grid-cols-3 gap-5 sm:gap-6 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 snap-x snap-mandatory scrollbar-none -mx-4 sm:mx-0 px-4 sm:px-0">
        {STEPS.map((step) => {
          const Icon = step.icon
          return (
            <div
              key={step.number}
              className="flex-shrink-0 w-[82vw] sm:w-auto snap-center rounded-3xl p-7 sm:p-8 bg-gradient-to-b from-[#0D1B33]/80 to-[#0A1428]/90 border border-[#00E5FF]/20 hover:border-[#00E5FF]/50 backdrop-blur-md shadow-[0_12px_36px_rgba(0,0,0,0.5)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group"
            >
              <div>
                {/* Large semi-transparent cyan number at top */}
                <div className="flex items-start justify-between mb-6">
                  <span className="font-sora font-extrabold text-5xl sm:text-6xl text-[#00E5FF]/25 group-hover:text-[#00E5FF]/45 transition-colors select-none tracking-tighter">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-[#0057FF]/20 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] group-hover:bg-[#00E5FF]/20 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Title (Verbatim) */}
                <h3 className="font-sora font-bold uppercase text-lg sm:text-xl text-white tracking-tight mb-3">
                  {step.title}
                </h3>

                {/* Text (Verbatim) */}
                <p className="text-[#8FA3BF] group-hover:text-[#C7D6EA] text-sm sm:text-base leading-relaxed transition-colors">
                  {step.text}
                </p>
              </div>

              {/* Progress indicator pill */}
              <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                <span className="text-xs uppercase tracking-wider text-[#8FA3BF] font-semibold">
                  Etapa {step.number}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
