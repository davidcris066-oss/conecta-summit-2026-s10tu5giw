import { useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, AlertCircle, Loader2, Sparkles, Lock } from 'lucide-react'
import pb from '@/lib/pocketbase/client'

export function RegistrationSection() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ nome?: string; email?: string }>({})

  const validate = () => {
    const errors: { nome?: string; email?: string } = {}
    if (!nome.trim()) {
      errors.nome = 'Por favor, informe seu nome completo.'
    }
    if (!email.trim()) {
      errors.email = 'Por favor, informe seu e-mail.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Por favor, insira um e-mail válido.'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      await pb.collection('inscricoes').create({
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: telefone.trim() || undefined,
      })

      setSuccess(true)
    } catch (err: unknown) {
      console.error('Erro ao enviar inscrição:', err)
      // PocketBase friendly error or duplicate check
      const message =
        (err as { message?: string })?.message ||
        'Não foi possível concluir sua inscrição. Verifique os dados e tente novamente.'
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      id="inscricao"
      aria-labelledby="inscricao-title"
      className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto overflow-hidden"
    >
      {/* Background radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#0057FF]/25 to-[#00E5FF]/20 rounded-full blur-[150px] pointer-events-none -z-10"
        aria-hidden="true"
      />

      <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 bg-gradient-to-b from-[#0D1B33]/90 via-[#0A1428]/95 to-[#050A15] border border-[#00E5FF]/35 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_50px_rgba(0,87,255,0.25)] backdrop-blur-xl">
        <div className="max-w-2xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Últimas Vagas Disponíveis</span>
          </div>

          {/* Title (Verbatim) */}
          <h2
            id="inscricao-title"
            className="font-sora font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-[-0.02em] leading-[1.12] mb-4"
          >
            A conexão que pode mudar sua história começa aqui.
          </h2>

          {/* Text (Verbatim) */}
          <p className="text-[#C7D6EA] text-base sm:text-lg leading-relaxed mb-8">
            Faça parte do Conecta Summit 2026.
          </p>

          {/* Form or Success State */}
          {success ? (
            <div
              className="p-8 rounded-2xl bg-[#00E5A8]/10 border border-[#00E5A8]/40 text-center animate-fade-in"
              role="status"
              aria-live="polite"
            >
              <div className="w-14 h-14 rounded-full bg-[#00E5A8]/20 border border-[#00E5A8]/40 flex items-center justify-center mx-auto mb-4 text-[#00E5A8]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-sora font-bold text-2xl text-white mb-2">Inscrição recebida!</h3>
              <p className="text-[#C7D6EA] text-base leading-relaxed max-w-md mx-auto mb-6">
                Em breve você receberá mais informações por e-mail com as instruções para a próxima
                etapa do Conecta Summit 2026.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSuccess(false)
                  setNome('')
                  setEmail('')
                  setTelefone('')
                }}
                className="text-xs uppercase font-semibold text-[#00E5FF] hover:underline"
              >
                Cadastrar outra pessoa
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left" noValidate>
              {errorMessage && (
                <div
                  className="p-4 rounded-xl bg-[#FF5C7A]/15 border border-[#FF5C7A]/40 flex items-center gap-3 text-[#FF5C7A] text-sm animate-fade-in"
                  role="alert"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Nome */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="reg-nome"
                  className="text-xs font-semibold uppercase tracking-wider text-[#C7D6EA]"
                >
                  Nome Completo <span className="text-[#00E5FF]">*</span>
                </label>
                <input
                  id="reg-nome"
                  type="text"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value)
                    if (fieldErrors.nome) setFieldErrors((prev) => ({ ...prev, nome: undefined }))
                  }}
                  placeholder="Ex: Carlos Eduardo Andrade"
                  required
                  className="w-full min-h-[48px] px-4.5 py-3 rounded-2xl bg-[#050A15]/80 border border-[#00E5FF]/30 text-white placeholder-[#8FA3BF] text-base focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/40 outline-none transition-all"
                />
                {fieldErrors.nome && (
                  <span className="text-xs text-[#FF5C7A] font-medium">{fieldErrors.nome}</span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="reg-email"
                  className="text-xs font-semibold uppercase tracking-wider text-[#C7D6EA]"
                >
                  Seu Melhor E-mail <span className="text-[#00E5FF]">*</span>
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  placeholder="Ex: carlos@empresa.com.br"
                  required
                  className="w-full min-h-[48px] px-4.5 py-3 rounded-2xl bg-[#050A15]/80 border border-[#00E5FF]/30 text-white placeholder-[#8FA3BF] text-base focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/40 outline-none transition-all"
                />
                {fieldErrors.email && (
                  <span className="text-xs text-[#FF5C7A] font-medium">{fieldErrors.email}</span>
                )}
              </div>

              {/* Telefone / WhatsApp */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="reg-telefone"
                  className="text-xs font-semibold uppercase tracking-wider text-[#C7D6EA]"
                >
                  WhatsApp / Telefone{' '}
                  <span className="text-[#8FA3BF] font-normal text-[11px]">(opcional)</span>
                </label>
                <input
                  id="reg-telefone"
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="Ex: (93) 98123-4567"
                  className="w-full min-h-[48px] px-4.5 py-3 rounded-2xl bg-[#050A15]/80 border border-[#00E5FF]/30 text-white placeholder-[#8FA3BF] text-base focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/40 outline-none transition-all"
                />
              </div>

              {/* Submit Button (Verbatim: "Quero garantir meu ingresso") */}
              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full min-h-[52px] sm:min-h-[56px] px-8 py-4 rounded-full bg-gradient-to-r from-[#0057FF] to-[#00E5FF] hover:from-[#004AD6] hover:to-[#00D0E8] text-white font-sora font-bold text-base sm:text-lg tracking-wide shadow-[0_8px_30px_rgba(0,87,255,0.45)] hover:shadow-[0_12px_40px_rgba(0,229,255,0.5)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processando inscrição...</span>
                  </>
                ) : (
                  <>
                    <span>Quero garantir meu ingresso</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-[#8FA3BF] mt-2">
                <Lock className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Seus dados estão seguros e protegidos. Sem spam.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
