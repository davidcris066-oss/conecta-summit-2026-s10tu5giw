import { Calendar, Clock, MapPin, Globe } from 'lucide-react'

export function EventInfoSection() {
  return (
    <section
      id="informacoes"
      aria-labelledby="info-title"
      className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden"
    >
      {/* Background card with glass and cyan border */}
      <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 bg-gradient-to-br from-[#0D1B33]/90 via-[#0A1428]/95 to-[#050A15] border border-[#00E5FF]/35 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_40px_rgba(0,87,255,0.2)] backdrop-blur-xl">
        {/* Glow orbs inside */}
        <div
          className="absolute -top-24 right-0 w-80 h-80 bg-[#00E5FF]/10 rounded-full blur-[100px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 left-0 w-80 h-80 bg-[#0057FF]/20 rounded-full blur-[100px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          <span className="text-[#00E5FF] text-xs sm:text-sm font-semibold tracking-[0.18em] uppercase mb-3">
            Programação & Local
          </span>
          <h2
            id="info-title"
            className="font-sora font-extrabold uppercase text-2xl sm:text-4xl text-white tracking-tight sm:tracking-[-0.01em] mb-10 sm:mb-12"
          >
            Informações do Evento
          </h2>

          {/* 4 highlighted facts with icons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 w-full">
            {/* Fact 1: Data */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#050A15]/70 border border-[#00E5FF]/20 flex flex-col items-center text-center hover:border-[#00E5FF]/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0057FF]/20 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase tracking-wider text-[#8FA3BF] font-medium mb-1">
                Data
              </span>
              <strong className="font-sora font-bold uppercase text-base sm:text-lg text-white">
                28/11/2026
              </strong>
            </div>

            {/* Fact 2: Horário */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#050A15]/70 border border-[#00E5FF]/20 flex flex-col items-center text-center hover:border-[#00E5FF]/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0057FF]/20 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase tracking-wider text-[#8FA3BF] font-medium mb-1">
                Horário
              </span>
              <strong className="font-sora font-bold uppercase text-base sm:text-lg text-white">
                09h às 18h
              </strong>
            </div>

            {/* Fact 3: Cidade */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#050A15]/70 border border-[#00E5FF]/20 flex flex-col items-center text-center hover:border-[#00E5FF]/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0057FF]/20 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] mb-3">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase tracking-wider text-[#8FA3BF] font-medium mb-1">
                Cidade
              </span>
              <strong className="font-sora font-bold uppercase text-base sm:text-lg text-white">
                Itaituba
              </strong>
            </div>

            {/* Fact 4: Estado */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#050A15]/70 border border-[#00E5FF]/20 flex flex-col items-center text-center hover:border-[#00E5FF]/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-[#0057FF]/20 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] mb-3">
                <Globe className="w-6 h-6" />
              </div>
              <span className="text-xs uppercase tracking-wider text-[#8FA3BF] font-medium mb-1">
                Estado
              </span>
              <strong className="font-sora font-bold uppercase text-base sm:text-lg text-white">
                Pará
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
