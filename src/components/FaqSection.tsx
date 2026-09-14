import { useState } from 'react'
import { Plus } from 'lucide-react'

interface FaqItem {
  id: string
  question: string
  answer: string
}

// 6 Questions and answers VERBATIM from spec
const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Quando e onde acontecerá o Conecta Summit 2026?',
    answer:
      'O encontro será realizado no dia 28 de novembro de 2026, em Itaituba, Pará, das 9h às 18h.',
  },
  {
    id: 'faq-2',
    question: 'O evento será presencial?',
    answer:
      'Sim. O Conecta Summit 2026 foi pensado como uma experiência presencial, feita para aproximar pessoas, ideias e oportunidades.',
  },
  {
    id: 'faq-3',
    question: 'Para quem é o Conecta Summit?',
    answer:
      'Para empresários, empreendedores, profissionais, estudantes e pessoas que desejam ampliar sua visão, criar conexões relevantes e descobrir novas possibilidades de crescimento.',
  },
  {
    id: 'faq-4',
    question: 'O que encontrarei durante o evento?',
    answer:
      'Um dia de palestras, conversas, histórias reais e networking, com conteúdos voltados a negócios, posicionamento, comportamento, tributação, comunicação e desenvolvimento pessoal.',
  },
  {
    id: 'faq-5',
    question: 'Preciso já ter uma empresa para participar?',
    answer:
      'Não. O evento também recebe quem está planejando empreender, deseja se posicionar melhor profissionalmente ou busca novas ideias e conexões para avançar.',
  },
  {
    id: 'faq-6',
    question: 'Como posso garantir minha participação?',
    answer:
      "Use o botão 'Quero garantir meu ingresso'. Ele levará você para a próxima etapa da inscrição.",
  },
]

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>('faq-1')

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden border-t border-white/5"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column (Desktop 1025px+): Title and short supporting text */}
        <div className="lg:col-span-5 flex flex-col items-start text-left">
          <span className="text-[#00E5FF] text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase mb-3">
            Tire suas dúvidas
          </span>
          <h2
            id="faq-title"
            className="font-sora font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-[-0.02em] leading-[1.15] mb-5"
          >
            Perguntas frequentes
          </h2>
          <p className="text-[#C7D6EA] text-base sm:text-lg leading-relaxed font-normal mb-6">
            Tudo o que você precisa saber sobre a experiência do Conecta Summit 2026 antes de
            garantir a sua presença.
          </p>
          <div className="hidden lg:flex items-center gap-3 p-4 rounded-2xl bg-[#0D1B33]/60 border border-[#00E5FF]/20 w-full">
            <div className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] animate-pulse" />
            <span className="text-xs text-[#8FA3BF]">
              Vagas presenciais limitadas para garantir a melhor experiência.
            </span>
          </div>
        </div>

        {/* Right Column: Accordion list (One open at a time, min 44px tap targets, rotating + icon) */}
        <div className="lg:col-span-7 flex flex-col gap-3.5">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id
            return (
              <div
                key={faq.id}
                className="rounded-2xl bg-[#0D1B33]/70 border border-[#00E5FF]/20 overflow-hidden transition-all duration-300 hover:border-[#00E5FF]/40 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
              >
                <button
                  type="button"
                  id={`btn-${faq.id}`}
                  aria-expanded={isOpen}
                  aria-controls={`content-${faq.id}`}
                  onClick={() => toggleItem(faq.id)}
                  className="w-full min-h-[52px] sm:min-h-[58px] px-5 sm:px-6 py-4 flex items-center justify-between text-left gap-4 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                >
                  <span className="font-sora font-semibold text-white text-base sm:text-lg tracking-tight">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-[#0057FF]/20 border border-[#00E5FF]/30 flex items-center justify-center shrink-0 text-[#00E5FF] transition-transform duration-300 ${
                      isOpen ? 'rotate-45 bg-[#00E5FF]/20' : 'rotate-0'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`content-${faq.id}`}
                    role="region"
                    aria-labelledby={`btn-${faq.id}`}
                    className="px-5 sm:px-6 pb-5 pt-1 text-[#C7D6EA] text-sm sm:text-base leading-relaxed border-t border-white/5 animate-accordion-down"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
