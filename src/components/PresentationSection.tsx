import { Layers, Network, Award } from 'lucide-react'

export function PresentationSection() {
  return (
    <section
      id="apresentacao"
      aria-labelledby="apresentacao-title"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Title & Kicker */}
        <div className="lg:col-span-5 flex flex-col items-start text-left">
          <span className="text-[#00E5FF] text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase mb-3">
            O Encontro
          </span>
          <h2
            id="apresentacao-title"
            className="font-sora font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-[-0.02em] leading-[1.15]"
          >
            Um ambiente criado para gerar movimento.
          </h2>
          <div className="mt-6 w-20 h-1 rounded-full bg-gradient-to-r from-[#0057FF] to-[#00E5FF]" />
        </div>

        {/* Right Column: Paragraph and Highlight Cards */}
        <div className="lg:col-span-7 flex flex-col gap-8 text-left">
          <p className="text-[#C7D6EA] text-base sm:text-lg leading-relaxed font-normal">
            O Conecta Summit 2026 reúne empresários, profissionais e mentes inquietas em um dia de
            conteúdo, relacionamentos e novas possibilidades. Cada detalhe foi pensado para que você
            saia diferente de como entrou.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {/* Highlight 1: Conteúdo aplicável */}
            <div className="p-5 rounded-2xl bg-[#0D1B33]/60 border border-[#00E5FF]/20 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.4)] flex flex-col gap-3 group hover:border-[#00E5FF]/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0057FF]/30 to-[#00E5FF]/20 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                <Layers className="w-5 h-5" />
              </div>
              <span className="font-sora font-semibold text-white text-base">
                Conteúdo aplicável
              </span>
            </div>

            {/* Highlight 2: Conexões reais */}
            <div className="p-5 rounded-2xl bg-[#0D1B33]/60 border border-[#00E5FF]/20 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.4)] flex flex-col gap-3 group hover:border-[#00E5FF]/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0057FF]/30 to-[#00E5FF]/20 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                <Network className="w-5 h-5" />
              </div>
              <span className="font-sora font-semibold text-white text-base">Conexões reais</span>
            </div>

            {/* Highlight 3: Experiência premium */}
            <div className="p-5 rounded-2xl bg-[#0D1B33]/60 border border-[#00E5FF]/20 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.4)] flex flex-col gap-3 group hover:border-[#00E5FF]/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0057FF]/30 to-[#00E5FF]/20 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF]">
                <Award className="w-5 h-5" />
              </div>
              <span className="font-sora font-semibold text-white text-base">
                Experiência premium
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
