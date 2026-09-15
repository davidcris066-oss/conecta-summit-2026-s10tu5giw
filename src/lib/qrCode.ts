/**
 * Gerador leve de QR Code SVG sem dependências externas pesadas.
 * Implementação baseada na especificação QR Code Modelo 2.
 */

// Tabela de caracteres alfanuméricos e codificação Byte (UTF-8/ISO-8859-1)
// Para robustez e simplicidade de manutenção no React, geramos a matriz através de um algoritmo direto de QR Code Byte mode (versão 1 a 10).

type Matrix = boolean[][]

// Reed-Solomon Galois Field GF(256) com primitiva 0x11d
const GF256_EXP = new Uint8Array(512)
const GF256_LOG = new Uint8Array(256)

let x = 1
for (let i = 0; i < 255; i++) {
  GF256_EXP[i] = x
  GF256_EXP[i + 255] = x
  GF256_LOG[x] = i
  x = (x << 1) ^ (x & 0x80 ? 0x11d : 0)
}

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0
  return GF256_EXP[GF256_LOG[a] + GF256_LOG[b]]
}

function rsGeneratorPoly(degree: number): Uint8Array {
  const poly = new Uint8Array(degree + 1)
  poly[0] = 1
  for (let i = 0; i < degree; i++) {
    const factor = GF256_EXP[i]
    for (let j = i + 1; j > 0; j--) {
      poly[j] = poly[j] ^ gfMul(poly[j - 1], factor)
    }
  }
  return poly
}

function rsCompute(data: Uint8Array, ecCount: number): Uint8Array {
  const gen = rsGeneratorPoly(ecCount)
  const remainder = new Uint8Array(ecCount)

  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ remainder[0]
    for (let j = 0; j < ecCount - 1; j++) {
      remainder[j] = remainder[j + 1] ^ gfMul(gen[j + 1], factor)
    }
    remainder[ecCount - 1] = gfMul(gen[ecCount], factor)
  }

  return remainder
}

// Capacidades de dados para QR Code Nível L (Baixo - 7% correção, ideal para Pix pois maximiza espaço)
// Versões 1 a 14 suportadas (Pix payload tem aprox 120-180 caracteres, encaixando bem nas versões 5 a 8)
const VERSION_SPECS = [
  null,
  { version: 1, totalBytes: 26, ecBytes: 7, dataBytes: 19, blocks: [[19, 7]] },
  { version: 2, totalBytes: 44, ecBytes: 10, dataBytes: 34, blocks: [[34, 10]] },
  { version: 3, totalBytes: 70, ecBytes: 15, dataBytes: 55, blocks: [[55, 15]] },
  { version: 4, totalBytes: 100, ecBytes: 20, dataBytes: 80, blocks: [[80, 20]] },
  { version: 5, totalBytes: 134, ecBytes: 26, dataBytes: 108, blocks: [[108, 26]] },
  {
    version: 6,
    totalBytes: 172,
    ecBytes: 18,
    dataBytes: 136,
    blocks: [
      [68, 18],
      [68, 18],
    ],
  },
  {
    version: 7,
    totalBytes: 196,
    ecBytes: 20,
    dataBytes: 156,
    blocks: [
      [78, 20],
      [78, 20],
    ],
  },
  {
    version: 8,
    totalBytes: 242,
    ecBytes: 24,
    dataBytes: 194,
    blocks: [
      [97, 24],
      [97, 24],
    ],
  },
  {
    version: 9,
    totalBytes: 292,
    ecBytes: 30,
    dataBytes: 232,
    blocks: [
      [116, 30],
      [116, 30],
    ],
  },
  {
    version: 10,
    totalBytes: 346,
    ecBytes: 18,
    dataBytes: 274,
    blocks: [
      [68, 18],
      [68, 18],
      [69, 18],
      [69, 18],
    ],
  },
  {
    version: 11,
    totalBytes: 404,
    ecBytes: 20,
    dataBytes: 324,
    blocks: [
      [81, 20],
      [81, 20],
      [81, 20],
      [81, 20],
    ],
  },
  {
    version: 12,
    totalBytes: 466,
    ecBytes: 24,
    dataBytes: 370,
    blocks: [
      [92, 24],
      [92, 24],
      [93, 24],
      [93, 24],
    ],
  },
]

const ALIGNMENT_PATTERN_POSITIONS = [
  [],
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
  [6, 30, 54],
  [6, 32, 58],
]

function getBestVersion(dataLength: number): (typeof VERSION_SPECS)[number] {
  for (let v = 1; v < VERSION_SPECS.length; v++) {
    const spec = VERSION_SPECS[v]
    if (!spec) continue
    // Byte mode overhead: 4 bits mode + (v <= 9 ? 8 : 16) bits length
    const overheadBits = 4 + (v <= 9 ? 8 : 16)
    const requiredBytes = Math.ceil((dataLength * 8 + overheadBits) / 8)
    if (spec.dataBytes >= requiredBytes) {
      return spec
    }
  }
  return VERSION_SPECS[VERSION_SPECS.length - 1]
}

export function createQrMatrix(text: string): Matrix {
  const textBytes = new TextEncoder().encode(text)
  const spec = getBestVersion(textBytes.length)
  if (!spec) throw new Error('Dados muito longos para o QR Code.')

  const version = spec.version
  const size = 17 + 4 * version

  // 1. Matriz e mapa de ocupação
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false))
  const isReserved: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false))

  const markReserved = (r: number, c: number, val: boolean) => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      matrix[r][c] = val
      isReserved[r][c] = true
    }
  }

  // 2. Finder patterns (7x7) nos cantos: top-left, top-right, bottom-left
  const addFinder = (top: number, left: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6
        const isCore = r >= 2 && r <= 4 && c >= 2 && c <= 4
        markReserved(top + r, left + c, isBorder || isCore)
      }
    }
    // Separators
    for (let i = -1; i <= 7; i++) {
      markReserved(top - 1, left + i, false)
      markReserved(top + 7, left + i, false)
      markReserved(top + i, left - 1, false)
      markReserved(top + i, left + 7, false)
    }
  }

  addFinder(0, 0)
  addFinder(0, size - 7)
  addFinder(size - 7, 0)

  // 3. Timing patterns
  for (let i = 8; i < size - 8; i++) {
    const val = i % 2 === 0
    markReserved(6, i, val)
    markReserved(i, 6, val)
  }

  // Dark module
  markReserved(4 * version + 9, 8, true)

  // 4. Alignment patterns
  const alignCoords = ALIGNMENT_PATTERN_POSITIONS[version] || []
  for (const r of alignCoords) {
    for (const c of alignCoords) {
      // Don't overlap with finder patterns
      const isTopLeft = r < 9 && c < 9
      const isTopRight = r < 9 && c > size - 9
      const isBottomLeft = r > size - 9 && c < 9
      if (isTopLeft || isTopRight || isBottomLeft) continue

      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const isOuter = Math.abs(dr) === 2 || Math.abs(dc) === 2
          const isCenter = dr === 0 && dc === 0
          markReserved(r + dr, c + dc, isOuter || isCenter)
        }
      }
    }
  }

  // 5. Reserve format info areas
  for (let i = 0; i < 9; i++) {
    if (!isReserved[8][i]) isReserved[8][i] = true
    if (!isReserved[i][8]) isReserved[i][8] = true
  }
  for (let i = size - 8; i < size; i++) {
    if (!isReserved[8][i]) isReserved[8][i] = true
    if (!isReserved[i][8]) isReserved[i][8] = true
  }

  // 6. Encode data
  const bits: number[] = []
  // Mode indicator: 0100 for Byte
  bits.push(0, 1, 0, 0)

  // Character count
  const lenBits = version <= 9 ? 8 : 16
  for (let i = lenBits - 1; i >= 0; i--) {
    bits.push((textBytes.length >> i) & 1)
  }

  // Data bytes
  for (let i = 0; i < textBytes.length; i++) {
    const byte = textBytes[i]
    for (let b = 7; b >= 0; b--) {
      bits.push((byte >> b) & 1)
    }
  }

  // Terminator (up to 4 zeroes)
  const maxDataBits = spec.dataBytes * 8
  const terminatorLen = Math.min(4, maxDataBits - bits.length)
  for (let i = 0; i < terminatorLen; i++) bits.push(0)

  // Align to byte
  while (bits.length % 8 !== 0) bits.push(0)

  // Pad bytes 0xEC (236) and 0x11 (17)
  const padBytes = [0xec, 0x11]
  let padIdx = 0
  while (bits.length < maxDataBits) {
    const pad = padBytes[padIdx++ % 2]
    for (let b = 7; b >= 0; b--) {
      bits.push((pad >> b) & 1)
    }
  }

  // Assemble data bytes
  const dataBytesArray = new Uint8Array(spec.dataBytes)
  for (let i = 0; i < spec.dataBytes; i++) {
    let val = 0
    for (let b = 0; b < 8; b++) {
      val = (val << 1) | bits[i * 8 + b]
    }
    dataBytesArray[i] = val
  }

  // Error Correction calculation per block
  const ecBlocks: Uint8Array[] = []
  const dataBlocks: Uint8Array[] = []
  let offset = 0
  for (const [dLen, ecLen] of spec.blocks) {
    const dBlock = dataBytesArray.subarray(offset, offset + dLen)
    offset += dLen
    dataBlocks.push(dBlock)
    ecBlocks.push(rsCompute(dBlock, ecLen))
  }

  // Interleave data and EC
  const finalSequence: number[] = []
  const maxDLen = Math.max(...spec.blocks.map((b) => b[0]))
  for (let i = 0; i < maxDLen; i++) {
    for (const b of dataBlocks) {
      if (i < b.length) finalSequence.push(b[i])
    }
  }
  const maxEcLen = spec.blocks[0][1]
  for (let i = 0; i < maxEcLen; i++) {
    for (const b of ecBlocks) {
      if (i < b.length) finalSequence.push(b[i])
    }
  }

  // Convert to bit stream
  const allBits: number[] = []
  for (const byte of finalSequence) {
    for (let b = 7; b >= 0; b--) {
      allBits.push((byte >> b) & 1)
    }
  }

  // 7. Place data bits (zigzag right-to-left, bottom-to-top)
  let bitIdx = 0
  let upward = true
  for (let right = size - 1; right > 0; right -= 2) {
    if (right === 6) right-- // Skip vertical timing column

    const rows = upward
      ? Array.from({ length: size }, (_, i) => size - 1 - i)
      : Array.from({ length: size }, (_, i) => i)

    for (const r of rows) {
      for (const c of [right, right - 1]) {
        if (!isReserved[r][c]) {
          const bitVal = bitIdx < allBits.length ? allBits[bitIdx++] : 0
          // Apply mask 0: (row + col) % 2 === 0
          const mask = (r + c) % 2 === 0
          matrix[r][c] = (bitVal === 1) !== mask
        }
      }
    }
    upward = !upward
  }

  // 8. Format Information (Level L, Mask 0: 00 000 => 0b00000)
  // Format bit string with BCH (15, 5) code for (Level L, Mask 0) XORed with 0x5412 is: 111011111000100
  const formatString = '111011111000100'
  for (let i = 0; i < 15; i++) {
    const val = formatString[i] === '1'
    if (i <= 5) matrix[8][i] = val
    else if (i === 6) matrix[8][7] = val
    else if (i === 7) matrix[8][8] = val
    else if (i === 8) matrix[7][8] = val
    else matrix[14 - i][8] = val
  }

  for (let i = 0; i < 15; i++) {
    const val = formatString[i] === '1'
    if (i < 8) matrix[size - 1 - i][8] = val
    else matrix[8][size - 15 + i] = val
  }

  return matrix
}
