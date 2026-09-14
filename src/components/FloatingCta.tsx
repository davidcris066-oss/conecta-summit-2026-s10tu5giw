import { ArrowUpRight } from 'lucide-react'

interface FloatingCtaProps {
  visible: boolean
  onClick: () => void
}

export function FloatingCta({ visible, onClick }: FloatingCtaProps) {
  if (!visible) return null

  return (
    <div
      className="fixed bottom-4 left-0 right-0 z-40 px-4 flex justify-center lg:hidden pointer-events-none transition-all duration-300"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label="Garantir minha vaga no Conecta Summit 2026"
        className="pointer-events-auto w-full max-w-sm min-h-[52px] px-5 py-2.5 rounded-full bg-gradient-to-r from-black via-[#0A1428] to-[#0057FF] border border-[#00E5FF]/40 text-white shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(0,229,255,0.35)] flex items-center justify-between gap-3 active:scale-[0.98] transition-transform"
      >
        <div className="flex flex-col text-left">
          <span className="font-sora font-bold text-sm text-white tracking-tight leading-tight">
            Garantir minha vaga
          </span>
          <span className="text-[11px] text-[#00E5FF] font-medium leading-tight">
            Conecta Summit 2026
          </span>
        </div>

        {/* Circular cyan button containing white arrow pointing diagonally to top-right */}
        <div className="w-9 h-9 rounded-full bg-[#00E5FF] text-[#050A15] flex items-center justify-center shrink-0 shadow-md">
          <ArrowUpRight className="w-5 h-5 stroke-[2.5]" />
        </div>
      </button>
    </div>
  )
}
