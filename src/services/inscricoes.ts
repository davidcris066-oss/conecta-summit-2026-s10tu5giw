import pb from '@/lib/pocketbase/client'

export type InscricaoStatus = 'pendente' | 'confirmado' | 'cancelado'
export type InscricaoPlano = 'vip' | 'premium' | 'start'

export interface InscricaoRecord {
  id: string
  nome: string
  email: string
  telefone?: string
  status?: InscricaoStatus
  valor?: number
  plano?: InscricaoPlano | string
  created: string
  updated: string
}

export async function loginAdmin(email: string, password: string) {
  return await pb.collection('users').authWithPassword(email.trim().toLowerCase(), password)
}

export function logoutAdmin() {
  pb.authStore.clear()
}

export function isUserAdminAuthenticated(): boolean {
  return pb.authStore.isValid && !!pb.authStore.record
}

export function getCurrentAdminUser() {
  return pb.authStore.record
}

export async function fetchInscricoes(): Promise<InscricaoRecord[]> {
  const records = await pb.collection('inscricoes').getFullList<InscricaoRecord>({
    sort: '-created',
  })
  return records
}

export async function updateInscricaoStatus(
  id: string,
  status: InscricaoStatus,
): Promise<InscricaoRecord> {
  const updated = await pb.collection('inscricoes').update<InscricaoRecord>(id, {
    status,
  })
  return updated
}
