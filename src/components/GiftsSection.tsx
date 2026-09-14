import { Sparkles, ShieldCheck, Heart } from 'lucide-react'

// Constante fácil de substituir caso a imagem oficial da garrafa e do copo seja enviada
export const GIFTS_IMAGE_SRC: string | null = null

export function GiftsSection() {
  return (
    <section
      id="brindes"
      aria-labelledby="brindes-title"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden border-t border-white/5"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
        {/* Left Side: Illustrative Visual of Blue Thermal Bottle & Custom Cup */}
        <div className="lg:col-span-6 flex justify-center items-center order-2 lg:order-1">
          {/* Gentle vertical float animation only.
              Per spec: PROIBIDO movimento por toque, rotação por toque, inclinação interativa, reflexos passando pela imagem, brilho excessivo. */}
          <div className="animate-float select-none pointer-events-none">
            {GIFTS_IMAGE_SRC ? (
              <img
                src={GIFTS_IMAGE_SRC}
                alt="Garrafa térmica azul e copo personalizado oficiais do Conecta Summit 2026"
                className="w-full max-w-md h-auto rounded-3xl object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
                loading="lazy"
              />
            ) : (
              /* High quality stylized SVG illustration of the Blue Thermal Bottle & Custom Cup */
              <div
                className="relative w-[300px] sm:w-[360px] md:w-[400px] h-[340px] sm:h-[380px] rounded-3xl p-6 bg-gradient-to-b from-[#0D1B33]/80 via-[#0A1428]/90 to-[#050A15] border border-[#00E5FF]/25 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-md flex items-center justify-center"
                role="img"
                aria-label="Ilustração da garrafa térmica azul e copo personalizado exclusivos do Conecta Summit 2026"
              >
                {/* SVG Composition */}
                <svg
                  viewBox="0 0 400 360"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                >
                  <defs>
                    <linearGradient id="bottleGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#004AD6" />
                      <stop offset="45%" stopColor="#0057FF" />
                      <stop offset="85%" stopColor="#0A7CFF" />
                      <stop offset="100%" stopColor="#0035A8" />
                    </linearGradient>
                    <linearGradient id="cupGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#091833" />
                      <stop offset="50%" stopColor="#0D234A" />
                      <stop offset="100%" stopColor="#061226" />
                    </linearGradient>
                    <linearGradient id="metalRim" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#7B8CA3" />
                      <stop offset="50%" stopColor="#E2E8F0" />
                      <stop offset="100%" stopColor="#64748B" />
                    </linearGradient>
                    <linearGradient id="cyanAccent" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#00E5FF" />
                      <stop offset="100%" stopColor="#0057FF" />
                    </linearGradient>
                    <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow
                        dx="0"
                        dy="12"
                        stdDeviation="10"
                        floodColor="#000000"
                        floodOpacity="0.6"
                      />
                    </filter>
                  </defs>

                  {/* Surface Shadow */}
                  <ellipse cx="200" cy="320" rx="140" ry="18" fill="#02050A" opacity="0.8" />

                  {/* ================= THERMAL BOTTLE (Left) ================= */}
                  <g filter="url(#shadowFilter)">
                    {/* Bottle Cap Handle */}
                    <path
                      d="M 125 50 C 125 35, 155 35, 155 50 L 155 60 L 125 60 Z"
                      fill="#1E293B"
                      stroke="#475569"
                      strokeWidth="2"
                    />
                    {/* Cap Rim */}
                    <rect x="118" y="60" width="44" height="14" rx="3" fill="#334155" />
                    <rect x="122" y="74" width="36" height="8" rx="2" fill="url(#metalRim)" />

                    {/* Bottle Neck */}
                    <path d="M 124 82 L 156 82 L 168 110 L 112 110 Z" fill="url(#bottleGrad)" />

                    {/* Bottle Body */}
                    <rect x="110" y="110" width="60" height="190" rx="10" fill="url(#bottleGrad)" />

                    {/* Laser engraved branding "CONECTA SUMMIT" */}
                    <g transform="translate(140, 205) rotate(-90)">
                      <text
                        x="0"
                        y="0"
                        fill="#FFFFFF"
                        fillOpacity="0.9"
                        fontSize="11"
                        fontWeight="700"
                        fontFamily="Sora, sans-serif"
                        letterSpacing="3"
                        textAnchor="middle"
                      >
                        CONECTA SUMMIT
                      </text>
                      <text
                        x="0"
                        y="12"
                        fill="#00E5FF"
                        fontSize="8"
                        fontWeight="600"
                        fontFamily="Sora, sans-serif"
                        letterSpacing="2"
                        textAnchor="middle"
                      >
                        2026
                      </text>
                    </g>

                    {/* Bottle Bottom Band */}
                    <rect x="110" y="285" width="60" height="15" rx="5" fill="#0035A8" />
                    <circle cx="140" cy="292" r="3" fill="#00E5FF" />
                  </g>

                  {/* ================= CUSTOM CUP (Right) ================= */}
                  <g filter="url(#shadowFilter)">
                    {/* Cup Lid */}
                    <ellipse cx="250" cy="170" rx="42" ry="7" fill="#1E293B" />
                    <rect x="210" y="166" width="80" height="7" rx="3" fill="#334155" />
                    {/* Sipper accent */}
                    <rect x="238" y="162" width="24" height="4" rx="2" fill="#00E5FF" />

                    {/* Cup Body (Tapered) */}
                    <path
                      d="M 212 173 L 288 173 L 274 300 C 274 304, 268 306, 250 306 C 232 306, 226 304, 226 300 Z"
                      fill="url(#cupGrad)"
                      stroke="#00E5FF"
                      strokeWidth="1.2"
                      strokeOpacity="0.5"
                    />

                    {/* Metal rim accent */}
                    <path d="M 212 173 L 288 173 L 287 180 L 213 180 Z" fill="url(#metalRim)" />

                    {/* Brand print on cup */}
                    <circle
                      cx="250"
                      cy="235"
                      r="18"
                      fill="none"
                      stroke="#00E5FF"
                      strokeWidth="1"
                      strokeOpacity="0.7"
                    />
                    <text
                      x="250"
                      y="233"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="800"
                      fontFamily="Sora, sans-serif"
                      letterSpacing="1"
                      textAnchor="middle"
                    >
                      CONECTA
                    </text>
                    <text
                      x="250"
                      y="244"
                      fill="#00E5FF"
                      fontSize="7"
                      fontWeight="700"
                      fontFamily="Sora, sans-serif"
                      letterSpacing="1.5"
                      textAnchor="middle"
                    >
                      2026
                    </text>
                  </g>

                  {/* Decorative glowing dots */}
                  <circle cx="80" cy="180" r="3" fill="#00E5FF" fillOpacity="0.4" />
                  <circle cx="320" cy="130" r="2.5" fill="#0057FF" fillOpacity="0.5" />
                  <circle cx="340" cy="270" r="3.5" fill="#00E5FF" fillOpacity="0.3" />
                </svg>

                {/* Subtle tag overlay */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#050A15]/90 border border-[#00E5FF]/30 text-[11px] font-medium text-[#C7D6EA] whitespace-nowrap">
                  Kit Oficial do Participante
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Title, Text & Highlights */}
        <div className="lg:col-span-6 flex flex-col items-start text-left order-1 lg:order-2">
          <span className="text-[#00E5FF] text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase mb-3">
            Lembrança Viva
          </span>

          <h2
            id="brindes-title"
            className="font-sora font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-[-0.02em] leading-[1.15] mb-5"
          >
            Você leva a experiência com você.
          </h2>

          <p className="text-[#C7D6EA] text-base sm:text-lg leading-relaxed font-normal mb-8">
            Os brindes do Conecta Summit foram pensados para marcar sua presença e lembrar que cada
            participante faz parte desta conexão.
          </p>

          {/* Highlights */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex-1 p-4 rounded-2xl bg-[#0D1B33]/60 border border-[#00E5FF]/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-sora font-semibold text-white text-sm sm:text-base">
                Design exclusivo
              </span>
            </div>

            <div className="flex-1 p-4 rounded-2xl bg-[#0D1B33]/60 border border-[#00E5FF]/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0057FF]/20 border border-[#0057FF]/40 flex items-center justify-center text-[#00E5FF] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-sora font-semibold text-white text-sm sm:text-base">
                Identidade Conecta
              </span>
            </div>

            <div className="flex-1 p-4 rounded-2xl bg-[#0D1B33]/60 border border-[#00E5FF]/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <span className="font-sora font-semibold text-white text-sm sm:text-base">
                Feito para você
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
