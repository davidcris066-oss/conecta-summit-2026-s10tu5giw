import { describe, it, expect } from 'vitest'
import { BANK_DETAILS, getOfficialPixPayload, crc16Ccitt } from './pix'
import { createQrMatrix } from './qrCode'

describe('PIX e QR Code', () => {
  it('gera payload Pix válido com dados oficiais do Sicredi', () => {
    const payload = getOfficialPixPayload(0)
    expect(payload).toContain('04538229000135')
    expect(payload).toContain('ASSOCIACAO EMP INDUSTRIAL DE')
    expect(payload).toContain('ITAITUBA')
    expect(payload.startsWith('000201')).toBe(true)
    expect(payload).toContain('6304')
    // Verifica CRC
    const crc = payload.slice(-4)
    const body = payload.slice(0, -4)
    expect(crc16Ccitt(body)).toBe(crc)
  })

  it('gera matriz de QR Code para o payload Pix sem erros', () => {
    const payload = getOfficialPixPayload(0)
    const matrix = createQrMatrix(payload)
    expect(matrix).toBeDefined()
    expect(matrix.length).toBeGreaterThan(20)
    expect(matrix[0].length).toBe(matrix.length)
  })
})
