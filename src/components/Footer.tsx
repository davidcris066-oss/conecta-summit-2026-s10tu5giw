import { Calendar, MapPin, Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-[#0A1428] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="font-sora font-extrabold text-xl sm:text-2xl tracking-wider text-white">
            CONECTA
          </span>
          <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
          <span className="font-sora text-sm font-bold text-[#00E5FF] tracking-[0.2em] uppercase">
            SUMMIT 2026
          </span>
        </div>

        {/* Event Quick recap */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-[#C7D6EA]">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#00E5FF]" />
            <span>28 NOV 2026</span>
          </div>
          <span className="text-white/20 select-none">·</span>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#00E5FF]" />
            <span>Itaituba – Pará</span>
          </div>
          <span className="text-white/20 select-none">·</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#00E5FF]" />
            <span>09h às 18h</span>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-[#00E5FF]/20 to-transparent my-2" />

        {/* Credits */}
        <div className="flex flex-col sm:flex-row items-center justify-between w-full text-xs text-[#8FA3BF] gap-3">
          <p>© 2026 Conecta Summit. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5">
            <span>Uma realização da marca</span>
            <strong className="text-white font-semibold">Conecta</strong>
          </p>
        </div>
      </div>
    </footer>
  )
}
