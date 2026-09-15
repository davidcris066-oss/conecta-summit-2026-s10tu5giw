import { describe, it, expect } from 'vitest'
import { BANK_DETAILS, getOfficialPixPayload, crc16Ccitt, TICKET_TIERS } from './pix'
import { createQrMatrix } from './qrCode'

describe('PIX e QR Code', () => {
  it('gera payload Pix válido com dados oficiais do Sicredi sem valor', () => {
    const payload = getOfficialPixPayload(0)
    expect(payload).toContain('04538229000135')
    expect(payload).toContain('ASSOCIACAO EMP INDUSTRIAL DE')
    expect(payload).toContain('ITAITUBA')
    expect(payload.startsWith('000201')).toBe(true)
    expect(payload).toContain('6304')
    expect(payload).not.toContain('5407')
    // Verifica CRC
    const crc = payload.slice(-4)
    const body = payload.slice(0, -4)
    expect(crc16Ccitt(body)).toBe(crc)
  })

  it('gera payload Pix com valor fixo para o plano VIP (R$ 3.435,05)', () => {
    const payload = getOfficialPixPayload(TICKET_TIERS.vip.price)
    // ID 54 com valor "3435.05" -> 54073435.05
    expect(payload).toContain('54073435.05')
    expect(payload).toContain('5303986') // BRL
    expect(payload).toContain('04538229000135')
    expect(payload.startsWith('000201')).toBe(true)

    const crc = payload.slice(-4)
    const body = payload.slice(0, -4)
    expect(crc16Ccitt(body)).toBe(crc)
  })

  it('gera payload Pix com valor fixo para o plano Premium (R$ 3.091,55)', () => {
    const payload = getOfficialPixPayload(TICKET_TIERS.premium.price)
    expect(payload).toContain('54073091.55')
    const crc = payload.slice(-4)
    const body = payload.slice(0, -4)
    expect(crc16Ccitt(body)).toBe(crc)
  })

  it('gera payload Pix com valor fixo para o plano Start (R$ 2.919,79)', () => {
    const payload = getOfficialPixPayload(TICKET_TIERS.start.price)
    expect(payload).toContain('54072919.79')
    const crc = payload.slice(-4)
    const body = payload.slice(0, -4)
    expect(crc16Ccitt(body)).toBe(crc)
  })

  it('gera matriz de QR Code para os payloads Pix dos planos', () => {
    const payloadVip = getOfficialPixPayload(TICKET_TIERS.vip.price)
    const matrix = createQrMatrix(payloadVip)
    expect(matrix).toBeDefined()
    expect(matrix.length).toBeGreaterThan(20)
    expect(matrix[0].length).toBe(matrix.length)
  })
})
