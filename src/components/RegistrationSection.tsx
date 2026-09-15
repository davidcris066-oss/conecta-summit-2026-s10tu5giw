import { useState, useId, type FormEvent } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Lock,
  Copy,
  Check,
  Building2,
  Clock,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react'
import pb from '@/lib/pocketbase/client'
import { BANK_DETAILS, TICKET_PRICE, getOfficialPixPayload } from '@/lib/pix'
import { QrCode } from './QrCode'

type Step = 'form' | 'payment' | 'pending'

interface SavedRegistration {
  id?: string
  nome: string
  email: string
  telefone: string
  created?: string
}

export function RegistrationSection() {
  const [step, setStep] = useState<Step>('form')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{
    nome?: string
    email?: string
    telefone?: string
  }>({})
  const [copied, setCopied] = useState(false)
  const [savedData, setSavedData] = useState<SavedRegistration | null>(null)

  const nomeId = useId()
  const emailId = useId()
  const telId = useId()

  // Formata telefone/WhatsApp enquanto o usuário digita
  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11)
    let formatted = digits
    if (digits.length > 2) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    }
    if (digits.length > 7) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
    }
    setTelefone(formatted)
    if (fieldErrors.telefone) {
      setFieldErrors((prev) => ({ ...prev, telefone: undefined }))
    }
  }

  const validate = () => {
    const errors: { nome?: string; email?: string; telefone?: string } = {}
    if (!nome.trim()) {
      errors.nome = 'Por favor, informe seu nome completo.'
    } else if (nome.trim().length < 3) {
      errors.nome = 'Por favor, insira o nome completo com pelo menos 3 caracteres.'
    }

    if (!email.trim()) {
      errors.email = 'Por favor, informe seu e-mail.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Por favor, insira um e-mail válido.'
    }

    if (!telefone.trim()) {
      errors.telefone = 'Por favor, informe seu WhatsApp com DDD.'
    } else {
      const digits = telefone.replace(/\D/g, '')
      if (digits.length < 10 || digits.length > 11) {
        errors.telefone = 'Informe um WhatsApp válido com DDD (10 ou 11 dígitos).'
      }
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Etapa 1 -> Etapa 2: Salva no PocketBase como status "pendente" para nunca perder o lead
  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!validate()) return

    setLoading(true)

    try {
      const payload: {
        nome: string
        email: string
        telefone: string
        status: string
        valor?: number
      } = {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: telefone.trim(),
        status: 'pendente',
      }

      if (TICKET_PRICE > 0) {
        payload.valor = TICKET_PRICE
      }

      const record = await pb.collection('inscricoes').create(payload)

      setSavedData({
        id: record.id,
        nome: record.nome || nome.trim(),
        email: record.email || email.trim().toLowerCase(),
        telefone: record.telefone || telefone.trim(),
        created: record.created,
      })

      // Avança para a tela de pagamento
      setStep('payment')
    } catch (err: unknown) {
      console.error('Erro ao registrar inscrição:', err)

      // Identifica mensagem amigável para e-mail duplicado vindo do backend
      const rawMessage = (err as { message?: string })?.message || ''
      const dataErrors = (err as { data?: { data?: Record<string, { message: string }> } })?.data
        ?.data

      if (
        rawMessage.includes('já está inscrito') ||
        rawMessage.includes('unique') ||
        dataErrors?.email?.message?.includes('unique')
      ) {
        setErrorMessage(
          'Já existe uma inscrição registrada com este e-mail no Conecta Summit 2026. Caso precise de ajuda, contate a organização.',
        )
      } else if (rawMessage) {
        setErrorMessage(rawMessage)
      } else {
        setErrorMessage(
          'Não foi possível registrar seus dados. Por favor, verifique as informações e tente novamente.',
        )
      }
    } finally {
      setLoading(false)
    }
  }

  // Gera o payload Pix BR Code com dados oficiais
  const pixPayload = getOfficialPixPayload(
    TICKET_PRICE,
    savedData?.id ? savedData.id.slice(0, 15).toUpperCase() : undefined,
  )

  const handleCopyPix = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(pixPayload)
      } else {
        // Fallback para navegadores sem API Clipboard
        const textArea = document.createElement('textarea')
        textArea.value = pixPayload
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      console.error('Falha ao copiar PIX:', err)
    }
  }

  const resetForm = () => {
    setNome('')
    setEmail('')
    setTelefone('')
    setSavedData(null)
    setErrorMessage(null)
    setFieldErrors({})
    setStep('form')
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

      <div className="relative rounded-3xl p-6 sm:p-10 md:p-14 bg-gradient-to-b from-[#0D1B33]/95 via-[#0A1428]/98 to-[#050A15] border border-[#00E5FF]/35 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_50px_rgba(0,87,255,0.25)] backdrop-blur-xl">
        {/* Header da Seção */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-xs sm:text-sm font-semibold tracking-[0.14em] uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Últimas Vagas Disponíveis</span>
          </div>

          <h2
            id="inscricao-title"
            className="font-sora font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-[-0.02em] leading-[1.12] mb-3"
          >
            A conexão que pode mudar sua história começa aqui.
          </h2>

          <p className="text-[#C7D6EA] text-base sm:text-lg leading-relaxed">
            Faça parte do Conecta Summit 2026.
          </p>

          {/* Stepper visual indicador */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6">
            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 'form'
                    ? 'bg-[#00E5FF] text-[#050A15] ring-4 ring-[#00E5FF]/20 font-bold'
                    : 'bg-[#00E5A8] text-[#050A15]'
                }`}
              >
                {step !== 'form' ? '✓' : '1'}
              </span>
              <span
                className={`text-xs font-semibold ${step === 'form' ? 'text-white' : 'text-[#C7D6EA]'}`}
              >
                Dados
              </span>
            </div>

            <div
              className={`w-8 sm:w-12 h-0.5 ${step !== 'form' ? 'bg-[#00E5A8]' : 'bg-white/15'}`}
            />

            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 'payment'
                    ? 'bg-[#00E5FF] text-[#050A15] ring-4 ring-[#00E5FF]/20'
                    : step === 'pending'
                      ? 'bg-[#00E5A8] text-[#050A15]'
                      : 'bg-white/10 text-white/50'
                }`}
              >
                {step === 'pending' ? '✓' : '2'}
              </span>
              <span
                className={`text-xs font-semibold ${step === 'payment' ? 'text-white' : 'text-[#8FA3BF]'}`}
              >
                Pagamento Pix
              </span>
            </div>

            <div
              className={`w-8 sm:w-12 h-0.5 ${step === 'pending' ? 'bg-[#00E5A8]' : 'bg-white/15'}`}
            />

            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === 'pending'
                    ? 'bg-[#00E5FF] text-[#050A15] ring-4 ring-[#00E5FF]/20'
                    : 'bg-white/10 text-white/50'
                }`}
              >
                3
              </span>
              <span
                className={`text-xs font-semibold ${step === 'pending' ? 'text-white' : 'text-[#8FA3BF]'}`}
              >
                Confirmação
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            ETAPA 1: FORMULÁRIO DE INSCRIÇÃO
           ======================================================== */}
        {step === 'form' && (
          <div className="max-w-2xl mx-auto">
            {/* Informação sobre o ingresso único */}
            <div className="mb-6 p-4 rounded-2xl bg-[#0057FF]/10 border border-[#00E5FF]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00E5FF] block">
                  Ingresso Oficial • Acesso Completo
                </span>
                <span className="text-sm text-white font-medium">
                  Conecta Summit 2026 • 28 de Novembro em Itaituba/PA
                </span>
              </div>
              <div className="text-right sm:text-right shrink-0">
                <span className="text-xs text-[#8FA3BF] block">Investimento</span>
                <span className="font-sora font-extrabold text-lg text-white">
                  {TICKET_PRICE > 0
                    ? `R$ ${TICKET_PRICE.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                    : 'A confirmar'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmitForm} className="flex flex-col gap-4 text-left" noValidate>
              {errorMessage && (
                <div
                  className="p-4 rounded-xl bg-[#FF5C7A]/15 border border-[#FF5C7A]/40 flex items-start gap-3 text-[#FF5C7A] text-sm animate-fade-in"
                  role="alert"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Atenção</p>
                    <p className="text-xs sm:text-sm text-white/90 mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Nome */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={nomeId}
                  className="text-xs font-semibold uppercase tracking-wider text-[#C7D6EA]"
                >
                  Nome Completo <span className="text-[#00E5FF]">*</span>
                </label>
                <input
                  id={nomeId}
                  type="text"
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value)
                    if (fieldErrors.nome) setFieldErrors((prev) => ({ ...prev, nome: undefined }))
                  }}
                  placeholder="Ex: Carlos Eduardo Andrade"
                  required
                  autoComplete="name"
                  className="w-full min-h-[48px] px-4.5 py-3 rounded-2xl bg-[#050A15]/80 border border-[#00E5FF]/30 text-white placeholder-[#8FA3BF] text-base focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/40 outline-none transition-all"
                />
                {fieldErrors.nome && (
                  <span className="text-xs text-[#FF5C7A] font-medium">{fieldErrors.nome}</span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={emailId}
                  className="text-xs font-semibold uppercase tracking-wider text-[#C7D6EA]"
                >
                  Seu Melhor E-mail <span className="text-[#00E5FF]">*</span>
                </label>
                <input
                  id={emailId}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  placeholder="Ex: carlos@empresa.com.br"
                  required
                  autoComplete="email"
                  className="w-full min-h-[48px] px-4.5 py-3 rounded-2xl bg-[#050A15]/80 border border-[#00E5FF]/30 text-white placeholder-[#8FA3BF] text-base focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/40 outline-none transition-all"
                />
                {fieldErrors.email && (
                  <span className="text-xs text-[#FF5C7A] font-medium">{fieldErrors.email}</span>
                )}
              </div>

              {/* WhatsApp / Telefone */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={telId}
                  className="text-xs font-semibold uppercase tracking-wider text-[#C7D6EA]"
                >
                  WhatsApp <span className="text-[#00E5FF]">*</span>
                </label>
                <input
                  id={telId}
                  type="tel"
                  value={telefone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="Ex: (93) 98123-4567"
                  required
                  autoComplete="tel"
                  className="w-full min-h-[48px] px-4.5 py-3 rounded-2xl bg-[#050A15]/80 border border-[#00E5FF]/30 text-white placeholder-[#8FA3BF] text-base focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/40 outline-none transition-all"
                />
                {fieldErrors.telefone && (
                  <span className="text-xs text-[#FF5C7A] font-medium">{fieldErrors.telefone}</span>
                )}
              </div>

              {/* Submit Button (Verbatim mantido) */}
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
                <span>Seus dados estão protegidos. Pagamento 100% seguro via Pix.</span>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================
            ETAPA 2: PAGAMENTO VIA PIX ESTÁTICO
           ======================================================== */}
        {step === 'payment' && (
          <div className="max-w-2xl mx-auto flex flex-col gap-6 animate-fade-in">
            {/* Banner de Lead Salvo */}
            <div className="p-4 rounded-2xl bg-[#00E5A8]/10 border border-[#00E5A8]/40 flex items-center gap-3 text-left">
              <CheckCircle2 className="w-5 h-5 text-[#00E5A8] shrink-0" />
              <div className="text-xs sm:text-sm">
                <p className="text-white font-semibold">
                  Dados de {savedData?.nome || 'inscrição'} pré-cadastrados com sucesso!
                </p>
                <p className="text-[#C7D6EA]">
                  Agora conclua o pagamento via Pix para validação da sua vaga.
                </p>
              </div>
            </div>

            {/* Caixa Principal de Pagamento */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#050A15]/90 border border-[#00E5FF]/40 shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] text-xs font-semibold mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Pagamento Instantâneo Oficial</span>
              </div>

              <h3 className="font-sora font-bold text-xl sm:text-2xl text-white mb-1">
                Pague com Pix
              </h3>

              <p className="text-sm text-[#C7D6EA] max-w-md mb-6">
                Abra o aplicativo do seu banco, escolha a opção <strong>Pagar com Pix</strong> e
                escaneie o QR Code ou cole o código copia e cola abaixo.
              </p>

              {/* Valor do Ingresso */}
              <div className="w-full mb-6 p-4 rounded-2xl bg-[#0A1428] border border-white/10 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-xs text-[#8FA3BF] block uppercase tracking-wider">
                    Valor da Inscrição
                  </span>
                  <span className="font-sora font-extrabold text-xl sm:text-2xl text-[#00E5FF]">
                    {TICKET_PRICE > 0
                      ? `R$ ${TICKET_PRICE.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : 'Confirme o valor no app do banco'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] font-semibold border border-[#00E5FF]/30">
                    Ingresso Único
                  </span>
                </div>
              </div>

              {/* QR Code */}
              <div className="mb-6 flex flex-col items-center">
                <QrCode
                  value={pixPayload}
                  size={200}
                  alt="QR Code Pix do Conecta Summit 2026 - ASEII"
                />
                <span className="text-xs text-[#8FA3BF] mt-3">
                  Aponte a câmera do seu app bancário para o código acima
                </span>
              </div>

              {/* Botão Copia e Cola */}
              <div className="w-full flex flex-col gap-2 mb-6">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#C7D6EA] text-left">
                  Código Pix (Copia e Cola)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={pixPayload}
                    aria-label="Código Pix Copia e Cola"
                    className="w-full min-h-[48px] pl-3 pr-28 py-2 rounded-xl bg-[#0A1428] border border-[#00E5FF]/30 text-xs text-[#C7D6EA] font-mono select-all outline-none overflow-hidden text-ellipsis whitespace-nowrap"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className={`absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                      copied
                        ? 'bg-[#00E5A8] text-[#050A15]'
                        : 'bg-[#00E5FF] hover:bg-[#00C2D6] text-[#050A15]'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Pix</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Dados da Conta para Conferência */}
              <div className="w-full p-4 rounded-2xl bg-[#0A1428]/80 border border-white/10 text-left text-xs sm:text-sm text-[#C7D6EA] mb-6">
                <div className="flex items-center gap-2 text-white font-semibold mb-2.5 pb-2 border-b border-white/10">
                  <Building2 className="w-4 h-4 text-[#00E5FF]" />
                  <span>Dados Bancários Oficiais para Conferência</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#8FA3BF] block">Banco:</span>
                    <strong className="text-white">{BANK_DETAILS.bank}</strong>
                  </div>
                  <div>
                    <span className="text-[#8FA3BF] block">Agência / Conta:</span>
                    <strong className="text-white">
                      Ag. {BANK_DETAILS.agency} | Conta {BANK_DETAILS.account}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#8FA3BF] block">Razão Social:</span>
                    <strong className="text-white">{BANK_DETAILS.legalName}</strong>
                  </div>
                  <div>
                    <span className="text-[#8FA3BF] block">Chave Pix (CNPJ):</span>
                    <strong className="text-[#00E5FF] font-mono">{BANK_DETAILS.cnpj}</strong>
                  </div>
                </div>
              </div>

              {/* Instrução pós pagamento */}
              <div className="p-3.5 rounded-xl bg-[#0057FF]/15 border border-[#0057FF]/40 text-xs text-[#C7D6EA] text-left mb-6 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
                <p>
                  <strong className="text-white">Importante:</strong> Após pagar, sua inscrição fica{' '}
                  <strong className="text-[#00E5FF]">pendente de confirmação</strong>. Você receberá
                  a confirmação da organização após a conciliação manual.
                </p>
              </div>

              {/* Botão de avanço para etapa 3 */}
              <button
                type="button"
                onClick={() => setStep('pending')}
                className="w-full min-h-[52px] sm:min-h-[56px] px-8 py-4 rounded-full bg-gradient-to-r from-[#00E5A8] to-[#00E5FF] hover:opacity-95 text-[#050A15] font-sora font-extrabold text-base tracking-wide shadow-[0_8px_30px_rgba(0,229,168,0.35)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Já realizei o pagamento via Pix</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>

              <button
                type="button"
                onClick={() => setStep('form')}
                className="mt-4 text-xs font-semibold text-[#8FA3BF] hover:text-[#00E5FF] transition-colors"
              >
                ← Voltar e alterar dados da inscrição
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            ETAPA 3: AGUARDANDO CONFIRMAÇÃO
           ======================================================== */}
        {step === 'pending' && (
          <div
            className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#00E5A8]/10 via-[#0A1428]/95 to-[#050A15] border border-[#00E5A8]/40 text-center animate-fade-in shadow-[0_20px_60px_rgba(0,0,0,0.85)]"
            role="status"
            aria-live="polite"
          >
            <div className="w-16 h-16 rounded-full bg-[#00E5A8]/20 border-2 border-[#00E5A8]/50 flex items-center justify-center mx-auto mb-5 text-[#00E5A8] shadow-[0_0_30px_rgba(0,229,168,0.3)]">
              <Clock className="w-9 h-9 animate-pulse" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5A8]/10 text-[#00E5A8] text-xs font-semibold mb-3 border border-[#00E5A8]/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Status: Pendente de Confirmação</span>
            </div>

            <h3 className="font-sora font-extrabold text-2xl sm:text-3xl text-white mb-3">
              Inscrição enviada com sucesso!
            </h3>

            <p className="text-[#C7D6EA] text-base leading-relaxed max-w-lg mx-auto mb-6">
              Olá, <strong className="text-white">{savedData?.nome || 'participante'}</strong>! Seu
              pedido de inscrição foi registrado com sucesso em nosso sistema.
            </p>

            {/* Card com resumo dos dados */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#050A15]/80 border border-white/10 text-left text-xs sm:text-sm text-[#C7D6EA] max-w-lg mx-auto mb-6">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <span className="text-[#8FA3BF]">Evento:</span>
                <strong className="text-white">Conecta Summit 2026</strong>
              </div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <span className="text-[#8FA3BF]">E-mail cadastrado:</span>
                <strong className="text-white font-mono">{savedData?.email}</strong>
              </div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <span className="text-[#8FA3BF]">WhatsApp:</span>
                <strong className="text-white">{savedData?.telefone}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8FA3BF]">Data e Local:</span>
                <strong className="text-[#00E5FF]">28 Nov 2026 • Itaituba/PA</strong>
              </div>
            </div>

            {/* Orientações finais */}
            <div className="p-4 rounded-2xl bg-[#0057FF]/15 border border-[#0057FF]/40 text-xs sm:text-sm text-[#C7D6EA] max-w-lg mx-auto mb-8 text-left">
              <p className="font-semibold text-white mb-1">Próximos passos:</p>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#C7D6EA]">
                <li>Nossa equipe validará o seu comprovante Pix junto ao banco Sicredi.</li>
                <li>
                  Assim que conciliar, o administrador confirmará sua inscrição no painel oficial.
                </li>
                <li>
                  Você receberá as novidades e o credenciamento definitivo no e-mail e WhatsApp
                  informados.
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setStep('payment')}
                className="w-full sm:w-auto min-h-[46px] px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold transition-all border border-white/15"
              >
                Ver dados do Pix novamente
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto min-h-[46px] px-6 py-2.5 rounded-full bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] text-xs sm:text-sm font-semibold transition-all border border-[#00E5FF]/30 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Cadastrar outra pessoa</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
