/**
 * Utilitários para geração de PIX Estático no padrão EMV BR Code (Banco Central do Brasil)
 *
 * Especificações:
 * - ID 00: Payload Format Indicator (01)
 * - ID 01: Point of Initiation Method (12 = estático)
 * - ID 26: Merchant Account Information
 *     00: GUI (br.gov.bcb.pix)
 *     01: Chave PIX
 * - ID 52: Merchant Category Code (0000)
 * - ID 53: Transaction Currency (986 = BRL)
 * - ID 54: Transaction Amount (opcional em Pix estático; se fornecido, ex: "150.00")
 * - ID 58: Country Code (BR)
 * - ID 59: Merchant Name (máx 25 caracteres recomendados, sem acentos no EMV padrão)
 * - ID 60: Merchant City (máx 15 caracteres recomendados, sem acentos)
 * - ID 62: Additional Data Field Template
 *     05: Reference Label / TxID (máx 25 chars, ex: "***" ou identificador)
 * - ID 63: CRC16 (4 hex maiúsculos)
 */

export interface PixConfig {
  key: string
  merchantName: string
  merchantCity: string
  amount?: number
  txId?: string
}

export const BANK_DETAILS = {
  bank: '748 - Banco Cooperativo Sicredi S.A. - Bansicredi',
  agency: '0818',
  account: '60433-1',
  legalName: 'ASSOCIACAO EMP INDUSTRIAL DE ITAITUBA - ASEII',
  cnpj: '04.538.229/0001-35',
  pixKeyClean: '04538229000135',
  merchantName: 'ASSOCIACAO EMP INDUSTRIAL DE ITAITUBA',
  merchantCity: 'ITAITUBA',
} as const

/**
 * Preço do ingresso em Reais.
 * Se 0 ou indefinido, o usuário insere o valor no aplicativo do banco e o payload PIX é gerado sem valor fixo.
 * Quando o valor for definido oficialmente pela organização, basta atualizar esta constante (ex.: 150.00).
 */
export const TICKET_PRICE: number = 0

function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
}

function formatEmvField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0')
  return `${id}${len}${value}`
}

/**
 * Cálculo de CRC16-CCITT (Polinômio 0x1021, valor inicial 0xFFFF) conforme manual BR Code do Banco Central.
 */
export function crc16Ccitt(str: string): string {
  let crc = 0xffff
  const polynomial = 0x1021

  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let bit = 0; bit < 8; bit++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xffff
      } else {
        crc = (crc << 1) & 0xffff
      }
    }
  }

  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0')
}

/**
 * Gera a string Pix Copia e Cola no padrão BR Code do Banco Central.
 */
export function generatePixPayload(config: PixConfig): string {
  const cleanKey = config.key.replace(/[^\w@.+]/g, '')
  const cleanName = removeAccents(config.merchantName).slice(0, 25)
  const cleanCity = removeAccents(config.merchantCity).slice(0, 15)
  const txId =
    (config.txId ? removeAccents(config.txId).replace(/[^A-Z0-9]/g, '') : '***').slice(0, 25) ||
    '***'

  // ID 26: Merchant Account Information
  const gui = formatEmvField('00', 'br.gov.bcb.pix')
  const key = formatEmvField('01', cleanKey)
  const merchantAccountInfo = formatEmvField('26', `${gui}${key}`)

  // ID 00 e ID 01
  const payloadFormat = formatEmvField('00', '01')
  const pointOfInitiation = formatEmvField('01', '12') // 12 = Estático

  // ID 52: MCC
  const mcc = formatEmvField('52', '0000')

  // ID 53: Moeda 986 = BRL
  const currency = formatEmvField('53', '986')

  // ID 54: Valor (opcional no BR Code estático)
  let amountField = ''
  if (config.amount && config.amount > 0) {
    amountField = formatEmvField('54', config.amount.toFixed(2))
  }

  // ID 58: País
  const country = formatEmvField('58', 'BR')

  // ID 59: Nome do recebedor
  const name = formatEmvField('59', cleanName)

  // ID 60: Cidade
  const city = formatEmvField('60', cleanCity)

  // ID 62: Campo adicional / TxID
  const additionalData = formatEmvField('62', formatEmvField('05', txId))

  // ID 63: Início do checksum
  const payloadWithoutCrc = `${payloadFormat}${pointOfInitiation}${merchantAccountInfo}${mcc}${currency}${amountField}${country}${name}${city}${additionalData}6304`

  const crc = crc16Ccitt(payloadWithoutCrc)

  return `${payloadWithoutCrc}${crc}`
}

/**
 * Cria o payload oficial do Conecta Summit 2026 com base nos dados bancários fornecidos.
 */
export function getOfficialPixPayload(amount: number = TICKET_PRICE, txId?: string): string {
  return generatePixPayload({
    key: BANK_DETAILS.pixKeyClean,
    merchantName: BANK_DETAILS.merchantName,
    merchantCity: BANK_DETAILS.merchantCity,
    amount: amount > 0 ? amount : undefined,
    txId: txId || 'CONECTA2026',
  })
}
