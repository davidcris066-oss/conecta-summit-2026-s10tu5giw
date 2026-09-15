import { useState, useEffect, useMemo, type FormEvent } from 'react'
import {
  ShieldCheck,
  Lock,
  Mail,
  LogOut,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Users,
  AlertCircle,
  Phone,
  Calendar,
  Filter,
  DollarSign,
  ChevronDown,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react'
import {
  fetchInscricoes,
  updateInscricaoStatus,
  loginAdmin,
  logoutAdmin,
  isUserAdminAuthenticated,
  getCurrentAdminUser,
  type InscricaoRecord,
  type InscricaoStatus,
  type InscricaoPlano,
} from '@/services/inscricoes'
import { TICKET_TIERS, type TicketTierKey } from '@/lib/pix'
import pb from '@/lib/pocketbase/client'
import { useToast } from '@/hooks/use-toast'

export default function AdminPage() {
  const { toast } = useToast()

  // Estado de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isUserAdminAuthenticated())
  const [currentUser, setCurrentUser] = useState(getCurrentAdminUser())

  // Formulário de Login
  const [loginEmail, setLoginEmail] = useState('magnumcontabeis@gmail.com')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  // Dados do painel
  const [inscricoes, setInscricoes] = useState<InscricaoRecord[]>([])
  const [loadingData, setLoadingData] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'todos' | InscricaoStatus>('todos')
  const [planoFilter, setPlanoFilter] = useState<'todos' | InscricaoPlano>('todos')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Escutar mudanças no authStore
  useEffect(() => {
    const unsub = pb.authStore.onChange(() => {
      const auth = isUserAdminAuthenticated()
      setIsAuthenticated(auth)
      setCurrentUser(getCurrentAdminUser())
    })
    return () => {
      unsub()
    }
  }, [])

  // Carregar dados de inscrições se autenticado
  const loadData = async () => {
    if (!isUserAdminAuthenticated()) return
    setLoadingData(true)
    try {
      const data = await fetchInscricoes()
      setInscricoes(data)
    } catch (err: unknown) {
      console.error('Erro ao carregar inscrições:', err)
      toast({
        title: 'Erro ao carregar dados',
        description: 'Não foi possível buscar as inscrições do banco de dados.',
        variant: 'destructive',
      })
    } finally {
      setLoadingData(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  // Submissão de login
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Informe e-mail e senha.')
      return
    }

    setLoginLoading(true)
    try {
      await loginAdmin(loginEmail, loginPassword)
      setIsAuthenticated(true)
      setCurrentUser(getCurrentAdminUser())
      toast({
        title: 'Login efetuado com sucesso!',
        description: 'Bem-vindo ao painel de administração.',
      })
    } catch (err: unknown) {
      console.error('Falha no login:', err)
      setLoginError('Credenciais inválidas. Verifique seu e-mail e senha de administrador.')
    } finally {
      setLoginLoading(false)
    }
  }

  // Logout
  const handleLogout = () => {
    logoutAdmin()
    setIsAuthenticated(false)
    setCurrentUser(null)
    setInscricoes([])
    toast({
      title: 'Sessão encerrada',
      description: 'Você saiu da área administrativa.',
    })
  }

  // Ação de mudar status da inscrição
  const handleUpdateStatus = async (id: string, newStatus: InscricaoStatus) => {
    setUpdatingId(id)
    try {
      const updated = await updateInscricaoStatus(id, newStatus)
      setInscricoes((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: updated.status } : item)),
      )
      toast({
        title:
          newStatus === 'confirmado'
            ? 'Inscrição confirmada!'
            : newStatus === 'cancelado'
              ? 'Inscrição cancelada'
              : 'Status atualizado para pendente',
        description: `O status da inscrição foi alterado para "${newStatus}".`,
      })
    } catch (err: unknown) {
      console.error('Falha ao atualizar inscrição:', err)
      toast({
        title: 'Erro ao atualizar',
        description: 'Não foi possível salvar o novo status no banco de dados.',
        variant: 'destructive',
      })
    } finally {
      setUpdatingId(null)
    }
  }

  // Contadores
  const totalCount = inscricoes.length
  const pendentesCount = inscricoes.filter((i) => !i.status || i.status === 'pendente').length
  const confirmadasCount = inscricoes.filter((i) => i.status === 'confirmado').length
  const canceladasCount = inscricoes.filter((i) => i.status === 'cancelado').length

  // Contadores por plano
  const vipCount = inscricoes.filter((i) => i.plano?.toLowerCase() === 'vip').length
  const premiumCount = inscricoes.filter((i) => i.plano?.toLowerCase() === 'premium').length
  const startCount = inscricoes.filter((i) => i.plano?.toLowerCase() === 'start').length

  // Helper para renderizar badge de plano
  const getPlanoBadge = (plano?: string) => {
    const p = plano?.toLowerCase()
    if (p === 'vip') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-400/20 to-yellow-500/20 text-amber-300 border border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.2)]">
          VIP
        </span>
      )
    }
    if (p === 'premium') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 shadow-[0_0_12px_rgba(0,229,255,0.2)]">
          Premium
        </span>
      )
    }
    if (p === 'start') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0057FF]/25 text-[#7CA7FF] border border-[#0057FF]/40">
          Start
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-[#8FA3BF] bg-white/5 border border-white/10">
        -
      </span>
    )
  }

  // Filtragem e busca
  const filteredInscricoes = useMemo(() => {
    return inscricoes.filter((item) => {
      const matchesSearch =
        item.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.telefone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.plano?.toLowerCase().includes(searchTerm.toLowerCase())

      const itemStatus = item.status || 'pendente'
      const matchesStatus = statusFilter === 'todos' || itemStatus === statusFilter

      const itemPlano = item.plano?.toLowerCase()
      const matchesPlano = planoFilter === 'todos' || itemPlano === planoFilter

      return matchesSearch && matchesStatus && matchesPlano
    })
  }, [inscricoes, searchTerm, statusFilter, planoFilter])

  // Formatação de data
  const formatDate = (isoString?: string) => {
    if (!isoString) return '-'
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return isoString
    }
  }

  // =========================================================================
  // TELA DE LOGIN (quando não autenticado)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050A15] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Glow de fundo */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-[#0057FF]/20 to-[#00E5FF]/20 rounded-full blur-[140px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="w-full max-w-md relative z-10">
          <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-b from-[#0D1B33]/95 via-[#0A1428]/98 to-[#050A15] border border-[#00E5FF]/35 shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_50px_rgba(0,87,255,0.25)] backdrop-blur-xl">
            {/* Header Login */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-[#0057FF]/20 to-[#00E5FF]/20 border border-[#00E5FF]/40 flex items-center justify-center text-[#00E5FF] shadow-[0_0_25px_rgba(0,229,255,0.25)]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#00E5FF] block mb-1">
                Conecta Summit 2026
              </span>
              <h1 className="font-sora font-extrabold text-2xl sm:text-3xl text-white">
                Painel Administrativo
              </h1>
              <p className="text-xs sm:text-sm text-[#8FA3BF] mt-2">
                Acesso exclusivo para os organizadores do evento
              </p>
            </div>

            {loginError && (
              <div
                className="mb-6 p-4 rounded-xl bg-[#FF5C7A]/15 border border-[#FF5C7A]/40 flex items-start gap-3 text-[#FF5C7A] text-sm animate-fade-in"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-white/95">{loginError}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#C7D6EA]">
                  E-mail do Administrador
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-[#8FA3BF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="magnumcontabeis@gmail.com"
                    required
                    autoComplete="email"
                    className="w-full min-h-[48px] pl-11 pr-4 py-3 rounded-2xl bg-[#050A15]/80 border border-[#00E5FF]/30 text-white placeholder-[#8FA3BF] text-sm focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/40 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#C7D6EA]">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-[#8FA3BF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full min-h-[48px] pl-11 pr-4 py-3 rounded-2xl bg-[#050A15]/80 border border-[#00E5FF]/30 text-white placeholder-[#8FA3BF] text-sm focus:border-[#00E5FF] focus:ring-2 focus:ring-[#00E5FF]/40 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full min-h-[48px] mt-2 rounded-2xl bg-gradient-to-r from-[#0057FF] to-[#00E5FF] hover:from-[#0047D4] hover:to-[#00C7DE] text-white font-sora font-bold text-sm tracking-wide shadow-[0_10px_25px_rgba(0,87,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Entrar no Painel</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // =========================================================================
  // PAINEL ADMINISTRATIVO (quando autenticado)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#050A15] text-white flex flex-col relative">
      {/* Barra de Navegação Superior */}
      <header className="sticky top-0 z-30 bg-[#081020]/90 backdrop-blur-xl border-b border-[#00E5FF]/20 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0057FF] to-[#00E5FF] flex items-center justify-center text-white shadow-[0_0_15px_rgba(0,229,255,0.4)] shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-sora font-extrabold text-sm sm:text-base text-white tracking-tight">
                Conecta Summit 2026
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 uppercase">
                Admin
              </span>
            </div>
            <p className="text-xs text-[#8FA3BF] truncate max-w-[200px] sm:max-w-none">
              {currentUser?.name || currentUser?.email || 'Organizador'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={loadData}
            disabled={loadingData}
            title="Recarregar inscrições"
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-medium text-[#C7D6EA] hover:text-white transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>

          <button
            onClick={handleLogout}
            title="Encerrar sessão"
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#FF5C7A]/15 hover:bg-[#FF5C7A]/25 border border-[#FF5C7A]/30 text-xs sm:text-sm font-semibold text-[#FF5C7A] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Título e Subtítulo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="font-sora font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Gerenciamento de Inscrições
            </h1>
            <p className="text-xs sm:text-sm text-[#8FA3BF] mt-1">
              Confirme pagamentos Pix manualmente e acompanhe o credenciamento em tempo real.
            </p>
          </div>
        </div>

        {/* Cards de Métricas / Contadores no Topo */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card Total */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0D1B33]/90 to-[#0A1428]/90 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8FA3BF] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total</span>
              <Users className="w-4 h-4 text-[#00E5FF]" />
            </div>
            <div className="font-sora font-extrabold text-2xl sm:text-3xl text-white">
              {totalCount}
            </div>
            <span className="text-[11px] text-[#8FA3BF] mt-1">Inscrições recebidas</span>
          </div>

          {/* Card Pendentes */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0D1B33]/90 to-[#0A1428]/90 border border-amber-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Pendentes</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="font-sora font-extrabold text-2xl sm:text-3xl text-amber-400">
              {pendentesCount}
            </div>
            <span className="text-[11px] text-amber-200/70 mt-1">Aguardando confirmação Pix</span>
          </div>

          {/* Card Confirmados */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0D1B33]/90 to-[#0A1428]/90 border border-[#00E5A8]/30 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#00E5A8] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Confirmadas</span>
              <CheckCircle2 className="w-4 h-4 text-[#00E5A8]" />
            </div>
            <div className="font-sora font-extrabold text-2xl sm:text-3xl text-[#00E5A8]">
              {confirmadasCount}
            </div>
            <span className="text-[11px] text-[#00E5A8]/70 mt-1">Pagamentos validados</span>
          </div>

          {/* Card Cancelados */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0D1B33]/90 to-[#0A1428]/90 border border-[#FF5C7A]/30 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-md flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#FF5C7A] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Canceladas</span>
              <XCircle className="w-4 h-4 text-[#FF5C7A]" />
            </div>
            <div className="font-sora font-extrabold text-2xl sm:text-3xl text-[#FF5C7A]">
              {canceladasCount}
            </div>
            <span className="text-[11px] text-[#FF5C7A]/70 mt-1">Desistências ou expiradas</span>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="p-4 rounded-2xl bg-[#0D1B33]/70 border border-[#00E5FF]/20 flex flex-col gap-3">
          {/* Linha superior: Busca */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#8FA3BF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, e-mail, WhatsApp ou plano..."
              className="w-full min-h-[44px] pl-10 pr-4 py-2 rounded-xl bg-[#050A15]/90 border border-white/10 text-white placeholder-[#8FA3BF] text-sm focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]/50 outline-none transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8FA3BF] hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Linha inferior: Filtros por Status e Plano */}
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between pt-1 border-t border-white/5">
            {/* Filtro por Status */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
              <span className="text-xs text-[#8FA3BF] font-semibold uppercase tracking-wider pl-1 pr-1 shrink-0">
                Status:
              </span>
              {(['todos', 'pendente', 'confirmado', 'cancelado'] as const).map((st) => {
                const active = statusFilter === st
                return (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? st === 'confirmado'
                          ? 'bg-[#00E5A8] text-[#050A15] shadow-[0_0_15px_rgba(0,229,168,0.3)]'
                          : st === 'pendente'
                            ? 'bg-amber-400 text-[#050A15] shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                            : st === 'cancelado'
                              ? 'bg-[#FF5C7A] text-white shadow-[0_0_15px_rgba(255,92,122,0.3)]'
                              : 'bg-[#00E5FF] text-[#050A15] shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                        : 'bg-[#050A15]/80 hover:bg-white/10 text-[#C7D6EA] border border-white/10'
                    }`}
                  >
                    {st === 'todos' ? 'Todos' : st}
                    {st === 'todos' && ` (${totalCount})`}
                    {st === 'pendente' && ` (${pendentesCount})`}
                    {st === 'confirmado' && ` (${confirmadasCount})`}
                    {st === 'cancelado' && ` (${canceladasCount})`}
                  </button>
                )
              })}
            </div>

            {/* Filtro por Plano */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 scrollbar-none">
              <span className="text-xs text-[#8FA3BF] font-semibold uppercase tracking-wider pl-1 pr-1 shrink-0">
                Plano:
              </span>
              {(['todos', 'vip', 'premium', 'start'] as const).map((pl) => {
                const active = planoFilter === pl
                return (
                  <button
                    key={pl}
                    onClick={() => setPlanoFilter(pl)}
                    className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      active
                        ? pl === 'vip'
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-[#050A15] shadow-[0_0_15px_rgba(251,191,36,0.35)] font-bold'
                          : pl === 'premium'
                            ? 'bg-[#00E5FF] text-[#050A15] shadow-[0_0_15px_rgba(0,229,255,0.35)] font-bold'
                            : pl === 'start'
                              ? 'bg-[#0057FF] text-white shadow-[0_0_15px_rgba(0,87,255,0.35)] font-bold'
                              : 'bg-white text-[#050A15] font-bold'
                        : 'bg-[#050A15]/80 hover:bg-white/10 text-[#C7D6EA] border border-white/10'
                    }`}
                  >
                    {pl === 'todos' ? 'Todos os Planos' : pl}
                    {pl === 'vip' && ` (${vipCount})`}
                    {pl === 'premium' && ` (${premiumCount})`}
                    {pl === 'start' && ` (${startCount})`}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tabela / Cards Responsivos de Inscrições */}
        <div className="rounded-2xl border border-[#00E5FF]/25 bg-gradient-to-b from-[#0D1B33]/80 to-[#0A1428]/90 backdrop-blur-xl shadow-[0_15px_50px_rgba(0,0,0,0.6)] overflow-hidden">
          {loadingData ? (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-3">
              <RefreshCw className="w-8 h-8 text-[#00E5FF] animate-spin" />
              <p className="text-sm text-[#C7D6EA]">Carregando lista de inscritos...</p>
            </div>
          ) : filteredInscricoes.length === 0 ? (
            <div className="py-16 px-4 text-center">
              <Users className="w-10 h-10 text-[#8FA3BF] mx-auto mb-3 opacity-60" />
              <h3 className="font-sora font-semibold text-lg text-white">
                Nenhuma inscrição encontrada
              </h3>
              <p className="text-xs sm:text-sm text-[#8FA3BF] mt-1 max-w-sm mx-auto">
                {searchTerm || statusFilter !== 'todos'
                  ? 'Nenhum resultado corresponde aos filtros selecionados. Tente ajustar a busca.'
                  : 'Nenhuma inscrição foi cadastrada até o momento.'}
              </p>
            </div>
          ) : (
            <>
              {/* Tabela para Telas Médias e Grandes */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#050A15]/60 text-[11px] uppercase tracking-wider text-[#8FA3BF] font-semibold">
                      <th className="py-3.5 px-4">Participante</th>
                      <th className="py-3.5 px-4">Plano</th>
                      <th className="py-3.5 px-4">Contato</th>
                      <th className="py-3.5 px-4">Data</th>
                      <th className="py-3.5 px-4">Valor</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filteredInscricoes.map((item) => {
                      const itemStatus = item.status || 'pendente'
                      const isUpdating = updatingId === item.id

                      return (
                        <tr key={item.id} className="hover:bg-white/[0.03] transition-colors group">
                          {/* Nome e ID */}
                          <td className="py-4 px-4 align-middle">
                            <div className="font-medium text-white">{item.nome}</div>
                            <div className="text-[11px] text-[#8FA3BF] font-mono mt-0.5">
                              ID: {item.id}
                            </div>
                          </td>

                          {/* Plano Badge */}
                          <td className="py-4 px-4 align-middle whitespace-nowrap">
                            {getPlanoBadge(item.plano)}
                          </td>

                          {/* Email e Telefone */}
                          <td className="py-4 px-4 align-middle">
                            <div className="text-[#C7D6EA]">{item.email}</div>
                            {item.telefone && (
                              <div className="text-xs text-[#8FA3BF] flex items-center gap-1.5 mt-0.5">
                                <Phone className="w-3 h-3 text-[#00E5FF]" />
                                <span>{item.telefone}</span>
                              </div>
                            )}
                          </td>

                          {/* Data */}
                          <td className="py-4 px-4 align-middle text-xs text-[#C7D6EA] whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#8FA3BF]" />
                              <span>{formatDate(item.created)}</span>
                            </div>
                          </td>

                          {/* Valor */}
                          <td className="py-4 px-4 align-middle whitespace-nowrap font-medium text-white">
                            {item.valor && item.valor > 0
                              ? `R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                              : 'R$ 0,00'}
                          </td>

                          {/* Status Badge */}
                          <td className="py-4 px-4 align-middle whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                itemStatus === 'confirmado'
                                  ? 'bg-[#00E5A8]/15 text-[#00E5A8] border border-[#00E5A8]/30'
                                  : itemStatus === 'cancelado'
                                    ? 'bg-[#FF5C7A]/15 text-[#FF5C7A] border border-[#FF5C7A]/30'
                                    : 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                              }`}
                            >
                              {itemStatus === 'confirmado' && (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              )}
                              {itemStatus === 'cancelado' && <XCircle className="w-3.5 h-3.5" />}
                              {itemStatus === 'pendente' && <Clock className="w-3.5 h-3.5" />}
                              <span className="capitalize">{itemStatus}</span>
                            </span>
                          </td>

                          {/* Ações */}
                          <td className="py-4 px-4 align-middle text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              {itemStatus !== 'confirmado' && (
                                <button
                                  onClick={() => handleUpdateStatus(item.id, 'confirmado')}
                                  disabled={isUpdating}
                                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#00E5A8]/15 hover:bg-[#00E5A8]/25 border border-[#00E5A8]/40 text-xs font-semibold text-[#00E5A8] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                  title="Confirmar pagamento Pix"
                                >
                                  {isUpdating ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  )}
                                  <span>Confirmar</span>
                                </button>
                              )}

                              {itemStatus !== 'cancelado' && (
                                <button
                                  onClick={() => handleUpdateStatus(item.id, 'cancelado')}
                                  disabled={isUpdating}
                                  className="min-h-[44px] px-3.5 py-2 rounded-xl bg-[#FF5C7A]/15 hover:bg-[#FF5C7A]/25 border border-[#FF5C7A]/40 text-xs font-semibold text-[#FF5C7A] transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                                  title="Cancelar inscrição"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Cancelar</span>
                                </button>
                              )}

                              {itemStatus !== 'pendente' && (
                                <button
                                  onClick={() => handleUpdateStatus(item.id, 'pendente')}
                                  disabled={isUpdating}
                                  className="min-h-[44px] px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-[#8FA3BF] hover:text-white transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                                  title="Voltar status para pendente"
                                >
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>Pendente</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Visualização em Cartões para Mobile (Mobile-first) */}
              <div className="md:hidden divide-y divide-white/10">
                {filteredInscricoes.map((item) => {
                  const itemStatus = item.status || 'pendente'
                  const isUpdating = updatingId === item.id

                  return (
                    <div key={item.id} className="p-4 flex flex-col gap-3">
                      {/* Topo do card: Nome, Plano e Status */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold text-white text-base">{item.nome}</div>
                          <div className="text-[11px] text-[#8FA3BF] font-mono">ID: {item.id}</div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                              itemStatus === 'confirmado'
                                ? 'bg-[#00E5A8]/15 text-[#00E5A8] border border-[#00E5A8]/30'
                                : itemStatus === 'cancelado'
                                  ? 'bg-[#FF5C7A]/15 text-[#FF5C7A] border border-[#FF5C7A]/30'
                                  : 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                            }`}
                          >
                            {itemStatus === 'confirmado' && (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            )}
                            {itemStatus === 'cancelado' && <XCircle className="w-3.5 h-3.5" />}
                            {itemStatus === 'pendente' && <Clock className="w-3.5 h-3.5" />}
                            <span className="capitalize">{itemStatus}</span>
                          </span>
                          <div>{getPlanoBadge(item.plano)}</div>
                        </div>
                      </div>

                      {/* Informações detalhadas */}
                      <div className="bg-[#050A15]/60 rounded-xl p-3 flex flex-col gap-1.5 text-xs">
                        <div className="flex items-center justify-between text-[#C7D6EA]">
                          <span className="text-[#8FA3BF]">Plano:</span>
                          <span className="font-bold text-white uppercase">
                            {item.plano || '-'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[#C7D6EA]">
                          <span className="text-[#8FA3BF]">E-mail:</span>
                          <span className="font-medium truncate max-w-[200px]">{item.email}</span>
                        </div>
                        {item.telefone && (
                          <div className="flex items-center justify-between text-[#C7D6EA]">
                            <span className="text-[#8FA3BF]">WhatsApp:</span>
                            <span className="font-medium">{item.telefone}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-[#C7D6EA]">
                          <span className="text-[#8FA3BF]">Data de cadastro:</span>
                          <span>{formatDate(item.created)}</span>
                        </div>
                        <div className="flex items-center justify-between text-[#C7D6EA]">
                          <span className="text-[#8FA3BF]">Valor:</span>
                          <span className="font-bold text-white">
                            {item.valor && item.valor > 0
                              ? `R$ ${item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                              : 'R$ 0,00'}
                          </span>
                        </div>
                      </div>

                      {/* Ações em Botões Grandes (mínimo 44px altura) */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {itemStatus !== 'confirmado' ? (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'confirmado')}
                            disabled={isUpdating}
                            className="min-h-[44px] px-3 py-2.5 rounded-xl bg-[#00E5A8] hover:bg-[#00D098] text-[#050A15] font-sora font-bold text-xs tracking-wide shadow-[0_4px_15px_rgba(0,229,168,0.25)] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            {isUpdating ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4" />
                            )}
                            <span>Confirmar Pix</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'pendente')}
                            disabled={isUpdating}
                            className="min-h-[44px] px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#C7D6EA] font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Clock className="w-4 h-4" />
                            <span>Pendente</span>
                          </button>
                        )}

                        {itemStatus !== 'cancelado' ? (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'cancelado')}
                            disabled={isUpdating}
                            className="min-h-[44px] px-3 py-2.5 rounded-xl bg-[#FF5C7A]/20 hover:bg-[#FF5C7A]/30 border border-[#FF5C7A]/40 text-[#FF5C7A] font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Cancelar</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'pendente')}
                            disabled={isUpdating}
                            className="min-h-[44px] px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#C7D6EA] font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Clock className="w-4 h-4" />
                            <span>Reabrir</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
